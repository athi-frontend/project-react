/**
 * Classification : Confidential
 **/

import { NUMBERMAP } from "@/constants/common"

const QUALITY_CONTROL_BASE_API_PATH = '/api/v1/quality-control'

export const INCOMING_INSPECTION_ENDPOINTS = {
  FETCH_ALL: `${QUALITY_CONTROL_BASE_API_PATH}/incoming-inspection/all`,
  DETAIL: (purchaseOrderId: string | number) =>
    `${QUALITY_CONTROL_BASE_API_PATH}/incoming-inspection/${purchaseOrderId}`,
  INITIATE_VIEW: (goodsInwardDetailId: string | number) =>
    `${QUALITY_CONTROL_BASE_API_PATH}/initiate-inspection/${goodsInwardDetailId}`,
  INITIATE_SAVE: `${QUALITY_CONTROL_BASE_API_PATH}/initiate-inspection/`,
} as const

export const INCOMING_INSPECTION_QUERY_KEYS = {
  FETCH_ALL: 'incomingInspectionFetchAll',
  DETAIL: 'incomingInspectionDetail',
  INITIATE_VIEW: 'incomingInspectionInitiateView',
} as const

export const INCOMING_INSPECTION_COPY = {
  TITLE: 'Incoming Inspection',
  PART_DETAILS: 'Part Details',
  PURCHASE_ORDER_NUMBER: 'Purchase Order Number',
  PURCHASE_ORDER_DATE: 'Purchase Order Date',
  VENDOR_TYPE: 'Vendor Type',
  VENDOR_NAME: 'Vendor Name',
  COLUMN_SNO: 'S.No.',
  COLUMN_PART_NUMBER: 'Part Number',
  COLUMN_QUANTITY: 'Quantity',
  COLUMN_SAFETY_CRITICAL: 'Safety / Critical',
  COLUMN_BATCH_UNIT: 'Batch / Unit',
  COLUMN_AQL: 'AQL',
  COLUMN_HARDWARE_SOFTWARE: 'Hardware / Software',
  COLUMN_STATUS: 'Status',
  COLUMN_ACTIONS: 'Actions',
  TOOLTIP_INITIATE_TEST: 'Initiate Test Procedure',
  TOOLTIP_INITIATE_INSPECTION: 'Initiate Inspection',
  BUTTON_BACK: 'Back',
  ERROR_FETCH: 'Unable to fetch incoming inspection details.',
} as const

export const INCOMING_INSPECTION_STATUS = {
  PASS: 'Pass',
  FAIL: 'Fail',
} as const

export const INCOMING_INSPECTION_UI = {
  SECTION_LABELS: {
    PART_DETAILS: 'Part Details',
    ORDER_DETAILS: 'Order Details',
    DOCUMENT_SUMMARY: 'Document Summary',
    INSPECTION_INPUTS: 'Inspection Inputs',
    INSPECTION_ASSIGNMENT: 'Inspection Assignment',
    REMARKS: 'Remarks',
    CALIBRATION: 'Calibration Details',
    SPECIFICATION: 'Specification Table',
    INSPECTION_RESULTS: 'Inspection Results',
    DEVIATION_NOTE: 'Deviation Note',
    FILE_UPLOAD: 'File Upload',
  },
  FIELD_LABELS: {
    PART_NUMBER: 'Part Number',
    PART_DESCRIPTION: 'Part Description',
    SAFETY_CRITICAL: 'Safety / Critical',
    AQL: 'AQL',
    PO_REFERENCE: 'PO Reference No.',
    SUPPLY_REFERENCE: 'Supply Reference Number',
    ORDER_QUANTITY: 'Order Quantity',
    SUPPLY_RECEIVED: 'Supply Received',
    QUANTITY_RECEIVED: 'Quantity Received',
    DRAWING_NUMBER: 'Drawing Number',
    INSPECTION_PROCEDURE: 'Inspection Procedure',
    BATCHES_RECEIVED: 'No. of Batches Received*',
    UNITS_PER_BATCH: 'Units Per Batch*',
    UNITS_TESTED_PER_BATCH: 'Units to be Tested Per Batch*',
    INSPECTION_QUANTITY: 'Inspection Quantity*',
    REJECTIONS_PER_BATCH: 'No. of Rejections per Batch Based on AQL',
    CONFIRM_AQL: 'Confirming Rejection & Batch Quantity is Identified as per AQL*',
    INSPECTED_BY: 'Inspected By*',
    INSPECTION_DATE: 'Inspection Date*',
    REMARKS: 'Remarks',
    UPLOADED_FILES: 'Uploaded Files',
  },
  PLACEHOLDERS: {
    BATCHES_RECEIVED: 'Enter No. of Batches Received',
    UNITS_PER_BATCH: 'Enter Units Per Batch',
    UNITS_TESTED_PER_BATCH: 'Enter Units to be Tested Per Batch',
    INSPECTION_QUANTITY: 'Enter Inspection Quantity',
    REJECTIONS_PER_BATCH: 'Enter No. of Rejections per Batch Based on AQL',
    INSPECTED_BY: 'Select Inspected By',
    REMARKS: 'Enter Remarks',
    DEFAULT_VALUE: '-',
  },
  TABLES: {
    BATCH_INSPECTION_RESULTS: {
      TITLE: 'Inspection Results',
      COLUMNS: {
        SNO: 'S.No.',
        BATCH_NUMBER: 'Batch Number',
        UNITS_TESTED: 'No. of Units Tested',
        REJECTIONS_AQL: 'No. of Rejections as per AQL',
        UNITS_FAILED: 'No. of Units Failed',
        STATUS: 'Status',
      },
    },
    LOCATION_DETAILS: {
      SECTION_TITLE: 'Location Details',
      HYPERLINK: 'Hyperlink',
      HEADERS: {
        AREAS: 'Areas',
        OBSERVATION: 'Observation',
      },
      AREAS: {
        FLOOR: 'Floor',
        ROOM: 'Room',
        SHELF_DETAILS: 'Shelf Details',
        BIN_NUMBER: 'Bin Number',
        UNIT_NAME: 'Unit Name',
        ADDRESS: 'Address',
      },
    },
  },
  CRITERIA_LABEL_PREFIX: 'Criteria ',
  FORM_TEXT: {
    LABELS: {
      EQUIPMENT_TYPE: 'Equipment Type (Incoming Inspection)',
      EQUIPMENT_USED: 'Equipment Used*',
    },
    PLACEHOLDERS: {
      EQUIPMENT_USED: 'Select Equipment Used',
      RICH_TEXT: 'Input Text',
    },
    FIELDS: {
      BATCH_TABLE: {
        SNO: 'sno',
        BATCH_NUMBER: 'batchNumber',
        UNITS_TESTED: 'unitsTested',
        REJECTIONS_AQL: 'rejectionsPerAql',
        UNITS_FAILED: 'unitsFailed',
        STATUS: 'status',
      },
    },
    SX: {
      RESULT_CHIP_ROW: { display: 'flex', gap: NUMBERMAP.ONE },
      SECTION_MARGIN_TOP: { mt: '20px' },
      WRAPPER_MARGIN: { padding : '20px' },
    },
    VALIDATION: {
      REQUIRED_SUFFIX: ' is required',
      INSPECTION_DATE: 'Inspection date is required',
      CONFIRM_AQL: 'Please confirm rejection and batch quantity as per AQL',
    },
    CALIBRATION_LABELS: [
      'Calibration Status',
      'Calibration Date',
      'Calibration Due',
      'Calibration Certificate',
    ],
    DEVIATION_LABELS: [
      'Reason for Rejection',
      'Reason for Recommendation for Acceptance through Deviation',
      'Decision',
      'Reason for Decision',
    ],
    MODAL_ERRORS: {
      UNIT_NUMBER: 'Unit number is required',
      SERIAL_NUMBER: 'Serial number is required',
      TEST_OBSERVATION: 'Test observation is required',
      TEST_RESULT: 'Test result is required',
    },
    TEST_RESULT_OPTIONS: {
      PASS: 'pass',
      FAIL: 'fail',
    },
    SPEC_TABLE: {
      FIELDS: {
        SNO: 'sno',
        DESCRIPTION: 'description',
        OBSERVATIONS: 'title',
        CHILD_SAMPLE_NUMBER: 'sample_number',
        CHILD_KEY: 'samples',
      },
      HEADERS: {
        SNO: 'S.No.',
        DESCRIPTION: 'Specification',
        OBSERVATIONS: 'Observations',
      },
    },
  },
  BUTTONS: {
    CANCEL: 'Cancel',
    SAVE: 'Save',
  },
  DROPDOWNS: {
    INSPECTED_BY: [
      { value: 'inspector1', label: 'Inspector 1' },
      { value: 'inspector2', label: 'Inspector 2' },
    ],
  },
} as const

export const INCOMING_INSPECTION_BATCH_HEADER = {
  LABEL_PREFIX: 'Batch',
  INPUT_PLACEHOLDER: 'Enter Input',
  COLORS: {
    HEADER_BG: '#5b2b86',
    HEADER_TEXT: '#fff',
    HEADER_TEXT_DISABLED: 'rgba(255,255,255,0.6)',
    INPUT_BG: '#fff',
    INPUT_TEXT: '#111',
    INPUT_PLACEHOLDER: '#9aa0a6',
  },
} as const
