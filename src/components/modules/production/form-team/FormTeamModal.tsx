'use client'
import React, { useState, useEffect } from 'react'
import { Grid2 } from '@mui/material'
import { InputField, RichTextEditor, showActionAlert } from '@/components/ui'
import CommonModal from '@/components/ui/common-modal/CommonModal'
import { NUMBERMAP } from '@/constants/common'
import { POPUP_STYLE } from '@/styles/modules/dnd/designReviewReport'
import { useRoles } from '@/hooks/modules/hr/useRoleDefinition'
import { useGetEmployees } from '@/hooks/modules/risk-management/useCommittee'
import { useOrganizationStatus } from "@/hooks/useCommonDropdown"
import { FormTeamModalData, FormTeamModalProps, FormTeamModalSaveData } from '@/types/modules/production/formTeam'
import {
  FORM_TEAM_ERROR_MESSAGES,
  INITIAL_FORM_DATA,
  FORM_TEAM_FIELD_LABELS,
  FORM_TEAM_FIELD_PLACEHOLDERS,
  FORM_TEAM_FIELD_KEY_FIELDS,
  FORM_TEAM_FIELD_VALUE_FIELDS,
  MODAL_MODE,
  MODAL_TITLES,
  DUPLICATE_ALERT,
  CUSTOM_ALERT,
} from '@/constants/modules/production/formTeam'

/**
 * Classification: Confidential
 */

const FormTeamModal: React.FC<FormTeamModalProps> = ({
  open,
  onClose,
  onSave,
  mode = MODAL_MODE.ADD,
  initialData,
  existingRows = [],
  editingRowId,
}) => {
  const [formData, setFormData] = useState<FormTeamModalData>(
    initialData ?? INITIAL_FORM_DATA
  )
  const [errors, setErrors] = useState<Partial<FormTeamModalData>>({})

  const { data: rolesData } = useRoles()
  const { data: employeesData, isLoading: isEmployeesLoading } = useGetEmployees(
    formData.role ? Number(formData.role) : undefined
  )
  const { data: statusData } = useOrganizationStatus()

  useEffect(() => {
    if (open && initialData) {
      setFormData(initialData)
      setErrors({})
    } else if (open && !initialData) {
      setFormData(INITIAL_FORM_DATA)
      setErrors({})
    }
  }, [open, initialData])

  const validateForm = (): boolean => {
    const newErrors: Partial<FormTeamModalData> = {}
    if (!formData.role?.trim()) {
      newErrors.role = FORM_TEAM_ERROR_MESSAGES.ROLE_REQUIRED
    }
    if (!formData.resource?.trim()) {
      newErrors.resource = FORM_TEAM_ERROR_MESSAGES.RESOURCE_REQUIRED
    }
    if (!formData.responsibility?.trim()) {
      newErrors.responsibility = FORM_TEAM_ERROR_MESSAGES.RESPONSIBILITY_REQUIRED
    }
    if (!formData.status?.trim()) {
      newErrors.status = FORM_TEAM_ERROR_MESSAGES.STATUS_REQUIRED
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === NUMBERMAP.ZERO
  }

  const handleInputChange = (field: keyof FormTeamModalData, value: string) => {
    setFormData((prev) => {
      const newFormData = { ...prev, [field]: value }
      // If role changes, clear the resource selection
      if (field === 'role') {
        newFormData.resource = ''
      }
      return newFormData
    })
    // Clear error for this field when user starts typing
    setErrors((prev) => {
      if (prev[field]) {
        // Remove dynamic key using destructuring
        const { [field]: removed, ...updated } = prev;
        return updated;
      }
      return prev;
    })
  }

  const handleSave = () => {
    const isValid = validateForm()
    if (!isValid) {
      // Validation failed - errors are already set, just return
      return
    }
    
    // Check for duplicate role and resource combination
    const roleId = Number(formData.role)
    const resourceId = Number(formData.resource)
    
    const isDuplicate = existingRows.some((row) => {
      // Exclude the current row being edited from duplicate check
      if (mode === MODAL_MODE.EDIT && editingRowId && row.team_details_id === editingRowId) {
        return false
      }
      // Check if role_id and employee_id match
      return row.role_id === roleId && row.employee_id === resourceId
    })
    
    if (isDuplicate) {
      // Show error alert for duplicate
      showActionAlert(CUSTOM_ALERT, {
        title: DUPLICATE_ALERT.TITLE,
        text: DUPLICATE_ALERT.MESSAGE,
        icon: DUPLICATE_ALERT.ICON,
        cancelButton: false,
        confirmButton: true,
        confirmButtonText: DUPLICATE_ALERT.CONFIRM_BUTTON_TEXT,
      })
      return
    }
    
    // Get role name and employee name from the data
    const roleName = rolesData?.data?.find(
      (r: any) => r[FORM_TEAM_FIELD_KEY_FIELDS.ROLE]?.toString() === formData.role.toString()
    )?.[FORM_TEAM_FIELD_VALUE_FIELDS.ROLE] ?? ''
    
    const employeeName = employeesData?.data?.find(
      (emp: any) => emp[FORM_TEAM_FIELD_KEY_FIELDS.RESOURCE]?.toString() === formData.resource.toString()
    )?.[FORM_TEAM_FIELD_VALUE_FIELDS.RESOURCE] ?? ''
    
    // Prepare save data with names
    const saveData: FormTeamModalSaveData = {
      ...formData,
      role_name: roleName,
      employee_name: employeeName,
    }
    
    // Validation passed - proceed with save
    onSave(saveData)
    setFormData(INITIAL_FORM_DATA)
    setErrors({})
  }

  const handleClose = () => {
    setFormData(initialData ?? INITIAL_FORM_DATA)
    setErrors({})
    onClose()
  }

  return (
    <CommonModal
      open={open}
      title={mode === MODAL_MODE.EDIT ? MODAL_TITLES.EDIT : MODAL_TITLES.ADD}
      onClose={handleClose}
      onSave={handleSave}
      buttonRequired={true}
    >
      <Grid2 container spacing={NUMBERMAP.ONE} sx={{ ...POPUP_STYLE }}>
        <Grid2 size={NUMBERMAP.TWELVE}>
          <InputField
            label={FORM_TEAM_FIELD_LABELS.ROLE}
            placeholder={FORM_TEAM_FIELD_PLACEHOLDERS.ROLE}
            isDropdown
            options={rolesData?.data ?? []}
            keyField={FORM_TEAM_FIELD_KEY_FIELDS.ROLE}
            valueField={FORM_TEAM_FIELD_VALUE_FIELDS.ROLE}
            value={formData.role}
            onChange={(value: string) => handleInputChange('role', value)}
            error={errors.role}
          />
        </Grid2>
        <Grid2 size={NUMBERMAP.TWELVE}>
          <InputField
            label={FORM_TEAM_FIELD_LABELS.RESOURCE}
            placeholder={FORM_TEAM_FIELD_PLACEHOLDERS.RESOURCE}
            isDropdown
            options={employeesData?.data ?? []}
            keyField={FORM_TEAM_FIELD_KEY_FIELDS.RESOURCE}
            valueField={FORM_TEAM_FIELD_VALUE_FIELDS.RESOURCE}
            value={formData.resource}
            onChange={(value: string) => handleInputChange('resource', value)}
            error={errors.resource}
            disabled={!formData.role || isEmployeesLoading}
          />
        </Grid2>
        <Grid2 size={NUMBERMAP.TWELVE}>
          <RichTextEditor
            label={FORM_TEAM_FIELD_LABELS.RESPONSIBILITY}
            placeholder={FORM_TEAM_FIELD_PLACEHOLDERS.RESPONSIBILITY}
            value={formData.responsibility}
            onChange={(value: string) => handleInputChange('responsibility', value)}
            error={errors.responsibility}
          />
        </Grid2>
        <Grid2 size={NUMBERMAP.TWELVE}>
          <InputField
            isDropdown
            options={statusData?.data ?? []}
            keyField={FORM_TEAM_FIELD_KEY_FIELDS.STATUS}
            valueField={FORM_TEAM_FIELD_VALUE_FIELDS.STATUS}
            label={FORM_TEAM_FIELD_LABELS.STATUS}
            placeholder={FORM_TEAM_FIELD_PLACEHOLDERS.STATUS}
            value={formData.status}
            onChange={(value: string) => handleInputChange('status', value)}
            error={errors.status}
          />
        </Grid2>
      </Grid2>
    </CommonModal>
  )
}

export default FormTeamModal

