export const PRODUCTION_API_BASE = '/api/v1/regulation/production';

export const PRODUCTION_API = {
  FETCH: (id: number) => `${PRODUCTION_API_BASE}/${id}`,
  SAVE: PRODUCTION_API_BASE,
};

export const PRODUCTION_FIELD = {
  ORGANIZATION_SITE_ID: 'organization_site_id',
  PRODUCTION: 'production',
};

export const PRODUCTION_QUERY_KEY = 'production';

export const PRODUCTION_LABELS = {
  FORM_TITLE: 'Production',
  CANCEL: 'Cancel',
  SAVE: 'Save',
  FIELD_ONE: 'Brief Description of Production Operations Using, Wherever Possible, Flow Sheets and Charts Specifying Important Parameters',
  FIELD_TWO: 'Arrangement for Handling Starting Materials/ Bulk Products and Finished Goods',
  FIELD_THREE: 'Arrangements for Reprocessing or Rework',
  FIELD_FOUR: 'Arrangements for the Handling of Rejected Materials and Products',
  FIELD_FIVE: 'Brief Description of General Policy for Process Validation',
  FIELD_SIX: 'Brief Description of Sterilization Facility',
};