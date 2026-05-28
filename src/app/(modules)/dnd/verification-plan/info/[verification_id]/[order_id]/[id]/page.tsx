"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Grid2 } from "@mui/material";
import {
  InputField,
  ButtonGroup,
  Label,
  RichTextEditor,
  showActionAlert,
  MultiSelect,
  DataGridTable,
} from "@/components/ui";
import FileUploadManager from "@/components/ui/file-upload-v3/FileUploadManager";
import {
  FormContainer,
  FormContent,
  FormWrapper,
} from "@/styles/modules/user/userOnboard";
import { STYLE5 } from "@/styles/modules/hr/candidateEvaluation";
import { NUMBERMAP, STATUS } from "@/constants/common";
import {
  useVerificationPlanById,
  useCreateVerificationPlan,
  useUpdateVerificationPlan,
  useDirListByCategory,
} from "@/hooks/modules/dnd/useProjectStages";
import { useSpecifications } from "@/hooks/modules/dnd/useDigSpecification";
import { useDesignTools, useDesignEquipments } from "@/hooks/modules/dnd/useProjectPlan";
import { useAllJigsTypes } from "@/hooks/modules/production/useCommonProductionDropDownHook";
import {
  PROTOCOL_MODAL_FORM,
  PROTOCOL_FIELD_ORDER,
  PROTOCOL_FIELD_LABEL_MAP,
} from "@/constants/components/ui/prototypeForm";
import { VerificationPlanFormData, FormErrors } from "@/types/components/modules/prototypeForm";
import { validateAndFocusFirstEmptyField } from "@/lib/utils/formUtils";
import GlobalLoader from "@/components/shared/LoadingSpinner";
import CommentsHistory from "@/components/ui/comments-history/Comments";
import ReviewerModalManager from "@/components/modules/dnd/reviewer-modal/ReviewerModalManager";
import { useFileHandling } from "@/hooks/modules/dnd/useFileHandling";

/**
    Classification : Confidential
**/

type FieldValue = string | null | string[];


export default function VerificationPlanFormPage() {
  const router = useRouter();
  const params = useParams();
  const verification_id = params.verification_id as string;
  const order_id = params.order_id as string;
  const id = params.id as string;
  const isCreateMode = verification_id === "create";

  const [formData, setFormData] = useState<VerificationPlanFormData>({
    dir_id: null,
    dir_name: '',
    design_input_requirement_id: null,
    verification_plan: '',
    acceptance_criteria: '',
    dir_category: [],
    equipment_type: '',
    jig_type: '',
    tool_type: '',
    dir_numbers: [],
    documents: [],
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [hasEditPermission, setHasEditPermission] = useState<boolean>(true);
  const [isNavigating, setIsNavigating] = useState<boolean>(false);

  const {
    handleFileUpload,
    handleFileEdit,
    handleFileSubmit,
    appendFileFields: appendFileFieldsToFormData,
  } = useFileHandling(formData, setFormData);

  const { data: verificationPlanData, isLoading: isFetchingPlan } =
    useVerificationPlanById(Number(order_id), isCreateMode ? null : Number(verification_id), { 
      enabled: !isCreateMode && !!verification_id
    });

  const { mutate: createVerificationPlan, isPending: isCreating } =
    useCreateVerificationPlan();
  const { mutate: updateVerificationPlan, isPending: isUpdating } =
    useUpdateVerificationPlan();

  // Fetch DIR list filtered by selected dir_category
  const { data: dirListByCategory, isLoading: isFetchingDirList } = useDirListByCategory(
    Number(id),
    formData.dir_category ?? []
  );

  const { data: specificationsData } = useSpecifications(Number(id));
  const { data: toolsOptions } = useDesignTools();
  const { data: equipmentsOptions } = useDesignEquipments();
  const { data: jigsTypeData } = useAllJigsTypes(NUMBERMAP.ONE);

  const extractDirNumbers = (plan: any): (string | number)[] => {
    if (!Array.isArray(plan?.dir)) {
      return [];
    }
    return plan.dir.map((item: any) => item.id).filter(Boolean);
  };

  const extractDirCategoryIds = (plan: any): (string | number)[] => {
    if (!Array.isArray(plan?.dir_category) || !specificationsData?.data) {
      return [];
    }
    const categoryMap = new Map<string, number>(
      specificationsData.data.map((spec: any) => [
        spec.specification_type,
        spec.design_specification_type_id
      ])
    );
    const mappedIds: (number | undefined)[] = plan.dir_category.map((item: any) => 
      categoryMap.get(item.dir_category)
    );
    return mappedIds.filter((id): id is number => id !== undefined);
  };

  const transformPlanToFormData = (plan: any): VerificationPlanFormData => {
    const dirNumbers = extractDirNumbers(plan);
    const dirCategoryIds = extractDirCategoryIds(plan);
    const primaryDirId = dirNumbers.length > NUMBERMAP.ONE ? Number(dirNumbers[NUMBERMAP.ONE]) : null;

    return {
      dir_id: primaryDirId,
      dir_name: plan?.dir_name ?? '',
      design_input_requirement_id: primaryDirId,
      verification_plan: plan?.verification_plan ?? '',
      acceptance_criteria: plan?.acceptance_criteria ?? '',
      dir_category: dirCategoryIds.map(String),
      equipment_type: plan?.equipment_types_id ? String(plan.equipment_types_id) : '',
      jig_type: plan?.jig_types_id ? String(plan.jig_types_id) : '',
      tool_type: plan?.tool_types_id ? String(plan.tool_types_id) : '',
      dir_numbers: dirNumbers.map(String),
      documents: plan?.supporting_documents ?? [],
    };
  };

  useEffect(() => {
    if (!isCreateMode && verificationPlanData?.data) {
      const transformedData = transformPlanToFormData(verificationPlanData.data);
      setFormData(transformedData);
    }
  }, [verificationPlanData, isCreateMode, specificationsData]);

  const handleDirIdArrayChange = (newValue: VerificationPlanFormData, value: (string | number)[]) => {
    newValue.dir_numbers = value.map(String);
    const primaryId = value.length > NUMBERMAP.ZERO ? Number(value[NUMBERMAP.ZERO]) : null;
    newValue.design_input_requirement_id = primaryId;
    newValue.dir_id = primaryId;
  };

  const handleDirIdSingleChange = (newValue: VerificationPlanFormData, value: string | number | null) => {
    const id = value ? Number(value) : null;
    newValue.design_input_requirement_id = id;
    newValue.dir_id = id;
    newValue.dir_numbers = value ? [String(value)] : [];
  };

  const handleDirIdChange = (newValue: VerificationPlanFormData, value: FieldValue) => {
    if (Array.isArray(value)) {
      handleDirIdArrayChange(newValue, value);
    } else {
      handleDirIdSingleChange(newValue, value as string | number | null);
    }
  };

  const handleDirCategoryChange = (newValue: VerificationPlanFormData, value: FieldValue) => {
    if (!Array.isArray(value)) return;
    newValue.dir_category = value;
    newValue.dir_numbers = [];
    newValue.dir_id = null;
    newValue.design_input_requirement_id = null;
  };

  const handleDirNumbersChange = (newValue: VerificationPlanFormData, value: FieldValue) => {
    if (Array.isArray(value)) {
      newValue.dir_numbers = value;
    }
  };

  const updateFormDataField = (field: string, value: FieldValue, prev: VerificationPlanFormData): VerificationPlanFormData => {
    const newValue = { ...prev };

    if (field === PROTOCOL_MODAL_FORM.DIR_ID) {
      handleDirIdChange(newValue, value);
    } else if (field === PROTOCOL_MODAL_FORM.VERIFICATION) {
      newValue.verification_plan = (value as string) ?? '';
    } else if (field === PROTOCOL_MODAL_FORM.ACCEPTANCE) {
      newValue.acceptance_criteria = (value as string) ?? '';
    } else if (field === 'dir_category') {
      handleDirCategoryChange(newValue, value);
    } else if (field === 'dir_numbers') {
      handleDirNumbersChange(newValue, value);
    } else {
      newValue[field] = (value as string) ?? '';
    }

    return newValue;
  };

  const clearFieldError = (field: string, prev: FormErrors): FormErrors => {
    const newErrors = { ...prev };
    const errorField = field === PROTOCOL_MODAL_FORM.DIR_ID ? 'design_input_requirement_id' : field;
    delete newErrors[errorField];
    return newErrors;
  };

  const handleInputChange = (field: string, value: FieldValue) => {
    setFormData((prev) => updateFormDataField(field, value, prev));
    setErrors((prev) => clearFieldError(field, prev));
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};
    if (!formData.dir_numbers || formData.dir_numbers.length === NUMBERMAP.ZERO) {
      newErrors.design_input_requirement_id =
        PROTOCOL_MODAL_FORM.DIR_IS_REQUIRED;
    }
    if (!formData.verification_plan.trim()) {
      newErrors.verification_plan =
        PROTOCOL_MODAL_FORM.VERIFICATION_PLAN_REQUIRED;
    }
    if (!formData.acceptance_criteria.trim()) {
      newErrors.acceptance_criteria =
        PROTOCOL_MODAL_FORM.ACCEPTANCE_CRITERIA_REQUIRED;
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > NUMBERMAP.ZERO) {
      validateAndFocusFirstEmptyField(formData, Array.from(PROTOCOL_FIELD_ORDER), PROTOCOL_FIELD_LABEL_MAP);
    }
    return Object.keys(newErrors).length === NUMBERMAP.ZERO;
  };

  const buildFormData = () => {
    const formDataPayload = new FormData();

    // Add project_stage_order_id
    formDataPayload.append('project_stage_order_id', order_id);

    // Add dir as array from dir_numbers
    const dirArray: number[] = formData.dir_numbers && formData.dir_numbers.length > NUMBERMAP.ZERO
      ? formData.dir_numbers.map(Number)
      : [];
    
    formDataPayload.append('dir', JSON.stringify(dirArray));

    // Add equipment_types
    if (formData.equipment_type) {
      formDataPayload.append('equipment_types', formData.equipment_type);
    }

    // Add jig_types
    if (formData.jig_type) {
      formDataPayload.append('jig_types', formData.jig_type);
    }

    // Add verification_plan
    formDataPayload.append('verification_plan', formData.verification_plan);
    formDataPayload.append('acceptance_criteria', formData.acceptance_criteria);

    // Add tools_types
    if (formData.tool_type) {
      formDataPayload.append('tools_types', formData.tool_type);
    }

    appendFileFieldsToFormData(formDataPayload, {
      DOCUMENTS_TO_CREATE: 'documents_to_create',
      DOCUMENTS_TO_DELETE: 'documents_to_delete',
      CREATE_META_DATA: 'create_meta_data',
      UPDATE_META_DATA: 'update_meta_data',
    });

    return formDataPayload;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const formDataPayload = buildFormData();

    if (isCreateMode) {
      createVerificationPlan(formDataPayload, {
        onSuccess: () => {
          showActionAlert(STATUS.SUCCESS);
          router.push(`/dnd/verification-plan/${order_id}/${id}`);
        },
        onError: () => {
          showActionAlert(STATUS.FAILED);
        },
      });
    } else {
      // For update, add verification_plan_id
      if (verificationPlanData?.data?.verification_plan_id) {
        formDataPayload.append('verification_plan_id', verificationPlanData.data.verification_plan_id.toString());
      }

      const verificationPlanId = Number(verification_id);
      if (verificationPlanId) {
        updateVerificationPlan(
          {
            verificationPlanId: verificationPlanId,
            data: formDataPayload,
          },
          {
            onSuccess: () => {
              showActionAlert(STATUS.SUCCESS);
            },
            onError: () => {
              showActionAlert(STATUS.FAILED);
            },
          }
        );
      }
    }
  };

  const handleCancel = () => {
    setIsNavigating(true);
    router.push(`/dnd/verification-plan/${order_id}/${id}`);
  };


  const isAnyLoading = () => {
    if (isNavigating) return true;
    if (isFetchingPlan) return true;
    if (isCreating) return true;
    if (isUpdating) return true;
    if (isFetchingDirList) return true;
    return false;
  };

  return (
    <FormContainer>
      <FormWrapper>
        <GlobalLoader loading={isAnyLoading()} />
        <Label title={isCreateMode ? PROTOCOL_MODAL_FORM.ADD_VERIFICATION_PLAN : PROTOCOL_MODAL_FORM.EDIT_VERIFICATION_PLAN} />
        <FormContent>
          <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <MultiSelect
                label="DIR Category"
                placeholder="Select DIR Category"
                value={formData.dir_category?.map(Number) ?? []}
                onChange={(value: Array<number | string>) =>
                  handleInputChange('dir_category', value.map(String))
                }
                options={specificationsData?.data ?? []}
                idField="design_specification_type_id"
                valueField="specification_type"
                error={errors.dir_category ?? ''}
                disabled={!hasEditPermission}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <MultiSelect
                label={PROTOCOL_MODAL_FORM.DIR_LABEL}
                placeholder={PROTOCOL_MODAL_FORM.SELECT_DIR}
                value={formData.dir_numbers?.map(Number) ?? []}
                onChange={(value: Array<number | string>) =>
                  handleInputChange(PROTOCOL_MODAL_FORM.DIR_ID, value.map(String))
                }
                error={errors.design_input_requirement_id ?? ''}
                options={
                  Array.isArray(dirListByCategory) 
                    ? dirListByCategory 
                    : dirListByCategory?.data ?? []
                }
                idField={PROTOCOL_MODAL_FORM.DESIGN_INPUT_REQUIREMENT_ID}
                valueField={PROTOCOL_MODAL_FORM.DIR_ID}
                disabled={!isCreateMode && !hasEditPermission}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InputField
                label="Equipment Type"
                placeholder="Select Equipment Type"
                isDropdown
                value={formData.equipment_type ?? ''}
                onChange={(value: string) => handleInputChange('equipment_type', value)}
                error={errors.equipment_type}
                disabled={!hasEditPermission}
                options={equipmentsOptions ?? []}
                keyField="equipment_id"
                valueField="equipment_name"
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InputField
                label="Tool Type"
                placeholder="Select Tool Type"
                isDropdown
                value={formData.tool_type ?? ''}
                onChange={(value: string) => handleInputChange('tool_type', value)}
                error={errors.tool_type}
                disabled={!hasEditPermission}
                options={toolsOptions ?? []}
                keyField="tool_id"
                valueField="tool_name"
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <InputField
                label="Jig Type"
                placeholder="Select Jig Type"
                isDropdown
                value={formData.jig_type ?? ''}
                onChange={(value: string) => handleInputChange('jig_type', value)}
                error={errors.jig_type}
                disabled={!hasEditPermission}
                options={jigsTypeData?.data ?? []}
                keyField="jigs_type_id"
                valueField="jigs_type_name"
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE }}>
              <DataGridTable
                title="DIR Unit & Value"
                rows={verificationPlanData?.data?.dir_units ?? []}
                columns={[
                  { field: 'sno', headerName: 'S.No.', flex: NUMBERMAP.HALF },
                  { field: 'dir_id', headerName: 'DIR #', flex: NUMBERMAP.ONE },
                  { field: 'dir_unit', headerName: 'Unit', flex: NUMBERMAP.ONE },
                  { field: 'dir_value', headerName: 'Value', flex: NUMBERMAP.ONE },
                ]}
                idField="id"
                hideFooter={true}
              />
            </Grid2>
          </Grid2>

          <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <RichTextEditor
                label={PROTOCOL_MODAL_FORM.VERIFICATION_PLAN}
                placeholder={PROTOCOL_MODAL_FORM.VERIFICATION_PLAN_PLACEHOLDER}
                value={formData.verification_plan}
                onChange={(value: string) =>
                  handleInputChange(PROTOCOL_MODAL_FORM.VERIFICATION, value)
                }
                id={PROTOCOL_FIELD_LABEL_MAP.verification_plan}
                error={errors.verification_plan}
                disabled={!hasEditPermission}
              />
            </Grid2>
            <Grid2 size={{ xs: NUMBERMAP.TWELVE, md: NUMBERMAP.SIX }}>
              <RichTextEditor
                label={PROTOCOL_MODAL_FORM.ACCEPTANCE_CRITERIA}
                placeholder={PROTOCOL_MODAL_FORM.ACCEPTANCE_CRITERIA_PLACEHOLDER}
                value={formData.acceptance_criteria}
                onChange={(value: string) =>
                  handleInputChange(PROTOCOL_MODAL_FORM.ACCEPTANCE, value)
                }
                error={errors.acceptance_criteria}
                id={PROTOCOL_FIELD_LABEL_MAP.acceptance_criteria}
                disabled={!hasEditPermission}
              />
            </Grid2>
          </Grid2>

          <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
            <Grid2 size={NUMBERMAP.TWELVE}>
              <FileUploadManager
                initialFiles={formData?.documents ?? []}
                onFileUpload={handleFileUpload}
                onFileEdit={handleFileEdit}
                onSubmit={handleFileSubmit}
                hasEditable={!hasEditPermission}
              />
            </Grid2>
          </Grid2>

          {!isCreateMode && (
            <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
              <Grid2 size={NUMBERMAP.TWELVE}>
                <CommentsHistory 
                  comments={verificationPlanData?.meta_info?.task_info?.task_comments} 
                />
              </Grid2>
            </Grid2>
          )}

          <Grid2 container spacing={NUMBERMAP.TWO} sx={STYLE5}>
            <Grid2 size={NUMBERMAP.TWELVE}>
              {isCreateMode ? (
                <ButtonGroup
                  buttons={[
                    {
                      label: PROTOCOL_MODAL_FORM.CANCEL,
                      onClick: handleCancel,
                    },
                    {
                      label: PROTOCOL_MODAL_FORM.SAVE,
                      onClick: handleSubmit,
                    },
                  ]}
                />
              ) : (
                <ReviewerModalManager
                  isLoading={isFetchingPlan}
                  permissions={verificationPlanData?.meta_info?.action_control?.permissions ?? []}
                  projectId={Number(id)}
                  taskId={verificationPlanData?.meta_info?.task_info?.task_id}
                  menuId={verificationPlanData?.meta_info?.action_control?.menuId}
                  menuName={verificationPlanData?.meta_info?.action_control?.formName}
                  customHandlers={{ 
                    handleCancel: handleCancel,
                    handleSave: handleSubmit,
                  }}
                  onPermissionChange={setHasEditPermission}
                  reviewerList={verificationPlanData?.meta_info?.task_info?.reviewer_list}
                />
              )}
            </Grid2>
          </Grid2>
        </FormContent>
      </FormWrapper>
    </FormContainer>
  );
}

