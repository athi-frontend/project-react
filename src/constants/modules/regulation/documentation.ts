export const DOCUMENTATION_API_BASE = '/api/v1/regulation/documentation';

export const DOCUMENTATION_API = {
  FETCH: (id: number) => `${DOCUMENTATION_API_BASE}/${id}`,
  SAVE: DOCUMENTATION_API_BASE,
};

export const DOCUMENTATION_FIELD = {
  ORGANIZATION_SITE_ID: 'organization_site_id',
  PLANT_MASTER_FILE_ID: 'plant_master_file_id',
  DOCUMENTATION: 'documentation',
};

export const DOCUMENTATION_QUERY_KEY = 'documentation';

export const DOCUMENTATION_LABELS = {
  FORM_TITLE: 'Documentation',
  CANCEL: 'Cancel',
  SAVE: 'Save',
};

export const DOCUMENTATION_LABEL = {
  ARRANGEMENT_LABEL : "Arrangements for the Preparation, Revision and Distribution of Necessary Documentation, Including Storage of Master Documents",
}

export const DOCUMENTATION_PLACEHOLDER = 'Enter documentation...';