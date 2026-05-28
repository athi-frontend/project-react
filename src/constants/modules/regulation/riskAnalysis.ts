export const RISK_ANALYSIS_API_BASE = '/api/v1/regulation/risk-analysis';

export const RISK_ANALYSIS_API = {
  FETCH: (projectId: number) => `${RISK_ANALYSIS_API_BASE}/${projectId}`,
  SAVE: RISK_ANALYSIS_API_BASE,
};

export const RISK_ANALYSIS_FIELD = {
  RISK_ANALYSIS: 'risk_analysis',
  PROJECT_ID: 'project_id',
};

export const RISK_ANALYSIS_INFO_TEXT = {
  SUMMARY_LABEL: 'Risk Management is Carried Out According to EN ISO 14971:2019 at the Beginning of the Project and Throughout the Product Life Cycle.',
  PLACEHOLDER: 'Input Text',
  INFO: 'Summary of risk analysis and control measures as per EN ISO 14971:2019.'
};

export const RISK_ANALYSIS_MESSAGES = {
  FETCH_SUCCESS: 'regulation_risk-analysis_fetch_success',
  SAVE_SUCCESS: 'regulation_risk-analysis_save_success',
  SAVE_ERROR: 'Failed to save risk analysis.',
};

export const RISK_ANALYSIS_LABELS = {
  FORM_TITLE: 'Risk Analysis and control summary',
  CANCEL: 'Cancel',
  SAVE: 'Save',
};

export const RISK_ANALYSIS_QUERY_KEY = 'risk-analysis'; 