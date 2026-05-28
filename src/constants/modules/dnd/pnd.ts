import { NUMBERMAP } from "@/constants/common"

export const PND_QUERY_KEYS = {
  CATEGORY_LIST_QUERY_KEY: 'productCategoryList',
  PND_FETCH_QUERY_KEY: 'pndFetch',
  PND_SPECIFICATION_FETCH_QUERY_KEY: 'pndSpecificationFetch',
  END_USER_LIST_QUERY_KEY: 'endUserList',
  BUYER_LIST_QUERY_KEY: 'buyerList',
}

export const EXCEL_TYPES = {
  EXCEL_1 :'.xlsx',
  EXCEL_2 : '.xls',
}

export const PND_API_ENDPOINTS = {
  GET_PRODUCT_CATEGORY: `api/v1/dnd/product-category/all`,
  GET_END_USER: `api/v1/organization/end-user/all`,
  GET_BUYER: `api/v1/organization/buyer/all`,
  FETCH_PND: (projectId: number) => `api/v1/dnd/product-need-document/${projectId}`,
  SUBMIT_PND: 'api/v1/dnd/product-need-document/',
  FETCH_PND_SPECIFICATION: (projectId: number) =>
    `api/v1/dnd/product-need-document/pnd-specification/all/${projectId}`,
  CREATE_PND_SPECIFICATION: 'api/v1/dnd/product-need-document/pnd-specification/',
  UPDATE_DELETE_PND_SPECIFICATION: (pndSpecificationId: number) =>
    `api/v1/dnd/product-need-document/${pndSpecificationId}`,
  TEMPLATE_DOWNLOAD: (mediaId: number) =>
    `api/v1/dms/assets/download/${mediaId}`,
}
export const PATH_TO_PRP = (projectId:number)=> `/project-details/product-realization-plan/${projectId}`
export const SUCCESS = 'success'
export const FAILED = 'failed'
export const DELETE = 'delete'

export const PND_MODAL_TEXTS = {
  ADD_TITLE: 'Add New Specification',
  EDIT_TITLE: 'Edit Specification',
  PARAMETER_LABEL: 'Parameter*',
  PARAMETER_REQUIRED: 'Parameter is required',
  SPECIFICATION_LABEL: 'Specification*',
  SPECIFICATION_REQUIRED: 'Specification is required',
  PARAMETER_LABEL_PLACEHOLDER: 'Enter Parameter',
  SPECIFICATION_LABEL_PLACEHOLDER: 'Enter Specification',
  CANCEL_BUTTON: 'Cancel',
  SAVE_BUTTON: 'Save',
}

export const PND_FORM_LABELS = {
  GENERIC_PRODUCT_NAME: 'Generic Name of Product*',
  GMDN_CODE: 'GMDN Code*',
  EMDN_CODE: 'EMDN Code',
  ABBREVIATION: 'Abbreviation*',
  INTENDED_USE: 'Intended Use of Project*',
  DEVELOPMENT_COST: 'Development Cost*',
  APPLICATION_OF_PRODUCT: 'Application of Product*',
  BUYER: 'Buyer*',
  END_USER: 'End User*',
  COMPETITOR_INFORMATION: 'Competitor Information*',
  PRODUCT_FEATURES: 'Product Features*',
  SERVICE_REQUIREMENTS: 'Service Requirements',
  PACKAGING_REQUIREMENTS: 'Packaging Requirements',
  DELIVERY_REQUIREMENTS: 'Delivery Requirements',
  POST_DELIVERY_REQUIREMENTS: 'Post Delivery Requirements',
  ENVIRONMENTAL_REQUIREMENTS: 'Environmental Requirements',
  DOCUMENTATION_REQUIREMENTS: 'Documentation Requirements',
  TARGET_SELLING_PRICE: 'Target Selling Price',
  QUANTITY_FORECAST: 'Quantity Forecast (3 Years)',
  TARGET_TIMELINE: 'Target Timeline for Product Launch',
  DOCUMENTS_TO_CREATE: 'documents_to_create',
  FILE_UPLOAD: 'File Upload',
}

export const PND_FORM_PLACEHOLDERS = {
  GENERIC_PRODUCT_NAME: 'Enter Generic Name of Product',
  GMDN_CODE: 'Enter GMDN Code',
  EMDN_CODE: 'Enter EMDN Code',
  ABBREVIATION: 'Enter Abbreviation',
  INTENDED_USE: 'Enter Intended Use of Product',
  DEVELOPMENT_COST: 'Enter Development Cost',
  APPLICATION_OF_PRODUCT: 'Enter Application of Product',
  BUYER: 'Select Buyer',
  END_USER: 'Select End User',
  COMPETITOR_INFORMATION: 'Enter Competitor Information',
  PRODUCT_FEATURES: 'Enter Product Features',
  SERVICE_REQUIREMENTS: 'Enter Service Requirements',
  PACKAGING_REQUIREMENTS: 'Enter Packaging Requirements',
  DELIVERY_REQUIREMENTS: 'Enter Delivery Requirements',
  POST_DELIVERY_REQUIREMENTS: 'Enter Post Delivery Requirements',
  ENVIRONMENTAL_REQUIREMENTS: 'Enter Environmental Requirements',
  DOCUMENTATION_REQUIREMENTS: 'Enter Documentation Requirements',
  TARGET_SELLING_PRICE: 'Enter Target Selling Price',
  QUANTITY_FORECAST: 'Enter Quantity Forecast (3 Years)',
  TARGET_TIMELINE: 'Enter Target Timeline for Product Launch',
}

export const PND_BUTTON_LABELS = {
  CANCEL: 'Cancel',
  SAVE: 'Save',
  SUBMIT: 'Send for Review',
  APPROVAL: 'Send for Approval',
  APPROVE: 'Approve',
  REJECT: 'Reject',
  DOWNLOAD_TEMPLATE: 'Download Template',
  UPLOAD_SPECIFICATIONS: 'Upload Specifications',
  ADD_NEW: 'Add New',
}

export const GENERIC_PRODUCT_NAME = 'product_generic_name'
export const GMDN_CODE = 'gmdn_code'
export const EMDN_CODE = 'emdn_code'
export const ABBREVIATION = 'abbreviation'
export const PRODUCT_INTENDED_USE = 'intended_use_of_product'
export const DEVELOPMENT_COST = 'development_cost'
export const APPLICATION_OF_PRODUCT = 'application_of_product'
export const BUYER_ID = 'buyer_id'
export const END_USER_ID = 'end_user_id'
export const COMPETITOR_INFORMATION = 'competitor_information'
export const PRODUCT_FEATURES = 'product_features'
export const PRODUCT_CATEGORY_ID = 'product_category_id'
export const SERVICE_REQUIREMENTS = 'service_requirements'
export const PACKAGING_REQUIREMENTS = 'packaging_requirements'
export const DELIVERY_REQUIREMENTS = 'delivery_requirements'
export const POST_DELIVERY_REQUIREMENTS = 'post_delivery_requirements'
export const ENVIRONMENTAL_REQUIREMENTS = 'environmental_requirements'
export const DOCUMENTATION_REQUIREMENTS = 'documentation_requirements'
export const TARGET_SELLING_PRICE = 'target_selling_price'
export const QUANTITY_FORECAST = 'quantity_forecast'
export const TARGET_PRODUCT_LAUNCH_TIME_LINE = 'target_product_launch_time_line'

export const PND_FORM = {
  PND_SPECIFICATIONS_TITLE: 'Technical Specifications',
  PND_MODEL_DETAILS_TITLE: 'Model Details',
  PND_MODEL: 'Model*',
  FILE_INPUT_ID: 'specification-file-upload',
  ACCEPTED_FILE_FORMAT: '.xlsx,.xls',
  PND_SPECIFICATION_TEMPLATE_DOCUMENT_MEDIA_ID: '12345',
  PND_SPECIFICATION_TEMPLATE_FILE_NAME: 'pnd_specification_template.xlsx',
  DOCUMENTS: 'documents',
  APPROVED: 'approved',
}

export const PND_FIELD_IDS = {
  MODELS: 'pnd-model-section',
}

export const PND_MODEL_MODAL_TEXTS = {
  ADD_TITLE: 'Model',
  EDIT_TITLE: 'Edit Model',
  MODEL_NAME_LABEL: 'Model Name*',
  MODEL_NAME_PLACEHOLDER: 'Enter Model Name',
  MODEL_NUMBER_LABEL: 'Model Number*',
  MODEL_NUMBER_PLACEHOLDER: 'Enter Model Number',
  DESCRIPTION_LABEL: 'Description',
  DESCRIPTION_PLACEHOLDER: 'Enter Description',
  MODEL_NAME_REQUIRED: 'Model Name is required',
  MODEL_NUMBER_REQUIRED: 'Model Number is required',
  BASE_MODEL_LABEL: 'Base Model*',
  BASE_MODEL_REQUIRED: 'Base Model selection is required',
  STATUS_LABEL: 'Status*',
  STATUS_PLACEHOLDER: 'Select Status',
  STATUS_REQUIRED: 'Status is required',
  CANCEL_BUTTON: 'Cancel',
  SAVE_BUTTON: 'Save',
}

// New constants for strings and error messages
export const PND_ERROR_MESSAGES = {
  FILE_SELECTION_ERROR: 'Please select a file',
  EXCEL_FILE_ERROR: 'Please upload an Excel file (.xlsx or .xls)',
  EMPTY_FILE_ERROR: 'The Excel file is empty. The file should have "Parameter" and "Specification" headers',
  FILE_DATA_MISSING_ERROR : 'The Excel file does not have "Parameter" and "Specification" data.',
  INVALID_HEADERS_ERROR: 'Excel file must have "Parameter" and "Specification" headers',
  FILE_READ_ERROR: 'Failed to read the Excel file. Please try again.',
  FILE_PROCESS_ERROR: 'Failed to process file. Please try again.',
  SPECIFICATION_VALIDATION_ERROR: 'Parameter and Specification are required',
  DUPLICATE_PARAMETER_ERROR: 'Parameter already exists',
  MODEL_VALIDATION_ERROR: 'Model Name and Model Number are required',
  REVIEWER_ERROR: 'Reviewer is current user',
  FORM_SUBMISSION_ERROR: 'Form submission failed',
  SPECIFICATION_CREATE_ERROR: 'Failed to create specification',
  SPECIFICATION_UPDATE_ERROR: 'Failed to update specification',
  SPECIFICATION_DELETE_ERROR: 'Failed to delete specification',
  MODELS_ERROR : 'Model specification is required'
}

export const PND_EXCEL_CONSTANTS = {
  PARAMETER_HEADER: 'Parameter',
  SPECIFICATION_HEADER: 'Specification',
  MIN_HEADERS_COUNT: 2,
  PARAMETER_INDEX: 0,
  SPECIFICATION_INDEX: 1,
}

export const PND_FORM_STATUS = {
  SUBMITTED: 'submitted',
  DRAFT: 'draft',
}

export const PND_REQUIREMENT_TYPES = {
  TEXT: 'text',
  BUYER_CHOSEN: 'buyer_chosen',
  END_USER_CHOSEN: 'end_user_chosen',
}

export const PND_SPECIFICATION_TYPES = {
  NEW: 'New',
  EDITED: 'Edited',
  DELETED: 'Deleted',
}

export const PND_TEMP_ID_PREFIX = 'temp_'
export const PND_SPEC_ID_PREFIX = 'spec_'

export const PND_FORM_KEYS ={
  BUYER:"buyer",
  BUYER_ID:"buyer_id",
  PRODUCT_CATEGORY:"product_category",
  PRODUCT_CATEGORY_ID:"product_category_id",
  ENDUSER :"end_user",
  END_USER_ID:"end_user_id",
  QFY :"quantity_forecast_3_years",
  TTFPL:"target_timeline_for_product_launch",
  QFYK:"quantity_forecast",
  TPLTL:"target_product_launch_time_line"
}

export const PND_REQUIRED_FIELDS = [
  'product_generic_name',
  'gmdn_code',
  'abbreviation',
  'intended_use_of_product',
  'development_cost',
  'application_of_product',
  'buyer_id',
  'end_user_id',
  'competitor_information',
  'product_features'
] as const

export const PND_MODEL_SPECIFICATION_COLUMNS = {
  SNO: {
    field: 'sno',
    headerName: 'S.No.',
    flex: NUMBERMAP.HALF,
    sortable: false,
  },
  MODEL_NAME: {
    field: 'modelName',
    headerName: 'Model Name',
    flex: NUMBERMAP.ONE_HALF,
  },
  MODEL_NUMBER: {
    field: 'modelNumber',
    headerName: 'Model No.',
    flex: NUMBERMAP.ONE_HALF,
  },
  BASE_MODEL: {
    field: 'baseModel',
    headerName: 'Base Model',
    flex: NUMBERMAP.ONE,
  },
  STATUS: {
    field: 'status',
    headerName: 'Status',
    flex: NUMBERMAP.ONE,
  },
  ACTIONS: {
    field: 'actions',
    headerName: 'Actions',
    flex: NUMBERMAP.ONE,
    sortable: false,
  },
}

export const PND_SPECIFICATION_COLUMNS = {
  SNO: {
    field: 'sno',
    headerName: 'S.No.',
    flex: NUMBERMAP.HALF,
    sortable: false,
  },
  PARAMETER: {
    field: 'parameter',
    headerName: 'Parameter',
    flex: NUMBERMAP.ONE,
  },
  SPECIFICATION: {
    field: 'specification',
    headerName: 'Technical Specifications',
    flex: NUMBERMAP.ONE_HALF,
  },
  ACTIONS: {
    field: 'actions',
    headerName: 'Actions',
    flex: NUMBERMAP.HALF,
    sortable: false,
  },
}

export  const FIELD_LABEL_MAP = {
    product_generic_name: PND_FORM_LABELS.GENERIC_PRODUCT_NAME,
    gmdn_code: PND_FORM_LABELS.GMDN_CODE,
    abbreviation: PND_FORM_LABELS.ABBREVIATION,
    intended_use_of_product: PND_FORM_LABELS.INTENDED_USE,
    development_cost: PND_FORM_LABELS.DEVELOPMENT_COST,
    application_of_product: PND_FORM_LABELS.APPLICATION_OF_PRODUCT,
    buyer_id: PND_FORM_LABELS.BUYER,
    end_user_id: PND_FORM_LABELS.END_USER,
    competitor_information: PND_FORM_LABELS.COMPETITOR_INFORMATION,
    product_features: PND_FORM_LABELS.PRODUCT_FEATURES,
    models: PND_FIELD_IDS.MODELS,
  }

export const FIELD_ORDER = Object.keys(FIELD_LABEL_MAP)
  

export const PND_VALIDATION_VALUES = {
  HAS_DATA: 'hasData',
  EMPTY: ''
}

