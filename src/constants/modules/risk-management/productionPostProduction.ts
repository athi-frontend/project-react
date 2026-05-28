/**
 * Classification: Confidential
 */
// Base API path
const BASE_API_PATH = 'api/v1/risk/production-post-production'

// API Endpoints
export const API_ENDPOINTS = {
  GET_PRODUCTION_POST_PRODUCTION: `${BASE_API_PATH}/all`,
  POST_PRODUCTION_POST_PRODUCTION_API: BASE_API_PATH,
}

// Form field labels
export const FORM_LABELS = {
  PRODUCTION_AND_POST_PRODUCTION_INFO: 'Production and Post-Production Info',
  FEEDBACK_PRODUCTION_MANUFACTURING_ACTIONS:
    'Feedback collected from production processes and manufacturing activities',
  OUTGOING_QUALITY_CONTROL_ACTIONS:
    'Outgoing Quality Control rejection data and analysis',
  CUSTOMER_END_USER_FEEDBACK_ACTIONS:
    'Feedback received from customers and end users',
  FORMAL_COMPLAINTS_ACTIONS: 'Formal complaints filed by customers or users',
  ADVERSE_EVENTS_SAFETY_INCIDENTS_ACTIONS:
    'Adverse events and safety incidents reported',
  POST_MARKET_SURVEILLANCE_ACTIONS:
    'Post-market surveillance data and monitoring results',
  POST_MARKET_CLINICAL_FOLLOWUP_ACTIONS:
    'Post-market clinical follow-up studies and data',
}

// Placeholder text
export const PLACEHOLDERS = {
  ACTIONS_TO_BE_PERFORMED: 'Actions to be performed',
}

// Form field names for onChange handlers
export const FORM_FIELD_NAMES = {
  PRODUCTION_FEEDBACK: 'productionFeedback',
  QUALITY_CONTROL_DATA: 'qualityControlData',
  CUSTOMER_FEEDBACK: 'customerFeedback',
  FORMAL_COMPLAINTS: 'formalComplaints',
  ADVERSE_EVENTS: 'adverseEvents',
  POST_MARKET_SURVEILLANCE: 'postMarketSurveillance',
  CLINICAL_FOLLOW_UP: 'clinicalFollowUp',
} as const

// Context type for workflow integration
export const CONTEXT_TYPE = {
  RISK_MANAGEMENT_PLAN: 'risk_management_plan',
} as const
