/**
 * Classification : Confidential
 **/

import { NUMBERMAP } from "@/constants/common";
import { FormData } from '@/types/modules/sales/customerFeedbackCriteria';
import { NestedTransformConfig } from '@/lib/modules/vendor-management/transformNestedHierarchicalData';

const CUSTOMER_FEEDBACK_CRITERIA_API_PATH = 'api/v1/sales/customer-feedback-criteria';

export const API_ENDPOINTS = {
    FETCH_ALL: `${CUSTOMER_FEEDBACK_CRITERIA_API_PATH}/all`,
    FETCH_BY_ID: (id: number) => `${CUSTOMER_FEEDBACK_CRITERIA_API_PATH}/${id}`,
    UPSERT: `${CUSTOMER_FEEDBACK_CRITERIA_API_PATH}/`,
    DELETE: (id: number) => `${CUSTOMER_FEEDBACK_CRITERIA_API_PATH}/${id}`,
    FETCH_GROUPS: `${CUSTOMER_FEEDBACK_CRITERIA_API_PATH}/groups/all`,
    FETCH_CRITERIA: `${CUSTOMER_FEEDBACK_CRITERIA_API_PATH}/criteria/all`,
    FETCH_SYSTEM_DEFINED: `${CUSTOMER_FEEDBACK_CRITERIA_API_PATH}/system-defined/all`,
    ALL: `api/v1/dnd/product/all`,
} as const;

export const CUSTOMER_FEEDBACK_CRITERIA_CONSTANTS = {
  MODAL_TITLE_ADD: 'Add Customer Feedback Criteria',
  MODAL_TITLE_EDIT: 'Edit Customer Feedback Criteria',
  GROUP_LABEL: 'Feedback Criteria Group*',
  GROUP_PLACEHOLDER: 'Select Group Name',
  GROUP_ERROR: 'Group Name is required',
  CRITERIA_LABEL: 'Criteria*',
  CRITERIA_PLACEHOLDER: 'Select Criteria',
  CRITERIA_ERROR: 'Criteria is required',
  STATUS_LABEL: 'Status*',
  STATUS_PLACEHOLDER: 'Select Status',
  STATUS_ERROR: 'Status is required',
  SYSTEM_PREFIX: 'system_',
  MODAL_MAX_WIDTH: '900px',
   TITLE: "Customer Feedback Criteria",
  PATH_NAME: "/sales/customer-feedback-criteria",
  CREATE_PATH: "/sales/customer-feedback-criteria/create",
  ACTIVE_STATUS_TEXT: "Active",
  INACTIVE_STATUS_TEXT: "Inactive",
}

export const CUSTOMER_FEEDBACK_CRITERIA_FIELD_KEYS = {
  GROUP_NAME: 'group_name',
  CRITERIA_NAME: 'criteria_name',
  STATUS_ID: 'status_id',
  GROUP_ID: 'group_id',
  CRITERIA_ID: 'criteria_id',
  CRITERIA_MAPPER_ID: 'criteria_mapper_id',
  GROUP_DISPLAY_ORDER: 'group_display_order',
  CRITERIA_ARRAY: 'criteria',
  CRITERIA_DISPLAY_ORDER: 'display_order',
  OPTION_KEY: 'key',
  OPTION_VALUE: 'value',
  STATUS_NAME: 'status_name',
  TRUE: 'true',
  FALSE: 'false',
}

export const CUSTOMER_FEEDBACK_CRITERIA_DEFAULT_FORM_DATA = {
  group_name: '',
  criteria_name: '',
  status_id: '',
}

export interface CustomerFeedbackCriteriaModalProps {
  open: boolean
  onClose: () => void
  onSave: (data: any) => void
  initialData?: any
  criteriaId?: number
}
export const CUSTOMER_FEEDBACK_CRITERIA_KEYS = {
  ID_FIELD: "customer_feedback_criteria_id",
} as const;

export const CUSTOMER_FEEDBACK_CRITERIA_LIST_COLUMNS = {
  SNO: {
    FIELD: "sno",
    HEADER: "S.No.",
    FLEX: NUMBERMAP.HALF,
  },
  PRODUCT_TYPE: {
    FIELD: "product_type",
    HEADER: "Product Type",
    FLEX: NUMBERMAP.ONE_HALF,
  },
  PRODUCT_SUB_TYPE: {
    FIELD: "product_sub_type",
    HEADER: "Product Sub Type",
    FLEX: NUMBERMAP.ONE_HALF,
  },
  PRODUCT_NAME: {
    FIELD: "product_name",
    HEADER: "Product Name",
    FLEX: NUMBERMAP.ONE_HALF,
  },
  STATUS: {
    FIELD: "status",
    HEADER: "Status",
    FLEX: NUMBERMAP.ONE,
  },
  ACTIONS: {
    FIELD: "actions",
    HEADER: "Actions",
    FLEX: NUMBERMAP.ONE_HALF,
  },
};

export const ALERT_MESSAGES = {
  SUCCESS: "success",
  FAILED: "failed", 
  CUSTOM_ALERT: "customAlert",
  DELETE: "delete",
  ICON_ERROR: "error",
  DELETE_CONFIRMATION: "Are you sure you want to delete this customer feedback criteria?",
  DELETE_CONFIRMATION_TITLE: "Delete Confirmation",
  DELETE_CONFIRMATION_TEXT: "Are you sure you want to delete this customer feedback criteria?",
  DELETE_CONFIRMATION_ICON: "warning",
  SUCCESS_TITLE: "Success",
  SUCCESS_TEXT: "Customer feedback criteria deleted successfully!",
  SUCCESS_ICON: "success",
  DELETE_ERROR: "Failed to delete customer feedback criteria",
  DUPLICATE_CRITERIA_TITLE: "Duplicate Criteria",
  DUPLICATE_CRITERIA_MESSAGE: "Duplicate criteria for this group is not allowed.",
};

// Utility function to extract error message from caught error
export const getErrorMessage = (error: unknown): string => {
  return error instanceof Error ? error.message : '';
};

// Full error messages object

export const FORM_CONSTANTS = {
  CREATE_MODE: 'create',
  FIELD_NAMES: {
    PRODUCT_GROUP: 'productGroup',
    PRODUCT_CATEGORY: 'productCategory',
    PRODUCT_TYPE: 'productType',
    PRODUCT_SUBTYPE: 'productSubtype',
    PRODUCT_NAME: 'productName',
    STATUS: 'status',
  },
  LABELS: {
    PRODUCT_GROUP: 'Product Group*',
    PRODUCT_CATEGORY: 'Product Category*',
    PRODUCT_TYPE: 'Product Type*',
    PRODUCT_SUB_TYPE: 'Product Sub Type*',
    PRODUCT_NAME: 'Product Name*',
    STATUS: 'Status*',
  },
  PLACEHOLDERS: {
    PRODUCT_GROUP: 'Select Product Group',
    PRODUCT_CATEGORY: 'Select Product Category',
    PRODUCT_TYPE: 'Select Product Type',
    PRODUCT_SUB_TYPE: 'Select Product Sub Type',
    PRODUCT_NAME: 'Select Product Name',
    STATUS: 'Select Status',
  },
  KEY_FIELDS: {
    PRODUCT_GROUP: 'product_group_id',
    PRODUCT_CATEGORY: 'product_category_id',
    PRODUCT_TYPE: 'product_type_id',
    PRODUCT_SUB_TYPE: 'product_sub_type_id',
    PRODUCT_NAME: 'product_id',
  },
  VALUE_FIELDS: {
    PRODUCT_GROUP: 'product_group',
    PRODUCT_CATEGORY: 'product_category',
    PRODUCT_TYPE: 'product_type',
    PRODUCT_SUB_TYPE: 'product_sub_type',
    PRODUCT_NAME: 'product_name',
  },
  ERROR_MESSAGES: {
    REQUIRED: (field: string) => `${ProductFormErrors[field]}`,
  },
} as const;

export const ProductFormErrors: { [key in keyof typeof FORM_CONSTANTS.FIELD_NAMES]: string } = {
  [FORM_CONSTANTS.FIELD_NAMES.PRODUCT_GROUP]: 'Product Group is required',
  [FORM_CONSTANTS.FIELD_NAMES.PRODUCT_CATEGORY]: 'Product Category is required',
  [FORM_CONSTANTS.FIELD_NAMES.PRODUCT_TYPE]: 'Product Type is required',
  [FORM_CONSTANTS.FIELD_NAMES.PRODUCT_SUBTYPE]: 'Product Subtype is required',
  [FORM_CONSTANTS.FIELD_NAMES.PRODUCT_NAME]: 'Product Name is required',
  [FORM_CONSTANTS.FIELD_NAMES.STATUS]: 'Status is required',
};
export const PAGE_CONSTANTS = {
  TITLES: {
    ADD: 'Add Customer Feedback Criteria',
    EDIT: 'Edit Customer Feedback Criteria',
  },
  BUTTONS: {
    CANCEL: 'Cancel',
    SAVE: 'Save',
  },
  TABLE: {
    TITLE: 'Feedback Criteria',
    GROUPING_COLUMN: 'group',
    PARENT_COLUMN: 'isParent',
  },
} as const;

export const TABLE_COLUMNS = {
  SNO: {
    FIELD: 'sno',
    HEADER: 'S.No.',
  },
  CRITERIA: {
    FIELD: 'criteria',
    HEADER: 'Criteria',
  },
  STATUS: {
    FIELD: 'status',
    HEADER: 'Status',
  },
  ACTIONS: {
    FIELD: 'actions',
    HEADER: 'Actions',
  },
} as const;

export const DEFAULT_FORM_DATA: FormData = {
  productGroup: '',
  productCategory: '',
  productType: '',
  productSubtype: '',
  productName: '',
  status: '',
};

export const STATUS_DROPDOWN_CONFIG = {
  KEY_FIELD: 'status_id',
  VALUE_FIELD: 'status_name',
} as const;

export const CUSTOMER_FEEDBACK_CRITERIA_TABLE_TRANSFORM_CONFIG: NestedTransformConfig = {
  groupIdField: CUSTOMER_FEEDBACK_CRITERIA_FIELD_KEYS.GROUP_ID,
  groupNameField: CUSTOMER_FEEDBACK_CRITERIA_FIELD_KEYS.GROUP_NAME,
  groupOrderField: CUSTOMER_FEEDBACK_CRITERIA_FIELD_KEYS.GROUP_DISPLAY_ORDER,
  criteriaArrayField: CUSTOMER_FEEDBACK_CRITERIA_FIELD_KEYS.CRITERIA_ARRAY,
  childIdField: CUSTOMER_FEEDBACK_CRITERIA_FIELD_KEYS.CRITERIA_MAPPER_ID,
  childNameField: CUSTOMER_FEEDBACK_CRITERIA_FIELD_KEYS.CRITERIA_NAME,
  childOrderField: CUSTOMER_FEEDBACK_CRITERIA_FIELD_KEYS.CRITERIA_DISPLAY_ORDER,
  fieldMappings: {
    criteria: CUSTOMER_FEEDBACK_CRITERIA_FIELD_KEYS.CRITERIA_NAME,
    status: CUSTOMER_FEEDBACK_CRITERIA_FIELD_KEYS.STATUS_ID,
  },
};

