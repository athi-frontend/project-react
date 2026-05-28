'use client'
import React, { useState, useEffect, useCallback } from 'react'
import { Box, Grid2 } from '@mui/material'
import {
  InputField,
  ButtonGroup,
  showActionAlert,
  RichTextEditor,
} from '@/components/ui'
import {
  useExecutionStageMapper,
  useCreateVerificationPlan,
  useVerificationPlanById,
  useUpdateVerificationPlan,
} from '@/hooks/modules/dnd/useProjectStages'
import {
  ContentWrapper,
  FormContainer,
  FormSection,
  BoxStyle,
  BoxStyle2,
} from '@/styles/components/modules/prototypeModal'
import {
  VerificationPlanFormData,
  FormErrors,
  ExtendedProjectStagesModalProps,
} from '@/types/components/modules/prototypeForm'
import {
  PROTOCOL_MODAL,
  PROTOCOL_MODAL_FORM,
  PROTOTYPE_FORM_CONSTANTS,
  ALERT_MODAL_FORM,
  CUSTOM_ALERT,
  TITLE,
  TEXT,
  ICON,
  ONE,
  PROTOCOL_FIELD_ORDER,
  PROTOCOL_FIELD_LABEL_MAP,
} from '@/constants/components/ui/prototypeForm'
import { useParams } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { PROJECT_STAGES_QUERIES } from '@/constants/modules/dnd/stageService'
import { numberValidation } from '@/lib/utils/common'
import { validateAndFocusFirstEmptyField } from '@/lib/utils/formUtils'
import CommonModal from '@/components/ui/common-modal/CommonModal'
import { NUMBERMAP, STATUS, POSITIVE_INTEGER_REGEX } from '@/constants/common'
import { CommonModalScroll } from '@/styles/common'
import ReviewerModalManager from '@/components/modules/dnd/reviewer-modal/ReviewerModalManager'
import CommentsHistory from '@/components/ui/comments-history/Comments'
import ProjectDetailsLoader from '../project-details/ProjectDetailsLoader'

/**
    Classification : Confidential
**/
const { 
  NO_OF_UNITS,
} = PROTOTYPE_FORM_CONSTANTS

const ProtocolModal: React.FC<ExtendedProjectStagesModalProps> = ({
  onSave,
  onClose,
  open,
  mode = PROTOCOL_MODAL_FORM.ADD,
  projectStageOrderId,
  execution_plan_id,
  design_input_requirement_id,
}) => {
  const [formData, setFormData] = useState<VerificationPlanFormData>({
    dir_id: null,
    dir_name: '',
    design_input_requirement_id: null,
    numberOfUnits: '',
    verification_plan: '',
    acceptance_criteria: '',
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [hasEditPermission, setHasEditPermission] = useState(true)

  const queryClient = useQueryClient()
  const { mutate: createVerificationPlan, isPending: isCreating } =
    useCreateVerificationPlan()
  const { mutate: updateVerificationPlan, isPending: isUpdating } =
    useUpdateVerificationPlan()
  const queryEnabled = !!design_input_requirement_id && mode === PROTOCOL_MODAL_FORM.EDIT 
  const { data: verificationPlanData, isLoading: isFetchingPlan } =
    useVerificationPlanById(projectStageOrderId, design_input_requirement_id ?? null, { 
      enabled: queryEnabled
    })

  const params = useParams()
  const projectId = Number(params.id)
  
  // Use single hook with conditional logic in service
  const { data: dirList } = useExecutionStageMapper(projectStageOrderId, projectId, mode)
  

  useEffect(() => {
    if (mode === PROTOCOL_MODAL_FORM.EDIT && verificationPlanData?.data) {
      const plan = verificationPlanData.data // It's a single object, not an array
      
      const unitsValue = plan?.units_to_be_verified?.toString() ?? ''
      const validUnitsValue = plan?.units_to_be_verified === NUMBERMAP.ZERO ? '' : unitsValue
      
      const updatedFormData = {
        dir_id: plan?.design_input_requirement_id ?? null, // Use design_input_requirement_id as dir_id
        dir_name: plan?.dir_name ?? '',
        design_input_requirement_id: plan?.design_input_requirement_id ?? null,
        numberOfUnits: validUnitsValue,
        verification_plan: plan?.verification_plan ?? '',
        acceptance_criteria: plan?.acceptance_criteria ?? '',
      }
      setFormData(updatedFormData)
    }
  }, [verificationPlanData, mode, design_input_requirement_id])

  useEffect(() => {
    if (open && mode === PROTOCOL_MODAL_FORM.EDIT && design_input_requirement_id) {
      queryClient.invalidateQueries({
        queryKey: PROJECT_STAGES_QUERIES.QUERY_KEYS.VERIFICATION_PLAN_BY_ID(
          projectStageOrderId,
          design_input_requirement_id
        ),
      })
      setErrors({})
    }
  }, [open, mode, design_input_requirement_id, projectStageOrderId, queryClient])

  const resetForm = useCallback(() => {
    setFormData({
      dir_id: null,
      dir_name: '',
      design_input_requirement_id: null,
      numberOfUnits: '',
      verification_plan: '',
      acceptance_criteria: '',
    })
    setErrors({})
  }, [])

  useEffect(() => {
    if (open && mode === PROTOCOL_MODAL_FORM.ADD) {
      resetForm()
    }
  }, [open, mode, resetForm])

  const handleInputChange = useCallback(
    (field: string, value: string | null) => {
      setFormData((prev) => {
        const newValue = { ...prev }

        if (field === PROTOCOL_MODAL_FORM.DIR_ID) {
          newValue.design_input_requirement_id = value ? Number(value) : null
          newValue.dir_id = value ? Number(value) : null
        } else if (field === NO_OF_UNITS) {
          if (value && (!POSITIVE_INTEGER_REGEX.test(value))) {
            return prev
          }
          newValue.numberOfUnits = value ?? ''
        } else if (field === PROTOCOL_MODAL_FORM.VERIFICATION) {
          newValue.verification_plan = value ?? ''
        } else if (field === PROTOCOL_MODAL_FORM.ACCEPTANCE) {
          newValue.acceptance_criteria = value ?? ''
        } else {
           newValue[field] = value ?? ''
        }

        return newValue
      })

      setErrors((prev) => {
        const newErrors = { ...prev }

        if (field === PROTOCOL_MODAL_FORM.DIR_ID) {
          delete newErrors.design_input_requirement_id
        } else {
          delete newErrors[field]
        }

        return newErrors
      })
    },
    []
  )

  const validateForm = useCallback(() => {
    const newErrors: FormErrors = {}
    if (!formData.design_input_requirement_id) {
      newErrors.design_input_requirement_id =
        PROTOCOL_MODAL_FORM.DIR_IS_REQUIRED
    }

    if (!formData.numberOfUnits) {
      newErrors.numberOfUnits = PROTOCOL_MODAL_FORM.NO_OF_UNITS_REQUIRED
    } else if (!numberValidation.test(formData.numberOfUnits)) {
      newErrors.numberOfUnits = PROTOCOL_MODAL_FORM.NO_OF_UNITS_REQUIRED2
    }
    if (!formData.acceptance_criteria.trim()) {
      newErrors.acceptance_criteria =
        PROTOCOL_MODAL_FORM.ACCEPTANCE_CRITERIA_REQUIRED
    }
    if (!formData.verification_plan.trim()) {
      newErrors.verification_plan =
        PROTOCOL_MODAL_FORM.VERIFICATION_PLAN_REQUIRED
    }
    setErrors(newErrors)
    if (Object.keys(newErrors).length > NUMBERMAP.ZERO) {
      validateAndFocusFirstEmptyField(formData, Array.from(PROTOCOL_FIELD_ORDER), PROTOCOL_FIELD_LABEL_MAP);
    }
    return Object.keys(newErrors).length === 0
  }, [formData])

  const handleSubmit = useCallback(() => {
    if (!validateForm()) return
    const payload = {
      dir_id: formData.dir_id!,
      units_to_be_verified: parseInt(
        formData.numberOfUnits,
        NUMBERMAP.TEN
      ),
      acceptance_criteria: formData.acceptance_criteria,
      verification_plan: formData.verification_plan,
      project_stage_order_id: projectStageOrderId,
    }

    if (mode === PROTOCOL_MODAL_FORM.ADD) {
      createVerificationPlan(payload, {
        onSuccess: () => {
          showActionAlert(ALERT_MODAL_FORM.SUCCESS)
          onSave(formData)
          resetForm()
          onClose()
        },
        onError: () => {
          showActionAlert(STATUS.FAILED)
        },
      })
    } else {
      const updatePayload: any = {
        dir_id: formData.dir_id!,
        units_to_be_verified: parseInt(
          formData.numberOfUnits,
          PROTOCOL_MODAL.DIR_LIST.TEN
        ),
        acceptance_criteria: formData.acceptance_criteria,
        verification_plan: formData.verification_plan,
        project_stage_order_id: projectStageOrderId,
      }

      if (verificationPlanData?.data?.verification_plan_id !== null && verificationPlanData?.data?.verification_plan_id !== undefined) {
        updatePayload.verification_plan_id = verificationPlanData.data.verification_plan_id
      } else if (verificationPlanData?.data?.verification_stage_id !== null && verificationPlanData?.data?.verification_stage_id !== undefined) {
        updatePayload.verification_stage_id = verificationPlanData.data.verification_stage_id
      }      
      updateVerificationPlan({
        verificationPlanId: design_input_requirement_id!,
        data: updatePayload,
        projectStageOrderId: projectStageOrderId
      }, {
        onSuccess: () => {
          showActionAlert(ALERT_MODAL_FORM.SUCCESS)
          onSave(formData)
        },
        onError: (error: any) => {
          showActionAlert(CUSTOM_ALERT, {
            title: TITLE,
            text:  TEXT,
            icon: ICON,
            cancelButton: false,
            confirmButton: false,
          })
        },
      })
    }
  }, [
    formData,
    mode,
    execution_plan_id,
    createVerificationPlan,
    updateVerificationPlan,
    onSave,
    onClose,
    validateForm,
    resetForm,
    projectStageOrderId,
    verificationPlanData,
  ])

  const handleCancel = useCallback(() => {
    onClose()
    resetForm()
  }, [onClose, resetForm])

  const isAnyLoading = () => {
    if (isFetchingPlan) return true
    if (isCreating) return true
    if (isUpdating) return true
    return false
  }

  return (

      <CommonModal title={mode === PROTOCOL_MODAL_FORM.ADD
              ? PROTOCOL_MODAL_FORM.ADD_VERIFICATION_PLAN
              : PROTOCOL_MODAL_FORM.EDIT_VERIFICATION_PLAN} open={open} onClose={handleCancel}>

      <CommonModalScroll>
        <ProjectDetailsLoader loading={isAnyLoading()} />
        <ContentWrapper>
          <FormContainer>
            <FormSection>
              <Grid2 container spacing={ONE}>
                <Grid2 size={NUMBERMAP.TWELVE}>
                  <InputField
                    label={PROTOCOL_MODAL_FORM.DIR_LABEL}
                    placeholder={PROTOCOL_MODAL_FORM.SELECT_DIR}
                    isDropdown
                    hasEditable={!hasEditPermission}
                    value={formData.design_input_requirement_id?.toString() ?? ''}
                    onChange={(value: string) =>
                      handleInputChange(PROTOCOL_MODAL_FORM.DIR_ID, value)
                    }
                    error={errors.design_input_requirement_id}
                    options={(dirList)?.data ?? []}
                    keyField={PROTOCOL_MODAL_FORM.DESIGN_INPUT_REQUIREMENT_ID}
                    valueField={PROTOCOL_MODAL_FORM.DIR_ID}
                    disabled={mode === PROTOCOL_MODAL_FORM.EDIT}
                  />
                </Grid2>
                <Grid2 size={NUMBERMAP.TWELVE}>
                  <InputField
                    label={PROTOCOL_MODAL_FORM.NO_OF_UNITS_TO_BE_VERIFIED}
                    placeholder={PROTOCOL_MODAL_FORM.ENTER_NUMBER_OF_UNITS}
                    value={formData.numberOfUnits}
                    hasEditable={!hasEditPermission}
                    onChange={(value: string) =>
                      handleInputChange(NO_OF_UNITS, value)
                    }
                    error={errors.numberOfUnits}
                    disabled={!hasEditPermission}
                  />
                </Grid2>
                <Grid2 size={NUMBERMAP.TWELVE}>
                  <RichTextEditor
                    label={PROTOCOL_MODAL_FORM.VERIFICATION_PLAN}
                    value={formData.verification_plan}
                    onChange={(value: string) =>
                      handleInputChange(PROTOCOL_MODAL_FORM.VERIFICATION, value)
                    }
                    id={PROTOCOL_FIELD_LABEL_MAP.verification_plan}
                    error={errors.verification_plan}
                    disabled={!hasEditPermission}
                  />
                </Grid2>
                <Grid2 size={NUMBERMAP.TWELVE}>
                  <RichTextEditor
                    label={PROTOCOL_MODAL_FORM.ACCEPTANCE_CRITERIA}
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
              {errors.general && <Box sx={BoxStyle2}>{errors.general}</Box>}
              {mode === PROTOCOL_MODAL_FORM.EDIT && (
                <Box sx={{ mt: 2 }}>
                <CommentsHistory 
                  comments={verificationPlanData?.meta_info?.task_info?.task_comments} 
                />
                </Box>
              )}
              <Box sx={BoxStyle}>
                {mode === PROTOCOL_MODAL_FORM.EDIT ? (
                  <ReviewerModalManager
                    isLoading={isFetchingPlan}
                    permissions={verificationPlanData?.meta_info?.action_control?.permissions ?? []}
                    projectId={projectId}
                    taskId={verificationPlanData?.meta_info?.task_info?.task_id}
                    menuId={verificationPlanData?.meta_info?.action_control?.menuId}
                    menuName={verificationPlanData?.meta_info?.action_control?.formName}
                    customHandlers={{ 
                      handleCancel: handleCancel,
                      handleSave: handleSubmit,
                      isDisabled: isCreating
                    }}
                    onPermissionChange={setHasEditPermission}
                    reviewerList={verificationPlanData?.meta_info?.task_info?.reviewer_list}
                  />
                ) : (
                  <ButtonGroup
                    buttons={[
                      {
                        label: PROTOCOL_MODAL_FORM.CANCEL,
                        onClick: handleCancel,
                      
                      },
                      {
                        label: PROTOCOL_MODAL_FORM.SAVE,
                        onClick: handleSubmit,
                        disabled: isCreating ?? isUpdating ?? isFetchingPlan,
                      },
                    ]}
                  />
                )}
              </Box>
            </FormSection>
          </FormContainer>
        </ContentWrapper>
  </CommonModalScroll>
  
  </CommonModal>)
}

export default ProtocolModal