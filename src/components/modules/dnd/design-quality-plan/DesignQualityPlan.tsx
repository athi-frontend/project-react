'use client';
import React, { useState, useEffect } from 'react';
import { Box, Grid2 } from '@mui/material';
import { ButtonGroup, MultiSelect, RichTextEditor } from '@/components/ui';
import {
  DesignQualityErrorFormData,
  DesignQualityFormData,
  DesignQualityPlanProps,
  ParameterOption,
} from '@/types/modules/dnd/designQualityPlan';
import {
  ContentWrapper,
  FormContainer,
  FormSection,
  LabelContainer,
  StageLabel,
  StageValue,
  parameterStyle,
} from '@/styles/modules/dnd/designQualityPlan';
import { DESIGN_QUALITY_PLAN, FIELD_NAMES, FIELD_ORDER, FIELD_LABEL_MAP, FIELD_IDS } from '@/constants/modules/dnd/designQualityPlan';
import {
  useGetSpecificationApplicability,
  useGetDesignQualityPlan,
  INITIAL_FORM_DATA,
} from '@/hooks/modules/dnd/useDesignQualityPlan';
import { useParams } from 'next/navigation';
import { NUMBERMAP } from '@/constants/common';
import CommonModal from '@/components/ui/common-modal/CommonModal';
import { validateAndFocusFirstEmptyField } from '@/lib/utils/formUtils';
import GlobalLoader from '@/components/shared/LoadingSpinner';
/**
    Classification : Confidential
**/
const DesignQualityPlanModal: React.FC<DesignQualityPlanProps> = ({
  onSave,
  onClose,
  open,
  initialData,
  stageOrderId,
  hasEditPermission = true,
}) => {
  const params = useParams();
  const projectId = Number(params.id);

  const [formData, setFormData] = useState<DesignQualityFormData>(
    initialData ?? { ...INITIAL_FORM_DATA }
  );
  const [errors, setErrors] = useState<Partial<DesignQualityErrorFormData>>({});
  const [parameterOptions, setParameterOptions] = useState<ParameterOption[]>([]);

  const {
    data: specApplicability,
    isLoading: isSpecLoading,
    isFetching: isSpecFetching,
    isError: isSpecError,
  } = useGetSpecificationApplicability(projectId);
  const {
    data: fetchedData,
    refetch,
    isLoading: isDesignQualityLoading,
    isFetching: isDesignQualityFetching,
  } = useGetDesignQualityPlan(projectId, stageOrderId ?? NUMBERMAP.ZERO);

  // Comprehensive loading state function
  const isAnyLoading = () => {
    if (isSpecLoading) return true
    if (isSpecFetching) return true
    if (isDesignQualityLoading) return true
    if (isDesignQualityFetching) return true
    return false
  }

  // Map raw API response to DesignQualityFormData
  const mapApiDataToFormData = (item: any): DesignQualityFormData => ({
    stage_order_id: item.stage_order_id ?? NUMBERMAP.ZERO,
    build_stages_id: item.build_stages_id ?? NUMBERMAP.ZERO,
    stage_name: item.stage_name ?? '',
    stage_number: item.stage_number ?? undefined,
    quality_objective: item.quality_objective ?? '',
    itemForTest: item.item_for_test ?? '',
    testMethodsAndCriteria: item.test_method_acceptance_criteria ?? '',
    parametersForInspection: item.parameters_for_inspection?.map((p: { id: number }) => p.id) ?? [],
    design_quality_plan_id: item.quality_plan_id?.toString() ?? '',
  });

  useEffect(() => {
    if (open && stageOrderId) {
      refetch(); 
      setErrors({}); 
    }
  }, [open, stageOrderId, refetch]);

  useEffect(() => {
    if (open && fetchedData) {
      const newFormData = mapApiDataToFormData(fetchedData);
      setFormData(newFormData);
      setErrors({}); 
    } else if (open && initialData) {
      setFormData(initialData);
      setErrors({}); 
    } else if (!open) {
      setFormData({ ...INITIAL_FORM_DATA });
      setErrors({}); 
    }
  }, [open, fetchedData, initialData]);

  useEffect(() => {
    if (specApplicability) {
     setParameterOptions(
       (specApplicability.data ?? []).filter(option => 
         option[DESIGN_QUALITY_PLAN.FIELD_KEYS.PARAMETER_KEY_FIELD] !== null
       )
     );
    }
  }, [specApplicability, isSpecError]);


  const handleInputChange = (
    field: keyof DesignQualityFormData,
    value: string | number[]
  ) => {
    if(!hasEditPermission) return; 
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' })); 
  };

  const handleParametersChange = (value: (string | number)[]) => {
    if(!hasEditPermission) return;
    handleInputChange(FIELD_NAMES.PARAMETERS_FOR_INSPECTION, value as number[]);
  };

  const validateForm = () => {
    const newErrors: Partial<DesignQualityErrorFormData> = {};
    const { VALIDATION } = DESIGN_QUALITY_PLAN;

    if (!formData.quality_objective) {
      newErrors.quality_objective = VALIDATION.QUALITY_OBJECTIVE_REQUIRED;
    }
    if (formData.parametersForInspection.length === NUMBERMAP.ZERO) {
      newErrors.parametersForInspection = VALIDATION.PARAMETERS_REQUIRED;
    }
    if (!formData.testMethodsAndCriteria) {
      newErrors.testMethodsAndCriteria = VALIDATION.TEST_METHODS_REQUIRED;
    }

    setErrors(newErrors);
    
    // Use validateAndFocusFirstEmptyField for better UX
    if (Object.keys(newErrors).length > NUMBERMAP.ZERO) {
      validateAndFocusFirstEmptyField(formData, Array.from(FIELD_ORDER), FIELD_LABEL_MAP);
    }
    
    return Object.keys(newErrors).length === NUMBERMAP.ZERO;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    onSave(formData);
  };

  return (
    <CommonModal open={open} onClose={onClose} title={DESIGN_QUALITY_PLAN.TITLE}>
        <GlobalLoader loading={isAnyLoading()} />
        <ContentWrapper>
          <FormContainer>
              <FormSection>
                <Grid2 container>
                  <Grid2 size={NUMBERMAP.TWELVE} >
                    <LabelContainer>
                      <StageLabel>{DESIGN_QUALITY_PLAN.STAGE.LABEL}</StageLabel>
                      <StageValue>
                        {formData.stage_number 
                          ? `${formData.stage_name} ${formData.stage_number}` 
                          : formData.stage_name}
                      </StageValue>
                    </LabelContainer>
                  </Grid2>
                  <Grid2 size={NUMBERMAP.TWELVE}>
                    <RichTextEditor
                      label={DESIGN_QUALITY_PLAN.QUALITY_OBJECTIVE.LABEL}
                      value={formData.quality_objective ?? ''}
                      onChange={(value) =>
                        handleInputChange(FIELD_NAMES.QUALITY_OBJECTIVE, value)
                      }
                      error={errors.quality_objective}
                      placeholder={DESIGN_QUALITY_PLAN.QUALITY_OBJECTIVE.PLACEHOLDER}
                      id={FIELD_IDS.QUALITY_OBJECTIVE}
                      disabled={!hasEditPermission}
                    />
                  </Grid2>
                  <Grid2 size={NUMBERMAP.TWELVE} sx={parameterStyle}>
                    <div id={FIELD_IDS.PARAMETERS_FOR_INSPECTION}>
                    <MultiSelect
                      label={DESIGN_QUALITY_PLAN.PARAMETERS_FOR_INSPECTION.LABEL}
                      placeholder={
                        DESIGN_QUALITY_PLAN.PARAMETERS_FOR_INSPECTION.PLACEHOLDER
                      }
                      value={formData.parametersForInspection ?? []}
                      idField={DESIGN_QUALITY_PLAN.FIELD_KEYS.PARAMETER_KEY_FIELD}
                      valueField={DESIGN_QUALITY_PLAN.FIELD_KEYS.PARAMETER_VALUE_FIELD}
                      onChange={handleParametersChange}
                      error={errors.parametersForInspection ?? ''}
                      options={parameterOptions}
                      disabled={isSpecLoading ?? isSpecError}
                    />
                    </div>
                  </Grid2>
                  <Grid2 size={NUMBERMAP.TWELVE}>
                    <RichTextEditor
                      label={DESIGN_QUALITY_PLAN.TEST_METHODS.LABEL}
                      value={formData.testMethodsAndCriteria ?? ''}
                      onChange={(value) =>
                        handleInputChange(FIELD_NAMES.TEST_METHODS_AND_CRITERIA, value)
                      }
                      error={errors.testMethodsAndCriteria}
                      id={FIELD_IDS.TEST_METHODS_AND_CRITERIA}
                      placeholder={DESIGN_QUALITY_PLAN.TEST_METHODS.PLACEHOLDER}
                      disabled={!hasEditPermission}
                    />
                  </Grid2>
                </Grid2>
                <Box >
                  <ButtonGroup
                    buttons={[
                      {
                        label: DESIGN_QUALITY_PLAN.BUTTONS.CANCEL,
                        onClick: onClose,
                      },
                      {
                        label: DESIGN_QUALITY_PLAN.BUTTONS.SAVE,
                        disabled: !hasEditPermission,
                        onClick: handleSubmit,
                      },
                    ]}
                  />
                </Box>
              </FormSection>
          </FormContainer>
        </ContentWrapper>
        </CommonModal>
  );
};

export default DesignQualityPlanModal;