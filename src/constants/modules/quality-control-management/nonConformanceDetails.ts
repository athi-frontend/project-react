/**
 * Classification : Confidential
 **/

import { NUMBERMAP } from '@/constants/common'

const BASE_API_PATH = 'api/v1/quality-control/non-conformance-details'

export const API_ENDPOINTS = {
  FETCH_ALL: `${BASE_API_PATH}/all?status=${NUMBERMAP.ONE}`,
  FETCH_BY_ID: (inspectionResultId: number) =>
    `${BASE_API_PATH}/${inspectionResultId}`,
  UPSERT: BASE_API_PATH,
} as const

export const API_FIELD_NAMES = {
  INSPECTION_RESULT_ID: 'inspection_result_id',
  DEFECT_DETAILS: 'defect_details',
  ACTION_PLAN_SLUG: 'action_plan_slug',
  STATUS: 'status',
  NON_CONFORMANCE_DETAILS_ID: 'non_conformance_details_id',
  RETURN_DETAILS: 'return_details',
  DISPOSAL_INFORMATION: 'disposal_informmation',
  SCRAP_DESCRIPTION: 'scrap_description',
  REWORK_INSTRUCTION: 'rework_instruction',
  EMPLOYEE_ID: 'employee_id',
  DOCUMENTS_TO_CREATE: 'documents_to_create',
  CREATE_META_DATA: 'create_meta_data',
  UPDATE_META_DATA: 'update_meta_data',
  DOCUMENTS_TO_DELETE: 'documents_to_delete',
} as const

export const NON_CONFORMANCE_DETAILS_CONSTANTS = {
  TITLE: 'Non-Conformance Details',
  PATH_NAME: '/quality-control-management/non-conformance-details',
}

export const NON_CONFORMANCE_DETAILS_FIELD_LABELS = {
  PURCHASE_ORDER_NUMBER: {
    LABEL: 'Purchase Order Number',
    FIELD: 'purchase_order_number',
  },
  PURCHASE_ORDER_DATE: {
    LABEL: 'Purchase Order Date',
    FIELD: 'purchase_order_date',
  },
  PART_CATEGORY: {
    LABEL: 'Part Category',
    FIELD: 'part_category',
  },
  PART_NUMBER: {
    LABEL: 'Part Number',
    FIELD: 'part_number',
  },
}

export const NON_CONFORMANCE_DETAILS_LIST_COLUMNS = {
  SNO: {
    FIELD: 'sno',
    HEADER: 'S.No.',
  },
  PURCHASE_ORDER_NUMBER: {
    FIELD: 'purchase_order_number',
    HEADER: 'Purchase Order No.',
    FLEX: NUMBERMAP.ONE,
  },
  PURCHASE_ORDER_DATE: {
    FIELD: 'purchase_order_date',
    HEADER: 'Purchase Order Date',
    FLEX: NUMBERMAP.ONE,
  },
  PART_CATEGORY: {
    FIELD: 'part_category',
    HEADER: 'Part Category',
    FLEX: NUMBERMAP.ONE,
  },
  PART_NUMBER: {
    FIELD: 'part_number',
    HEADER: 'Part Number',
    FLEX: NUMBERMAP.ONE,
  },
  ACTIONS: {
    FIELD: 'actions',
    HEADER: 'Actions',
    FLEX: NUMBERMAP.HALF,
  },
}

export const NON_CONFORMANCE_DETAILS_FORM_FIELDS = {
  PART_CATEGORY: {
    LABEL: 'Part Category',
    FIELD: 'partCategory',
  },
  PART_NUMBER: {
    LABEL: 'Part Number',
    FIELD: 'partNumber',
  },
  PART_NAME: {
    LABEL: 'Part Name',
    FIELD: 'partName',
  },
  UNIT_BATCH: {
    LABEL: 'Unit / Batch',
    FIELD: 'unitBatch',
  },
  AQL: {
    LABEL: 'AQL',
    FIELD: 'aql',
  },
  BATCH_SERIAL_NO: {
    LABEL: 'Batch / Serial No.',
    FIELD: 'batchSerialNo',
  },
  DATE_INSPECTED: {
    LABEL: 'Date Inspected',
    FIELD: 'dateInspected',
  },
  TEST_OBSERVATION: {
    LABEL: 'Test Observation',
    PLACEHOLDER: '',
    FIELD: 'testObservation',
  },
  FLOOR: {
    LABEL: 'Floor',
    FIELD: 'floor',
  },
  ROOM: {
    LABEL: 'Room',
    FIELD: 'room',
  },
  SHELF_DETAILS: {
    LABEL: 'Shelf Details',
    FIELD: 'shelfDetails',
  },
  UNIT_NAME: {
    LABEL: 'Unit Name',
    FIELD: 'unitName',
  },
  ADDRESS: {
    LABEL: 'Address',
    FIELD: 'address',
  },
  DEFECT_DESCRIPTION: {
    LABEL: 'Defect Description*',
    PLACEHOLDER: 'Input Text',
    FIELD: 'defectDescription',
  },
  ACTION_PLANNED: {
    LABEL: 'Action Planned*',
    PLACEHOLDER: 'Select Action Planned',
    FIELD: 'actionPlanned',
  },
  RETURN_DETAILS: {
    LABEL: 'Description*',
    PLACEHOLDER: 'Input Text',
    FIELD: 'returnDetails',
  },
  SCRAP_DETAILS_1: {
    LABEL: 'Disposal Infrastructure/Remarks*',
    PLACEHOLDER: 'Input Text',
    FIELD: 'scrapDetails1',
  },
  SCRAP_DETAILS_2: {
    LABEL: 'Description',
    PLACEHOLDER: 'Input Text',
    FIELD: 'scrapDetails2',
  },
  REWORK_EMPLOYEE: {
    LABEL: 'Assign To*',
    PLACEHOLDER: 'Select Assign To',
    FIELD: 'reworkEmployee',
  },
  REWORK_DETAILS: {
    LABEL: 'Rework Instruction*',
    PLACEHOLDER: 'Input Text',
    FIELD: 'reworkDetails',
  },
}

export const INITIAL_NON_CONFORMANCE_DETAILS_FORM_DATA = {
  partCategory: '',
  partNumber: '',
  partName: '',
  unitBatch: '',
  aql: '',
  batchSerialNo: '',
  dateInspected: '',
  testObservation: '',
  floor: '',
  room: '',
  shelfDetails: '',
  unitName: '',
  address: '',
  defectDescription: '',
  actionPlanned: '',
  returnDetails: '',
  scrapDetails1: '',
  scrapDetails2: '',
  reworkEmployee: '',
  reworkDetails: '',
  documents: [],
}

export const ACTION_PLANNED_FIELD = 'actionPlanned'

export const ACTION_PLANNED_VALUES = {
  RETURN: 'return',
  SCRAP: 'scrap',
  REWORK: 'rework',
} as const

export const ACTION_PLANNED_OPTIONS = [
  { value: ACTION_PLANNED_VALUES.RETURN, label: 'Return', id: 1 },
  { value: ACTION_PLANNED_VALUES.SCRAP, label: 'Scrap', id: 2 },
  { value: ACTION_PLANNED_VALUES.REWORK, label: 'Rework', id: 3 },
]

export const VALIDATION_MESSAGES = {
  DEFECT_DESCRIPTION_REQUIRED: 'Defect Description is required',
  ACTION_PLANNED_REQUIRED: 'Action Planned is required',
  RETURN_DETAILS_REQUIRED: 'Return Details is required',
  SCRAP_DETAILS_1_REQUIRED: 'Disposal Infrastructure/Remarks is required',
  REWORK_EMPLOYEE_REQUIRED: 'Assign To is required',
  REWORK_DETAILS_REQUIRED: 'Rework Instruction is required',
}

export const ACTION_LABELS = {
  VIEW_DETAILS: 'View Details',
}

export const INSPECTION_RESULT_ID_FIELD = 'inspection_result_id'

export const ROUTE_PARAMS = {
  CREATE: 'create',
  NON_CONFORMANCE_ID_PARAM: 'non-conformance-id',
} as const

export const TYPE_CHECK = {
  OBJECT: 'object',
} as const

export const EMPLOYEE_DROPDOWN_FIELDS = {
  KEY_FIELD: 'id',
  VALUE_FIELD: 'employee_name',
} as const

export const SECTION_TITLES = {
  NON_CONFORMANCE_DETAILS: 'Non-Conformance Details',
  LOCATION_DETAILS: 'Location Details',
  DEFECT_DETAILS: 'Defect Details',
  RETURN_DETAILS: 'Return Details',
  SCRAP_DETAILS: 'Scrap Details',
  REWORK_DETAILS: 'Rework Details',
  FILE_UPLOAD: 'File Upload*',
}

export const ROUTES = {
  NON_CONFORMANCE_DETAILS_LIST: '/quality-control-management/non-conformance-details',
  NON_CONFORMANCE_DETAILS_CREATE: (inspectionResultId: number) =>
    `/quality-control-management/non-conformance-details/${inspectionResultId}`,
 } as const

export const DEFAULT_STATUS = NUMBERMAP.ONE
