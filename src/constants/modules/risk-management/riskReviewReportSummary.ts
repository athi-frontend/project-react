/**
 * Classification: Confidential
 */

export const RISK_REVIEW_REPORT_SUMMARY_CONSTANTS = {
  FORM_KEYS: {
    PROJECT_ID: 'project_id',
    RISK_REVIEWED: 'risk_reviewed',
    MEDICAL_BENEFIT_REQUIRED: 'medical_benefit_required',
    MEDICAL_BENEFIT: 'medical_benefit',
    SUMMARY: 'summary',
    DOCUMENTS_TO_CREATE: 'documents_to_create',
    DOCUMENTS_TO_DELETE: 'documents_to_delete',
    CREATE_META_DATA: 'create_meta_data',
    UPDATE_META_DATA: 'update_meta_data',
  },
  TITLE: 'Risk Review Report Summary',
  LABELS: {
    SUMMARY: 'Summary of Risk Management Plan*',
    RISK_REVIEWED: 'Overall Residual Risk is Reviewed*',
    MEDICAL_BENEFIT: 'Medical Benefit',
    MEDICAL_BENEFIT_REQUIRED:
      'Does Medical Benefit Outweigh Overall Residual Risk',
    FILE_UPLOAD: 'Upload Document',
  },
  PLACEHOLDERS: {
    SUMMARY: 'Enter Summary of Risk Management Plan',
    MEDICAL_BENEFIT: 'Enter Medical Benefit',
  },
  RADIO_OPTIONS: {
    YES_NO: [
      { label: 'Yes', value: 'yes' },
      { label: 'No', value: 'no' },
    ],
    ACCEPTABLE: [
      { label: 'Acceptable', value: 'acceptable' },
      { label: 'Not Acceptable', value: 'not_acceptable' },
    ],
  },
  VALIDATION_MESSAGES: {
    SUMMARY_REQUIRED: 'Summary of Risk Management Plan is required',
    RISK_REVIEWED_REQUIRED: 'Overall Residual Risk is Reviewed is required',
    MEDICAL_BENEFIT_REQUIRED: 'Medical Benefit is required',
    MEDICAL_BENEFIT_REQUIRED_FIELD_REQUIRED:
      'Does Medical Benefit Outweigh Overall Residual Risk is required',
  },
  VALUES: {
    ACCEPTABLE: 'acceptable',
  },
  FIELD_LABEL_MAP: {
    summary: 'Summary of Risk Management Plan*',
    riskReviewed: 'Overall Residual Risk is Reviewed*',
    medicalBenefit: 'Medical Benefit',
    medicalBenefitRequired:
      'Does Medical Benefit Outweigh Overall Residual Risk*',
  },
  FIELD_NAMES: {
    SUMMARY: 'summary',
    RISK_REVIEWED: 'riskReviewed',
    MEDICAL_BENEFIT: 'medicalBenefit',
    MEDICAL_BENEFIT_REQUIRED: 'medicalBenefitRequired',
  },
  FILE_FIELDS: {
    SUPPORTING_FILES: 'supporting_files',
    DOCUMENTS: 'documents',
  },
}

export const RISK_REVIEW_REPORT_SUMMARY_FIELD_ORDER = Object.keys(
  RISK_REVIEW_REPORT_SUMMARY_CONSTANTS.FIELD_LABEL_MAP
)

const RISK_REVIEW_REPORT_SUMMARY_API_PATH = '/api/v1/risk/review-report-summary'

export const RISK_REVIEW_REPORT_SUMMARY_API_ENDPOINTS = {
  RISK_REVIEW_REPORT_SUMMARY_API_PATH,
  FETCH_ALL: `${RISK_REVIEW_REPORT_SUMMARY_API_PATH}/all`,
  UPSERT: RISK_REVIEW_REPORT_SUMMARY_API_PATH,
}
