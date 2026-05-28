/**
 * Classification : Confidential
 **/

import { NUMBERMAP } from "@/constants/common";
import { formatDate } from "@/lib/utils/common";
import { GridColDef } from "@mui/x-data-grid";

const ORDER_ACKNOWLEDGEMENT_API_PATH = 'api/v1/sales/order-acknowledgement';
const SALES_API_PATH = 'api/v1/sales';

export const API_ENDPOINTS = {
    FETCH_ALL: `${ORDER_ACKNOWLEDGEMENT_API_PATH}/all`,
    FETCH_BY_ID: (id: string) => `${ORDER_ACKNOWLEDGEMENT_API_PATH}/${id}`,
    UPSERT: `${ORDER_ACKNOWLEDGEMENT_API_PATH}/`,
    DELETE: (id: string) => `${ORDER_ACKNOWLEDGEMENT_API_PATH}/${id}`,
} as const;

export const ORDER_APPROVAL_MODE_API = {
    FETCH_ALL: `${SALES_API_PATH}/order-approval-mode/all`,
} as const;

export const QUOTATION_API = {
    FETCH_ALL: `${SALES_API_PATH}/quotation/all?status=1`,
    FETCH_BY_ID: (id: string) => `${SALES_API_PATH}/quotation/${id}`,
} as const;

export const ORDER_ACKNOWLEDGEMENT_HOOK = 'orderAcknowledgement';
export const ORDER_ACKNOWLEDGEMENT_BY_ID_HOOK = 'orderAcknowledgementById';
export const ORDER_ACKNOWLEDGEMENT_LIST_HOOK = 'orderAcknowledgementList';
export const ORDER_APPROVAL_MODE_HOOK = 'orderApprovalMode';

export const ORDER_ACKNOWLEDGEMENT_CONSTANTS = {
  TITLE: "Order Acknowledgement",
  PATH_NAME: "/sales/order-acknowledgement",
  ACTIVE_STATUS_TEXT: "Active",
  INACTIVE_STATUS_TEXT: "Inactive",
};

export const ORDER_ACKNOWLEDGEMENT_KEYS = {
  ID_FIELD: "order_acknowledgement_id",
} as const;

export const ORDER_ACKNOWLEDGEMENT_FIELD_LABELS = {
  QUOTATION_NUMBER: {
    LABEL: "Quotation Number*",
    PLACEHOLDER: "Select Quotation Number",
    keyField: "quotation_id",
    valueField: "quotation_number",
  },
  CUSTOMER_NAME: {
    LABEL: "Customer Name",
    PLACEHOLDER: "Customer Name",
  },
  ORDER_NUMBER: {
    LABEL: "Order Number",
    PLACEHOLDER: "Enter Order Number",
  },
  ORDER_APPROVAL_MODE: {
    LABEL: "Order Approval Mode*",
    PLACEHOLDER: "Select Order Approval Mode",
    keyField: "approval_mode_id",
    valueField: "approval_mode_name",
  },
  QUOTATION_DATE: {
    LABEL: "Quotation Date",
    PLACEHOLDER: "Quotation Date",
  },
  ORDER_DATE: {
    LABEL: "Order Date",
    PLACEHOLDER: "Select Order Date",
  },
  EXPECTED_DELIVERY_DATE: {
    LABEL: "Expected Date of Delivery*",
    PLACEHOLDER: "Select Expected Delivery Date",
  },
  STATUS: {
    LABEL: "Status*",
    PLACEHOLDER: "Select Status",
    keyField: "status_id",
    valueField: "status_name",
  },
};

export const ORDER_ACKNOWLEDGEMENT_LIST_COLUMNS = {
  SNO: {
    FIELD: "sno",
    HEADER: "S.No.",
    FLEX: NUMBERMAP.HALF,
  },
  QUOTATION_NO: {
    FIELD: "quotation_no",
    HEADER: "Quotation No.",
    FLEX: NUMBERMAP.ONE_HALF,
  },
  QUOTATION_DATE: {
    FIELD: "quotation_date",
    HEADER: "Quotation Date",
    FLEX: NUMBERMAP.ONE_HALF,
  },
  CUSTOMER_NAME: {
    FIELD: "customer_name",
    HEADER: "Customer Name",
    FLEX: NUMBERMAP.ONE_HALF,
  },
  ORDER_NUMBER: {
    FIELD: "order_number",
    HEADER: "Order Number",
    FLEX: NUMBERMAP.ONE_HALF,
  },
  ORDER_APPROVAL_MODE: {
    FIELD: "order_approval_mode",
    HEADER: "Order Approval Mode",
    FLEX: NUMBERMAP.ONE_HALF,
  },
  EXPECTED_DELIVERY_DATE: {
    FIELD: "expected_delivery_date",
    HEADER: "Expected Delivery Date",
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

export const INITIAL_ORDER_ACKNOWLEDGEMENT = {
  quotation_id: null,
  order_acknowledgement_id: "",
  customer_name: "",
  order_number: "",
  approval_mode_id: null,
  expected_delivery_date: "",
  status: 1,
};

export const BUTTON_LABELS = {
  submitForReview: "Submit for Review",
  submitForApproval: "Submit for Approval",
  approve: "Approve",
  reject: "Reject",
  cancel: "Cancel",
  save: "Save",
  edit: "Edit",
  delete: "Delete",
};

export const ALERT_MESSAGES = {
  SUCCESS: "success",
  FAILED: "failed", 
  CUSTOM_ALERT: "customAlert",
  DELETE: "delete",
  ICON_ERROR: "error",
  DELETE_CONFIRMATION: "Are you sure you want to delete this order acknowledgement?",
  DELETE_CONFIRMATION_TITLE: "Delete Confirmation",
  DELETE_CONFIRMATION_TEXT: "Are you sure you want to delete this order acknowledgement?",
  DELETE_CONFIRMATION_ICON: "warning",
  SUCCESS_TITLE: "Success",
  SUCCESS_TEXT: "Order acknowledgement deleted successfully!",
  SUCCESS_ICON: "success",
  SAVE_SUCCESS: "Order acknowledgement saved successfully!",
  UPDATE_SUCCESS: "Order acknowledgement updated successfully!",
  LOAD_ERROR: "Failed to load order acknowledgement data",
  SAVE_ERROR: "Failed to save order acknowledgement",
  DELETE_ERROR: "Failed to delete order acknowledgement",
  VALIDATION_ERROR_TITLE: "Validation Error",
  VALIDATION_ERROR_ICON: "error",
};

// Utility function to extract error message from caught error
export const getErrorMessage = (error: unknown): string => {
  return error instanceof Error ? error.message : '';
};

export const DATA_GRID_CONSTANTS = {
  ID_FIELD: "id",
  CHECKBOX: false,
  CUSTOM_CLASS_NAME: "order-acknowledgement",
};

export const ORDER_ACKNOWLEDGEMENT_TITLE = "Order Acknowledgement";

export const ORDER_ACKNOWLEDGEMENT_LIST_PATH = "/sales/order-acknowledgement";
export const ORDER_ACKNOWLEDGEMENT_CREATE_PATH = "/sales/order-acknowledgement/create";

// Document grid column definitions
export const DOCUMENT_COLUMNS: GridColDef[] = [
  { 
    field: "sno", 
    headerName: "S.No.", 
    flex: NUMBERMAP.ONE,
    renderCell: (params: any) => {
      return params.api.getAllRowIds().indexOf(params.id) + NUMBERMAP.ONE;
    }
  },
  { 
    field: "file_name", 
    headerName: "File Name", 
    flex: NUMBERMAP.TWO,
    renderCell: (params: any) => {
      return `${params.row.file_name ?? ''}${params.row.extension ?? ''}`;
    }
  },
  { field: "source", headerName: "Source", flex: NUMBERMAP.ONE },
  { field: "uploaded_date", headerName: "Date of Upload", flex: NUMBERMAP.TWO,renderCell: (params: any) => {
    return params.row.uploaded_date ? formatDate(params.row.uploaded_date) : '';
  } },
  { 
    field: "file_category", 
    headerName: "File Category", 
    flex: NUMBERMAP.TWO,
    renderCell: (params: any) => {
      return params.row.file_category ?? '';
    }
  },
  { 
    field: "file_status", 
    headerName: "File Status", 
    flex: NUMBERMAP.ONE,
  },
  {
    field: "actions",
    headerName: "Actions",
    flex: NUMBERMAP.ONE,
    headerAlign: "center",
    align: "center",
  },
];

export const UPLOADED_DOCUMENTS_LABEL = "Uploaded Documents";

export const BUTTON_LABELS_FORM = {
  CANCEL: "Cancel",
  SAVE: "Save"
};

// Validation constants
export const ERROR_MESSAGES = {
  QUOTATION_ID: "Quotation Number is required",
  APPROVAL_MODE_ID: "Order Approval Mode is required",
  EXPECTED_DELIVERY_DATE: "Expected Delivery Date is required",
  STATUS_ID: "Status is required",
  EXPECTED_DELIVERY_DATE_BEFORE_ORDER_DATE: "Expected Delivery Date must be greater than Order Date",
};

// Field order for validation focus
export const FIELD_ORDER = [
  'quotation_id',
  'approval_mode_id',
  'expected_delivery_date',
  'status_id',
] as const;

// Field label map for validation focus
export const FIELD_LABEL_MAP: { [key: string]: string } = {
  quotation_id: ORDER_ACKNOWLEDGEMENT_FIELD_LABELS.QUOTATION_NUMBER.LABEL,
  approval_mode_id: ORDER_ACKNOWLEDGEMENT_FIELD_LABELS.ORDER_APPROVAL_MODE.LABEL,
  expected_delivery_date: ORDER_ACKNOWLEDGEMENT_FIELD_LABELS.EXPECTED_DELIVERY_DATE.LABEL,
  status_id: ORDER_ACKNOWLEDGEMENT_FIELD_LABELS.STATUS.LABEL,
};

// Field names for permission checks
export const DROPDOWN_FIELDS = {
  QUOTATION_ID: 'quotation_id',
  APPROVAL_MODE_ID: 'approval_mode_id',
  STATUS_ID: 'status_id',
} as const;

