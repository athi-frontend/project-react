/**
*Classification : Confidential
**/
export const SAMPLE_ORDERS_LIST_KEY = 'fetchSampleOrdersList';

// Base URL for vendor management APIs
const VENDOR_BASE_URL = 'api/v1/vendor-purchase';

// API Endpoints
export const API_ENDPOINTS = {
  FETCH_SAMPLE_ORDERS: (status?: string) => {
    const baseUrl = `${VENDOR_BASE_URL}/sample-orders/all`;
    return status ? `${baseUrl}?status=${status}` : baseUrl;
  },
  FETCH_SAMPLE_ORDER: (sample_order_id: number) =>
    `${VENDOR_BASE_URL}/sample-orders/${sample_order_id}`,
  DELETE_SAMPLE_ORDER: (sample_order_id: number) =>
    `${VENDOR_BASE_URL}/sample-orders/${sample_order_id}`,
  FETCH_VENDOR_TYPES: `${VENDOR_BASE_URL}/vendor-types/all?status=1`,
  FETCH_VENDOR_LIST: `${VENDOR_BASE_URL}/vendor-list/all`,
  FETCH_PART_NUMBERS: `${VENDOR_BASE_URL}/part-numbers/all?status=1`,
  FETCH_PRODUCTS_BY_PART: (part_id: number) => `${VENDOR_BASE_URL}/product/part/${part_id}`,
  POST_SAMPLE_ORDER: `${VENDOR_BASE_URL}/sample-orders/`,
}

// Table Headers
export const HEADER_SNO = 'S.No.'
export const HEADER_VENDOR_TYPE = 'Vendor Type'
export const HEADER_VENDOR_NAME = 'Vendor Name'
export const HEADER_PO_NUMBER = 'PO Number'
export const HEADER_PO_DATE = 'PO Date'
export const HEADER_STATUS = 'Status'
export const HEADER_ACTIONS = 'Actions'

// Field Values
export const SAMPLE_ORDER_SNO_VALUE = 'sno'
export const SAMPLE_ORDER_VENDOR_TYPE_VALUE = 'vendor_type'
export const SAMPLE_ORDER_VENDOR_NAME_VALUE = 'vendor_name'
export const SAMPLE_ORDER_PO_NUMBER_VALUE = 'purchase_order_number'
export const SAMPLE_ORDER_PO_DATE_VALUE = 'purchase_order_date'
export const SAMPLE_ORDER_STATUS_VALUE = 'status'
export const SAMPLE_ORDER_ACTIONS_VALUE = 'id'

// Form Constants
export const FORM_TITLE = 'Sample Orders'
export const SAMPLE_ORDER_ID = 'sample_order_id'

// Validation Messages
export const VALIDATION_MESSAGES = {
  VENDOR_TYPE_REQUIRED: 'Vendor Type is required',
  VENDOR_NAME_REQUIRED: 'Vendor Name is required',
  PURCHASE_ORDER_DATE_REQUIRED: 'Purchase Order Date is required',
  PURCHASE_ORDER_NUMBER_REQUIRED: 'Purchase Order Number is required',
  PART_DETAILS_REQUIRED: 'At least one Part Detail is required',
  FILE_UPLOAD_REQUIRED: 'File Upload is required',
  PART_NUMBER_REQUIRED: 'Part Number is required',
  ORDER_QUANTITY_REQUIRED: 'Order Quantity is required',
  ORDER_QUANTITY_INVALID: 'Order Quantity must be a valid positive number',
  DUPLICATE_PART_NUMBER: 'This part number already exists. Please select a different part number.',
  STATUS_REQUIRED: 'Status is required',
}

// FormData Field Names
export const FORM_DATA_FIELDS = {
  SAMPLE_ORDER_ID: 'sample_order_id',
  VENDOR_ID: 'vendor_id',
  PURCHASE_ORDER_DATE: 'purchase_order_date',
  PURCHASE_ORDER_NUMBER: 'purchase_order_number',
  PART_DETAILS: 'part_details',
  DELETED_PART_IDS: 'deleted_part_ids',
  STATUS: 'status',
}

// Part Details Table Field Names
export const PART_DETAILS_FIELDS = {
  SNO: 'sno',
  PART_NUMBER: 'partNumber',
  ORDER_QUANTITY: 'orderQuantity',
  ACTION: 'action',
}

// Part Details Table Headers
export const PART_DETAILS_HEADERS = {
  SNO: 'S.No.',
  PART_NUMBER: 'Part Number',
  ORDER_QUANTITY: 'Order Quantity',
  ACTION: 'Action',
}

// Products Table Headers
export const PRODUCTS_HEADERS = {
  SNO: 'S.No.',
  PRODUCT_NAME: 'Product Name',
}

// Products Table Fields
export const PRODUCTS_FIELDS = {
  SNO: 'sno',
  PRODUCT_NAME: 'product_name',
}

// Form Labels
export const FORM_LABELS = {
  VENDOR_TYPE: 'Vendor Type*',
  VENDOR_NAME: 'Vendor Name*',
  PURCHASE_ORDER_DATE: 'Purchase Order Date*',
  PURCHASE_ORDER_NUMBER: 'Purchase Order Number*',
  PART_NUMBER: 'Part Number*',
  ORDER_QUANTITY: 'Order Quantity*',
  STATUS: 'Status*',
}

// Form Placeholders
export const FORM_PLACEHOLDERS = {
  SELECT_VENDOR_TYPE: 'Select Vendor Type',
  SELECT_VENDOR_NAME: 'Select Vendor Name',
  SELECT_VENDOR_NAME_DISABLED: 'Please select Vendor Type first',
  ENTER_PURCHASE_ORDER_NUMBER: 'Enter Purchase Order Number',
  SELECT_PART_NUMBER: 'Select Part Number',
  ENTER_ORDER_QUANTITY: 'Enter Order Quantity',
  SELECT_STATUS: 'Select Status',
}

// Form Field Names
export const FORM_FIELD_NAMES = {
  VENDOR_TYPE_NAME: 'vendor_type_name',
  VENDOR_NAME: 'vendor_name',
  PART_NUMBER: 'part_number',
  ID: 'id',
}

// Form Field Keys (for form data keys)
export const FORM_FIELD_KEYS = {
  PART_CATEGORY: 'partCategory',
  VENDOR_NAME: 'vendorName',
  PURCHASE_ORDER_NUMBER: 'purchaseOrderNumber',
  PART_NUMBER: 'partNumber',
  ORDER_QUANTITY: 'orderQuantity',
  STATUS: 'status',
}

// Page Titles and Headers
export const PAGE_TITLES = {
  EDIT_SAMPLE_PURCHASE_ORDER: 'Edit Sample Purchase Order',
  ADD_SAMPLE_PURCHASE_ORDER: 'Add Sample Purchase Order',
  PART_DETAILS: 'Part Details',
  FILE_UPLOAD: 'File Upload*',
  EDIT_PART_DETAILS: 'Edit Part Details',
  ADD_PART_DETAILS: 'Add Part Details',
  PRODUCTS: 'Products',
}

// Common Strings
export const COMMON_STRINGS = {
  OBJECT: 'object',
  NAME: 'name',
  DELETE: 'delete',
  CANCEL: 'Cancel',
  SAVE: 'Save',
  ID: 'id',
  STRING: 'string',
}

// Routes
export const ROUTES = {
  SAMPLE_ORDERS_LIST: '/vendor-management/sample-orders',
}

// Paths
export const CREATE_SAMPLE_ORDER_PATH = '/vendor-management/sample-orders/create'
export const EDIT_SAMPLE_ORDER_PATH = (sample_order_id: number) =>
  `/vendor-management/sample-orders/${sample_order_id}`

// Query Keys
export const DELETE_SAMPLE_ORDER = 'deleteSampleOrder'
export const FETCH_SAMPLE_ORDER = 'fetchSampleOrder'
export const FETCH_VENDOR_TYPES = 'fetchVendorTypes'
export const FETCH_VENDOR_LIST = 'fetchVendorList'
export const FETCH_PART_NUMBERS = 'fetchPartNumbers'
export const FETCH_PRODUCTS_BY_PART = 'fetchProductsByPart'
export const POST_SAMPLE_ORDER = 'postSampleOrder'

// File Upload Constants
export const DOCUMENTS_TO_CREATE = 'documents_to_create'
export const DOCUMENTS_TO_DELETE = 'documents_to_delete'
export const CREATE_META_DATA = 'create_meta_data'
export const UPDATE_META_DATA = 'update_meta_data'

// Status Dropdown Config
export const STATUS_DROPDOWN_CONFIG = {
  KEY_FIELD: 'status_id',
  VALUE_FIELD: 'status_name',
} as const
