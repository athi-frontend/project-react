'use client';
import React, { useState, useEffect } from 'react';
import {
  useDIRs,
  useExecutionStages,
  useSaveDirData,
  useFunctionalBlockTypes
} from '@/hooks/modules/dnd/useDir';
import {
  FormContainer,
  FormHeader,
  FormTitle,
  FormSection,
  ContentContainer,
  LabelText,
  ValueText,
  RadioGroupWrapper,
  radioGroupWrapperStyles,
  CommentsHistoryContainer
} from '@/styles/modules/dnd/dir';
import {
  initialFormState,
  referenceOptions,
} from '@/lib/modules/dnd/dir';
import {
  FORM_TITLES,
  FIELD_LABELS,
  PLACEHOLDERS, DIR_INFO,
  ROUTES
} from '@/constants/modules/dnd/dir';
import { Grid2 } from '@mui/material';
import { RadioButtonGroup, showActionAlert, MultiSelect } from '@/components/ui';
import RichTextEditor from '@/components/ui/rich-text-editor/RichTextEditor';
import { useParams, useRouter } from 'next/navigation';
import { NUMBERMAP } from '@/constants/common';
import ReviewerModalManager from '@/components/modules/dnd/reviewer-modal/ReviewerModalManager';
import GlobalLoader from '@/components/shared/LoadingSpinner';
import CommentsHistory from '@/components/ui/comments-history/Comments';
import { BUTTONSTYLE } from '@/constants/modules/dnd/digSpecificaton';
import { stripHtml } from '@/lib/utils/common';
import { validateAndFocusFirstEmptyField } from '@/lib/utils/formUtils';

/**
    Classification : Confidential
**/
const DirInformationForm: React.FC = () => {
  const [formState, setFormState] = useState(initialFormState);
  const [executionStageOptions, setExecutionStageOptions] = useState<any[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [hasEditPermission, setHasEditPermission] = useState(true);

  const params = useParams();
  const router = useRouter();
  const dir_id = Number(params.dirId); // First parameter is dirId (specification_id)
  const project_id = Number(params.id); // Second parameter is projectId
  
  const { data: dirData, isLoading: isLoadingDirData, isFetching: isFetchingDirData } = useDIRs(dir_id);
  const { data: executionStages, isLoading: isLoadingExecutionStages, isFetching: isFetchingExecutionStages } = useExecutionStages(project_id);
  const { data: functionalBlockTypes, isLoading: isLoadingFunctionalBlockTypes, isFetching: isFetchingFunctionalBlockTypes } = useFunctionalBlockTypes();
  const { mutate: saveDir, isPending: isSaving } = useSaveDirData();

   // Comprehensive loading state function
   const isAnyLoading = () => {
    if (isLoadingDirData) return true
    if (isFetchingDirData) return true
    if (isLoadingExecutionStages) return true
    if (isFetchingExecutionStages) return true
    if (isLoadingFunctionalBlockTypes) return true
    if (isFetchingFunctionalBlockTypes) return true
    if (isSaving) return true
    return false
  }


  useEffect(() => {
    /**
     * Description: Transform the stages to include a combined display value,
     * Author: Prithiviraj,
     * Created: 01-09-2025,
     * Classification : Confidential
    **/
    if (executionStages) {
      const stages = Array.isArray(executionStages) ? executionStages : executionStages.data ?? [];
      const transformedStages = stages.map((stage: any) => ({
        ...stage,
        display_value: `${stage.design_stage} ${stage.stage_number}`
      }));
      setExecutionStageOptions(transformedStages);
    }
  }, [executionStages]);

  useEffect(() => {
    /**
     * Description: set form data from api,
     * Author: Prithiviraj,
     * modified: 23-08-2025,
     * Classification : Confidential
    **/
    if (dirData) {
      const fetchedData = dirData.data;
      const declaration = fetchedData.declaration?.[NUMBERMAP.ZERO];
      
      setFormState({
        dirName: fetchedData.dir_name ?? '',
        dirId: fetchedData.dir_id ?? '',
        dirCategory: fetchedData.specification_parameter ?? '',
        functional_block_type_id: fetchedData.functional_block_type_id ?? NUMBERMAP.ZERO,
        stage: fetchedData.status === 1 ? DIR_INFO.STATUS.ACTIVE : DIR_INFO.STATUS.INACTIVE,
        owner: `${fetchedData.owner_first_name ?? ''} ${fetchedData.owner_last_name ?? ''}`.trim() ?? '',
        softwareUnit: fetchedData.functional_block_type_id?.toString() ?? '',
        moduleSubmodule: fetchedData.blocks?.functional_block_title ?? '',
        hardwareSoftwareOther: fetchedData.functional_block_type_id?.toString() ?? '',
        referenceToExistingDir: fetchedData.dir_reference?.toString() ?? '',
        dirNumber: fetchedData.reference_dirs?.[NUMBERMAP.ZERO]?.toString() ?? '',
        allocateExecutionStage: fetchedData.execution_stage ?? [],
        allocateVerificationStage: fetchedData.verification_stage ?? [],
        reasonForCreating: fetchedData.dir_creation_reason ?? '',
        dirSpecification: fetchedData.dig_specification ?? '',
        dirDescription: fetchedData.dir_description ?? '',
        verificationMethod: fetchedData.verification_method ?? '',
        verificationPlan: '',
        comments: fetchedData.comments ?? '',
        isDirConflict: declaration?.is_dir_conflict ?? NUMBERMAP.ZERO,
        conflictingDirId: declaration?.conflicting_dir?.map((id: number) => id.toString()) ?? [],
        conflictRemarks: declaration?.is_dir_conflict_remarks ?? '',
        isDirUnambiguous: declaration?.is_dir_unambiguous ?? NUMBERMAP.ZERO,
        unambiguousRemarks: declaration?.is_dir_unambiguous_remarks ?? '',
        isDirVerifiable: declaration?.is_dir_verifiable ?? NUMBERMAP.ZERO,
        verifiableRemarks: declaration?.is_dir_verifiable_remarks ?? '',
        isDirComplete: declaration?.is_dir_complete ?? NUMBERMAP.ZERO,
        completeRemarks: declaration?.is_dir_complete_remarks ?? '',
      });
    }
  }, [dirData]);


  const handleInputChange = (field: string, value: string | string[]) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  // Permission-based field change handler
  const handleFieldChangeWithPermission = (field: string, value: string | string[]) => {
    if (!hasEditPermission) return
    handleInputChange(field, value)
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    const isRichTextEmpty = (value: string) => {
      const strippedValue = value.trim();
      return !strippedValue;
    };

    if (!formState.hardwareSoftwareOther) {
      newErrors.hardwareSoftwareOther = DIR_INFO.VALIDATION_MESSAGES.FUNCTIONAL_BLOCK_TYPE;
    }
    if (!formState.referenceToExistingDir?.trim()) {
      newErrors.referenceToExistingDir = DIR_INFO.VALIDATION_MESSAGES.REFERENCE_DIR;
    }
    if (!formState.allocateExecutionStage || (Array.isArray(formState.allocateExecutionStage) && formState.allocateExecutionStage.length === NUMBERMAP.ZERO)) {
      newErrors.allocateExecutionStage = DIR_INFO.VALIDATION_MESSAGES.EXECUTION_STAGE;
    }
    if (isRichTextEmpty(formState.reasonForCreating)) {
      newErrors.reasonForCreating = DIR_INFO.VALIDATION_MESSAGES.REASON_FOR_CREATING;
    }
    if (isRichTextEmpty(formState.verificationMethod)) {
      newErrors.verificationMethod = DIR_INFO.VALIDATION_MESSAGES.VERIFICATION_METHOD;
    }

    setErrors(newErrors);
    
    // Use validateAndFocusFirstEmptyField for focus management
    if (Object.keys(newErrors).length > NUMBERMAP.ZERO) {
      validateAndFocusFirstEmptyField(formState, DIR_INFO.FIELD_ORDER, DIR_INFO.FIELD_LABEL_MAP)
    }
    
    return Object.keys(newErrors).length === NUMBERMAP.ZERO;
  };

  const handleFormSave = () => {
    if (validateForm()) {
    const toNumber = (value: any) => parseInt(value) ?? NUMBERMAP.ZERO;
    const payload = {
      project_id,
      dir_name: formState.dirName ?? '',
      functional_block_type_id: toNumber(formState.hardwareSoftwareOther),
      reference_to_existing_dir: formState.referenceToExistingDir,
      dir_reference: formState.dirNumber ? [toNumber(formState.dirNumber)] : [],
      execution_stage: Array.isArray(formState.allocateExecutionStage)
        ? formState.allocateExecutionStage.map((id) => toNumber(id))
        : [],
      reason: formState.reasonForCreating ?? '',
      verification_method: formState.verificationMethod ?? '',
    };

    saveDir(
      { dirId: dir_id, formData: payload },
      {
        onSuccess: () => {
          showActionAlert(DIR_INFO.ACTION_ALERT_TYPES.SUCCESS);
        },
         onError: () => {
            showActionAlert(DIR_INFO.ACTION_ALERT_TYPES.FAILED);
        }
      }
    );
    }
  }

  const handleFormCancel = () => {
     /**
     * Function Name: handleFormCancel 
     * Description: navigate to previous page,
     * Author: Prithiviraj,
     * create: 09-09-2025,
     * Modified by: Savitri 
     * Classification : Confidential
    **/
    router.push(ROUTES.DIR(Number(project_id)));
  }


  const functionalBlockTypeOptions = functionalBlockTypes
    ? functionalBlockTypes.map((block: any) => ({
        value: block.functional_block_type_id.toString(),
        label: block.functional_block_type,
      }))
    : [];

  return (
    <FormContainer>
      <GlobalLoader loading={isAnyLoading()} />
      <FormHeader>
        <FormTitle>{FORM_TITLES.MAIN_TITLE}</FormTitle>
      </FormHeader>
      <FormSection>
        <ContentContainer>
          <Grid2 container spacing={NUMBERMAP.TWO} sx={radioGroupWrapperStyles}>
            <Grid2 size={NUMBERMAP.SIX}>
              <LabelText>{FIELD_LABELS.DIR_NUMBER}</LabelText>
              <ValueText>{formState.dirId}</ValueText>
            </Grid2>
            <Grid2 size={NUMBERMAP.SIX}>
              <LabelText>{FIELD_LABELS.DIR_NAME}</LabelText>
              <ValueText>{formState.dirCategory}</ValueText>
            </Grid2>
            <Grid2 size={NUMBERMAP.SIX}>
              <LabelText>{FIELD_LABELS.DIR_CATEGORY}</LabelText>
              <ValueText>{formState.dirSpecification}</ValueText>
            </Grid2>
            <Grid2 size={NUMBERMAP.SIX}>
              <LabelText>{FIELD_LABELS.OWNER}</LabelText>
              <ValueText>{formState.owner}</ValueText>
            </Grid2>
            <Grid2 size={NUMBERMAP.SIX}>
              <LabelText>{FIELD_LABELS.MODULE_SUBMODULE}</LabelText>
              <ValueText>
                {dirData?.data?.blocks?.map((block: any) => block.functional_block_title).filter(Boolean).join(', ') ?? ""}
              </ValueText>
            </Grid2>
            <Grid2 size={NUMBERMAP.SIX}>
              <LabelText>{FIELD_LABELS.DIR_SPECIFICATION}</LabelText>
              <ValueText>{stripHtml(formState.dirDescription)}</ValueText>
            </Grid2>
            <Grid2 size={NUMBERMAP.SIX}>
              <RadioGroupWrapper>
                <RadioButtonGroup
                  name={DIR_INFO.FORM_FIELDS.HARDWARE_SOFTWARE_OTHER}
                  label={FIELD_LABELS.HARDWARE_SOFTWARE_OTHER}
                  options={functionalBlockTypeOptions}
                  value={formState.hardwareSoftwareOther}
                  onChange={(value) => handleFieldChangeWithPermission(DIR_INFO.FORM_FIELDS.HARDWARE_SOFTWARE_OTHER, String(value))}
                  error={errors.hardwareSoftwareOther}
                />
              </RadioGroupWrapper>
            </Grid2>
            <Grid2 size={NUMBERMAP.SIX}>
              <RichTextEditor
                label={FIELD_LABELS.REASON_FOR_CREATING}
                value={formState.reasonForCreating}
                onChange={(value) => handleInputChange(DIR_INFO.FORM_FIELDS.REASON_FOR_CREATING, value)}
                placeholder={PLACEHOLDERS.REASON_FOR_CREATING}
                error={errors.reasonForCreating}
                id={DIR_INFO.FIELD_LABEL_MAP.reasonForCreating}
                disabled={!hasEditPermission}
              />
            </Grid2>
             <Grid2 size={NUMBERMAP.SIX}>
              <MultiSelect
                label={FIELD_LABELS.ALLOCATE_EXECUTION_STAGE}
                placeholder={PLACEHOLDERS.ALLOCATE_EXECUTION_STAGE}
                idField={DIR_INFO.EXECUTION_STAGE.idField}
                valueField={DIR_INFO.EXECUTION_STAGE.valueField}
                value={formState.allocateExecutionStage ?? []}
                onChange={(value) => handleFieldChangeWithPermission(DIR_INFO.FORM_FIELDS.EXECUTION_STAGE, value as string[])}
                options={executionStageOptions ?? []}
                error={errors.allocateExecutionStage ?? ''}
              />
            </Grid2>
            <Grid2 size={NUMBERMAP.SIX}>
              <RichTextEditor
                label={FIELD_LABELS.VERIFICATION_METHOD}
                value={formState.verificationMethod}
                onChange={(value) => handleInputChange(DIR_INFO.FORM_FIELDS.VERIFICATION_METHOD, value)}
                placeholder={PLACEHOLDERS.VERIFICATION_METHOD}
                error={errors.verificationMethod}
                id={DIR_INFO.FIELD_LABEL_MAP.verificationMethod}
                disabled={!hasEditPermission}
              />
            </Grid2>
            <Grid2 size={NUMBERMAP.SIX}>
              <RadioGroupWrapper sx={radioGroupWrapperStyles}>
                <RadioButtonGroup
                  name={DIR_INFO.FORM_FIELDS.EXISTING_DIR}
                  label={FIELD_LABELS.REFERENCE_TO_EXISTING_DIR}
                  options={referenceOptions}
                  value={formState.referenceToExistingDir}
                  onChange={(value) => handleFieldChangeWithPermission(DIR_INFO.FORM_FIELDS.EXISTING_DIR, String(value))}
                  error={errors.referenceToExistingDir}
                />
              </RadioGroupWrapper>
            </Grid2>
          </Grid2>
        </ContentContainer>
      </FormSection>
      <CommentsHistoryContainer>
        <CommentsHistory
          comments={dirData?.meta_info?.task_info?.task_comments}
        />
      </CommentsHistoryContainer>
      <Grid2 size={NUMBERMAP.TWELVE} sx={BUTTONSTYLE}>
        <ReviewerModalManager
          isLoading={isLoadingDirData}
          permissions={dirData?.meta_info?.action_control?.permissions ?? []}
          projectId={project_id}
          menuId={dirData?.meta_info?.action_control?.menuId}
          menuName={dirData?.meta_info?.action_control?.formName}
          taskId={dirData?.meta_info?.task_info?.task_id}
          onPermissionChange={setHasEditPermission}
          customHandlers={{
            handleCancel: handleFormCancel,
            handleSave: handleFormSave,
            isDisabled: isSaving
          }}
          reviewerList={dirData?.meta_info?.task_info?.reviewer_list}
        />
        </Grid2>
    </FormContainer>
  );
};

export default DirInformationForm;