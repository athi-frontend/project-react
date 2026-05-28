/**
 * Infrastructure Qualification Constants
 * Classification: Confidential
 */

import dayjs from "dayjs"

const BASE_API_PATH = 'api/v1/infrastructure/infrastructure-qualification'

export const API_ENDPOINTS = {
  FETCH_ALL: `${BASE_API_PATH}/all`,
  FETCH_BY_ID: (infrastructureQualificationId:  number | null) =>
    `${BASE_API_PATH}/${infrastructureQualificationId}`,
  CREATE: `${BASE_API_PATH}/`,
  DELETE: (infrastructureQualificationId:  number | null) =>
    `${BASE_API_PATH}/${infrastructureQualificationId}`,
  FETCH_QUALIFICATION_CHECKLIST: (infrastructureId:  number | null) =>
    `api/v1/infrastructure/qualification-checklist/${infrastructureId}`,
}



export const INITIAL_FORM_DATA = {
  infrastructure_id: '',
  infrastructure_qualification_id: '',
  infrastructure_qualification_checklist_id: '',
  infrastructure_category_id: '',
  infrastructure_type_id: '',
  serial_number: '',
  infrastructure_name: '',
  application_of_infrastructure: '',
  qualification_procedure_and_acceptance_criteria: '',
  inspection_done_by: '',
  maintenance_service_id: '',
  inspection_date: null as dayjs.Dayjs | null,
  status: '',
}

export const INITIAL_ERRORS = {
  infrastructure_category_id: '',
  infrastructure_type_id: '',
  infrastructure_id: '',
  application_of_infrastructure: '',
  qualification_procedure_and_acceptance_criteria: '',
  inspection_done_by: '',
  inspection_date: '',
  status: '',
}

export const VERIFICATION_RESULT_VALUES = {
  PASS: 'Pass',
  FAIL: 'Fail',
} as const

export const BUTTON_LABELS = {
  CANCEL: 'Cancel',
  SAVE: 'Save',
} as const

export const PAGE_TITLES = {
  INFRASTRUCTURE_QUALIFICATION: 'Infrastructure Qualification',
} as const

export const PLACEHOLDERS = {
  SELECT_INFRASTRUCTURE_CATEGORY: 'Select Infrastructure Category',
  SELECT_INFRASTRUCTURE_TYPE: 'Select Infrastructure Type',
  SELECT_SERIAL_NO: 'Select Serial No.',
  INPUT_TEXT: 'Input Text',
  OBSERVATION: 'Observation',
  SELECT_INSPECTION_DONE_BY: 'Select Inspection Done by',
  SELECT_STATUS: 'Select Status',
} as const

export const FORM_LABELS = {
  INFRASTRUCTURE_TYPE: 'Infrastructure Type*',
  SERIAL_NO: 'Serial No.*',
  INFRASTRUCTURE_NAME: 'Infrastructure Name',
  APPLICATION_OF_INFRASTRUCTURE: 'Application of Infrastructure*',
  QUALIFICATION_PROCEDURE_AND_ACCEPTANCE_CRITERIA:
    'Qualification Procedure and Acceptance Criteria*',
  INSPECTION_DONE_BY: 'Inspection Done by*',
  INSPECTION_DATE: 'Inspection Date*',
  STATUS: 'Status*',
} as const

export const TABLE_COLUMN_HEADERS = {
  SNO: 'S.No.',
  TEST_PERFORMED: 'Test Performed',
  ACCEPTANCE_CRITERIA: 'Acceptance Criteria',
  TEST_OBSERVATION: 'Test Observation',
  RESULT: 'Result',
  INFRASTRUCTURE_CATEGORY: 'Infrastructure Category',
  INFRASTRUCTURE_TYPE: 'Infrastructure Type',
  INFRASTRUCTURE_NAME: 'Infrastructure Name',
  INFRASTRUCTURE_SERIAL_NUMBER: 'Infrastructure Serial No.',
  STATUS: 'Status',
  ACTIONS: 'Actions',
} as const

export const TABLE_COLUMN_FIELDS = {
  SNO: 'sno',
  INFRASTRUCTURE_NAME: 'infrastructure_name',
  INFRASTRUCTURE_CATEGORY : 'infrastructure_category',
  INFRASTRUCTURE_TYPE: 'infrastructure_type',
  INFRASTRUCTURE_SERIAL_NUMBER: 'infrastructure_serial_number',
  STATUS: 'status',
  ACTION: 'action',
  TEST_PERFORMED: 'test_performed',
  ACCEPTANCE_CRITERIA: 'acceptance_criteria',
  TEST_OBSERVATION: 'test_observation',
  VERIFICATION_RESULT: 'verification_result',
} as const

export const ROUTES = {
  CREATE: '/infrastructure-management/infrastructure-qualification/create',
  LIST : '/infrastructure-management/infrastructure-qualification',
    EDIT: (infrastructureQualificationId: string | number) =>
    `/infrastructure-management/infrastructure-qualification/${infrastructureQualificationId}`,
} as const


export const FORM_FIELD_NAMES = {
  INFRASTRUCTURE_CATEGORY_ID: 'infrastructure_category_id',
  INFRASTRUCTURE_TYPE_ID: 'infrastructure_type_id',
  INFRASTRUCTURE_ID : 'infrastructure_id',
  SERIAL_NUMBER: 'serial_number',
  APPLICATION_OF_INFRASTRUCTURE: 'application_of_infrastructure',
  QUALIFICATION_PROCEDURE_AND_ACCEPTANCE_CRITERIA:
    'qualification_procedure_and_acceptance_criteria',
  INSPECTION_DONE_BY: 'inspection_done_by',
  INSPECTION_DATE: 'inspection_date',
  STATUS: 'status',
} as const

export const KEY_FIELDS = {
  INFRASTRUCTURE_CATEGORY_ID: 'infrastructure_category_id',
  INFRASTRUCTURE_TYPE_ID: 'infrastructure_type_id',
  INFRASTRUCTURE_ID: 'infrastructure_id',
  ID: 'id',
  QUALIFICATION_TEST_ID: 'qualification_checklist_items_id',
  INFRASTRUCTURE_QUALIFICATION_ID: 'infrastructure_qualification_id',
  STATUS_ID: 'status_id',
} as const

export const VALUE_FIELDS = {
  INFRASTRUCTURE_CATEGORY_NAME: 'infrastructure_category_name',
  INFRASTRUCTURE_TYPE_NAME: 'infrastructure_type_name',
  SERIAL_NUMBER: 'serial_number',
  MAINTENANCE_SERVICE_TYPE: 'maintenance_service_type',
  STATUS_NAME: 'status_name',
} as const

export const INFRASTRUCTURE_QUALIFICATION = {
  FORM_CONSTANTS: {
    INFRASTRURE_CATEGORY: {
      LABELS: 'Infrastructure Category*',
    },
  },
  CONTEXT_TYPE: 'infrastructure_qualification',
} as const


export const ERROR_MESSAGES = {
  INFRASTRUCTURE_CATEGORY: "Infrastructure Category is required",
  INFRASTRUCTURE_TYPE: "Infrastructure Type is required",
  SERIAL_NO: "Serial No. is required",
  APPLICATION_OF_INFRASTRUCTURE: "Application of Infrastructure is required",
  QUALIFICATION_PROCEDURE: "Qualification Procedure and Acceptance Criteria is required",
  INSPECTION_DONE_BY: "Inspection Done By is required",
  INSPECTION_DATE: "Inspection Date is required",
  STATUS: "Status is required",
  QUALIFICATION_RESULT_REQUIRED: "All Test Results must be selected",
  TEST_OBSERVATION_REQUIRED: "Test Observation is required for Failed Tests",
} as const  



export const INFRASTRUCTURE_QUALIFICATION_QUERY_KEYS = {
  FETCH_ALL: 'infrastructure-qualification-all',
  FETCH_BY_ID: 'infrastructure-qualification-by-id',
  UPSERT: 'infrastructure-qualification-upsert',
  DELETE: 'infrastructure-qualification-delete',
  FETCH_QUALIFICATION_CHECKLIST: 'infrastructure-qualification-checklist',
} as const




export const STYLES = {
  ERROR_TEXT_PADDING: '0 0 0 40px ',
} as const

export const Error_Style = { padding: STYLES.ERROR_TEXT_PADDING }
export const TABLE_FIELD_NAMES = {
  SNO: 'sno',
  TEST_PERFORMED: 'test_performed',
  ACCEPTANCE_CRITERIA: 'acceptance_criteria',
  TEST_OBSERVATION: 'test_observation',
  VERIFICATION_RESULT: 'verification_result',
} as const

export const DisplayNone = { display: 'none' }
