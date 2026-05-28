export const SANITATION_API_BASE = '/api/v1/regulation/sanitation';

export const SANITATION_API = {
  FETCH: (id: number) => `${SANITATION_API_BASE}/${id}`,
  SAVE: SANITATION_API_BASE,
};

export const SANITATION_FIELD = {
  ORGANIZATION_SITE_ID: 'organization_site_id',
  SANITATION: 'sanitation',
};

export const SANITATION_QUERY_KEY = 'sanitation';

export const SANITATION_LABELS = {
  FORM_TITLE: 'Sanitation',
  CANCEL: 'Cancel',
  SAVE: 'Save',
};
