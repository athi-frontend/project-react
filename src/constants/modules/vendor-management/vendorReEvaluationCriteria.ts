/**
 * Classification: Confidential
 * Constants for Vendor Re-Evaluation Criteria module
 * 
 * This file only contains constants specific to Re-Evaluation Criteria.
 * Common constants are imported from vendorSelectionCriteria.ts
 */

// Import common/shared constants
import {
  FORM_PLACEHOLDERS,
  FORM_FIELD_NAMES,
  BUTTON_LABELS,
  CREATE,
  TABLE_HEADERS,
  FIELD_NAMES,
  DATA_FIELD_NAMES,
  DROPDOWN_FIELDS,
  TABLE_CONFIG,
} from './vendorSelectionCriteria';

// Re-export common constants for backward compatibility
export {
  FORM_PLACEHOLDERS,
  FORM_FIELD_NAMES,
  BUTTON_LABELS,
  CREATE,
  TABLE_HEADERS,
  FIELD_NAMES,
  DATA_FIELD_NAMES,
  DROPDOWN_FIELDS,
  TABLE_CONFIG,
};

// Re-Evaluation specific form labels (PART_GROUP_NAME and REQUIREMENT have * required)
export const RE_EVALUATION_FORM_LABELS = {
  PART_TYPE: 'Part Type*',
  PART_SUB_TYPE: 'Part Sub Type*',
  PART_SUB_CLASS: 'Part Sub Class*',
  PART_CATEGORY_NAME: 'Part Category Name*',
  STATUS: 'Status*',
  LOGO: 'Logo',
  // Modal specific labels
  PART_GROUP_NAME: 'Part Group Name*',
  CRITERIA: 'Criteria',
  REQUIREMENT: 'Requirement*'
};

export const RE_EVALUATION_DATA_SOURCE_NAME = 'vendor_re_evaluation_criteria';

// Re-Evaluation specific validation messages (includes PART_GROUP_NAME and REQUIREMENT)
export const RE_EVALUATION_VALIDATION_MESSAGES = {
  GROUP_NAME_DUPLICATE: 'Group name already exists',
  CRITERIA_DUPLICATE: 'Criteria already exists in this group',
  PARTTYPE: 'Part Type is required',
  PARTSUBTYPE: 'Part Sub Type is required',
  PARTSUBCLASS: 'Part Sub Class is required',
  PARTCATEGORYNAME: 'Part Category Name is required',
  STATUS: 'Status is required',
  // Modal specific validation messages
  PART_GROUP_NAME: 'Part Group Name is required',
  REQUIREMENT: 'Requirement is required'
};

export const RE_EVALUATION_CREATE_PAGE_TITLE = 'Add Vendor Re-Evaluation Criteria';
export const RE_EVALUATION_EDIT_PAGE_TITLE = 'Edit Vendor Re-Evaluation Criteria';

// Modal specific constants
export const RE_EVALUATION_MODAL_TITLE = {
  CREATE: 'Vendor Re-Evaluation Criteria',
  EDIT: 'Vendor Re-Evaluation Criteria'
};

export const RE_EVALUATION_ALERT_MESSAGES = {
  SUCCESS_TITLE: 'Success',
  SUCCESS_TEXT_CREATED: 'Vendor Re-Evaluation Criteria created successfully!',
  SUCCESS_TEXT_UPDATED: 'Vendor Re-Evaluation Criteria updated successfully!',
  ERROR_TITLE: 'Error',
  ERROR_TEXT_CREATE: 'Failed to create vendor re-evaluation criteria',
  ERROR_TEXT_UPDATE: 'Failed to update vendor re-evaluation criteria'
};

export const RE_EVALUATION_DROPDOWN_FIELD_CONFIG = {
  PART_GROUP_NAME: {
    KEY_FIELD: 'group_id',
    VALUE_FIELD: 'group_name',
    DATA_FIELD_NAME: 'part_group_name'
  },
  CRITERIA: {
    KEY_FIELD: 'criteria_id',
    VALUE_FIELD: 'criteria_name',
    DATA_FIELD_NAME: 'criteria'
  },
  REQUIREMENT: {
    KEY_FIELD: 'ref_id',
    VALUE_FIELD: 'requirement_type',
    DATA_FIELD_NAME: 'requirement'
  },
  STATUS: {
    KEY_FIELD: 'status_id',
    VALUE_FIELD: 'status_name',
    DATA_FIELD_NAME: 'status'
  }
};

export const VENDOR_RE_EVALUATION_CRITERIA_PATH_CONSTANTS = {
  PATH: '/vendor-management/vendor-re-evaluation-criteria',
  CONTEXT_TYPE: 'vendor_re_evaluation_criteria'
};

// API Constants
export const VENDOR_RE_EVALUATION_CRITERIA_API_BASE = '/api/v1/vendor-purchase/vendor-re-evaluation-criteria';

export const VENDOR_RE_EVALUATION_CRITERIA_API_ENDPOINTS = {
  GET_ALL: () => `${VENDOR_RE_EVALUATION_CRITERIA_API_BASE}/all`,
  GET_BY_ID: (id: number | string) => `${VENDOR_RE_EVALUATION_CRITERIA_API_BASE}/details?criteria_id=${id}`,
  UPSERT: VENDOR_RE_EVALUATION_CRITERIA_API_BASE,
  DELETE: (id: number | string) => `${VENDOR_RE_EVALUATION_CRITERIA_API_BASE}/${id}`
};

export const VENDOR_RE_EVALUATION_CRITERIA_QUERY_KEY = 'vendor_re_evaluation_criteria';

export const VENDOR_GROUP_API_ENDPOINTS = {
  GET_ALL: () => `${VENDOR_RE_EVALUATION_CRITERIA_API_BASE}/groups?type=user_defined`
};

export const VENDOR_GROUP_CRITERIA_API_ENDPOINTS = {
  GET_ALL: (group_ids: string) => `${VENDOR_RE_EVALUATION_CRITERIA_API_BASE}/criteria?group_id=${group_ids}&type=user_defined`
};

export const REQUIREMENT_API_ENDPOINTS = {
  GET_ALL: () => `/api/v1/vendor-purchase/requirement/all`
};

// Part Category API Endpoints
export const PART_CATEGORY_TYPE_API_ENDPOINTS = {
  GET_ALL: () => `/api/v1/vendor-purchase/part-category-type/all`
};

export const PART_SUBCATEGORY_TYPE_API_ENDPOINTS = {
  GET_ALL: () => `/api/v1/vendor-purchase/part-subcategory-type/all`
};

export const PART_CATEGORY_SUBCLASS_API_ENDPOINTS = {
  GET_ALL: () => `/api/v1/vendor-purchase/part-category-subclass/all`
};

export const PART_CATEGORY_API_ENDPOINTS = {
  GET_ALL: () => `/api/v1/vendor-purchase/part-category/all`
};

// Page specific constants
export const RE_EVALUATION_PAGE_CONSTANTS = {
  TITLE: 'Vendor Re-Evaluation Criteria',
  PATH_NAME: '#',
  CREATE_PATH: '/vendor-management/vendor-re-evaluation-criteria/create',
  EDIT_PATH: (id: number) => `/vendor-management/vendor-re-evaluation-criteria/${id}`
};

// Table column constants
export const RE_EVALUATION_TABLE_COLUMNS = {
  SNO: {
    FIELD: 'sno',
    HEADER_NAME: 'S.No.'
  },
  PART_CATEGORY_TYPE: {
    FIELD: 'part_category_type_name',
    HEADER_NAME: 'Part Category Type'
  },
  PART_SUB_TYPE: {
    FIELD: 'part_sub_type_name',
    HEADER_NAME: 'Part Sub Type'
  },
  PART_SUB_CLASS: {
    FIELD: 'part_sub_class_name',
    HEADER_NAME: 'Part Sub Class'
  },
  PART_TYPE_NAME: {
    FIELD: 'part_category_name',
    HEADER_NAME: 'Part Category Name'
  },
  STATUS: {
    FIELD: 'status_id',
    HEADER_NAME: 'Status'
  },
  ACTION: {
    FIELD: 'action',
    HEADER_NAME: 'Action'
  }
};

// Data Grid constants
export const RE_EVALUATION_DATA_GRID_CONSTANTS = {
  ID_FIELD: 'criteria_id'
};

// FormData field constants for API submission
export const VENDOR_RE_EVALUATION_CRITERIA_CONSTANTS = {
  CRITERIA_ID: 'criteria_id',
  PART_TYPE_ID: 'part_type_id',
  PART_SUB_TYPE_ID: 'part_subtype_id',
  PART_SUB_CLASS_ID: 'part_subclass_id',
  PART_CATEGORY_ID: 'part_category_id',
  CRITERIA_DETAILS: 'criteria_details',
  STATUS: 'status',
  CREATE_META_DATA: 'create_meta_data',
  UPDATE_META_DATA: 'update_meta_data',
  DOCUMENTS_TO_CREATE: 'documents_to_create',
  DOCUMENTS_TO_DELETE: 'documents_to_delete'
};

// UI Text Constants
export const RE_EVALUATION_UI_TEXT = {
  VENDOR_RE_EVALUATION_CRITERIA_TITLE: 'Vendor Re-Evaluation Criteria',
  LOGO_UPLOAD_SUBHEADER: 'File Upload',
  GROUP_PREFIX: 'Group'
};

// Path Constants (Re-Evaluation specific)
export const RE_EVALUATION_PATHS = {
  VENDOR_RE_EVALUATION_CRITERIA_LIST: '/vendor-management/vendor-re-evaluation-criteria'
};

// Export aliases for backward compatibility (use RE_EVALUATION_* prefixed versions instead)
export const FORM_LABELS = RE_EVALUATION_FORM_LABELS;
export const DATA_SOURCE_NAME = RE_EVALUATION_DATA_SOURCE_NAME;
export const VALIDATION_MESSAGES = RE_EVALUATION_VALIDATION_MESSAGES;
export const CREATE_PAGE_TITLE = RE_EVALUATION_CREATE_PAGE_TITLE;
export const EDIT_PAGE_TITLE = RE_EVALUATION_EDIT_PAGE_TITLE;
export const MODAL_TITLE = RE_EVALUATION_MODAL_TITLE;
export const ALERT_MESSAGES = RE_EVALUATION_ALERT_MESSAGES;
export const DROPDOWN_FIELD_CONFIG = RE_EVALUATION_DROPDOWN_FIELD_CONFIG;
export const UI_TEXT = RE_EVALUATION_UI_TEXT;
export const PATHS = RE_EVALUATION_PATHS;
export const PAGE_CONSTANTS = RE_EVALUATION_PAGE_CONSTANTS;
export const TABLE_COLUMNS = RE_EVALUATION_TABLE_COLUMNS;
export const DATA_GRID_CONSTANTS = RE_EVALUATION_DATA_GRID_CONSTANTS;
