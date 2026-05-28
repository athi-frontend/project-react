/**
    Classification : Confidential
**/

const BASE_API_PATH = 'api/v1/vendor-purchase';

export const API_ENDPOINTS = {
  FETCH_SAMPLE_ORDER_PARTS: (sample_order_id: number) => 
    `${BASE_API_PATH}/sample-order-parts/${sample_order_id}`,
  FETCH_SAMPLE_INSPECTION: (sample_order_id: number, part_number?: number) => {
    const baseUrl = `${BASE_API_PATH}/sample-inspection/${sample_order_id}`;
    return part_number ? `${baseUrl}?part_number=${part_number}` : baseUrl;
  },
  POST_SAMPLE_INSPECTION: () => `${BASE_API_PATH}/sample-inspection/`,
};

export const SAMPLE_ORDER_PARTS_HOOK = 'sampleOrderParts';
export const SAMPLE_INSPECTION_HOOK = 'sampleInspection';
export const POST_SAMPLE_INSPECTION_HOOK = 'postSampleInspection';

export const SAMPLE_INSPECTION_CONSTANTS = {
  TITLE: "Sample Inspection",
  PATH_NAME: "/vendor-management/sample-inspection",
};

// Form Labels
export const FORM_LABELS = {
  PERFORM_INSPECTION: "Perform Inspection",
  PART_NUMBER: "Part Number",
  PART_TYPE: "Part Type",
  PART_CATEGORY_SUB_TYPE: "Part Category Sub Type",
  PART_SUB_CLASS: "Part Sub Class",
  PART_CATEGORY: "Part Category",
  ORDER_QUANTITY: "Order Quantity",
  PO_REFERENCE_NUMBER: "PO Reference Number",
  SAFETY_CRITICAL: "Safety / Critical",
  AQL: "AQL",
  SUPPLY_REFERENCE_NUMBER: "Supply Reference Number",
  SUPPLY_RECEIVED: "Supply Received*",
  QUANTITY_RECEIVED: "Quantity Received*",
  INSPECTION_QUANTITY: "Inspection Quantity*",
  DRAWING_NUMBER: "Drawing Number",
  SAMPLE_ORDER_QC_RESULT: "Sample Order QC Result*",
  REMARKS: "Remarks",
  FILE_UPLOAD: "File Upload*",
  INSPECTION_PROCEDURE: "Inspection Procedure*",
  BATCH_SERIAL_NO: "Batch/Serial No*",
  TEST_OBSERVATION: "Test Observation*",
  TEST_RESULT: "Test Result*",
  SAMPLE_DETAILS: "Sample Details",
} as const;

// Form Placeholders
export const FORM_PLACEHOLDERS = {
  SELECT_PART_NUMBER: "Select Part Number",
  ENTER_SUPPLY_REFERENCE_NUMBER: "Enter Supply Reference Number",
  ENTER_SUPPLY_RECEIVED: "Enter Supply Received",
  ENTER_QUANTITY_RECEIVED: "Enter Quantity Received",
  ENTER_INSPECTION_QUANTITY: "Enter Inspection Quantity",
  SELECT_INSPECTION_PROCEDURE: "Select Inspection Procedure",
  ENTER_REMARKS: "Enter remarks",
  ENTER_BATCH_SERIAL_NO: "Enter Batch/Serial No",
  ENTER_TEST_OBSERVATION: "Enter test observation",
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  PART_NUMBER_REQUIRED: "Part Number is required",
  SUPPLY_RECEIVED_REQUIRED: "Supply Received is required",
  QUANTITY_RECEIVED_REQUIRED: "Quantity Received is required",
  INSPECTION_QUANTITY_REQUIRED: "Inspection Quantity is required",
  INSPECTION_PROCEDURE_REQUIRED: "Inspection Procedure is required",
  QC_RESULT_REQUIRED: "Sample Order QC Result is required",
  INSPECTION_QUANTITY_GREATER_THAN_RECEIVED: "Inspection Quantity should not be greater than Quantity Received",
  BATCH_SERIAL_NO_REQUIRED: "Batch/Serial No is required",
  TEST_OBSERVATION_REQUIRED: "Test Observation is required",
  TEST_RESULT_REQUIRED: "Test Result is required",
  SAMPLE_ORDER_ID_AND_PART_NUMBER_REQUIRED: "Sample Order ID and Part Number are required",
  FILE_UPLOAD_REQUIRED: "At least one file is required",
} as const;

// Alert Messages
export const ALERT_MESSAGES = {
  ERROR_TITLE: "Error",
  SUCCESS_TITLE: "Success",
  SAMPLE_INSPECTION_SAVED_SUCCESS: "Sample inspection saved successfully",
  FAILED_TO_SAVE_SAMPLE_INSPECTION: "Failed to save sample inspection",
} as const;

// Button Labels
export const BUTTON_LABELS = {
  CANCEL: "Cancel",
  SAVE: "Save",
} as const;

// QC Result Options
export const QC_RESULT_OPTIONS = [
  { value: "pass", label: "Pass" },
  { value: "fail", label: "Fail" },
];

// Table Column Headers
export const TABLE_COLUMNS = {
  SNO: "S.No",
  DESCRIPTION: "Description",
  SPECIFICATION: "Specification",
} as const;

export const BUTTONSTYLE = { padding: '40px' }


// Field Labels for Validation
export const FIELD_LABELS = {
  PART_NUMBER: "Part Number",
  SUPPLY_RECEIVED: "Supply Received",
  QUANTITY_RECEIVED: "Quantity Received",
  INSPECTION_QUANTITY: "Inspection Quantity",
  QC_RESULT: "Sample Order QC Result",
  INSPECTION_PROCEDURE: "Inspection Procedure",
} as const;

// Default Values
export const DEFAULT_VALUES = {
  STATUS: "1",
  UNKNOWN_FILE_NAME: "Unknown",
  DRAWING_PREFIX: "Drawing",
  SPECIFICATION_PREFIX: "Specification",
} as const;

// Form Field Names
export const FORM_FIELD_NAMES = {
  PART_NUMBER: "partNumber",
  SUPPLY_RECEIVED: "supplyReceived",
  QUANTITY_RECEIVED: "quantityReceived",
  INSPECTION_QUANTITY: "inspectionQuantity",
  INSPECTION_PROCEDURE: "inspectionProcedure",
  QC_RESULT: "qcResult",
} as const;