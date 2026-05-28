/**
 * Classification : Confidential
 **/
import { NUMBERMAP } from '@/constants/common'

const BASE_API_PATH_QUALITY_CONTROL = 'api/v1/quality-control'

const SANITY_CHECK_BASE_ENDPOINT = `${BASE_API_PATH_QUALITY_CONTROL}/sanity-check-inspection`
const SPECIFICATION_CHECKLIST_BASE_ENDPOINT = `${BASE_API_PATH_QUALITY_CONTROL}/sanity-specification-checklist`

export const SANITY_CHECK_API_ENDPOINTS = {
  GET_ALL: `${SANITY_CHECK_BASE_ENDPOINT}/all`,
  UPSERT: `${SANITY_CHECK_BASE_ENDPOINT}/`,
  GET_BY_ID: (sanityCheckInspectionId: number) =>
    `${SANITY_CHECK_BASE_ENDPOINT}/?sanity_check_inspection_id=${sanityCheckInspectionId}`,
  DELETE: (sanityCheckInspectionId: number) =>
    `${SANITY_CHECK_BASE_ENDPOINT}/${sanityCheckInspectionId}`,
  GET_SPECIFICATION_CHECKLIST: (purchaseOrderId: number) =>
    `${SPECIFICATION_CHECKLIST_BASE_ENDPOINT}/${purchaseOrderId}`,
}

export const SANITY_CHECK_FORM_LABELS = {
  VENDOR_TYPE: 'Vendor Type*',
  VENDOR_NAME: 'Vendor Name*',
  PURCHASE_ORDER_NUMBER: 'Purchase Order Number*',
  PART_NUMBER: 'Part Number*',
  PART_TYPE: 'Part Type',
  PART_CATEGORY_SUB_TYPE: 'Part Category Sub Type',
  PART_SUB_CLASS: 'Part Sub Class',
  PART_CATEGORY: 'Part Category',
  ORDER_QUANTITY: 'Order Quantity',
  PO_REFERENCE_NUMBER: 'PO Reference Number',
  SAFETY_CRITICAL: 'Safety / Critical',
  AQL: 'AQL (Acceptable Quality Level)',
  SUPPLY_REFERENCE_NO: 'Supply Reference No.*',
  SUPPLY_RECEIVED: 'Supply Received*',
  REMARKS: 'Remarks',
  STATUS: 'Status*',
}

export const SANITY_CHECK_FORM_PLACEHOLDERS = {
  VENDOR_TYPE: 'Select Vendor Type',
  VENDOR_NAME: 'Select Vendor Name',
  PURCHASE_ORDER_NUMBER: 'Select Purchase Order Number',
  PART_NUMBER: 'Select Part Number',
  SUPPLY_REFERENCE_NO: 'Enter Supply Reference No.',
  SUPPLY_RECEIVED: 'Enter Supply Received',
  REMARKS: 'Enter Remarks',
  STATUS: 'Select Status',
}

export const SANITY_CHECK_ERROR_MESSAGES = {
  VENDOR_TYPE_REQUIRED: 'Vendor Type is required',
  VENDOR_NAME_REQUIRED: 'Vendor Name is required',
  PURCHASE_ORDER_NUMBER_REQUIRED: 'Purchase Order Number is required',
  PART_NUMBER_REQUIRED: 'Part Number is required',
  SUPPLY_REFERENCE_NO_REQUIRED: 'Supply Reference No. is required',
  SUPPLY_RECEIVED_REQUIRED: 'Supply Received is required',
  STATUS_REQUIRED: 'Status is required',
  FETCH_ERROR: 'Failed to fetch sanity check inspection data',
  UPSERT_ERROR: 'Failed to save sanity check inspection data',
  DELETE_ERROR: 'Failed to delete sanity check inspection',
  VALIDATION_ERROR: 'Please fill all required fields',
  CRITERIA_VALIDATION_ERROR: 'All observations and results are required',
}

export const SANITY_CHECK_TABLE_COLUMNS = {
  SNO: {
    field: 'sno',
    headerName: 'S.No',
  },
  VENDOR_NAME: {
    field: 'vendor_name',
    headerName: 'Vendor Name',
    flex: NUMBERMAP.TWO,
  },
  PURCHASE_ORDER_NUMBER: {
    field: 'purchase_order_number',
    headerName: 'Purchase Order Number',
    flex: NUMBERMAP.TWO,
  },
  PURCHASE_ORDER_DATE: {
    field: 'purchase_order_date',
    headerName: 'Purchase Order Date',
    flex: NUMBERMAP.TWO,
  },
  STATUS: {
    field: 'status',
    headerName: 'Status',
    flex: NUMBERMAP.ONE,
  },
  ACTIONS: {
    field: 'actions',
    headerName: 'Actions',
  },
}

export const SANITY_CHECK_TABLE_FIELDS = {
  SNO: 'sno',
  VENDOR_NAME: 'vendor_name',
  PURCHASE_ORDER_NUMBER: 'purchase_order_number',
  PURCHASE_ORDER_DATE: 'purchase_order_date',
  STATUS_NAME: 'status_name',
  ACTIONS: 'actions',
  CRITERIA: 'criteria',
  OBSERVATIONS: 'observations',
  RESULT: 'result',
}

export const SANITY_CHECK_PAGE_CONSTANTS = {
  PAGE_TITLE: 'Sanity Check Inspection',
  STATUS_HEADER: 'Status',
  ID_FIELD: 'sanity_check_inspection_id',
  TABLE_ID_FIELD: 'purchase_order_id',
  STATUS_ACTIVE: 'Active',
  MODAL_TITLE: 'Sanity Check Inspection',
}

export const PURCHASE_ORDER_TYPE = {
  PART: 'part',
}

export const SANITY_CHECK_PATHS = {
  BASE_PATH: '/quality-control-management/sanity-check-inspection',
  CREATE_PATH: '/quality-control-management/sanity-check-inspection/create',
  EDIT_PATH: (purchaseOrderId: number | string) => `/quality-control-management/sanity-check-inspection/${purchaseOrderId}`,
}

export const CREATE_MODE_ID = 'create'

export const SANITY_CHECK_CONTEXT_TYPE = 'sanity_check_inspection'

export const SANITY_CHECK_TABLE_HEADERS = {
  SNO: 'S.No.',
  CRITERIA: 'Criteria',
  OBSERVATIONS: 'Observations',
  RESULT: 'Result',
}

export const SANITY_CHECK_MODAL_CONSTANTS = {
  EDIT_OBSERVATION_TITLE: 'Edit Observation',
  OBSERVATION_LABEL: 'Observation',
  OBSERVATION_PLACEHOLDER: 'Input Text',
  MODAL_MAX_WIDTH: '800px',
}

export const SANITY_CHECK_RESULT_OPTIONS = {
  PASS: 'Pass',
  FAIL: 'Fail',
}

export const SANITY_CHECK_DISPLAY_VALUES = {
  DEFAULT_EMPTY: '-',
}

export const SANITY_CHECK_INITIAL_DATA = {
  part_detail_id: null,
  sanity_check_inspection_id: null,
  vendor_type_id: null,
  vendor_id: null,
  purchase_order_id: null,
  purchase_order_number: null,
  purchase_order_date: null,
  part_number_id: null,
  part_type: null,
  part_category_sub_type: null,
  part_sub_class: null,
  part_category: null,
  order_quantity: null,
  po_reference_number: null,
  safety_critical: null,
  aql: null,
  supply_reference_number: '',
  supply_received: null,
  specifications: [],
  remarks: '',
  status: null,
  supporting_files: [],
}

export const SANITY_CHECK_DROPDOWN_CONFIG = {
  VENDOR_TYPE: {
    KEY_FIELD: 'id',
    VALUE_FIELD: 'vendor_type_name',
  },
  VENDOR: {
    KEY_FIELD: 'id',
    VALUE_FIELD: 'vendor_name',
  },
  PURCHASE_ORDER: {
    KEY_FIELD: 'purchase_order_id',
    VALUE_FIELD: 'purchase_order_number',
  },
  PART_NUMBER: {
    KEY_FIELD: 'purchase_order_part_details_id',
    VALUE_FIELD: 'part_number',
  },
  STATUS: {
    KEY_FIELD: 'status_id',
    VALUE_FIELD: 'status_name',
  },
}

export const SANITY_CHECK_FIELD_MAPPING_DATA = [
  {
    label: SANITY_CHECK_FORM_LABELS.PART_TYPE,
    key: 'part_type',
  },
  {
    label: SANITY_CHECK_FORM_LABELS.PART_CATEGORY_SUB_TYPE,
    key: 'part_category_sub_type',
  },
  {
    label: SANITY_CHECK_FORM_LABELS.PART_SUB_CLASS,
    key: 'part_sub_class',
  },
  {
    label: SANITY_CHECK_FORM_LABELS.PART_CATEGORY,
    key: 'part_category',
  },
  {
    label: SANITY_CHECK_FORM_LABELS.ORDER_QUANTITY,
    key: 'order_quantity',
  },
  {
    label: SANITY_CHECK_FORM_LABELS.PO_REFERENCE_NUMBER,
    key: 'po_reference_number',
  },
  {
    label: SANITY_CHECK_FORM_LABELS.SAFETY_CRITICAL,
    key: 'safety_critical',
  },
  {
    label: SANITY_CHECK_FORM_LABELS.AQL,
    key: 'aql',
  },
]

export const SANITY_CHECK_FORM_FIELD_NAMES = {
  VENDOR_TYPE_ID: 'vendor_type_id',
  VENDOR_ID: 'vendor_id',
  PURCHASE_ORDER_ID: 'purchase_order_id',
  PART_NUMBER_ID: 'part_number_id',
  SUPPLY_REFERENCE_NO: 'supply_reference_number',
  SUPPLY_RECEIVED: 'supply_received',
  REMARKS: 'remarks',
}

export const SANITY_CHECK_TRANSFORM_CONFIG = {
  GROUP_ID_FIELD: 'applicable_group_id',
  GROUP_NAME_FIELD: 'group_name',
  GROUP_ORDER_FIELD: 'applicable_group_display_order',
  CRITERIA_ARRAY_FIELD: 'specification_details',
  CHILD_ID_FIELD: 'specification_detail_id',
  CHILD_NAME_FIELD: 'specification',
  CHILD_ORDER_FIELD: 'display_order',
  FIELD_MAPPINGS: {
    CRITERIA: 'specification',
    OBSERVATION: 'observation',
    RESULT_ID: 'verification_result_id',
    STATUS: 'status',
  },
}

export const SANITY_CHECK_UI_CONSTANTS = {
  ARIA_LABEL_EDIT_OBSERVATION: 'edit observation',
  HEADER_ALIGN_CENTER: 'center' as const,
  INPUT_TYPE_NUMBER: 'number',
  RADIO_BUTTON_NAME_PREFIX: 'result_',
  EMPTY_STRING: '',
}

export const SANITY_CHECK_PAYLOAD_KEYS = {
  PART_DETAIL_ID: 'part_detail_id',
  SPECIFICATIONS: 'specifications',
  DOCUMENTS_TO_DELETE: 'documents_to_delete',
  CREATE_META_DATA: 'create_meta_data',
  UPDATE_META_DATA: 'update_meta_data',
  SUPPLY_REFERENCE_NO: 'supply_reference_no',
  SUPPLY_RECEIVED: 'supply_received',
  REMARKS: 'remarks',
  SANITY_CHECK_INSPECTION_ID: 'sanity_check_inspection_id',
  DOCUMENTS_TO_CREATE: 'documents_to_create',
}