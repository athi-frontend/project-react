"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Grid2 } from "@mui/material";
import {
  InputField,
  Label,
  RichTextEditor,
  showActionAlert
} from "@/components/ui";
import SalesReviewerModalManager from '@/components/modules/sales/reviewer-modal/SalesReviewerModalManager';
import CommentsHistory from '@/components/ui/comments-history/Comments';
import { INFRASTRUCTURE_CONTEXT_TYPE } from '@/constants/commonContextType';
import { ButtonContainer } from "@/styles/components/ui/button";
import {
  FormContainer,
  FormContent,
  FormWrapper,
} from "@/styles/modules/user/userOnboard";
import { STYLE5 } from "@/styles/modules/hr/candidateEvaluation";
import { NUMBERMAP, BUTTON_LABEL, DATE_FORMATS, FINALFILEINITIALDATA ,PERMISSION_ACTIONS} from "@/constants/common";
import FileUploadManager from "@/components/ui/file-upload-v3/FileUploadManager";
import { FileDocument } from "@/types/components/ui/fileUploadV3";
import DatePicker from "@/components/ui/data-picker/DataPicker";
import dayjs, { Dayjs } from "dayjs";
import { useRouter, useParams } from "next/navigation";
import {
  useInfrastructureCategories,
  useInfrastructureTypes,
  useInfrastructureRequestById,
  useUpsertInfrastructureRequest,
} from "@/hooks/modules/infrastructure-management/useInfrastructureRequest";
import { useOrganizationStatus } from "@/hooks/useCommonDropdown";
import GlobalLoader from "@/components/shared/LoadingSpinner";
import {
  INFRASTRUCTURE_REQUEST_CONSTANTS,
  API_FIELD_KEYS,
  FORM_FIELD_NAMES,
  INITIAL_FORM_DATA,
  INITIAL_ERRORS,
  InfrastructureFormData,
  CREATE,
  VALIDATION_MESSAGES,
  FORM_LABELS,
  FORM_PLACEHOLDERS,
  DROPDOWN_FIELD_KEYS,
  PAGE_TITLES,
} from "@/constants/modules/infrastructure-management/infrastructureRequest";
import { formatDate, normalizeFormatString, stripHtml, mergeFinalFileData, FinalFileData, convertMuiDayjsToUTC } from "@/lib/utils/common";
import { useSelector } from "react-redux";
import { selectProfileData } from "@/store/slices/menuSlice";
import { FAILED_ALERT, SUCCESS_ALERT } from "@/constants/modules/dnd/formTeam";
import { useDraftSave } from '@/hooks/common/useDraftSave';
import { prepareDraftDocumentsGeneric } from '@/lib/utils/modules/hr/draftDocumentsCommon';
import { processDraftPreparation, removeFieldsFromFormData, appendFileMetadataToFormData, createFileMetadataGenerator } from '@/lib/utils/modules/sales/draftSaveCommon';
import DraftLoading from '@/components/ui/draft-loader/DraftLoader';

/**
 * Classification : Confidential
 **/

interface ProfileData {
  organization_date_format?: string;
}

const InfrastructureRequestFormPage: React.FC = () => {
  const router = useRouter();
  const { id } = useParams();
  const isAddMode = id === CREATE
  const infrastructureRequestId =
    isAddMode || !id || Number.isNaN(Number(id))
      ? null
      : Number(id);
  const initialDraftLoading = useRef(true);

  const profileData = useSelector(selectProfileData) as ProfileData | null;
  const orgDateFormat = profileData?.organization_date_format
    ? normalizeFormatString(profileData.organization_date_format)
    : DATE_FORMATS.DD_MM_YYYY;

  const [formData, setFormData] = useState<InfrastructureFormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<typeof INITIAL_ERRORS>(INITIAL_ERRORS);
  const [requiredDate, setRequiredDate] = useState<Dayjs | null>(null);
  const [finalFileData, setFinalFileData] = useState<FinalFileData>(FINALFILEINITIALDATA);
  const [showFileValidationError, setShowFileValidationError] = useState(false);
  const [draftDocuments, setDraftDocuments] = useState<Record<string, any[]>>({});
  const [draftDelete, setDraftDelete] = useState<string[]>([]);
  const [hasEditPermission, setHasEditPermission] = useState<boolean>(false);
  const isCreateMode = isAddMode;

  // Draft save hook
  const infrastructureRequestIdForDraft = isAddMode ? null : infrastructureRequestId;
  const { draftSave, clearDraftSave, isDraftSaving, draftData, fetchDraft, checkUnsavedDraftBeforeLeave } = useDraftSave({
    context_type: INFRASTRUCTURE_REQUEST_CONSTANTS.CONTEXT_TYPE,
    context_instance_id: infrastructureRequestIdForDraft,
    enableFetch: false
  });

  // Fetch infrastructure request data by ID (only in edit mode)
  const { data: infrastructureRequestData, isLoading, refetch: refetchInfrastructureRequest } =
    useInfrastructureRequestById(infrastructureRequestId ?? NUMBERMAP.ZERO,true);

  // Mutation hook for save
  const upsertMutation = useUpsertInfrastructureRequest();

  // Fetch dropdown data
  const { data: categoriesData } = useInfrastructureCategories(NUMBERMAP.ONE);
  const categoryId = formData[FORM_FIELD_NAMES.INFRASTRUCTURE_CATEGORY]
    ? Number(formData[FORM_FIELD_NAMES.INFRASTRUCTURE_CATEGORY])
    : undefined;
  const { data: typesData } = useInfrastructureTypes(categoryId, !!categoryId);
  const { data: statusData } = useOrganizationStatus();

  // Helper function to load form data from API response
  const loadFormDataFromApi = useCallback((data: any) => {
    if (!data) return;
    setFormData({
      infrastructureCategory: data.category_id?.toString() ?? "",
      infrastructureType: data.type_id?.toString() ?? "",
      infrastructureName: stripHtml(data.infrastructure_name ?? "").trim(),
      description: data.description ?? "",
      specification: data.specification ?? "",
      requiredDate: data.required_date
        ? formatDate(data.required_date) ?? ""
        : "",
      status: data.status?.toString() ?? "",
    });

    // Set date picker value
    if (data.required_date) {
      const formattedDate = formatDate(data.required_date);
      if (formattedDate) {
        setRequiredDate(dayjs(formattedDate, orgDateFormat));
      }
    }

    // Load documents for file upload manager
    if (data.documents && data.documents.length > NUMBERMAP.ZERO) {
      setFormData((prev) => ({
        ...prev,
        documents: data.documents,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        documents: [],
      }));
    }
  }, [orgDateFormat]);

  // Fetch draft on mount
  useEffect(() => {
    fetchDraft();
  }, [infrastructureRequestId, fetchDraft]);

  const loadDraftData = (data: any) => {
    setFormData({
      ...data,
       documents: [...(data?.draftDocuments?.documents ?? []), ...(data?.documents ?? [])],
    });
    if (data.requiredDate) {
      const formattedDate = formatDate(data.requiredDate);
      if (formattedDate) {
        setRequiredDate(dayjs(formattedDate, orgDateFormat));
      }
    }
    setDraftDocuments(data?.draftDocuments ?? {});
    setDraftDelete(Array.isArray(data?.draftDelete) ? data.draftDelete : []);
  }

  // Update form data when API data is loaded (for edit mode)
  useEffect(() => {
    if (isAddMode) {
      // Reset form for create mode when no data
      if (!formData.infrastructureCategory) {
        setFormData(INITIAL_FORM_DATA);
      }
      initialDraftLoading.current = false;
    } else if (infrastructureRequestData?.data) {
      // Handle both array and object responses
      if (Array.isArray(infrastructureRequestData.data) && infrastructureRequestData.data.length > NUMBERMAP.ZERO) {
        loadFormDataFromApi(infrastructureRequestData.data[NUMBERMAP.ZERO]);
        initialDraftLoading.current = false;
      } else if (!Array.isArray(infrastructureRequestData.data)) {
        loadDraftData(infrastructureRequestData.data);
        initialDraftLoading.current = false;
      }
    }
  }, [infrastructureRequestData]);

  // Load draft data
  useEffect(() => {
    if (draftData?.data) {
      loadDraftData(draftData.data);
      initialDraftLoading.current = false;
    }
  }, [draftData]);

  const handleDraftSave = (formDataToSave: InfrastructureFormData, fileData?: FinalFileData) => {
    const finalFileDataValue = fileData ?? finalFileData
    let draftDatas = draftData?.data ? draftData : infrastructureRequestData

    const draftConfig = {
      fileFieldToSectionMap: { 'documents': 'documents' },
      sectionTypeToNameMap: { 'documents': 'documents' },
      responseDataKeyMap: { 'documents': 'documents' },
    }

    const draftPreparation = prepareDraftDocumentsGeneric(
      draftDocuments,
      draftDelete,
      { ...formDataToSave, documents: formDataToSave.documents ?? [] },
      { documents: finalFileDataValue ?? FINALFILEINITIALDATA },
      draftDatas,
      draftConfig
    )

    processDraftPreparation(draftPreparation, setDraftDocuments, setDraftDelete);

    const fieldsToRemove = ['documents']
    const cleaned = removeFieldsFromFormData(formDataToSave, fieldsToRemove)

    const payload = {
      id: infrastructureRequestIdForDraft ?? new Date().getTime(),
      ...cleaned,
      draftDocuments: draftPreparation.draftDocuments,
      draftDelete: draftPreparation.draftDelete,
      type: 'draft',
    }

    // Merge updateMetaData and draftUpdateMetaData for draft saves
    // Both contain section-based metadata (e.g., { documents: { fileId: metadata } })
    const mergedUpdateMetaData: Record<string, any> = {};
    
    // Copy updateMetaData first
    if (draftPreparation.updateMetaData) {
      Object.keys(draftPreparation.updateMetaData).forEach(sectionKey => {
        mergedUpdateMetaData[sectionKey] = {
          ...(mergedUpdateMetaData[sectionKey] ?? {}),
          ...(draftPreparation.updateMetaData[sectionKey] ?? {}),
        };
      });
    }
    
    // Merge draftUpdateMetaData (draft-only updates)
    if (draftPreparation.draftUpdateMetaData) {
      Object.keys(draftPreparation.draftUpdateMetaData).forEach(sectionKey => {
        mergedUpdateMetaData[sectionKey] = {
          ...(mergedUpdateMetaData[sectionKey] ?? {}),
          ...(draftPreparation.draftUpdateMetaData[sectionKey] ?? {}),
        };
      });
    }

    draftSave({
      form_type: INFRASTRUCTURE_REQUEST_CONSTANTS.CONTEXT_TYPE,
      form_data: payload,
      upload_documents: {
        documents_to_create: finalFileDataValue?.documents_to_create ?? [],
        create_meta_data: draftPreparation.createMetaData,
        update_meta_data: mergedUpdateMetaData,
        documents_to_delete: [],
        documents_to_preserve: draftPreparation?.documentsToPreserve ?? [],
      },
    })
  }

  const handleInputChange = (field: keyof InfrastructureFormData, value: string) => {
    if (!isCreateMode && !hasEditPermission) return;
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };
      // Reset dependent fields when parent field changes
      if (field === FORM_FIELD_NAMES.INFRASTRUCTURE_CATEGORY) {
        newData[FORM_FIELD_NAMES.INFRASTRUCTURE_TYPE] = "";
      }

      if (!initialDraftLoading.current) {
        handleDraftSave(newData);
      }

      return newData;
    });

    // Clear error for the changed field
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  // Helper function to validate required fields
  const validateRequiredFields = (errors: typeof INITIAL_ERRORS) => {
    const fieldValidations = [
      { field: FORM_FIELD_NAMES.INFRASTRUCTURE_CATEGORY, message: VALIDATION_MESSAGES.INFRASTRUCTURE_CATEGORY_REQUIRED },
      { field: FORM_FIELD_NAMES.INFRASTRUCTURE_TYPE, message: VALIDATION_MESSAGES.INFRASTRUCTURE_TYPE_REQUIRED },
      { field: FORM_FIELD_NAMES.INFRASTRUCTURE_NAME, message: VALIDATION_MESSAGES.INFRASTRUCTURE_NAME_REQUIRED },
      { field: FORM_FIELD_NAMES.DESCRIPTION, message: VALIDATION_MESSAGES.DESCRIPTION_REQUIRED, isRichText: true },
      { field: FORM_FIELD_NAMES.SPECIFICATION, message: VALIDATION_MESSAGES.SPECIFICATION_REQUIRED, isRichText: true },
      { field: FORM_FIELD_NAMES.REQUIRED_DATE, message: VALIDATION_MESSAGES.REQUIRED_DATE_REQUIRED },
      { field: FORM_FIELD_NAMES.STATUS, message: VALIDATION_MESSAGES.STATUS_REQUIRED },
    ];

    fieldValidations.forEach(({ field, message, isRichText }) => {
      let value = formData[field] ?? '';
      // Convert to string if not already a string
      if (typeof value !== 'string') {
        value = String(value ?? '');
      }
      // For RichTextEditor fields, strip HTML before checking if empty
      if (isRichText) {
        value = stripHtml(value).trim();
      } else {
        value = value.trim();
      }
      if (!value) {
        errors[field] = message;
      }
    });
  };


  const validateForm = () => {
    const newErrors = { ...INITIAL_ERRORS };
    let isValid = true;

    validateRequiredFields(newErrors);

    // Validate file upload (following clinical-evaluation pattern)
    if (
      !formData.documents ||
      formData.documents.length === NUMBERMAP.ZERO
    ) {
      newErrors.documents = VALIDATION_MESSAGES.FILE_UPLOAD_REQUIRED;
      isValid = false;
    }

    setErrors(newErrors);
    
    // Show file validation error when save is clicked
    setShowFileValidationError(true);

    // Check if there are any non-empty error messages
    const hasErrors = Object.values(newErrors).some(error => error !== '');
    return !hasErrors && isValid;
  };

  const createFileMetadata = createFileMetadataGenerator({
    isEditMode: !isAddMode,
    draftData,
    existingData: infrastructureRequestData,
    finalFileData,
    dataPath: 'documents',
  });

  // Helper function to prepare FormData for API
  const prepareFormDataForAPI = () => {
    const formDataForAPI = new FormData();

    // Add infrastructure_request_id if in edit mode
    if (!isAddMode && infrastructureRequestId) {
      formDataForAPI.append(API_FIELD_KEYS.INFRASTRUCTURE_REQUEST_ID, infrastructureRequestId.toString());
    }

    // Add form fields
    formDataForAPI.append(API_FIELD_KEYS.CATEGORY_ID, formData[FORM_FIELD_NAMES.INFRASTRUCTURE_CATEGORY]);
    formDataForAPI.append(API_FIELD_KEYS.TYPE_ID, formData[FORM_FIELD_NAMES.INFRASTRUCTURE_TYPE]);
    formDataForAPI.append(API_FIELD_KEYS.INFRASTRUCTURE_NAME, formData[FORM_FIELD_NAMES.INFRASTRUCTURE_NAME].trim());
    formDataForAPI.append(API_FIELD_KEYS.DESCRIPTION, formData[FORM_FIELD_NAMES.DESCRIPTION]);
    formDataForAPI.append(API_FIELD_KEYS.SPECIFICATION, formData[FORM_FIELD_NAMES.SPECIFICATION]);
    formDataForAPI.append(API_FIELD_KEYS.REQUIRED_DATE, convertMuiDayjsToUTC(requiredDate) ?? '' );
    formDataForAPI.append(API_FIELD_KEYS.STATUS_ID, formData[FORM_FIELD_NAMES.STATUS]);

    // Handle file uploads and append file metadata
    appendFileMetadataToFormData(formDataForAPI, finalFileData, createFileMetadata);

    return formDataForAPI;
  };
  

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    // Clear draft on successful save
    clearDraftSave();

    const formDataForAPI = prepareFormDataForAPI();

    upsertMutation.mutate({
      payload: formDataForAPI,
      infrastructureRequestId: infrastructureRequestId,
    }, {
      onSuccess: () => {
        showActionAlert(SUCCESS_ALERT);
        setFinalFileData(FINALFILEINITIALDATA);
        // Refetch infrastructure request data if in edit mode
        if (infrastructureRequestId) {
          refetchInfrastructureRequest();
        }
        // Redirect to infrastructure request list page after successful save
        router.push(INFRASTRUCTURE_REQUEST_CONSTANTS.PATH);
      },
      onError: () => {
        showActionAlert(FAILED_ALERT);
      },
    });
  };

  const handleCancel = async () => {
    await checkUnsavedDraftBeforeLeave();
    router.push(INFRASTRUCTURE_REQUEST_CONSTANTS.PATH);
  };

  const handleFileEdit = useCallback((documents) => {
    if (!isCreateMode && !hasEditPermission) return;
    setFormData((prev) => {
      const updatedFiles = (prev.documents ?? []).map((file) => {
        const currentId =
          typeof file === 'object'
            ? ((file as FileDocument).file_id ?? (file as FileDocument).id)
            : undefined;
        const updatedId = documents.document_id ?? documents.id;

        return currentId === updatedId ? { ...file, ...documents } : file;
      });

      return {
        ...prev,
        documents: updatedFiles,
      };
    });
  }, [isCreateMode, hasEditPermission]);

  // Handle file removal (following clinical-evaluation pattern)
  const handleFileRemove = (data: any) => {
    if (data?.local_files_to_delete?.length > NUMBERMAP.ZERO) {
      setFormData((prev) => {
        const updatedDocs = (prev.documents ?? []).filter((file: any) => {
          const fileName = file?.file?.name?.split('.')[NUMBERMAP.ZERO];
          return !data.local_files_to_delete.includes(fileName);
        });
        return {
          ...prev,
          documents: updatedDocs as (File | FileDocument)[],
        };
      });
    }
   
    if (data?.documents_to_delete?.length > NUMBERMAP.ZERO) {
      setFormData((prev) => {
        const updatedDocs = (prev.documents ?? []).filter((file: any) => {
          const fileId = (file as FileDocument)?.file_id ?? (file as FileDocument)?.id;
          return !data.documents_to_delete.includes(fileId);
        });
        return {
          ...prev,
          documents: updatedDocs as (File | FileDocument)[],
        };
      });
    }
  };

  const handleFileUpload = (newFile: File) => {
    if (!isCreateMode && !hasEditPermission) return;
    const documents = formData?.documents ?? [];
    setFormData((prev) => ({
      ...prev,
      documents: [...documents, newFile],
    }));
    // Clear error when file is uploaded (following clinical-evaluation pattern)
    setErrors((prev) => ({
      ...prev,
      documents: '',
    }));
  };

  const handleFileUploadSubmit = (fileData: any) => {
    // Merge file data from FileUploadManager using the utility function
    setFinalFileData((prev) => mergeFinalFileData(prev, fileData));
    if (!initialDraftLoading.current) {
      handleDraftSave(formData, mergeFinalFileData(finalFileData, fileData));
    }
  };

  const handleRequiredDateChange = (date: Dayjs | null) => {
    if (!isCreateMode && !hasEditPermission) return;
    setRequiredDate(date);
    const dateValue = date?.toISOString() ?? '';
    setFormData((prev) => {
      const updated = { ...prev, [FORM_FIELD_NAMES.REQUIRED_DATE]: dateValue };
      if (!initialDraftLoading.current) {
        handleDraftSave(updated);
      }
      return updated;
    });
    // Clear error when date is selected
    setErrors((prev) => ({ ...prev, [FORM_FIELD_NAMES.REQUIRED_DATE]: "" }));
  };
  return (
    <FormContainer>
      <FormWrapper>
        {isDraftSaving && <DraftLoading />}
        <GlobalLoader loading={isLoading} />
        <Label title={PAGE_TITLES.FORM} />

        <FormContent>
          <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InputField
                label={FORM_LABELS.INFRASTRUCTURE_CATEGORY}
                placeholder={FORM_PLACEHOLDERS.INFRASTRUCTURE_CATEGORY}
                isDropdown
                value={formData[FORM_FIELD_NAMES.INFRASTRUCTURE_CATEGORY]}
                onChange={(value: string) => handleInputChange(FORM_FIELD_NAMES.INFRASTRUCTURE_CATEGORY, value)}
                options={categoriesData?.data ?? []}
                error={errors[FORM_FIELD_NAMES.INFRASTRUCTURE_CATEGORY]}
                keyField={DROPDOWN_FIELD_KEYS.CATEGORY_ID}
                valueField={DROPDOWN_FIELD_KEYS.CATEGORY_NAME}
                disabled={!isCreateMode && !hasEditPermission}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InputField
                label={FORM_LABELS.INFRASTRUCTURE_TYPE}
                placeholder={FORM_PLACEHOLDERS.INFRASTRUCTURE_TYPE}
                isDropdown
                value={formData[FORM_FIELD_NAMES.INFRASTRUCTURE_TYPE]}
                onChange={(value: string) => handleInputChange(FORM_FIELD_NAMES.INFRASTRUCTURE_TYPE, value)}
                options={typesData?.data ?? []}
                error={errors[FORM_FIELD_NAMES.INFRASTRUCTURE_TYPE]}
                disabled={(!formData[FORM_FIELD_NAMES.INFRASTRUCTURE_CATEGORY] && !errors[FORM_FIELD_NAMES.INFRASTRUCTURE_TYPE]) || (!isCreateMode && !hasEditPermission)}
                keyField={DROPDOWN_FIELD_KEYS.TYPE_ID}
                valueField={DROPDOWN_FIELD_KEYS.TYPE_NAME}
              />
            </Grid2>
          </Grid2>

          <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InputField
                label={FORM_LABELS.INFRASTRUCTURE_NAME}
                placeholder={FORM_PLACEHOLDERS.INFRASTRUCTURE_NAME}
                value={formData[FORM_FIELD_NAMES.INFRASTRUCTURE_NAME]}
                onChange={(value: string) => handleInputChange(FORM_FIELD_NAMES.INFRASTRUCTURE_NAME, value)}
                error={errors[FORM_FIELD_NAMES.INFRASTRUCTURE_NAME]}
                disabled={!isCreateMode && !hasEditPermission}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <RichTextEditor
                label={FORM_LABELS.DESCRIPTION}
                value={formData[FORM_FIELD_NAMES.DESCRIPTION]}
                onChange={(value: string) => handleInputChange(FORM_FIELD_NAMES.DESCRIPTION, value)}
                error={errors[FORM_FIELD_NAMES.DESCRIPTION]}
                disabled={!isCreateMode && !hasEditPermission}
              />
            </Grid2>
          </Grid2>

          <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <RichTextEditor
                label={FORM_LABELS.SPECIFICATION}
                value={formData[FORM_FIELD_NAMES.SPECIFICATION]}
                onChange={(value: string) => handleInputChange(FORM_FIELD_NAMES.SPECIFICATION, value)}
                error={errors[FORM_FIELD_NAMES.SPECIFICATION]}
                disabled={!isCreateMode && !hasEditPermission}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <DatePicker
                label={FORM_LABELS.REQUIRED_DATE}
                value={requiredDate}
                onChange={handleRequiredDateChange}
                error={errors[FORM_FIELD_NAMES.REQUIRED_DATE]}
                minDate={dayjs()}
                readOnly={true}
              />
            </Grid2>
          </Grid2>

          <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InputField
                label={FORM_LABELS.STATUS}
                placeholder={FORM_PLACEHOLDERS.STATUS}
                isDropdown
                value={formData[FORM_FIELD_NAMES.STATUS]?.toString() ?? ""}
                onChange={(value: string) => handleInputChange(FORM_FIELD_NAMES.STATUS, value)}
                options={statusData?.data ?? []}
                error={errors[FORM_FIELD_NAMES.STATUS]}
                keyField={DROPDOWN_FIELD_KEYS.STATUS_ID}
                valueField={DROPDOWN_FIELD_KEYS.STATUS_NAME}
                disabled={!isCreateMode && !hasEditPermission}
              />
            </Grid2>
          </Grid2>

          <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
            <Grid2 size={NUMBERMAP.TWELVE}>
              <FileUploadManager
                initialFiles={formData?.documents??[]}
                onSubmit={(data) => {
                  handleFileUploadSubmit(data);
                  handleFileRemove(data);
                }}
                onFileEdit={handleFileEdit}
                onFileUpload={handleFileUpload}
                subHeader={FORM_LABELS.FILE_UPLOAD}
                uploadMandError={errors.documents}
                isRequired={true}
                requiredErrorMessage={VALIDATION_MESSAGES.FILE_UPLOAD_REQUIRED}
                showValidationError={showFileValidationError}
                onValidationChange={(isValid) => {
                  // Only clear validation error display when file becomes valid (has files)
                  // Keep it true if invalid (no files) so error shows on next save attempt
                  if (isValid) {
                    setShowFileValidationError(false);
                  }
                }}
                hasEditable={!isCreateMode && !hasEditPermission}
              />
            </Grid2>
          </Grid2>

          {/* Comments History */}
          {!!infrastructureRequestId && (
            <Grid2 container spacing={NUMBERMAP.TWO} sx={{ mt: 2 }}>
              <Grid2 size={NUMBERMAP.TWELVE}>
                <CommentsHistory 
                  comments={((infrastructureRequestData as any)?.meta_info?.task_info?.task_comments ?? [])} 
                />
              </Grid2>
            </Grid2>
          )}

          <ButtonContainer>
            <SalesReviewerModalManager
              module = 'infrastructure'
              isLoading={isLoading}
              permissions={((infrastructureRequestData as any)?.meta_info?.action_control?.permissions ?? (isCreateMode ? [{action: BUTTON_LABEL.SAVE}, {action: BUTTON_LABEL.CANCEL}, {action: PERMISSION_ACTIONS.VIEW}] : []))}
              taskInfo={((infrastructureRequestData as any)?.meta_info?.task_info ?? { task_comments: [], reviewer_list: [], task_id: undefined })}
              menuId={(infrastructureRequestData as any)?.meta_info?.action_control?.menuId}
              menuName={(infrastructureRequestData as any)?.meta_info?.action_control?.formName}
              contextType={INFRASTRUCTURE_CONTEXT_TYPE.INFRASTRUCTURE_REQUEST}
              contextId={infrastructureRequestId ?? NUMBERMAP.ZERO}
              customHandlers={{
                handleCancel: handleCancel,
                handleSave: handleSave,
              }}
              onPermissionChange={setHasEditPermission}
              refetch={refetchInfrastructureRequest}
              hideSaveButton={false}
            />
          </ButtonContainer>
        </FormContent>
      </FormWrapper>
    </FormContainer>
  );
};

export default InfrastructureRequestFormPage;