export const MEDICAL_LABEL = {
  HANDLING_LABEL: 'Arrangements for the Handling of Complaints',
  SAFETY_LABEL:
    'Arrangements for the Handling of Field Safety and Corrective Action',
}

export const MEDICAL_PLACEHOLDER = {
  HANDLING: 'Input Text',
  SAFETY: 'Input Text',
}

export const MEDICAL_FORM_TITLE =
  'Medical device complaints and files safety corrective action'

const BASE_URL = 'api/v1/regulation/compliants-safety-corrective'
export const MEDICAL_API = {
  FETCH: (organization_site_id: number) =>
    `${BASE_URL}/${organization_site_id}`,
  POST: BASE_URL,
}

export const MEDICAL_FIELD_KEYS = {
  ORGANIZATION_SITE_ID: 'organization_site_id',
  HANDLING_COMPLAINTS: 'handling_complaints',
  FIELD_SAFETY_CORRECTIVE_ACTION: 'handling_field_safety_action',
}
