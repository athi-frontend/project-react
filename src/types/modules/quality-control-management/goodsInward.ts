/**
 * Classification: Confidential
 * Types for Goods Inward module
 */

/**
 * Response structure from Fetch All API
 * GET /api/v1/quality-control/goods-inward/all
 */
export interface GoodsInwardData {
  goods_inward_id: number
  vendor_name: string
  purchase_order_number: string | number
  purchase_order_date: string
  status?: number
  status_id?: number
}

/**
 * List item structure (currently unused, can be removed if not needed)
 */
export interface GoodsInwardListItem {
  id: number
  sno: number
  vendor_name: string
  purchase_order_number: number
  purchase_order_date: string
  status: number
}


/**
 * Form errors structure for validation
 */
export interface GoodsInwardFormErrors {
  vendor_type?: string
  vendor_name?: string
  purchase_order_number?: string
  vendor_type_id?: string
  vendor_id?: string
  purchase_order_id?: string
  received_date?: string
  status?: string
}

// ============================================
// API PAYLOAD STRUCTURES (What we send to API)
// ============================================

/**
 * Detail item structure for goods inward details array in upsert payload
 */
export interface GoodsInwardDetail {
  goods_inward_details_id?: number
  received_quantity: number
  sanity_inspection_id: number
}

/**
 * Payload structure for Upsert API (Create/Update)
 * POST /api/v1/quality-control/goods-inward
 */
export interface GoodsInwardUpsertPayload {
  goods_inward_id?: number // Optional for insert, mandatory for update
  purchase_order_id: number
  received_date: string // ISO format
  status_id: number
  goods_inward_details: GoodsInwardDetail[]
}

export interface GoodsInwardFormData {
  vendor_type: string
  vendor_name: string
  purchase_order_number: string
  vendor_type_id: string
  vendor_id: string
  purchase_order_id: string
  received_date: string // Read-only, auto-filled from purchase order selection
  status: number | string
  goods_inward_details: GoodsInwardDetail[]
}

/**
 * Response structure from Fetch By ID API
 * GET /api/v1/quality-control/goods-inward/:goods_inward_id
 */
export interface GoodsInwardByIdData {
  goods_inward_id: number
  vendor_type_id: number
  vendor_id: number
  vendor_name: string
  vendor_type: string
  sanity_inspection_id: number
  supply_reference_number: string
  purchase_order_number: string
  received_date: string
  status_id: number
  status_name: string
  goods_inward_details: Array<{
    goods_inward_detail_id: number
    purchase_order_part_detail_id: number
    part_lk: number
    part_number: number | string
    po_quantity: number
    received_quantity: number
    goods_status: number
  }>
}

// Purchase Order response structure
export interface PurchaseOrder {
  purchase_order_id: number
  vendor_id: number
  vendor_name: string
  purchase_order_number: string
  purchase_order_date: string
  status: number
}

export interface PurchaseOrderResponse {
  data: PurchaseOrder[]
}

// Purchase Order Detail (with part details)
export interface PurchaseOrderPartDetail {
  purchase_order_part_detail_id: number
  part_number: string | number
  po_quantity: number
}

export interface PurchaseOrderDetailData {
  id: number
  purchase_order_number: string
  purchase_order_date: string
  vendor_id: number
  status: string
  purchase_order_part_details: PurchaseOrderPartDetail[]
}

export interface PurchaseOrderDetailResponse {
  data: PurchaseOrderDetailData
}

// Sanity Check Inspection response structure
// Note: The API now returns inspection data directly in part_details, not nested in inspections array
export interface SanityCheckInspectionPartDetail {
  purchase_order_part_detail_id: number
  quantity: number
  part_number: string | number
  sanity_check_inspection_id: number
  supply_reference_number: string | null
  supply_received: number
  remarks: string | null
  status: number | null
}

export interface SanityCheckInspectionData {
  purchase_order_id: number
  purchase_order_number: string
  purchase_order_date: string
  vendor_id: number
  vendor_name: string
  part_details: SanityCheckInspectionPartDetail[]
}

export interface SanityCheckInspectionResponse {
  code: number
  status: string
  message: string
  response_timestamp: string
  description: string
  data: SanityCheckInspectionData[]
}

// Transformed row structure for DataGrid
export interface SanityCheckInspectionRow {
  id: number
  purchase_order_part_detail_id: number
  part_number: string | number
  supply_reference_number: string
  po_quantity: number
  goods_status: number
  sanity_check_inspection_id: number
  sanity_inspection_id: number
  received_quantity?: string | number
}

export interface TransformedSanityCheckInspectionResponse {
  code: number
  status: string
  message: string
  response_timestamp: string
  description: string
  data: SanityCheckInspectionRow[]
  isUsingSanityCheckData: boolean
}