'use client'
import React, { useState, useEffect } from 'react'
import { Grid2 } from '@mui/material'
import {
  InputField,
  showActionAlert,
} from '@/components/ui'
import CommonModal from '@/components/ui/common-modal/CommonModal'
import {
  FORM_LABELS,
  FORM_PLACEHOLDERS,
  FORM_FIELD_NAMES,
  VALIDATION_MESSAGES,
  MODAL_TITLE,
  DATA_SOURCE_NAME,
  ALERT_MESSAGES,
  DROPDOWN_FIELD_CONFIG,
} from '@/constants/modules/vendor-management/vendorSelectionCriteria'
import {
  VendorSelectionCriteriaFormData,
  VendorSelectionCriteriaFormErrors,
  VendorSelectionCriteriaModalProps,
} from '@/types/modules/vendor-management/vendorSelectionCriteria'
import { useVendorGroups, useVendorGroupCriteria, useRequirements } from '@/hooks/modules/vendor-management/useVendorSelectionCriteria'
import { useOrganizationStatus } from '@/hooks/useCommonDropdown'
import { NUMBERMAP } from '@/constants/common'
import { popup_style } from '@/styles/common'

/**
 * Classification: Confidential
 */

const DEFAULT_FORM_DATA: VendorSelectionCriteriaFormData = {
  partGroupName: '',
  criteria: '',
  requirement: '',
  status: '',
}

const VendorSelectionCriteriaModal: React.FC<VendorSelectionCriteriaModalProps> = ({
  open,
  onClose,
  onSave,
  initialData,
  criteriaId,
}) => {
  const [formData, setFormData] = useState<VendorSelectionCriteriaFormData>(DEFAULT_FORM_DATA)
  const [errors, setErrors] = useState<VendorSelectionCriteriaFormErrors>({})
  
  // Fetch vendor groups from API
  const { data: vendorGroupsData } = useVendorGroups()
  
  // Get the selected vendor group ID from form data
  const selectedVendorGroupId = formData.partGroupName ? parseInt(formData.partGroupName) : undefined
  
  // Fetch vendor group criteria from API (using selected vendor_group_id)
  const { data: vendorGroupCriteriaData } = useVendorGroupCriteria(selectedVendorGroupId ?? NUMBERMAP.ZERO)
  
  // Fetch requirements from API
  const { data: requirementsData } = useRequirements()
  
  // Fetch organization status from API
  const { data: statusData } = useOrganizationStatus()

  // Initialize form data when modal opens or initialData changes
  useEffect(() => {
    if (open) {
      setFormData(initialData ? { ...DEFAULT_FORM_DATA, ...initialData } : DEFAULT_FORM_DATA)
      setErrors({})
    }
  }, [open, initialData])


  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => {
      const newFormData = { ...prev, [field]: value }
      
      // If part group name changes and we're not editing, clear the criteria field
      if (field === FORM_FIELD_NAMES.PART_GROUP_NAME && !criteriaId) {
        newFormData.criteria = ''
      }
      
      return newFormData
    })

    // Clear error for the field if it has a value
    if (value?.trim()) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: VendorSelectionCriteriaFormErrors = {}

    // Check required fields - Part Group Name, Requirement, and Status are required
    if (!formData.partGroupName || formData.partGroupName.trim() === '') {
      newErrors.partGroupName = VALIDATION_MESSAGES.PART_GROUP_NAME
    }

    if (!formData.requirement || formData.requirement.trim() === '') {
      newErrors.requirement = VALIDATION_MESSAGES.REQUIREMENT
    }

    if (!formData.status || formData.status.trim() === '') {
      newErrors.status = VALIDATION_MESSAGES.STATUS
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === NUMBERMAP.ZERO
  }

  const storeOriginalIds = (data: any) => {
    data.vendorGroupId = formData.partGroupName
    data.criteriaId = formData.criteria
    data.requirementId = formData.requirement
    data.statusId = formData.status
  }

  // Generic utility function to convert ID to name/value
  const convertIdToName = (
    formFieldValue: string,
    dataArray: any[] | undefined,
    idField: string,
    nameField: string,
    targetData: any,
    targetField: string
  ) => {
    if (!formFieldValue || !dataArray) return

    const selectedItem = dataArray.find(
      item => item[idField]?.toString() === formFieldValue
    )
    if (selectedItem) {
      targetData[targetField] = selectedItem[nameField]
    }
  }

  const convertVendorGroupIdToName = (data: any) => {
    convertIdToName(
      formData.partGroupName,
      vendorGroupsData?.data,
      'ref_id',
      'group_name',
      data,
      'partGroupName'
    )
  }

  const convertCriteriaIdToName = (data: any) => {
    convertIdToName(
      formData.criteria,
      vendorGroupCriteriaData?.data,
      'ref_id',
      'criteria',
      data,
      'criteria'
    )
  }

  const convertRequirementIdToName = (data: any) => {
    convertIdToName(
      formData.requirement,
      requirementsData?.data,
      'ref_id',
      'requirement_type',
      data,
      'requirement'
    )
  }

  const convertStatusIdToName = (data: any) => {
    if (!formData.status || !statusData?.data) return

    const selectedStatus = statusData.data.find(
      (option: any) => option.status_id?.toString() === formData.status
    )
    if (selectedStatus) {
      data.status = selectedStatus.status_name ?? selectedStatus.name
    }
  }

  const convertIdsToNames = (data: any) => {
    convertVendorGroupIdToName(data)
    convertCriteriaIdToName(data)
    convertRequirementIdToName(data)
    convertStatusIdToName(data)
  }

  const showSuccessAlert = () => {
    showActionAlert('customAlert', {
      title: ALERT_MESSAGES.SUCCESS_TITLE,
      text: criteriaId ? ALERT_MESSAGES.SUCCESS_TEXT_UPDATED : ALERT_MESSAGES.SUCCESS_TEXT_CREATED,
      icon: 'success',
      cancelButton: false,
      confirmButton: true,
    })
  }

  const showErrorAlert = () => {
    showActionAlert('customAlert', {
      title: ALERT_MESSAGES.ERROR_TITLE,
      text: criteriaId ? ALERT_MESSAGES.ERROR_TEXT_UPDATE : ALERT_MESSAGES.ERROR_TEXT_CREATE,
      icon: 'error',
      cancelButton: false,
      confirmButton: true,
    })
  }

  const processAndSaveData = async () => {
    const processedFormData: any = { ...formData }
    
    storeOriginalIds(processedFormData)
    convertIdsToNames(processedFormData)
    
    await onSave(processedFormData)
    showSuccessAlert()
    onClose()
  }

  const handleSave = async () => {
    if (!validateForm()) return

    processAndSaveData().catch(() => showErrorAlert())
  }

  const modalTitle = criteriaId ? MODAL_TITLE.EDIT : MODAL_TITLE.CREATE

  return (
    <CommonModal
      open={open}
      onClose={onClose}
      title={modalTitle}
      onSave={handleSave}
      buttonRequired={true}
      modalMaxWidth="900px"
    >
        <Grid2 container spacing={NUMBERMAP.ONE} sx={popup_style}>
          {/* Part Group Name - Dropdown */}
          <Grid2 size={NUMBERMAP.TWELVE}>
            <InputField
              label={FORM_LABELS.PART_GROUP_NAME}
              placeholder={FORM_PLACEHOLDERS.PART_GROUP_NAME}
              isDropdown
              value={formData.partGroupName}
              onChange={(value: string) =>
                handleInputChange(FORM_FIELD_NAMES.PART_GROUP_NAME, value)
              }
              error={errors.partGroupName}
              options={vendorGroupsData?.data ?? []}
              customOption={true}
              keyField={DROPDOWN_FIELD_CONFIG.PART_GROUP_NAME.KEY_FIELD}
              valueField={DROPDOWN_FIELD_CONFIG.PART_GROUP_NAME.VALUE_FIELD}
              dataSourceName={DATA_SOURCE_NAME}
              dataFieldName={DROPDOWN_FIELD_CONFIG.PART_GROUP_NAME.DATA_FIELD_NAME}
              dataIsAutocomplete={formData.partGroupName}
            />
          </Grid2>

          {/* Criteria - Dropdown */}
          <Grid2 size={NUMBERMAP.TWELVE}>
            <InputField
              label={FORM_LABELS.CRITERIA}
              placeholder={FORM_PLACEHOLDERS.CRITERIA}
              isDropdown
              value={formData.criteria}
              onChange={(value: string) =>
                handleInputChange(FORM_FIELD_NAMES.CRITERIA, value)
              }
              error={errors.criteria}
              options={vendorGroupCriteriaData?.data ?? []}
              customOption={true}
              keyField={DROPDOWN_FIELD_CONFIG.CRITERIA.KEY_FIELD}
              valueField={DROPDOWN_FIELD_CONFIG.CRITERIA.VALUE_FIELD}
              dataSourceName={DATA_SOURCE_NAME}
              dataFieldName={DROPDOWN_FIELD_CONFIG.CRITERIA.DATA_FIELD_NAME}
              dataIsAutocomplete={formData.criteria}
            />
          </Grid2>

          {/* Requirement - Dropdown */}
          <Grid2 size={NUMBERMAP.TWELVE}>
            <InputField
              label={FORM_LABELS.REQUIREMENT}
              placeholder={FORM_PLACEHOLDERS.REQUIREMENT}
              isDropdown
              value={formData.requirement}
              onChange={(value: string) =>
                handleInputChange(FORM_FIELD_NAMES.REQUIREMENT, value)
              }
              error={errors.requirement}
              options={requirementsData?.data ?? []}
              keyField={DROPDOWN_FIELD_CONFIG.REQUIREMENT.KEY_FIELD}
              valueField={DROPDOWN_FIELD_CONFIG.REQUIREMENT.VALUE_FIELD}
              dataSourceName={DATA_SOURCE_NAME}
              dataFieldName={DROPDOWN_FIELD_CONFIG.REQUIREMENT.DATA_FIELD_NAME}
              dataIsAutocomplete={formData.requirement}
            />
          </Grid2>

          {/* Status - Dropdown (Required) */}
          <Grid2 size={NUMBERMAP.TWELVE}>
            <InputField
              label={FORM_LABELS.STATUS}
              placeholder={FORM_PLACEHOLDERS.STATUS}
              isDropdown
              value={formData.status}
              onChange={(value: string) =>
                handleInputChange(FORM_FIELD_NAMES.STATUS, value)
              }
              error={errors.status}
              options={statusData?.data ?? []}
              keyField={DROPDOWN_FIELD_CONFIG.STATUS.KEY_FIELD}
              valueField={DROPDOWN_FIELD_CONFIG.STATUS.VALUE_FIELD}
              dataSourceName={DATA_SOURCE_NAME}
              dataFieldName={DROPDOWN_FIELD_CONFIG.STATUS.DATA_FIELD_NAME}
              dataIsAutocomplete={formData.status}
            />
          </Grid2>
        </Grid2>
    </CommonModal>
  )
}

export default VendorSelectionCriteriaModal
