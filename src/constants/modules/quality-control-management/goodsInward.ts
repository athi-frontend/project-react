/**
 * Classification: Confidential
 * Constants for Goods Inward module
 */

import { NUMBERMAP } from '@/constants/common'
import { GridColDef } from '@mui/x-data-grid'
import { GoodsInwardFormData } from '@/types/modules/quality-control-management/goodsInward'

const BASE_API_PATH = 'api/v1'
const BASE_API_PATH_QUALITY_CONTROL = 'quality-control'
const BASE_API_PATH_SANITY_CHECK_INSPECTION = 'sanity-check-inspection'
const GOODS_INWARD_PATH = 'goods-inward'

export const API_ENDPOINTS = {
  FETCH_ALL_GOODS_INWARD: `${BASE_API_PATH}/${BASE_API_PATH_QUALITY_CONTROL}/${GOODS_INWARD_PATH}/all`,
  FETCH_BY_ID: (goodsInwardId: number) =>
    `${BASE_API_PATH}/${BASE_API_PATH_QUALITY_CONTROL}/${GOODS_INWARD_PATH}/${goodsInwardId}`,
  UPSERT_GOODS_INWARD: `${BASE_API_PATH}/${BASE_API_PATH_QUALITY_CONTROL}/${GOODS_INWARD_PATH}`,
  DELETE_GOODS_INWARD: (goodsInwardId: number) =>
    `${BASE_API_PATH}/${BASE_API_PATH_QUALITY_CONTROL}/${GOODS_INWARD_PATH}/${goodsInwardId}`,
  FETCH_SANITY_CHECK_INSPECTION: `${BASE_API_PATH}/${BASE_API_PATH_QUALITY_CONTROL}/${BASE_API_PATH_SANITY_CHECK_INSPECTION}/all`,
} as const

export const QUERY_KEYS = {
  ALL_GOODS_INWARD: 'allGoodsInward',
  GOODS_INWARD_BY_ID: 'goodsInwardById',
  VENDOR_TYPES: 'vendorTypes',
  VENDOR_LIST: 'vendorList',
  PURCHASE_ORDERS: 'purchaseOrders',
  PURCHASE_ORDER_BY_ID: 'purchaseOrderById',
  SANITY_CHECK_INSPECTION: 'sanityCheckInspection',
} as const

export const GOODS_INWARD_CONSTANTS = {
  PATH: '/quality-control-management/goods-inward',
  CONTEXT_TYPE: 'goods_inward',
} as const

export const GOODS_INWARD_TABLE_COLUMNS: GridColDef[] = [
  {
    field: 'sno',
    headerName: 'S.No.',
  },
  {
    field: 'vendor_name',
    headerName: 'Vendor Name',
    flex: NUMBERMAP.TWO,
  },
  {
    field: 'purchase_order_number',
    headerName: 'Purchase Order Number',
    flex: NUMBERMAP.TWO,
  },
  {
    field: 'purchase_order_date',
    headerName: 'Purchase Order Date',
    flex: NUMBERMAP.TWO,
  },
]

// Details table columns shown on Add/Edit form (without Received Quantity input)
export const GOODS_INWARD_DETAILS_COLUMNS_BASE: GridColDef[] = [
  {
    field: 'sno',
    headerName: 'S.No.',
    flex: NUMBERMAP.HALF,
  },
  {
    field: 'part_number',
    headerName: 'Part Number',
    flex: NUMBERMAP.ONE_HALF,
  },
  {
    field: 'supply_reference_number',
    headerName: 'Supply Reference Number',
    flex: NUMBERMAP.ONE_HALF,
  },
  {
    field: 'quantity',
    headerName: 'PO Quantity',
    flex: NUMBERMAP.ONE_HALF,
  },
]

export const FORM_LABELS = {
  VENDOR_TYPE: 'Vendor Type*',
  VENDOR_NAME: 'Vendor Name*',
  PURCHASE_ORDER_NUMBER: 'Purchase Order Number*',
  RECEIVED_DATE: 'Received Date*',
  STATUS: 'Status*',
  RECEIVED_QUANTITY: '',
} as const

export const FORM_PLACEHOLDERS = {
  VENDOR_TYPE: 'Select Vendor Type',
  VENDOR_NAME: 'Select Vendor Name',
  PURCHASE_ORDER_NUMBER: 'Select Purchase Order Number',
  RECEIVED_DATE: 'DD-MM-YYYY',
  STATUS: 'Select Status',
  RECEIVED_QUANTITY: 'Enter Input',
} as const

export const VALIDATION_MESSAGES = {
  VENDOR_TYPE_REQUIRED: 'Vendor Type is required',
  VENDOR_NAME_REQUIRED: 'Vendor Name is required',
  PURCHASE_ORDER_NUMBER_REQUIRED: 'Purchase Order Number is required',
  RECEIVED_DATE_REQUIRED: 'Received Date is required',
  STATUS_REQUIRED: 'Status is required',
} as const

export const PAGE_TITLES = {
  LIST: 'Goods Inward',
  PART_DETAILS: 'Part Details',
} as const

export const CREATE = 'create'

export const DROPDOWN_FIELD_CONFIG = {
  VENDOR_TYPE: {
    KEY_FIELD: 'id',
    VALUE_FIELD: 'vendor_type_name',
  },
  VENDOR_NAME: {
    KEY_FIELD: 'id',
    VALUE_FIELD: 'vendor_name',
  },
  PURCHASE_ORDER_NUMBER: {
    KEY_FIELD: 'purchase_order_id',
    VALUE_FIELD: 'purchase_order_number',
  },
  STATUS: {
    KEY_FIELD: 'status_id',
    VALUE_FIELD: 'status_name',
  },
} as const

export const GOODS_INWARD_FIELD_ID = 'goods_inward_id'

export const TABLE_COLUMN_LABELS = {
  SANITY_INSPECTION_STATUS: 'Sanity Inspection Status',
  RECEIVED_QUANTITY: 'Received Quantity',
  STATUS: 'Status',
  ACTIONS: 'Actions',
} as const

export const STATUS_VALUES = {
  ACCEPTED: 'Accepted',
  REJECTED: 'Rejected',
} as const

export const WORKFLOW_STATUS = 'approved,rejected'

export const DETAILS_TABLE_ID_FIELDS = {
  EDIT_MODE: 'goods_inward_detail_id',
  ADD_MODE: 'purchase_order_part_detail_id',
  SANITY_CHECK_INSPECTION: 'sanity_check_inspection_id',
} as const

export const FORM_FIELD_NAMES = {
  VENDOR_TYPE: 'vendor_type_id',
  VENDOR_NAME: 'vendor_id',
  PURCHASE_ORDER_NUMBER: 'purchase_order_id',
  RECEIVED_DATE: 'received_date',
  STATUS: 'status',
} as const

export const TABLE_FIELD_NAMES = {
  ORDER_QUANTITY: 'order_quantity',
  PO_QUANTITY: 'po_quantity',
  SANITY_INSPECTION_STATUS: 'status',
  GOODS_STATUS: 'goods_status',
  RECEIVED_QUANTITY: 'received_quantity',
  PURCHASE_ORDER_DATE: 'purchase_order_date',
  STATUS: 'status',
  STATUS_ID: 'status_id',
  ACTIONS: 'actions',
  SANITY_CHECK_INSPECTION_ID: 'sanity_check_inspection_id',
  SANITY_INSPECTION_ID: 'sanity_inspection_id',
} as const

export const DEFAULT_FORM_DATA: GoodsInwardFormData = {
  vendor_type_id: '',
  vendor_id: '',
  purchase_order_id: '',
  received_date: '',
  status: '',
} 

export const ID_PART_DETAILS_FIELDS = "sanity_check_inspection_id"