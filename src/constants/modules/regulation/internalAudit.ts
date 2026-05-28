export const INTERNAL_AUDIT_LABEL = {
  TITLE: "Internal audit/ self inspection",
  DESCRIPTION_LABEL: "Short Description of Self-Inspection/ Internal Audit System"
};

export const INTERNAL_AUDIT_SELF_INSPECTION_API_BASE = '/api/v1/regulation/internal-audit-self-inspection';

export const INTERNAL_AUDIT_SELF_INSPECTION_API = {
  FETCH: (id: number) => `${INTERNAL_AUDIT_SELF_INSPECTION_API_BASE}/${id}`,
  SAVE: INTERNAL_AUDIT_SELF_INSPECTION_API_BASE,
};

export const INTERNAL_AUDIT_SELF_INSPECTION_FIELD = {
  ORGANIZATION_SITE_ID: 'organization_site_id',
  INTERNAL_AUDIT_DESCRIPTION: 'internal_audit_description',
};

export const INTERNAL_AUDIT_SELF_INSPECTION_QUERY_KEY = 'internal_audit_self_inspection';

export const INTERNAL_AUDIT_SELF_INSPECTION_LABELS = {
  FORM_TITLE: 'Internal Audit / Self Inspection',
  CANCEL: 'Cancel',
  SAVE: 'Save',
};

export const INTERNAL_AUDIT_SELF_INSPECTION_LABEL = {
  DESCRIPTION_LABEL: 'Internal Audit / Self Inspection Description',
};

export const INTERNAL_AUDIT_SELF_INSPECTION_PLACEHOLDER = 'Enter internal audit/self inspection description...';