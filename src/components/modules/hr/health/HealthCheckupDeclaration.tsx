"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Box, Grid2 } from "@mui/material";
import { Description, ButtonGroup, showActionAlert, InputField } from "@/components/ui";
import FileUploadManager from "@/components/ui/file-upload-v3/FileUploadManager";
import {
  FormContainer,
  SectionHeader,
  SectionContent,
  EmployeeInfoContainer,
  InfoLabel,
  InfoValue,
  MARGINTOP,
  MARGINTOP2,
  STYLE,
} from "@/styles/modules/hr/healthDeclaration";
import {
  HealthCheckupFormData,
  DocumentStructure,
  UploadSections,
  FileInfo,
  SectionConfig,
} from "@/types/modules/hr/healthTypes";
import { FileData } from "@/types/components/ui/fileUploadV3";
import { useHealthCheckupDataById, useDepartmentData } from "@/hooks/modules/hr/useHealthCheckup";
import { magicFormSave, KeysInterface } from "@/lib/utils/magicSave";
import magicSaveConstants from "@/constants/magicSave";
import { formatValue, mergeFinalFileData, formatDateForAPI, FinalFileData } from "@/lib/utils/common";
import {
  CREATE,
  CANCEL,
  COMMUNICABLE,
  COMMUNICABLE_DISEASE,
  COMMUNICABLE_ERROR,
  COMMUNICABLE_FIELD_NAME,
  CONTAINER_ID,
  DATA_FIELD_NAME,
  DATA_SOURCE_NAME,
  EDIT,
  EMPLOYEE_ID,
  EMPLOYEE_NAME,
  ENTER_DESCRIPTION,
  EYE,
  EYE_TEST,
  EYE_TEST_DESC,
  EYE_TEST_ERROR,
  FAILED,
  ID,
  INSERT,
  LABELS,
  PATHNAME2,
  NA,
  PLACE_HOLDER,
  RESPONSE_KEYS,
  safeInitialFormData,
  SAVE,
  sectionErrorMap,
  SUCCESS,
  UNKNOWN_DEPARTMENT,
  UPDATE,
  UPLOAD,
  VACCINATIONS,
  VACCINATIONS_ERROR,
  VACCINATIONS_FIELD_NAME,
  VACCINE,
  VALUE,
  SECTION_HEADERS, ACTIVE_ONE, HEALTH_CHECKUP_ERROR
} from "@/constants/modules/hr/healthCheckup";
import { FINALFILEINITIALDATA, NUMBERMAP } from "@/constants/common";
import { useListWorkflowEmployes } from "@/hooks/modules/hr/useEmployeeList";
import { CommonInlineStyles } from "@/styles/common";
import { useQueryClient } from "@tanstack/react-query";
import GlobalLoader from "@/components/shared/LoadingSpinner";
import { useDraftSave } from "@/hooks/common/useDraftSave";
import DraftLoading from "@/components/ui/draft-loader/DraftLoader";
import { prepareDraftDocumentsGeneric, DraftDocumentsConfig } from "@/lib/utils/modules/hr/draftDocumentsCommon";
import {
  extractPreservedDocumentIds,
  filterDocumentsToDelete,
  filterNestedUpdateMetaData
} from '@/lib/utils/modules/hr/preservedDocumentsFilter'
import { isAnyLoading } from "@/lib/modules/hr/candidateEvaluation";

/**
 * Classification: confidential
 */

const getCurrentDate = () => formatDateForAPI(new Date());

const SECTIONS: SectionConfig[] = [
  { key: EYE_TEST, header: SECTION_HEADERS.EYE_TEST, errorKey: EYE_TEST_ERROR, fieldName: EYE_TEST_DESC, tableName: EYE },
  { key: COMMUNICABLE_DISEASE, header: SECTION_HEADERS.COMMUNICABLE_DISEASE, errorKey: COMMUNICABLE_ERROR, fieldName: COMMUNICABLE_FIELD_NAME, tableName: COMMUNICABLE },
  { key: VACCINATIONS, header: SECTION_HEADERS.VACCINATIONS, errorKey: VACCINATIONS_ERROR, fieldName: VACCINATIONS_FIELD_NAME, tableName: VACCINE },
];

const SectionForm: React.FC<{
  section: SectionConfig;
  formData: HealthCheckupFormData;
  errors: Record<string, string>;
  isDisabled: boolean;
  handleDescriptionChange: (section: keyof Omit<HealthCheckupFormData, 'employeeInfo'>, value: string) => void;
  handleFileUpload: (section: keyof Omit<HealthCheckupFormData, 'employeeInfo'>, fileData: FileData) => void;
  handleFileEdit: (section: keyof Omit<HealthCheckupFormData, 'employeeInfo'>, fileData: FileData) => void;
  handleFileSubmit: (section: keyof Omit<HealthCheckupFormData, 'employeeInfo'>, data: DocumentStructure) => void;
}> = ({
  section,
  formData,
  errors,
  isDisabled,
  handleDescriptionChange,
  handleFileUpload,
  handleFileEdit,
  handleFileSubmit,
}) => {
    return (
      <Box>
        <SectionHeader>{section.header}</SectionHeader>
        <SectionContent>
          <Grid2 container spacing={NUMBERMAP.TWO}>
            <Grid2 size={NUMBERMAP.SIX}>
              <Description
                placeholder={ENTER_DESCRIPTION}
                value={formData[section.key].description ?? ""}
                onChange={(value) => handleDescriptionChange(section.key, value)}
                error={errors[section.errorKey]}
                dataSourceName={DATA_SOURCE_NAME}
                dataFieldName={section.fieldName}
                disabled={isDisabled}
              />
            </Grid2>
          </Grid2>
          <Grid2 container spacing={NUMBERMAP.TWO} sx={MARGINTOP2}>
            <Grid2 size={NUMBERMAP.TWELVE}>
              <Box>
                <FileUploadManager
                  subHeader={UPLOAD}
                  key={`${section.key}`}
                  initialFiles={formData[section.key].files ?? []}
                  onFileUpload={(fileData) => handleFileUpload(section.key, fileData)}
                  onFileEdit={(fileData) => handleFileEdit(section.key, fileData)}
                  onSubmit={(data) => handleFileSubmit(section.key, data)}
                  uploadMandError={''}
                />
              </Box>
            </Grid2>
          </Grid2>
        </SectionContent>
      </Box>
    );
  };

const HealthCheckupDeclaration: React.FC = () => {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement | null>(null);
  const params = useParams();
  const id = params.id as string;
  const mode = id === CREATE ? CREATE : EDIT;
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<HealthCheckupFormData>(safeInitialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  // Create a separate state for file submissions
  const [fileSubmissions, setFileSubmissions] = useState<Record<UploadSections, DocumentStructure>>({
    eyeTest: FINALFILEINITIALDATA,
    communicableDisease: FINALFILEINITIALDATA,
    vaccinations: FINALFILEINITIALDATA,
  });
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");
  const [draftDocuments, setDraftDocuments] = useState<Record<string, any[]>>({});
  const [draftDelete, setDraftDelete] = useState<string[]>([]);

  // Health checkup draft configuration for three file sections
  const HEALTH_CHECKUP_DRAFT_CONFIG: DraftDocumentsConfig = {
    fileFieldToSectionMap: {
      'eyeTest': 'eyeTest',
      'communicableDisease': 'communicableDisease',
      'vaccinations': 'vaccinations',
    },
    sectionTypeToNameMap: {
      'eyeTest': 'eyeTest',
      'communicableDisease': 'communicableDisease',
      'vaccinations': 'vaccinations',
    },
    responseDataKeyMap: {
      'eyeTest': EYE,
      'communicableDisease': COMMUNICABLE,
      'vaccinations': VACCINE,
    },
  }

  const isAddMode = mode === CREATE;
  const healthCheckupId = isAddMode ? null : parseInt(id);

  const { draftSave, clearDraftSave, isDraftSaving, isFetchingDraft, draftData, fetchDraft, checkUnsavedDraftBeforeLeave } = useDraftSave({
    context_type: 'health_checkup_declaration',
    context_instance_id: healthCheckupId,
    enableFetch: false
  });

  const { data: employeeResponse, refetch } = useListWorkflowEmployes(ACTIVE_ONE, 'Approved');
  const { data: healthCheckupData, isFetching: isLoading, error: healthCheckupError, refetch: fetchById } = useHealthCheckupDataById(
    mode === EDIT && id && !isNaN(parseInt(id)) ? id : undefined
  );
  const { data: departmentData, isLoading: isDepartmentLoading } = useDepartmentData();

  const isDisabled = isLoading ?? isDepartmentLoading;

  const handleDraftSave = (EmployeeId: number, formData: HealthCheckupFormData, fileSubmissionsData: Record<UploadSections, DocumentStructure>) => {
    // Convert DocumentStructure to FinalFileData for the generic utility
    const eyeTestFileData = fileSubmissionsData.eyeTest as unknown as FinalFileData
    const communicableFileData = fileSubmissionsData.communicableDisease as unknown as FinalFileData
    const vaccinationFileData = fileSubmissionsData.vaccinations as unknown as FinalFileData

    // Prepare final documents object with all three sections
    const finalDocuments = {
      eyeTest: eyeTestFileData ?? FINALFILEINITIALDATA,
      communicableDisease: communicableFileData ?? FINALFILEINITIALDATA,
      vaccinations: vaccinationFileData ?? FINALFILEINITIALDATA,
    }

    // Use the generic utility function for multiple file sections
    const draftPreparation = prepareDraftDocumentsGeneric(
      draftDocuments,
      draftDelete,
      formData,
      finalDocuments,
      draftData,
      HEALTH_CHECKUP_DRAFT_CONFIG
    )

    if (draftPreparation.draftDocuments) {
      setDraftDocuments(draftPreparation.draftDocuments)
    }
    if (draftPreparation.draftDelete) {
      setDraftDelete(draftPreparation.draftDelete)
    }

    // Extract drafted documents from draftDocuments
    const extractedEyeTestDocs = draftPreparation.draftDocuments['eyeTest'] ?? []
    const extractedCommunicableDocs = draftPreparation.draftDocuments['communicableDisease'] ?? []
    const extractedVaccinationDocs = draftPreparation.draftDocuments['vaccinations'] ?? []
    const { vaccinations, communicableDisease, eyeTest, ...rest } = formData
    const payload = {
      health_checkup_id: healthCheckupId ?? new Date().getTime(),
      ...rest,
      eyeTest: {
        description: eyeTest.description,
      },
      communicableDisease: {
        description: communicableDisease.description,
      },
      vaccinations: {
        description: vaccinations.description,
      },
      employeeId: EmployeeId,
      type: 'draft',
      documents: draftData?.data?.documents ?? [],
      draftDelete: draftPreparation.draftDelete,
      draftDocuments: {
        eyeTest: extractedEyeTestDocs,
        communicableDisease: extractedCommunicableDocs,
        vaccinations: extractedVaccinationDocs,
      },
    }

    // Collect all documents_to_create from all sections
    const allDocumentsToCreate = [
      ...(eyeTestFileData?.documents_to_create ?? []),
      ...(communicableFileData?.documents_to_create ?? []),
      ...(vaccinationFileData?.documents_to_create ?? []),
    ]
    draftSave({
      form_type: 'health_checkup',
      form_data: payload,
      upload_documents: {
        documents_to_create: allDocumentsToCreate,
        create_meta_data: draftPreparation.createMetaData,
        update_meta_data: draftPreparation.updateMetaData,
        deleteDraftDocuments: draftPreparation?.documentsToDelete,
        documents_to_preserve: draftPreparation?.documentsToPreserve ?? [],
      },
      timestamp: new Date().toISOString(),
    })
  }

  const updateEmployeeInfo = useCallback(
    (employeeId: number) => {
      const selectedEmployee = employeeResponse?.data?.find((emp: any) => emp.id === employeeId);
      setFormData((prev) => ({
        ...prev,
        employeeInfo: {
          name: selectedEmployee?.employee_name ?? NA,
          role: selectedEmployee?.role_name ?? NA,
          department: selectedEmployee?.department_name ?? NA,
          lastSubmittedDate: prev.employeeInfo.lastSubmittedDate ?? getCurrentDate(),
        },
      }));
    },
    [employeeResponse]
  );

  const handleEmployeeChange = useCallback(
    (employeeId: string) => {
      setSelectedEmployeeId(employeeId);
      updateEmployeeInfo(Number(employeeId));
      if (errors[EMPLOYEE_ID]) {
        setErrors((prev) => ({ ...prev, [EMPLOYEE_ID]: "" }));
      }
      handleDraftSave(employeeId, formData, fileSubmissions);
    },
    [errors, updateEmployeeInfo]
  );

  useEffect(() => {
    if (mode === EDIT && healthCheckupData?.data?.[0] && !draftData?.data) {
      const healthCheckup = healthCheckupData.data[0];
      const department = departmentData?.data?.find(
        (dept) => dept.department_id === healthCheckup.employee_department_id
      );
      const employee = employeeResponse?.data?.find(
        (emp: any) => emp?.employee_name.trim().toLowerCase() === healthCheckup?.employee_name.trim().toLowerCase()
      );

      setSelectedEmployeeId(employee?.id.toString() ?? "");
      setFormData({
        employeeInfo: {
          name: healthCheckup?.employee_name ?? NA,
          role: healthCheckup.employee_role_id ? `${healthCheckup.employee_role_name}` : NA,
          department: department?.department_name ?? UNKNOWN_DEPARTMENT,
          lastSubmittedDate: getCurrentDate(),
        },
        eyeTest: {
          description: healthCheckup.eye_test_description ?? "",
          files: healthCheckup.eye_test_supporting_document,
        },
        communicableDisease: {
          description: healthCheckup.communicable_disease_description ?? "",
          files: healthCheckup.communicable_disease_supporting_document,
        },
        vaccinations: {
          description: healthCheckup.vaccinations_description ?? "",
          files: healthCheckup.vaccination_supporting_document,
        },
      });
    } else if (mode === CREATE) {
      const employee = employeeResponse?.data?.find(
        (emp: any) => emp?.id == selectedEmployeeId
      );
      setSelectedEmployeeId(employee?.id.toString() ?? "");
      setFormData((prev) => ({
        ...prev,
        employeeInfo: {
          name: employee?.employee_name ?? NA,
          role: employee?.role_name ?? NA,
          department: employee?.department_name ?? NA,
          lastSubmittedDate: getCurrentDate(),
        },
      }));
      if (employee) updateEmployeeInfo(employee?.id);
    }
  }, [healthCheckupData, departmentData, mode, employeeResponse, healthCheckupError, id, updateEmployeeInfo]);

  useEffect(() => {
    setTimeout(() => {
      setFormData(safeInitialFormData)
      setFileSubmissions({
        eyeTest: FINALFILEINITIALDATA,
        communicableDisease: FINALFILEINITIALDATA,
        vaccinations: FINALFILEINITIALDATA,
      })
      setDraftDocuments({})
      setDraftDelete([])
    }, NUMBERMAP.ZERO)
    fetchDraft();
    refetch()
    refetchHealthCheckup()
  }, [mode]);

  const refetchHealthCheckup = () => {
    if (healthCheckupId != null) {
      fetchById()
    }
  }

  useEffect(() => {
    if (draftData?.data) {
      setFormData(safeInitialFormData)
      setFileSubmissions({
        eyeTest: FINALFILEINITIALDATA,
        communicableDisease: FINALFILEINITIALDATA,
        vaccinations: FINALFILEINITIALDATA,
      })
      setDraftDocuments({})
      setDraftDelete([])
      // Get documents from draftDocuments if available, otherwise use documents
      const draftEyeTestDocs = draftData?.data?.draftDocuments?.['eyeTest'] ?? []
      const draftCommunicableDocs = draftData?.data?.draftDocuments?.['communicableDisease'] ?? []
      const draftVaccinationDocs = draftData?.data?.draftDocuments?.['vaccinations'] ?? []
      const serverDocs = draftData.data?.documents ?? []

      // Filter server documents by type
      const serverEyeTestDocs = serverDocs.filter((document: any) =>
        document.document_type === EYE
      )
      const serverCommunicableDocs = serverDocs.filter((document: any) =>
        document.document_type === COMMUNICABLE
      )
      const serverVaccinationDocs = serverDocs.filter((document: any) =>
        document.document_type === VACCINE
      )

      // Combine server and draft documents, filtering to only include documents with file_id
      const allEyeTestDocs = [...serverEyeTestDocs, ...draftEyeTestDocs].filter((doc: any) => {
        return doc.file_id !== undefined && doc.file_id !== null
      })
      const allCommunicableDocs = [...serverCommunicableDocs, ...draftCommunicableDocs].filter((doc: any) => {
        return doc.file_id !== undefined && doc.file_id !== null
      })
      const allVaccinationDocs = [...serverVaccinationDocs, ...draftVaccinationDocs].filter((doc: any) => {
        return doc.file_id !== undefined && doc.file_id !== null
      })

      // Update formData with merged documents
      const { eyeTest, communicableDisease, vaccinations, ...rest } = draftData.data
      setFormData({
        ...rest,
        eyeTest: {
          ...draftData?.data?.eyeTest,
          files: allEyeTestDocs,
        },
        communicableDisease: {
          ...draftData?.data?.communicableDisease,
          files: allCommunicableDocs,
        },
        vaccinations: {
          ...draftData?.data?.vaccinations,
          files: allVaccinationDocs,
        },
      });

      setSelectedEmployeeId(draftData.data?.employeeId ?? null);

      updateEmployeeInfo(Number(draftData?.data?.employeeId))

    }
  }, [draftData, id]);

  useEffect(() => {
    const getUpdatedFiles = (
      currentFiles: FileInfo[],
      documentsToDelete: number[],
      localFilesToDelete: number[]
    ): FileInfo[] => {
      return currentFiles.filter(
        (file) =>
          !documentsToDelete.includes(Number(file.id)) &&
          !localFilesToDelete.includes(Number(file.id))
      );
    };

    const newFormData = { ...formData };

    let shouldUpdate = false;

    SECTIONS.forEach(({ key }) => {
      const { documents_to_delete = [], local_files_to_delete = [] } = fileSubmissions[key as UploadSections];

      if (documents_to_delete.length || local_files_to_delete.length) {
        const currentFiles = formData[key].files ?? [];
        const filteredFiles = getUpdatedFiles(currentFiles, documents_to_delete.map(Number), local_files_to_delete.map(Number));

        if (filteredFiles.length !== currentFiles.length) {
          newFormData[key] = {
            ...formData[key],
            files: filteredFiles,
          };
          shouldUpdate = true;
        }
      }
    });

    if (shouldUpdate) {
      setFormData(newFormData);
    }
  }, [fileSubmissions]);

  const handleDescriptionChange = (section: keyof Omit<HealthCheckupFormData, 'employeeInfo'>, value: string) => {
      setFormData((prev) => {
        const updated = {
          ...prev,
          [section]: { ...prev[section], description: value },
        };
        handleDraftSave(selectedEmployeeId, updated, fileSubmissions);

        return updated;
      });
      if (errors[`${section}.description`]) {
        setErrors((prev) => ({ ...prev, [`${section}.description`]: "" }));
      }
    }

  const FileSetterFunction = useCallback(
    (
      section: keyof Omit<HealthCheckupFormData, 'employeeInfo'>,
      updateFile: (prev: DocumentStructure, setter: (files: DocumentStructure) => void) => void
    ) => {
      const setter = (files: DocumentStructure) => setFileSubmissions((prev) => ({
        ...prev,
        [section]: files,
      }));
      updateFile(fileSubmissions[section], setter);
    },
    [fileSubmissions]
  );
  // Update handleFileUpload to store files in formData with consistent structure
  const handleFileUpload = useCallback(
    (section: keyof Omit<HealthCheckupFormData, 'employeeInfo'>, newFile: FileData) => {
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          files: [...(prev[section].files ?? []), {
            ...newFile,
            file: newFile.file instanceof File ? newFile.file : null,
          }],
        },
      }));
    },
    []
  );

  const handleFileEdit = useCallback(
    (section: keyof Omit<HealthCheckupFormData, 'employeeInfo'>, updatedFile: FileData) => {
      FileSetterFunction(section, (prev, setter) => {
        const newUpdateMetaData = {
          ...prev.update_meta_data,
          [String(updatedFile.id)]: {
            description: updatedFile.description ?? '',
            source: updatedFile.source ?? '',
            tags: updatedFile.tags ?? [],
            purpose: updatedFile.purpose ?? '',
            file_status: String(updatedFile.status ?? NUMBERMAP.ONE),
            categoryId: updatedFile.categoryId ?? NUMBERMAP.ONE,
            fileName: updatedFile.name ?? '',
            date_of_upload: updatedFile.created_date ?? new Date().toISOString(),
          },
        };
        setter({
          ...prev,
          update_meta_data: newUpdateMetaData,
        });
      });
    },
    [FileSetterFunction]
  );

  // Refactor handleFileSubmit to use the new fileSubmissions state
  const handleFileSubmit = (section: keyof Omit<HealthCheckupFormData, 'employeeInfo'>, data: DocumentStructure) => {
      setFileSubmissions((prev) => {
        const merged = mergeFinalFileData(prev[section], data);
        const updated = {
          ...prev,
          [section]: merged,
        };
        handleDraftSave(selectedEmployeeId, formData, updated);
        return updated;
      });
    }

  const getSectionName = (fkey) => {
    let sectionName;

    if (fkey === EYE) {
      sectionName = EYE;
    } else if (fkey === COMMUNICABLE) {
      sectionName = COMMUNICABLE;
    } else {
      sectionName = VACCINE;
    }

    return sectionName;
  };

  const prepareFileMetadatas = useCallback(() => {
    // Get all file_ids from draftData.data.documents (preserved documents)
    const preservedDocumentIds = extractPreservedDocumentIds(draftData)

    // Prepare draft documents using the generic utility
    const createMetadata: Record<string, any> = {};
    const updateMetadata: Record<string, any> = {};
    const deleteMetadata: Record<string, any> = {};

    // Prepare objects for filtering
    const documentsToDeleteBySection: Record<string, string[]> = {}
    const updateMetaDataBySection: Record<string, Record<string, any>> = {}

    // Merge create metadata from draft preparation
    SECTIONS.forEach(({ key, tableName }) => {
      const files = fileSubmissions[key as UploadSections];

      // Process create metadata directly from FileUploadManager
      if (Object.keys(files?.create_meta_data ?? {}).length > NUMBERMAP.ZERO) {
        createMetadata[tableName] = Object.entries(files.create_meta_data).reduce(
          (acc: Record<string, any>, [fileName, fileData]) => {
            acc[fileName] = { ...fileData, fk_eqms_file_id: "{fileId}" };
            return acc;
          },
          {}
        );
      }

      // Collect update metadata by section
      if (Object.keys(files?.update_meta_data ?? {}).length > NUMBERMAP.ZERO) {
        updateMetaDataBySection[tableName] = files.update_meta_data;
      }

      // Collect draft update metadata
      if (formData.type) {
        if (formData?.draftDocuments?.[key]?.length > NUMBERMAP.ZERO) {
          formData?.draftDocuments?.[key].forEach((docs: any) => {
            if (docs.source != '') {
              updateMetaDataBySection[tableName] = {
                ...updateMetaDataBySection[tableName],
                [docs.file_id]: docs
              }
            }
          })
        }
      }

      // Collect documents_to_delete by section
      if ((files?.documents_to_delete?.length ?? NUMBERMAP.ZERO) > NUMBERMAP.ZERO) {
        documentsToDeleteBySection[tableName] = files.documents_to_delete.map(String)
      }
    });

    // Merge delete metadata - use documentsToDelete and draftDelete from draft preparation
    const draftDeleteBySection: Record<string, string[]> = {}
    let filesDelete = [EYE, COMMUNICABLE, VACCINE]
    filesDelete.forEach((fkey) => {
      if (formData?.draftDelete?.[fkey]) {
        const sectionName = getSectionName(fkey)
        draftDeleteBySection[sectionName] = formData.draftDelete[fkey].map(String)
      }
    })

    // Filter documents_to_delete to exclude preserved documents
    const filteredDeleteBySection = filterDocumentsToDelete(
      preservedDocumentIds,
      { ...documentsToDeleteBySection, ...draftDeleteBySection }
    )

    // Build deleteMetadata from filtered results
    Object.keys(filteredDeleteBySection).forEach((tableName) => {
      deleteMetadata[tableName] = {
        fk_eqms_file_id: filteredDeleteBySection[tableName].map(Number)
      }
    })

    const deleteIds = [
      ...(fileSubmissions?.eyeTest?.documents_to_delete ?? []),
      ...(fileSubmissions?.communicableDisease?.documents_to_delete ?? []),
      ...(fileSubmissions?.vaccinations?.documents_to_delete ?? []),
    ]
    // Filter update_meta_data to exclude preserved documents
    const filteredUpdateMetaData = filterNestedUpdateMetaData(
      deleteIds,
      updateMetaDataBySection
    )

    // Build updateMetadata from filtered results
    Object.keys(filteredUpdateMetaData).forEach((tableName) => {
      updateMetadata[tableName] = filteredUpdateMetaData[tableName]
    })

    // Use documents_to_create from fileSubmissions
    const documentsToCreate = SECTIONS.flatMap(({ key }) => {
      const files = fileSubmissions[key as UploadSections];
      return files?.documents_to_create ?? [];
    });

    return {
      fileOperation: { create: createMetadata, update: updateMetadata, delete: deleteMetadata },
      documents_to_create: documentsToCreate,
    };
  }, [fileSubmissions, draftDocuments, draftDelete, formData, draftData]);

  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};
    if (!selectedEmployeeId?.trim()) {
      newErrors[EMPLOYEE_ID] = `${EMPLOYEE_NAME}`;
    }

    SECTIONS.forEach(({ key, errorKey }) => {
      if (!formData[key].description?.trim()) {
        newErrors[errorKey] = sectionErrorMap[key].message;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, selectedEmployeeId]);

  const handleSubmit = async () => {
    const isValid = validateForm();
    if (!isValid || isSaving || !formRef.current) return;

    // Clear draft save when submitting final form
    clearDraftSave();
    setIsSaving(true);
    const isEditMode = mode === EDIT;
    const dataframeworkOperatorType = isEditMode ? UPDATE : INSERT;
    const keys: KeysInterface = isEditMode ? { eqms_hr_health_checkup: { id: parseInt(id) } } : {};
    const lastSubmittedDate =
      formData.employeeInfo.lastSubmittedDate?.trim()
        ? getCurrentDate() : '';
    const dataframeworkOtherParamsBag = {
      eqms_hr_health_checkup: [
        {
          status: NUMBERMAP.ONE,
          last_sumbitted_date: lastSubmittedDate,
        },
      ],
    };
    const fileMetadata = prepareFileMetadatas();
    try {
      // Filter out deleted documents from draftDocuments
      const deleteIds = [
        ...(fileSubmissions?.eyeTest?.documents_to_delete ?? []),
        ...(fileSubmissions?.communicableDisease?.documents_to_delete ?? []),
        ...(fileSubmissions?.vaccinations?.documents_to_delete ?? []),
      ]
      const filteredDocuments = draftData?.data?.documents?.filter((doc: any) =>
        !deleteIds.includes(Number(doc.file_id))
      ) ?? []

      const response = await magicFormSave({
        currentFormRef: formRef,
        dataframeworkOperatorType,
        dataframeworkOtherParamsBag,
        keys,
        fileMetadata,
        diagnosticFlag: magicSaveConstants.DAIGNOSTICS.INCLUDE_DIAGNOSTICS_YES,
        draftDocuments: filteredDocuments
      });

      if ("error" in response) {
        showActionAlert(FAILED);
        setIsSaving(false);
        return;
      }

      const handlePostSaveActions = () => {
        showActionAlert(SUCCESS);
        router.push(PATHNAME2);
        queryClient.invalidateQueries({ queryKey: [RESPONSE_KEYS.HEALTH_CHECKUP] });
      };

      if (
        response.response &&
        typeof response.response === 'object' &&
        "code" in response.response &&
        response.response.code === magicSaveConstants.STATUS_CODES.SUCCESS_CODE
      ) {
        handlePostSaveActions();
      } else {
        showActionAlert(FAILED);
        queryClient.invalidateQueries({ queryKey: [RESPONSE_KEYS.HEALTH_CHECKUP] });
      }
    } catch (error) {
      showActionAlert('customAlert', {
        title: HEALTH_CHECKUP_ERROR.UNHANDLED_ERROR_TITLE,
        text: error,
        icon: HEALTH_CHECKUP_ERROR.ICON,
        cancelButton: false,
        confirmButton: false,
      })
    } finally {
      setIsSaving(false);
      setFileSubmissions({
        eyeTest: FINALFILEINITIALDATA,
        communicableDisease: FINALFILEINITIALDATA,
        vaccinations: FINALFILEINITIALDATA,
      });
    }
  };

  const handleCancel = async () => {
    await checkUnsavedDraftBeforeLeave()
    router.push(PATHNAME2);
  };

  return (
    <FormContainer>
      {isDraftSaving && <DraftLoading />}
      <GlobalLoader loading={isAnyLoading(isLoading,isFetchingDraft)} />
      <form id={CONTAINER_ID} ref={formRef}>
        <Box>
          <SectionHeader>Health Checkup Declaration</SectionHeader>
          <SectionContent>
            <Grid2 container spacing={NUMBERMAP.TWO}>
              <Grid2 size={NUMBERMAP.SIX}>
                <InputField
                  label={LABELS.EMPLOYEE_NAME}
                  value={selectedEmployeeId ?? ""}
                  isDropdown
                  keyField={ID}
                  valueField={VALUE}
                  onChange={handleEmployeeChange}
                  placeholder={PLACE_HOLDER}
                  dataSourceName={DATA_SOURCE_NAME}
                  dataFieldName={DATA_FIELD_NAME}
                  options={employeeResponse?.data ?? []}
                  error={errors[EMPLOYEE_ID]}
                  dataIsAutocomplete={selectedEmployeeId}
                  disabled={isDisabled}
                />
              </Grid2>
              <Grid2 size={NUMBERMAP.SIX}>
                <EmployeeInfoContainer>
                  <InfoLabel>Role</InfoLabel>
                  <InfoValue>{formatValue(formData.employeeInfo.role)}</InfoValue>
                </EmployeeInfoContainer>
              </Grid2>
            </Grid2>
            <Grid2 container spacing={NUMBERMAP.TWO} sx={MARGINTOP}>
              <Grid2 size={NUMBERMAP.SIX}>
                <EmployeeInfoContainer>
                  <InfoLabel>Department</InfoLabel>
                  <InfoValue>{formatValue(formData.employeeInfo.department)}</InfoValue>
                </EmployeeInfoContainer>
              </Grid2>
              <Grid2 size={NUMBERMAP.SIX}>
                <EmployeeInfoContainer>
                  <InfoLabel>Last Submitted Date</InfoLabel>
                  <InfoValue>{mode === CREATE ? "-" : formData?.employeeInfo?.lastSubmittedDate}</InfoValue>
                  <input
                    style={CommonInlineStyles.displayNone}
                    value={formData?.employeeInfo?.lastSubmittedDate ?? NA}
                    readOnly
                    disabled
                  />
                </EmployeeInfoContainer>
              </Grid2>
            </Grid2>
          </SectionContent>
        </Box>

        {SECTIONS.map((section) => (
          <SectionForm
            key={section.key}
            section={section}
            formData={formData}
            errors={errors}
            isDisabled={isDisabled}
            handleDescriptionChange={handleDescriptionChange}
            handleFileUpload={handleFileUpload}
            handleFileEdit={handleFileEdit}
            handleFileSubmit={handleFileSubmit}
          />
        ))}

        <Box sx={STYLE}>
          <SectionContent>
            <ButtonGroup
              buttons={[
                { label: CANCEL, onClick: handleCancel },
                {
                  label: SAVE,
                  onClick: () => {
                    void handleSubmit();
                  },
                  disabled: isSaving ?? isDisabled,
                },
              ]}
            />
          </SectionContent>
        </Box>
      </form>
    </FormContainer>
  );
};

export default HealthCheckupDeclaration;