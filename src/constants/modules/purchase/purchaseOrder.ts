/**
*Classification : Confidential
**/
export const PURCHASE_ORDERS_LIST_KEY = 'fetchPurchaseOrdersList';

// Base URL for purchase order APIs
const PURCHASE_BASE_URL = 'api/v1/vendor-purchase';
const PURCHASE_ORDER_BASE_URL = `${PURCHASE_BASE_URL}/purchase-order`;

// API Endpoints
export const API_ENDPOINTS = {
  FETCH_PURCHASE_ORDERS: `${PURCHASE_ORDER_BASE_URL}/all`,
  FETCH_PURCHASE_ORDER: (purchase_order_id: number) =>
    `${PURCHASE_ORDER_BASE_URL}/${purchase_order_id}`,
  DELETE_PURCHASE_ORDER: (purchase_order_id: number) =>
    `${PURCHASE_ORDER_BASE_URL}/${purchase_order_id}`,
  FETCH_ORDER_TYPES: `${PURCHASE_ORDER_BASE_URL}/order-type/all`,
  FETCH_PART_NUMBERS : (id: number) =>   `${PURCHASE_BASE_URL}/part-numbers/all?status=1&vendor_id=${id}`,
  POST_PURCHASE_ORDER: `${PURCHASE_ORDER_BASE_URL}/`,
  FETCH_PURCHASE_INFORMATION: `${PURCHASE_BASE_URL}/purchasing-information/all`,
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
export const SNO_VALUE = 'sno'
export const VENDOR_TYPE_VALUE = 'vendor_type'
export const VENDOR_NAME_VALUE = 'vendor_name'
export const PO_NUMBER_VALUE = 'purchase_order_number'
export const PO_DATE_VALUE = 'purchase_order_date'
export const STATUS_VALUE = 'status'
export const ACTIONS_VALUE = 'id'

// Form Constants
export const FORM_TITLE = 'Purchase Order'
export const PURCHASE_ORDER_ID = 'purchase_order_id'


// Validation Messages
export const VALIDATION_MESSAGES = {
  orderTypeId: 'Order Type is required',
  vendorType: 'Vendor Type is required',
  infrastructureRequestId: 'Infrastructure Request ID is required',
  vendorName: 'Vendor Name is required',
  purchaseOrderDate: 'Purchase Order Date is required',
  purchaseOrderNumber: 'Purchase Order Number is required',
  PART_DETAILS_REQUIRED: 'At least one Part Detail is required',
  INFRASTRUCTURE_DETAILS_REQUIRED: 'At least one Infrastructure Detail is required',
  qtnRef: 'QTN REF is required',
  tentativeDate: 'Tentative Date is required',
  invoiceLocation: 'Invoice Location is required',
  invoiceAddress: 'Invoice Address is required',
  shipToContactPerson: 'Ship To Contact Person is required',
  shipToAddress: 'Ship To Address is required',
  shipToLocation: 'Ship To Location is required',
  PART_NUMBER_REQUIRED: 'Part Number is required',
  QUANTITY_REQUIRED: 'Quantity is required',
  QUANTITY_INVALID: 'Quantity must be a valid positive number',
  UNIT_RATE_REQUIRED: 'Unit Rate is required',
  UNIT_RATE_INVALID: 'Unit Rate must be a valid positive number',
  PRICE_REQUIRED: 'Price is required',
  PRICE_INVALID: 'Price must be a valid positive number',
  status: 'Status is required',
  FILE_UPLOAD_REQUIRED: 'File Upload is required',
}

// FormData Field Names
export const FORM_DATA_FIELDS = {
  PURCHASE_ORDER_ID: 'purchase_order_id',
  ORDER_TYPE_ID: 'order_type_id',
  ORDER_TYPE: 'order_type',
  VENDOR_ID: 'vendor_id',
  INVOICE_LOCATION: 'invoice_location',
  CREATE_META_DATA: 'create_meta_data',
  UPDATE_META_DATA: 'update_meta_data',
  DOCUMENTS_TO_DELETE: 'documents_to_delete',
  SHIP_TO_CONTACT_PERSON: 'ship_to_contact_person',
  SHIP_TO_ADDRESS: 'ship_to_address',
  SHIP_TO_LOCATION: 'ship_to_location',
  REMARKS: 'remarks',
  QTN_REF: 'qtn_ref',
  TENTATIVE_DATE: 'tentative_date',
  INVOICE_ADDRESS: 'invoice_address',
  PURCHASE_ORDER_NUMBER: 'purchase_order_number',
  PURCHASE_ORDER_DATE: 'purchase_order_date',
  PART_DETAILS: 'part_details',
  TOTAL_EX_WORK: 'total_ex_work',
  PACKAGING_AND_TRANSPORT: 'packaging_and_transport',
  SUB_TOTAL: 'sub_total',
  GST: 'gst',
  TOTAL: 'total',
  STATUS_ID: 'status_id',
  INFRASTRUCTURE_REQUEST_ID: 'infrastructure_request_id',
  PURCHASE_INFRASTRUCTURE_REQUEST_ID: 'purchase_infrastructure_request_id',
  PURCHASE_REQUISITION_ID: 'purchase_requisition_id',
}

// Part Details Table Field Names
export const PART_DETAILS_FIELDS = {
  SNO: 'sno',
  PART_NUMBER: 'part_number',
  QUANTITY: 'quantity',
  UNIT_RATE: 'unit_rate',
  PRICE: 'price',
  STATUS: 'status',
  ACTION: 'action',
  EXPECTED_DATE_OF_DELIVERY: 'expected_date_of_delivery',
}

// Part Details Table Headers
export const PART_DETAILS_HEADERS = {
  SNO: 'S.No.',
  PART_NUMBER: 'Part Number',
  QUANTITY: 'Quantity',
  UNIT_RATE: 'Unit Rate',
  PRICE: 'Price',
  STATUS: 'Status',
  ACTION: 'Action',
  EXPECTED_DATE_OF_DELIVERY: 'Expected Date of Delivery',
}

// Form Labels
export const FORM_LABELS = {
  ORDER_TYPE: 'Order Type*',
  VENDOR_TYPE: 'Vendor Type*',
  VENDOR_NAME: 'Vendor Name*',
  PURCHASE_ORDER_DATE: 'Purchase Order Date*',
  PURCHASE_ORDER_NUMBER: 'Purchase Order Number*',
  QTN_REF: 'QTN REF*',
  TENTATIVE_DATE: 'Tentative Date of Delivery*',
  INVOICE_LOCATION: 'Invoice Location*',
  INVOICE_ADDRESS: 'Invoice Address*',
  ADDRESS: 'Address*',
  SHIP_TO_CONTACT_PERSON: 'Ship To Contact Person*',
  SHIP_TO_ADDRESS: 'Ship To Address*',
  SHIP_TO_LOCATION: 'Ship To Location*',
  REMARKS: 'Remarks',
  PART_NUMBER: 'Part Number*',
  QUANTITY: 'Quantity*',
  UNIT_RATE: 'Unit Rate*',
  PRICE: 'Price*',
  STATUS: 'Status*',
  TOTAL_EX_WORK: 'Total Ex Work',
  PACKAGING_AND_TRANSPORT: 'Packaging and Transport',
  SUB_TOTAL: 'Sub Total',
  GST: 'GST',
  TOTAL: 'Total',
}

// Form Placeholders
export const FORM_PLACEHOLDERS = {
  SELECT_ORDER_TYPE: 'Select Order Type',
  SELECT_VENDOR_TYPE: 'Select Vendor Type',
  SELECT_VENDOR_NAME: 'Select Vendor Name',
  SELECT_VENDOR_NAME_DISABLED: 'Please select Vendor Type first',
  ENTER_PURCHASE_ORDER_NUMBER: 'Enter Purchase Order Number',
  ENTER_QTN_REF: 'Enter QTN REF',
  ENTER_INVOICE_LOCATION: 'Enter Invoice Location',
  ENTER_INVOICE_ADDRESS: 'Enter Invoice Address',
  ENTER_ADDRESS: 'Enter Address',
  ENTER_SHIP_TO_CONTACT_PERSON: 'Enter Ship To Contact Person',
  ENTER_SHIP_TO_ADDRESS: 'Enter Ship To Address',
  ENTER_SHIP_TO_LOCATION: 'Enter Ship To Location',
  ENTER_REMARKS: 'Enter Remarks',
  SELECT_PART_NUMBER: 'Select Part Number',
  SELECT_STATUS: 'Select Status',
  ENTER_QUANTITY: 'Enter Quantity',
  ENTER_UNIT_RATE: 'Enter Unit Rate',
  ENTER_PRICE: 'Enter Price',
}

// Form Field Names
export const FORM_FIELD_NAMES = {
  VENDOR_TYPE_NAME: 'vendor_type_name',
  VENDOR_NAME: 'vendor_name',
  ID: 'id',
  ORDER_TYPE_NAME: 'order_type_name',
  PART_NUMBER: 'part_number',
  STATUS_NAME: 'status_name',
  STATUS_ID: 'status_id',
}

// Form Field Keys (for form data keys)
export const FORM_FIELD_KEYS = {
  ORDER_TYPE: 'orderTypeId',
  VENDOR_TYPE: 'vendorType',
  VENDOR_NAME: 'vendorName',
  VENDOR_ID: 'vendorId',
  PURCHASE_ORDER_NUMBER: 'purchaseOrderNumber',
  PURCHASE_ORDER_DATE: 'purchaseOrderDate',
  QTN_REF: 'qtnRef',
  TENTATIVE_DATE: 'tentativeDate',
  INVOICE_LOCATION: 'invoiceLocation',
  INVOICE_ADDRESS: 'invoiceAddress',
  SHIP_TO_CONTACT_PERSON: 'shipToContactPerson',
  SHIP_TO_ADDRESS: 'shipToAddress',
  SHIP_TO_LOCATION: 'shipToLocation',
  REMARKS: 'remarks',
  PART_NUMBER: 'partNumber',
  QUANTITY: 'quantity',
  UNIT_RATE: 'unit_rate',
  PRICE: 'price',
  STATUS: 'status',
  TOTAL_EX_WORK: 'totalExWork',
  PACKAGING_AND_TRANSPORT: 'packagingAndTransport',
  SUB_TOTAL: 'subTotal',
  GST: 'gst',
  TOTAL: 'total',
}

// Page Titles and Headers
export const PAGE_TITLES = {
  EDIT_PURCHASE_ORDER: 'Edit Purchase Order',
  ADD_PURCHASE_ORDER: 'Add Purchase Order',
  PART_DETAILS: 'Part Details',
  INFRASTRUCTURE_DETAILS: 'Infrastructure Details',
  FILE_UPLOAD: 'File Upload*',
  EDIT_PART_DETAILS: 'Edit Part Details',
  ADD_PART_DETAILS: 'Add Part Details',
  INVOICE_TO: 'Invoice To',
  SHIPPING_TO: 'Shipping To',
  PART_ORDER: 'Part Order',
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

// Order Types
export const ORDER_TYPES = {
  INFRASTRUCTURE: 'infrastructure',
  PART: 'part',
} as const

// Routes
export const ROUTES = {
  PURCHASE_ORDERS_LIST: '/purchase/purchase-order',
}

// Paths
export const CREATE_PURCHASE_ORDER_PATH = '/purchase/purchase-order/create'
export const EDIT_PURCHASE_ORDER_PATH = (purchase_order_id: number) =>
  `/purchase/purchase-order/${purchase_order_id}`

// Query Keys
export const DELETE_PURCHASE_ORDER = 'deletePurchaseOrder'
export const FETCH_PURCHASE_ORDER = 'fetchPurchaseOrder'
export const FETCH_ORDER_TYPES = 'fetchOrderTypes'
export const FETCH_PART_NUMBERS = 'fetchPartNumbers'
export const POST_PURCHASE_ORDER = 'postPurchaseOrder'

// File Upload Constants
export const DOCUMENTS_TO_CREATE = 'documents_to_create'
export const DOCUMENTS_TO_DELETE = 'documents_to_delete'
export const CREATE_META_DATA = 'create_meta_data'
export const UPDATE_META_DATA = 'update_meta_data'

// Status Options
export const STATUS_OPTIONS = [
  { id: '1', name: 'Active' },
  { id: '0', name: 'Inactive' },
]

// Alert Messages
export const ALERT_MESSAGES = {
  PART_NUMBER_DUPLICATE_TITLE: 'Something Went Wrong',
  PART_NUMBER_DUPLICATE_TEXT: 'This part number already exists',
  PART_NUMBER_DUPLICATE_ICON: 'error',
}


