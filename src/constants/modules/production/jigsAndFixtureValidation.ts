/**
 * Classification : Confidential
 **/

// Base URL for production APIs
const PRODUCTION_BASE_URL = 'api/v1/production';

// API Endpoints
export const API_ENDPOINTS = {
  FETCH_JIG_FIXTURE_VALIDATION_ALL: `${PRODUCTION_BASE_URL}/jig-fixture-validation/all`,
  FETCH_JIG_FIXTURE_VALIDATION_BY_ID: (jig_fixture_validation_id: number) =>
    `${PRODUCTION_BASE_URL}/jig-fixture-validation/${jig_fixture_validation_id}`,
  UPSERT_JIG_FIXTURE_VALIDATION: `${PRODUCTION_BASE_URL}/jig-fixture-validation/`,
  DELETE_JIG_FIXTURE_VALIDATION: (jig_fixture_validation_id: number) =>
    `${PRODUCTION_BASE_URL}/jig-fixture-validation/${jig_fixture_validation_id}`,
} as const;

// Query Keys
export const FETCH_JIG_FIXTURE_VALIDATION_LIST_KEY = 'fetchJigFixtureValidationList';
export const FETCH_JIG_FIXTURE_VALIDATION_BY_ID_KEY = 'fetchJigFixtureValidationById';

// Table Field Names
export const TABLE_FIELDS = {
  SNO: 'sno',
  JIGS_TYPE: 'jigs_type',
  STATUS: 'status',
  ACTION: 'action',
} as const;

// Table Header Names
export const TABLE_HEADERS = {
  SNO: 'S.No.',
  JIGS_TYPE: 'Jigs Type',
  STATUS: 'Status',
  ACTION: 'Action',
} as const;

// Table Configuration
export const TABLE_ID_FIELD = 'jig_fixture_validation_id';
export const TABLE_TITLE = 'Jigs and Fixture Validation Acceptance Criteria';

// Error Messages
export const ERROR_MESSAGES = {
  JIGS_TYPE_REQUIRED: 'Jigs Type is required',
  STATUS_REQUIRED: 'Status is required',
  ACCEPTANCE_CRITERIA_REQUIRED: 'Acceptance Criteria is required',
  EXPECTED_RESULT_REQUIRED: 'Expected Result is required',
  ACCEPTANCE_CRITERIA_LIST_REQUIRED: 'At least one Acceptance Criteria is required',
  JIG_FIXTURE_VALIDATION_ID_REQUIRED: 'jig_fixture_validation_id is required',
} as const;

// Modal Titles
export const MODAL_TITLES = {
  EDIT_MAIN: 'Edit Jigs and Fixture Validation Acceptance Criteria',
  ADD_MAIN: 'Add Jigs and Fixture Validation Acceptance Criteria',
  EDIT_ACCEPTANCE_CRITERIA: 'Edit Acceptance Criteria',
  ADD_ACCEPTANCE_CRITERIA: 'Add Acceptance Criteria',
} as const;

// Form Labels
export const FORM_LABELS = {
  JIGS_TYPE: 'Jigs Type*',
  STATUS: 'Status*',
  ACCEPTANCE_CRITERIA: 'Acceptance Criteria*',
  EXPECTED_RESULT: 'Expected Result*',
} as const;

// Form Placeholders
export const FORM_PLACEHOLDERS = {
  SELECT_JIGS_TYPE: 'Select Jigs Type',
  SELECT_STATUS: 'Select Status',
  ENTER_ACCEPTANCE_CRITERIA: 'Enter Acceptance Criteria',
  ENTER_EXPECTED_RESULT: 'Enter Expected Result',
} as const;

// Field Names (keyField, valueField)
export const FIELD_NAMES = {
  JIGS_TYPE_ID: 'jigs_type_id',
  JIGS_TYPE_NAME: 'jigs_type_name',
  STATUS_ID: 'status_id',
  STATUS_NAME: 'status_name',
} as const;

// DataGrid Field Names
export const DATA_GRID_FIELDS = {
  SNO: 'sno',
  ACCEPTANCE_CRITERIA: 'acceptance_criteria',
  EXPECTED_RESULT: 'expected_result',
  STATUS: 'status',
  ACTION: 'action',
  ID: 'id',
} as const;

// DataGrid Header Names
export const DATA_GRID_HEADERS = {
  SNO: 'S.No.',
  ACCEPTANCE_CRITERIA: 'Acceptance Criteria',
  EXPECTED_RESULT: 'Expected Result',
  STATUS: 'Status',
  ACTION: 'Action',
} as const;

// DataGrid Configuration
export const DATA_GRID_CONFIG = {
  TITLE: 'Acceptance Criteria',
  ID_FIELD: 'id',
} as const;

