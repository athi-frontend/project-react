export const STORAGE_API_BASE = '/api/v1/regulation/storage';

export const STORAGE_API = {
  FETCH: (id: number) => `${STORAGE_API_BASE}/${id}`,
  SAVE: STORAGE_API_BASE,
};

export const STORAGE_FIELD = {
  ORGANIZATION_SITE_ID: 'organization_site_id',
  STORAGE: 'storage',
};

export const STORAGE_QUERY_KEY = 'storage';

export const STORAGE_LABELS = {
  FORM_TITLE: 'Storage',
  POLICY_LABEL : "Policy on the Storage of Medical Device",
  CANCEL: 'Cancel',
  SAVE: 'Save',
};