/**
 * Classification: Confidential
 * Type definitions for Sanity Specification Checklist module
 */

import { VendorCriteria } from '@/components/modules/vendor-management/vendor-selection-criteria/VendorSelectionCriteriaTable'

// Service Types
export type SanitySpecChecklistItem = {
  sanity_specification_checklist_id: number
  product_order_id: number
  vendor_type: string
  vendor_name: string
  status: number
  product_order_number: string
  puchase_order_date: string
}

export type SanitySpecChecklistListResponse = {
  code: number
  status: string
  message: string
  response_timestamp: string
  description: string
  data: SanitySpecChecklistItem[]
}

export type SanitySpecDetailRequest = {
  specification_detail_id: string
  group_id: string
  group_name: string
  is_new_group: 'true' | 'false'
  applicable_group_id: string
  applicable_group_display_order: number
  specification: string
  status_id: number
  specification_display_order: number
}

export type SanitySpecCreateRequest = {
  purchase_order_id: number
  specification: SanitySpecDetailRequest[]
}

export type SanitySpecificationDragDropItem = {
  id: number | string
  sno: number
  specification: string
  specification_detail_id?: string
  group_id?: number | string
  group_name?: string
  status_id?: number
  display_order?: number
  order?: number
  group?: number
}

// Lib Types
export interface ReorderDataItem {
  applicable_group_id?: number
  group_id?: number  | string
  group_value: string
  applicable_group_display_order: number
  specification_details: Array<{
    specification_detail_id?: number | string // Can be number (from API) or string (crypto UUID for new items)
    status_id: number
    status_name?: string
    specification: string
    specification_display_order: number
  }>
}

export type TransformReorderDataPayload = {
  purchase_order_id: string | number
  specification: Array<{
    specification_detail_id: string
    group_id: string
    group_name: string
    is_new_group: 'true' | 'false'
    applicable_group_id: string
    applicable_group_display_order: number
    specification: string
    status_id: number
    specification_display_order: number
  }>
}

// Page Types
export type SanitySpecificationFormData = {
  vendor_type_id: string
  vendor_id: string
  purchase_order_number: string
  purchase_order_date: string
  purchase_order_id: string
  status_id: string
}

export type SanitySpecificationFormErrors = {
  vendor_type_id: string
  vendor_id: string
  purchase_order_id: string
  status_id: string
  specifications: string
}

export type ModalData = {
  group_name_id: string
  specification: string
  group_name: string
  status_id: string
}

export type SpecErrors = {
  group_name_id: string
  specification: string
  status_id: string
}

// Group Data Types
export type GroupDataItem = {
  group_id: number
  group_name: string
  status: number
}

// Modal Types
export interface SanitySpecificationModalProps {
  open: boolean
  onClose: () => void
  onSave: () => void
  editingParentGroup?: VendorCriteria | null
  specForm: ModalData
  specErrors?: SpecErrors
  onSpecFormChange: (field: string, value: string) => void
  groupsData?: GroupDataItem[] | { data?: GroupDataItem[] } // Groups data from API
}

// Group Name to ID Mapping
export type GroupNameToIdMap = Map<
  string,
  { groupId?: number; applicableGroupId?: number }
>
