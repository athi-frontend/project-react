/**
 * Classification: Confidential
 */

  import { NUMBERMAP } from '@/constants/common'
import { convertUtcToLocal } from '@/lib/utils/common'
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import type { SanitySpecificationFormErrors } from '@/types/modules/quality-control-management/sanitySpecificationChecklist'

export const PAGE_TITLE = 'Sanity Specification Checklist'
export const TABLE_TITLE = 'Specifications'
export const CREATE = 'create'

export const ROUTES = {
  CREATE: '/quality-control-management/sanity-specification-checklist/create',
  LIST: '/quality-control-management/sanity-specification-checklist',
  EDIT: (id: number) =>
    `/quality-control-management/sanity-specification-checklist/${id}`,
} as const

const BASE_API_PATH = '/api/v1/quality-control/sanity-specification-checklist'

export const API_ENDPOINTS = {
  FETCH_ALL: `${BASE_API_PATH}/all`,
  FETCH_BY_PURCHASE_ORDER_ID: (purchaseOrderId: number | null) =>
    `${BASE_API_PATH}/${purchaseOrderId}`,
  FETCH_ALL_GROUPS: `${BASE_API_PATH}/groups/all`,
  CREATE: `${BASE_API_PATH}/`,
  FETCH_BY_ID: (id: number | null) => `${BASE_API_PATH}/${id}`,
  DELETE: (id: number | null) => `${BASE_API_PATH}/${id}`,
} as const

export const QUERY_KEYS = {
  LIST: 'sanity-specification-checklist-list',
  FETCH_BY_PURCHASE_ORDER_ID:
    'sanity-specification-checklist-by-purchase-order-id',
  FETCH_ALL_GROUPS: 'sanity-specification-checklist-groups-all',
  FETCH_BY_ID: 'sanity-specification-checklist-by-id',
} as const

export const sanitySpecificationColumns: GridColDef[] = [
  {
    field: 'sno',
    headerName: 'S.No.',
    flex: NUMBERMAP.HALF,
  },
  {
    field: 'vendor_type',
    headerName: 'Vendor Type',
    flex: NUMBERMAP.ONE,
  },
  {
    field: 'vendor_name',
    headerName: 'Vendor Name',
    flex: NUMBERMAP.ONE,
  },
  {
    field: 'product_order_number',
    headerName: 'Purchase Order Number',
    flex: NUMBERMAP.ONE,
  },
  {
    field: 'puchase_order_date',
    headerName: 'Purchase Order Date',
    flex: NUMBERMAP.ONE,
    renderCell: (params: GridRenderCellParams) =>
      params.value ? convertUtcToLocal(params.value) : '',
  },
]

export const SANITY_SPECIFICATION_TABLE = {
  HEADER_NAME: {
    STATUS: 'Status',
    ACTIONS: 'Actions',
  },
  FIELD_NAMES: {
    STATUS: 'status_id',
    ACTIONS: 'actions',
  },
  IDFIELD: 'sanity_specification_checklist_id',
}

// Form Labels
export const FORM_LABELS = {
  VENDOR_TYPE: 'Vendor Type*',
  VENDOR_NAME: 'Vendor Name*',
  PURCHASE_ORDER_NUMBER: 'Purchase Order Number*',
  PURCHASE_ORDER_DATE: 'Purchase Order Date',
  GROUP_NAME: 'Group Name*',
  SPECIFICATION: 'Specification*',
  STATUS: 'Status*',
} as const

// Form Placeholders
export const FORM_PLACEHOLDERS = {
  VENDOR_TYPE: 'Select Vendor Type',
  VENDOR_NAME: 'Select Vendor Name',
  PURCHASE_ORDER_NUMBER: 'Select Purchase Order Number',
  GROUP_NAME: 'Select Group Name',
  SPECIFICATION: 'Enter Specifications',
  STATUS: 'Select Status',
} as const

// Validation Error Messages
export const VALIDATION_MESSAGES = {
  VENDOR_TYPE_REQUIRED: 'Vendor Type is required',
  VENDOR_NAME_REQUIRED: 'Vendor Name is required',
  STATUS: 'Status is required',

  PURCHASE_ORDER_NUMBER_REQUIRED: 'Purchase Order Number is required',
  GROUP_NAME_REQUIRED: 'Group Name is required',
  SPECIFICATION_REQUIRED: 'Specification is required',
  STATUS_REQUIRED: 'Status is required',
} as const

// Button Labels
export const BUTTON_LABELS = {
  SAVE: 'Save',
  CANCEL: 'Cancel',
} as const

// Page Titles
export const CREATE_PAGE_TITLE = 'Sanity Specification Checklist'

// Modal Titles
export const MODAL_TITLES = {
  ADD_SPECIFICATION: 'Add Specifications',
  EDIT_GROUP_NAME: 'Edit Group Name',
} as const

// Transform Configuration for data transformation
export const TRANSFORM_CONFIG = {
  groupIdField: 'group_id',
  groupNameField: 'group_value',
  groupOrderField: 'applicable_group_display_order',
  criteriaArrayField: 'specification_details',
  childIdField: 'specification_detail_id',
  childNameField: 'specification',
  childOrderField: 'specification_display_order',
  parentIdPrefix: 'parent_',
  childIdPrefix: 'child_',
  fieldMappings: {
    criteria: 'specification',
    category: 'group_value',
    status: 'status',
  },
} as const

export const MODAL_FORM_NAMES = {
  GROUP_ID: 'group_name_id',
  GROUP_NAME: 'group_name',
  SPECIFICATION: 'specification',
  STATUS_ID: 'status_id',
}

// Form Field Names
export const FORM_FIELD_NAMES = {
  VENDOR_TYPE: 'vendor_type_id',
  VENDOR_NAME: 'vendor_id',
  PURCHASE_ORDERS_ID:"purchase_order_id"
} as const

// Dropdown Field Mappings
export const DROPDOWN_FIELDS = {
  VENDOR_TYPE: {
    KEY_FIELD: 'id',
    VALUE_FIELD: 'vendor_type_name',
  },
  VENDOR_NAME: {
    KEY_FIELD: 'id',
    VALUE_FIELD: 'vendor_name',
  },
  PURCHASE_ORDER: {
    KEY_FIELD: 'purchase_order_id',
    VALUE_FIELD: 'purchase_order_number',
  },
  GROUP_NAME: {
    KEY_FIELD: 'group_id',
    VALUE_FIELD: 'group_name',
  },
  STATUS: {
    KEY_FIELD: 'status_id',
    VALUE_FIELD: 'status_name',
  },
} as const

// Required Fields for Validation
export const REQUIRED_FORM_FIELDS = [
  'vendor_type_id',
  'vendor_id',
  'purchase_order_id',
] as const

export const REQUIRED_SPEC_MODAL_FIELDS = [
  'group_name_id',
  'specification',
] as const

// Table Column Constants
export const TABLE_COLUMNS = {
  SNO: {
    FIELD: 'sno',
    HEADER_NAME: 'S.No.',
    FLEX: NUMBERMAP.HALF,
  },
  SPECIFICATION: {
    FIELD: 'criteria',
    HEADER_NAME: 'Specification',
    FLEX: NUMBERMAP.ONE_HALF,
  },
  STATUS: {
    FIELD: 'status_id',
    HEADER_NAME: 'Status',
    FLEX: NUMBERMAP.HALF,
  },
  ACTION: {
    FIELD: 'action',
    HEADER_NAME: 'Action',
    FLEX: NUMBERMAP.HALF,
  },
} as const

// Status values for delete disabled check
export const DELETE_DISABLED_STATUS = NUMBERMAP.TWO

// Initial Form Data
export const INITIAL_FORM_DATA = {
  vendor_type_id: '',
  vendor_id: '',
  purchase_order_number: '',
  purchase_order_date: '',
  purchase_order_id: '',
  status_id:''
} as const

// Initial Form Errors
export const INITIAL_FORM_ERRORS: SanitySpecificationFormErrors = {
  vendor_type_id: '',
  vendor_id: '',
  purchase_order_id: '',
  status_id:'',
  specifications: ''
}

// Initial Modal Data
export const INITIAL_MODAL_DATA = {
  group_name_id: '',
  specification: '',
  group_name: '',
  status_id: '',
} as const

// Initial Spec Errors
export const INITIAL_SPEC_ERRORS = {
  group_name_id: '',
  specification: '',
  status_id: '',
} as const
