﻿'use client'
import React, { useState, useEffect, useMemo } from 'react'
import { Grid2 } from '@mui/material'
import {
  InputField,
  InputFieldWithEdit,
  showActionAlert,
} from '@/components/ui'
import CommonModal from '@/components/ui/common-modal/CommonModal'
import {
  RE_EVALUATION_FORM_LABELS,
  FORM_PLACEHOLDERS,
  FORM_FIELD_NAMES,
  RE_EVALUATION_VALIDATION_MESSAGES,
  RE_EVALUATION_MODAL_TITLE,
  RE_EVALUATION_DATA_SOURCE_NAME,
  RE_EVALUATION_ALERT_MESSAGES,
  RE_EVALUATION_DROPDOWN_FIELD_CONFIG,
} from '@/constants/modules/vendor-management/vendorReEvaluationCriteria'
import {
  VendorReEvaluationCriteriaFormData,
  VendorReEvaluationCriteriaFormErrors,
  VendorReEvaluationCriteriaModalProps,
} from '@/types/modules/vendor-management/vendorReEvaluationCriteria'
import { useVendorReEvaluationGroups, useVendorReEvaluationGroupCriteria, useReEvaluationRequirements } from '@/hooks/modules/vendor-management/useVendorReEvaluationCriteria'
import { useOrganizationStatus } from '@/hooks/useCommonDropdown'
import { NUMBERMAP } from '@/constants/common'
import { popup_style } from '@/styles/common'
import { COMMON_CONSTANTS } from '@/lib/utils/common'

/**
 * Classification: Confidential
 */

const DEFAULT_FORM_DATA: VendorReEvaluationCriteriaFormData = {
  partGroupName: '',
  criteria: '',
  requirement: '',
  status: '',
}

const VendorReEvaluationCriteriaModal: React.FC<VendorReEvaluationCriteriaModalProps> = ({
  open,
  onClose,
  onSave,
  initialData,
  criteriaId,
  existingGroupNames = [],
  currentGroupName,
  existingCriteriaInGroup = [],
}) => {
  const [formData, setFormData] = useState<VendorReEvaluationCriteriaFormData>(DEFAULT_FORM_DATA)
  const [errors, setErrors] = useState<VendorReEvaluationCriteriaFormErrors>({})
  const [originalVendorGroupId, setOriginalVendorGroupId] = useState<string | null>(null)
  const [groupChangedViaDropdown, setGroupChangedViaDropdown] = useState(false)
  const [updatedGroupNames, setUpdatedGroupNames] = useState<Map<string, string>>(new Map())
  const [originalGroupNameBeforeEdit, setOriginalGroupNameBeforeEdit] = useState<{ groupId: string; originalName: string } | null>(null)
  
  // Fetch vendor groups from API
  const { data: vendorGroupsData } = useVendorReEvaluationGroups()
  
  // Resolve partGroupName value: if it's a custom name, find the matching group_id, otherwise use as-is
  const resolvedPartGroupName = useMemo(() => {
    if (!formData.partGroupName || !vendorGroupsData?.data) {
      return formData.partGroupName;
    }
    
    const partGroupKeyField = RE_EVALUATION_DROPDOWN_FIELD_CONFIG.PART_GROUP_NAME.KEY_FIELD;
    const partGroupValueField = RE_EVALUATION_DROPDOWN_FIELD_CONFIG.PART_GROUP_NAME.VALUE_FIELD;
    
    // Check if it's already a valid group_id
    const numericId = Number(formData.partGroupName);
    if (!isNaN(numericId) && vendorGroupsData.data.some(
      (group: any) => group[partGroupKeyField]?.toString() === numericId.toString()
    )) {
      return formData.partGroupName;
    }
    
    // Check if it matches a group_name (custom name)
    const matchedGroup = vendorGroupsData.data.find(
      (group: any) => group[partGroupValueField]?.toString() === formData.partGroupName.toString()
    );
    
    if (matchedGroup) {
      return matchedGroup[partGroupKeyField]?.toString() ?? formData.partGroupName;
    }
    
    // It's a truly custom/new group name, keep as-is
    return formData.partGroupName;
  }, [formData.partGroupName, vendorGroupsData]);
  
  // Find the actual group_id from vendorGroupsData for API calls
  // Use resolvedPartGroupName to get the numeric group_id if it exists
  const resolvedGroupId = useMemo(() => {
    if (!resolvedPartGroupName || !vendorGroupsData?.data) {
      return null;
    }
    
    // Check if resolvedPartGroupName is already a numeric ID
    const numericId = Number(resolvedPartGroupName);
    if (!isNaN(numericId) && vendorGroupsData.data.some(
      (group: any) => group.group_id?.toString() === numericId.toString()
    )) {
      return numericId;
    }
    
    return null;
  }, [resolvedPartGroupName, vendorGroupsData]);
  
  // Check if the selected group is an existing group (not a custom/new group)
  const isExistingGroup = useMemo(() => {
    return resolvedGroupId !== null;
  }, [resolvedGroupId]);
  
  // Build group_ids string for API call (only for existing groups)
  const groupIdsString = useMemo(() => {
    if (!resolvedGroupId) {
      return '';
    }
    return resolvedGroupId.toString();
  }, [resolvedGroupId]);
  
  // Fetch vendor group criteria from API (only for existing groups, not custom/new groups)
  const { data: vendorGroupCriteriaData } = useVendorReEvaluationGroupCriteria(groupIdsString)
  
  // Enhance part group name options to include custom value if it's not in the fetched options
  const enhancedPartGroupOptions = useMemo(() => {
    if (!vendorGroupsData?.data) {
      return [];
    }
    
    const options = [...(vendorGroupsData.data ?? [])];
    const partGroupKeyField = RE_EVALUATION_DROPDOWN_FIELD_CONFIG.PART_GROUP_NAME.KEY_FIELD;
    const partGroupValueField = RE_EVALUATION_DROPDOWN_FIELD_CONFIG.PART_GROUP_NAME.VALUE_FIELD;

    options.forEach((option: any) => {
      const groupId = option[partGroupKeyField]?.toString();
      if (groupId && updatedGroupNames.has(groupId)) {
        option[partGroupValueField] = updatedGroupNames.get(groupId);
      }
    });
    
    // If we have a partGroupName value that's not in the options (custom value), add it
    if (resolvedPartGroupName && resolvedPartGroupName.trim() !== '') {
      const valueExists = options.some(
        (option: any) => option[partGroupKeyField]?.toString() === resolvedPartGroupName.toString()
      );
      
      if (!valueExists) {
        const updatedName = updatedGroupNames.get(resolvedPartGroupName.toString());
        // Add the custom value to options so it can be displayed
        // For custom values, use the value itself as both key and value
        options.push({
          [partGroupKeyField]: resolvedPartGroupName,
          [partGroupValueField]: updatedName ?? resolvedPartGroupName,
        });
      }
    }
    
    return options;
  }, [vendorGroupsData, resolvedPartGroupName, updatedGroupNames]);
  // Enhance criteria options to include custom value if it's not in the fetched options
  const enhancedCriteriaOptions = useMemo(() => {
    const options = isExistingGroup && vendorGroupCriteriaData?.data 
      ? [...(vendorGroupCriteriaData.data ?? [])] 
      : [];
    
    // If we have a criteria value that's not in the options, add it
    // This handles both cases: when it's a custom group (no API data) or when the value is custom (not in API data)
    // Also handles edit mode where we have an ID but the options haven't loaded yet
    if (formData.criteria && formData.criteria.trim() !== '') {
      const criteriaKeyField = RE_EVALUATION_DROPDOWN_FIELD_CONFIG.CRITERIA.KEY_FIELD;
      const criteriaValueField = RE_EVALUATION_DROPDOWN_FIELD_CONFIG.CRITERIA.VALUE_FIELD;
      
      const valueExists = options.some(
        (option: any) => option[criteriaKeyField]?.toString() === formData.criteria.toString()
      );
      
      if (!valueExists) {
        // Check if the criteria value is a numeric ID (edit mode)
        // If so, we need to find the criteria name from initialData or use the ID as both key and value
        const isNumericId = !isNaN(Number(formData.criteria)) && formData.criteria.toString().trim() !== '';
        
        if (isNumericId) {
          // In edit mode: we have an ID but need to display the name
          // Check if initialData has the criteria name stored separately (criteriaName)
          // The InputField will match by keyField, so we use the ID as key and the name as value
          const initialDataAny = initialData
          const criteriaName = initialDataAny?.criteriaName ?? formData.criteria;
          options.push({
            [criteriaKeyField]: formData.criteria,
            [criteriaValueField]: criteriaName,
          });
        } else {
          // Custom value: use the value itself as both key and value
          options.push({
            [criteriaKeyField]: formData.criteria,
            [criteriaValueField]: formData.criteria,
          });
        }
      }
    }
    
    return options;
  }, [vendorGroupCriteriaData, formData.criteria, isExistingGroup, initialData]);
  
  // Fetch requirements from API
  const { data: requirementsData } = useReEvaluationRequirements()
  
  // Fetch organization status from API
  const { data: statusData } = useOrganizationStatus()

  // Initialize form data when modal opens or initialData changes
  useEffect(() => {
    if (open) {
      setFormData(initialData ? { ...DEFAULT_FORM_DATA, ...initialData } : DEFAULT_FORM_DATA)
      setErrors({})
      if (initialData?.partGroupName) {
        setOriginalVendorGroupId(initialData.partGroupName.toString())
      } else {
        setOriginalVendorGroupId(null)
      }
      setOriginalGroupNameBeforeEdit(null)
      setGroupChangedViaDropdown(false)
    }
  }, [open, initialData])

  useEffect(() => {
    if (!open && originalGroupNameBeforeEdit) {
      const { groupId, originalName } = originalGroupNameBeforeEdit
      setUpdatedGroupNames(prev => {
        const newMap = new Map(prev)
        newMap.set(groupId, originalName)
        return newMap
      })
      setOriginalGroupNameBeforeEdit(null)
    }
  }, [open, originalGroupNameBeforeEdit])
  const handleReEvaluationInputChange = (field: string, value: string) => {
    setFormData(prev => {
      const newFormData = { ...prev, [field]: value }
      
      if (field === FORM_FIELD_NAMES.PART_GROUP_NAME) {
        const previousGroupId = prev.partGroupName?.toString() ?? ''
        const newGroupId = value.toString()
        if (previousGroupId !== newGroupId) {
          setGroupChangedViaDropdown(true)
          setOriginalVendorGroupId(null)
        }
      }
      
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
  const getGroupNameFromValue = (value: string): string => {
    if (!value || value.trim() === '') return ''
    const isNumericId = !isNaN(Number(value)) && value.toString().trim() !== ''
    if (isNumericId && vendorGroupsData?.data) {
      const matchedGroup = vendorGroupsData.data.find(
        (group: any) => group.group_id?.toString() === value.toString()
      )
      if (matchedGroup) {
        const groupNameField = RE_EVALUATION_DROPDOWN_FIELD_CONFIG.PART_GROUP_NAME.VALUE_FIELD
        return matchedGroup[groupNameField] ?? value
      }
      if (updatedGroupNames.has(value.toString())) {
        return updatedGroupNames.get(value.toString()) ?? value
      }
    }
    return value
  }

  const isDuplicateGroupName = (groupNameOrId: string): boolean => {
    if (!groupNameOrId || groupNameOrId.trim() === '') return false
    
    const groupName = getGroupNameFromValue(groupNameOrId)
    const normalizedNewName = groupName.trim().toLowerCase()
    const currentGroupNameLower = currentGroupName?.trim().toLowerCase() ?? null

    // Check if the name already exists in the table (excluding current group if editing)
    const isDuplicateInTable = existingGroupNames.some((existingName) => {
      const existingNameLower = existingName.trim().toLowerCase()
      // Skip comparison if this is the current group being edited
      if (currentGroupNameLower && existingNameLower === currentGroupNameLower) {
        return false
      }
      return existingNameLower === normalizedNewName
    })

    if (isDuplicateInTable) {
      return true
    }

    // Check if it's a custom name (not a numeric ID from dropdown)
    const isNumericId = !isNaN(Number(groupNameOrId)) && groupNameOrId.toString().trim() !== ''
    
    // If it's a numeric ID (selected from dropdown), it's allowed (already handled above)
    // Only check dropdown options if it's a custom name
    if (!isNumericId) {
      const partGroupValueField = RE_EVALUATION_DROPDOWN_FIELD_CONFIG.PART_GROUP_NAME.VALUE_FIELD
      const apiNames = (vendorGroupsData?.data ?? [])
        .map((group: any) => {
          const groupId = group.group_id?.toString()
          // Use updated name if available, otherwise use original name from API
          if (groupId && updatedGroupNames.has(groupId)) {
            return updatedGroupNames.get(groupId)
          }
          return group[partGroupValueField]
        })
        .filter((name: any): name is string => !!name && name.toString().trim() !== '')

      // Check if the custom name matches any dropdown option
      const matchesDropdownOption = apiNames.some((name) => {
        const apiNameLower = name.trim().toLowerCase()
        // Skip comparison if this is the current group being edited
        if (currentGroupNameLower && apiNameLower === currentGroupNameLower) {
          return false
        }
        return apiNameLower === normalizedNewName
      })

      if (matchesDropdownOption) {
        return true
      }
    }

    return false
  }

  // Helper function to get criteria name from criteria value (ID or name)
  const getCriteriaNameFromValue = (criteriaValue: string): string => {
    if (!criteriaValue || criteriaValue.trim() === '') return ''
    
    // Check if it's a numeric ID
    const isNumericId = !isNaN(Number(criteriaValue)) && criteriaValue.toString().trim() !== ''
    
    if (isNumericId && vendorGroupCriteriaData?.data) {
      const criteriaKeyField = RE_EVALUATION_DROPDOWN_FIELD_CONFIG.CRITERIA.KEY_FIELD
      const criteriaValueField = RE_EVALUATION_DROPDOWN_FIELD_CONFIG.CRITERIA.VALUE_FIELD
      const matchedCriteria = vendorGroupCriteriaData.data.find(
        (criteria: any) => criteria[criteriaKeyField]?.toString() === criteriaValue.toString()
      )
      if (matchedCriteria) {
        return matchedCriteria[criteriaValueField] ?? criteriaValue
      }
    }
    
    // If it's a custom name or not found in API data, return as-is
    // Also check initialData for criteriaName (used in edit mode) - accessed via any to handle dynamic property
    const initialDataAny = initialData
    if (initialDataAny?.criteriaName) {
      return initialDataAny.criteriaName
    }
    
    return criteriaValue
  }

  const isDuplicateCriteria = (criteriaValue: string): boolean => {
    if (!criteriaValue || criteriaValue.trim() === '') return false
    
    // Get the criteria name for comparison
    const criteriaName = getCriteriaNameFromValue(criteriaValue)
    const normalizedCriteriaName = criteriaName.trim().toLowerCase()
    
    // Check if the criteria already exists in the group
    if (existingCriteriaInGroup.length > NUMBERMAP.ZERO) {
      const isDuplicate = existingCriteriaInGroup.some((existingCriteria) => {
        const existingCriteriaLower = existingCriteria.trim().toLowerCase()
        return existingCriteriaLower === normalizedCriteriaName
      })
      
      if (isDuplicate) {
        return true
      }
    }
    
    return false
  }

  const validateReEvaluationForm = (): boolean => {
    const newErrors: VendorReEvaluationCriteriaFormErrors = {}

    // Check required fields - Part Group Name, Requirement, and Status are required
    if (!formData.partGroupName || formData.partGroupName.trim() === '') {
      newErrors.partGroupName = RE_EVALUATION_VALIDATION_MESSAGES.PART_GROUP_NAME
    } else if (isDuplicateGroupName(formData.partGroupName)) {
      newErrors.partGroupName = RE_EVALUATION_VALIDATION_MESSAGES.GROUP_NAME_DUPLICATE
    }

    // Check for duplicate criteria in the same group (works for both create and edit modes)
    if (formData.criteria && formData.criteria.trim() !== '') {
      if (isDuplicateCriteria(formData.criteria)) {
        newErrors.criteria = RE_EVALUATION_VALIDATION_MESSAGES.CRITERIA_DUPLICATE
      }
    }

    if (!formData.requirement || formData.requirement.trim() === '') {
      newErrors.requirement = RE_EVALUATION_VALIDATION_MESSAGES.REQUIREMENT
    }

    if (!formData.status || formData.status.trim() === '') {
      newErrors.status = RE_EVALUATION_VALIDATION_MESSAGES.STATUS
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === NUMBERMAP.ZERO
  }

  const storeReEvaluationOriginalIds = (data: any) => {
    if (groupChangedViaDropdown) {
      data.vendorGroupId = formData.partGroupName
    } else {
      data.vendorGroupId = originalVendorGroupId ?? formData.partGroupName
    }
    data.criteriaId = formData.criteria
    data.requirementId = formData.requirement
    data.status = formData.status
  }

  // Generic utility function to convert ID to name/value
  const convertReEvaluationIdToName = (
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

  const convertReEvaluationVendorGroupIdToName = (data: any) => {
    const partGroupNameValue = formData.partGroupName
    if (!partGroupNameValue || partGroupNameValue.trim() === '') return

    const updatedName = updatedGroupNames.get(partGroupNameValue.toString())
    if (updatedName) {
      data.partGroupName = updatedName
      return
    }

    convertReEvaluationIdToName(
      formData.partGroupName,
      vendorGroupsData?.data,
      'group_id',
      'group_name',
      data,
      'partGroupName'
    )
  }

  const convertReEvaluationCriteriaIdToName = (data: any) => {
    convertReEvaluationIdToName(
      formData.criteria,
      vendorGroupCriteriaData?.data,
      'criteria_id',
      'criteria_name',
      data,
      'criteria'
    )
  }

  const convertReEvaluationRequirementIdToName = (data: any) => {
    convertReEvaluationIdToName(
      formData.requirement,
      requirementsData?.data,
      'ref_id',
      'requirement_type',
      data,
      'requirement'
    )
  }

  const convertReEvaluationIdsToNames = (data: any) => {
    convertReEvaluationVendorGroupIdToName(data)
    convertReEvaluationCriteriaIdToName(data)
    convertReEvaluationRequirementIdToName(data)
  }

  const showReEvaluationSuccessAlert = () => {
    showActionAlert(COMMON_CONSTANTS.SUCCESS_ALERT)
  }

  const showReEvaluationErrorAlert = () => {
    showActionAlert('customAlert', {
      title: RE_EVALUATION_ALERT_MESSAGES.ERROR_TITLE,
      text: criteriaId ? RE_EVALUATION_ALERT_MESSAGES.ERROR_TEXT_UPDATE : RE_EVALUATION_ALERT_MESSAGES.ERROR_TEXT_CREATE,
      icon: 'error',
      cancelButton: false,
      confirmButton: true,
    })
  }

  const processAndSaveReEvaluationData = async () => {

    const processedFormData: any = { ...formData }
    
    storeReEvaluationOriginalIds(processedFormData)
    convertReEvaluationIdsToNames(processedFormData)
    
    await onSave(processedFormData)
    showReEvaluationSuccessAlert()
    onClose()
  }

  const handleReEvaluationSave = async () => {
    if (!validateReEvaluationForm()) return

    processAndSaveReEvaluationData().catch(() => showReEvaluationErrorAlert())
  }

  const modalTitle = criteriaId ? RE_EVALUATION_MODAL_TITLE.EDIT : RE_EVALUATION_MODAL_TITLE.CREATE

  return (
    <CommonModal
      open={open}
      onClose={onClose}
      title={modalTitle}
      onSave={handleReEvaluationSave}
      buttonRequired={true}
      modalMaxWidth="900px"
    >
        <Grid2 container spacing={NUMBERMAP.ONE} sx={popup_style}>
          {/* Part Group Name - Dropdown with Edit */}
          <Grid2 size={NUMBERMAP.TWELVE}>
            <InputFieldWithEdit
              label={RE_EVALUATION_FORM_LABELS.PART_GROUP_NAME}
              placeholder={FORM_PLACEHOLDERS.PART_GROUP_NAME}
              isDropdown
              value={resolvedPartGroupName}
              onChange={(value: string) => {
                handleReEvaluationInputChange(FORM_FIELD_NAMES.PART_GROUP_NAME, value)
                if (value && value.trim() !== '') {
                  if (isDuplicateGroupName(value)) {
                    setErrors(prev => ({ ...prev, partGroupName: RE_EVALUATION_VALIDATION_MESSAGES.GROUP_NAME_DUPLICATE }))
                  } else {
                    setErrors(prev => ({ ...prev, partGroupName: '' }))
                  }
                } else if (errors.partGroupName) {
                  setErrors(prev => ({ ...prev, partGroupName: '' }))
                }
              }}
              error={errors.partGroupName}
              options={enhancedPartGroupOptions}
              keyFieldForEdit={RE_EVALUATION_DROPDOWN_FIELD_CONFIG.PART_GROUP_NAME.KEY_FIELD}
              valueFieldForEdit={RE_EVALUATION_DROPDOWN_FIELD_CONFIG.PART_GROUP_NAME.VALUE_FIELD}
              customOption={true}
              showEditIcon={!!criteriaId || (!!initialData?.partGroupName && !!resolvedPartGroupName)}
              onEditValidate={(newValue: string) => {
                const normalizedNewName = newValue.trim().toLowerCase()
                const currentGroupNameLower = formData.partGroupName?.trim().toLowerCase() ?? ''
                if (normalizedNewName !== currentGroupNameLower && isDuplicateGroupName(newValue)) {
                  return RE_EVALUATION_VALIDATION_MESSAGES.GROUP_NAME_DUPLICATE
                }
                return null
              }}
              onEditSave={(newValue: string) => {
                setErrors(prev => {
                  const { partGroupName, ...rest } = prev
                  return rest
                })

                const groupId = resolvedPartGroupName ?? formData.partGroupName
                if (groupId && !originalGroupNameBeforeEdit) {
                  const groupIdString = groupId.toString()
                  let originalName = formData.partGroupName
                  if (vendorGroupsData?.data) {
                    const partGroupKeyField = RE_EVALUATION_DROPDOWN_FIELD_CONFIG.PART_GROUP_NAME.KEY_FIELD
                    const partGroupValueField = RE_EVALUATION_DROPDOWN_FIELD_CONFIG.PART_GROUP_NAME.VALUE_FIELD
                    const matchedGroup = vendorGroupsData.data.find(
                      (group: any) => group[partGroupKeyField]?.toString() === groupIdString
                    )
                    if (matchedGroup) {
                      originalName = matchedGroup[partGroupValueField] ?? originalName
                    } else if (updatedGroupNames.has(groupIdString)) {
                      originalName = updatedGroupNames.get(groupIdString) ?? originalName
                    }
                  }
                  setOriginalGroupNameBeforeEdit({
                    groupId: groupIdString,
                    originalName: originalName.toString(),
                  })
                }

                if (groupId) {
                  const groupIdString = groupId.toString()
                  setUpdatedGroupNames(prev => {
                    const newMap = new Map(prev)
                    newMap.set(groupIdString, newValue.trim())
                    return newMap
                  })
                }
              }}
              editModalTitle="Edit Group Name"
              editPlaceholder="Enter new group name"
            />
          </Grid2>
          {/* Criteria - Dropdown */}
          <Grid2 size={NUMBERMAP.TWELVE}>
            <InputField
              label={RE_EVALUATION_FORM_LABELS.CRITERIA}
              placeholder={FORM_PLACEHOLDERS.CRITERIA}
              isDropdown
              value={formData.criteria}
              onChange={(value: string) => {
                handleReEvaluationInputChange(FORM_FIELD_NAMES.CRITERIA, value)
                if (value && value.trim() !== '') {
                  if (isDuplicateCriteria(value)) {
                    setErrors(prev => ({ ...prev, criteria: RE_EVALUATION_VALIDATION_MESSAGES.CRITERIA_DUPLICATE }))
                  } else {
                    setErrors(prev => ({ ...prev, criteria: '' }))
                  }
                } else if (errors.criteria) {
                  setErrors(prev => ({ ...prev, criteria: '' }))
                }
              }}
              error={errors.criteria}
              options={enhancedCriteriaOptions}
              keyField={RE_EVALUATION_DROPDOWN_FIELD_CONFIG.CRITERIA.KEY_FIELD}
              valueField={RE_EVALUATION_DROPDOWN_FIELD_CONFIG.CRITERIA.VALUE_FIELD}
              dataSourceName={RE_EVALUATION_DATA_SOURCE_NAME}
              dataFieldName={RE_EVALUATION_DROPDOWN_FIELD_CONFIG.CRITERIA.DATA_FIELD_NAME}
              dataIsAutocomplete={formData.criteria}
              customOption={true}
            />
          </Grid2>

          {/* Requirement - Dropdown */}
          <Grid2 size={NUMBERMAP.TWELVE}>
            <InputField
              label={RE_EVALUATION_FORM_LABELS.REQUIREMENT}
              placeholder={FORM_PLACEHOLDERS.REQUIREMENT}
              isDropdown
              value={formData.requirement}
              onChange={(value: string) =>
                handleReEvaluationInputChange(FORM_FIELD_NAMES.REQUIREMENT, value)
              }
              error={errors.requirement}
              options={requirementsData?.data ?? []}
              keyField={RE_EVALUATION_DROPDOWN_FIELD_CONFIG.REQUIREMENT.KEY_FIELD}
              valueField={RE_EVALUATION_DROPDOWN_FIELD_CONFIG.REQUIREMENT.VALUE_FIELD}
              dataSourceName={RE_EVALUATION_DATA_SOURCE_NAME}
              dataFieldName={RE_EVALUATION_DROPDOWN_FIELD_CONFIG.REQUIREMENT.DATA_FIELD_NAME}
              dataIsAutocomplete={formData.requirement}
            />
          </Grid2>

          {/* Status - Dropdown (Required) */}
          <Grid2 size={NUMBERMAP.TWELVE}>
            <InputField
              label={RE_EVALUATION_FORM_LABELS.STATUS}
              placeholder={FORM_PLACEHOLDERS.STATUS}
              isDropdown
              value={formData.status}
              onChange={(value: string) =>
                handleReEvaluationInputChange(FORM_FIELD_NAMES.STATUS, value)
              }
              error={errors.status}
              options={statusData?.data ?? []}
              keyField={RE_EVALUATION_DROPDOWN_FIELD_CONFIG.STATUS.KEY_FIELD}
              valueField={RE_EVALUATION_DROPDOWN_FIELD_CONFIG.STATUS.VALUE_FIELD}
              dataSourceName={RE_EVALUATION_DATA_SOURCE_NAME}
              dataFieldName={RE_EVALUATION_DROPDOWN_FIELD_CONFIG.STATUS.DATA_FIELD_NAME}
              dataIsAutocomplete={formData.status}
            />
          </Grid2>
        </Grid2>
    </CommonModal>
  )
}

export default VendorReEvaluationCriteriaModal