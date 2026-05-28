import React, { useState, useEffect } from 'react'
import { Grid2 } from '@mui/material'
import CommonModal from '@/components/ui/common-modal/CommonModal'
import InputField from '@/components/ui/input-field/InputField'
import { popup_style } from '@/styles/common'
import { NUMBERMAP, STATUS } from '@/constants/common'
import { useOrganizationStatus } from '@/hooks/useCommonDropdown'
import { useInspectionGroups, useCriteriaByGroupId } from '@/hooks/modules/production/useIncomingInspectionCriteria'
import { IncomingInspectionCriteriaModalProps } from '@/types/modules/production/incomingInceptionCriteria'
import { showActionAlert } from '@/components/ui'

/**
 * Classification : Confidential
 */
const DEFAULT_FORM_DATA = {
  inspectionGroupName: '',
  criteria: '',
  status: '',
}

const IncomingInspectionCriteriaModal: React.FC<IncomingInspectionCriteriaModalProps> = ({
  open,
  onClose,
  onSave,
  initialData,
  criteriaId,
  criteriaDetails = [],
}) => {
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const { data: statusData } = useOrganizationStatus()
  // Add hook to fetch inspection groups
  const { data: inspectionGroupsResp } = useInspectionGroups(1)
  // Determine selected group_id from inspectionGroupName (this stores group_id)
  const selectedGroupId = formData.inspectionGroupName ? Number(formData.inspectionGroupName) : undefined
  const { data: criteriaResp } = useCriteriaByGroupId(selectedGroupId, !!selectedGroupId)

  // Check if selected group already has criteria 
  const hasExistingCriteria = React.useMemo(() => {
    if (!criteriaDetails || criteriaDetails.length === NUMBERMAP.ZERO) {
      return false
    }

    if (criteriaDetails && Array.isArray(criteriaDetails)) {
      return criteriaDetails.some((criteria: any) => {
        // Check if this is the same criteria being edited
        if (criteriaId) {
          const mapperId = criteria.group_criteria_mapper_id ?? criteria.sub_group_id ?? criteria.id
          if (mapperId === criteriaId) return false
        }
        // Check if criteria belongs to the selected group
        const criteriaGroupId = criteria.vendorGroupId ?? criteria.group_id
        return String(criteriaGroupId) === String(formData.inspectionGroupName)
      })
    }
    
    return false
  }, [formData.inspectionGroupName, criteriaDetails, criteriaId, selectedGroupId])

  // If group has existing criteria, show only ADD CUSTOM (empty options)
  const filteredCriteriaOptions = React.useMemo(() => {
    if (!criteriaResp?.data) return []
    return hasExistingCriteria ? [] : criteriaResp.data
  }, [criteriaResp?.data, hasExistingCriteria])

  // Clear criteria if group changes
  useEffect(() => {
    if (!criteriaId) {
      setFormData((prev) => ({ ...prev, criteria: '' }))
    }
  }, [formData.inspectionGroupName, criteriaId])

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
      if (field === 'inspectionGroupName' && !criteriaId) {
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
    const newErrors: { [key: string]: string } = {}

    // Check required fields
    if (!formData.inspectionGroupName) {
      newErrors.inspectionGroupName = 'Inspection Group Name is required'
    }
    if (!formData.criteria || formData.criteria.trim() === '') {
      newErrors.criteria = 'Criteria is required'
    }
    if (!formData.status || formData.status.trim() === '') {
      newErrors.status = 'Status is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === NUMBERMAP.ZERO
  }

  const convertIncomingInspectionIdToName = (
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

  const convertIncomingInspectionGroupIdToName = (data: any) => {
    convertIncomingInspectionIdToName(
      formData.inspectionGroupName,
      inspectionGroupsResp?.data,
      'group_id',
      'group_value',
      data,
      'inspectionGroupLabel'
    )
  }

  const convertCriteriaIdToName = (data: any) => {
    convertIncomingInspectionIdToName(
      formData.criteria,
      criteriaResp?.data,
      'sub_group_id',
      'sub_group_value',
      data,
      'criteriaLabel'
    )
  }

  const convertStatusIdToName = (data: any) => {
    if (!formData.status || !statusData?.data) return

    const selectedStatus = statusData.data.find(
      (option: any) => option.status_id?.toString() === formData.status
    )
    if (selectedStatus) {
      data.status = selectedStatus.status_id
    }
  }

  const setCriteriaMapperId = () => {
    return criteriaId && initialData?.criteria_mapper_id != null 
    ? initialData.criteria_mapper_id 
    : ""
  }
  const getInspectionGroupLabel = (isCustomGroup: boolean,processedData: any) => {
    let inspectionGroupLabeldata = processedData.inspectionGroupLabel ?? '';
    if (!inspectionGroupLabeldata && formData.inspectionGroupName && Array.isArray(inspectionGroupsResp?.data) && !isCustomGroup) {
      const found = inspectionGroupsResp.data.find(
        (g: any) => String(g.group_id) === String(formData.inspectionGroupName)
      );
      if (found) inspectionGroupLabeldata = found.group_value ?? '';
    } else if (isCustomGroup && !inspectionGroupLabeldata) {
      // For custom groups, use the typed value as label
      inspectionGroupLabeldata = formData.inspectionGroupName ?? '';
    }
    return inspectionGroupLabeldata
  }
  const getCriteriaLabel = (isCustomCriteria: boolean,processedData: any) => {
    let criteriaLabeldata = processedData.criteriaLabel ?? '';
    if (!criteriaLabeldata && formData.criteria && Array.isArray(criteriaResp?.data) && !isCustomCriteria) {
      const found = criteriaResp.data.find(
        (c: any) => String(c.sub_group_id) === String(formData.criteria)
      );
      if (found) criteriaLabeldata = found.sub_group_value ?? '';
    } else if (isCustomCriteria && !criteriaLabeldata) {
      // For custom criteria, use the typed value as label
      criteriaLabeldata = formData.criteria ?? '';
    }
    return criteriaLabeldata
  }
  const processAndSaveData = async () => {
  const processedData = { ...formData }
    // Check if group is custom (not selected from dropdown) - check this FIRST before converting IDs
  const isCustomGroup = !formData.inspectionGroupName || !inspectionGroupsResp?.data?.some((g: any) => String(g.group_id) === String(formData.inspectionGroupName));
    // Check if criteria is custom (not selected from dropdown)
  const isCustomCriteria = !formData.criteria || !criteriaResp?.data?.some((c: any) => String(c.sub_group_id) === String(formData.criteria));
    // Convert IDs to names only if they exist in dropdowns
    convertIncomingInspectionGroupIdToName(processedData)
    convertCriteriaIdToName(processedData)
    convertStatusIdToName(processedData)
    // Set group_id only if it's NOT a custom group (i.e., selected from dropdown)
    processedData.group_id = (!isCustomGroup && formData.inspectionGroupName)?Number(formData.inspectionGroupName):null;
    // Set criteria_id only if it's NOT a custom criteria (i.e., selected from dropdown)
    processedData.criteria_id = (!isCustomCriteria && formData.criteria)?Number(formData.criteria):null;
    // Get criteria_mapper_id from initialData if editing, otherwise use empty string
    const criteriaMapperId = setCriteriaMapperId()
    // Find inspection group label
    let inspectionGroupLabel = getInspectionGroupLabel(isCustomGroup,processedData)
    // Find criteria label
    let criteriaLabel = getCriteriaLabel(isCustomCriteria,processedData)
    // Transform to nested structure similar to customer feedback criteria
    const nestedData = {
      ...processedData,
      group_id: processedData.group_id, // null for custom groups, number for system groups
      inspectionGroupLabel: inspectionGroupLabel,
      criteriaLabel: criteriaLabel,
      isCustomGroup,
      isCustomCriteria,
      criteria_mapper_id: criteriaMapperId,
      criteria_id: processedData.criteria_id, // null for custom criteria, number for system criteria
      status: processedData.status ?? NUMBERMAP.ONE,
    }
    onSave(nestedData)
    showActionAlert(STATUS.SUCCESS)
    onClose()
  }

  const handleSave = async () => {
    if (!validateForm()) return
    processAndSaveData();
  }

  const modalTitle = criteriaId
    ? 'Edit Incoming Inspection Criteria'
    : 'Add Incoming Inspection Criteria'

  return (
    <CommonModal
      open={open}
      onClose={onClose}
      title={modalTitle}
      onSave={handleSave}
      buttonRequired={true}
    >
      <Grid2 container spacing={NUMBERMAP.ONE} sx={popup_style}>
        <Grid2 size={NUMBERMAP.TWELVE}>
          <InputField
            label="Inspection Group Name*"
            placeholder="Select Inspection Group Name"
            isDropdown
            value={formData.inspectionGroupName}
            onChange={(value: string) => handleInputChange('inspectionGroupName', value)}
            error={errors.inspectionGroupName}
            options={inspectionGroupsResp?.data ?? []}
            keyField="group_id"
            valueField="group_value"
            customOption={true}
          />
        </Grid2>
        <Grid2 size={NUMBERMAP.TWELVE}>
          <InputField
            label="Criteria*"
            placeholder="Select Criteria"
            isDropdown
            value={formData.criteria}
            onChange={(value: string) => handleInputChange('criteria', value)}
            error={errors.criteria}
            options={filteredCriteriaOptions}
            keyField="sub_group_id"
            valueField="sub_group_value"
            customOption={true}
            // disabled={!selectedGroupId}
          />
        </Grid2>
        <Grid2 size={NUMBERMAP.TWELVE}>
          <InputField
            label="Status*"
            placeholder="Select Status"
            isDropdown
            value={formData.status}
            onChange={(value: string) => handleInputChange('status', value)}
            error={errors.status}
            options={statusData?.data ?? []}
            keyField="status_id"
            valueField="status_name"
          />
        </Grid2>
      </Grid2>
    </CommonModal>
  )
}

export default IncomingInspectionCriteriaModal




