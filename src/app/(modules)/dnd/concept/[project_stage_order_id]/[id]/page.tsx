'use client'
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Grid2 } from '@mui/material';
import {
  InputField,
  Label,
  RichTextEditor,
  showActionAlert,
} from '@/components/ui';
import { Content, Container, FormSection } from '@/styles/modules/dnd/market';
import {
  FORM_FIELDS_CONFIG,
} from '@/constants/modules/dnd/project';
import { GRID_SIZES } from '@/styles/modules/dnd/project';
import FileUploadManager from '@/components/ui/file-upload-v3/FileUploadManager';
import { useGetConcepts, useUpsertConcept } from '@/hooks/modules/dnd/useConcept';
import { useProjectStageByOrderId } from '@/hooks/modules/dnd/useProjectStages';
import { useParams, useRouter } from 'next/navigation';
import { statusOptions, INITIAL_FORM_DATA, INITIAL_ERRORS, INITIAL_FILE_DATA, CONCEPT_CONSTANTS, FIELD_ORDER, FIELD_LABEL_MAP } from '@/constants/modules/dnd/concept';
import { ProjectFormData, FormErrors, DocumentStructure, FileData } from '@/types/modules/dnd/concept';
import { NUMBERMAP } from '@/constants/common';
import { FAILED, SUCCESS } from '@/constants/modules/hr/healthCheckup';
import { UploadedFileData } from '@/types/modules/dnd/hld';
import { mergeFinalFileData } from '@/lib/utils/common';
import CommentsHistory from '@/components/ui/comments-history/Comments';
import GlobalLoader from '@/components/shared/LoadingSpinner';
import ReviewerModalManager from '@/components/modules/dnd/reviewer-modal/ReviewerModalManager';
import { validateAndFocusFirstEmptyField } from '@/lib/utils/formUtils';

interface FormState {
  data: ProjectFormData;
  errors: FormErrors;
}

const ConceptPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const project_stage_order_id = Number(params.project_stage_order_id);
  const projectId = Number(params.id);
  const formRef = useRef<HTMLElement | null>(null);
  const editorRef = useRef<HTMLElement | null>(null);
  const [formState, setFormState] = useState<FormState>({
    data: INITIAL_FORM_DATA,
    errors: INITIAL_ERRORS,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [finalFileData, setFinalFileData] = useState<DocumentStructure>(INITIAL_FILE_DATA);
  const [fileManagerKey, setFileManagerKey] = useState(NUMBERMAP.ZERO);

  const { data: concepts, isLoading: isConceptsLoading, isFetching: isConceptsFetching } = useGetConcepts(project_stage_order_id);
  const { data: stageData, isLoading: isStageLoading, isFetching: isStageFetching } = useProjectStageByOrderId(project_stage_order_id);
  const [hasEditPermission, setHasEditPermission] = useState(true)
  // statusOptions is already an array, no need to destructure or call it
  const upsertMutation = useUpsertConcept(project_stage_order_id);

  // Comprehensive loading state function
  const isAnyLoading = () => {
    if (isConceptsLoading) return true
    if (isConceptsFetching) return true
    if (isStageLoading) return true
    if (isStageFetching) return true
    if (isLoading) return true
    if (upsertMutation.isPending) return true
    return false
  }

  // Populate form fields with API data when concepts are loaded
  useEffect(() => {
    if (isConceptsLoading || !concepts) {
      return;
    }

    if (concepts.data && (concepts.data.description || concepts.data.concept_status || concepts.data.document)) {
      const concept = concepts.data;
      const description = concept.description ?? '';
      const statusFromApi = concept.concept_status_id ?? '';

      setFormState({
        data: {
          product_description: description,
          concept_status_id: statusFromApi,
          document: concepts.data.document,
        },
        errors: INITIAL_ERRORS,
      });
      // setInitialStatus(mappedStatus); // Set initialStatus to the mapped value
      setFileManagerKey(prev => prev + NUMBERMAP.ONE);
    }
  }, [concepts, isConceptsLoading]);

  const handleChange = useCallback((field: keyof ProjectFormData, value: string) => {
    setFormState((prev) => ({
      data: {
        ...prev.data,
        [field]: value ?? '',
      },
      errors: {
        ...prev.errors,
        [field]: '',
      },
    }));
  }, []);

  const handleCancel = () => {
    setFormState({
      data: INITIAL_FORM_DATA,
      errors: INITIAL_ERRORS,
    });
    setFinalFileData(INITIAL_FILE_DATA);
    setFileManagerKey(prev => prev + NUMBERMAP.ONE);
    router.push(CONCEPT_CONSTANTS.PATH);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = { ...INITIAL_ERRORS };
    let isValid = true;

    if (!formState.data.product_description.trim()) {
      newErrors.product_description = CONCEPT_CONSTANTS.DESCRIPTION_REQUIRED;
      isValid = false;
    }

    setFormState((prev) => ({
      ...prev,
      errors: newErrors,
    }));

    // Use validateAndFocusFirstEmptyField for better UX
    if (!isValid) {
      validateAndFocusFirstEmptyField(formState.data, Array.from(FIELD_ORDER), FIELD_LABEL_MAP);
    }

    return isValid;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    setIsLoading(true);

    const formData = new FormData();
    formData.append(CONCEPT_CONSTANTS.PROJECT_STAGE_ORDER_ID, project_stage_order_id.toString());
    formData.append(CONCEPT_CONSTANTS.CONCEPT_DESCRIPTION, formState.data.product_description);
    formData.append(CONCEPT_CONSTANTS.CONCEPT_STATUS_ID, formState.data.concept_status_id ?? 'null')
    formData.append(CONCEPT_CONSTANTS.CREATE_META_DATA, JSON.stringify(finalFileData.create_meta_data));
    formData.append(CONCEPT_CONSTANTS.UPDATE_META_DATA, JSON.stringify(finalFileData.update_meta_data));
    finalFileData.documents_to_create.forEach((file) => {
      formData.append(CONCEPT_CONSTANTS.DOCUMENTS_TO_CREATE, file, file.name);
    });
    formData.append(CONCEPT_CONSTANTS.DOCUMENTS_TO_DELETE, JSON.stringify(finalFileData.documents_to_delete));

    upsertMutation.mutate(formData, {
      onSuccess: () => {
        setFormState({
          data: INITIAL_FORM_DATA,
          errors: INITIAL_ERRORS,
        });
        setFinalFileData(INITIAL_FILE_DATA);
        // Do not reset initialStatus to '' to avoid breaking the mapping
        setFileManagerKey(prev => prev + NUMBERMAP.ONE); // Fix: Increment key properly
        showActionAlert(SUCCESS);
        setIsLoading(false);
      },
      onError: () => {
        showActionAlert(FAILED);
        setIsLoading(false);
      },
    });
  };

  const handleFileUpload = (newFile: File) => {
    setFormState((prev) => ({
      data: {
        ...prev.data,
        document: [...(prev.data.document ?? []), newFile] as File[] | FileDocument[],
      },
      errors: {
        ...prev.errors,
        uploadedFile: '',
      },
    }));
  };

  const handleFileEdit = useCallback((updatedFile: UploadedFileData) => {
    setFormState((prev) => {
      const updatedFiles = prev.data.document.map((file) => {
        const currentId =
          typeof file === 'object'
            ? ((file as File).file_id ?? (file as UploadedFileData).id)
            : undefined;
        const updatedId = updatedFile.document_id ?? updatedFile.id;
        return currentId === updatedId ? { ...file, ...updatedFile } : file;
      });
      return {
        ...prev,
        data: {
          ...prev.data,
          document: updatedFiles,
        },
      };
    });
  }, []);

  const handleFileDelete = (fileData: FileData) => {
    const fileId = fileData.id;
    setFinalFileData((prev) => ({
      ...prev,
      documents_to_delete: [...prev.documents_to_delete, fileId],
      documents_to_create: prev.documents_to_create.filter(
        (file) => file.name !== fileData.name
      ),
    }));
    setFileManagerKey(prev => prev + NUMBERMAP.ONE);
  };

  return (
    <Container>
      <GlobalLoader loading={isAnyLoading()} />
      {concepts && (
        <>
      <Label 
        title={CONCEPT_CONSTANTS.CONCEPT} 
        stageNumber={
          stageData?.data?.dataFetch?.[NUMBERMAP.ZERO]?.[CONCEPT_CONSTANTS.STAGE_NUMBER] ??
          stageData?.data?.[CONCEPT_CONSTANTS.STAGE_NUMBER] ??
          stageData?.[CONCEPT_CONSTANTS.STAGE_NUMBER]
        } 
      />
      <Content>
        <FormSection id={CONCEPT_CONSTANTS.CONCEPT_FORM} ref={formRef}>
          <Grid2 container spacing={NUMBERMAP.ONE}>
            {/* Description Field */}
            <Grid2 size={NUMBERMAP.SIX}>
              <RichTextEditor
                key={CONCEPT_CONSTANTS.KEY}
                ref={editorRef}
                {...FORM_FIELDS_CONFIG.PRODUCT_DESCRIPTION}
                label={CONCEPT_CONSTANTS.LABEL}
                placeholder={CONCEPT_CONSTANTS.ENTER_DESCRIPTION}
                value={formState.data.product_description}
                onChange={(value) => handleChange('product_description', value)}
                error={formState.errors.product_description}
                id={FIELD_LABEL_MAP.product_description}
                disabled={!hasEditPermission}
              />
            </Grid2>

            {/* Status Dropdown */}
            <Grid2 size={GRID_SIZES.HALF_WIDTH}>
              <InputField
                key={`status-${formState.data.concept_status_id}`}
                label={CONCEPT_CONSTANTS.STATUS}
                options={statusOptions ?? []}
                placeholder={CONCEPT_CONSTANTS.SELECT_STATUS}
                value={formState.data.concept_status_id}
                onChange={(value: string) => handleChange('concept_status_id', value)}
                error={formState.errors.concept_status_id}
                keyField={CONCEPT_CONSTANTS.ID}
                valueField={CONCEPT_CONSTANTS.NAME}
                isDropdown
                hasEditable={!hasEditPermission}
              />
            </Grid2>

            {/* File Upload Manager */}
            <Grid2 size={GRID_SIZES.FULL_WIDTH}>
              <FileUploadManager
                key={`file-manager-${fileManagerKey}`}
                initialFiles={formState.data.document as FileDocument[] ?? []}
                onFileUpload={handleFileUpload}
                onFileEdit={handleFileEdit}
                onFileDelete={handleFileDelete}
                hasEditable={!hasEditPermission}
                onSubmit={(data: any) => {
                  setFinalFileData((prev) => mergeFinalFileData(prev, data));
                }}
              />
              <CommentsHistory
                comments={concepts?.meta_info?.task_info?.task_comments}
              />

            </Grid2>
           
          </Grid2>
          
        </FormSection>
        <ReviewerModalManager
            isLoading={isConceptsLoading}
            permissions={concepts?.meta_info?.action_control?.permissions ?? []}
            projectId={projectId}
            menuId={concepts?.meta_info?.action_control?.menuId}
            menuName={concepts?.meta_info?.action_control?.formName}
            taskId={concepts?.meta_info?.task_info?.task_id}
            customHandlers={{ handleCancel: handleCancel,
              handleSave: handleSubmit,
              isDisabled: upsertMutation.isPending}}
            onPermissionChange={setHasEditPermission}
            reviewerList={concepts?.meta_info?.task_info?.reviewer_list}
          />
      </Content>
      </>
      )}
    </Container>
  );
};

export default ConceptPage;