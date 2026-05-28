/**
 * Classification: Confidential
 * Constants for Infrastructure Request module
 */

import { NUMBERMAP } from '@/constants/common'
import { GridColDef } from '@mui/x-data-grid'
import { FileDocument } from '@/types/components/ui/fileUploadV3'

const BASE_API_PATH = 'api/v1/infrastructure'
const INFRASTRUCTURE_REQUEST_PATH = 'request'

export const API_ENDPOINTS = {
  FETCH_ALL_INFRASTRUCTURE_REQUEST: `${BASE_API_PATH}/${INFRASTRUCTURE_REQUEST_PATH}/all`,
  FETCH_BY_ID: (infrastructureRequestId: number) =>
    `${BASE_API_PATH}/${INFRASTRUCTURE_REQUEST_PATH}/${infrastructureRequestId}`,
  UPSERT_INFRASTRUCTURE_REQUEST: `${BASE_API_PATH}/${INFRASTRUCTURE_REQUEST_PATH}`,
  DELETE_INFRASTRUCTURE_REQUEST: (infrastructureRequestId: number) =>
    `${BASE_API_PATH}/${INFRASTRUCTURE_REQUEST_PATH}/${infrastructureRequestId}`,
  // Dropdown endpoints
  FETCH_INFRASTRUCTURE_CATEGORIES: `${BASE_API_PATH}/category/all`,
  FETCH_INFRASTRUCTURE_TYPES: `${BASE_API_PATH}/type/all`,
} as const

export const QUERY_KEYS = {
  ALL_INFRASTRUCTURE_REQUEST: 'allInfrastructureRequest',
  INFRASTRUCTURE_REQUEST_BY_ID: 'infrastructureRequestById',
  INFRASTRUCTURE_CATEGORIES: 'infrastructureCategories',
  INFRASTRUCTURE_TYPES: 'infrastructureTypes',
} as const

export const INFRASTRUCTURE_REQUEST_CONSTANTS = {
  PATH: '/infrastructure-management/infrastructure-request',
  CONTEXT_TYPE: 'infrastructure_request',
} as const

export const API_FIELD_KEYS = {
  INFRASTRUCTURE_REQUEST_ID: 'infrastructure_request_id',
  CATEGORY_ID: 'category_id',
  TYPE_ID: 'type_id',
  INFRASTRUCTURE_NAME: 'infrastructure_name',
  DESCRIPTION: 'description',
  SPECIFICATION: 'specification',
  REQUIRED_DATE: 'required_date',
  STATUS_ID: 'status_id',
  DOCUMENTS_TO_DELETE: 'documents_to_delete',
  CREATE_META_DATA: 'create_meta_data',
  UPDATE_META_DATA: 'update_meta_data',
  DOCUMENTS_TO_CREATE: 'documents_to_create',
} as const

export const INFRASTRUCTURE_REQUEST_TABLE_COLUMNS: GridColDef[] = [
  {
    field: 'sno',
    headerName: 'S.No.',
    flex: NUMBERMAP.ONE,
  },
  {
    field: 'category_name',
    headerName: 'Infrastructure Category',
    flex: NUMBERMAP.TWO,
  },
  {
    field: 'type_name',
    headerName: 'Infrastructure Type',
    flex: NUMBERMAP.TWO,
  },
  {
    field: 'infrastructure_name',
    headerName: 'Infrastructure Name',
    flex: NUMBERMAP.TWO,
  },
] as const

export const TABLE_FIELD_NAMES = {
  STATUS: 'status',
  STATUS_ID: 'status_id',
  ACTIONS: 'actions',
  INFRASTRUCTURE_CATEGORY: 'infrastructureCategory',
  INFRASTRUCTURE_TYPE: 'infrastructureType',
  INFRASTRUCTURE_NAME: 'infrastructureName',
} as const

export const TABLE_COLUMN_LABELS = {
  STATUS: 'Status',
  ACTIONS: 'Actions',
} as const

export const PAGE_TITLES = {
  LIST: 'Infrastructure Request',
  FORM: 'Infrastructure Request',
} as const

export const CREATE = 'create'

export const INFRASTRUCTURE_REQUEST_FIELD_ID = API_FIELD_KEYS.INFRASTRUCTURE_REQUEST_ID

// Form field names (for form data keys)
export const FORM_FIELD_NAMES = {
  INFRASTRUCTURE_CATEGORY: 'infrastructureCategory',
  INFRASTRUCTURE_TYPE: 'infrastructureType',
  INFRASTRUCTURE_NAME: 'infrastructureName',
  DESCRIPTION: 'description',
  SPECIFICATION: 'specification',
  REQUIRED_DATE: 'requiredDate',
  STATUS: 'status',
} as const

// Initial form data
export const INITIAL_FORM_DATA = {
  [FORM_FIELD_NAMES.INFRASTRUCTURE_CATEGORY]: '',
  [FORM_FIELD_NAMES.INFRASTRUCTURE_TYPE]: '',
  [FORM_FIELD_NAMES.INFRASTRUCTURE_NAME]: '',
  [FORM_FIELD_NAMES.DESCRIPTION]: '',
  [FORM_FIELD_NAMES.SPECIFICATION]: '',
  [FORM_FIELD_NAMES.REQUIRED_DATE]: '',
  [FORM_FIELD_NAMES.STATUS]: '',
} as const

// Initial errors
export const INITIAL_ERRORS: Record<(typeof FORM_FIELD_NAMES)[keyof typeof FORM_FIELD_NAMES], string> = {
  [FORM_FIELD_NAMES.INFRASTRUCTURE_CATEGORY]: '',
  [FORM_FIELD_NAMES.INFRASTRUCTURE_TYPE]: '',
  [FORM_FIELD_NAMES.INFRASTRUCTURE_NAME]: '',
  [FORM_FIELD_NAMES.DESCRIPTION]: '',
  [FORM_FIELD_NAMES.SPECIFICATION]: '',
  [FORM_FIELD_NAMES.REQUIRED_DATE]: '',
  [FORM_FIELD_NAMES.STATUS]: '',
}

// Validation messages
export const VALIDATION_MESSAGES = {
  INFRASTRUCTURE_CATEGORY_REQUIRED: 'Infrastructure Category is required',
  INFRASTRUCTURE_TYPE_REQUIRED: 'Infrastructure Type is required',
  INFRASTRUCTURE_NAME_REQUIRED: 'Name of the Infrastructure is required',
  DESCRIPTION_REQUIRED: 'Description is required',
  SPECIFICATION_REQUIRED: 'Specification is required',
  REQUIRED_DATE_REQUIRED: 'Date by which Required is required',
  STATUS_REQUIRED: 'Status is required',
  DUPLICATE_REQUEST: 'A request with this Category, Type, and Name combination already exists',
  FILE_UPLOAD_REQUIRED: 'At least one supporting file is required',
} as const

// Form labels
export const FORM_LABELS = {
  INFRASTRUCTURE_CATEGORY: 'Infrastructure Category*',
  INFRASTRUCTURE_TYPE: 'Infrastructure Type*',
  INFRASTRUCTURE_NAME: 'Name of the Infrastructure*',
  DESCRIPTION: 'Description of the Infrastructure *',
  SPECIFICATION: 'Specification of the Infrastructure*',
  REQUIRED_DATE: 'Date by which Required*',
  STATUS: 'Status*',
  FILE_UPLOAD: 'File Upload*',
} as const

// Form placeholders
export const FORM_PLACEHOLDERS = {
  INFRASTRUCTURE_CATEGORY: 'Select Infrastructure Category',
  INFRASTRUCTURE_TYPE: 'Select Infrastructure Type',
  INFRASTRUCTURE_NAME: 'Enter Name of the Infrastructure',
  STATUS: 'Select Status',
} as const

// Dropdown field keys
export const DROPDOWN_FIELD_KEYS = {
  CATEGORY_ID: 'infrastructure_category_id',
  CATEGORY_NAME: 'infrastructure_category_name',
  TYPE_ID: 'infrastructure_type_id',
  TYPE_NAME: 'infrastructure_type_name',
  STATUS_ID: 'status_id',
  STATUS_NAME: 'status_name',
} as const

// Form data interface
export interface InfrastructureFormData {
  [FORM_FIELD_NAMES.INFRASTRUCTURE_CATEGORY]: string
  [FORM_FIELD_NAMES.INFRASTRUCTURE_TYPE]: string
  [FORM_FIELD_NAMES.INFRASTRUCTURE_NAME]: string
  [FORM_FIELD_NAMES.DESCRIPTION]: string
  [FORM_FIELD_NAMES.SPECIFICATION]: string
  [FORM_FIELD_NAMES.REQUIRED_DATE]: string
  [FORM_FIELD_NAMES.STATUS]: string
  documents?: (File | FileDocument)[]
  documents_to_delete?: string[]
  create_meta_data?: Record<string, any>
  update_meta_data?: Record<string, any>
}
