"use client";
import React, { useRef, useState, useEffect, useCallback } from "react";
import { Grid2 } from "@mui/material";
import { ContentWrapper, GRID_SIZE, MODAL_STYLES } from "@/styles/modules/dnd/verification"
import { ButtonGroup, InputField, MultiSelect, showActionAlert } from "@/components/ui";
import FileUploadManager from "@/components/ui/file-upload-v3/FileUploadManager";
import { useFetchSkills, useFetchNeedById, useGenerateRecords } from "@/hooks/modules/hr/useTrainingNeeds";
import { useRecordGenerationHelper } from '@/hooks/modules/hr/useRecordGeneration';
import { magicFormSave } from '@/lib/utils/magicSave';
import { COMMON_CONSTANTS, mergeFinalFileData, restructureData, formatDateForAPI,FinalFileData } from '@/lib/utils/common'
import magicSaveConstants from '@/constants/magicSave';
import { FormErrors, TrainingNeedsForm } from "@/types/modules/hr/trainingNeeds";
import { DATA_CHANGE, INITIAL_NEEDS, FORM_LABEL, FORM_PLACEHOLDER, CONTAINER_ID, DATA_TABLE_NAME, DATA_FIELD_NAME, KEY_FIELD, VALUE_FIELD, TRAINING_LIST, ERRORS, INITIAL_ERRORS } from "@/constants/modules/hr/trainingNeeds";
import { FileData2 } from '@/components/ui/file-upload-v2/fileUploadTypes'
import { FileDocument } from '@/types/components/ui/fileUploadV3'
import {
  UploadedFileData,
  DocumentStructure,
} from '@/types/modules/dnd/hld'
import { FILE_UPLOAD_SUB_HEADER, FINALFILEINITIALDATA, NUMBERMAP } from '@/constants/common'
import { useSelector } from 'react-redux';
import { selectUserId } from '@/store/slices/menuSlice'
import DatePicker from "@/components/ui/data-picker/DataPicker";
import dayjs from "dayjs";
import {  useListWorkflowEmployes, useSourceDropDown } from "@/hooks/modules/hr/useEmployeeList";
import { useDraftSave } from '@/hooks/common/useDraftSave'
import DraftLoading from '@/components/ui/draft-loader/DraftLoader'
import { prepareDraftDocumentsGeneric, DraftDocumentsConfig } from '@/lib/utils/modules/hr/draftDocumentsCommon'
import { 
  extractPreservedDocumentIds, 
  filterDocumentsToDeleteArray,
} from '@/lib/utils/modules/hr/preservedDocumentsFilter'
import GlobalLoader from "@/components/shared/LoadingSpinner";

const { SUCCESS_ALERT, FAILED_ALERT, EMPTY_ARRAY_LENGTH, UPDATE, INSERT } =
  COMMON_CONSTANTS

interface AddTrainingNeedsProps {
  onClose: () => void;
  needId?: number;
  onSuccess: () => void;
}


const AddTrainingNeeds: React.FC<AddTrainingNeedsProps> = ({
  onClose,
  needId,
  onSuccess
}) => {

  const formRef = useRef(null);
  const [trainingNeedData, setTrainingNeedData] = useState<TrainingNeedsForm>(INITIAL_NEEDS);
  const [isEditMode, setIsEditMode] = useState(false);
  const [finalFileData, setFinalFileData] =
    useState<DocumentStructure>(FINALFILEINITIALDATA)
  const [formErrors, setFormErrors] = useState<FormErrors>({ ...INITIAL_ERRORS })
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [draftDocuments, setDraftDocuments] = useState<Record<string, any[]>>({})
  const [draftDelete, setDraftDelete] = useState<string[]>([])

  // Training needs draft configuration
  const TRAINING_NEEDS_DRAFT_CONFIG: DraftDocumentsConfig = {
    fileFieldToSectionMap: {
      'none': 'supporting_files', // Single file section - use 'none' key
      'documents': 'supporting_files', // Alternative key for documents
      'uploadedFile': 'supporting_files', // Form field name
    },
    sectionTypeToNameMap: {
      'none': 'supporting_files',
      'single': 'supporting_files',
    },
    responseDataKeyMap: {
      'none': 'eqms_hr_employee_training_supporting_document',
      'single': 'eqms_hr_employee_training_supporting_document',
    },
  }

  const { draftSave, clearDraftSave, isFetchingDraft, isDraftSaving ,draftData,fetchDraft,checkUnsavedDraftBeforeLeave} = useDraftSave({
    context_type: 'training_needs',
    enableFetch:false,
    context_instance_id:needId??null
  })
  const { data: skillOptions } = useFetchSkills(NUMBERMAP.ONE);
  const { data: sourceOptions } = useSourceDropDown();
  const { data: employeeOptions,refetch:employeeRefetch } = useListWorkflowEmployes(NUMBERMAP.ONE,'Approved');
  const { data: detailedNeedData, refetch } = useFetchNeedById(Number(needId));
  const userId = useSelector(selectUserId);
  const { mutate: generateRecords } = useGenerateRecords();

  // Record generation hook
  const { generateDocumentFromContextIds } = useRecordGenerationHelper();

  // Use the detailed data from API when available
  useEffect(() => {
    if (needId && detailedNeedData?.data && detailedNeedData.data?.length > NUMBERMAP.ZERO) {
      setIsEditMode(true);
      const needData = detailedNeedData.data[NUMBERMAP.ZERO]; // Get the first item from the array

      // Format the date from API format to input format (YYYY-MM-DD)
      const formattedDate = formatDateForAPI(needData.target_date) ?? '';

      const skillId = skillOptions?.data?.find(skill =>
        skill[VALUE_FIELD.SKILL] === needData.skill_name
      )?.[KEY_FIELD.SKILL] ?? needData.skill_name;

      // Find source ID from source name
      const sourceId = sourceOptions?.data?.find(source =>
        source[VALUE_FIELD.SOURCE] === needData.source
      )?.[KEY_FIELD.SOURCE] ?? needData.source;

      // Extract employee IDs from the employees array
      const employeeIds = needData.employee ?
        needData.employee?.map(emp => emp.employee_id) : [];

      setTrainingNeedData(prev => ({
        ...prev,
        skill: skillId ?? '',
        source: sourceId ?? '',
        employee: employeeIds ?? [],
        dateOfJoining: formattedDate ?? '',
        uploadedFile: needData.documents ?? []
      }));
    }
  }, [detailedNeedData, needId, skillOptions?.data, sourceOptions?.data]);

  useEffect(() => {
    if (draftData?.data) {
      // Get documents from draftDocuments if available, otherwise use documents
      const draftDocs = draftData?.data?.draftDocuments ?? []
      const serverDocs = draftData?.data?.documents ?? []
      
      
      setTrainingNeedData({
        ...draftData.data,
        dateOfJoining: formatDateForAPI(draftData?.data?.target_date),
        uploadedFile: [...serverDocs, ...draftDocs]
      })
    
    }
  }, [draftData]);

  useEffect(() => {
    resetForm()
    setIsInitialLoad(false);
    employeeRefetch()
    fetchDraft()  
    if(needId){
      refetch()
    }
  }, [needId]);


  const handleChange = (field: string) => (value: string | string[]) => {
    setTrainingNeedData((prev) => {
      const updated = {
        ...prev,
        [field]: value,
      };
      if (!isInitialLoad) {
        handleDraftSave(updated,finalFileData);
      }
      return updated;
    });
    if (formErrors[field as keyof FormErrors]) {
      setFormErrors((prevErrors) => ({ ...prevErrors, [field]: '' }));
    }
  };

  const getSkillName = (skillId: string) => {
    return skillOptions?.data?.find(skill =>
      skill.skill_id == skillId
    )?.[VALUE_FIELD.SKILL] ?? skillId;
  }
  const getSourceName = (sourceId: string) => {
    return sourceOptions?.data?.find(source =>
      source.source_id == sourceId
    )?.[VALUE_FIELD.SOURCE] ?? sourceId;
  }
  const handleDraftSave = (formData: TrainingNeedsForm, fileData?: FinalFileData) => {
    const finalFileDataValue = (fileData ?? finalFileData) as FinalFileData
    
    // Use the generic utility function for single file section
    const draftPreparation = prepareDraftDocumentsGeneric(
      draftDocuments,
      draftDelete,
      formData,
      { 'none': finalFileDataValue ?? FINALFILEINITIALDATA },
      draftData,
      TRAINING_NEEDS_DRAFT_CONFIG
    )
    if (draftPreparation.draftDocuments) {
      setDraftDocuments(draftPreparation.draftDocuments)
    }
    if (draftPreparation.draftDelete) {
      setDraftDelete(draftPreparation.draftDelete)
    }

    // Extract drafted documents from draftDocuments
    const extractedDraftDocuments = draftPreparation.draftDocuments['supporting_files'] ?? []

    const payload = {
      id: needId ?? 0,
      skill: formData.skill,
      skill_name: getSkillName(formData.skill),
      source_name: getSourceName(formData.source),    
      source: formData.source,
      employee: formData.employee,
      target_date: formData.dateOfJoining ?? formData?.target_date,
      creation_date: formatDateForAPI(new Date()),
      type: 'draft',
      training_needs_id:new Date().getTime(),
      status:NUMBERMAP.ONE,
      documents: draftData?.data?.documents ?? [],
      draftDelete: draftPreparation.draftDelete,
      draftDocuments: extractedDraftDocuments,
    } 
    draftSave({
      form_type: 'hr_training_needs',
      form_data: payload,
      upload_documents:{
        documents_to_create: finalFileDataValue?.documents_to_create ?? [],
        create_meta_data: draftPreparation.createMetaData,
        update_meta_data: draftPreparation.updateMetaData,
        deleteDraftDocuments: draftPreparation?.documentsToDelete ?? [],
        documents_to_preserve: draftPreparation?.documentsToPreserve ?? [],
      },
      timestamp: new Date().toISOString(),
    })
  }

  const validateForm = () => {
    let isValid = true;
    const newErrors: FormErrors = { ...INITIAL_ERRORS };

    if (!trainingNeedData.skill || trainingNeedData.skill === '') {
      newErrors.skill = ERRORS.SKILL_ERROR;
      isValid = false;
    }

    if (!trainingNeedData.employee || trainingNeedData.employee.length === NUMBERMAP.ZERO) {
      newErrors.employee = ERRORS.EMPLOYEE_ERROR;
      isValid = false;
    }

    if (!trainingNeedData.dateOfJoining || trainingNeedData.dateOfJoining === '') {
      newErrors.dateOfJoining = ERRORS.DATE_ERROR;
      isValid = false;
    }

    setFormErrors(newErrors);
    return isValid;
  };

  const handleRecords = (trainingNeedId: number) => {
    generateRecords(trainingNeedId);
  };

 
  const prepareFileMetadata = (finalFileData: DocumentStructure) => {
    // Prepare draft documents using the generic utility

    if (Object.keys(finalFileData).length) {
      // Get all file_ids from draftData.data.documents (preserved documents)
      const preservedDocumentIds = extractPreservedDocumentIds(draftData)

      const createTables = [
        {
          table: DATA_TABLE_NAME.FILE_SUPPORTING,
          idColumn: DATA_FIELD_NAME.FILE_SUPPORTING_ID,
        },
      ]

      const updateTables = [
        {
          table: DATA_TABLE_NAME.FILE_SUPPORTING,
          idColumn: DATA_FIELD_NAME.FILE_SUPPORTING_ID,
        },
      ]

      const deleteTableColumnMap = {
        eqms_hr_employee_training_supporting_document: DATA_FIELD_NAME.FILE_SUPPORTING_ID,
      }
      
      // Merge draftDelete and documentsToDelete with finalFileData documents_to_delete
      let modifyFinalFileData = { ...finalFileData }
      const draftDeletedFiles = draftData?.data?.draftDelete?.eqms_hr_employee_training_supporting_document ?? []
      
      // Filter out preserved documents from deletions
      const filteredDraftDelete = filterDocumentsToDeleteArray(preservedDocumentIds, draftDeletedFiles)
      const filteredFinalFileDelete = filterDocumentsToDeleteArray(preservedDocumentIds, finalFileData.documents_to_delete ?? [])
      
      const allDeleteIds = [
        ...filteredFinalFileDelete,
        ...filteredDraftDelete
      ]
      
      if (allDeleteIds.length > 0) {
        modifyFinalFileData.documents_to_delete = Array.from(new Set(allDeleteIds.map(Number))).filter(
          (id) => id !== null && id !== undefined && id !== ''
        )
      } else {
        modifyFinalFileData.documents_to_delete = []
      }
      
      // Merge create_meta_data and update_meta_data from draft preparation
      
      if (draftData?.data?.draftDocuments && Object.keys(draftData?.data?.draftDocuments).length > NUMBERMAP.ZERO) {
        Object.keys(draftData?.data?.draftDocuments).forEach((key) => {
          draftData?.data?.draftDocuments?.filter((doc: any) => doc?.file_id && doc?.source != '' && !finalFileData?.documents_to_create?.includes(doc?.file_id)).forEach((document) => {
            modifyFinalFileData.update_meta_data[document.file_id] = document
          })
        })
      }
      
      const hasTrainingNeedFileData = Object.entries(modifyFinalFileData)?.some(
        ([key, val]) => {
          if (Array.isArray(val)) {
            return val.length > EMPTY_ARRAY_LENGTH
          }else{
            return Object.keys(val).length > EMPTY_ARRAY_LENGTH
          }
        }
      )

      if (hasTrainingNeedFileData) {
        const output = restructureData(
          modifyFinalFileData,
          createTables,
          updateTables,
          deleteTableColumnMap
        )
       return {
          fileOperation: output,
          documents_to_create: modifyFinalFileData.documents_to_create ?? [],
        }
      }else{
        return {
          fileOperation: {},
          documents_to_create: [],
        }
      }
    }
  }
  const handleSave = async () => {
    if (!validateForm()) {
      return; // This should stop execution
    }
    
    // Clear draft save when submitting final form
    clearDraftSave();
    
    // Prepare employee mapper entries
    const formattedDate = formatDateForAPI(trainingNeedData.dateOfJoining) ?? '';

    
    const fileMetadata = prepareFileMetadata(finalFileData)
    const employeeMappers = trainingNeedData.employee.map((employeeId) => ({
      fk_eqms_organization_employee_id: employeeId,
    }))

    // Prepare other params bag for status
    const otherParamsBag = {
      eqms_hr_employee_training_needs: [
        {
          status: NUMBERMAP.ONE,
          fk_eqms_user_id: userId,
          target_date: formattedDate, // Use the formatted date here
          creation_date: formatDateForAPI(new Date()),
        },
      ],
      eqms_hr_employee_training_needs_mapper: employeeMappers.map(() => ({
        fk_eqms_hr_employee_training_needs_id:
          needId ?? detailedNeedData?.training_needs_id,
        status: NUMBERMAP.ONE,
      })),
    }

    // Prepare keys
    const keys: any = {
      eqms_hr_employee_training_needs: isEditMode
        ? { id: needId ?? detailedNeedData?.training_needs_id }
        : {},
    }

    // Add mapper keys for edit mode
    if (isEditMode) {
      keys.eqms_hr_employee_training_needs_mapper = {
        fk_eqms_hr_employee_training_needs_id:
          needId ?? detailedNeedData?.training_needs_id,
      }
    }

    // Filter out deleted documents from draftDocuments
    const deleteIds = fileMetadata?.documents_to_delete ?? []
    const filteredDocuments = draftData?.data?.documents?.filter((doc: any) => 
      !deleteIds.includes(Number(doc.file_id))
    ) ?? []

    const response = await magicFormSave({
      currentFormRef: formRef,
      dataframeworkOperatorType: isEditMode ? UPDATE : INSERT,
      dataframeworkOtherParamsBag: otherParamsBag,
      keys,
      diagnosticFlag: magicSaveConstants?.DAIGNOSTICS.INCLUDE_DIAGNOSTICS_YES,
      fileMetadata,
      draftDocuments: filteredDocuments
    })
    const newTrainingNeedId =
      response?.response?.data?.[NUMBERMAP.ZERO]
        ?.eqms_hr_employee_training_needs?.[NUMBERMAP.ZERO]?.id
    if (
      response?.response?.code ===
      magicSaveConstants.STATUS_CODES.SUCCESS_CODE
    ) {
      // Generate document after successful save using selected employee IDs
      if (trainingNeedData?.employee && trainingNeedData?.employee?.length > NUMBERMAP.ZERO) {
        const employeeIds = trainingNeedData?.employee?.map(empId => parseInt(empId, NUMBERMAP.TEN))
        generateDocumentFromContextIds(employeeIds)
      }

      // Keep existing record generation if needed
      if (newTrainingNeedId) {
        handleRecords(newTrainingNeedId)
      }

      showActionAlert(SUCCESS_ALERT)
      resetForm()
      onClose()
      refetch()
      onSuccess?.()
    } else {
      showActionAlert(FAILED_ALERT)
      onClose()
    }
  };

  const handleFileRemove = (data) => {
    if (data?.local_files_to_delete.length > NUMBERMAP.ZERO) {
      if (trainingNeedData?.uploadedFile.length > NUMBERMAP.ZERO) {
        const uploadFiles = trainingNeedData.uploadedFile.filter((files) => data?.local_files_to_delete?.some((del) =>del != files?.file?.name?.split(".")[NUMBERMAP.ZERO]))
        setTrainingNeedData({
          ...trainingNeedData, uploadedFile: uploadFiles
        })
      }
    }
  }
  const resetForm = () => {
    setTrainingNeedData({
      skill: '',
      source: '',
      employee: [],
      dateOfJoining: '',
      uploadedFile: []
    })
    setFinalFileData({
      documents_to_create: [],
      documents_to_delete: [],
      create_meta_data: {},
      update_meta_data: {},
      local_files_to_delete: [],
    });
    setFormErrors({
      skill: '',
      source: '',
      employee: '',
      dateOfJoining: ''
    })

  }
  const handleFileUpload = (newFile: File | FileData2) => {
    setTrainingNeedData((prev) => {
      const files = prev.uploadedFile ?? []
      files.push(newFile)
      return {
      ...prev,
      uploadedFile: files as File[] | FileDocument[],
    }})
  }

  const handleTraingFileEdit = useCallback(
    (uploadedFile: UploadedFileData | FileData2) => {
      setTrainingNeedData((prev) => {
        const updatedUploadFile = prev.uploadedFile.map((file) => {
          const currentId =
            typeof file === 'object'
              ? ((file as FileDocument).file_id ?? (file as FileDocument).id)
              : undefined
          const latestId = uploadedFile.document_id ?? uploadedFile.id

          return currentId === latestId ? { ...file, ...uploadedFile } : file
        })

        return {
          ...prev,
          uploadedFile: updatedUploadFile,
        }
      })
    },
    []
  )

  useEffect(() => {
    if (finalFileData.documents_to_delete?.length > EMPTY_ARRAY_LENGTH) {
      setTrainingNeedData((prev) => {
        const prevData = { ...prev }
        prevData.uploadedFile = (prevData.uploadedFile as File[]).filter(
          (file) => !finalFileData.documents_to_delete.includes(file.file_id)
        )
        return prevData
      })
    }
    if (finalFileData.local_files_to_delete?.length > EMPTY_ARRAY_LENGTH) {
      setTrainingNeedData((prev) => {
        const prevData = { ...prev }
        prevData.uploadedFile = (prevData.uploadedFile as File[]).filter(
          (file) => !finalFileData.local_files_to_delete.includes(file.id)
        )
        return prevData
      })
    }
  }, [finalFileData])

  return (
    <ContentWrapper ref={formRef} id={CONTAINER_ID}>
      {isDraftSaving && <DraftLoading />}
      <GlobalLoader loading={isFetchingDraft} />
      <Grid2
        container
        spacing={NUMBERMAP.ONE}
        sx={MODAL_STYLES.scrollableContainer}
      >
        <Grid2 size={GRID_SIZE.FULL_WIDTH}>
          <InputField
            label={FORM_LABEL.SKILL_TITLE}
            placeholder={FORM_PLACEHOLDER.SKILL_TITLE}
            isDropdown={true}
            value={trainingNeedData.skill}
            onChange={handleChange(DATA_CHANGE.SKILL)}
            options={skillOptions?.data}
            keyField={KEY_FIELD.SKILL}
            valueField={VALUE_FIELD.SKILL}
            dataSourceName={DATA_TABLE_NAME.TRAINING_NEEDS}
            dataFieldName={DATA_FIELD_NAME.SKILL}
            dataIsAutocomplete={trainingNeedData.skill}
            error={formErrors.skill}
          />
        </Grid2>
        <Grid2 size={GRID_SIZE.FULL_WIDTH}>
          <InputField
            label={FORM_LABEL.SOURCE}
            placeholder={FORM_PLACEHOLDER.SOURCE}
            isDropdown={true}
            value={trainingNeedData.source}
            onChange={handleChange(DATA_CHANGE.SOURCE)}
            options={sourceOptions?.data}
            keyField={KEY_FIELD.SOURCE}
            valueField={VALUE_FIELD.SOURCE}
            dataSourceName={DATA_TABLE_NAME.TRAINING_NEEDS}
            dataFieldName={DATA_FIELD_NAME.SOURCE}
            dataIsAutocomplete={trainingNeedData.source}
            error={formErrors.source}
          />
        </Grid2>

        <Grid2 size={GRID_SIZE.FULL_WIDTH}>
          <MultiSelect
            options={
              Array.isArray(employeeOptions?.data) ? employeeOptions.data : []
            }
            idField={KEY_FIELD.EMPLOYEE}
            valueField={VALUE_FIELD.EMPLOYEE}
            label={FORM_LABEL.EMPLOYEE}
            placeholder={FORM_PLACEHOLDER.EMPLOYEE}
            onChange={handleChange(DATA_CHANGE.EMPLOYEE)}
            value={trainingNeedData.employee ?? []}
            dataSourceName={DATA_TABLE_NAME.MAPPER}
            dataFieldName={DATA_FIELD_NAME.EMPLOYEE}
            dataIsAutocomplete={trainingNeedData.employee}
            dataIsMultiSelect="true"
            error={formErrors.employee}
          />
        </Grid2>

        <Grid2 size={GRID_SIZE.FULL_WIDTH}>
          <DatePicker
            label={FORM_LABEL.TARGET_DATE}
            placeholder={FORM_PLACEHOLDER.TARGET_DATE}
            value={dayjs(trainingNeedData.dateOfJoining) ?? null}
            onChange={handleChange(DATA_CHANGE.TARGET_DATE)}
            dataIsAutocomplete={formatDateForAPI(trainingNeedData.dateOfJoining)}
            type="date"
            error={formErrors.dateOfJoining}
          />
        </Grid2>

          <Grid2 size={NUMBERMAP.TWELVE}>
            <FileUploadManager
              initialFiles={trainingNeedData.uploadedFile}
              onFileUpload={handleFileUpload}
              onFileEdit={handleTraingFileEdit}
              onSubmit={(data) => {
                setFinalFileData((prev) => {
                  const merged = mergeFinalFileData(prev, data) as FinalFileData
                  handleDraftSave(trainingNeedData, merged)
                  return merged
                })
                handleFileRemove(data)
              }}
              subHeader={FILE_UPLOAD_SUB_HEADER}
            />
          </Grid2>
      </Grid2>
      <ButtonGroup
        buttons={[
          { label: TRAINING_LIST.CANCEL, onClick: async () => {
            await checkUnsavedDraftBeforeLeave()
            onClose()
          } },
          { label: TRAINING_LIST.SAVE, onClick: handleSave },
        ]}
      />
    </ContentWrapper>
  )
};

export default AddTrainingNeeds;
