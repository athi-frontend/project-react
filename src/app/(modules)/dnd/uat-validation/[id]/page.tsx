'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Grid2, Tooltip } from '@mui/material';
import InfoField from '@/components/modules/dnd/project-info/InfoField';
import { DataGridTable, InputField, Label, RichTextEditor, showActionAlert } from '@/components/ui';
import CommonModal from '@/components/ui/common-modal/CommonModal';
import FileUploadManager from '@/components/ui/file-upload-v3/FileUploadManager';
import { ErrorText, P20P40, TableContainer } from '@/styles/common';
import { LabelContainer, LabelText } from '@/styles/components/modules/prototypeForm';
import { TruncatedLabelValue } from '@/styles/modules/dnd/projectPlan';
import { useUatValidation, usePostUatValidation } from '@/hooks/modules/dnd/useUatValidation';
import { useParams, useRouter } from 'next/navigation';
import { FinalFileData, mergeFinalFileData, COMMON_CONSTANTS, numberValidation } from '@/lib/utils/common';
import { FAILED, SUCCESS } from '@/constants/modules/hr/candidateEvaluation';
import { FormState, ValidationDocument } from '@/types/modules/dnd/uatValidation';
import { PlaceOfValidation } from '@/types/modules/dnd/pilotValidationReport';
import { INITIAL_FILE_DATA, fieldLabels, FILE_TYPE, initialFormState, MODAL_CONSTANTS, FORM_DATA_KEYS, VALIDATION_PLAN, STANDARD_DOC, FORM_CONSTANTS, COLUMNS1, COLUMNS2, FIELD_ORDER, FIELD_LABEL_MAP } from '@/constants/modules/dnd/uatValidation';
import { BUTTONSTYLE, NUMBERMAP } from '@/constants/common';
import { ROUTE_PATHS } from '@/constants/modules/dnd/project';
import GlobalLoader from '@/components/shared/LoadingSpinner';
import ReviewerModalManager from '@/components/modules/dnd/reviewer-modal/ReviewerModalManager';
import CommentsHistory from '@/components/ui/comments-history/Comments';
import { validateAndFocusFirstEmptyField } from '@/lib/utils/formUtils';

/**
 Classification : Confidential
**/

const { EMPTY_ARRAY_LENGTH } = COMMON_CONSTANTS;

const UATValidation: React.FC = () => {
  const params = useParams();
  const projectId = Number(params.id);
  const router = useRouter();
  const { data: uatData, isLoading, isFetching } = useUatValidation(projectId);
  const postMutation = usePostUatValidation(projectId);
  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'validationPlan' | 'standardDoc' | null>(null);
  const [modalInput, setModalInput] = useState('');
  const [modalEditId, setModalEditId] = useState<number | null>(null);
  const [supportingFiles, setSupportingFiles] = useState<File[]>([]);
  const [feedbackFiles, setFeedbackFiles] = useState<File[]>([]);
  const [projectReason, setProjectReason] = useState<string>('');
  const [supportingFinalFileData, setSupportingFinalFileData] = useState<FinalFileData>(INITIAL_FILE_DATA);
  const [feedbackFinalFileData, setFeedbackFinalFileData] = useState<FinalFileData>(INITIAL_FILE_DATA);
  const [isSaveClicked, setIsSaveClicked] = useState(false);
  const [feedbackUploadError, setFeedbackUploadError] = useState<string>('');
  const [feedbackUploadKey, setFeedbackUploadKey] = useState<number>(NUMBERMAP.ZERO);
  const [hasEditPermission, setHasEditPermission] = useState(true);

  // Populate form and project_reason from API data
  useEffect(() => {
    if (isLoading || !uatData?.data?.length) return;

    const data = uatData.data[NUMBERMAP.ZERO];
    const newFormState = {
      data: {
        validationPlanDetails: data.validation_plan_details ?? '',
        purposeOfValidation: data.purpose_of_validation ?? '',
        numberOfUnits: String(data.units_to_be_validated ?? ''), 
        periodOfUsage: data.period_of_usage ?? '',
        unitConfiguration: data.unit_configuration ?? '',
        functionInvolved: data.function ?? '',
        validationPlaces: Array.isArray(data.validation_places) ? data.validation_places : [], 
        validationDocuments: Array.isArray(data.validation_documents) ? data.validation_documents : [], 
        basicModel: Array.isArray(data.models) ? data.models.join(' , ') : '',
      },
      errors: initialFormState.errors,
    };

    setFormState(newFormState);
    setSupportingFiles(data.supporting_documents ?? []);
    setFeedbackFiles(data.feedback_Files ?? []);
    setProjectReason(data.project_reason ?? '');
  }, [uatData, isLoading]);

  // Helper function to filter files based on deletion lists
  const filterFiles = (
    files: File[],
    documentsToDelete: (string | number)[],
    localFilesToDelete: (string | number)[]
  ) => {
    return files.filter((file) => {
      const fileId = (file as any).file_id ?? (file as any).id;
      return !documentsToDelete.includes(fileId) && !localFilesToDelete.includes(fileId);
    });
  };

  // Sync supporting and feedback files with deletions
  useEffect(() => {
    const syncFiles = (
      finalFileData: FinalFileData,
      setFiles: React.Dispatch<React.SetStateAction<File[]>>,
      isFeedback: boolean = false
    ) => {
      const { documents_to_delete = [], local_files_to_delete = [] } = finalFileData;
      if (
        documents_to_delete.length > EMPTY_ARRAY_LENGTH ||
        local_files_to_delete.length > EMPTY_ARRAY_LENGTH
      ) {
        setFiles((prev) =>
          filterFiles(prev, documents_to_delete, local_files_to_delete)
        );
        // Clear upload error when feedback files are deleted
        if (isFeedback) {
          setFeedbackUploadError('');
          setFeedbackUploadKey(prev => prev + NUMBERMAP.ONE);
        }
      }
    };

    syncFiles(supportingFinalFileData, setSupportingFiles);
    syncFiles(feedbackFinalFileData, setFeedbackFiles, true);
  }, [supportingFinalFileData, feedbackFinalFileData]);

  const handleChange = useCallback((field: keyof FormState['data'], value: string) => {
    if(!hasEditPermission) return;
    setFormState((prev) => ({
      ...prev,
      data: { ...prev.data, [field]: value },
      errors: { ...prev.errors, [field]: '' },
    }));
  }, [hasEditPermission]);

  const handleOpenModal = useCallback((type: 'validationPlan' | 'standardDoc') => {
    if(!hasEditPermission) return;
    setModalType(type);
    setModalInput('');
    setModalEditId(null);
    setModalOpen(true);
    setIsSaveClicked(false);
  }, [hasEditPermission]);

  const handleEditRow = useCallback(
    (type: 'validationPlan' | 'standardDoc', row: any) => {
      if(!hasEditPermission) return;
      setModalType(type);
      setModalInput(type === VALIDATION_PLAN ? row.place : row.document);
      setModalEditId(row.id ?? NUMBERMAP.ZERO);
      setModalOpen(true);
      setIsSaveClicked(false);
    },
    [hasEditPermission]
  );

  const showDuplicateAlert = (alertText: string) => {
        setModalOpen(false);
        setModalInput('');
        setModalEditId(null);
        setModalType(null);
        setIsSaveClicked(false);

        showActionAlert('customAlert', {
          title: COMMON_CONSTANTS.FORM_VALIDATION_ERROR.title,
          text: alertText,
          icon: COMMON_CONSTANTS.FORM_VALIDATION_ERROR.icon,
          cancelButton: false,
          confirmButton: false,
        });
  }

  const handleModalSave = useCallback(() => {
    /**
     * Function Name: handleModalSave
     * Params: none
     * Description: use to save modal,
     * Modified By: Prithiviraj P,
     * Modified date: 15-10-2025,
     * Classification : Confidential
    **/
    if(!hasEditPermission) return;
    setIsSaveClicked(true);
    if (!modalInput.trim()) return;
    
    if (modalType === VALIDATION_PLAN) {
      // Check for duplicate place of validation using filter
      const currentRows = Array.isArray(formState.data.validationPlaces) ? formState.data.validationPlaces : [];
      const trimmedInput = modalInput.trim();
      
      const duplicateRows = currentRows.filter((r: PlaceOfValidation) => {
        return r.place?.toLowerCase() === trimmedInput.toLowerCase();
      });

      if (duplicateRows.length > NUMBERMAP.ZERO) {
        showDuplicateAlert(MODAL_CONSTANTS.validationPlan.duplicate_entry)
        return;
      }
  
      setFormState((prev) => {
        const currentRows = Array.isArray(prev.data.validationPlaces) ? prev.data.validationPlaces : [];
        let updatedRows;
        if (modalEditId !== null) {
          updatedRows = currentRows.map((r: PlaceOfValidation) =>
            r.id === modalEditId ? { id: r.id, place: modalInput } : r
          );
        } else {
          updatedRows = [...currentRows, { id: Date.now(), place: modalInput }];
        }

        return {
          ...prev,
          data: { ...prev.data, validationPlaces: updatedRows },
          errors: { ...prev.errors, validationPlaces: '' },
        };
      });
    } else if (modalType === STANDARD_DOC) {
      // Check for duplicate standard document using filter
      const currentRows = Array.isArray(formState.data.validationDocuments) ? formState.data.validationDocuments : [];
      const trimmedInput = modalInput.trim();
      
      const duplicateRows = currentRows.filter((r: any) => {
        return r.document?.toLowerCase() === trimmedInput.toLowerCase();
      });

      if (duplicateRows.length > NUMBERMAP.ZERO) {
        showDuplicateAlert(MODAL_CONSTANTS.standardDoc.duplicate_entry)
        return;
      }

      setFormState((prev) => {
        const currentRows = Array.isArray(prev.data.validationDocuments) ? prev.data.validationDocuments : [];
        let updatedRows;
        if (modalEditId !== null) {
          updatedRows = currentRows.map((r: ValidationDocument) =>
            r.id === modalEditId ? { id: r.id, document: modalInput } : r
          );
        } else {
          updatedRows = [...currentRows, { id: Date.now(), document: modalInput }];
        }

        return {
          ...prev,
          data: { ...prev.data, validationDocuments: updatedRows },
        };
      });
    }

    setModalOpen(false);
    setModalInput('');
    setModalEditId(null);
    setModalType(null);
    setIsSaveClicked(false);
  }, [modalInput, modalType, modalEditId, hasEditPermission]);

  const handleModalClose = useCallback(() => {
    setModalOpen(false);
    setModalInput('');
    setModalEditId(null);
    setModalType(null);
    setIsSaveClicked(false);
  }, [router]);

  const handleDeleteRow = useCallback((type: 'validationPlan' | 'standardDoc', id: number) => {
    if(!hasEditPermission) return;
    if (type === VALIDATION_PLAN) {
      setFormState((prev) => ({
        ...prev,
        data: {
          ...prev.data,
          validationPlaces: Array.isArray(prev.data.validationPlaces)
            ? prev.data.validationPlaces.filter((r: any) => r.id !== id)
            : [],
        },
      }));
    } else {
      setFormState((prev) => ({
        ...prev,
        data: {
          ...prev.data,
          validationDocuments: Array.isArray(prev.data.validationDocuments)
            ? prev.data.validationDocuments.filter((r: any) => r.id !== id)
            : [],
        },
      }));
    }
  }, [hasEditPermission]);

  const handleFileAction = useCallback((fileType: 'supporting' | 'feedback', action: 'upload' | 'edit', file: File) => {
    const setFiles = fileType === 'supporting' ? setSupportingFiles : setFeedbackFiles;

    if (action === 'upload') {
      setFiles((prev) => [...prev, file]);
    } else if (action === 'edit') {
      setFiles((prev) => {
        const updatedFiles = prev.map((existingFile: any) => {
          const currentId = existingFile.file_id ?? existingFile.id;
          const updatedId = (file as any).file_id ?? (file as any).id;
          return currentId === updatedId ? { ...existingFile, ...file } : existingFile;
        });
        return updatedFiles;
      });
    }
  }, []);

  // Handle file removal for both feedback and supporting files
  const handleFileRemove = (data: { local_files_to_delete?: string[] }, fileType: 'feedback' | 'supporting') => {
    // Proper type validation to ensure local_files_to_delete is an array with items
    if (Array.isArray(data?.local_files_to_delete) && data.local_files_to_delete.length > NUMBERMAP.ZERO) {
      const setFiles = fileType === 'feedback' ? setFeedbackFiles : setSupportingFiles;
      setFiles((prev) => {
        const updatedFiles = prev.filter((file: { file?: { name?: string } }) => {
          const fileName = file.file?.name?.split('.')[NUMBERMAP.ZERO];
          return !data.local_files_to_delete.includes(fileName);
        });
        return updatedFiles;
      });
    }
  };

  // Custom handler for feedback file upload that checks the limit
  const handleFeedbackFileUpload = useCallback((file: File) => {
    if (feedbackFiles.length >= NUMBERMAP.ONE) {
      showActionAlert(FORM_CONSTANTS.CUSTOM_ALERT, {
        title: FORM_CONSTANTS.UPLOAD_LIMIT_ALERT_TITLE,
        text: FORM_CONSTANTS.UPLOAD_LIMIT_ALERT_TEXT,
        icon: FORM_CONSTANTS.ERROR,
        cancelButton: false,
        confirmButton: false,
      });
      // Reset the FileUploadManager to clear the file from its internal state
      setFeedbackUploadKey(prev => prev + NUMBERMAP.ONE);
      return; // Don't call the original handler
    }
    
    // Clear any previous upload error and proceed with upload
    setFeedbackUploadError('');
    handleFileAction(FORM_CONSTANTS.FILE_TYPE_FEEDBACK, FORM_CONSTANTS.FILE_ACTION_UPLOAD, file);
  }, [feedbackFiles, feedbackFinalFileData, handleFileAction]);

  const processFileData = (fileData: FinalFileData, fileType: string) => {
    const updatedCreateMetaData: Record<string, any> = {};
    const updatedDocumentsToCreate: File[] = [];
    function getFileExtension(object: File) {
      const fileName = object.name;
      return fileName.split('.').pop();
    }
    fileData.documents_to_create.forEach((fileObj) => {
      const uuid = crypto.randomUUID();
      const meta = fileData.create_meta_data[fileObj.name];
      const extension = getFileExtension(fileObj);
      if (meta) {
        const newFileName = `${uuid}.${extension}`;
        updatedCreateMetaData[newFileName] = {
          ...meta,
          file_type: fileType,
        };
        const newFile = new File([fileObj], newFileName, {
          type: fileObj.type,
        });
        updatedDocumentsToCreate.push(newFile);
      }
    });

    return {
      updatedCreateMetaData,
      updatedDocumentsToCreate,
    };
  };

  const validate = useCallback(() => {
    const errors: FormState['errors'] = { ...initialFormState.errors };
    let isValid = true;

    (Object.keys(formState.data) as (keyof FormState['data'])[]).forEach((key) => {
      // Skip validation for basicModel, validationPlaces, and validationDocuments fields
      if (key === 'basicModel' || key === 'validationDocuments') return;
      
      const value = String(formState.data[key] ?? '');
      let processedValue;
      if ([FORM_CONSTANTS.VALIDATION_PLAN_DETAILS, FORM_CONSTANTS.PURPOSE_OF_VALIDATION, FORM_CONSTANTS.FUNCTION_INVOLVED].includes(key)) {
        processedValue = value.replace(FORM_CONSTANTS.REGEX, '').trim();
      } else {
        processedValue = value.trim();
      }
      if (!processedValue) {
        errors[key] = `${fieldLabels[key]} is required`;
        isValid = false;
      }
    });


    // Validate validationPlaces array
    if (!Array.isArray(formState.data.validationPlaces) || formState.data.validationPlaces.length === NUMBERMAP.ZERO) {
      errors.validationPlaces = FORM_CONSTANTS.PLACE_OF_VALIDATION_REQUIRED;
      isValid = false;
    }

    // Validate feedback files
    if (feedbackFiles.length <= NUMBERMAP.ZERO) {
      errors.feedbackFilesError = FORM_CONSTANTS.FEEDBACK_FILES_REQUIRED_ERROR;
      isValid = false;
    }

    setFormState((prev) => ({ ...prev, errors }));
    if (!isValid) {
      validateAndFocusFirstEmptyField(formState.data, Array.from(FIELD_ORDER), FIELD_LABEL_MAP);
    }
    return isValid;
  }, [formState.data, feedbackFiles, feedbackFinalFileData]);

  const handleCancel = () => {
    router.push(ROUTE_PATHS.DND_PROJECT_LIST);
  }

  const handleSave = () => {
    handleSubmit();
  }

  const isAnyLoading = () => {
    if (isLoading) return true
    if (isFetching) return true
    if (postMutation.isPending) return true
    return false
  }

  const handleSubmit = useCallback(() => {
    const isValid = validate();
    if (!isValid) return;

    const {
      updatedCreateMetaData: updatedSupportingCreateMetaData,
      updatedDocumentsToCreate: updatedSupportingDocumentsToCreate,
    } = processFileData(supportingFinalFileData, FILE_TYPE.SUPPORTING);

    const {
      updatedCreateMetaData: updatedFeedbackCreateMetaData,
      updatedDocumentsToCreate: updatedFeedbackDocumentsToCreate,
    } = processFileData(feedbackFinalFileData, FILE_TYPE.FEEDBACK);

    const updatedCreateMetaData = {
      ...updatedSupportingCreateMetaData,
      ...updatedFeedbackCreateMetaData,
    };

    const updatedUpdateMetaData = {
      ...supportingFinalFileData.update_meta_data,
      ...feedbackFinalFileData.update_meta_data,
    };

    const allDocumentsToCreate = [
      ...updatedSupportingDocumentsToCreate,
      ...updatedFeedbackDocumentsToCreate,
    ];

    const allDocumentsToDelete = [
      ...supportingFinalFileData.documents_to_delete,
      ...feedbackFinalFileData.documents_to_delete,
    ];

    const formData = new FormData();
    formData.append(FORM_DATA_KEYS.PROJECT_ID, projectId.toString());
    formData.append(FORM_DATA_KEYS.VALIDATION_PLAN_DETAILS, formState.data.validationPlanDetails);
    formData.append(FORM_DATA_KEYS.PURPOSE_OF_VALIDATION, formState.data.purposeOfValidation);
    formData.append(FORM_DATA_KEYS.UNITS_TO_BE_VALIDATED, formState.data.numberOfUnits);
    formData.append(FORM_DATA_KEYS.FUNCTION, formState.data.functionInvolved);
    formData.append(
      FORM_DATA_KEYS.PLACE_OF_VALIDATION,
      JSON.stringify(
        Array.isArray(formState.data.validationPlaces)
          ? formState.data.validationPlaces.map((row: any) => ({ place: row.place }))
          : []
      )
    );
    formData.append(FORM_DATA_KEYS.PERIOD_OF_USAGE, formState.data.periodOfUsage);
    formData.append(FORM_DATA_KEYS.UNIT_CONFIGURATION, formState.data.unitConfiguration);
    formData.append(
      FORM_DATA_KEYS.STANDARD_DOCUMENTS,
      JSON.stringify(
        Array.isArray(formState.data.validationDocuments)
          ? formState.data.validationDocuments.map((row: any) => ({ document: row.document }))
          : []
      )
    );
    formData.append(FORM_DATA_KEYS.DOCUMENTS_TO_DELETE, JSON.stringify(allDocumentsToDelete));
    formData.append(FORM_DATA_KEYS.CREATE_META_DATA, JSON.stringify(updatedCreateMetaData));
    formData.append(FORM_DATA_KEYS.UPDATE_META_DATA, JSON.stringify(updatedUpdateMetaData));

    allDocumentsToCreate.forEach((file: File) => {
      if (file instanceof File) {
        formData.append(FORM_DATA_KEYS.DOCUMENTS_TO_CREATE, file, file.name);
      }
    });

    postMutation.mutate(formData, {
      onSuccess: () => {
        setFormState(initialFormState);
        setSupportingFiles([]);
        setFeedbackFiles([]);
        setSupportingFinalFileData(INITIAL_FILE_DATA);
        setFeedbackFinalFileData(INITIAL_FILE_DATA);
        setFeedbackUploadError('');
        setFeedbackUploadKey(prev => prev + NUMBERMAP.ONE);
        showActionAlert(SUCCESS);
      },
      onError: (error) => {
        showActionAlert(FAILED);
      },
    });
  }, [
    validate,
    projectId,
    formState,
    supportingFinalFileData,
    feedbackFinalFileData,
    postMutation,
    hasEditPermission,
  ]);

  const modalTitle =
    modalType && modalEditId !== null
      ? MODAL_CONSTANTS[modalType]?.title.edit ?? ''
      : MODAL_CONSTANTS[modalType]?.title.add ?? '';

  const modalInputLabel = MODAL_CONSTANTS[modalType]?.inputLabel ?? '';

  // Helper function to convert empty strings to undefined for nullish coalescing
  const getErrorOrUndefined = (error: string) => error.trim() === '' ? undefined : error;

  return (
      <TableContainer >
      <GlobalLoader loading={isAnyLoading()} />
      {uatData && (
         <>
        <Label title={FORM_CONSTANTS.PAGE_TITLE} />
        <Grid2 container spacing={NUMBERMAP.ONE} sx={P20P40}>
          <Grid2 size={NUMBERMAP.SIX}>
            <InfoField label={FORM_CONSTANTS.LABEL_DESIGN} value={projectReason ?? FORM_CONSTANTS.LABEL_DESIGN} />
          </Grid2>
          <Grid2 size={NUMBERMAP.SIX}>
            <LabelContainer>
              <LabelText>{FORM_CONSTANTS.LABEL_BASIC_MODEL}</LabelText>
              <Tooltip title={formState.data.basicModel ?? '-'} arrow placement="top">
                <TruncatedLabelValue>{formState.data.basicModel ?? '-'}</TruncatedLabelValue>
              </Tooltip>
            </LabelContainer>
          </Grid2>
          <Grid2 size={NUMBERMAP.SIX}>
            <RichTextEditor
              key={FORM_CONSTANTS.KEY_VALIDATION_PLAN_DETAILS}
              label={FORM_CONSTANTS.LABEL_VALIDATION_PLAN_DETAILS}
              placeholder={FORM_CONSTANTS.PLACEHOLDER_VALIDATION_PLAN_DETAILS}
              value={formState.data.validationPlanDetails}
              onChange={(value) => handleChange('validationPlanDetails', value)}
              error={formState.errors.validationPlanDetails}
              id={FIELD_LABEL_MAP.validationPlanDetails}
              disabled={!hasEditPermission}
            />
          </Grid2>
          <Grid2 size={NUMBERMAP.SIX}>
            <RichTextEditor
              key={FORM_CONSTANTS.KEY_PURPOSE_OF_VALIDATION}
              label={FORM_CONSTANTS.LABEL_PURPOSE_OF_VALIDATION}
              placeholder={FORM_CONSTANTS.PLACEHOLDER_PURPOSE_OF_VALIDATION}
              value={formState.data.purposeOfValidation}
              onChange={(value) => handleChange('purposeOfValidation', value)}
              error={formState.errors.purposeOfValidation}
              id={FIELD_LABEL_MAP.purposeOfValidation}
              disabled={!hasEditPermission}
            />
          </Grid2>
          <Grid2 size={NUMBERMAP.SIX}>
            <InputField
              label={FORM_CONSTANTS.LABEL_UNITS_TO_BE_VALIDATED}
              placeholder={FORM_CONSTANTS.PLACEHOLDER_UNITS_TO_BE_VALIDATED}
              value={formState.data.numberOfUnits}
              onChange={(value) =>{
                if(numberValidation.test(value) || value == '') {
                  handleChange('numberOfUnits', value);
                }
              }}
              error={formState.errors.numberOfUnits}
            />
          </Grid2>
          <Grid2 size={NUMBERMAP.SIX}>
            <InputField
              label={FORM_CONSTANTS.LABEL_PERIOD_OF_USAGE}
              placeholder={FORM_CONSTANTS.PLACEHOLDER_PERIOD_OF_USAGE}
              value={formState.data.periodOfUsage}
              onChange={(value) => handleChange('periodOfUsage', value)}
              error={formState.errors.periodOfUsage}
            />
          </Grid2>
          <Grid2 size={NUMBERMAP.SIX}>
            <InputField
              label={FORM_CONSTANTS.LABEL_UNIT_CONFIGURATION}
              placeholder={FORM_CONSTANTS.PLACEHOLDER_UNIT_CONFIGURATION}
              value={formState.data.unitConfiguration}
              onChange={(value) => handleChange('unitConfiguration', value)}
              error={formState.errors.unitConfiguration}
            />
          </Grid2>
          <Grid2 size={NUMBERMAP.SIX}>
            <RichTextEditor
              key={FORM_CONSTANTS.KEY_FUNCTION_INVOLVED}
              label={FORM_CONSTANTS.LABEL_FUNCTION_INVOLVED}
              placeholder={FORM_CONSTANTS.PLACEHOLDER_FUNCTION_INVOLVED}
              value={formState.data.functionInvolved}
              onChange={(value) => handleChange('functionInvolved', value)}
              error={formState.errors.functionInvolved}
              id={FIELD_LABEL_MAP.functionInvolved}
              disabled={!hasEditPermission}
            />
          </Grid2>
          <Grid2 size={NUMBERMAP.SIX}>
            <DataGridTable
              key={`validationPlan-${formState.data.validationPlaces.length}`}
              onAddRow={() => handleOpenModal(VALIDATION_PLAN)}
              onEditRow={(row) => handleEditRow(VALIDATION_PLAN, row)}
              onDeleteRow={(id) => handleDeleteRow(VALIDATION_PLAN, id)}
              showAddButton
              title={FORM_CONSTANTS.TITLE_PLACE_OF_VALIDATION}
              idField="id"
              rows={formState.data.validationPlaces}
              columns={COLUMNS1}
              hideFooter
            />
            {formState.errors.validationPlaces && (
              <ErrorText>
                {formState.errors.validationPlaces}
                </ErrorText>
            )}
          </Grid2>
          <Grid2 size={NUMBERMAP.SIX}>
            <DataGridTable
              key={`standardDoc-${formState.data.validationDocuments.length}`}
              onAddRow={() => handleOpenModal(STANDARD_DOC)}
              onEditRow={(row) => handleEditRow(STANDARD_DOC, row)}
              onDeleteRow={(id) => handleDeleteRow(STANDARD_DOC, id)}
              showAddButton
              title={FORM_CONSTANTS.TITLE_STANDARD_DOCS}
              idField="id"
              rows={formState.data.validationDocuments}
              columns={COLUMNS2}
              hideFooter
            />
          </Grid2>
          <Grid2 size={NUMBERMAP.TWELVE}>
            <div id={FIELD_LABEL_MAP.feedbackFiles}>
            <FileUploadManager
              key={`${FORM_CONSTANTS.KEY_FEEDBACK_FILES}-${feedbackUploadKey}`}
              subHeader={FORM_CONSTANTS.FEEDBACK_UPLOAD_LABEL}
              initialFiles={feedbackFiles}
              onFileUpload={handleFeedbackFileUpload}
              onFileEdit={(file) => handleFileAction('feedback', 'edit', file)}
              hasEditable={!hasEditPermission}
              onSubmit={(data) => {
                setFeedbackFinalFileData((prev) => mergeFinalFileData(prev, data));
                handleFileRemove(data, 'feedback');
                // Clear feedback files error when files are submitted
                setFormState((prev) => ({
                  ...prev,
                  errors: { ...prev.errors, feedbackFilesError: '' }
                }));
                // Clear upload error when files are submitted
                setFeedbackUploadError('');
                setFeedbackUploadKey(prev => prev + NUMBERMAP.ONE);
              }}
              uploadMandError={getErrorOrUndefined(feedbackUploadError) ?? getErrorOrUndefined(formState.errors.feedbackFilesError)}
            />
            </div>
          </Grid2>
          <Grid2 size={NUMBERMAP.TWELVE}>
            <FileUploadManager
              key={FORM_CONSTANTS.KEY_SUPPORTING_FILES}
              initialFiles={supportingFiles}
              onFileUpload={(file) => handleFileAction('supporting', 'upload', file)}
              onFileEdit={(file) => handleFileAction('supporting', 'edit', file)}
              hasEditable={!hasEditPermission}
              onSubmit={(data) => {
                setSupportingFinalFileData((prev) => mergeFinalFileData(prev, data));
                handleFileRemove(data, 'supporting');
              }}
            />
          </Grid2>
        </Grid2>
        <CommonModal
          open={modalOpen}
          onClose={handleModalClose}
          title={modalTitle}
          onSave={handleModalSave}
          buttonRequired
        >
          <Grid2 container spacing={NUMBERMAP.TWO}>
            <Grid2 size={NUMBERMAP.TWELVE}>
              <InputField
                label={modalInputLabel}
                placeholder={'Enter ' + modalInputLabel}
                value={modalInput}
                onChange={setModalInput}
                error={isSaveClicked && !modalInput.trim() ? `${modalInputLabel} is required` : ''}
              />
            </Grid2>
          </Grid2>
        </CommonModal>
        <Grid2 size={NUMBERMAP.TWELVE} sx={BUTTONSTYLE}>
          <CommentsHistory comments={uatData?.meta_info?.task_info?.task_comments } />
          <ReviewerModalManager
            isLoading={isLoading}
            permissions={uatData?.meta_info?.action_control?.permissions ?? []}
            projectId={projectId}
            menuId={uatData?.meta_info?.action_control?.menuId}
            menuName={uatData?.meta_info?.action_control?.formName}
            taskId={uatData?.meta_info?.task_info?.task_id}
            customHandlers={{ 
              handleCancel: handleCancel,
              handleSave: handleSave,
              isDisabled: false
            }}
            onPermissionChange={setHasEditPermission}
            reviewerList={uatData?.meta_info?.task_info?.reviewer_list}
          />
        </Grid2>
        </>
        )}
      </TableContainer>
  );
};

export default UATValidation;