/**
 *Classification : Confidential
 **/

import { NUMBERMAP } from "@/constants/common"

export const RECORD_GENERATION = 'Record Generation'

export const ID = 'id'

export const VENDOR_AGREEMENT_CHECKLIST_ID_FIELD = 'vendor_agreement_checklist_id'

export const RECORD_GENERATION_MODULES = {
  PURCHASE: 'record_generation_purchasing_information',
}

// Common Table Columns
export const COMMON_TABLE_COLUMNS = {
  SERIAL_NO: 'sno',
  ACTION: 'action',
}

// Common Table Headers
export const COMMON_TABLE_HEADERS = {
  SERIAL_NO: 'S.No',
  VIEW: 'View',
}

// Shared table structure for vendor name-based tables
const VENDOR_NAME_TABLE_BASE = {
  TABLE_COLUMNS: {
    SERIAL_NO: COMMON_TABLE_COLUMNS.SERIAL_NO,
    VENDOR_NAME: 'vendor_name',
    ACTION: COMMON_TABLE_COLUMNS.ACTION,
  },
  TABLE_HEADERS: {
    SERIAL_NO: COMMON_TABLE_HEADERS.SERIAL_NO,
    VENDOR_NAME: 'Vendor Name',
    VIEW: COMMON_TABLE_HEADERS.VIEW,
  },
  ID_FIELD: 'id',
} as const

// OutSource Vendor Agreement Table
export const OUTSOURCE_VENDOR_AGREEMENT_TABLE = VENDOR_NAME_TABLE_BASE

// Vendor Agreement Checklist Table
export const VENDOR_AGREEMENT_CHECKLIST_TABLE = VENDOR_NAME_TABLE_BASE


// Purchase Order Table
export const PURCHASE_ORDER_TABLE = {
  TABLE_COLUMNS: {
    SERIAL_NO: COMMON_TABLE_COLUMNS.SERIAL_NO,
    PURCHASE_ORDER_NUMBER: 'purchase_order_number',
    PURCHASE_ORDER_DATE: 'purchase_order_date',
    ACTION: COMMON_TABLE_COLUMNS.ACTION,
  },
  TABLE_HEADERS: {
    SERIAL_NO: COMMON_TABLE_HEADERS.SERIAL_NO,
    PO_NUMBER: 'PO No.',
    PO_DATE: 'PO Date',
    VIEW: COMMON_TABLE_HEADERS.VIEW,
  },
  ID_FIELD: 'purchase_order_id',
}

export const PurchaseOrderColumsRG = [ {
      field: PURCHASE_ORDER_TABLE.TABLE_COLUMNS.SERIAL_NO,
      headerName: PURCHASE_ORDER_TABLE.TABLE_HEADERS.SERIAL_NO,
      flex: NUMBERMAP.HALF,
    },
    {
      field: PURCHASE_ORDER_TABLE.TABLE_COLUMNS.PURCHASE_ORDER_NUMBER,
      headerName: PURCHASE_ORDER_TABLE.TABLE_HEADERS.PO_NUMBER,
      flex: NUMBERMAP.ONE,
    },
    {
      field: 'part_number',
      headerName:'Part Name',
      flex: NUMBERMAP.ONE
    },]

// Form type mappings for purchase record generation
export const PURCHASE_RECORD_GENERATION_FORM_TYPES = {
  OUTSOURCE_VENDOR_AGREEMENT: 'outsource-vendor-agreement',
  VENDOR_AGREEMENT: 'vendor-agreement',
  PURCHASE_ORDER: 'purchase-order',
  VENDOR_AGREEMENT_CHECKLIST: 'vendor-agreement-checklist',
} as const

// Shared record generation options
const PURCHASE_RECORD_GENERATION_OPTIONS_BASE = {
  VERSION_TYPE: 'MAJOR',
  VERIFICATION_TYPE: 'Approved',
  WATER_MARK_TEXT: 'PUBLISHED',
} as const

// Record generation default options for purchase order
export const PURCHASE_ORDER_RECORD_GENERATION_OPTIONS = PURCHASE_RECORD_GENERATION_OPTIONS_BASE

export const VENDOR_AGREEMENT_CHECKLIST_RECORD_GENERATION_OPTIONS = PURCHASE_RECORD_GENERATION_OPTIONS_BASE

// Title mapping for each form
export const FORM_TITLES: Record<string, string> = {
  'vendor-agreement': 'OutSource Vendor Agreement',
  'outsource-vendor-agreement': 'OutSource Vendor Agreement',
  'vendor-agreement-checklist': 'Vendor Agreement Checklist',
  'purchase-order': 'Purchase Order',
}