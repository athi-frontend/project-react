/**
 * Classification : Confidential
 **/

import { CustomerFeedbackFormData } from '@/types/modules/sales/customerFeedback';
import { BASE_SALES_API } from './common';

export const DEFAULT_CUSTOMER_FEEDBACK_FORM: CustomerFeedbackFormData = {
  documents: [],
  productGroup: '',
  productCategory: '',
  productType: '',
  productSubtype: '',
  productName: '',
  customerName: '',
  orderNo: '',
  productSerialNo: '',
  dateOfInstallation: null,
  source: '',
  feedbackDate: null,
  capturedBy: '',
  feedback: '',
  status_id: null,
};

export const CUSTOMER_FEEDBACK_TABLE_COLUMNS = {
  SERIAL_NO: 'sno',
  PRODUCT_TYPE: 'product_type',
  PRODUCT_SUB_TYPE: 'product_sub_type',
  PRODUCT_NAME: 'product_name',
  CUSTOMER_NAME: 'customer_name',
  STATUS: 'status_id',
  ACTIONS: 'actions',
} as const

export const CUSTOMER_FEEDBACK_TABLE_HEADERS = {
  SERIAL_NO: 'S.No.',
  PRODUCT_TYPE: 'Product Type',
  PRODUCT_SUB_TYPE: 'Product Sub Type',
  PRODUCT_NAME: 'Product Name',
  CUSTOMER_NAME: 'Customer Name',
  STATUS: 'Status',
  ACTIONS: 'Actions',
} as const

export const CUSTOMER_FEEDBACK_LABELS = {
  CUSTOMER_FEEDBACK_LIST: 'List Customer Feedback',
  ADD_CUSTOMER_FEEDBACK: 'Add Customer Feedback',
} as const

export const CUSTOMER_FEEDBACK = {
  TITLE: 'Customer Feedback',
  CUSTOMER_FEEDBACK_API_ENDPOINTS: {
    GET_CUSTOMER_FEEDBACK_LIST: `${BASE_SALES_API}/customer-feedback/all`,
    GET_CUSTOMER_FEEDBACK_BY_ID: `${BASE_SALES_API}/customer-feedback`,
    DELETE_CUSTOMER_FEEDBACK: `${BASE_SALES_API}/customer-feedback`,
  },
  CUSTOMER_FEEDBACK_API_KEYS: {
    FETCH_CUSTOMER_FEEDBACK_LIST_KEY: 'fetchCustomerFeedbackList',
    FETCH_CUSTOMER_FEEDBACK_BY_ID_KEY: 'fetchCustomerFeedbackById',
    FETCH_ORDER_ACKNOWLEDGEMENT_LIST_KEY: 'fetchOrderAcknowledgementList',
    FETCH_ORDER_APPROVAL_MODE_LIST_KEY: 'fetchOrderApprovalModeList',
    FETCH_CUSTOMER_LIST_KEY: 'fetchCustomerList',
    FETCH_EMPLOYEE_LIST_KEY: 'fetchEmployeeList',
    FETCH_PRODUCT_GROUP_LIST_KEY: 'fetchProductGroupList',
    FETCH_PRODUCT_CATEGORY_LIST_KEY: 'fetchProductCategoryList',
    FETCH_PRODUCT_TYPE_LIST_KEY: 'fetchProductTypeList',
    FETCH_PRODUCT_SUBTYPE_LIST_KEY: 'fetchProductSubTypeList',
    FETCH_PRODUCT_LIST_KEY: 'fetchProductList',
    FETCH_CUSTOMER_FEEDBACK_CRITERIA_KEY: 'fetchCustomerFeedbackCriteria',
    FETCH_RATING_LIST_KEY: 'fetchRatingList',
  },
  BUTTON_ATTRIBUTES: {
    LABEL: 'edit',
    ICON_COLOR: 'primary',
    EDIT_COLOR: 'currentColor',
  },
} as const

export const CUSTOMER_FEEDBACK_VALIDATION = {
  PRODUCT_GROUP_REQUIRED: 'Product Group is required',
  PRODUCT_CATEGORY_REQUIRED: 'Product Category is required',
  PRODUCT_TYPE_REQUIRED: 'Product Type is required',
  PRODUCT_SUBTYPE_REQUIRED: 'Product Subtype is required',
  PRODUCT_NAME_REQUIRED: 'Product Name is required',
  CUSTOMER_NAME_REQUIRED: 'Customer Name is required',
  ORDER_NO_REQUIRED: 'Order No. is required',
  PRODUCT_SERIAL_REQUIRED: 'Product Serial No is required',
  INSTALLATION_DATE_REQUIRED: 'Date of Installation is required',
  SOURCE_REQUIRED: 'Source is required',
  FEEDBACK_DATE_REQUIRED: 'Feedback Date is required',
  FEEDBACK_DATE_BEFORE_INSTALL: 'Feedback Date cannot be earlier than Date of Installation',
  CAPTURED_BY_REQUIRED: 'Captured By is required',
  STATUS_REQUIRED: 'Status is required',
  FILE_UPLOAD_REQUIRED: 'File upload is required',
  CRITERIA_RATING_REQUIRED: 'Please select a rating for all criteria',
  PRODUCT_DETAILS_REQUIRED: 'At least one Product Details Feedback entry is required',
} as const

// UI field configs for Customer Feedback page
export const CUSTOMER_FEEDBACK_FIELDS = {
  PRODUCT_GROUP: {
    label: 'Product Group*',
    placeholder: 'Select Product Group',
    keyField: 'product_group_id',
    valueField: 'product_group',
  },
  PRODUCT_CATEGORY: {
    label: 'Product Category*',
    placeholder: 'Select Product Category',
    keyField: 'product_category_id',
    valueField: 'product_category',
  },
  PRODUCT_TYPE: {
    label: 'Product Type*',
    placeholder: 'Select Product Type',
    keyField: 'product_type_id',
    valueField: 'product_type',
  },
  PRODUCT_SUBTYPE: {
    label: 'Product Subtype*',
    placeholder: 'Select Product Subtype',
    keyField: 'product_sub_type_id',
    valueField: 'product_sub_type',
  },
  PRODUCT_NAME: {
    label: 'Product Name*',
    placeholder: 'Select Product Name',
    keyField: 'product_id',
    valueField: 'product_name',
  },
  CUSTOMER_NAME: {
    label: 'Customer Name*',
    placeholder: 'Select Customer Name',
    keyField: 'customer_id',
    valueField: 'customer_name',
  },
  ORDER_NO: {
    label: 'Order No.*',
    placeholder: 'Select Order No.',
    keyField: 'order_acknowledgement_id',
    valueField: 'order_number',
  },
  PRODUCT_SERIAL_NO: {
    label: 'Product Serial No.*',
    placeholder: 'Enter S.No.',
  },
  DATE_OF_INSTALLATION: {
    label: 'Date of Installation*',
  },
  SOURCE: {
    label: 'Source*',
    placeholder: 'Select Source',
    keyField: 'approval_mode_id',
    valueField: 'approval_mode_name',
  },
  FEEDBACK_DATE: {
    label: 'Feedback Date*',
  },
  STATUS: {
    label: 'Status*',
    placeholder: 'Select Status',
    keyField: 'status_id',
    valueField: 'status_name',
  },
  CAPTURED_BY: {
    label: 'Captured By*',
    placeholder: 'Select Captured By',
    keyField: 'id',
    valueField: 'employee_name',
  },
  FEEDBACK: {
    label: 'Feedback',
    placeholder: 'Input Text',
  },
  SUBHEADER_CRITERIA: 'Customer Feedback Criteria',
  SUBHEADER_UPLOAD: 'Upload Feedback Form*',
} as const

// Page titles and table configs
export const CUSTOMER_FEEDBACK_PAGE = {
  ADD_TITLE: 'Add Customer Feedback Criteria',
  EDIT_TITLE: 'Edit Customer Feedback Criteria',
} as const

export const CUSTOMER_FEEDBACK_TABLE_CONFIG = {
  FEEDBACK_CRITERIA: {
    ID_FIELD: 'id',
  },
  PRODUCT_DETAILS: {
    ID_FIELD: 'id',
    TITLE: 'Product Details Feedback',
  },
} as const

export const CUSTOMER_FEEDBACK_DETAIL_TABLE_COLUMNS = {
  SERIAL_NO: 'serialNo',
  CRITERIA: 'criteria',
  NAME: 'name',
  ROLE: 'role',
  ACTIONS: 'actions',
} as const

export const CUSTOMER_FEEDBACK_DETAIL_TABLE_HEADERS = {
  SERIAL_NO: 'S.No.',
  CRITERIA: 'Criteria',
  NAME: 'Name',
  ROLE: 'Role',
  ACTIONS: 'Actions',
} as const

export const CUSTOMER_FEEDBACK_BUTTON_LABELS = {
  CANCEL: 'Cancel',
  SAVE: 'Save',
} as const

export const CUSTOMER_FEEDBACK_TABLE_ALIGNMENT = {
  CENTER: 'center',
} as const

export const CUSTOMER_FEEDBACK_MODALS = {
  PRODUCT_DETAILS: {
    ADD_TITLE: 'Add Product Details Feedback',
    EDIT_TITLE: 'Edit Product Details',
  },
} as const

// Routes and table keys
export const CUSTOMER_FEEDBACK_ROUTES = {
  LIST: '/sales/customer-feedback',
  CREATE: '/sales/customer-feedback/create',
  DETAIL_BASE: '/sales/customer-feedback',
} as const

export const CUSTOMER_FEEDBACK_TABLE_KEYS = {
  ID_FIELD: 'customer_feedback_id',
} as const

export const CUSTOMER_FEEDBACK_MODE = {
  CREATE: 'create',
} as const

 
