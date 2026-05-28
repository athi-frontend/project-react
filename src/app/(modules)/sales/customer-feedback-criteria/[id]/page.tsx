'use client'
import React, { useState, useEffect, useRef } from 'react'
import { Grid2 } from '@mui/material'
import { useParams, useRouter } from 'next/navigation'
import {
  InputField,
  ButtonGroup,
  showActionAlert,
  Label,
  ActionButton,
} from '@/components/ui'
import { useDraftSave } from '@/hooks/common/useDraftSave'
import {
  FormContainer,
  FormContent,
  FormWrapper,
} from '@/styles/modules/user/userOnboard'
import { NUMBERMAP, STATUS } from '@/constants/common'
import {
  FORM_CONSTANTS,
  PAGE_CONSTANTS,
  TABLE_COLUMNS,
  CUSTOMER_FEEDBACK_CRITERIA_CONSTANTS,
  DEFAULT_FORM_DATA,
  CUSTOMER_FEEDBACK_CRITERIA_TABLE_TRANSFORM_CONFIG,
  CUSTOMER_FEEDBACK_CRITERIA_FIELD_KEYS,
  STATUS_DROPDOWN_CONFIG,
} from '@/constants/modules/sales/customerFeedbackCriteria'
import { CriteriaDetail, FormData } from '@/types/modules/sales/customerFeedbackCriteria'
import {
  useGetProductGroup,
  useGetProductCategory,
  useGetProductType,
  useGetProductSubType,
} from '@/hooks/modules/dnd/useProject'
import {
  useCustomerFeedbackCriteriaById,
  useGetProductAll,
  useUpsertCustomerFeedbackCriteria,
  useSystemDefined,
} from '@/hooks/modules/sales/useCustomerFeedbackCriteria'
import { useOrganizationStatus } from '@/hooks/useCommonDropdown'
import {
  GridColDef,
  GridRenderCellParams,
} from '@mui/x-data-grid'
import {
  EmptyTableCell,
  SnoTableCell,
  CriteriaTableCell,
  GridContainerWithMargin,
} from '@/styles/modules/vendor-management/vendorSelectionCriteria'
import StatusTypography from '@/components/ui/status/ToggleStatus'
import CustomerFeedbackCriteriaModal from '@/components/modules/sales/customer-feedback-criteria/CustomerFeedbackCriteriaModal'
import VendorSelectionCriteriaCommonTable from '@/components/modules/vendor-management/vendor-selection-criteria/VendorSelectionCriteriaCommonTable'
import { VendorCriteria } from '@/components/modules/vendor-management/vendor-selection-criteria/types'

/**
 * Classification : Confidential
 **/

const CustomerFeedbackCriteriaForm: React.FC = () => {
  const isDraftRestored = useRef(false);

  // These must be defined once and used in draft setup and the rest of the component
  const router = useRouter();
  const params = useParams();
  const paramId = params.id;
  const isAddMode = paramId === FORM_CONSTANTS.CREATE_MODE;
  const [formData, setFormData] = useState<FormData>(DEFAULT_FORM_DATA)
  const criteriaIdForDraft = isAddMode ? null : formData.customer_feedback_criteria_id;
  const {
    draftSave,
    clearDraftSave,
    draftData,
    fetchDraft,
    checkUnsavedDraftBeforeLeave
  } = useDraftSave({
    context_type: 'customer_feedback_criteria',
    context_instance_id: criteriaIdForDraft,
    enableFetch: false,
  });
  const formRef = useRef<HTMLElement | null>(null)

  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [criteriaDetails, setCriteriaDetails] = useState<CriteriaDetail[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCriteria, setEditingCriteria] = useState<VendorCriteria | null>(null)

  // Restore draft if available
  useEffect(() => {
    if(isAddMode) {
      fetchDraft();
    }
  }, [criteriaIdForDraft]);

  useEffect(() => {
    if (draftData?.data && !isDraftRestored.current) {
      if (draftData.data.formData) setFormData(draftData.data.formData);
      if (draftData.data.criteriaDetails) setCriteriaDetails(draftData.data.criteriaDetails);
    }
  }, [draftData]);

  // Draft save on-demand like modal
  const handleDraftSave = (nextFormData: FormData = formData, nextCriteriaDetails: CriteriaDetail[] = criteriaDetails) => {
    draftSave({
      form_type: 'customer_feedback_criteria',
      form_data: {
        formData: nextFormData,
        criteriaDetails: nextCriteriaDetails
      },
      upload_documents: {},
      timestamp: new Date().toISOString(),
    });
  };

  const { data: productGroupsData } = useGetProductGroup()
  const { data: productCategoriesData } = useGetProductCategory()
  const { data: productTypesData } = useGetProductType()
  const { data: productSubTypesData } = useGetProductSubType(
    formData.productType ? [Number(formData.productType)] : [],
  )
  const { data: productAllData } = useGetProductAll(
    !!formData.productType,
    formData.productSubtype ? Number(formData.productSubtype) : undefined,
    formData.productType ? Number(formData.productType) : undefined
  )
  const { data: statusData } = useOrganizationStatus()
  const { data: customerFeedbackCriteriaData } = useCustomerFeedbackCriteriaById(
    Number(paramId ?? NUMBERMAP.ZERO),
    !isAddMode,
  )
  const editModeApiData = Array.isArray(customerFeedbackCriteriaData?.data)
        ? customerFeedbackCriteriaData?.data?.[NUMBERMAP.ZERO]
        : customerFeedbackCriteriaData?.data
  // Fetch criteria by product_id when in add mode and product is selected
  const productIdForFetch = isAddMode && formData.productName ? Number(formData.productName) : NUMBERMAP.ZERO

  const { data: existingCriteriaByProductId } = useCustomerFeedbackCriteriaById(
    productIdForFetch,
    isAddMode && !!formData.productName,
  )

  const { data: systemDefinedData } = useSystemDefined(isAddMode && !!formData.productName)

  const upsertMutation = useUpsertCustomerFeedbackCriteria()

  useEffect(() => {
    if (!isAddMode && editModeApiData) {
      const apiData = editModeApiData
      const formDataFromAPI: FormData = {
        ...apiData,
        productGroup: apiData.product_group_id?.toString() ?? apiData.formData.productGroup ?? '',
        productCategory: apiData.product_category_id?.toString() ?? apiData.formData.productCategory ?? '',
        productType: apiData.product_type_id?.toString() ?? apiData.formData.productType ?? '',
        productSubtype: apiData.product_sub_type_id?.toString() ?? apiData.formData.productSubtype ?? '',
        productName: apiData.product_id?.toString() ?? apiData.formData.productName ?? '',
        status: apiData.status_id?.toString() ?? apiData.formData.status ?? '',
      }
      setFormData(formDataFromAPI)
    }
  }, [isAddMode, editModeApiData])

  useEffect(() => {
    if (!isAddMode && editModeApiData) {
      const apiCriteria = editModeApiData?.criteria_details ?? editModeApiData?.criteriaDetails
      setCriteriaDetails(apiCriteria ?? [])
    }
  }, [isAddMode, editModeApiData])

  useEffect(() => {
    if (isAddMode) {
      // First, check if criteria exists for the selected product
      if (existingCriteriaByProductId?.data?.[NUMBERMAP.ZERO]) {
        const apiCriteria = existingCriteriaByProductId.data[NUMBERMAP.ZERO]?.criteria_details
        if (apiCriteria && apiCriteria.length > NUMBERMAP.ZERO) {
          setCriteriaDetails(apiCriteria)
          return
        }
      }
      // If no existing criteria, use system-defined defaults
      if (systemDefinedData?.data?.[NUMBERMAP.ZERO]) {
        const criteriaDetailsData =
          systemDefinedData.data?.[NUMBERMAP.ZERO]?.criteria_details
        if (criteriaDetailsData && criteriaDetailsData.length > NUMBERMAP.ZERO) {
          setCriteriaDetails(criteriaDetailsData)
        }
      }
    }
  }, [isAddMode, existingCriteriaByProductId, systemDefinedData])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value }
      if (field === FORM_CONSTANTS.FIELD_NAMES.PRODUCT_TYPE) {
        newData.productSubtype = ''
        newData.productName = ''
      }
      if (field === FORM_CONSTANTS.FIELD_NAMES.PRODUCT_SUBTYPE) {
        newData.productName = ''
      }
      // Reset criteria details when product changes in add mode
      if (isAddMode && field === FORM_CONSTANTS.FIELD_NAMES.PRODUCT_NAME) {
        setCriteriaDetails([])
      }
      // Call draft save on new form state
      // handleDraftSave(newData, field === FORM_CONSTANTS.FIELD_NAMES.PRODUCT_NAME && isAddMode ? [] : criteriaDetails);
      handleDraftSave(newData, criteriaDetails);
      return newData
    })

    if (value?.trim()) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {}
    const requiredFields: (keyof FormData)[] = [
      FORM_CONSTANTS.FIELD_NAMES.PRODUCT_GROUP,
      FORM_CONSTANTS.FIELD_NAMES.PRODUCT_CATEGORY,
      FORM_CONSTANTS.FIELD_NAMES.PRODUCT_TYPE,
      FORM_CONSTANTS.FIELD_NAMES.PRODUCT_SUBTYPE,
      FORM_CONSTANTS.FIELD_NAMES.PRODUCT_NAME,
      FORM_CONSTANTS.FIELD_NAMES.STATUS,
    ]

    for (const field of requiredFields) {
      const value = formData[field]
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        newErrors[field] = FORM_CONSTANTS.ERROR_MESSAGES.REQUIRED(field)
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === NUMBERMAP.ZERO
  }

  const resetFormState = () => {
    setFormData(DEFAULT_FORM_DATA)
    setErrors({})
    setCriteriaDetails([])
  }

  // Helper function to process criteria mapper ID (handle unsaved entries)
  const processCriteriaMapperId = (mapperId): string | null => {
    if (mapperId == null || mapperId === '') {
      return null
    }
    if (typeof mapperId === 'string' && mapperId.startsWith('unsaved_')) {
      return null
    }
    return mapperId
  }

  // Helper function to calculate display order
  const calculateDisplayOrder = (groupIndex: number, criteriaIndex: number): number => {
    let flatIndex = NUMBERMAP.ONE
    for (let i = NUMBERMAP.ONE; i < groupIndex; i++) {
      flatIndex += criteriaDetails[i].criteria.length
    }
    return flatIndex + criteriaIndex
  }

  // Helper function to get valid group_id value or null
  const getGroupId = (group_id): number | null => {
    if (group_id == null || group_id === NUMBERMAP.ZERO) {
      return null
    }
    const idValue = Number(group_id)
    if (isNaN(idValue) || idValue === NUMBERMAP.ZERO) {
      return null
    }
    return idValue
  }

  // Helper function to get valid criteria_id value or null
  const getCriteriaId = (criteria_id): number | null => {
    if (criteria_id == null || criteria_id === NUMBERMAP.ZERO) {
      return null
    }
    const idValue = Number(criteria_id)
    if (isNaN(idValue) || idValue === NUMBERMAP.ZERO) {
      return null
    }
    return idValue
  }

  const handleSave = () => {
    if (!validateForm()) {
      return
    }
    const productId = Number(formData.productName)

    // Transform criteria_details to the required payload format (flat array with all required fields)
    const transformedCriteriaDetails = criteriaDetails.flatMap((group, groupIndex) => {
      return group.criteria.map((criteria, criteriaIndex) => {
        const groupId = getGroupId(group.group_id)
        const criteriaId = getCriteriaId(criteria.criteria_id)
        
        const hasGroupId = groupId !== null
        const hasCriteriaId = criteriaId !== null
        const criteriaMapperId = processCriteriaMapperId(criteria.criteria_mapper_id)
        const displayOrder = calculateDisplayOrder(groupIndex, criteriaIndex)
        
        return {
          criteria_mapper_id: criteriaMapperId,
          group_id: groupId,
          criteria_id: criteriaId,
          is_new_group: !hasGroupId ? CUSTOMER_FEEDBACK_CRITERIA_FIELD_KEYS.TRUE : CUSTOMER_FEEDBACK_CRITERIA_FIELD_KEYS.FALSE,
          group_name: group.group_name ?? '',
          is_new_criteria: !hasCriteriaId ? CUSTOMER_FEEDBACK_CRITERIA_FIELD_KEYS.TRUE : CUSTOMER_FEEDBACK_CRITERIA_FIELD_KEYS.FALSE,
          criteria_name: criteria.criteria_name ?? '',
          status_id: criteria.status_id ?? NUMBERMAP.ONE,
          display_order: displayOrder,
        }
      })
    })

    const payload = {
      product_id: productId,
      status_id: Number(formData.status),
      criteria_details: transformedCriteriaDetails,
    }

    upsertMutation.mutate(payload, {
      onSuccess: () => {
        clearDraftSave();
        resetFormState()
        showActionAlert(STATUS.SUCCESS)
        router.push(CUSTOMER_FEEDBACK_CRITERIA_CONSTANTS.PATH_NAME)
      },
      onError: () => showActionAlert(STATUS.FAILED),
    });
  };

  const handleCancel = async () => {
    await checkUnsavedDraftBeforeLeave();
    router.push(CUSTOMER_FEEDBACK_CRITERIA_CONSTANTS.PATH_NAME)
  }

  // Transform flat array from onCriteriaReorder to nested criteria_details structure
  const transformFlatToNested = (flatArray: VendorCriteria[]): CriteriaDetail[] => {
    const groupsMap = new Map<number, CriteriaDetail>()
    const groupNameToIdMap = buildGroupNameToIdMap()

    const handleParentItem = (item: VendorCriteria) => {
      const groupName = item.criteria ?? item.category ?? ''
      const originalGroupId = groupNameToIdMap.get(groupName) ?? (item.group ?? NUMBERMAP.ZERO)
      const groupDisplayOrder = item.group ?? NUMBERMAP.ZERO

      if (!groupsMap.has(groupDisplayOrder)) {
        groupsMap.set(groupDisplayOrder, {
          group_id: originalGroupId,
          group_name: groupName,
          criteria: [],
          group_display_order: groupDisplayOrder,
        })
      }
    }

    const getOrCreateGroup = (
      groupDisplayOrder: number,
      groupName: string,
      originalGroupId: number
    ): CriteriaDetail => {
      let group = groupsMap.get(groupDisplayOrder)
      if (!group) {
        group = {
          group_id: originalGroupId,
          group_name: groupName,
          criteria: [],
          group_display_order: groupDisplayOrder,
        }
        groupsMap.set(groupDisplayOrder, group)
      }
      return group
    }

    const createCriteriaItem = (item: VendorCriteria) => {
      const statusValue = item.status ?? (item.statusId ? Number(item.statusId) : NUMBERMAP.ONE)
      const mapperId = item.group_criteria_mapper_id ?? item.sub_group_id ?? ""
      const criteriaDisplayOrder = item.order ?? item.display_order ?? NUMBERMAP.ZERO

      return {
        criteria_mapper_id: mapperId,
        criteria_id: item.criteria_id,
        criteria_name: item.criteria ?? '',
        status_id: statusValue,
        display_order: criteriaDisplayOrder,
        is_system_defined: (item as any).is_system_defined ?? false,
      }
    }

    const handleChildItem = (item: VendorCriteria) => {
      const groupDisplayOrder = item.group ?? NUMBERMAP.ZERO
      const groupName = item.category ?? ''
      const originalGroupId = groupNameToIdMap.get(groupName) ?? groupDisplayOrder
      const group = getOrCreateGroup(groupDisplayOrder, groupName, originalGroupId)
      group.criteria.push(createCriteriaItem(item))
    }

    for (const item of flatArray) {
      if (item.isParent) {
        handleParentItem(item)
      } else {
        handleChildItem(item)
      }
    }

    sortGroupsAndCriteria(groupsMap)
    return getSortedGroupsArray(groupsMap)
  }

  const buildGroupNameToIdMap = (): Map<string, number> => {
    const map = new Map<string, number>()
    for (const group of criteriaDetails) {
      if (group.group_name) {
        map.set(group.group_name, group.group_id ?? NUMBERMAP.ZERO)
      }
    }
    return map
  }

  const sortGroupsAndCriteria = (groupsMap: Map<number, CriteriaDetail>) => {
    for (const group of groupsMap.values()) {
      group.criteria.sort((a, b) => {
        const orderA = a.display_order ?? NUMBERMAP.ZERO
        const orderB = b.display_order ?? NUMBERMAP.ZERO
        return orderA - orderB
      })
    }
  }

  const getSortedGroupsArray = (groupsMap: Map<number, CriteriaDetail>): CriteriaDetail[] => {
    return Array.from(groupsMap.values()).sort((a, b) => {
      const orderA = a.group_display_order ?? NUMBERMAP.ZERO
      const orderB = b.group_display_order ?? NUMBERMAP.ZERO
      return orderA - orderB
    })
  }

  // Handler for criteria reorder
  const handleCriteriaReorder = (updatedCriteria: VendorCriteria[]) => {
    const nestedStructure = transformFlatToNested(updatedCriteria)
    setCriteriaDetails(nestedStructure)
    handleDraftSave(formData, nestedStructure)
  }

  // Handler for add criteria
  const handleAddCriteria = () => {
    setEditingCriteria(null)
    setIsModalOpen(true)
  }

  // Handler for edit criteria
  const handleEditCriteria = (criteria: VendorCriteria) => {
    setEditingCriteria(criteria)
    setIsModalOpen(true)
  }

  // Handler for modal close
  const handleModalClose = () => {
    setIsModalOpen(false)
    setEditingCriteria(null)
  }

  // Helper function to find criteria index by mapper ID
  const findCriteriaIndexByMapperId = (criteriaList, mapperId): number => {
    return criteriaList.findIndex(
      (c) => c.criteria_mapper_id === mapperId || c.criteria_mapper_id?.toString() === mapperId?.toString()
    )
  }

  // Helper function to preserve group ID if it exists
  const preserveGroupId = (updatedCriteriaDetails: CriteriaDetail[], groupIndex: number) => {
    const existingGroup = updatedCriteriaDetails[groupIndex]
    if (existingGroup.group_id) {
      updatedCriteriaDetails[groupIndex].group_id = existingGroup.group_id
    }
  }

  // Helper function to calculate max display order
  const calculateMaxDisplayOrder = (criteriaList): number => {
    if (criteriaList.length > NUMBERMAP.ZERO) {
      return Math.max(...criteriaList.map(c => c.display_order ?? NUMBERMAP.ZERO))
    }
    return NUMBERMAP.ZERO
  }

  // Helper function to handle edit mode
  const handleEditMode = (
    updatedCriteriaDetails: CriteriaDetail[],
    newCriteriaItem,
    editingCriteria: VendorCriteria
  ): void => {
    const groupName = editingCriteria.category ?? ''
    const groupIndex = updatedCriteriaDetails.findIndex(g => g.group_name === groupName)
    
    if (groupIndex === NUMBERMAP.NEGATIVE_ONE) {
      return
    }

    const mapperId = editingCriteria.group_criteria_mapper_id ?? editingCriteria.sub_group_id
    const criteriaIndex = findCriteriaIndexByMapperId(
      updatedCriteriaDetails[groupIndex].criteria,
      mapperId
    )
    
    if (criteriaIndex === NUMBERMAP.NEGATIVE_ONE) {
      return
    }

    const existingCriteria = updatedCriteriaDetails[groupIndex].criteria[criteriaIndex]
    const updatedCriteriaItem = {
      ...newCriteriaItem,
      criteria_mapper_id: existingCriteria.criteria_mapper_id ?? newCriteriaItem.criteria_mapper_id,
      criteria_id: existingCriteria.criteria_id ?? newCriteriaItem.criteria_id,
    }
    
    // Create new array references to ensure React detects the change
    updatedCriteriaDetails[groupIndex] = {
      ...updatedCriteriaDetails[groupIndex],
      criteria: [
        ...updatedCriteriaDetails[groupIndex].criteria.slice(NUMBERMAP.ZERO, criteriaIndex),
        updatedCriteriaItem,
        ...updatedCriteriaDetails[groupIndex].criteria.slice(criteriaIndex + NUMBERMAP.ONE)
      ]
    }
    preserveGroupId(updatedCriteriaDetails, groupIndex)
  }

  // Helper function to handle create mode - add to existing group
  const addCriteriaToExistingGroup = (
    updatedCriteriaDetails: CriteriaDetail[],
    existingGroupIndex: number,
    newCriteriaItem,
    unsavedUuid: string
  ): void => {
    const existingGroup = updatedCriteriaDetails[existingGroupIndex]
    const maxDisplayOrder = calculateMaxDisplayOrder(existingGroup.criteria)
    const newCriteria = {
      ...newCriteriaItem,
      criteria_mapper_id: unsavedUuid,
      display_order: maxDisplayOrder + NUMBERMAP.ONE,
    }
    existingGroup.criteria.push(newCriteria)
    preserveGroupId(updatedCriteriaDetails, existingGroupIndex)
  }

  // Helper function to handle create mode - create new group
  const createNewGroup = (
    updatedCriteriaDetails: CriteriaDetail[],
    data: CriteriaDetail,
    unsavedUuid: string
  ): void => {
    const newGroupData = {
      ...data,
      criteria: data.criteria.map((c, index) => ({
        ...c,
        criteria_mapper_id: index === NUMBERMAP.ZERO ? unsavedUuid : (c.criteria_mapper_id ?? `unsaved_${crypto.randomUUID()}`),
      })),
    }
    updatedCriteriaDetails.push(newGroupData)
  }

  // Helper function to handle create mode
  const handleCreateMode = (
    updatedCriteriaDetails: CriteriaDetail[],
    data: CriteriaDetail,
    newCriteriaItem
  ): void => {
    const unsavedUuid = `unsaved_${crypto.randomUUID()}`
    const groupName = data.group_name
    const existingGroupIndex = updatedCriteriaDetails.findIndex(
      g => g.group_name === groupName
    )
    
    if (existingGroupIndex !== NUMBERMAP.NEGATIVE_ONE) {
      addCriteriaToExistingGroup(updatedCriteriaDetails, existingGroupIndex, newCriteriaItem, unsavedUuid)
    } else {
      createNewGroup(updatedCriteriaDetails, data, unsavedUuid)
    }
  }

  // Handler for modal save
  const handleModalSave = (data: CriteriaDetail) => {
    if (!data.criteria || data.criteria.length === NUMBERMAP.ZERO) {
      return
    }

    const updatedCriteriaDetails = [...criteriaDetails]
    const newCriteriaItem = data.criteria[NUMBERMAP.ZERO]
    
    if (editingCriteria) {
      handleEditMode(updatedCriteriaDetails, newCriteriaItem, editingCriteria)
    } else {
      handleCreateMode(updatedCriteriaDetails, data, newCriteriaItem)
    }

    setCriteriaDetails(updatedCriteriaDetails)
    handleDraftSave(formData, updatedCriteriaDetails)
    handleModalClose()
  }

  // Get initial data for modal when editing
  const getModalInitialData = (criteria: VendorCriteria | null) => {
    if (!criteria) return undefined

    // Find group by matching group name (category) - use case-insensitive comparison
    const groupName = (criteria.category ?? '').trim()
    const mapperId = criteria.group_criteria_mapper_id ?? criteria.sub_group_id
    
    // Find group with case-insensitive comparison
    const group = criteriaDetails.find(g => {
      const gName = (g.group_name ?? '').trim()
      return gName.toLowerCase() === groupName.toLowerCase() || gName === groupName
    })
    
    // Find criteria item by mapper ID (handles both numeric IDs and UUIDs)
    let criteriaItem = group?.criteria.find(c => {
      const cMapperId = c.criteria_mapper_id?.toString().trim()
      const searchMapperId = mapperId?.toString().trim()
      const matches = cMapperId === searchMapperId
      return matches
    })
    
    // Fallback: If not found by UUID, try to find by criteria name (for unsaved entries)
    if (!criteriaItem && group && criteria.criteria) {
      const criteriaName = criteria.criteria.trim()
      criteriaItem = group.criteria.find(c => {
        const cName = (c.criteria_name ?? '').trim()
        return cName.toLowerCase() === criteriaName.toLowerCase() || cName === criteriaName
      })
    }
    

    const criteriaIdValue = criteriaItem?.criteria_id ??
      criteria.criteria_id ??
      criteria.criteriaId ??
      ''

    // Check if group has a valid group_id (not null, not 0, and is a valid number)
    const hasValidGroupId = group?.group_id != null && 
      group.group_id !== NUMBERMAP.ZERO && 
      !isNaN(Number(group.group_id))
    
    // If group has a valid ID, use it for prefetching; otherwise use group_name
    // This handles both new groups (no ID, use name) and existing groups (has ID, use ID)
    const finalGroupName = hasValidGroupId 
      ? String(group.group_id) 
      : (group?.group_name ?? groupName ?? '')

    const statusIdValue = criteriaItem?.status_id ??
      (criteria.statusId ? Number(criteria.statusId) : undefined) ??
      (criteria.status ? Number(criteria.status) : undefined) ??
      NUMBERMAP.ONE

    // For custom group/criteria (no ID), use the actual name instead of empty string
    // This ensures custom names are prefetched when editing
    // If it's a UUID (unsaved entry), use the actual names from criteriaItem
    const isUnsavedEntry = mapperId?.toString().startsWith('unsaved_')
    const finalCriteriaName = criteriaIdValue && !isUnsavedEntry 
      ? String(criteriaIdValue) 
      : (criteriaItem?.criteria_name ?? criteria.criteria_name ?? criteria.criteria ?? '')
    
    // Get the actual criteria name from criteriaDetails (local state) for display
    // This is needed because the API might have stale data before save
    const localCriteriaName = criteriaItem?.criteria_name ?? criteria.criteria ?? ''

    const result = {
      group_name: finalGroupName,
      criteria_name: finalCriteriaName,
      status_id: statusIdValue ? String(statusIdValue) : String(NUMBERMAP.ONE),
      criteria_mapper_id: criteriaItem?.criteria_mapper_id ?? mapperId ?? "",
      local_criteria_name: localCriteriaName,
    }
    return result
  }

  // Handler for delete - sets status to 2 instead of deleting
  const handleDeleteCriteria = (criteria: VendorCriteria) => {
    const currentCriteriaDetails = [...criteriaDetails]
    const groupName = criteria.category ?? ''
    const group = currentCriteriaDetails.find(g => g.group_name === groupName)

    if (!group) return

    const mapperId = criteria.group_criteria_mapper_id ?? criteria.sub_group_id
    const criteriaIndex = group.criteria.findIndex(
      (c) => c.criteria_mapper_id?.toString() === mapperId?.toString()
    )

    if (criteriaIndex !== NUMBERMAP.NEGATIVE_ONE) {
      // Update status to 2 (inactive/deleted)
      group.criteria[criteriaIndex] = {
        ...group.criteria[criteriaIndex],
        status_id: NUMBERMAP.TWO,
      }
      setCriteriaDetails(currentCriteriaDetails)
      handleDraftSave(formData, currentCriteriaDetails)
    }
  };

  const customColumns: GridColDef[] = [
    {
      field: TABLE_COLUMNS.SNO.FIELD,
      headerName: TABLE_COLUMNS.SNO.HEADER,
      flex: NUMBERMAP.HALF,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams) => {
        const row = params.row as VendorCriteria
        if (!row.isParent) {
          return <EmptyTableCell />
        }

        const sno = row.group ?? NUMBERMAP.ZERO
        return (
          <SnoTableCell>
            {String(sno)}
          </SnoTableCell>
        )
      },
    },
    {
      field: TABLE_COLUMNS.CRITERIA.FIELD,
      headerName: TABLE_COLUMNS.CRITERIA.HEADER,
      flex: NUMBERMAP.FOUR,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams) => {
        const row = params.row as VendorCriteria
        return (
          <CriteriaTableCell isParent={row.isParent ?? false}>
            {params.value}
          </CriteriaTableCell>
        )
      },
    },
    {
      field: TABLE_COLUMNS.STATUS.FIELD,
      headerName: TABLE_COLUMNS.STATUS.HEADER,
      flex: NUMBERMAP.ONE,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams) => {
        const row = params.row as VendorCriteria
        if (row.isParent) {
          return <EmptyTableCell />
        }
        const statusValue = params.value === NUMBERMAP.TWO ? NUMBERMAP.ZERO : params.value;
        return <StatusTypography value={statusValue} />;
      },
    },
    {
      field: TABLE_COLUMNS.ACTIONS.FIELD,
      headerName: TABLE_COLUMNS.ACTIONS.HEADER,
      flex: NUMBERMAP.ONE,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams) => {
        const row = params.row as VendorCriteria;
        if (row.isParent) {
          return <EmptyTableCell />;
        }
        // Hide delete and edit if is_system_defined is true
        const isSystemDefined = (row as any).is_system_defined ?? false;

        if (isSystemDefined) {
          return null;
        }

        return (
          <ActionButton 
            onEdit={() => handleEditCriteria(row)} 
            onDelete={() => handleDeleteCriteria(row)} 
            deleteDisabled={params.row.status==NUMBERMAP.TWO}
          />
        )
      },
    },
  ]

  return (
    <FormContainer ref={formRef}>
      <FormWrapper>
        <Label title={isAddMode ? PAGE_CONSTANTS.TITLES.ADD : PAGE_CONSTANTS.TITLES.EDIT} />
        <FormContent>
          <GridContainerWithMargin container spacing={NUMBERMAP.TWO}>
            <Grid2 size={NUMBERMAP.SIX}>
              <InputField
                label={FORM_CONSTANTS.LABELS.PRODUCT_GROUP}
                placeholder={FORM_CONSTANTS.PLACEHOLDERS.PRODUCT_GROUP}
                isDropdown
                value={formData?.productGroup}
                onChange={(value: any) => {
                  handleInputChange(FORM_CONSTANTS.FIELD_NAMES.PRODUCT_GROUP, value)
                }}
                error={errors.productGroup}
                options={productGroupsData?.data ?? []}
                keyField={FORM_CONSTANTS.KEY_FIELDS.PRODUCT_GROUP}
                valueField={FORM_CONSTANTS.VALUE_FIELDS.PRODUCT_GROUP}
              />
            </Grid2>
            <Grid2 size={NUMBERMAP.SIX}>
              <InputField
                label={FORM_CONSTANTS.LABELS.PRODUCT_CATEGORY}
                placeholder={FORM_CONSTANTS.PLACEHOLDERS.PRODUCT_CATEGORY}
                isDropdown
                value={formData?.productCategory}
                onChange={(value: any) => {
                  handleInputChange(FORM_CONSTANTS.FIELD_NAMES.PRODUCT_CATEGORY, value)
                }}
                error={errors.productCategory}
                options={productCategoriesData?.data ?? []}
                keyField={FORM_CONSTANTS.KEY_FIELDS.PRODUCT_CATEGORY}
                valueField={FORM_CONSTANTS.VALUE_FIELDS.PRODUCT_CATEGORY}
              />
            </Grid2>
          </GridContainerWithMargin>

          <GridContainerWithMargin container spacing={NUMBERMAP.TWO}>
            <Grid2 size={NUMBERMAP.SIX}>
              <InputField
                label={FORM_CONSTANTS.LABELS.PRODUCT_TYPE}
                placeholder={FORM_CONSTANTS.PLACEHOLDERS.PRODUCT_TYPE}
                isDropdown
                value={formData?.productType}
                onChange={(value: any) => {
                  handleInputChange(FORM_CONSTANTS.FIELD_NAMES.PRODUCT_TYPE, value)
                }}
                error={errors.productType}
                options={productTypesData?.data ?? []}
                keyField={FORM_CONSTANTS.KEY_FIELDS.PRODUCT_TYPE}
                valueField={FORM_CONSTANTS.VALUE_FIELDS.PRODUCT_TYPE}
              />
            </Grid2>
            <Grid2 size={NUMBERMAP.SIX}>
              <InputField
                label={FORM_CONSTANTS.LABELS.PRODUCT_SUB_TYPE}
                placeholder={FORM_CONSTANTS.PLACEHOLDERS.PRODUCT_SUB_TYPE}
                isDropdown
                value={formData?.productSubtype}
                onChange={(value: any) => {
                  handleInputChange(FORM_CONSTANTS.FIELD_NAMES.PRODUCT_SUBTYPE, value)
                }}
                error={errors.productSubtype}
                options={productSubTypesData?.data ?? []}
                keyField={FORM_CONSTANTS.KEY_FIELDS.PRODUCT_SUB_TYPE}
                valueField={FORM_CONSTANTS.VALUE_FIELDS.PRODUCT_SUB_TYPE}
              />
            </Grid2>
          </GridContainerWithMargin>

          <GridContainerWithMargin container spacing={NUMBERMAP.TWO}>
            <Grid2 size={NUMBERMAP.SIX}>
              <InputField
                label={FORM_CONSTANTS.LABELS.PRODUCT_NAME}
                placeholder={FORM_CONSTANTS.PLACEHOLDERS.PRODUCT_NAME}
                isDropdown
                value={formData?.productName}
                onChange={(value: any) => {
                  handleInputChange(FORM_CONSTANTS.FIELD_NAMES.PRODUCT_NAME, value)
                }}
                error={errors.productName}
                options={productAllData?.data ?? []}
                keyField={FORM_CONSTANTS.KEY_FIELDS.PRODUCT_NAME}
                valueField={FORM_CONSTANTS.VALUE_FIELDS.PRODUCT_NAME}
              />
            </Grid2>
            <Grid2 size={NUMBERMAP.SIX}>
              <InputField
                label={FORM_CONSTANTS.LABELS.STATUS}
                placeholder={FORM_CONSTANTS.PLACEHOLDERS.STATUS}
                isDropdown
                value={formData?.status}
                onChange={(value: any) => {
                  handleInputChange(FORM_CONSTANTS.FIELD_NAMES.STATUS, value)
                }}
                error={errors.status}
                options={statusData?.data ?? []}
                keyField={STATUS_DROPDOWN_CONFIG.KEY_FIELD}
                valueField={STATUS_DROPDOWN_CONFIG.VALUE_FIELD}
              />
            </Grid2>
          </GridContainerWithMargin>

          <GridContainerWithMargin container spacing={NUMBERMAP.TWO}>
            <Grid2 size={NUMBERMAP.TWELVE}>
              <VendorSelectionCriteriaCommonTable
                rawData={criteriaDetails ?? []}
                transformConfig={CUSTOMER_FEEDBACK_CRITERIA_TABLE_TRANSFORM_CONFIG}
                onCriteriaReorder={handleCriteriaReorder}
                onAddCriteria={handleAddCriteria}
                onEditCriteria={handleEditCriteria}
                title={PAGE_CONSTANTS.TABLE.TITLE}
                showAddButton={true}
                columns={customColumns}
                groupingColumn={PAGE_CONSTANTS.TABLE.GROUPING_COLUMN}
                parentColumn={PAGE_CONSTANTS.TABLE.PARENT_COLUMN}
              />
            </Grid2>
          </GridContainerWithMargin>

          <ButtonGroup
            buttons={[
              { label: PAGE_CONSTANTS.BUTTONS.CANCEL, onClick: handleCancel },
              { label: PAGE_CONSTANTS.BUTTONS.SAVE, onClick: handleSave },
            ]}
          />
        </FormContent>
      </FormWrapper>

      <CustomerFeedbackCriteriaModal
        open={isModalOpen}
        onClose={handleModalClose}
        onSave={handleModalSave}
        initialData={getModalInitialData(editingCriteria)}
        criteriaId={editingCriteria ? (editingCriteria.group_criteria_mapper_id ?? editingCriteria.sub_group_id ?? undefined) : undefined}
        criteriaDetails={criteriaDetails}
      />
    </FormContainer>
  )
}

export default CustomerFeedbackCriteriaForm

