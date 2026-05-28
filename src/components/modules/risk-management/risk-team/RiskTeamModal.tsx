/**
 * Risk Team Modal Component
 * Classification: Confidential
 */

'use client'
import React, { useState, useEffect, useMemo, useRef } from 'react'
import Grid2 from '@mui/material/Grid2'
import { InputField, MultiSelect, ButtonGroup, showActionAlert } from '@/components/ui'
import { NUMBERMAP } from '@/constants/common'
import CommonModal from '@/components/ui/common-modal/CommonModal'
import { popup_style } from '@/styles/common'
import { processButtonsWithPermissions, QUERYCONSTANTS } from '@/lib/utils/common'
import {
  RT_FORM_FIELDS,
  RT_FORM_LABELS,
  RT_FORM_PLACEHOLDERS,
  RT_PAGE_TITLES,
  RT_INITIAL_FORM_DATA,
  RT_INITIAL_ERRORS,
  RT_FIELD_LABELS,
  RT_DROPDOWN_FIELDS,
  RT_VALIDATION_MESSAGES,
  RISK_TEAM_FIELD_ORDER,
  RISK_TEAM_FIELD_LABEL_MAP,
} from '@/constants/modules/risk-management/riskTeam'
import {
  RiskControlMeasureData,
  RiskControlMeasureFormErrors,
  RiskTeamModalProps,
  RiskTeamData,
  Employee,
  Stage,
} from '@/types/modules/risk-management/riskTeam'
import {
  useGetStages,
  useGetResponsibilities,
  useGetEmployeesBySkills,
  useGetRiskTeamById,
} from '@/hooks/modules/risk-management/useRiskTeam'
import { useFetchSkills } from '@/hooks/modules/hr/useTrainingNeeds'
import { useOrganizationStatus } from '@/hooks/useCommonDropdown'
import { useDraftSave } from '@/hooks/common/useDraftSave'
import DraftLoading from '@/components/ui/draft-loader/DraftLoader'
import { validateAndFocusFirstEmptyField } from '@/lib/utils/formUtils'

const RiskTeamModal: React.FC<RiskTeamModalProps> = ({
  onSave,
  onCancel,
  onClose,
  open,
  isEditMode = false,
  projectId,
  riskTeamId,
  permissions: createModePermissions,
}) => {
  const [formData, setFormData] =
    useState<RiskControlMeasureData>(RT_INITIAL_FORM_DATA)
  const [formErrors, setFormErrors] =
    useState<RiskControlMeasureFormErrors>(RT_INITIAL_ERRORS)
  const [selectedSkills, setSelectedSkills] = useState<number[]>([])
  const isInitialDataLoad = useRef(true)

  const isDraftMode = riskTeamId === 'draft' || !riskTeamId
  const contextType = isDraftMode ? 'project' : 'risk_team'
  const { draftSave, isDraftSaving,fetchDraft:refetchDraft ,draftData,clearDraftSave, checkUnsavedDraftBeforeLeave} = useDraftSave({
    context_instance_id:riskTeamId??projectId,
    context_type:contextType,
    enableFetch:false,
  })

  useEffect(() => {
    if(open ) {
      refetchDraft()
    }
  }, [open,riskTeamId])
  // API hooks for dropdown data
  const { data: stages } = useGetStages(projectId)
  // Find stage_id from stage_applicable_id for responsibilities API
  const selectedStageId = stages?.data?.find(
    (stage: Stage) => stage.stage_applicable_id === formData.stage
  )?.stage_id
  const { data: responsibilities } = useGetResponsibilities(selectedStageId)
  const { data: skills } = useFetchSkills(NUMBERMAP.ONE)
  const { data: statusOptions } = useOrganizationStatus()
  const { data: employees } = useGetEmployeesBySkills(
    selectedSkills,
    NUMBERMAP.ONE
  )

  /**
   * Function Name: transformStagesData (useMemo)
   * Params: stages, isEditMode
   * Description: Transform stages data based on mode using useMemo for optimization:
   * - Add mode: Only show active stages (status = 1)
   * - Edit mode: Show all stages but disable inactive ones (status = 0)
   * Author: Harsithiga B,
   * Created: 15-10-2025,
   * Classification: Confidential
   */
  const transformStagesData = useMemo(() => {
  const allOptions = stages?.data ?? [];

  const activeOptions = allOptions.filter((stage: Stage) => stage.status === NUMBERMAP.ONE);
  const inactiveOptions = allOptions.filter((stage: Stage) => stage.status == NUMBERMAP.ZERO);

  let result = [...activeOptions];
  const initialStageId = formData.stage;
  if (initialStageId) {
    const inactiveItem = inactiveOptions.find(
      (stage: Stage) => String(stage.stage_applicable_id) === String(initialStageId)
    );
    if (inactiveItem) {
      // Append only if not already in active
      if (!activeOptions.some((stage: Stage) => String(stage.stage_applicable_id) === String(initialStageId))) {
        result = [...activeOptions, inactiveItem];
      }
    }
  }
  return result;
}, [stages, formData.stage])

  // Hook for fetching risk team data by ID
  const { data: riskTeamData, isLoading: isFetchingRiskTeam, isFetching: isFetchingRiskTeamData } = useGetRiskTeamById(
    riskTeamId ?? NUMBERMAP.ZERO,
    projectId
  )

  // Extract permissions: use fetch by id permissions for edit mode, create mode permissions for create mode
  const editModePermissions = riskTeamData?.meta_info?.action_control?.permissions ?? []
  const permissions = isEditMode ? editModePermissions : createModePermissions ?? []
  
  // In edit mode, wait for data to be loaded before showing buttons
  const isDataLoading = isEditMode && (isFetchingRiskTeam || isFetchingRiskTeamData)

  /**
   * Function Name: transformRiskTeamDataToModalData
   * Params: riskTeamData
   * Description: Transform RiskTeamData to RiskControlMeasureData format for modal
   * Author: Harsithiga B,
   * Created: 21-09-2025,
   * Classification: Confidential
   */
  const transformRiskTeamDataToModalData = (
    data: RiskTeamData
  ): RiskControlMeasureData => {
    return {
      stage: data.stage_applicable_id,
      responsibility: data.responsibility_id,
      skillRequired: data.skill_master_ids ?? [],
      resource: data.employee_id,
      status: data.status_id,
    }
  }

  /**
   * Function Name: handleEditModeDataPrefill
   * Params: riskTeamData
   * Description: Handle data prefilling for edit mode
   * Author: Harsithiga B,
   * Created: 21-09-2025,
   * Classification: Confidential
   */
  const handleEditModeDataPrefill = (riskTeamData: {
    data: RiskTeamData[]
  }) => {
    const transformedData = transformRiskTeamDataToModalData(
      riskTeamData.data[NUMBERMAP.ZERO]
    )

    // Use the transformed data directly since it already contains status_id
    const finalData = transformedData

    setFormData(finalData)
    // Set selected skills to update resource dropdown
    if (
      finalData.skillRequired &&
      finalData.skillRequired.length > NUMBERMAP.ZERO
    ) {
      setSelectedSkills(finalData.skillRequired)
    }
  }

  /**
   * Function Name: handleCreateModeDataReset
   * Params: None
   * Description: Handle data reset for create mode
   * Author: Harsithiga B,
   * Created: 21-09-2025,
   * Classification: Confidential
   */
  const handleCreateModeDataReset = () => {
    setFormData(RT_INITIAL_FORM_DATA)
    setSelectedSkills([])
  }

  /**
   * Function Name: hasValidRiskTeamData
   * Params: riskTeamData
   * Description: Check if risk team data is valid and available
   * Author: Harsithiga B,
   * Created: 21-09-2025,
   * Classification: Confidential
   */
  const hasValidRiskTeamData = (
    riskTeamData: { data: RiskTeamData[] } | undefined
  ): boolean => {
    return !!riskTeamData?.data?.[NUMBERMAP.ZERO]
  }

  /**
   * Function Name: isInEditMode
   * Params: isEditMode
   * Description: Check if component is in edit mode
   * Author: Harsithiga B,
   * Created: 21-09-2025,
   * Classification: Confidential
   */
  const isInEditMode = (isEditMode: boolean): boolean => {
    return isEditMode
  }

  /**
   * Function Name: handleDataPrefillAction
   * Params: riskTeamData
   * Description: Execute data prefilling action
   * Author: Harsithiga B,
   * Created: 21-09-2025,
   * Classification: Confidential
   */
  const handleDataPrefillAction = (
    riskTeamData: { data: RiskTeamData[] } | undefined
  ) => {
    if (riskTeamData) {
      handleEditModeDataPrefill(riskTeamData)
    }
  }

  /**
   * Function Name: handleDataResetAction
   * Params: None
   * Description: Execute data reset action
   * Author: Harsithiga B,
   * Created: 21-09-2025,
   * Classification: Confidential
   */
  const handleDataResetAction = () => {
    handleCreateModeDataReset()
  }

  /**
   * Function Name: handleRiskTeamDataChange
   * Params: riskTeamData, isEditMode
   * Description: Handle risk team data changes with precise conditional logic
   * Author: Harsithiga B,
   * Created: 21-09-2025,
   * Classification: Confidential
   */
  const handleRiskTeamDataChange = (
    riskTeamData: { data: RiskTeamData[] } | undefined,
    isEditMode: boolean
  ) => {
    const hasData = hasValidRiskTeamData(riskTeamData)
    const isEdit = isInEditMode(isEditMode)

    if (hasData && isEdit) {
      handleDataPrefillAction(riskTeamData)
    } else {
      handleDataResetAction()
    }
  }

  /**
   * Function Name: useEffect for handling risk team data changes
   * Params: riskTeamData, isEditMode
   * Description: Handle risk team data changes and determine appropriate action
   * Author: Harsithiga B,
   * Created: 21-09-2025,
   * Classification: Confidential
   */
  
  useEffect(() => {
    if(draftData?.data) {
      setFormData(draftData?.data)
      setSelectedSkills(draftData?.data?.skillRequired ?? [])
      return
    }
    handleRiskTeamDataChange(riskTeamData, isEditMode)
    isInitialDataLoad.current = false
  }, [riskTeamData, isEditMode, statusOptions,draftData])

  /**
   * Function Name: useEffect (employees validation)
   * Params: employees, formData.resource
   * Description: Validate and clear resource selection if employee not available
   * Author: Harsithiga B,
   * Created: 21-09-2025,
   * Classification: Confidential
   */
  useEffect(() => {
    if (employees?.data && formData.resource) {
      // Check if the selected resource ID exists in the employees data
      const resourceExists = employees.data.some(
        (employee: Employee) => employee.id === formData.resource
      )
      if (!resourceExists) {
        // Remove the resource ID if it doesn't exist in employees data
        setFormData((prev) => ({
          ...prev,
          resource: null,
        }))
      }
    }
  }, [employees, formData.resource])

  /**
   * Function Name: handleChange
   * Params: field, value
   * Description: Handle form field changes and clear validation errors
   * Author: Harsithiga B,
   * Created: 21-09-2025,
   * Classification: Confidential
   */
  const handleChange =
    (field: keyof RiskControlMeasureData) => (value: string | number) => {
      // Handle empty values properly - convert empty string to null
      const numericValue = value === '' ? null : Number(value)

      setFormData((prev) => {
        const updated = {
          ...prev,
          [field]: numericValue,
        }
        // Clear responsibility when stage is removed/cancelled
        if (field === RT_FORM_FIELDS.STAGE && numericValue === null) {
          updated.responsibility = null
        }
        if (!isInitialDataLoad.current) {
          handleDraftSave(updated)
        }
        return updated
      })

      if (formErrors[field]) {
        setFormErrors((prev) => ({ ...prev, [field]: '' }))
      }
      // Clear responsibility error when stage is cleared
      if (field === RT_FORM_FIELDS.STAGE && numericValue === null && formErrors.responsibility) {
        setFormErrors((prev) => ({ ...prev, responsibility: '' }))
      }
    }

  /**
   * Function Name: handleStatusChange
   * Params: value
   * Description: Handle status dropdown change and update form data
   * Author: Harsithiga B,
   * Created: 21-09-2025,
   * Classification: Confidential
   */
  const handleStatusChange = (value: string | number) => {
    // Handle empty values properly - convert empty string to null
    const statusValue = value === '' ? null : Number(value)

    setFormData((prev) => {
      const updated = {
        ...prev,
        status: statusValue,
      }
      if (!isInitialDataLoad.current) {
        handleDraftSave(updated)
      }
      return updated
    })

    if (formErrors.status) {
      setFormErrors((prev) => ({ ...prev, status: '' }))
    }
  }

  /**
   * Function Name: handleSkillsChange
   * Params: value
   * Description: Handle skills selection change and update employee dropdown
   * Author: Harsithiga B,
   * Created: 21-09-2025,
   * Classification: Confidential
   */
  const handleSkillsChange = (value: (string | number)[]) => {
    const skillIds = value as number[]

    setFormData((prev) => {
      const updated = {
        ...prev,
        skillRequired: skillIds,
        // Clear resource if no skills are selected
        resource: skillIds.length === NUMBERMAP.ZERO ? null : prev.resource,
      }
      if (!isInitialDataLoad.current) {
        handleDraftSave(updated)
      }
      return updated
    })

    if (formErrors.skillRequired) {
      setFormErrors((prev) => ({ ...prev, skillRequired: '' }))
    }

    // Update selected skills to trigger employee API call
    setSelectedSkills(skillIds)
  }

  /**
   * Function Name: validateForm
   * Params: None
   * Description: Validate all form fields and set error messages
   * Author: Harsithiga B,
   * Created: 21-09-2025,
   * Classification: Confidential
   */
  const validateForm = (): boolean => {
    const errors = { ...RT_INITIAL_ERRORS }
    let valid = true

    // Validate all fields using a common method
    Object.keys(RT_FIELD_LABELS).forEach((field) => {
      const fieldKey = field as keyof RiskControlMeasureData
      const fieldValue = formData[fieldKey]

      if (fieldKey === RT_FORM_FIELDS.SKILL_REQUIRED) {
        if (!fieldValue || (fieldValue as number[]).length === NUMBERMAP.ZERO) {
          errors[fieldKey] =
            `${RT_FIELD_LABELS[fieldKey]} ${RT_VALIDATION_MESSAGES.REQUIRED}`
          valid = false
        }
      } else if (fieldValue === null) {
        // For all other dropdown fields (stage, responsibility, resource, status), check if null
        // Status can be 0 (Inactive) or 1 (Active), both are valid when selected
        errors[fieldKey] =
          `${RT_FIELD_LABELS[fieldKey]} ${RT_VALIDATION_MESSAGES.REQUIRED}`
        valid = false
      }
    })

    if (!valid) {
      validateAndFocusFirstEmptyField(formData, Array.from(RISK_TEAM_FIELD_ORDER), RISK_TEAM_FIELD_LABEL_MAP);
    }
    setFormErrors(errors)
    return valid
  }

  /**
   * Function Name: resetForm
   * Params: None
   * Description: Reset form data, errors and selected skills to initial state
   * Author: Harsithiga B,
   * Created: 21-09-2025,
   * Classification: Confidential
   */
  const resetForm = () => {
    setFormData(RT_INITIAL_FORM_DATA)
    setFormErrors(RT_INITIAL_ERRORS)
    setSelectedSkills([])
  }

  const findDropdownValueByName = (data: any[], value: string, keyField: string = 'value',valueField: string = 'label') => {
    return data.find((item: any) => item[keyField] == value)?.[valueField]
  }

  const handleDraftSave = (data: RiskControlMeasureData) => {
    // Find status_name from status dropdown
    const selectedStatus = statusOptions?.data?.find(
      (status: any) => status[RT_DROPDOWN_FIELDS.STATUS.KEY_FIELD] === data.status
    )
    const status_name = (selectedStatus as any)?.[RT_DROPDOWN_FIELDS.STATUS.VALUE_FIELD] ?? null

    const payload = {
      risk_team_id: riskTeamId ?? 'draft',
      stage: data.stage,
      type:"draft",
      stage_name: findDropdownValueByName(stages?.data ?? [], data?.stage,'stage_applicable_id','stage_name'),
      responsibility: data.responsibility,
      responsibility_name: findDropdownValueByName(responsibilities?.data ?? [], data?.responsibility,'responsibility_id','responsibility_name'),
      skillRequired: data.skillRequired,
      employee_name: findDropdownValueByName(employees?.data ?? [], data?.resource,'id','employee_name'),
      resource: data.resource,
      status: data.status,
      status_name: status_name,
    }
    draftSave({
      form_type: 'risk_team',
      form_data: payload,
      timestamp: new Date().toISOString(),
    })
  }

  /**
   * Function Name: handleModalSave
   * Params: None
   * Description: Validate form and save data, then reset and close modal
   * Author: Harsithiga B,
   * Created: 21-09-2025,
   * Classification: Confidential
   */
  const handleModalSave = () => {
    if (!hasEditPermission) return
    if (!validateForm()) return
    clearDraftSave()
    onSave?.(formData)
    resetForm()
    onClose?.()
  }

  /**
   * Function Name: handleModalClose
   * Params: None
   * Description: Reset form and close modal with cancel callback
   * Author: Harsithiga B,
   * Created: 21-09-2025,
   * Classification: Confidential
   */
  const handleModalClose = async() => {
    await checkUnsavedDraftBeforeLeave()
    resetForm()
    onCancel?.()
    onClose?.()
  }

  // Create action handlers for buttons
  const actionHandlers: Record<string, (id: number) => void> = {
    Save: () => handleModalSave(),
    Cancel: () => {
      handleModalClose()
    },
  }

  // Process permissions to get dynamic buttons
  // In edit mode, wait for data to load before showing buttons
  const { buttons: buttonDetails, hasEditPermission } = processButtonsWithPermissions(
    permissions,
    actionHandlers,
    isDataLoading
  )

  useEffect(() => {
    if (open && !isDataLoading && !buttonDetails) {
      showActionAlert('customAlert', {
        title: QUERYCONSTANTS.ALERT_MESSAGES.ACCESS_DENIED_TITLE,
        text: QUERYCONSTANTS.ALERT_MESSAGES.PAGE_DENIED,
        icon: QUERYCONSTANTS.ALERT_MESSAGES.ERROR_ICON,
        cancelButton: false,
        confirmButton: false,
      })
    }
  }, [buttonDetails, isDataLoading, open])

  return (
    <CommonModal
      open={open}
      onClose={handleModalClose}
      onSave={handleModalSave}
      buttonRequired={false}
      title={isEditMode ? RT_PAGE_TITLES.EDIT_MODAL : RT_PAGE_TITLES.MODAL}
    >
      {isDraftSaving && <DraftLoading />}
      <Grid2 container spacing={NUMBERMAP.ONE} sx={popup_style}>
        <Grid2 size={NUMBERMAP.TWELVE}>
          <InputField
            label={`${RT_FORM_LABELS.STAGE}*`}
            placeholder={RT_FORM_PLACEHOLDERS.STAGE}
            isDropdown={true}
            value={
              formData.stage !== null ? formData.stage?.toString() : ''
            }
            onChange={handleChange(RT_FORM_FIELDS.STAGE)}
            options={transformStagesData}
            error={formErrors.stage}
            keyField={RT_DROPDOWN_FIELDS.STAGE.KEY_FIELD}
            valueField={RT_DROPDOWN_FIELDS.STAGE.VALUE_FIELD}
            disabled={!hasEditPermission}
          />
        </Grid2>

        <Grid2 size={NUMBERMAP.TWELVE}>
          <InputField
            label={`${RT_FORM_LABELS.RESPONSIBILITY}*`}
            placeholder={RT_FORM_PLACEHOLDERS.RESPONSIBILITY}
            isDropdown={true}
            value={
              formData.responsibility !== null
                ? formData.responsibility?.toString()
                : ''
            }
            onChange={handleChange(RT_FORM_FIELDS.RESPONSIBILITY)}
            options={responsibilities?.data ?? []}
            error={formErrors.responsibility}
            keyField={RT_DROPDOWN_FIELDS.RESPONSIBILITY.KEY_FIELD}
            valueField={RT_DROPDOWN_FIELDS.RESPONSIBILITY.VALUE_FIELD}
            disabled={!hasEditPermission}
          />
        </Grid2>

        <Grid2 size={NUMBERMAP.TWELVE}>
          <MultiSelect
            label={`${RT_FORM_LABELS.SKILL_REQUIRED}*`}
            placeholder={RT_FORM_PLACEHOLDERS.SKILL_REQUIRED}
            value={formData.skillRequired}
            onChange={handleSkillsChange}
            options={skills?.data ?? []}
            error={formErrors.skillRequired}
            idField={RT_DROPDOWN_FIELDS.SKILL.ID_FIELD}
            valueField={RT_DROPDOWN_FIELDS.SKILL.VALUE_FIELD}
            disabled={!hasEditPermission}
          />
        </Grid2>

        <Grid2 size={NUMBERMAP.TWELVE}>
          <InputField
            label={`${RT_FORM_LABELS.RESOURCE}*`}
            placeholder={RT_FORM_PLACEHOLDERS.RESOURCE}
            isDropdown={true}
            value={
              formData.resource !== null
                ? formData.resource?.toString()
                : ''
            }
            onChange={handleChange(RT_FORM_FIELDS.RESOURCE)}
            options={employees?.data ?? []}
            error={formErrors.resource}
            keyField={RT_DROPDOWN_FIELDS.EMPLOYEE.KEY_FIELD}
            valueField={RT_DROPDOWN_FIELDS.EMPLOYEE.VALUE_FIELD}
            disabled={!hasEditPermission}
          />
        </Grid2>

        <Grid2 size={NUMBERMAP.TWELVE}>
          <InputField
            label={`${RT_FORM_LABELS.STATUS}*`}
            placeholder={RT_FORM_PLACEHOLDERS.STATUS}
            isDropdown={true}
            value={formData.status?.toString() ?? ''}
            onChange={handleStatusChange}
            options={statusOptions?.data ?? []}
            error={formErrors.status}
            keyField={RT_DROPDOWN_FIELDS.STATUS.KEY_FIELD}
            valueField={RT_DROPDOWN_FIELDS.STATUS.VALUE_FIELD}
            disabled={!hasEditPermission}
          />
        </Grid2>
      </Grid2>
      {buttonDetails && <ButtonGroup buttons={buttonDetails} />}
    </CommonModal>
  )
}

export default RiskTeamModal
