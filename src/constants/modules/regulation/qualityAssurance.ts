export const QUALITY_ASSURANCE_API_BASE = '/api/v1/regulation/quality-assurance';

export const QUALITY_ASSURANCE_API = {
  FETCH: (id: number) => `${QUALITY_ASSURANCE_API_BASE}/${id}`,
  SAVE: QUALITY_ASSURANCE_API_BASE,
};

export const QUALITY_ASSURANCE_FIELD = {
  ORGANIZATION_SITE_ID: 'organization_site_id',
  QUALITY_ASSURANCE: 'quality_assurance',
};

export const QUALITY_ASSURANCE_QUERY_KEY = 'quality-assurance';

export const QUALITY_ASSURANCE_LABELS = {
  FORM_TITLE: 'Quality Assurance',
  CANCEL: 'Cancel',
  SAVE: 'Save',
  DESC: 'Description of the Quality Assurance System and of the Activities of the Quality Assurance Department. Procedures for the Release of Finished Products',
};