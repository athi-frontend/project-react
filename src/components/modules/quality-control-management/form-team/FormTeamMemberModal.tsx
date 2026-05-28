/**
 * Form Team Member Modal Component
 * Classification: Confidential
 */

'use client'
import React, { useState, useEffect } from 'react'
import Grid2 from '@mui/material/Grid2'
import { InputField, Description } from '@/components/ui'
import { NUMBERMAP } from '@/constants/common'
import CommonModal from '@/components/ui/common-modal/CommonModal'
import { popup_style } from '@/styles/common'
import {
  TEAM_MEMBER_MODAL,
  FT_DROPDOWN_FIELDS,
  FT_PAGE_TITLES,
  INITIAL_TEAM_MEMBER_FORM_DATA,
  INITIAL_TEAM_MEMBER_ERRORS,
} from '@/constants/modules/quality-control-management/formTeam'
import {
  TeamMemberModalData,
  TeamMemberModalFormErrors,
  TeamMemberModalProps,
  TeamMemberRow,
  EmployeeData,
} from '@/types/modules/quality-control-management/formTeam'
import { useGetPartCategories } from '@/hooks/modules/quality-control-management/useFormTeam'
import { useFetchSkills } from '@/hooks/modules/hr/useTrainingNeeds'
import { useGetEmployeesBySkills } from '@/hooks/modules/risk-management/useRiskTeam'
import { useOrganizationStatus } from '@/hooks/useCommonDropdown'

const FormTeamMemberModal: React.FC<TeamMemberModalProps> = ({
  onSave,
  onCancel,
  onClose,
  open,
  initialData,
  purchaseOrderId,
  partCategories: propPartCategories,
  skills: propSkills,
  employees: propEmployees,
  statusOptions: propStatusOptions,
}) => {
  const [formData, setFormData] = useState<TeamMemberModalData>(
    INITIAL_TEAM_MEMBER_FORM_DATA
  )
  const [formErrors, setFormErrors] = useState<TeamMemberModalFormErrors>(
    INITIAL_TEAM_MEMBER_ERRORS
  )
  const [selectedSkillId, setSelectedSkillId] = useState<number | null>(null)

  // API hooks for dropdown data
  const { data: partCategoriesData } = useGetPartCategories(
    purchaseOrderId ?? null
  )
  const { data: skillsData } = useFetchSkills(NUMBERMAP.ONE)
  const { data: employeesData } = useGetEmployeesBySkills(
    selectedSkillId ? [selectedSkillId] : [],
    NUMBERMAP.ONE
  )
  const { data: statusOptionsData } = useOrganizationStatus()

  /**
   * Transform TeamMemberRow to TeamMemberModalData
   */
  const transformRowToModalData = (row: TeamMemberRow): TeamMemberModalData => {
    return {
      ...row,
      responsibility_description: row.responsibility_description ?? '',
    }
  }

  /**
   * Initialize form for edit mode
   */
  const initializeEditMode = (data: TeamMemberRow) => {
    const transformedData = transformRowToModalData(data)
    setFormData(transformedData)
    setSelectedSkillId(transformedData.skill_id)
  }

  /**
   * Initialize form for create mode
   */
  const initializeCreateMode = () => {
    setFormData(INITIAL_TEAM_MEMBER_FORM_DATA)
    setSelectedSkillId(null)
  }

  /**
   * Get modal title based on mode
   */
  const getModalTitle = (): string => {
    return initialData ? FT_PAGE_TITLES.EDIT_MODAL : FT_PAGE_TITLES.MODAL
  }

  /**
   * Handle data prefilling based on initialData presence
   */
  useEffect(() => {
    if (initialData) {
      initializeEditMode(initialData)
    } else {
      initializeCreateMode()
    }
  }, [initialData])

  /**
   * Handle skill selection change and update employee dropdown
   */
  const handleSkillChange = (value: string | number) => {
    const skillId = value === '' ? null : Number(value)
    setFormData((prev) => ({
      ...prev,
      skill_id: skillId,
      // Clear employee if skill changes
      // Note: employee_name is computed dynamically from employee_id in handleModalSave
      employee_id: null,
    }))
    setSelectedSkillId(skillId)
    if (formErrors.skill_id) {
      setFormErrors((prev) => ({ ...prev, skill_id: '' }))
    }
  }

  /**
   * Handle part category change - auto-load skills from mapping
   */
  const handlePartCategoryChange = (value: string | number) => {
    const partCategoryId = value === '' ? null : Number(value)
    setFormData((prev) => ({
      ...prev,
      part_category_id: partCategoryId,
      // Clear skill and employee when part category changes
      // Note: employee_name is computed dynamically from employee_id in handleModalSave
      skill_id: null,
      employee_id: null,
    }))
    setSelectedSkillId(null)
    if (formErrors.part_category_id) {
      setFormErrors((prev) => ({ ...prev, part_category_id: '' }))
    }
  }

  /**
   * Check if field is a numeric field
   */
  const isNumericField = (field: keyof TeamMemberModalData): boolean => {
    return (
      field === TEAM_MEMBER_MODAL.FIELD_NAMES.PART_CATEGORY ||
      field === TEAM_MEMBER_MODAL.FIELD_NAMES.SKILL_REQUIRED ||
      field === TEAM_MEMBER_MODAL.FIELD_NAMES.RESOURCE ||
      field === TEAM_MEMBER_MODAL.FIELD_NAMES.STATUS
    )
  }

  /**
   * Convert value to numeric or null for numeric fields
   */
  const convertToNumericValue = (value: string | number): number | null => {
    if (value === '') return null
    return Number(value)
  }

  /**
   * Handle input change
   */
  const handleChange =
    (field: keyof TeamMemberModalData) => (value: string | number) => {
      let numericValue: string | number | null

      if (isNumericField(field)) {
        numericValue = convertToNumericValue(value)
      } else {
        numericValue = value
      }

      setFormData((prev) => ({
        ...prev,
        [field]: numericValue,
      }))

      // Only clear error if field exists in formErrors
      if (field !== 'employee_name' && field in formErrors) {
        setFormErrors((prev) => ({ ...prev, [field]: '' }))
      }
    }

  /**
   * Validate form
   */
  const validateForm = (): boolean => {
    const errors = { ...INITIAL_TEAM_MEMBER_ERRORS }
    let valid = true

    if (formData.part_category_id === null) {
      errors.part_category_id = TEAM_MEMBER_MODAL.PART_CATEGORY_REQUIRED
      valid = false
    }

    if (formData.skill_id === null) {
      errors.skill_id = TEAM_MEMBER_MODAL.SKILL_REQUIRED_REQUIRED
      valid = false
    }

    if (formData.employee_id === null) {
      errors.employee_id = TEAM_MEMBER_MODAL.RESOURCE_REQUIRED
      valid = false
    }

    if (!formData.responsibility.trim()) {
      errors.responsibility = TEAM_MEMBER_MODAL.RESPONSIBILITY_REQUIRED
      valid = false
    }

    if (formData.status === null) {
      errors.status = TEAM_MEMBER_MODAL.STATUS_REQUIRED
      valid = false
    }

    setFormErrors(errors)
    return valid
  }

  /**
   * Reset form
   */
  const resetForm = () => {
    setFormData(INITIAL_TEAM_MEMBER_FORM_DATA)
    setFormErrors(INITIAL_TEAM_MEMBER_ERRORS)
    setSelectedSkillId(null)
  }

  /**
   * Handle modal save
   */
  const handleModalSave = () => {
    if (!validateForm()) return

    // Get employee name from employees data
    const selectedEmployee = (employeesData?.data ?? []).find(
      (emp: EmployeeData) => emp.id === formData.employee_id
    )

    // Pass employee name along with form data
    onSave?.({
      ...formData,
      employee_name: selectedEmployee?.employee_name,
    })
    resetForm()
    onClose?.()
  }

  /**
   * Handle modal close
   */
  const handleModalClose = () => {
    resetForm()
    onCancel?.()
    onClose?.()
  }

  return (
    <CommonModal
      open={open}
      onClose={handleModalClose}
      onSave={handleModalSave}
      buttonRequired
      title={getModalTitle()}
    >
      <Grid2 container spacing={NUMBERMAP.ONE} sx={popup_style}>
        <Grid2 size={NUMBERMAP.TWELVE}>
          <InputField
            label={TEAM_MEMBER_MODAL.PART_CATEGORY_LABEL}
            placeholder={TEAM_MEMBER_MODAL.PART_CATEGORY_PLACEHOLDER}
            isDropdown={true}
            value={
              formData.part_category_id !== null
                ? formData.part_category_id.toString()
                : ''
            }
            onChange={handlePartCategoryChange}
            options={partCategoriesData?.data ?? []}
            error={formErrors.part_category_id}
            keyField={FT_DROPDOWN_FIELDS.PART_CATEGORY.KEY_FIELD}
            valueField={FT_DROPDOWN_FIELDS.PART_CATEGORY.VALUE_FIELD}
          />
        </Grid2>

        <Grid2 size={NUMBERMAP.TWELVE}>
          <InputField
            label={TEAM_MEMBER_MODAL.SKILL_REQUIRED_LABEL}
            placeholder={TEAM_MEMBER_MODAL.SKILL_REQUIRED_PLACEHOLDER}
            isDropdown={true}
            value={
              formData.skill_id !== null ? formData.skill_id.toString() : ''
            }
            onChange={handleSkillChange}
            options={skillsData?.data ?? []}
            error={formErrors.skill_id}
            keyField={FT_DROPDOWN_FIELDS.SKILL.ID_FIELD}
            valueField={FT_DROPDOWN_FIELDS.SKILL.VALUE_FIELD}
          />
        </Grid2>

        <Grid2 size={NUMBERMAP.TWELVE}>
          <InputField
            label={TEAM_MEMBER_MODAL.RESOURCE_LABEL}
            placeholder={TEAM_MEMBER_MODAL.RESOURCE_PLACEHOLDER}
            isDropdown={true}
            value={
              formData.employee_id !== null
                ? formData.employee_id.toString()
                : ''
            }
            onChange={handleChange(TEAM_MEMBER_MODAL.FIELD_NAMES.RESOURCE)}
            options={employeesData?.data ?? []}
            error={formErrors.employee_id}
            keyField={FT_DROPDOWN_FIELDS.EMPLOYEE.KEY_FIELD}
            valueField={FT_DROPDOWN_FIELDS.EMPLOYEE.VALUE_FIELD}
          />
        </Grid2>

        <Grid2 size={NUMBERMAP.TWELVE}>
          <InputField
            label={TEAM_MEMBER_MODAL.RESPONSIBILITY_LABEL}
            placeholder={TEAM_MEMBER_MODAL.RESPONSIBILITY_PLACEHOLDER}
            value={formData.responsibility}
            onChange={handleChange(
              TEAM_MEMBER_MODAL.FIELD_NAMES.RESPONSIBILITY
            )}
            error={formErrors.responsibility}
          />
        </Grid2>

        <Grid2 size={NUMBERMAP.TWELVE}>
          <Description
            label={TEAM_MEMBER_MODAL.RESPONSIBILITY_DESCRIPTION_LABEL}
            placeholder={
              TEAM_MEMBER_MODAL.RESPONSIBILITY_DESCRIPTION_PLACEHOLDER
            }
            value={formData.responsibility_description}
            onChange={handleChange(
              TEAM_MEMBER_MODAL.FIELD_NAMES.RESPONSIBILITY_DESCRIPTION
            )}
            error={formErrors.responsibility_description}
          />
        </Grid2>

        <Grid2 size={NUMBERMAP.TWELVE}>
          <InputField
            label={TEAM_MEMBER_MODAL.STATUS_LABEL}
            placeholder={TEAM_MEMBER_MODAL.STATUS_PLACEHOLDER}
            isDropdown={true}
            value={formData.status?.toString() ?? ''}
            onChange={handleChange(TEAM_MEMBER_MODAL.FIELD_NAMES.STATUS)}
            options={statusOptionsData?.data ?? []}
            error={formErrors.status}
            keyField={FT_DROPDOWN_FIELDS.STATUS.KEY_FIELD}
            valueField={FT_DROPDOWN_FIELDS.STATUS.VALUE_FIELD}
          />
        </Grid2>
      </Grid2>
    </CommonModal>
  )
}

export default FormTeamMemberModal
