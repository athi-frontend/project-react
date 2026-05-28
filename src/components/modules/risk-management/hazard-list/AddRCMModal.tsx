'use client'
import React, { useState, useEffect, useMemo } from 'react'
import { Grid2 } from '@mui/material'
import { InputField, Description, RichTextEditor } from '@/components/ui'
import RadioButtonGroup from '@/components/ui/radiobutton-group/RadioButtonGroup'
import GlobalLoader from '@/components/shared/LoadingSpinner'
import {
  AddRCMModalProps,
  RCMFormData,
} from '@/types/modules/risk-management/riskAnalysisControl'

import { useRCMTypes } from '@/hooks/modules/risk-management/useRiskAnalysisControl'
import {
  ADD_RCM_MODAL_CONSTANTS,
  COMMON_FIELD_CONSTANTS,
  CONTEXT_TYPE,
  RCM_FIELD_LABEL_MAP,
  RCM_FIELD_ORDER,
} from '@/constants/modules/risk-management/riskAnalysisControl'
import { NUMBERMAP } from '@/constants/common'
import RiskManagementModalBase, {
  useProbabilitySeverity,
  ProbabilitySeverityFields,
  AcceptabilityField,
} from './RiskManagementModalBase'
import RiskManagementReviewerModalManager from '@/components/modules/risk-management/reviewer-modal/RiskManagementReviewerModalManager'
import { validateAndFocusFirstEmptyField } from '@/lib/utils/formUtils'

/**
 * Classification: Confidential
 */
const AddRCMModal: React.FC<AddRCMModalProps> = ({
  open,
  onClose,
  onSave,
  riskId,
  projectId,
  isPending = false,
  initialData,
  isEditMode = false,
  workflowData,
  onRefetch,
  onRefetchHazards,
}) => {
  const [formData, setFormData] = useState<RCMFormData>({
    title: '',
    description: '',
    rationale: '',
    rcmTypeId: '',
    probability: '',
    severity: '',
    controlEffectiveness: '',
    rcmInducedHazardIdentified: '',
    acceptability: '',
  })

  const [errors, setErrors] = useState<Partial<RCMFormData>>({})
  const [hasEditPermission, setHasEditPermission] = useState(false)

  // Use shared probability/severity hook
  const {
    probabilityOptions,
    severityOptions,
    probabilityLoading,
    severityLoading,
    acceptabilityValue,
    setProbabilityId,
    setSeverityId,
  } = useProbabilitySeverity(
    projectId,
    open,
    initialData?.probability,
    initialData?.severity
  )

  // API hooks for RCM types
  const { data: rcmTypesData, isLoading: rcmTypesLoading } = useRCMTypes(open)

  // Transform API data to dropdown options
  const rcmTypeOptions = useMemo(() => {
    if (!rcmTypesData?.data) return []
    return rcmTypesData.data
      .filter((item) => item.rcm_type_id && item.type_name)
      .map((item) => ({
        id: item.rcm_type_id.toString(),
        name: item.type_name,
      }))
  }, [rcmTypesData])

  // Reusable function to reset form data
  const resetFormData = (): RCMFormData => ({
    title: '',
    description: '',
    rationale: '',
    rcmTypeId: '',
    probability: '',
    severity: '',
    controlEffectiveness: '',
    rcmInducedHazardIdentified: '',
    acceptability: '',
  })

  const inducedHazardOptions = ADD_RCM_MODAL_CONSTANTS.INDUCED_HAZARD_OPTIONS

  // Consolidated useEffect for form data initialization and modal state management
  useEffect(() => {
    if (open) {
      const baseData = resetFormData()
      if (initialData) {
        setFormData({ ...baseData, ...initialData })
      } else {
        setFormData(baseData)
      }
      setErrors({})
    }

    // Reset permission when modal opens or mode changes
    setHasEditPermission(!isEditMode)
  }, [open, isEditMode, initialData])

  const handleChange =
    (field: keyof RCMFormData) => (value: string | boolean | number) => {
      if (!hasEditPermission) return
      setFormData((prev) => ({ ...prev, [field]: value }))
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: '' }))
      }

      // Update probability and severity IDs for API calls
      if (field === ADD_RCM_MODAL_CONSTANTS.FIELD_NAMES.PROBABILITY) {
        setProbabilityId(value ? parseInt(value.toString()) : null)
      } else if (field === ADD_RCM_MODAL_CONSTANTS.FIELD_NAMES.SEVERITY) {
        setSeverityId(value ? parseInt(value.toString()) : null)
      }
    }

  const handleProbabilityChange = (value: string) => {
    handleChange(
      ADD_RCM_MODAL_CONSTANTS.FIELD_NAMES.PROBABILITY as keyof RCMFormData
    )(value)
  }

  const handleSeverityChange = (value: string) => {
    handleChange(
      ADD_RCM_MODAL_CONSTANTS.FIELD_NAMES.SEVERITY as keyof RCMFormData
    )(value)
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<RCMFormData> = {}
    let isValid = true

    if (!formData.title.trim()) {
      newErrors.title =
        ADD_RCM_MODAL_CONSTANTS.VALIDATION_MESSAGES.RCM_TITLE_REQUIRED
      isValid = false
    }

    if (!formData.description.trim()) {
      newErrors.description =
        ADD_RCM_MODAL_CONSTANTS.VALIDATION_MESSAGES.DESCRIPTION_REQUIRED
      isValid = false
    }

    if (!formData.rationale.trim()) {
      newErrors.rationale =
        ADD_RCM_MODAL_CONSTANTS.VALIDATION_MESSAGES.RATIONALE_REQUIRED
      isValid = false
    }

    if (!formData.rcmTypeId) {
      newErrors.rcmTypeId =
        ADD_RCM_MODAL_CONSTANTS.VALIDATION_MESSAGES.RISK_TYPE_REQUIRED
      isValid = false
    }

    if (!formData.probability) {
      newErrors.probability =
        ADD_RCM_MODAL_CONSTANTS.VALIDATION_MESSAGES.PROBABILITY_REQUIRED
      isValid = false
    }

    if (!formData.severity) {
      newErrors.severity =
        ADD_RCM_MODAL_CONSTANTS.VALIDATION_MESSAGES.SEVERITY_REQUIRED
      isValid = false
    }

    if (!formData.controlEffectiveness.trim()) {
      newErrors.controlEffectiveness =
        ADD_RCM_MODAL_CONSTANTS.VALIDATION_MESSAGES.CONTROL_EFFECTIVENESS_REQUIRED
      isValid = false
    }

    setErrors(newErrors)
    if (!isValid) {
      validateAndFocusFirstEmptyField(formData, Array.from(RCM_FIELD_ORDER), RCM_FIELD_LABEL_MAP);
    }
    return isValid
  }

  const handleClose = () => {
    setFormData(resetFormData())
    setErrors({})
    onClose()
  }

  // Custom handlers for workflow integration
  const handleCancel = () => {
    onClose()
  }

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData)
      handleClose()
    }
  }

  // Helper function to check if any loading state is active or edit permission is denied
  const isAnyLoading = () => {
    if (isPending) return true
    if (rcmTypesLoading) return true
    if (probabilityLoading) return true
    if (severityLoading) return true
    return false
  }

  // Handle permission changes based on mode
  const handlePermissionChange = (hasPermission: boolean) => {
    // Only update permissions in edit mode
    if (isEditMode) {
      setHasEditPermission(hasPermission)
    }
  }

  // Combined refetch function that refetches both RCM and hazard data
  const handleCombinedRefetch = () => {
    onRefetch?.()
    onRefetchHazards?.()
  }

  // Render custom buttons for edit mode with workflow integration
  const renderCustomButtons = () => {
    // Check if we have workflow data with meta_info
    const hasWorkflowData =
      workflowData && 'meta_info' in workflowData && workflowData.meta_info

    if (isEditMode && hasWorkflowData) {
      return (
        <RiskManagementReviewerModalManager
          taskInfo={workflowData.meta_info.task_info}
          isLoading={false}
          permissions={workflowData.meta_info.action_control.permissions ?? []}
          menuId={workflowData.meta_info.action_control.menuId}
          menuName={workflowData.meta_info.action_control.formName}
          onPermissionChange={handlePermissionChange}
          customHandlers={{
            handleCancel,
            handleSave,
            isDisabled: isAnyLoading(),
          }}
          taskId={workflowData?.meta_info?.task_info?.task_id}
          contextType={CONTEXT_TYPE.RISK_CONTROL_MEASURE}
          contextId={Number(projectId)}
          projectId={projectId}
          onRefetch={handleCombinedRefetch}
        />
      )
    }
    return null
  }

  return (
    <>
      <GlobalLoader loading={isAnyLoading()} />
      <RiskManagementModalBase
        open={open}
        onClose={handleClose}
        onSave={handleSave}
        isPending={isAnyLoading()}
        title={ADD_RCM_MODAL_CONSTANTS.MODAL_TITLE}
        modalMaxWidth={ADD_RCM_MODAL_CONSTANTS.MODAL_MAX_WIDTH}
        projectId={projectId}
        cancelButtonLabel={ADD_RCM_MODAL_CONSTANTS.BUTTONS.CANCEL}
        saveButtonLabel={ADD_RCM_MODAL_CONSTANTS.BUTTONS.SAVE}
        customButtons={renderCustomButtons()}
      >
      <Grid2 size={NUMBERMAP.TWELVE}>
        <InputField
          label={ADD_RCM_MODAL_CONSTANTS.FORM_LABELS.RCM_TITLE}
          placeholder={ADD_RCM_MODAL_CONSTANTS.PLACEHOLDERS.ENTER_TITLE}
          value={formData.title}
          onChange={handleChange(
            ADD_RCM_MODAL_CONSTANTS.FIELD_NAMES.TITLE as keyof RCMFormData
          )}
          error={errors.title}
          disabled={!hasEditPermission}
        />
      </Grid2>

      <Grid2 size={NUMBERMAP.TWELVE}>
        <RichTextEditor
          id={ADD_RCM_MODAL_CONSTANTS.FIELD_NAMES.DESCRIPTION}
          label={ADD_RCM_MODAL_CONSTANTS.FORM_LABELS.DESCRIPTION}
          placeholder={ADD_RCM_MODAL_CONSTANTS.PLACEHOLDERS.ENTER_DESCRIPTION}
          value={formData.description}
          onChange={handleChange(
            ADD_RCM_MODAL_CONSTANTS.FIELD_NAMES.DESCRIPTION as keyof RCMFormData
          )}
          error={errors.description}
          disabled={!hasEditPermission}
        />
      </Grid2>

      <Grid2 size={NUMBERMAP.TWELVE}>
        <InputField
          label={ADD_RCM_MODAL_CONSTANTS.FORM_LABELS.RISK_TYPE}
          placeholder={ADD_RCM_MODAL_CONSTANTS.PLACEHOLDERS.SELECT_RISK_TYPE}
          isDropdown={true}
          value={formData.rcmTypeId}
          onChange={handleChange(
            ADD_RCM_MODAL_CONSTANTS.FIELD_NAMES.RCM_TYPE_ID as keyof RCMFormData
          )}
          options={rcmTypeOptions}
          keyField={COMMON_FIELD_CONSTANTS.KEY_FIELD}
          valueField={COMMON_FIELD_CONSTANTS.VALUE_FIELD}
          error={errors.rcmTypeId}
          disabled={!hasEditPermission}
        />
      </Grid2>

      <ProbabilitySeverityFields
        probabilityOptions={probabilityOptions}
        severityOptions={severityOptions}
        probabilityLoading={probabilityLoading}
        severityLoading={severityLoading}
        probabilityValue={formData.probability}
        severityValue={formData.severity}
        onProbabilityChange={handleProbabilityChange}
        onSeverityChange={handleSeverityChange}
        probabilityError={errors.probability}
        severityError={errors.severity}
        probabilityLabel={ADD_RCM_MODAL_CONSTANTS.FORM_LABELS.PROBABILITY}
        severityLabel={ADD_RCM_MODAL_CONSTANTS.FORM_LABELS.SEVERITY}
        probabilityPlaceholder={
          ADD_RCM_MODAL_CONSTANTS.PLACEHOLDERS.SELECT_PROBABILITY
        }
        severityPlaceholder={
          ADD_RCM_MODAL_CONSTANTS.PLACEHOLDERS.SELECT_SEVERITY
        }
        disabled={!hasEditPermission}
      />

      <AcceptabilityField
        acceptabilityValue={acceptabilityValue}
        acceptableButtonText={ADD_RCM_MODAL_CONSTANTS.BUTTONS.ACCEPTABLE}
        notAcceptableButtonText={ADD_RCM_MODAL_CONSTANTS.BUTTONS.NOT_ACCEPTABLE}
      />

      <Grid2 size={NUMBERMAP.TWELVE}>
        <Description
          label={ADD_RCM_MODAL_CONSTANTS.FORM_LABELS.RATIONALE}
          placeholder={ADD_RCM_MODAL_CONSTANTS.PLACEHOLDERS.ENTER_RATIONALE}
          value={formData.rationale}
          onChange={handleChange(
            ADD_RCM_MODAL_CONSTANTS.FIELD_NAMES.RATIONALE as keyof RCMFormData
          )}
          error={errors.rationale}
          disabled={!hasEditPermission}
          maxLength={NUMBERMAP.THREETHOUSANDFIVEHUNDRED}
        />
      </Grid2>

      <Grid2 size={NUMBERMAP.TWELVE}>
        <Description
          label={ADD_RCM_MODAL_CONSTANTS.FORM_LABELS.CONTROL_EFFECTIVENESS}
          placeholder={
            ADD_RCM_MODAL_CONSTANTS.PLACEHOLDERS.ENTER_CONTROL_EFFECTIVENESS
          }
          value={formData.controlEffectiveness}
          onChange={handleChange(
            ADD_RCM_MODAL_CONSTANTS.FIELD_NAMES
              .CONTROL_EFFECTIVENESS as keyof RCMFormData
          )}
          error={errors.controlEffectiveness}
          disabled={!hasEditPermission}
          maxLength={NUMBERMAP.THREETHOUSANDFIVEHUNDRED}
        />
      </Grid2>

      <Grid2 size={NUMBERMAP.TWELVE}>
        <RadioButtonGroup
          label={ADD_RCM_MODAL_CONSTANTS.FORM_LABELS.RCM_INDUCED_HAZARD_IDENTIFIED}
          name={
            ADD_RCM_MODAL_CONSTANTS.FIELD_NAMES
              .RCM_INDUCED_HAZARD_IDENTIFIED as string
          }
          options={inducedHazardOptions}
          value={formData.rcmInducedHazardIdentified}
          onChange={handleChange(
            ADD_RCM_MODAL_CONSTANTS.FIELD_NAMES
              .RCM_INDUCED_HAZARD_IDENTIFIED as keyof RCMFormData
          )}
          disabled={!hasEditPermission}
        />
      </Grid2>
      </RiskManagementModalBase>
    </>
  )
}

export default AddRCMModal
