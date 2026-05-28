/**
 * Classification : Confidential
 **/
'use client'
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { InputField, ButtonGroup, Description, showActionAlert } from '@/components/ui'
import CommonModal from '@/components/ui/common-modal/CommonModal'
import Grid2 from '@mui/material/Grid2'
import { processButtonsWithPermissions, QUERYCONSTANTS } from '@/lib/utils/common'
import {
  COMMITTEE_FORM_LABELS,
  COMMITTEE_FORM_PLACEHOLDERS,
  COMMITTEE_ERROR_MESSAGES,
  COMMITTEE_FIELD_KEYS,
  COMMITTEE_DROPDOWN_CONFIG,
  COMMITTEE_STATUS_MESSAGES,
  COMMITTEE_INITIAL_DATA,
  COMMITTEE_PAGE_CONSTANTS,
  COMMITTEE_FIELD_ORDER,
  COMMITTEE_FIELD_LABEL_MAP,
} from '@/constants/modules/risk-management/committee'
import {
  CommitteeFormData,
  CommitteeFormErrors,
  CommitteeModalProps,
} from '@/types/modules/risk/committee'
import {
  useGetRoles,
  useGetEmployees,
  useGetCommitteeById,
} from '@/hooks/modules/risk-management/useCommittee'
import { useOrganizationStatus } from '@/hooks/useCommonDropdown'
import { GRID_SIZES } from '@/styles/modules/dnd/project'
import { NUMBERMAP, DRAFT } from '@/constants/common'
import { popup_style } from '@/styles/common'
import { useDraftSave } from '@/hooks/common/useDraftSave'
import DraftLoading from '@/components/ui/draft-loader/DraftLoader'
import { validateAndFocusFirstEmptyField } from '@/lib/utils/formUtils'

const CommitteeModal: React.FC<CommitteeModalProps> = ({
  open,
  onClose,
  onSave,
  projectId,
  committeeData,
  isLoading = false,
  isEditMode = false,
  permissions: createModePermissions,
}) => {
  const [formData, setFormData] = useState<CommitteeFormData>({
    ...COMMITTEE_INITIAL_DATA,
    project_id: projectId,
  })
  const [errors, setErrors] = useState<CommitteeFormErrors>({})
  const isInitialDataLoad = useRef(true)
  
  // Determine draft context: use committee_id if valid, otherwise use projectId
  const committeeId = committeeData?.committee_id;
  const isValidCommitteeId = committeeId && 
                              !isNaN(Number(committeeId)) && 
                              Number(committeeId) > 0;
  
  const draftContext = {
    context_instance_id: isValidCommitteeId ? Number(committeeId) : projectId,
    context_type: isValidCommitteeId ? 'committee' : 'project',
  };

  const { draftSave, isDraftSaving, clearDraftSave, fetchDraft,  draftData, checkUnsavedDraftBeforeLeave } = useDraftSave(
    {
      context_instance_id: draftContext.context_instance_id,
      context_type: draftContext.context_type,
      enableFetch : false}
  )
  const { data: rolesData, isLoading: isRolesLoading } = useGetRoles()
  const { data: employeesData, isLoading: isEmployeesLoading } =
    useGetEmployees(formData.role_id ?? undefined)
  const { data: statusData, isLoading: isStatusLoading } =
    useOrganizationStatus()

  // Fetch committee data by ID when editing
  const {
    data: fetchedCommitteeData,
    isLoading: isFetchingCommittee,
    isFetching: isFetchingCommitteeData,
    refetch: refetchCommitteeById,
  } = useGetCommitteeById(committeeId ?? NUMBERMAP.ZERO, projectId)

  // Extract permissions: use fetch by id permissions for edit mode, create mode permissions for create mode
  const editModePermissions = fetchedCommitteeData?.meta_info?.action_control?.permissions ?? []
  const permissions = isEditMode ? editModePermissions : createModePermissions ?? []
  
  // In edit mode, wait for data to be loaded before showing buttons
  const isDataLoading = isEditMode && (isFetchingCommittee || isFetchingCommitteeData)

  useEffect(() => {
    if (open && !isEditMode) {
      fetchDraft()
    }
  }, [open, isEditMode])

  useEffect(() => {
    if (open && isEditMode && isValidCommitteeId) {
      refetchCommitteeById()
    }
  }, [open, isEditMode, isValidCommitteeId])

  // Use API data directly - memoized to prevent infinite re-renders
  const statusOptions = useMemo(
    () => statusData?.data ?? [],
    [statusData?.data]
  )

  useEffect(() => {
    if(draftData?.data){
      const data = draftData?.data
      if (data && typeof data === 'object' && (data as any).type === DRAFT) {
        setFormData({
          ...data,
          project_id: projectId, // Add project_id from params
          status: data.status_id, // Only status field needs mapping
        })
      }
    }
    else if (committeeId && fetchedCommitteeData?.data) {
      const data = fetchedCommitteeData.data
      if (data && typeof data === 'object' && (data as any).type === DRAFT) {
        const draftData = data as any
        setFormData({
          project_id: projectId,
          committee_id: draftData.committee_id ?? null,
          role_id: draftData.role_id ?? null,
          employee_id: draftData.employee_id ?? null,
          description: draftData.description ?? '',
          status: draftData.status_id ?? draftData.status ?? null,
        })
      } else if (Array.isArray(data) && data.length > NUMBERMAP.ZERO) {
        const apiData = data[NUMBERMAP.ZERO]
        setFormData({
          ...apiData,
          project_id: projectId,
          status: apiData.status_id,
        })
      }
    } else {
      setFormData({
        ...COMMITTEE_INITIAL_DATA,
        project_id: projectId,
      })
    }
    setErrors({})
      isInitialDataLoad.current = false
  }, [draftData, projectId, open, fetchedCommitteeData, statusOptions])

  /**
   * Function Name: handleDraftSave
   * Params: newFormData (CommitteeFormData)
   * Description: Extract draft save logic to a separate function for better separation of concerns
   * Author: Refactored
   * Created: 2025-01
   * Classification: Confidential
   */
  const handleDraftSave = useCallback(
    (newFormData: CommitteeFormData) => {
      //passing these values in the draft payload as it should be shown in datatable
      // Find role_name from roles dropdown
      const selectedRole = rolesData?.data?.find(
        (role: any) => role[COMMITTEE_DROPDOWN_CONFIG.ROLE.KEY_FIELD] === newFormData.role_id
      )
      const role_name = (selectedRole as any)?.[COMMITTEE_DROPDOWN_CONFIG.ROLE.VALUE_FIELD] ?? null

      // Find employee_name from employees dropdown
      const selectedEmployee = employeesData?.data?.find(
        (employee: any) => employee[COMMITTEE_DROPDOWN_CONFIG.EMPLOYEE.KEY_FIELD] === newFormData.employee_id
      )
      const employee_name = (selectedEmployee as any)?.[COMMITTEE_DROPDOWN_CONFIG.EMPLOYEE.VALUE_FIELD] ?? null

      // Find status_name from status dropdown
      const selectedStatus = statusOptions?.find(
        (status: any) => status[COMMITTEE_DROPDOWN_CONFIG.STATUS.KEY_FIELD] === newFormData.status
      )
      const status_name = (selectedStatus as any)?.[COMMITTEE_DROPDOWN_CONFIG.STATUS.VALUE_FIELD] ?? null

      draftSave({
        project_id: draftContext.context_instance_id,
        form_type: draftContext.context_type,
        form_data: {
          ...newFormData,
          committee_id: committeeId ?? null,
          status_id: newFormData.status,
          role_name,
          employee_name,
          status_name,
          type : DRAFT,
        },
        timestamp: new Date().toISOString(),
      })
    },
    [
      rolesData?.data,
      employeesData?.data,
      statusOptions,
      draftSave,
      draftContext.context_instance_id,
      draftContext.context_type,
      committeeId,
    ]
  )

  const handleInputChange = (
    field: keyof CommitteeFormData,
    value: string | number | null
  ) => {
    setFormData((prev) => {
      const newFormData = { ...prev, [field]: value }
      
      // If role changes, clear the employee selection
      if (field === COMMITTEE_FIELD_KEYS.ROLE_ID) {
        newFormData.employee_id = null
      }
      
      if (!isInitialDataLoad.current) {
        handleDraftSave(newFormData)
      }
      return newFormData
    })
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const validateForm = (): boolean => {
    const newErrors: CommitteeFormErrors = {}

    if (!formData.role_id) {
      newErrors.role_id = COMMITTEE_ERROR_MESSAGES.ROLE_REQUIRED
    }

    if (!formData.employee_id) {
      newErrors.employee_id = COMMITTEE_ERROR_MESSAGES.EMPLOYEE_REQUIRED
    }

    if (!formData.description?.trim()) {
      newErrors.description = COMMITTEE_ERROR_MESSAGES.DESCRIPTION_REQUIRED
    }

    if (!formData.status) {
      newErrors.status = COMMITTEE_STATUS_MESSAGES.STATUS_REQUIRED
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === NUMBERMAP.ZERO
  }

  const handleSave = () => {
    if (!validateForm()) {
      validateAndFocusFirstEmptyField(formData, Array.from(COMMITTEE_FIELD_ORDER), COMMITTEE_FIELD_LABEL_MAP);
      return
    }
    clearDraftSave()
    onSave(formData)

  }

  const handleCancel = async() => {
    await checkUnsavedDraftBeforeLeave()
    setFormData({
      ...COMMITTEE_INITIAL_DATA,
      project_id: projectId,
    })
    setErrors({})
    onClose()
  }

  // Create action handlers for buttons
  const actionHandlers: Record<string, (id: number) => void> = {
    Save: () => handleSave(),
    Cancel: () => {
      handleCancel()
    },
  }

  // Process permissions to get dynamic buttons
  // In edit mode, wait for data to load before showing buttons
  const { buttons: buttonDetails, hasEditPermission } = processButtonsWithPermissions(
    permissions,
    actionHandlers,
    isLoading || isDataLoading
  )

  useEffect(() => {
    if (open && !(isLoading || isDataLoading) && !buttonDetails) {
      showActionAlert('customAlert', {
        title: QUERYCONSTANTS.ALERT_MESSAGES.ACCESS_DENIED_TITLE,
        text: QUERYCONSTANTS.ALERT_MESSAGES.PAGE_DENIED,
        icon: QUERYCONSTANTS.ALERT_MESSAGES.ERROR_ICON,
        cancelButton: false,
        confirmButton: false,
      })
    }
  }, [buttonDetails, isDataLoading, isLoading, open])

  const isCommitteeFieldDisabled = (loadingFlag?: boolean | null) => {
    // Nullish check prevents undefined loading flags from disabling inputs
    if ((loadingFlag ?? false) === true) return true
    if (!hasEditPermission) return true
    return false
  }

  return (
    <CommonModal
      open={open}
      onClose={handleCancel}
      onSave={handleSave}
      buttonRequired={false}
      title={COMMITTEE_PAGE_CONSTANTS.MODAL_TITLE}
    >
      {isDraftSaving && <DraftLoading />}
        <Grid2 container spacing={NUMBERMAP.ONE} sx={popup_style}>
          <Grid2 size={GRID_SIZES.FULL_WIDTH}>
            <InputField
              label={COMMITTEE_FORM_LABELS.ROLE}
              placeholder={COMMITTEE_FORM_PLACEHOLDERS.ROLE}
              isDropdown={true}
              options={rolesData?.data ?? []}
              value={formData.role_id?.toString() ?? ''}
              onChange={(value: string) =>
                handleInputChange(
                  COMMITTEE_FIELD_KEYS.ROLE_ID as keyof CommitteeFormData,
                  value ? parseInt(value, NUMBERMAP.TEN) : null
                )
              }
              error={errors.role_id}
              keyField={COMMITTEE_DROPDOWN_CONFIG.ROLE.KEY_FIELD}
              valueField={COMMITTEE_DROPDOWN_CONFIG.ROLE.VALUE_FIELD}
              disabled={isCommitteeFieldDisabled(isRolesLoading)}
            />
          </Grid2>

          <Grid2 size={GRID_SIZES.FULL_WIDTH}>
            <InputField
              label={COMMITTEE_FORM_LABELS.ASSIGNED_EMPLOYEE}
              placeholder={COMMITTEE_FORM_PLACEHOLDERS.ASSIGNED_EMPLOYEE}
              isDropdown={true}
              options={employeesData?.data ?? []}
              value={formData.employee_id?.toString() ?? ''}
              onChange={(value: string) =>
                handleInputChange(
                  COMMITTEE_FIELD_KEYS.EMPLOYEE_ID as keyof CommitteeFormData,
                  value ? parseInt(value, NUMBERMAP.TEN) : null
                )
              }
              error={errors.employee_id}
              keyField={COMMITTEE_DROPDOWN_CONFIG.EMPLOYEE.KEY_FIELD}
              valueField={COMMITTEE_DROPDOWN_CONFIG.EMPLOYEE.VALUE_FIELD}
              disabled={isCommitteeFieldDisabled(isEmployeesLoading)}
            />
          </Grid2>

          <Grid2 size={GRID_SIZES.FULL_WIDTH}>
            <Description
              label={COMMITTEE_FORM_LABELS.DESCRIPTION}
              placeholder={COMMITTEE_FORM_PLACEHOLDERS.DESCRIPTION}
              value={formData.description}
              onChange={(value: string) =>
                handleInputChange(
                  COMMITTEE_FIELD_KEYS.DESCRIPTION as keyof CommitteeFormData,
                  value
                )
              }
              error={errors.description}
              disabled={!hasEditPermission}
            />
          </Grid2>

          <Grid2 size={GRID_SIZES.FULL_WIDTH}>
            <InputField
              label={COMMITTEE_FORM_LABELS.STATUS}
              placeholder={COMMITTEE_FORM_PLACEHOLDERS.STATUS}
              isDropdown={true}
              options={statusOptions}
              value={formData.status?.toString() ?? ''}
              onChange={(value: string) =>
                handleInputChange(
                  COMMITTEE_FIELD_KEYS.STATUS as keyof CommitteeFormData,
                  value ? parseInt(value, NUMBERMAP.TEN) : null
                )
              }
              error={errors.status}
              keyField={COMMITTEE_DROPDOWN_CONFIG.STATUS.KEY_FIELD}
              valueField={COMMITTEE_DROPDOWN_CONFIG.STATUS.VALUE_FIELD}
              disabled={isCommitteeFieldDisabled(isStatusLoading)}
            />
          </Grid2>
        </Grid2>
        {buttonDetails && <ButtonGroup buttons={buttonDetails} />}
    </CommonModal>
  )
}

export default CommitteeModal
