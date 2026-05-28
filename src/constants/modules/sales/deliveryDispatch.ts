/**
 * Classification : Confidential
 **/

import { NUMBERMAP } from "@/constants/common";

const BASE_PATH = 'api/v1/sales';
const SUB_PATH = `${BASE_PATH}/delivery-dispatch`;

export const API_ENDPOINTS = {
    FETCH_ALL: `${SUB_PATH}/all`,
    FETCH_BY_ID: (id: string) => `${SUB_PATH}/${id}`,
    UPSERT: `${SUB_PATH}/`,
    DELETE: (id: string) => `${SUB_PATH}/${id}`,
} as const;

export const QUOTATION_API = {
    FETCH_ALL: `${BASE_PATH}/quotation/all?status=${NUMBERMAP.ONE}`,
    FETCH_BY_ID: (id: string) => `${BASE_PATH}/quotation/${id}`,
} as const;

export const DELIVERY_DISPATCH_HOOK = 'deliveryDispatch';
export const DELIVERY_DISPATCH_BY_ID_HOOK = 'deliveryDispatchById';
export const DELIVERY_DISPATCH_LIST_HOOK = 'deliveryDispatchList';

export const DELIVERY_DISPATCH_CONSTANTS = {
  TITLE: "Delivery/Dispatch",
  PATH_NAME: "/sales/delivery-dispatch",
  ACTIVE_STATUS_TEXT: "Active",
  INACTIVE_STATUS_TEXT: "Inactive",
};

export const DELIVERY_DISPATCH_KEYS = {
  ID_FIELD: "delivery_dispatch_id",
} as const;

export const DELIVERY_DISPATCH_FIELD_LABELS = {
  QUOTATION_NUMBER: {
    LABEL: "Quotation Number*",
    PLACEHOLDER: "Select Quotation Number",
    keyField: "quotation_id",
    valueField: "quotation_number",
  },
  DELIVERY_INSTRUCTION_ID: {
    LABEL: "Delivery Instruction ID",
    PLACEHOLDER: "Delivery Instruction ID",
  },
  ORDER_NUMBER: {
    LABEL: "Order Number",
    PLACEHOLDER: "Order Number",
  },
  CUSTOMER_NAME: {
    LABEL: "Customer Name",
    PLACEHOLDER: "Customer Name",
  },
  EXPECTED_DELIVERY_DATE: {
    LABEL: "Expected Date of Delivery",
    PLACEHOLDER: "Expected Date of Delivery",
  },
  INVOICE_LOCATION: {
    LABEL: "Location*",
    PLACEHOLDER: "Enter Location",
  },
  SHIP_TO_CONTACT_PERSON: {
    LABEL: "Contact Person*",
    PLACEHOLDER: "Enter Contact Person",
  },
  SHIP_TO_ADDRESS: {
    LABEL: "Address*",
    PLACEHOLDER: "Enter Address",
  },
  SHIP_TO_LOCATION: {
    LABEL: "Location*",
    PLACEHOLDER: "Enter Location",
  },
  REMARKS_SPECIAL_INSTRUCTION: {
    LABEL: "Remarks / Special Instruction*",
    PLACEHOLDER: "Input Text",
  },
  PRODUCT_CONFIGURATION: {
    LABEL: "Product Configuration*",
    PLACEHOLDER: "Input Text",
  },
  EXPECTED_SHIPPING_DATE: {
    LABEL: "Expected Shipping Date*",
    PLACEHOLDER: "Select Expected Shipping Date",
  },
  STATUS: {
    LABEL: "Status*",
    PLACEHOLDER: "Select Status",
  },
};

export const STATUS_DROPDOWN_CONFIG = {
  KEY_FIELD: 'status_id',
  VALUE_FIELD: 'status_name',
} as const;

export const DELIVERY_DISPATCH_LIST_COLUMNS = {
  SNO: {
    FIELD: "sno",
    HEADER: "S.No.",
    FLEX: NUMBERMAP.HALF,
  },
  QUOTATION_NO: {
    FIELD: "quotation_number",
    HEADER: "Quotation No.",
    FLEX: NUMBERMAP.ONE,
  },
  PRODUCT_NAME: {
    FIELD: "product_name",
    HEADER: "Product Name",
    FLEX: NUMBERMAP.ONE_HALF,
  },
  CUSTOMER_NAME: {
    FIELD: "customer_name",
    HEADER: "Customer Name",
    FLEX: NUMBERMAP.ONE_HALF,
  },
  STATUS: {
    FIELD: "status_id",
    HEADER: "Status",
    FLEX: NUMBERMAP.ONE,
  },
  ACTIONS: {
    FIELD: "actions",
    HEADER: "Actions",
    FLEX: NUMBERMAP.ONE,
  },
};

export const INITIAL_DELIVERY_DISPATCH = {
  quotation_id: null,
  delivery_dispatch_id: NUMBERMAP.ZERO,
  customer_name: "",
  order_number: "",
  invoice_location: "",
  ship_to_contact_person: "",
  ship_to_address: "",
  ship_to_location: "",
  remarks_special_instruction: "",
  product_configuration: "",
  expected_shipping_date: "",
  status_id: null,
};

export const ALERT_MESSAGES = {
  SUCCESS: "success",
  FAILED: "failed", 
  CUSTOM_ALERT: "customAlert",
  DELETE: "delete",
  ICON_ERROR: "error",
  DELETE_CONFIRMATION: "Are you sure you want to delete this delivery/dispatch?",
  DELETE_CONFIRMATION_TITLE: "Delete Confirmation",
  DELETE_CONFIRMATION_TEXT: "Are you sure you want to delete this delivery/dispatch?",
  DELETE_CONFIRMATION_ICON: "warning",
  SUCCESS_TITLE: "Success",
  SUCCESS_TEXT: "Delivery/Dispatch deleted successfully!",
  SUCCESS_ICON: "success",
  SAVE_SUCCESS: "Delivery/Dispatch saved successfully!",
  UPDATE_SUCCESS: "Delivery/Dispatch updated successfully!",
  LOAD_ERROR: "Failed to load delivery/dispatch data",
  SAVE_ERROR: "Failed to save delivery/dispatch",
  DELETE_ERROR: "Failed to delete delivery/dispatch",
};

export const VALIDATION_MESSAGES = {
  QUOTATION_NUMBER: "Quotation Number is required",
  INVOICE_LOCATION: "Invoice Location is required",
  SHIP_TO_CONTACT_PERSON: "Ship To Contact Person is required",
  SHIP_TO_ADDRESS: "Ship To Address is required",
  SHIP_TO_LOCATION: "Ship To Location is required",
  REMARKS_SPECIAL_INSTRUCTION: "Remarks / Special Instruction is required",
  PRODUCT_CONFIGURATION: "Product Configuration is required",
  EXPECTED_SHIPPING_DATE: "Expected Shipping Date is required",
  SHIPPING_DATE_AFTER_DELIVERY_DATE: "Expected Shipping Date should not be after Expected Date of Delivery",
  STATUS: "Status is required",
  NUMBER_OF_UNITS_ZERO: "Number of units must be greater than zero for all products",
};

export const DATA_GRID_CONSTANTS = {
  ID_FIELD: "id",
  CHECKBOX: false,
  CUSTOM_CLASS_NAME: "delivery-dispatch",
};

export const DELIVERY_DISPATCH_FORM_TABLE_COLUMNS = {
  SNO: {
    FIELD: "sno",
    HEADER: "S.No.",
  },
  PRODUCT_NAME: {
    FIELD: "product_name",
    HEADER: "Product Name",
  },
  MODEL: {
    FIELD: "model_name",
    HEADER: "Model",
  },
  NUMBER_OF_UNITS: {
    FIELD: "number_of_units",
    HEADER: "No. of Units",
    PLACEHOLDER: "Enter number of units",
    LABEL: "",
  },
  FACTORS: {
    FIELD: "factors",
    HEADER: "Factors",
  },
  DETAILS: {
    FIELD: "details",
    HEADER: "Details",
  },
};

export const DELIVERY_DISPATCH_TITLE = "Delivery/Dispatch";

export const DELIVERY_DISPATCH_LIST_PATH = "/sales/delivery-dispatch";
export const DELIVERY_DISPATCH_CREATE_PATH = "/sales/delivery-dispatch/create";

export const DELIVERY_DISPATCH_FORM_LABELS = {
  CREATE: "Create",
  EDIT: "Edit",
  INVOICE_DETAILS: "Invoice Details",
  SHIP_TO: "Ship To",
  PRODUCT_DETAILS: "Product Details",
  SITE_REQUIREMENT_SPECIFICATIONS: "Site Requirement Specifications",
  UPLOAD: "Upload",
};

export const DELIVERY_DISPATCH_FORM_FIELDS = {
  CONTACT_PERSON: "Contact Person",
  ADDRESS: "Address",
  PRODUCT_ID: "quotation_product_id",
  ID: "id",
  FILE_MANAGER_PREFIX: "file-manager-",
  EXPECTED_SHIPPING_DATE: "expected_shipping_date",
};

// Field names for permission checks
export const DROPDOWN_FIELDS = {
  QUOTATION_ID: 'quotation_id',
  STATUS: 'status_id',
} as const;

