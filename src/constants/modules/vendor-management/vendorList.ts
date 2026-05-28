import { NUMBERMAP } from '@/constants/common'
import { GridColDef } from '@mui/x-data-grid'
import { VendorFormData } from '@/types/modules/vendor-management/vendorList'
import { RICH_TEXT_EDITOR_CONSTANTS } from '@/constants/components/ui/richTextEditor';
/**
    Classification : Confidential
**/

const BASE_API_PATH = 'api/v1/vendor-purchase/vendor-list';
export const API_ENDPOINTS = {
  FETCH_ALL: `${BASE_API_PATH}/all`,
  VENDOR_LIST: `${BASE_API_PATH}/all`,
  FETCH_BY_ID: (vendorId: string) => `${BASE_API_PATH}/${vendorId}`,
  DELETE: (vendorId: string) => `${BASE_API_PATH}/${vendorId}`,
  CREATE_UPDATE: BASE_API_PATH,
}

export const VENDOR_LIST_HOOK = 'vendorList'
export const VENDOR_LIST_BY_ID_HOOK = 'vendorListById'

export const VENDOR_LIST_CONSTANTS = {
  TITLE: 'Vendor List',
  PATH_NAME: '/vendor-management/vendor',
  ACTIVE_STATUS_TEXT: 'Active',
  INACTIVE_STATUS_TEXT: 'Inactive',
}

export const vendorListColumns: GridColDef[] = [
  {
    field: 'sno',
    headerName: 'S.No.',
  },
  {
    field: 'vendor_type_name',
    headerName: 'Vendor Type',
    flex: NUMBERMAP.TWO,
  },
  {
    field: 'vendor_name',
    headerName: 'Vendor Name',
    flex: NUMBERMAP.TWO,
  },
  {
    field: 'telephone_number',
    headerName: 'Contact Number',
    flex: NUMBERMAP.TWO,
  },
]

export const ALERT_MESSAGES = {
  SUCCESS: 'success',
  FAILED: 'failed',
  CUSTOM_ALERT: 'customAlert',
  DELETE: 'delete',
  ICON_ERROR: 'error',
  DELETE_CONFIRMATION: 'Are you sure you want to delete this vendor?',
  DELETE_CONFIRMATION_TITLE: 'Delete Confirmation',
  DELETE_CONFIRMATION_TEXT: 'Are you sure you want to delete this vendor?',
  DELETE_CONFIRMATION_ICON: 'warning' as const,
  SUCCESS_TITLE: 'Success',
  SUCCESS_TEXT: 'Vendor deleted successfully!',
  SUCCESS_ICON: 'success' as const,
}

export const DATA_GRID_CONSTANTS = {
  ID_FIELD: 'id',
  CHECKBOX: false,
  CUSTOM_CLASS_NAME: 'vendor-list',
}

export const ACTION_COLUMN = {
  FIELD: 'actions',
  HEADER_NAME: 'Actions',
}

export const VENDOR_LIST_TITLE = 'Vendor List'
export const VENDOR_LIST_PATH = '/vendor-management/vendor'

export const CREATE = 'create'
export const CREATE_PAGE_TITLE = 'Add Vendor'
export const EDIT_PAGE_TITLE = 'Edit Vendor'

export const FORM_LABELS = {
  VENDOR_TYPE: 'Vendor Type*',
  VENDOR_NAME: 'Vendor Name*',
  ADDRESS: 'Address*',
  LOCATION: 'Location*',
  CONTACT_PERSON_NAME: 'Contact Person Name*',
  TELEPHONE_NUMBER: 'Telephone Number*',
  EMAIL: 'Email*',
  WEBSITE: 'Website*',
  VENDOR_RE_EVALUATION_FREQUENCY: 'Vendor Re-evaluation Frequency*',
  ISO_CERTIFIED: 'Is ISO Certified',
  DOCUMENTS: 'Vendor Reference Document',
} as const
export const ERROR_MESSAGES = {
  VENDOR_TYPE_ID: 'Vendor Type is required',
  VENDOR_NAME: 'Vendor Name is required',
  ADDRESS: 'Address is required',
  LOCATION: 'Location is required',
  CONTACT_PERSON_NAME: 'Contact Person Name is required',
  TELEPHONE_NUMBER: 'Telephone Number is required',
  EMAIL: 'Email is required',
  WEBSITE: 'Website is required',
  VENDOR_REEVALUATION_FREQUENCY_ID:
    'Vendor Re-evaluation Frequency is required',
  IS_ISO_CERTIFIED: 'Is ISO Certified is required',
  INVALID_TELEPHONE_NUMBER: `Enter a valid telephone number (must be ${NUMBERMAP.TWELVE} digits)`,
  INVALID_EMAIL: 'Enter a valid email address',
  INVALID_WEBSITE_URL: 'Enter a valid website URL',
  STATUS: 'Status is required',

} as const

export const FORM_PLACEHOLDERS = {
  VENDOR_TYPE: 'Select Vendor Type',
  VENDOR_NAME: 'Enter Vendor Name',
  ADDRESS: 'Enter Address',
  LOCATION: 'Enter Location',
  CONTACT_PERSON_NAME: 'Enter Contact Person Name',
  TELEPHONE_NUMBER: 'Enter Telephone Number',
  EMAIL: 'Enter Email',
  WEBSITE: 'Enter Website URL',
  VENDOR_RE_EVALUATION_FREQUENCY: 'Select Re-evaluation Frequency',
} as const

export const REQUIRED_FIELDS: (keyof VendorFormData)[] = [
  'vendor_type_id',
  'vendor_name',
  'address',
  'location',
  'contact_person_name',
  'telephone_number',
  'email',
  'website',
  'vendor_reevaluation_frequency_id',
  'status'
]

export const TELEPHONE_NUMBER_REGEX = /^[0-9+]+$/

export const URL_VALIDATION = {
  WWW_PATTERN: /^www\./i,
  HTTPS_PREFIX: RICH_TEXT_EDITOR_CONSTANTS.DefaultProtocol,
  ALLOWED_PROTOCOLS: ['http:', 'https:'],
} as const

export const FORM_FIELD_NAMES = {
  STATUS: 'status',
  PART_CATEGORIES: 'part_categories',
  VENDOR_ID: 'vendor_id',
  DOCUMENTS_TO_CREATE: 'documents_to_create',
  DOCUMENTS_TO_DELETE: 'documents_to_delete',
  CREATE_META_DATA: 'create_meta_data',
  UPDATE_META_DATA: 'update_meta_data',
} as const

export const DROPDOWN_FIELDS = {
  KEY_FIELD: 'id',
  VENDOR_TYPE_VALUE_FIELD: 'vendor_type_name',
  VENDOR_RE_EVALUATION_FREQUENCY_VALUE_FIELD: 'vendor_re_evaluation_frequency',
} as const

export const PART_CATEGORY_TABLE = {
  TITLE: 'Part Categories',
  COLUMNS: {
    SNO: {
      FIELD: 'sno',
      HEADER_NAME: 'S.No.',
    },
    PART_TYPE: {
      FIELD: 'part_category_type_name',
      HEADER_NAME: 'Part Type',
    },
    PART_SUB_TYPE: {
      FIELD: 'part_subcategory_type_name',
      HEADER_NAME: 'Part Sub Type',
    },
    PART_SUB_CLASS: {
      FIELD: 'part_category_subclass_name',
      HEADER_NAME: 'Part Sub Class',
    },
    PART_CATEGORY: {
      FIELD: 'part_category_name',
      HEADER_NAME: 'Part Category',
    },
    MOQ: {
      FIELD: 'moq_detail',
      HEADER_NAME: 'Minimum Order Quantity (MOQ)',
    },
    ACTION: {
      FIELD: 'action',
      HEADER_NAME: 'Action',
    },
  },
} as const

export const VENDOR_PART_CATEGORY_MODAL = {
  FORM_LABELS: {
    MIN_ORDER_QUANTITY: 'Minimum Order Quantity (MOQ)*',
  },
  FORM_PLACEHOLDERS: {
    MIN_ORDER_QUANTITY: 'Enter Minimum Order Quantity (MOQ)',
  },
  ERROR_MESSAGES: {
    MIN_ORDER_QUANTITY_REQUIRED: 'Minimum Order Quantity (MOQ) is required',
    MIN_ORDER_QUANTITY_INVALID: 'Minimum Order Quantity (MOQ) must be a number',
    MIN_ORDER_QUANTITY_GREATER_THAN_ZERO: 'Minimum Order Quantity must be greater than zero.',
    DUPLICATE_COMBINATION: 'This combination of Part Type, Part Sub Type, Part Sub Class, and Part Category already exists.',
  },
  ALERT: {
    ERROR_TITLE: 'Duplicate Part Category',
    ERROR_ICON: 'error' as const,
  },
} as const
