'use client'
import React, { useEffect, useMemo, useState } from 'react'
import { Grid2 } from '@mui/material'
import {
  InputField,
  ButtonGroup,
  Label,
  ActionButton,
  showActionAlert,
} from '@/components/ui'
import {
  FormContainer,
  FormContent,
  FormWrapper,
} from '@/styles/modules/user/userOnboard'
import {
  BUTTON_LABELS,
  CREATE_PAGE_TITLE,
  FORM_LABELS,
  FORM_PLACEHOLDERS,
  VALIDATION_MESSAGES,
  TRANSFORM_CONFIG,
  DROPDOWN_FIELDS,
  ROUTES,
  TABLE_COLUMNS,
  DELETE_DISABLED_STATUS,
  TABLE_TITLE,
  CREATE,
  INITIAL_FORM_DATA,
  INITIAL_FORM_ERRORS,
  INITIAL_MODAL_DATA,
  INITIAL_SPEC_ERRORS,
  FORM_FIELD_NAMES,
} from '@/constants/modules/quality-control-management/sanitySpecificationChecklist'
import { STYLE5 } from '@/styles/modules/hr/candidateEvaluation'
import { NUMBERMAP, STATUS, DRAFT } from '@/constants/common'
import { ErrorText } from '@/styles/common'
import InfoField from '@/components/modules/dnd/project-info/InfoField'
import { VendorCriteria } from '@/components/modules/vendor-management/vendor-selection-criteria/types'
import {
  useAllVendors,
  useAllVendorTypes,
  useAllPurchaseOrders,
} from '@/hooks/modules/vendor-management/useCommonDropdown'
import { useParams, useRouter } from 'next/navigation'
import {
  useSanitySpecificationById,
  useSanitySpecificationGroupsAll,
  useUpsertSanitySpecificationChecklist,
} from '@/hooks/modules/quality-control-management/useSanitySpecificationChecklist'
import GlobalLoader from '@/components/shared/LoadingSpinner'
import { GridRenderCellParams } from '@mui/x-data-grid'
import {
  CriteriaTableCell,
  EmptyTableCell,
  SnoTableCell,
} from '@/styles/modules/vendor-management/vendorSelectionCriteria'
import SanitySpecificationModal from '@/components/modules/quality-control-management/sanity-specification/sanitySpecificationModal'
import {
  transformReorderDataToPayloadWithRenaming,
  addSpecificationToGroup,
  transformFlatToNested,
} from '@/lib/modules/quality-control-management/sanitySpecificationChecklist'
import {
  ReorderDataItem,
  SanitySpecificationFormData,
  SanitySpecificationFormErrors,
  ModalData,
  SpecErrors,
} from '@/types/modules/quality-control-management/sanitySpecificationChecklist'
import StatusTypography from '@/components/ui/status/ToggleStatus'
import VendorSelectionCriteriaCommonTable from '@/components/modules/vendor-management/vendor-selection-criteria/VendorSelectionCriteriaCommonTable'
import { useDraftSave } from '@/hooks/common/useDraftSave'
import DraftLoading from '@/components/ui/draft-loader/DraftLoader'
import { useOrganizationStatus } from '@/hooks/useCommonDropdown'
import { formatDate } from '@/lib/utils/common'

/**
 * Classification : Confidential
 **/

const SanitySpecificationCheckList: React.FC = () => {
  const params = useParams()
  const router = useRouter()
  const [formData, setFormData] =
    useState<SanitySpecificationFormData>(INITIAL_FORM_DATA)
  const [formErrors, setFormErrors] =
    useState<SanitySpecificationFormErrors>(INITIAL_FORM_ERRORS)
  const [isSpecModalOpen, setIsSpecModalOpen] = useState(false)
  const [modalData, setModalData] = useState<ModalData>(INITIAL_MODAL_DATA)
  const [specErrors, setSpecErrors] = useState<SpecErrors>(INITIAL_SPEC_ERRORS)
  const [purchaseOrderID, setPurchaseOrderID] = useState<number | null>(null)
  const { data: statusData } = useOrganizationStatus()
  const [editingParentGroup, setEditingParentGroup] =
    useState<VendorCriteria | null>(null)
  const { data: vendorTypes, isLoading: isVendorTypesLoading } =
    useAllVendorTypes(NUMBERMAP.ONE)
  const selectedVendorTypeId = formData.vendor_type_id
    ? Number(formData.vendor_type_id)
    : undefined
  const { data: vendorList, isLoading: isVendorListLoading } = useAllVendors(
    NUMBERMAP.ONE,
    selectedVendorTypeId
  )
  const [specificationData, setSpecificationData] = useState<ReorderDataItem[]>(
    []
  )
  const [editingSpecification, setEditingSpecification] =
    useState<VendorCriteria | null>(null)

  // Hooks for API calls
  const { data: groupsData, isLoading: isGroupsLoading } =
    useSanitySpecificationGroupsAll()
  const { mutate: upsertSpecification, isPending: isSaving } =
    useUpsertSanitySpecificationChecklist()
  const paramPurchaseOrderId = params?.id
  const rawId = purchaseOrderID ?? Number(paramPurchaseOrderId)
  const isEditMode = paramPurchaseOrderId !== CREATE
  const selectedVendorId = formData.vendor_id
    ? Number(formData.vendor_id)
    : undefined
  const { data: sanitySpecificationData, isLoading: isSanitySpecLoading, refetch: refetchSanitySpecificationById } =
    useSanitySpecificationById(rawId as number | null)
  const { data: purchaseOrdersData, isLoading: isPurchaseOrdersLoading } =
    useAllPurchaseOrders(NUMBERMAP.ONE, selectedVendorId)

  // Draft save hook
  const { draftSave, clearDraftSave, isFetchingDraft, isDraftSaving, checkUnsavedDraftBeforeLeave } = useDraftSave({
    context_type:'purchase_order',
    context_instance_id: purchaseOrderID ?? Number(paramPurchaseOrderId),
    enableFetch: false
  })

  useEffect(() => {
    setFormData(INITIAL_FORM_DATA)
    setFormErrors(INITIAL_FORM_ERRORS)
    setSpecificationData([])
  }, [])

  useEffect(() => {
    if (purchaseOrderID && purchaseOrderID > NUMBERMAP.ZERO && !isNaN(purchaseOrderID)) {
      refetchSanitySpecificationById()
    }
  }, [purchaseOrderID])


  // Fill purchase_order_number and purchase_order_date based on selected purchase_order_id
  useEffect(() => {
    if (
      purchaseOrdersData?.data &&
      formData.purchase_order_id &&
      formData.purchase_order_id !== '' &&
      formData.purchase_order_id !== NUMBERMAP.ZERO.toString()
    ) {
      const paramPurchaseOrderId = Number(formData.purchase_order_id)
      // Only proceed if paramPurchaseOrderId is valid (not 0, not NaN)
      if (
        paramPurchaseOrderId &&
        paramPurchaseOrderId > NUMBERMAP.ZERO &&
        !isNaN(paramPurchaseOrderId)
      ) {
        const purchaseOrder = purchaseOrdersData.data.find(
          (po) => po.purchase_order_id === paramPurchaseOrderId
        )
        if (purchaseOrder) {
          setFormData((prev) => ({
            ...prev,
            purchase_order_number: purchaseOrder.purchase_order_number,
            purchase_order_date: purchaseOrder.purchase_order_date,
          }))
        }
      }
    }
  }, [purchaseOrdersData])


  //fetch by id (purchase order id )
  useEffect(() => {
    if (sanitySpecificationData) {
      let existingData = null
      // Check if it's a draft object (has type property)
      if (typeof sanitySpecificationData === 'object' && (sanitySpecificationData as any).type === DRAFT) {
        existingData = sanitySpecificationData
      } else if (Array.isArray(sanitySpecificationData) && sanitySpecificationData.length > NUMBERMAP.ZERO) {
        existingData = sanitySpecificationData[NUMBERMAP.ZERO]
      }
      
      if (existingData) {
        setFormData({
          ...existingData,
          // Ensure status_id is a string for the dropdown
          status_id: existingData.status_id ? String(existingData.status_id) : existingData.status_id,
        })
        const specs = existingData.specifications ?? []
        setPurchaseOrderID(Number(existingData.purchase_order_id))
        // Store data in ReorderDataItem format
        setSpecificationData(specs)
      }
    }
  }, [sanitySpecificationData])

  // Comprehensive loading state function
  const isLoading = () => {
    if (
      isVendorTypesLoading ||
      isVendorListLoading ||
      isGroupsLoading ||
      isSanitySpecLoading ||
      isPurchaseOrdersLoading
    )
      return true
    return false
  }

  // Handler for delete specification (sets status to 2 instead of deleting)
  const handleDeleteSpecification = async (row: VendorCriteria) => {
    const result = await showActionAlert(STATUS.DELETE)
    if (!result.isConfirmed) return

    const updatedSpecificationData = [...specificationData]
    // Find group based on applicable_group_id
    const groupId = row.vendorGroupId
    const group = updatedSpecificationData.find((g) => g.group_id != null && groupId != null && g.group_id?.toString() === groupId?.toString())
    if (group) {
      if (row.isParent) {
        // Delete parent: Set all child specifications with status_id: 1 to status_id: 2
        group.specification_details.forEach((detail) => {
          detail.status_id = NUMBERMAP.TWO
        })
      } else {
        // Delete child: Set this specific specification to status_id: 2 (only if currently 1)
        const mapperId = row.sub_group_id ?? row.group_criteria_mapper_id
        const detailIndex = group.specification_details.findIndex(
          (d) => d.specification_detail_id === mapperId
        )
        if (
          detailIndex !== -NUMBERMAP.ONE &&
          group.specification_details[detailIndex].status_id === NUMBERMAP.ONE
        ) {
          // Update status to 2 (inactive/deleted) only if currently active
          group.specification_details[detailIndex] = {
            ...group.specification_details[detailIndex],
            status_id: NUMBERMAP.TWO,
          }
        }
      }
      setSpecificationData(updatedSpecificationData)
      // Clear error if there are still active specifications after deletion
      const hasActiveSpecs = updatedSpecificationData.some(group => 
        group.specification_details && 
        Array.isArray(group.specification_details) && 
        group.specification_details.some((detail: any) => detail.status_id === NUMBERMAP.ONE)
      )
      if (hasActiveSpecs) {
        setFormErrors((prev) => ({ ...prev, specifications: '' }))
      }
      handleDraftSave({ ...formData, specifications: updatedSpecificationData })
    }
  }

  const columns = [
    {
      field: TABLE_COLUMNS.SNO.FIELD,
      headerName: TABLE_COLUMNS.SNO.HEADER_NAME,
      flex: TABLE_COLUMNS.SNO.FLEX,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams) => {
        const row = params.row as VendorCriteria
        const isParent = row.isParent

        if (!isParent) {
          return <EmptyTableCell></EmptyTableCell>
        }

        // Calculate S.No. based on parent rows only
        // Get all row IDs and filter for parent rows
        const allRowIds = params.api.getAllRowIds()
        const parentRowIds: (string | number)[] = []

        // Collect parent row IDs and their groups
        allRowIds.forEach((id) => {
          const rowData = params.api.getRow(id)
          if (rowData && (rowData as VendorCriteria).isParent) {
            parentRowIds.push(id)
          }
        })

        // Sort parent rows by group (which contains applicable_group_display_order)
        parentRowIds.sort((a, b) => {
          const rowA = params.api.getRow(a) as VendorCriteria
          const rowB = params.api.getRow(b) as VendorCriteria
          return (rowA.group ?? NUMBERMAP.ZERO) - (rowB.group ?? NUMBERMAP.ZERO)
        })

        // Find the index of current parent row
        const parentIndex = parentRowIds.indexOf(params.id)
        const sno = parentIndex + NUMBERMAP.ONE

        return (
          <SnoTableCell>
            {String(sno).padStart(NUMBERMAP.TWO, NUMBERMAP.ZERO.toString())}
          </SnoTableCell>
        )
      },
    },
    {
      field: TABLE_COLUMNS.SPECIFICATION.FIELD,
      headerName: TABLE_COLUMNS.SPECIFICATION.HEADER_NAME,
      flex: TABLE_COLUMNS.SPECIFICATION.FLEX,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams) => {
        const row = params.row as VendorCriteria
        const isParent = row.isParent

        return (
          <CriteriaTableCell isParent={isParent ?? false}>
            {params.value}
          </CriteriaTableCell>
        )
      },
    },
    {
      field: TABLE_COLUMNS.STATUS.FIELD,
      headerName: TABLE_COLUMNS.STATUS.HEADER_NAME,
      flex: NUMBERMAP.ONE,
      renderCell: (params: GridRenderCellParams) => {
        const row = params.row as VendorCriteria
        if (row.isParent) {
          return <EmptyTableCell />
        }
        const statusValue =
          params.value === NUMBERMAP.TWO ? NUMBERMAP.ZERO : params.value
        return <StatusTypography value={statusValue} />
      },
    },
    {
      field: TABLE_COLUMNS.ACTION.FIELD,
      headerName: TABLE_COLUMNS.ACTION.HEADER_NAME,
      flex: TABLE_COLUMNS.ACTION.FLEX,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams) => {
        const row = params.row as VendorCriteria

        return (
          <ActionButton
            onEdit={() => {
              // Handle edit - open modal with specification data
              handleEditSpecification(row)
            }}
            onDelete={() => handleDeleteSpecification(row)}
            deleteDisabled={row.status_id === DELETE_DISABLED_STATUS}
          />
        )
      },
    },
  ]

  // Handler for specification reorder
  const handleReorder = (updatedCriteria: VendorCriteria[]) => {
    // Convert flat VendorCriteria[] back to nested ReorderDataItem[] structure
    // Uses the same transformConfig pattern as transformNestedHierarchicalData for consistency
    const nestedStructure = transformFlatToNested(
      updatedCriteria,
      specificationData,
      TRANSFORM_CONFIG
    )
    // Update the nested structure
    setSpecificationData(nestedStructure)
    handleDraftSave({ ...formData, specifications: nestedStructure })
  }

  // Validate form fields
  const validateForm = (): boolean => {
    const newErrors: SanitySpecificationFormErrors = {
      vendor_type_id: '',
      vendor_id: '',
      purchase_order_id: '',
      status_id: '',
      specifications: ''
    }

    if (!formData.vendor_type_id || formData.vendor_type_id === '') {
      newErrors.vendor_type_id = VALIDATION_MESSAGES.VENDOR_TYPE_REQUIRED
    }

    if (!formData.vendor_id || formData.vendor_id === '') {
      newErrors.vendor_id = VALIDATION_MESSAGES.VENDOR_NAME_REQUIRED
    }
  if (!formData.status_id || formData.status_id =='') {
      newErrors.status_id = VALIDATION_MESSAGES.STATUS
    }

    if (!formData.purchase_order_id || formData.purchase_order_id === '') {
      newErrors.purchase_order_id =
        VALIDATION_MESSAGES.PURCHASE_ORDER_NUMBER_REQUIRED
    }

    // Validate that at least one specification exists
    if (!specificationData || specificationData.length === NUMBERMAP.ZERO || 
        !specificationData.some(group => 
          group.specification_details && 
          Array.isArray(group.specification_details) && 
          group.specification_details.length > NUMBERMAP.ZERO &&
          group.specification_details.some((detail: any) => detail.status_id === NUMBERMAP.ONE)
        )) {
      newErrors.specifications = VALIDATION_MESSAGES.SPECIFICATION_REQUIRED
    }

    setFormErrors(newErrors)
    return (
      !newErrors.vendor_type_id &&
      !newErrors.vendor_id &&
      !newErrors.purchase_order_id &&
      !newErrors.status_id &&
      !newErrors.specifications
    )
  }

  const handleSave = () => {
    if (!validateForm()) {
      return
    }

    clearDraftSave()
    setFormErrors(INITIAL_FORM_ERRORS)

    // Transform specificationData (ReorderDataItem[]) to payload format
    //payload takes nested format returns flat structure
    const payload = transformReorderDataToPayloadWithRenaming(
      specificationData,
      purchaseOrderID
    )

    // Convert purchase_order_id to number for API (API expects number)
    const apiPayload = {
      ...payload, //specification data is flatstructure in payload
      purchase_order_id: purchaseOrderID,
      status_id: Number(formData?.status_id)
    }
    // Call the API
      upsertSpecification(apiPayload, {
        onSuccess: () => {
          router.push(ROUTES.LIST)
          showActionAlert(STATUS.SUCCESS)
        },
        onError: () => showActionAlert(STATUS.FAILED),
      })
  }
  const handleCancel = async () => {
    await checkUnsavedDraftBeforeLeave()
    router.push(ROUTES.LIST)
  }

  // Handler for add specification
  const handleModalOpen = () => {
    setEditingSpecification(null)
    setIsSpecModalOpen(true)
    setModalData(INITIAL_MODAL_DATA)
    setSpecErrors(INITIAL_SPEC_ERRORS)
    setEditingParentGroup(null)
  }

  // Helper: Determine group name and ID for editing specification
  const getGroupNameAndId = (
    specification: VendorCriteria,
    groupsData: { data?: Array<{ group_id: number; group_name?: string }> } | undefined,
    specificationData: ReorderDataItem[]
  ) => {
    const groupId = specification.vendorGroupId ?? ''
    const groupIdNum = Number(groupId)
    const isNumericId = !isNaN(groupIdNum) && groupIdNum > NUMBERMAP.ZERO

    // Find group in specificationData (works for both UUID and numeric IDs)
    const findGroupInSpecData = (id: string | number) =>
      specificationData.find((g) => String(g.group_id) === String(id))

    // Determine group name and ID
    let groupName = specification.criteria ?? ''
    let groupNameId = ''

    if (isNumericId && groupsData?.data) {
      const existingGroup = groupsData.data.find((g) => g.group_id === groupIdNum)
      if (existingGroup) {
        groupNameId = String(groupIdNum)
        groupName = existingGroup.group_name ?? groupName
      } else {
        const specGroup = findGroupInSpecData(groupIdNum)
        if (specGroup?.group_value) {
          groupName = specGroup.group_value
        }
      }
    } else if (groupId) {
      const specGroup = findGroupInSpecData(groupId)
      if (specGroup?.group_value) {
        groupName = specGroup.group_value
      }
    }

    return { groupName, groupNameId }
  }

  // Handler for edit specification
  const handleEditSpecification = (specification: VendorCriteria) => {
    setEditingSpecification(specification)
    setIsSpecModalOpen(true)
    const isParent = specification.isParent

    const { groupName, groupNameId } = getGroupNameAndId(
      specification,
      groupsData,
      specificationData
    )

    // Normalize status_id to be 1 or 2, defaulting to 1
    const rawStatusId = specification.status_id ?? specification.status ?? NUMBERMAP.ONE
    const normalizedStatusId =
      rawStatusId === NUMBERMAP.ONE || rawStatusId === NUMBERMAP.TWO
        ? rawStatusId
        : NUMBERMAP.ONE

    setModalData({
      group_name_id: groupNameId,
      group_name: groupName,
      specification: !isParent ? (specification.criteria ?? '') : '',
      status_id: String(normalizedStatusId),
    })
    setSpecErrors(INITIAL_SPEC_ERRORS)
    setEditingParentGroup(specification.isParent ? specification : null)
  }

  // Handler for modal close
  const handleModalClose = () => {
    setIsSpecModalOpen(false)
    setEditingSpecification(null)
    setModalData(INITIAL_MODAL_DATA)
    setSpecErrors(INITIAL_SPEC_ERRORS)
    setEditingParentGroup(null)
  }

  // Handler for editing existing specification
  const handleEditSpecificationSave = (
    updatedSpecificationData: ReorderDataItem[]
  ) => {
    const isParent = editingSpecification!.isParent

    if (isParent) {
      // Editing parent: Add new specification to that parent's group
      const parentGroupId =
        editingSpecification?.vendorGroupId ?? NUMBERMAP.ZERO
      const newSpecificationData = addSpecificationToGroup(
        updatedSpecificationData,
        modalData,
        parentGroupId,
        editingSpecification
      )
      setSpecificationData(newSpecificationData)
      setFormErrors((prev) => ({ ...prev, specifications: '' }))
      handleDraftSave({ ...formData, specifications: newSpecificationData })
    } else {
      // Editing child: Update existing specification (use new group_id from modal if changed)
      // Handle both numeric IDs (existing groups) and UUID strings (custom groups)
      let parentGroupId
      if (modalData?.group_name_id && modalData.group_name_id.trim() !== '') {
        // Existing group: use numeric group_id
        parentGroupId = Number(modalData.group_name_id)
      } else {
        // Custom group: use original vendorGroupId (could be numeric ID or UUID string)
        const originalGroupId = editingSpecification?.vendorGroupId ?? ''
        const originalGroupIdNum = Number(originalGroupId)
        // Use numeric value if valid, otherwise use original (UUID string)
        parentGroupId = !isNaN(originalGroupIdNum) && originalGroupIdNum > NUMBERMAP.ZERO
          ? originalGroupIdNum
          : originalGroupId
      }

      const newSpecificationData = addSpecificationToGroup(
        updatedSpecificationData,
        modalData,
        parentGroupId,
        editingSpecification
      )
      setSpecificationData(newSpecificationData)
      handleDraftSave({ ...formData, specifications: newSpecificationData })
    }
  }

  // Handler for modal save
  // Helper: Find group for modal
  const findGroupForModal = (modalData: ModalData, specificationData: ReorderDataItem[]) => {
    const parentGroupId =
      modalData?.group_name_id && modalData.group_name_id.trim() !== '' && (modalData?.group_name_id?.toLowerCase()?.trim() != modalData?.group_name?.toLowerCase()?.trim())
        ? modalData.group_name_id.trim()
        : '';
    if (parentGroupId !== '') {
      return specificationData.find((g) => String(g.group_id) === String(parentGroupId));
    } else if (modalData.group_name && modalData.group_name.trim() !== '') {
      return specificationData.find(
        (g) =>
          String(g.group_value).trim().toLowerCase() ===
          String(modalData.group_name).trim().toLowerCase()
      );
    }
    return undefined;
  };

  // Helper: Check for duplicate specification in group
  const isDuplicateSpecInGroup = (
    group: any,
    editingSpecification: VendorCriteria | null,
    modalData: ModalData
  ) => {
    if (group && Array.isArray(group.specification_details)) {
      const normalizedNewSpec = (modalData.specification ?? '').trim().toLowerCase();
      return group.specification_details.some((detail: any) => {
        const thisSpecValue = (detail.criteria ?? detail.specification ?? '').trim().toLowerCase();
        if (
          editingSpecification &&
          editingSpecification.isParent === false &&
          detail.specification_detail_id ===
          (editingSpecification.sub_group_id ?? editingSpecification.group_criteria_mapper_id)
        ) {
          return false;
        }
        return thisSpecValue === normalizedNewSpec;
      });
    }else{
      return group?.group_value?.trim()?.toLowerCase() === modalData.group_name?.trim()?.toLowerCase()
    }
  };

  const handleModalSave = () => {
    // Validate form
    const errors = {
      group_name_id:
        !modalData.group_name || modalData.group_name.trim() === ''
          ? VALIDATION_MESSAGES.GROUP_NAME_REQUIRED
          : '',
      specification:
        !modalData.specification || modalData.specification.trim() === ''
          ? VALIDATION_MESSAGES.SPECIFICATION_REQUIRED
          : '',
      status_id:
        !modalData.status_id
          ? VALIDATION_MESSAGES.STATUS_REQUIRED
          : '',
    }

    const group = findGroupForModal(modalData, specificationData);
    const isDuplicate = isDuplicateSpecInGroup(group, editingSpecification, modalData);
    if (isDuplicate) {
      const message = 'Duplicate specification for this group not allowed.';
      showActionAlert('customAlert', {
        title: 'Duplicate Specification', // Use proper title from your convention
        text: message,
        icon: 'error',
        cancelButton: false,
        confirmButton: false,
      });
      errors.specification = message;
      setSpecErrors(errors);
      return;
    }
    // End duplicate check

    setSpecErrors(errors)
    if (errors.group_name_id || errors.specification || errors.status_id) return

    const updatedSpecificationData = [...specificationData] //nested data , table takes nested structure
    if (editingSpecification) {
      handleEditSpecificationSave(updatedSpecificationData)
    } else {
      const ParentId = modalData?.group_name_id
        ? Number(modalData.group_name_id)
        : NUMBERMAP.ZERO
      //find the group in updatedSpecificationData with group id

      if (ParentId) {
      const newSpecificationData = addSpecificationToGroup(
        updatedSpecificationData,
        modalData,
        ParentId
      )
        setSpecificationData(newSpecificationData)
        setFormErrors((prev) => ({ ...prev, specifications: '' }))
        handleDraftSave({ ...formData, specifications: newSpecificationData })
      } else {
        // Create new group (custom group - group_id will be undefined -> "" in payload)
        const tempGroup = {
          group_id: undefined, // Custom group, will be "" in payload
          group_value: modalData.group_name,
        }
        const newSpecificationData = addSpecificationToGroup(
          updatedSpecificationData,
          modalData,
          tempGroup
        )
        setSpecificationData(newSpecificationData)
        setFormErrors((prev) => ({ ...prev, specifications: '' }))
        handleDraftSave({ ...formData, specifications: newSpecificationData })
      }
    }

    handleModalClose()
  }

  const handleSpecFormChange = (field: string, value: string) => {
    setModalData((prev) => ({ ...prev, [field]: value }))
    setSpecErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const handleDraftSave = (dataToSave: any) => {
    const payload = {
      id: purchaseOrderID ?? new Date().getTime(),
      ...dataToSave,
      purchase_order_id:purchaseOrderID,
      specifications: dataToSave.specifications ?? specificationData,
      type: 'draft',
    }
    draftSave({
      form_data: payload,
      upload_documents: {},
      timestamp: new Date().toISOString(),
    });
  }

  // Helper function to clear purchase order fields
  const clearPurchaseOrderFields = (updated: SanitySpecificationFormData) => {
    updated.purchase_order_id = ''
    updated.purchase_order_date = ''
    updated.purchase_order_number = ''
    updated.status_id = null
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value }
      // Reset dependent fields when parent field changes
      if (field === FORM_FIELD_NAMES.VENDOR_TYPE) {
        updated.vendor_id = ''
        clearPurchaseOrderFields(updated)
        // Clear specification data when vendor type is cleared
        if (!value) {
          setSpecificationData([])
          setPurchaseOrderID(null)
        }
      } else if (field === FORM_FIELD_NAMES.VENDOR_NAME) {
        clearPurchaseOrderFields(updated)
        // Clear specification data when vendor type is cleared
        if (!value) {
          setSpecificationData([])
          setPurchaseOrderID(null)
        }
      } else if (field==FORM_FIELD_NAMES.PURCHASE_ORDERS_ID) {
        setPurchaseOrderID(Number(updated.purchase_order_id))
        clearPurchaseOrderFields(updated)
      }
      return updated
    })
    setFormErrors((prev) => ({ ...prev, [field]: '' }))
  }
  // After handleSpecFormChange (around line 603)
  //if parent has no child filter it
  const filteredSpecificationData = useMemo(() => {
    if (!specificationData || specificationData.length === NUMBERMAP.ZERO) {
      return []
    }

    return specificationData.filter((group) => {
      // Check if group has specification_details array with at least one child
      if (!group.specification_details || !Array.isArray(group.specification_details)) {
        return false // No children, filter out parent
      }
      // Check if there's at least one child (regardless of status)
      return group.specification_details.length > NUMBERMAP.ZERO
    })
  }, [specificationData])
  return (
    <FormContainer>
      <FormWrapper>
        {isDraftSaving && <DraftLoading />}
        <GlobalLoader loading={isLoading() || isFetchingDraft} />
        <Label title={CREATE_PAGE_TITLE} />
        <FormContent>
          <Grid2 container spacing={NUMBERMAP.ONE} sx={STYLE5}>
            <Grid2 size={NUMBERMAP.SIX}>
              <InputField
                label={FORM_LABELS.VENDOR_TYPE}
                placeholder={FORM_PLACEHOLDERS.VENDOR_TYPE}
                isDropdown
                disabled={isEditMode}
                options={vendorTypes?.data ?? []}
                value={formData.vendor_type_id}
                onChange={(value: string) => {
                  handleInputChange('vendor_type_id', value)
                }}
                error={formErrors.vendor_type_id}
                keyField={DROPDOWN_FIELDS.VENDOR_TYPE.KEY_FIELD}
                valueField={DROPDOWN_FIELDS.VENDOR_TYPE.VALUE_FIELD}
              />
            </Grid2>
            <Grid2 size={NUMBERMAP.SIX}>
              <InputField
                label={FORM_LABELS.VENDOR_NAME}
                placeholder={FORM_PLACEHOLDERS.VENDOR_NAME}
                isDropdown
                disabled={isEditMode}
                options={vendorList?.data ?? []}
                value={formData.vendor_id}
                onChange={(value: string) => {
                  handleInputChange('vendor_id', value)
                }}
                error={formErrors.vendor_id}
                keyField={DROPDOWN_FIELDS.VENDOR_NAME.KEY_FIELD}
                valueField={DROPDOWN_FIELDS.VENDOR_NAME.VALUE_FIELD}
              />
            </Grid2>
          </Grid2>

          <Grid2 container spacing={NUMBERMAP.ONE} sx={STYLE5}>
            <Grid2 size={NUMBERMAP.SIX}>
              <InputField
                label={FORM_LABELS.PURCHASE_ORDER_NUMBER}
                placeholder={FORM_PLACEHOLDERS.PURCHASE_ORDER_NUMBER}
                isDropdown
                disabled={isEditMode}
                value={formData.purchase_order_id}
                onChange={(value: string) => {
                  handleInputChange('purchase_order_id', value)
                  // Clear specificationData if purchase_order_id is empty
                  if (!value) {
                    setSpecificationData([])
                  }
                }}
                options={purchaseOrdersData?.data ?? []}
                keyField={DROPDOWN_FIELDS.PURCHASE_ORDER.KEY_FIELD}
                valueField={DROPDOWN_FIELDS.PURCHASE_ORDER.VALUE_FIELD}
                error={formErrors.purchase_order_id}
              />
            </Grid2>
            <Grid2 size={NUMBERMAP.SIX}>
              <InfoField
                label={FORM_LABELS.PURCHASE_ORDER_DATE}
                value={
                  formData.purchase_order_date
                    ? formatDate(formData.purchase_order_date)
                    : ''
                }
              />
            </Grid2>
            <Grid2 size={NUMBERMAP.SIX}>
              <InputField
                isDropdown
                options={statusData?.data ?? []}
                keyField={'status_id'}
                valueField={'status_name'}
                label={'Status*'}
                placeholder={'Select Status'}
                value={formData.status_id}
                onChange={(value: string) => {
                  setFormData((prev) => {
                    const updateForm = { ...prev, status_id: value }
                    handleDraftSave(updateForm)
                    return updateForm

                  })
                  setFormErrors((prev) => ({ ...prev, status_id: '' }))
                }}
                error={formErrors.status_id ?? ''}
              />
            </Grid2>
          </Grid2>
        </FormContent>
        <FormContent>
          <Grid2 container spacing={NUMBERMAP.TWO} >
            <Grid2 size={NUMBERMAP.TWELVE}>
              <VendorSelectionCriteriaCommonTable
                onCriteriaReorder={handleReorder}
                onAddCriteria={handleModalOpen}
                columns={columns}
                title={TABLE_TITLE}
                rawData={filteredSpecificationData}
                transformConfig={TRANSFORM_CONFIG}
              />
              {formErrors.specifications && (
                <ErrorText>{formErrors.specifications}</ErrorText>
              )}
            </Grid2>
          </Grid2>
        </FormContent>
        <FormContent>
        <ButtonGroup
          buttons={[
            { label: BUTTON_LABELS.CANCEL, onClick: handleCancel },
            {
              label: BUTTON_LABELS.SAVE,
              onClick: handleSave,
              disabled: isSaving,
            },
          ]}
        />
        </FormContent>
      </FormWrapper>
      <SanitySpecificationModal
        open={isSpecModalOpen}
        onClose={handleModalClose}
        onSave={handleModalSave}
        editingParentGroup={editingParentGroup}
        specForm={modalData}
        specErrors={specErrors}
        onSpecFormChange={handleSpecFormChange}
        groupsData={groupsData?.data ?? []}
      />
    </FormContainer>
  )
}

export default SanitySpecificationCheckList
