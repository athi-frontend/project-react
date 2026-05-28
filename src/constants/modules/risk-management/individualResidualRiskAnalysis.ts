import { NUMBERMAP } from '@/constants/common'

/**
 * Classification: Confidential
 */

export const INDIVIDUAL_RESIDUAL_RISK_ANALYSIS_PAGE = {
  TITLE: 'Individual Residual Risk Analysis',
  ID_FIELD: 'residual_risk_id',
} as const

export const INDIVIDUAL_RESIDUAL_RISK_ANALYSIS_FORM_TYPE =
  'individual_risk_analysis'

export const BASE_INDIVIDUAL_RISK_ANALYSIS_API_PATH =
  '/api/v1/risk/individual-risk-analysis'

export const INDIVIDUAL_RISK_ANALYSIS_API_ENDPOINTS = {
  GET_ALL: `${BASE_INDIVIDUAL_RISK_ANALYSIS_API_PATH}/all`,
  GET_BY_ID: (risk_id: number) =>
    `${BASE_INDIVIDUAL_RISK_ANALYSIS_API_PATH}/${risk_id}`,
  UPSERT: BASE_INDIVIDUAL_RISK_ANALYSIS_API_PATH,
}

export const INDIVIDUAL_RESIDUAL_RISK_ANALYSIS_ROUTES = {
  BASE: (projectId: string | number) =>
    `/risk-management/individual-residual-risk-analysis/${projectId}`,
  DETAIL: (projectId: string | number, riskId: string | number) =>
    `/risk-management/individual-residual-risk-analysis/${projectId}/${riskId}`,
} as const

export const INDIVIDUAL_RISK_ANALYSIS_KEYS = {
  LIST: 'individualRiskAnalysisList',
  BY_ID: 'individualRiskAnalysisById',
  UPSERT: 'individualRiskAnalysisUpsert',
}

export const INDIVIDUAL_RESIDUAL_RISK_ANALYSIS_FIELDS = {
  SNO: 'sno',
  HAZARD_CODE: 'hazard_code',
  EVENT_DESCRIPTION: 'event_description',
  HARM_DESCRIPTION: 'harm_description',
  RISK_ID: 'risk_id',
  RISK_CODE: 'risk_code',
  RISK_TITLE: 'risk_title',
  PROBABILITY: 'probability_level_name',
  SEVERITY: 'severity_level_name',
  ACTIONS: 'actions',
} as const

export const INDIVIDUAL_RESIDUAL_RISK_ANALYSIS_FORM = {
  LABELS: {
    HAZARD_NO: 'Hazard No.',
    RISK_TITLE: 'Risk Title',
    DESCRIPTION: 'Description of Risk',
    PROBABILITY: 'Probability',
    SEVERITY: 'Severity',
    RADIO_LABEL: 'Is further Risk Control Measure Possible*',
    JUSTIFICATION: 'Justification',
  },
  PLACEHOLDERS: {
    HAZARD_NO: 'Hazard No.',
    RISK_TITLE: 'Risk Title',
    DESCRIPTION: 'Description of Risk',
    PROBABILITY: 'Probability',
    SEVERITY: 'Severity',
    JUSTIFICATION: 'Input Text',
  },
  RADIO: {
    NAME: 'risk_control_possible',
    OPTIONS: {
      YES: { label: 'Yes', value: 'yes' },
      NO: { label: 'No', value: 'no' },
    },
  },
} as const

export const INDIVIDUAL_RESIDUAL_RISK_ANALYSIS_MESSAGES = {
  RADIO_REQUIRED: 'Is further Risk Control Measure Possible is required',
  JUSTIFICATION_REQUIRED:
    'Justification is required when risk control measure is not possible.',
} as const

export const INDIVIDUAL_RESIDUAL_RISK_ANALYSIS_COLUMNS = {
  SNO: {
    headerName: 'S.No.',
  },
  HAZARD_NO: {
    headerName: 'Hazard No.',
    flex: NUMBERMAP.ONE,
  },
  RISK_TITLE: {
    headerName: 'Risk Title',
    flex: NUMBERMAP.ONE,
  },
  PROBABILITY: {
    headerName: 'Probability',
    flex: NUMBERMAP.ONE,
  },
  SEVERITY: {
    headerName: 'Severity',
    flex: NUMBERMAP.ONE,
  },
  ACTIONS: {
    headerName: 'Actions',
  },
} as const

export const INDIVIDUAL_RESIDUAL_RISK_ANALYSIS_ARIA = {
  EDIT: 'edit-residual-risk',
} as const

export const INDIVIDUAL_RESIDUAL_RISK_ANALYSIS_LABEL =
  'Individual Residual Risk Analysis'
