/**
 * Risk Analysis Control Constants
 * Classification: Confidential
 */

export const RISK_CATEGORY_CONSTANTS = {
  HAZARDS_LINK_TEXT: 'Hazards',
  VIEW_RISK_LINK_TEXT: 'View Risk',
  VIEW_RCM_LINK_TEXT: 'View Risk Control Measure',
  INPUT_PLACEHOLDER: 'Input Text',
  SAVE_BUTTON: 'Save',
  CANCEL_BUTTON: 'Cancel',
  FORM_VALIDATION: {
    REQUIRED_FIELD: 'This field is required',
    SUBCATEGORY_RESPONSE_REQUIRED_TITLE: 'Answer Required',
    SUBCATEGORY_RESPONSE_REQUIRED_TEXT:
      'Answer is required for the selected sub category',
  },
  WARNING_MESSAGES: {
    UNCHECK_SUBCATEGORY_TITLE: 'Remove Sub-category',
    UNCHECK_SUBCATEGORY_MESSAGE:
      'Unchecking this sub-category will remove all related hazard, risk, and RCM data. Are you sure you want to continue?',
    CANCEL_BUTTON: 'Cancel',
  },
  ACCEPTABILITY_FIELD: 'acceptability-field',
}

export const SUBCATEGORY_RESPONSE_REQUIRED_MODES = [
  'risk-assessment',
  'risk-control-measure',
] as const

export const ADD_RISK_MODAL_CONSTANTS = {
  MODAL_TITLE: 'Create Risk',
  MODAL_TITLE_EDIT: 'Edit Risk',
  MODAL_MAX_WIDTH: '900px',
  FORM_LABELS: {
    RISK_TITLE: 'Risk Title*',
    RISK_DESCRIPTION: 'Risk Description*',
    PROBABILITY: 'Probability*',
    SEVERITY: 'Severity*',
  },
  PLACEHOLDERS: {
    ENTER_TITLE: 'Enter Title',
    ENTER_RISK_DESCRIPTION: 'Enter Risk Description',
    SELECT_PROBABILITY: 'Select Probability',
    SELECT_SEVERITY: 'Select Severity',
  },
  BUTTONS: {
    ACCEPTABLE: 'Acceptable',
    NOT_ACCEPTABLE: 'Not Acceptable',
    SAVE: 'Save',
    CANCEL: 'Cancel',
  },
  VALIDATION_MESSAGES: {
    RISK_TITLE_REQUIRED: 'Risk Title is required',
    RISK_DESCRIPTION_REQUIRED: 'Risk Description is required',
    PROBABILITY_REQUIRED: 'Probability is required',
    SEVERITY_REQUIRED: 'Severity is required',
    RISK_ASSESSMENT_MATRIX_NOT_DEFINED: 'Risk Assessment Matrix is not defined',
  },
  FIELD_NAMES: {
    TITLE: 'title' as const,
    DESCRIPTION: 'description' as const,
    PROBABILITY: 'probability' as const,
    SEVERITY: 'severity' as const,
  },
  UI_CONSTANTS: {
    VARIANT_CONTAINED: 'contained' as const,
    KEY_FIELD: 'id' as const,
    VALUE_FIELD: 'name' as const,
  },
}

export const ADD_RCM_MODAL_CONSTANTS = {
  MODAL_TITLE: 'Risk Control Measure',
  MODAL_MAX_WIDTH: '900px',
  FORM_LABELS: {
    RCM_TITLE: 'Risk Control Measure*',
    DESCRIPTION: 'Description*',
    RISK_TYPE: 'Risk Type*',
    PROBABILITY: 'Probability*',
    SEVERITY: 'Severity*',
    CONTROL_EFFECTIVENESS: 'Control Effectiveness*',
    RATIONALE: 'Rationale*',
    RCM_INDUCED_HAZARD_IDENTIFIED: 'RCM Induced Hazard Identified',
  },
  PLACEHOLDERS: {
    ENTER_TITLE: 'Enter Title',
    ENTER_DESCRIPTION: 'Enter Description',
    ENTER_RATIONALE: 'Enter Rationale',
    SELECT_RISK_TYPE: 'Select Risk Type',
    SELECT_PROBABILITY: 'Select Probability',
    SELECT_SEVERITY: 'Select Severity',
    ENTER_CONTROL_EFFECTIVENESS: 'Enter Control Effectiveness',
    SELECT_SPECIFICATION: 'Select Specification',
  },
  BUTTONS: {
    ACCEPTABLE: 'Acceptable',
    NOT_ACCEPTABLE: 'Not Acceptable',
    SAVE: 'Save',
    CANCEL: 'Cancel',
  },
  VALIDATION_MESSAGES: {
    RCM_TITLE_REQUIRED: 'Risk Control Measure is required',
    DESCRIPTION_REQUIRED: 'Description is required',
    RATIONALE_REQUIRED: 'Rationale is required',
    RISK_TYPE_REQUIRED: 'Risk Type is required',
    PROBABILITY_REQUIRED: 'Probability is required',
    SEVERITY_REQUIRED: 'Severity is required',
    CONTROL_EFFECTIVENESS_REQUIRED: 'Control Effectiveness is required',
  },
  FIELD_NAMES: {
    TITLE: 'title',
    DESCRIPTION: 'description',
    RATIONALE: 'rationale',
    RCM_TYPE_ID: 'rcmTypeId',
    PROBABILITY: 'probability',
    SEVERITY: 'severity',
    CONTROL_EFFECTIVENESS: 'controlEffectiveness',
    RCM_INDUCED_HAZARD_IDENTIFIED: 'rcmInducedHazardIdentified',
  },
  INDUCED_HAZARD_OPTIONS: [
    { value: 'yes', label: 'Yes' },
    { value: 'no', label: 'No' },
  ],
}

export const COMMON_FIELD_CONSTANTS = {
  KEY_FIELD: 'id',
  VALUE_FIELD: 'name',
}

export const REFERENCE_RCM_FIELD_CONSTANTS = {
  KEY_FIELD: 'id',
  VALUE_FIELD: 'rcmTitle',
}

// Context type for workflow integration
export const CONTEXT_TYPE = {
  RISK_CONTROL_MEASURE: 'risk_control_measure',
} as const

export const HAZARD_LIST_CONSTANTS = {
  ADD_HAZARD: 'Add Hazard',
  ADD_RISK: 'Add Risk',
  ADD_RCM: 'Add RCM',
  BACK_BUTTON_ARIA_LABEL: 'Go back to previous page',
  NO_HAZARD_MESSAGE: 'No Hazards found for this Sub Category.',
  NO_RISK_MESSAGE: 'No Risks added for this Hazard.',
  NO_RCM_MESSAGE: 'No RCMs added for this Risk.',
  NO_SUBCATEGORY_FOUND: 'There are no Questions to display for this Category.',
}

export const MAIN_PAGE_CONSTANTS = {
  LOADING_MESSAGE: 'Loading...',
  ERROR_MESSAGE: 'An error occurred',
  SUCCESS_MESSAGE: 'Operation completed successfully',
  CONFIRM_DELETE: 'Are you sure you want to delete this item?',
  NO_DATA_MESSAGE: 'No data available',
}

export const RISK_CATEGORY_ROUTES = {
  RISK_MANAGEMENT: '/risk-management',
}

/** Base API path for all Risk Management module endpoints */
const BASE_API_PATH = 'api/v1/risk'

export const API_ENDPOINTS = {
  FETCH_CATEGORIES: `${BASE_API_PATH}/category/all`,
  FETCH_SUBCATEGORIES: `${BASE_API_PATH}/subcategory/all`,
  UPSERT_CATEGORY: `${BASE_API_PATH}/subcategory`,
  // Risk Management Endpoints
  UPSERT_RISK: () => `${BASE_API_PATH}/risk/`,
  FETCH_RISK_BY_ID: (riskId: number) => `${BASE_API_PATH}/risk/${riskId}`,
  DELETE_RISK: (riskId: number) => `${BASE_API_PATH}/risk/${riskId}`,
  // RCM Endpoints
  FETCH_RCM: (rcmId: number) => `${BASE_API_PATH}/rcm/${rcmId}`,
  UPSERT_RCM: () => `${BASE_API_PATH}/rcm/`,
  DELETE_RCM: (rcmId: number) => `${BASE_API_PATH}/rcm/${rcmId}`,
  // Dropdown Endpoints
  FETCH_PROBABILITY_LEVELS: (projectId: number) =>
    `${BASE_API_PATH}/probability-level/all?project_id=${projectId}`,
  FETCH_SEVERITY_LEVELS: (projectId: number) =>
    `${BASE_API_PATH}/severity-level/all?project_id=${projectId}`,
  FETCH_RISK_IDENTIFICATION_METHODS: () =>
    `${BASE_API_PATH}/risk-identification`,
  FETCH_RCM_TYPES: () => `${BASE_API_PATH}/rcm-type/all`,
  FETCH_RISK_ACCEPTABILITY: () => `${BASE_API_PATH}/acceptability`,
}

// Hazard Management Constants
export const HAZARD_API_ENDPOINTS = {
  /** Fetch all hazards for a risk applicability */
  FETCH_ALL: (subcategoryApplicabilityId: number) =>
    `${BASE_API_PATH}/hazard/all?subcategory_applicability_id=${subcategoryApplicabilityId}`,

  /** Fetch specific hazard by ID */
  FETCH_BY_ID: (hazardId: number) => `${BASE_API_PATH}/hazard/${hazardId}`,

  /** Upsert hazard (create or update) */
  UPSERT: `${BASE_API_PATH}/hazard/`,

  /** Delete hazard by ID */
  DELETE: (hazardId: number) => `${BASE_API_PATH}/hazard/${hazardId}`,
}

export const HARM_API_ENDPOINTS = {
  /** Fetch all harm options for dropdown */
  FETCH_ALL: `${BASE_API_PATH}/harm/all`,
}

export const REFERENCE_RCM_API_ENDPOINTS = {
  /** Fetch all RCM options for reference dropdown */
  FETCH_ALL: `${BASE_API_PATH}/rcm/list/all`,
}

// Add Hazard Modal Constants
export const ADD_HAZARD_MODAL_CONSTANTS = {
  // Modal titles
  MODAL_TITLE_ADD: 'Add Hazard',
  MODAL_TITLE_EDIT: 'Edit Hazard',

  // Form labels
  LABEL_REFERENCE_RCM: 'Reference to Existing RCM',
  LABEL_HAZARD_EVENT: 'Hazard/Hazardous Event*',
  LABEL_HARM: 'Harm*',
  LABEL_HARM_TO: 'Harm To*',

  // Placeholders
  PLACEHOLDER_REFERENCE_RCM: 'Select Reference to Existing RCM',
  PLACEHOLDER_HAZARD_EVENT: 'Enter Hazard / Hazardous Event',
  PLACEHOLDER_HARM: 'Enter Harm',
  PLACEHOLDER_HARM_TO: 'Select entities that can be harmed',
  PLACEHOLDER_HARM_TO_DISPLAY: 'Select entities that can be harmed',

  // Error messages
  ERROR_HAZARD_EVENT_REQUIRED: 'Hazard/Hazardous Event is required',
  ERROR_HARM_REQUIRED: 'Harm is required',
  ERROR_HARM_TO_REQUIRED: 'At least one Harm To option must be selected',

  // Button labels
  BUTTON_CANCEL: 'Cancel',
  BUTTON_SAVE: 'Save',

  // Default form values
  DEFAULT_REFERENCE_RCM: '',
  DEFAULT_HAZARD_EVENT: '',
  DEFAULT_HARM: '',
  DEFAULT_HARM_TO: [],
  DEFAULT_HARM_IDS: [],

  // Modal configuration
  MODAL_MAX_WIDTH: '900px',

  // Display text
  ELLIPSIS: '...',

  // Form field names
  FIELD_REFERENCE_RCM: 'referenceRcm',
  FIELD_HAZARD_EVENT: 'hazardEvent',
  FIELD_HARM: 'harm',
  FIELD_HARM_TO: 'harmTo',

  // MultiSelect field names
  FIELD_ID: 'id',
  FIELD_NAME: 'name',
} as const

export const ACCESS_DENIED_CONSTANTS = {
  HEADING: 'Access Restricted',
  DESCRIPTION:
    'Cannot access this page, until Applicability is selected for the Project',
} as const

// RCM Approval Status Constants
export const RCM_APPROVAL_STATUS = {
  APPROVED: 'Approved',
} as const

// RCM Action Constants
export const RCM_ACTION_CONSTANTS = {
  RISK_DELETE_BLOCKED_MESSAGE:
    'Please delete RCM created for this Risk to delete the Risk',
  HAZARD_DELETE_BLOCKED_MESSAGE:
    'Please delete Risk created for this Hazard to delete the Hazard',
  CANNOT_DELETE_HAZARD_TITLE: 'Cannot Delete Hazard',
  CANNOT_DELETE_RISK_TITLE: 'Cannot Delete Risk',
} as const

export const HAZARD_FIELD_LABEL_MAP = {
  hazardEvent: 'Hazard/Hazardous Event*',
  harm: 'Harm*',
  harmTo: 'Harm To*',
} as const

export const RISK_FIELD_LABEL_MAP = {
  title: 'Risk Title*',
  description: 'description',
  probability: 'Probability*',
  severity: 'Severity*',
  acceptability: 'acceptability-field',
} as const

export const RCM_FIELD_LABEL_MAP = {
  title: 'Risk Control Measure*',
  description: 'Description',
  rcmTypeId: 'Risk Type*',
  probability: 'Probability*',
  severity: 'Severity*',
  rationale: 'Rationale*',
  controlEffectiveness: 'Control Effectiveness*',
} as const

export const HAZARD_FIELD_ORDER = Object.keys(HAZARD_FIELD_LABEL_MAP)
export const RISK_FIELD_ORDER = Object.keys(RISK_FIELD_LABEL_MAP)
export const RCM_FIELD_ORDER = Object.keys(RCM_FIELD_LABEL_MAP)