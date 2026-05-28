/**
 * Classification: Confidential
 * Constants for Vendor Selection Criteria module
 */

export const FORM_LABELS = {
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

export const FORM_PLACEHOLDERS = {
  PART_TYPE: 'Select Part Type',
  PART_SUB_TYPE: 'Select Part Sub Type',
  PART_SUB_CLASS: 'Select Part Sub Class',
  PART_CATEGORY_NAME: 'Select Part Category Name',
  STATUS: 'Select Status',
  LOGO: 'Upload Logo',
  // Modal specific placeholders
  PART_GROUP_NAME: 'Select Part Group Name',
  CRITERIA: 'Select Criteria',
  REQUIREMENT: 'Select Requirement'
};

export const FORM_FIELD_NAMES = {
  PART_TYPE: 'partType',
  PART_SUB_TYPE: 'partSubType',
  PART_SUB_CLASS: 'partSubClass',
  PART_CATEGORY_NAME: 'partCategoryName',
  LOGO: 'logo',
  // Modal specific field names
  PART_GROUP_NAME: 'partGroupName',
  CRITERIA: 'criteria',
  REQUIREMENT: 'requirement',
  STATUS: 'status'
};

export const BUTTON_LABELS = {
  SAVE: 'Save',
  CANCEL: 'Cancel',
  SUBMIT: 'Submit'
};

export const DATA_SOURCE_NAME = 'vendor_selection_criteria';

export const VALIDATION_MESSAGES = {
  PARTTYPE: 'Part Type is required',
  PARTSUBTYPE: 'Part Sub Type is required',
  PARTSUBCLASS: 'Part Sub Class is required',
  PARTCATEGORYNAME: 'Part Category Name is required',
  STATUS: 'Status is required',
  // Modal specific validation messages
  PART_GROUP_NAME: 'Part Group Name is required',
  REQUIREMENT: 'Requirement is required',
  FILE_UPLOAD_REQUIRED: 'File Upload is required'
};

export const CREATE_PAGE_TITLE = 'Add Vendor Selection Criteria';
export const EDIT_PAGE_TITLE = 'Edit Vendor Selection Criteria';
export const CREATE = 'create';

// Modal specific constants
export const MODAL_TITLE = {
  CREATE: 'Vendor Selection Criteria',
  EDIT: 'Vendor Selection Criteria'
};

export const ALERT_MESSAGES = {
  SUCCESS_TITLE: 'Success',
  SUCCESS_TEXT_CREATED: 'Vendor Selection Criteria created successfully!',
  SUCCESS_TEXT_UPDATED: 'Vendor Selection Criteria updated successfully!',
  ERROR_TITLE: 'Error',
  ERROR_TEXT_CREATE: 'Failed to create vendor selection criteria',
  ERROR_TEXT_UPDATE: 'Failed to update vendor selection criteria'
};

export const DROPDOWN_FIELD_CONFIG = {
  PART_GROUP_NAME: {
    KEY_FIELD: 'ref_id',
    VALUE_FIELD: 'group_name',
    DATA_FIELD_NAME: 'part_group_name'
  },
  CRITERIA: {
    KEY_FIELD: 'ref_id',
    VALUE_FIELD: 'criteria',
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

export const VENDOR_SELECTION_CRITERIA_PATH_CONSTANTS = {
  PATH: '/vendor-management/vendor-selection-criteria',
  CONTEXT_TYPE: 'vendor_selection_criteria'
};

// API Constants
const APIBASEPATH = '/api/v1'
export const VENDOR_SELECTION_CRITERIA_API_BASE = `${APIBASEPATH}/production/vendor-selection-criteria`;

export const VENDOR_SELECTION_CRITERIA_API_ENDPOINTS = {
  GET_ALL: () => `${VENDOR_SELECTION_CRITERIA_API_BASE}/all`,
  GET_BY_ID: (id: number | string) => `${VENDOR_SELECTION_CRITERIA_API_BASE}/${id}`,
  GET_GROUPS_ALL: () => `${VENDOR_SELECTION_CRITERIA_API_BASE}/groups/all`,
  UPSERT: VENDOR_SELECTION_CRITERIA_API_BASE,
  DELETE: (id: number | string) => `${VENDOR_SELECTION_CRITERIA_API_BASE}/${id}`,
};

export const VENDOR_SELECTION_CRITERIA_QUERY_KEY = 'vendor_selection_criteria';

export const VENDOR_GROUP_API_ENDPOINTS = {
  GET_ALL: () => `${APIBASEPATH}/vendor-purchase/vendor-group/all`
};

export const VENDOR_GROUP_CRITERIA_API_ENDPOINTS = {
  GET_ALL: (vendor_group_id: number) => `${APIBASEPATH}/vendor-purchase/vendor-group-criteria/all?vendor_group_id=${vendor_group_id}`
};

export const REQUIREMENT_API_ENDPOINTS = {
  GET_ALL: () => `${APIBASEPATH}/vendor-purchase/requirement/all`
};

// Part Category API Endpoints
export const PART_CATEGORY_TYPE_API_ENDPOINTS = {
  GET_ALL: () => `${APIBASEPATH}/vendor-purchase/part-category-type/all`
};

export const PART_SUBCATEGORY_TYPE_API_ENDPOINTS = {
  GET_ALL: () => `${APIBASEPATH}/vendor-purchase/part-subcategory-type/all`
};

export const PART_CATEGORY_SUBCLASS_API_ENDPOINTS = {
  GET_ALL: () => `${APIBASEPATH}/vendor-purchase/part-category-subclass/all`
};

export const PART_CATEGORY_API_ENDPOINTS = {
  GET_ALL: () => `${APIBASEPATH}/vendor-purchase/part-category/all`
};

// Page specific constants
export const PAGE_CONSTANTS = {
  TITLE: 'Vendor Selection Criteria',
  PATH_NAME: '#',
  CREATE_PATH: (id:number)=>`/production/vendor-selection-criteria/${id}/create`,
  EDIT_PATH: (id: number,vendorId:number) => `/production/vendor-selection-criteria/${id}/${vendorId}`
};

// Table column constants
export const TABLE_COLUMNS = {
  SNO: {
    FIELD: 'sno',
    HEADER_NAME: 'S.No.'
  },
  PART_CATEGORY_TYPE: {
    FIELD: 'part_category_name',
    HEADER_NAME: 'Part Category Type'
  },
  PART_SUB_TYPE: {
    FIELD: 'part_sub_class_name',
    HEADER_NAME: 'Part Sub Type'
  },
  PART_SUB_CLASS: {
    FIELD: 'part_sub_type_name',
    HEADER_NAME: 'Part Sub Class'
  },
  PART_TYPE_NAME: {
    FIELD: 'part_type_name',
    HEADER_NAME: 'Part Type Name'
  },
  STATUS: {
    FIELD: 'status',
    HEADER_NAME: 'Status'
  },
  ACTION: {
    FIELD: 'action',
    HEADER_NAME: 'Action'
  }
};

// Data Grid constants
export const DATA_GRID_CONSTANTS = {
  ID_FIELD: 'vendor_selection_criteria_id'
};

// FormData field constants for API submission
export const VENDOR_SELECTION_CRITERIA_CONSTANTS = {
  VENDOR_SELECTION_CRITERIA_ID: 'vendor_selection_criteria_id',
  PART_TYPE_ID: 'part_type_id',
  PART_SUB_TYPE_ID: 'part_sub_type_id',
  PART_SUB_CLASS_ID: 'part_sub_class_id',
  PART_CATEGORY_ID: 'part_category_id',
  CRITERIA_DETAILS: 'criteria_details',
  STATUS: 'status',
  CREATE_META_DATA: 'create_meta_data',
  UPDATE_META_DATA: 'update_meta_data',
  DOCUMENTS_TO_CREATE: 'documents_to_create',
  DOCUMENTS_TO_DELETE: 'documents_to_delete'
};

// UI Text Constants
export const UI_TEXT = {
  VENDOR_SELECTION_CRITERIA_TITLE: 'Vendor Selection Criteria',
  FILE_UPLOAD_SUBHEADER: 'File Upload*',
  GROUP_PREFIX: 'Group'
};

// Table Column Constants
export const TABLE_HEADERS = {
  SNO: 'S.No.',
  CRITERIA: 'Criteria',
  REQUIREMENT: 'Requirement',
  ACTIONS: 'Actions'
};

// Path Constants
export const PATHS = {
  VENDOR_SELECTION_CRITERIA_LIST: '/vendor-management/vendor-selection-criteria'
};

// Field Names Constants
export const FIELD_NAMES = {
  SNO: 'sno',
  CRITERIA: 'criteria',
  REQUIREMENT: 'requirement',
  ACTIONS: 'actions',
  GROUP: 'group',
  IS_PARENT: 'isParent',
  PART_TYPE: 'part_type',
  PART_SUB_TYPE: 'part_sub_type',
  PART_SUB_CLASS: 'part_sub_class',
  PART_CATEGORY_NAME: 'part_category_name'
};

// Data Field Names for API
export const DATA_FIELD_NAMES = {
  PART_TYPE: 'part_type',
  PART_SUB_TYPE: 'part_sub_type',
  PART_SUB_CLASS: 'part_sub_class',
  PART_CATEGORY_NAME: 'part_category_name'
};

// Key and Value Fields for Dropdowns
export const DROPDOWN_FIELDS = {
  PART_TYPE: {
    KEY_FIELD: 'ref_id',
    VALUE_FIELD: 'part_category_type'
  },
  PART_SUB_TYPE: {
    KEY_FIELD: 'ref_id',
    VALUE_FIELD: 'part_subcategory_type'
  },
  PART_SUB_CLASS: {
    KEY_FIELD: 'ref_id',
    VALUE_FIELD: 'part_category_subclass'
  },
  PART_CATEGORY: {
    KEY_FIELD: 'part_category_id',
    VALUE_FIELD: 'part_category_name'
  },
  STATUS: {
    KEY_FIELD: 'status_id',
    VALUE_FIELD: 'status_name'
  }
};

// Table Configuration
export const TABLE_CONFIG = {
  GROUPING_COLUMN: 'group',
  PARENT_COLUMN: 'isParent'
};
