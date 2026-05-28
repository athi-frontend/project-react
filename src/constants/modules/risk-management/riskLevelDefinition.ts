/**
 *Classification : Confidential
 **/
export const RISK_DEFINITION_LEVEL_CONSTANTS = {
  TABS: {
    PROBABILITY_LEVELS: 'Probability Levels',
    SEVERITY_LEVELS: 'Severity Levels',
  },
  HEADINGS: {
    PROBABILITY_LEVELS: 'Probability Levels',
    SEVERITY_LEVELS: 'Severity Levels',
  },
  ACTIONS: {
    EDIT: 'Edit',
  },
  LEVEL_TYPES: {
    PROBABILITY: 'probability' as const,
    SEVERITY: 'severity' as const,
  },
  MODAL_TITLES: {
    EDIT_PROBABILITY_LEVELS: 'Edit Probability Levels',
    EDIT_SEVERITY_LEVEL: 'Edit Severity Level',
  },
  FIELD_NAMES: {
    LEVEL_NAME: 'level_name',
    LEVEL_VALUE: 'level_value',
    NUMERATOR: 'numerator',
    DENOMINATOR: 'denominator',
    DESCRIPTION: 'description',
  },
  FIELD_LABELS: {
    PROBABILITY_NAME: 'Probability Name',
    SEVERITY_NAME: 'Severity Name',
    LEVEL_VALUE: 'Value',
    NUMERATOR: 'Numerator*',
    DENOMINATOR: 'Denominator*',
    DESCRIPTION: 'Description*',
  },
  FIELD_PLACEHOLDERS: {
    LEVEL_NAME: 'Enter Level Name',
    LEVEL_VALUE: 'Enter Level Value',
    NUMERATOR: 'Enter Numerator',
    DENOMINATOR: 'Enter Denominator',
    DESCRIPTION: 'Enter Description',
  },
  ERROR_MESSAGES: {
    LEVEL_NAME_REQUIRED: 'Level name is required',
    LEVEL_VALUE_REQUIRED: 'Level value is required',
    LEVEL_VALUE_RANGE_INVALID: 'Level value must be between -999.99999 and 999.99999',
    PROBABILITY_VALUE_RANGE_INVALID: 'Calculated probability value must be between -999.99999 and 999.99999',
    NUMERATOR_REQUIRED: 'Valid Numerator is required',
    DENOMINATOR_REQUIRED: 'Valid Denominator is required',
    DESCRIPTION_REQUIRED: 'Description is required',
  },
  VALIDATION_LIMITS: {
    SEVERITY_LEVEL_VALUE_MIN: -999.99999,
    SEVERITY_LEVEL_VALUE_MAX: 999.99999,
  },
}

// API URL Constants
const RISK_API_BASE_URL = '/api/v1/risk/'
const PROBABILITY_LEVEL_END_URL = 'probability-level/'
const SEVERITY_LEVEL_END_URL = 'severity-level/'

export const RISK_DEFINITION_LEVEL_API_ENDPOINTS = {
  GET_ALL_PROBABILITY_LEVELS: `${RISK_API_BASE_URL}${PROBABILITY_LEVEL_END_URL}all`,
  GET_PROBABILITY_LEVEL_BY_ID: (projectId: number, templateId: number) =>
    `${RISK_API_BASE_URL}${PROBABILITY_LEVEL_END_URL}?project_id=${projectId}&template_id=${templateId}`,
  UPSERT_PROBABILITY_LEVEL: `${RISK_API_BASE_URL}${PROBABILITY_LEVEL_END_URL}`,
  GET_ALL_SEVERITY_LEVELS: `${RISK_API_BASE_URL}${SEVERITY_LEVEL_END_URL}all`,
  GET_SEVERITY_LEVEL_BY_ID: (projectId: number, templateId: number) =>
    `${RISK_API_BASE_URL}${SEVERITY_LEVEL_END_URL}?project_id=${projectId}&template_id=${templateId}`,
  UPSERT_SEVERITY_LEVEL: `${RISK_API_BASE_URL}${SEVERITY_LEVEL_END_URL}`,
}

export const PROBABILITY_LEVEL_FIELD_LABEL_MAP = {
  numerator: 'Numerator*',
  denominator: 'Denominator*',
  description: 'Description*',
} as const

export const PROBABILITY_LEVEL_FIELD_ORDER = Object.keys(PROBABILITY_LEVEL_FIELD_LABEL_MAP)

export const SEVERITY_LEVEL_FIELD_LABEL_MAP = {
  description: 'Description*',
} as const

export const SEVERITY_LEVEL_FIELD_ORDER = Object.keys(SEVERITY_LEVEL_FIELD_LABEL_MAP)
