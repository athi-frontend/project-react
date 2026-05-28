/**
 *Classification : Confidential
 **/

// Base API endpoint for risk management
const RISK_API_BASE_URL = '/api/v1/risk'

export const RESIDUAL_RISK_CRITERIA_API_ENDPOINTS = {
  FETCH_CRITERIA: `${RISK_API_BASE_URL}/residual-risk-acceptability-criteria/all/`,
  SUBMIT_CRITERIA: `${RISK_API_BASE_URL}/residual-risk-acceptability-criteria`,
  RISK_SUBCATEGORY_ALL: `${RISK_API_BASE_URL}/subcategory/all`,
  RISK_SUBCATEGORY_MULTIPLE: `${RISK_API_BASE_URL}/subcategory/all`,
}

export const RESIDUAL_RISK_CRITERIA_QUERY_KEYS = {
  CRITERIA_FETCH_QUERY_KEY: 'residual-risk-criteria-fetch',
  RISK_SUBCATEGORY_QUERY_KEY: 'risk-subcategory',
}

export const RESIDUAL_RISK_CRITERIA_FORM_LABELS = {
  TITLE: 'Cumulative Residual Risk Level Acceptability Criteria',
  ACCEPTANCE_CRITERIA_DESCRIPTION: 'Acceptance Criteria Description*',
  SEVERITY_LEVEL: 'Severity Level*',
  MAX_ALLOWED : 'Max Allowed*',
  OPERATOR: 'Operator*',
  PROBABILITY_LEVEL: 'Probability Level*',
}

export const RESIDUAL_RISK_CRITERIA_FORM_PLACEHOLDERS = {
  ACCEPTANCE_CRITERIA_DESCRIPTION: 'Enter Acceptance Criteria Description',
  SEVERITY_LEVEL: 'Select Severity Level',
  MAX_ALLOWED : 'Enter Max Allowed',
  OPERATOR: 'Select Operator',
  PROBABILITY_LEVEL: 'Select Probability Level',
}

export const RESIDUAL_RISK_CRITERIA_SECTIONS = {
  PATIENT_SURVIVAL: 'Patient Survival',
  QUALITY_OF_LIFE: 'Quality of Life Improvement',
  FUNCTION_PRESERVATION: 'Function Preservation',
  FUNCTION_ENHANCEMENT: 'Function Enhancement',
  SYMPTOM_RELIEF: 'Symptom Relief',
  LIFE_SUPPORT: 'Life Support',
  DURATION_OF_EFFECT: 'Duration of Effect',
}

export const RESIDUAL_RISK_CRITERIA_ERROR_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_DATA: 'Invalid data provided',
  SAVE_ERROR: 'Failed to save criteria',
  FETCH_ERROR: 'Failed to fetch criteria',
  // Field-specific error messages
  ACCEPTANCE_CRITERIA_DESCRIPTION_REQUIRED:
    'Acceptance Criteria Description is required',
  MAX_ALLOWED_REQUIRED: 'Max Allowed is required',
  SEVERITY_LEVEL_REQUIRED: 'Severity Level is required',
  OPERATOR_REQUIRED: 'Operator is required',
  PROBABILITY_LEVEL_REQUIRED: 'Probability Level is required',
}

export const RESIDUAL_RISK_CRITERIA_ALERT_MESSAGES = {
  DUPLICATE_COMBINATION_TITLE: 'Duplicate Probability & Severity',
  DUPLICATE_COMBINATION_DESCRIPTION:
    'The same Probability Level and Severity Level combination cannot be used in multiple sections. Please choose a unique combination.',
}

export const RESIDUAL_RISK_CRITERIA_REQUIRED_FIELDS = [
  'description',
  'maxAllowed',
  'severityLevel',
  'operator',
  'probabilityLevel',
]

export const RESIDUAL_RISK_CRITERIA_SECTION_IDS = {
  PATIENT_SURVIVAL: 'patientSurvival',
  QUALITY_OF_LIFE: 'qualityOfLife',
  FUNCTION_PRESERVATION: 'functionPreservation',
  FUNCTION_ENHANCEMENT: 'functionEnhancement',
  SYMPTOM_RELIEF: 'symptomRelief',
  LIFE_SUPPORT: 'lifeSupport',
  DURATION_OF_EFFECT: 'durationOfEffect',
}

export const RESIDUAL_RISK_CRITERIA_FIELD_NAMES = {
  DESCRIPTION: 'description',
  SEVERITY_LEVEL: 'severityLevel',
  OPERATOR: 'operator',
  PROBABILITY_LEVEL: 'probabilityLevel',
}

export const RESIDUAL_RISK_CRITERIA_API_FIELD_MAPPINGS = {
  ACCEPTANCE_CRITERIA_DESCRIPTION: 'acceptance_criteria_description',
  SEVERITY_LEVEL_ID: 'severity_level_id',
  PROBABILITY_LEVEL_ID: 'probability_level_id',
  OPERATOR_ID: 'operator_id',
}

export const RESIDUAL_RISK_CRITERIA_DROPDOWN_FIELD_MAPPINGS = {
  SEVERITY_LEVEL: {
    KEY_FIELD: 'id',
    VALUE_FIELD: 'level_name',
  },
  OPERATOR: {
    KEY_FIELD: 'operator_id',
    VALUE_FIELD: 'operator_name',
  },
  PROBABILITY_LEVEL: {
    KEY_FIELD: 'id',
    VALUE_FIELD: 'level_name',
  },
}

export const FIELD_LABEL_MAP = {
  description: 'Acceptance Criteria Description*',
  maxAllowed: 'Max Allowed*',
  severityLevel: 'Severity Level*',
  operator: 'Operator*',
  probabilityLevel: 'Probability Level*',
} as const

export const FIELD_ORDER = Object.keys(FIELD_LABEL_MAP)