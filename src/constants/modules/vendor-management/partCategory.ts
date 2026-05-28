/**
 * Classification: Confidential
 * Constants for Part Category module
 */

import { NUMBERMAP } from '@/constants/common'
import { GridColDef } from '@mui/x-data-grid'

export const FORM_LABELS = {
  PART_CATEGORY_TYPE: 'Part Category Type*',
  PART_CATEGORY_SUB_TYPE: 'Part Category Sub Type*',
  PRODUCT_CATEGORY_SUB_CLASS: 'Product Category Sub Class*',
  PART_CATEGORY_NAME: 'Part Category Name*',
  DESCRIPTION: 'Description',
  STATUS: 'Status*',
  DOCUMENTS: 'Documents',
} as const

export const FORM_PLACEHOLDERS = {
  PART_CATEGORY_TYPE: 'Select Part Category Type',
  PART_CATEGORY_SUB_TYPE: 'Select Part Category Sub Type',
  PRODUCT_CATEGORY_SUB_CLASS: 'Select Product Category Class',
  PART_CATEGORY_NAME: 'Enter Part Category Name',
  DESCRIPTION: 'Description',
  STATUS: 'Select Status',
  DOCUMENTS: 'Upload Documents',
} as const

export const FORM_FIELD_NAMES = {
  PART_CATEGORY_TYPE: 'partCategoryType',
  PART_CATEGORY_SUB_TYPE: 'partCategorySubType',
  PRODUCT_CATEGORY_SUB_CLASS: 'productCategorySubClass',
  PART_CATEGORY_NAME: 'partCategoryName',
  DESCRIPTION: 'description',
  STATUS: 'status_id',
  DOCUMENTS: 'documents',
} as const

export const BUTTON_LABELS = {
  SAVE: 'Save',
  CANCEL: 'Cancel',
  SUBMIT: 'Submit',
} as const

export const VALIDATION_MESSAGES = {
  PARTCATEGORYTYPE: 'Part Category Type is required',
  PARTCATEGORYSUBTYPE: 'Part Category Sub Type is required',
  PRODUCTCATEGORYSUBCLASS: 'Product Category Sub Class is required',
  PARTCATEGORYNAME: 'Part Category Name is required',
  STATUS_ID: 'Status is required',
  FILE_UPLOAD_REQUIRED: 'At least one supporting file is required',
} as const

export const FILE_UPLOAD = {
  UPLOAD_SUBHEADER: 'File Upload*',
} as const

// API field mappings for FormData
export const API_FIELD_MAPPINGS = {
  PART_CATEGORY_ID: 'part_category_id',
  PART_CATEGORY_TYPE_ID: 'part_category_type_id',
  PART_CATEGORY_SUB_TYPE_ID: 'part_category_sub_type_id',
  PART_CATEGORY_SUBCLASS_ID: 'part_category_subclass_id',
  PART_CATEGORY_NAME: 'part_category_name',
  DESCRIPTION: 'description',
  STATUS: 'status',
  DOCUMENTS_TO_CREATE: 'documents_to_create',
  CREATE_META_DATA: 'create_meta_data',
  DOCUMENTS_TO_DELETE: 'documents_to_delete',
  UPDATE_META_DATA: 'update_meta_data',
} as const

export const STATUS_DROPDOWN_CONFIG = {
  KEY_FIELD: 'status_id',
  VALUE_FIELD: 'status_name',
} as const

// Success and Error Messages
export const MESSAGES = {
  SUCCESS: {
    CREATE: 'Part Category created successfully!',
    UPDATE: 'Part Category updated successfully!',
  },
  ERROR: {
    SAVE_FAILED: 'Failed to save part category',
    GENERIC: 'An error occurred',
  },
} as const

// Required fields for validation
export const REQUIRED_FIELDS = [
  'partCategoryType',
  'partCategorySubType', 
  'productCategorySubClass',
  'partCategoryName',
  'status_id'
] as const

// Dependent field reset mappings
export const DEPENDENT_FIELD_RESETS = {
  PART_CATEGORY_TYPE: ['partCategorySubType', 'productCategorySubClass'],
  PART_CATEGORY_SUB_TYPE: ['productCategorySubClass'],
} as const

export const PAGE_TITLE = 'Part Category'

export const CREATE = 'create'

export const PART_CATEGORY_CONSTANTS = {
  PATH: '/vendor-management/part-category',
  CONTEXT_TYPE: 'part_category',
  MULTIPART_FORM_DATA: 'multipart/form-data',
} as const

export const PART_CATEGORY_TYPE = {
  KEY_FIELD: 'ref_id',
  VALUE_FIELD: 'part_category_type',
}

export const PART_CATEGORY_SUB_TYPE = {
  KEY_FIELD: 'ref_id',
  VALUE_FIELD: 'part_subcategory_type',
}

export const PART_CATEGORY_SUBCLASS = {
  KEY_FIELD: 'ref_id',
  VALUE_FIELD: 'part_category_subclass',
}



const BASE_API_PATH = 'api/v1/vendor-purchase'
const PART_CATEGORY_PATH = 'part-category'

export const API_ENDPOINTS = {
  FETCH_ALL: `${BASE_API_PATH}/${PART_CATEGORY_PATH}/all`,
  FETCH_BY_ID: (part_category_id: number) => `${BASE_API_PATH}/${PART_CATEGORY_PATH}/${part_category_id}`,
  UPSERT: `${BASE_API_PATH}/${PART_CATEGORY_PATH}`,
  DELETE: (part_category_id: number) => `${BASE_API_PATH}/${PART_CATEGORY_PATH}/${part_category_id}`, // Soft delete with ID in URL
  // Dependent dropdown endpoints
  PART_CATEGORY_TYPES: `${BASE_API_PATH}/part-category-type/all/`,
  PART_SUBCATEGORY_TYPES: `${BASE_API_PATH}/part-subcategory-type/all`,
  PART_CATEGORY_SUBCLASSES: `${BASE_API_PATH}/part-category-subclass/all`,
} as const

// Query keys for React Query
export const QUERY_KEYS = {
  LIST: 'part-category-list',
  DETAIL: 'part-category-detail',
  TYPES: 'part-category-types',
  SUBTYPES: 'part-subcategory-types',
  SUBCLASSES: 'part-category-subclasses',
} as const



// Base columns for DataTable (following vendorAgreementChecklist pattern)
export const partCategoryColumns: GridColDef[] = [
  {
    field: "sno",
    headerName: "S.No.",
    flex: NUMBERMAP.HALF,
  },
  {
    field: "part_category_type_name",
    headerName: "Part Category Type",
    flex: NUMBERMAP.ONE,
  },
  {
    field: "part_category_sub_type_name",
    headerName: "Part Sub Type",
    flex: NUMBERMAP.ONE_HALF,
  },
  {
    field: "part_category_subclass_name",
    headerName: "Part Sub Class",
    flex: NUMBERMAP.ONE,
  },
  {
    field: "part_category_name",
    headerName: "Part Category Name",
    flex: NUMBERMAP.ONE_HALF,
  },
];