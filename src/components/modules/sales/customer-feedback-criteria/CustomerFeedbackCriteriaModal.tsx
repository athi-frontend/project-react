'use client'
import React, { useState, useEffect, useMemo } from 'react'
import { Grid2 } from '@mui/material'
import {
  InputField,
  showActionAlert,
} from '@/components/ui'
import CommonModal from '@/components/ui/common-modal/CommonModal'
import { useGroups, useCriteria } from '@/hooks/modules/sales/useCustomerFeedbackCriteria'
import { useOrganizationStatus } from '@/hooks/useCommonDropdown'
import { NUMBERMAP, STATUS } from '@/constants/common'
import { popup_style } from '@/styles/common'
import { CUSTOMER_FEEDBACK_CRITERIA_CONSTANTS, CUSTOMER_FEEDBACK_CRITERIA_DEFAULT_FORM_DATA, CUSTOMER_FEEDBACK_CRITERIA_FIELD_KEYS, ALERT_MESSAGES } from '@/constants/modules/sales/customerFeedbackCriteria'

/**
 * Classification: Confidential
 */

interface CustomerFeedbackCriteriaModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: any;
  criteriaId?: number;
  criteriaDetails?: any[];
}

const DEFAULT_FORM_DATA = {
  group_name: '',
  criteria_name: '',
  status_id: '',
}

const CustomerFeedbackCriteriaModal: React.FC<CustomerFeedbackCriteriaModalProps> = ({
  open,
  onClose,
  onSave,
  initialData,
  criteriaId,
  criteriaDetails = [],
}) => {
  const [formData, setFormData] = useState(CUSTOMER_FEEDBACK_CRITERIA_DEFAULT_FORM_DATA)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  
  // When editing (criteriaId is present), include inactive items to pre-fetch names
  const includeInactive = !!criteriaId
  
  // Fetch groups from API
  const { data: groupsData } = useGroups(undefined, includeInactive)
  
  // Add custom group name to options for display when editing unsaved entries
  const enhancedGroupsData = useMemo(() => {
    const apiData = groupsData?.data ?? []
    const customName = initialData?.group_name
    if (!customName || !isNaN(Number(customName))) return apiData
    
    return [...apiData, {
      [CUSTOMER_FEEDBACK_CRITERIA_FIELD_KEYS.GROUP_ID]: customName,
      [CUSTOMER_FEEDBACK_CRITERIA_FIELD_KEYS.GROUP_NAME]: customName,
    }]
  }, [groupsData?.data, initialData?.group_name])
  
  // Get the selected group ID from form data
  // If group_name is a number (ID), use it; otherwise it's a custom name
  const selectedGroupId = formData.group_name && !isNaN(Number(formData.group_name)) 
    ? parseInt(formData.group_name) 
    : undefined
  
  // Fetch criteria from API (using selected group_id)
  const { data: criteriaData } = useCriteria(selectedGroupId ?? NUMBERMAP.ZERO, !!selectedGroupId, includeInactive)
  
  // Add custom criteria name to options for display when editing unsaved entries
  // Use local_criteria_name from criteriaDetails when available (handles locally updated names before save)
  const enhancedCriteriaData = useMemo(() => {
    const apiData = criteriaData?.data ?? []
    const criteriaIdFromInitial = initialData?.criteria_name // This is the criteria_id (e.g., "165")
    const localCriteriaName = initialData?.local_criteria_name // This is the actual name from criteriaDetails (e.g., "h8")
    
    // If we have a local_criteria_name, it means we're editing and should use the name from criteriaDetails
    // This handles the case where the criteria name was updated locally but not yet saved to the API
    if (localCriteriaName && criteriaIdFromInitial && !isNaN(Number(criteriaIdFromInitial))) {
      // Check if the API data has this criteria_id
      const existingInApi = apiData.find(
        (item: any) => item[CUSTOMER_FEEDBACK_CRITERIA_FIELD_KEYS.CRITERIA_ID]?.toString() === criteriaIdFromInitial
      )
      
      if (existingInApi) {
        // Replace the API entry with the local name
        return apiData.map((item: any) => {
          if (item[CUSTOMER_FEEDBACK_CRITERIA_FIELD_KEYS.CRITERIA_ID]?.toString() === criteriaIdFromInitial) {
            return {
              ...item,
              [CUSTOMER_FEEDBACK_CRITERIA_FIELD_KEYS.CRITERIA_NAME]: localCriteriaName,
            }
          }
          return item
        })
      } else {
        // Add the local criteria as a new option
        return [...apiData, {
          [CUSTOMER_FEEDBACK_CRITERIA_FIELD_KEYS.CRITERIA_ID]: criteriaIdFromInitial,
          [CUSTOMER_FEEDBACK_CRITERIA_FIELD_KEYS.CRITERIA_NAME]: localCriteriaName,
        }]
      }
    }
    
    const customName = initialData?.criteria_name
    if (!customName || !isNaN(Number(customName))) return apiData
    
    return [...apiData, {
      [CUSTOMER_FEEDBACK_CRITERIA_FIELD_KEYS.CRITERIA_ID]: customName,
      [CUSTOMER_FEEDBACK_CRITERIA_FIELD_KEYS.CRITERIA_NAME]: customName,
    }]
  }, [criteriaData?.data, initialData?.criteria_name, initialData?.local_criteria_name]) 


  // Fetch organization status from API
  const { data: statusData } = useOrganizationStatus()


  const hasExistingCriteria = React.useMemo(() => {

    if (criteriaId) return false
    
    if (!criteriaDetails || criteriaDetails.length === NUMBERMAP.ZERO) {
      return false
    }

    
    if (criteriaDetails && Array.isArray(criteriaDetails)) {
      return criteriaDetails.some((group) => {
        if (group.group_id?.toString() === formData.group_name?.toString()) {
          return group.criteria && group.criteria.length > NUMBERMAP.ZERO
        }
        return false
      })
    }
    
    return false
  }, [formData.group_name, criteriaDetails, criteriaId, selectedGroupId])

  // If group has existing criteria, show only ADD CUSTOM (empty options)

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
      
      // If group name changes and we're not editing, clear the criteria field
      if (field === CUSTOMER_FEEDBACK_CRITERIA_FIELD_KEYS.GROUP_NAME && !criteriaId) {
        newFormData.criteria_name = ''
      }
      
      return newFormData
    })

    // Clear error for the field if it has a value
    if (value?.trim()) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  // Helper: Find group for modal (following reference pattern)
  const findGroupForModal = (modalFormData: typeof formData, criteriaDetailsData: typeof criteriaDetails) => {
    const parentGroupId =
      modalFormData?.group_name && modalFormData.group_name.trim() !== ''
        ? modalFormData.group_name.trim()
        : ''
    if (parentGroupId !== '') {
      return criteriaDetailsData.find((g) => String(g.group_id) === String(parentGroupId))
    } else if (modalFormData.group_name && modalFormData.group_name.trim() !== '') {
      return criteriaDetailsData.find(
        (g) =>
          String(g.group_name).trim().toLowerCase() ===
          String(modalFormData.group_name).trim().toLowerCase()
      )
    }
    return undefined
  }

  // Helper: Get the actual criteria name from form data
  const getCriteriaNameFromFormData = (modalFormData: typeof formData): string => {
    const criteriaIdValue = modalFormData.criteria_name
    if (criteriaIdValue && enhancedCriteriaData && enhancedCriteriaData.length > NUMBERMAP.ZERO) {
      const selectedCriteria = enhancedCriteriaData.find(
        (item) => {
          const itemCriteriaId = item[CUSTOMER_FEEDBACK_CRITERIA_FIELD_KEYS.CRITERIA_ID]
          return itemCriteriaId?.toString() === criteriaIdValue.toString()
        }
      )
      if (selectedCriteria) {
        const criteriaName = (selectedCriteria)[CUSTOMER_FEEDBACK_CRITERIA_FIELD_KEYS.CRITERIA_NAME]
        return criteriaName ?? ''
      }
    }
    // If not found in dropdown, it's a custom criteria name (user typed it)
    return criteriaIdValue ?? ''
  }

  // Helper: Check for duplicate criteria in group (following reference pattern)
  const isDuplicateCriteriaInGroup = (
    group,
    editingCriteria: { criteriaId?: number; criteriaMapperId?: string | number | null } | null,
    modalFormData: typeof formData
  ) => {
    if (group && Array.isArray(group.criteria)) {
      const normalizedNewCriteria = getCriteriaNameFromFormData(modalFormData).trim().toLowerCase()
      if (!normalizedNewCriteria) return false

      return group.criteria.some((detail) => {
        if (detail.status_id === NUMBERMAP.TWO) return false
        const thisCriteriaValue = (detail.criteria_name ?? '').trim().toLowerCase()
        if (
          editingCriteria?.criteriaMapperId != null &&
          detail.criteria_mapper_id?.toString() === editingCriteria.criteriaMapperId.toString()
        ) {
          return false
        }
        return thisCriteriaValue === normalizedNewCriteria
      })
    }
    return false
  }

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {}

    // Check required fields
    if (!formData.group_name || formData.group_name.trim() === '') {
      newErrors.group_name = CUSTOMER_FEEDBACK_CRITERIA_CONSTANTS.GROUP_ERROR
    }
    if (!formData.criteria_name || formData.criteria_name.trim() === '') {
      newErrors.criteria_name = CUSTOMER_FEEDBACK_CRITERIA_CONSTANTS.CRITERIA_ERROR
    }
    if (!formData.status_id || formData.status_id.trim() === '') {
      newErrors.status_id = CUSTOMER_FEEDBACK_CRITERIA_CONSTANTS.STATUS_ERROR
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === NUMBERMAP.ZERO
  }

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

  const convertGroupIdToName = (data: any) => {
    convertIdToName(
      formData.group_name,
      enhancedGroupsData,
      CUSTOMER_FEEDBACK_CRITERIA_FIELD_KEYS.GROUP_ID,
      CUSTOMER_FEEDBACK_CRITERIA_FIELD_KEYS.GROUP_NAME,
      data,
      CUSTOMER_FEEDBACK_CRITERIA_FIELD_KEYS.GROUP_NAME
    )
  }

  const convertCriteriaIdToName = (data: any) => {
    convertIdToName(
      formData.criteria_name,
      enhancedCriteriaData,
      CUSTOMER_FEEDBACK_CRITERIA_FIELD_KEYS.CRITERIA_ID,
      CUSTOMER_FEEDBACK_CRITERIA_FIELD_KEYS.CRITERIA_NAME,
      data,
      CUSTOMER_FEEDBACK_CRITERIA_FIELD_KEYS.CRITERIA_NAME
    )
  }

  const convertStatusIdToName = (data: any) => {
    if (!formData.status_id || !statusData?.data) return

    const selectedStatus = statusData.data.find(
      (option: any) => option.status_id?.toString() === formData.status_id
    )
    if (selectedStatus) {
      data.status_id = selectedStatus.status_id
    }
  }

  const convertIdsToNames = (data: any) => {
    convertGroupIdToName(data)
    convertCriteriaIdToName(data)
    convertStatusIdToName(data)
  
    let groupIdValue = formData.group_name;
    data.group_id = groupIdValue ? Number(groupIdValue) : "";  
    let criteriaIdValue = formData.criteria_name;
    data.criteria_id = criteriaIdValue ? Number(criteriaIdValue) : "";
  }

  const processAndSaveData = async () => {
    const processedData = { ...formData }
    convertIdsToNames(processedData)
    
    // Get criteria_mapper_id from initialData if editing, otherwise use empty string
    // If criteria_mapper_id is a UUID (unsaved entry), set it to empty string for payload
    const rawMapperId = criteriaId && initialData?.criteria_mapper_id != null 
      ? initialData.criteria_mapper_id 
      : ""
    const criteriaMapperId = rawMapperId && typeof rawMapperId === 'string' && rawMapperId.startsWith('unsaved_')
      ? ""
      : rawMapperId
    
    // Transform to nested structure: { group_id, group_name, criteria: [...] }
    const nestedData = {
      group_id: processedData.group_id ?? "",
      group_name: processedData.group_name ?? '',
      criteria: [
        {
          criteria_mapper_id: criteriaMapperId,
          criteria_id: processedData.criteria_id ?? "",
          criteria_name: processedData.criteria_name,
          status_id: processedData.status_id ?? NUMBERMAP.ONE,
          display_order: null,
          is_system_defined: false,
        }
      ]
    }
    onSave(nestedData)
    showActionAlert(STATUS.SUCCESS)
    onClose()
  }

  const handleSave = async () => {
    if (!validateForm()) return

    // Check for duplicate criteria in the same group (following reference pattern)
    const group = findGroupForModal(formData, criteriaDetails)
    const editingCriteria = criteriaId && initialData?.criteria_mapper_id != null
      ? { criteriaId, criteriaMapperId: initialData.criteria_mapper_id }
      : null
    const isDuplicate = isDuplicateCriteriaInGroup(group, editingCriteria, formData)
    if (isDuplicate) {
      showActionAlert('customAlert', {
        title: ALERT_MESSAGES.DUPLICATE_CRITERIA_TITLE,
        text: ALERT_MESSAGES.DUPLICATE_CRITERIA_MESSAGE,
        icon: 'error',
        cancelButton: false,
        confirmButton: false,
      })
      setErrors((prev) => ({
        ...prev,
        criteria_name: ALERT_MESSAGES.DUPLICATE_CRITERIA_MESSAGE,
      }))
      return
    }
    // End duplicate check

    processAndSaveData()
  }

  const modalTitle = criteriaId
    ? CUSTOMER_FEEDBACK_CRITERIA_CONSTANTS.MODAL_TITLE_EDIT
    : CUSTOMER_FEEDBACK_CRITERIA_CONSTANTS.MODAL_TITLE_ADD

  return (
    <CommonModal
      open={open}
      onClose={onClose}
      title={modalTitle}
      onSave={handleSave}
      buttonRequired={true}
      modalMaxWidth={CUSTOMER_FEEDBACK_CRITERIA_CONSTANTS.MODAL_MAX_WIDTH}
    >
      <Grid2 container spacing={NUMBERMAP.ONE} sx={popup_style}>
        {/* Group Name - Dropdown */}
        <Grid2 size={NUMBERMAP.TWELVE}>
          <InputField
            label={CUSTOMER_FEEDBACK_CRITERIA_CONSTANTS.GROUP_LABEL}
            placeholder={CUSTOMER_FEEDBACK_CRITERIA_CONSTANTS.GROUP_PLACEHOLDER}
            isDropdown
            value={formData.group_name}
            onChange={(value: string) =>
              handleInputChange(CUSTOMER_FEEDBACK_CRITERIA_FIELD_KEYS.GROUP_NAME, value)
            }
            error={errors.group_name}
            options={enhancedGroupsData ?? []}
            keyField={CUSTOMER_FEEDBACK_CRITERIA_FIELD_KEYS.GROUP_ID}
            valueField={CUSTOMER_FEEDBACK_CRITERIA_FIELD_KEYS.GROUP_NAME}
            customOption={true}
            disabled={!!criteriaId || hasExistingCriteria}
          />
        </Grid2>

        {/* Criteria - Dropdown */}
        <Grid2 size={NUMBERMAP.TWELVE}>
          <InputField
            label={CUSTOMER_FEEDBACK_CRITERIA_CONSTANTS.CRITERIA_LABEL}
            placeholder={CUSTOMER_FEEDBACK_CRITERIA_CONSTANTS.CRITERIA_PLACEHOLDER}
            isDropdown
            value={formData.criteria_name}
            onChange={(value: string) =>
              handleInputChange(
                CUSTOMER_FEEDBACK_CRITERIA_FIELD_KEYS.CRITERIA_NAME,
                value
              )
            }
            error={errors.criteria_name}
            options={criteriaData?.data ?? []}
            keyField={CUSTOMER_FEEDBACK_CRITERIA_FIELD_KEYS.CRITERIA_ID}
            valueField={CUSTOMER_FEEDBACK_CRITERIA_FIELD_KEYS.CRITERIA_NAME}
            customOption={true}
          />
        </Grid2>

        {/* Status - Dropdown (Required) */}
        <Grid2 size={NUMBERMAP.TWELVE}>
          <InputField
            label={CUSTOMER_FEEDBACK_CRITERIA_CONSTANTS.STATUS_LABEL}
            placeholder={CUSTOMER_FEEDBACK_CRITERIA_CONSTANTS.STATUS_PLACEHOLDER}
            isDropdown
            value={formData.status_id}
            onChange={(value: string) =>
              handleInputChange(CUSTOMER_FEEDBACK_CRITERIA_FIELD_KEYS.STATUS_ID, value)
            }
            error={errors.status_id}
            options={statusData?.data ?? []}
            keyField={CUSTOMER_FEEDBACK_CRITERIA_FIELD_KEYS.STATUS_ID}
            valueField={CUSTOMER_FEEDBACK_CRITERIA_FIELD_KEYS.STATUS_NAME}
          />
        </Grid2>
      </Grid2>
    </CommonModal>
  )
}

export default CustomerFeedbackCriteriaModal
