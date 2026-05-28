/**
 * Classification : Confidential
 **/

import { NUMBERMAP } from "@/constants/common";

const BASE_PATH = "api/v1/sales";
const BASE_API_PATH = `${BASE_PATH}/quotation`;
const BASE_CUSTOMER_API_PATH = `${BASE_PATH}/customer`;
const BASE_MODEL_API_PATH = `${BASE_PATH}/model`;
export const API_ENDPOINTS = {
  FETCH_ALL: `${BASE_API_PATH}/all`,
  FETCH_BY_ID: (id: number) => `${BASE_API_PATH}/${id}`,
  UPSERT: `${BASE_API_PATH}/`,
  DELETE: (id: string | number) => `${BASE_API_PATH}/${id}`,
  FETCH_CUSTOMERS: `${BASE_CUSTOMER_API_PATH}/all`,
  FETCH_MODELS_BY_PRODUCT: (productId: number) => `${BASE_MODEL_API_PATH}/product/${productId}`,
} as const;

export const QUOTATION_HOOK = "quotation";
export const QUOTATION_BY_ID_HOOK = "quotationById";
export const QUOTATION_LIST_HOOK = "quotationList";

export const QUOTATION_CONSTANTS = {
  TITLE: "Quotation",
  LIST_TITLE: "List View - Initiate Quotation",
  PATH_NAME: "/sales/initiate-quotation",
  CREATE_PATH: "/sales/initiate-quotation/create",
  ACTIVE_STATUS_TEXT: "Active",
  INACTIVE_STATUS_TEXT: "Inactive",
} as const;

export const QUOTATION_KEYS = {
  ID_FIELD: "quotation_id",
} as const;

export const QUOTATION_FIELD_LABELS = {
  QUOTATION_NUMBER: {
    LABEL: "Quotation Number*",
    PLACEHOLDER: "Enter Quotation Number",
  },
  CUSTOMER_TYPE: {
    LABEL: "Customer Type",
    PLACEHOLDER: "Select Customer Type",
  },
  CUSTOMER_ID: {
    LABEL: "Customer ID",
    PLACEHOLDER: "Select Customer",
    keyField: "customer_id",
    valueField: "customer_name",
  },
  CUSTOMER_NAME: {
    LABEL: "Customer Name*",
    PLACEHOLDER: "Enter Customer Name",
  },
  ADDRESS: {
    LABEL: "Address*",
    PLACEHOLDER: "Enter Address",
  },
  FEATURE_AND_APPLICATION: {
    LABEL: "Feature and Application*",
    PLACEHOLDER: "Enter Feature and Application",
  },
  CONTACT_PERSON_NAME: {
    LABEL: "Contact Person Name*",
    PLACEHOLDER: "Enter Contact Person Name",
  },
  EMAIL_ID: {
    LABEL: "Email ID*",
    PLACEHOLDER: "Enter Email ID",
  },
  PRODUCT_SUPPLY: {
    LABEL: "Product Supply*",
    PLACEHOLDER: "Enter Product Supply",
  },
  QUOTATION_DATE: {
    LABEL: "Quotation Date*",
    PLACEHOLDER: "Select Quotation Date",
  },
  STATUS: {
    LABEL: "Status*",
    PLACEHOLDER: "Select Status",
  },
  TERMS_AND_CONDITION: {
    LABEL: "Terms and Condition*",
    PLACEHOLDER: "Select Terms and Condition",
  },
};

export const QUOTATION_LIST_COLUMNS = {
  SNO: {
    FIELD: "sno",
    HEADER: "S.No.",
    FLEX: NUMBERMAP.HALF,
  },
  QUOTATION_NUMBER: {
    FIELD: "quotation_number",
    HEADER: "Quotation Number",
    FLEX: NUMBERMAP.ONE_HALF,
  },
  CUSTOMER_NAME: {
    FIELD: "customer_name",
    HEADER: "Customer Name",
    FLEX: NUMBERMAP.ONE_HALF,
  },
  QUOTATION_DATE: {
    FIELD: "quotation_date",
    HEADER: "Quotation Date",
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
    FLEX: NUMBERMAP.ONE,
  },
} as const;

export const INITIAL_QUOTATION = {
  quotation_id: null,
  quotation_number: "",
  customer_type: "existing",
  customer_id: null,
  customer_name: "",
  address: "",
  feature_and_application: "",
  contact_person_name: "",
  email_id: "",
  product_supply: "",
  product_details: [],
  quotation_date: "",
  status: 1,
  terms_and_condition: 1,
  documents_to_delete: "[]",
  update_meta_data: "{}",
};

export const PRODUCT_DETAILS_INITIAL = {
  product_id: null,
  model_id: null,
  quantity: "",
  price: "",
  product_status: 1,
};

export const CUSTOMER_TYPE_OPTIONS = [
  { value: "existing", label: "Existing Customer" },
  { value: "others", label: "New Customer" },
];

export const STATUS_OPTIONS = [
  { value: 1, label: "Active" },
  { value: 2, label: "Inactive" },
];

export const PRODUCT_STATUS_OPTIONS = [
  { value: 1, label: "Active" },
  { value: 0, label: "Inactive" },
];

export const BUTTON_LABELS = {
  submitForReview: "Submit for Review",
  submitForApproval: "Submit for Approval",
  approve: "Approve",
  reject: "Reject",
  cancel: "Cancel",
  save: "Save",
  edit: "Edit",
  delete: "Delete",
  addProduct: "Add Product",
  removeProduct: "Remove Product",
};

export const ALERT_MESSAGES = {
  SUCCESS: "success",
  FAILED: "failed", 
  CUSTOM_ALERT: "customAlert",
  DELETE: "delete",
  ICON_ERROR: "error",
  ERROR_TITLE: "Error",
  DELETE_CONFIRMATION: "Are you sure you want to delete this quotation?",
  DELETE_CONFIRMATION_TITLE: "Delete Confirmation",
  DELETE_CONFIRMATION_TEXT: "Are you sure you want to delete this quotation?",
  DELETE_CONFIRMATION_ICON: "warning",
  SUCCESS_TITLE: "Success",
  SUCCESS_TEXT: "Quotation deleted successfully!",
  SUCCESS_ICON: "success",
  SAVE_SUCCESS: "Quotation saved successfully!",
  UPDATE_SUCCESS: "Quotation updated successfully!",
  LOAD_ERROR: "Failed to load quotation data",
  SAVE_ERROR: "Failed to save quotation",
  DELETE_ERROR: "Failed to delete quotation",
};

export const DATA_GRID_CONSTANTS = {
  ID_FIELD: "id",
  CHECKBOX: false,
  CUSTOM_CLASS_NAME: "quotation",
};

export const QUOTATION_TITLE = "Quotation";

export const QUOTATION_LIST_PATH = "/sales/initiate-quotation";

export const FORM_FIELD_NAMES = {
  QUOTATION_ID: 'quotation_id',
  QUOTATION_NUMBER: 'quotation_number',
  CUSTOMER_TYPE: 'customer_type',
  CUSTOMER_ID: 'customer_id',
  CUSTOMER_NAME: 'customer_name',
  ADDRESS: 'address',
  FEATURE_AND_APPLICATION: 'feature_and_application',
  CONTACT_PERSON_NAME: 'contact_person_name',
  EMAIL_ID: 'email_id',
  PRODUCT_SUPPLY: 'product_supply',
  QUOTATION_DATE: 'quotation_date',
  STATUS: 'status',
  TERMS_AND_CONDITION: 'terms_and_condition',
  // Product form fields
  PRODUCT_ID: 'product_id',
  MODEL_ID: 'model_id',
  QUANTITY: 'quantity',
  PRICE: 'price',
  PRODUCT_STATUS: 'product_status',
  SUPPORTING_FILES: 'supporting_files',
} as const;

export const getErrorMessage = (error: unknown): string => {
  return error instanceof Error ? error.message : "";
};
