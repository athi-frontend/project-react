/**
 * Classification : Confidential
 **/

export interface SanityCheckInspectionFormData {
  part_detail_id: number | null
  sanity_check_inspection_id?: number | null
  vendor_type_id: number | null
  vendor_id: number | null
  purchase_order_id: number | null
  purchase_order_number: string | null
  purchase_order_date: string | null
  part_number_id: number | null
  part_type: string | null
  part_category_sub_type: string | null
  part_sub_class: string | null
  part_category: string | null
  order_quantity: number | null
  po_reference_number: string | null
  safety_critical: string | null
  aql: string | null
  supply_reference_number: string
  supply_received: number | null
  specifications: SpecificationData[]
  remarks: string
  status: number | null
  supporting_files?: any[]
}

export interface SpecificationData {
  specification_detail_id: string | number
  observation: string
  result_id: string | number
  status: number
}

export interface SanityCheckInspectionApiResponse {
  sanity_check_inspection_id: number
  purchase_order_part_detail_id: number
  vendor_name: string
  purchase_order_number: string
  purchase_order_date: string
  supply_reference_number: string
  supply_received: number
  remarks: string | null
  status: number
}

// New API structure for list response
export interface InspectionItem {
  sanity_check_inspection_id: number | null
  supply_reference_number: string | null
  supply_received: number | null
  remarks: string | null
  status: number | null
}

export interface PartDetailItem {
  purchase_order_part_detail_id: number
  inspections: InspectionItem[]
}

export interface PurchaseOrderListItem {
  purchase_order_id: number
  purchase_order_number: string
  purchase_order_date: string
  vendor_id: number
  vendor_name: string
  part_details: PartDetailItem[]
}

export interface SanityCheckInspectionListResponse {
  data: PurchaseOrderListItem[]
}

export interface PurchaseOrderResponse {
  purchase_order_id: number
  vendor_id: number
  vendor_name: string
  purchase_order_number: string
  purchase_order_date: string
  status: number
}

export interface PurchaseOrderListResponse {
  data: PurchaseOrderResponse[]
}

export interface PurchaseOrderDetailsResponse {
  purchase_order_id: number
  purchase_order_number: string
  purchase_order_date: string
  tentative_date: string
  qtn_ref: string
  status: number
  order_type_id: number
  order_type_name: string
  vendor_id: number
  vendor_type_id: number
  vendor_type_name: string
  total_ex_work: number
  packaging_and_transport: number
  gst: number
  total: number
  invoice_to_customer_name: string
  invoice_to_address: string
  invoice_to_location: string
  ship_to_customer_name: string
  ship_to_contact_person: string
  ship_to_address: string
  ship_to_location: string
  supporting_files: any[]
  part_category_details: PartDetailResponse[]
  part_category: PartCategoryResponse[]
}

export interface PartDetailResponse {
  purchase_order_part_details_id: number
  part_id: number
  part_number: string
  part_category_id: number
  part_category_name: string
  expected_date_of_delivery: string | null
  quantity: number
  unit_rate: string
  status: number
  price: string
}

export interface PartCategoryResponse {
  part_category_id: number
  part_category_name: string
  part_category_description: string
  part_type_id: number
  part_type: string
  part_sub_type_id: number
  part_sub_type: string
  part_sub_class_id: number
  part_sub_class: string
  part_category: string
}

export interface PurchaseOrderDetailsListResponse {
  data: PurchaseOrderDetailsResponse[]
}

export interface SpecificationChecklistResponse {
  sanity_specfication_checklist_id: number
  purchase_order_id: number
  purchase_order_date: string
  purchase_order_number: string
  vendor_id: number
  vendor_name: string
  vendor_type_id: number
  vendor_type: string
  specification: SpecificationItemResponse[]
}

export interface SpecificationItemResponse {
  specification_detail_id: number
  status: number
  group_id: number
  group_name: string
  specification: string
  display_order: number
}

export interface SpecificationChecklistListResponse {
  data: SpecificationChecklistResponse[]
}

export interface SanityCheckInspectionFetchResponse {
  data: any
  meta_info?: {
    action_control?: {
      formId?: number
      menuId?: number
      formName?: string
      formType?: string
      permissions?: Array<{ action: string; trigger_status_id?: number }>
    }
    task_info?: {
      task_comments?: any[]
      reviewer_list?: any[]
      task_id?: number
    }
  }
}
