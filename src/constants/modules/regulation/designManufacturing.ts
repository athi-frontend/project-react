// API Endpoints
export const DESIGN_MANUFACTURING_API_BASE = '/api/v1/regulation/design-manufacturing';
export const DESIGN_MANUFACTURING_API = {
  FETCH: (id: number | string) => `${DESIGN_MANUFACTURING_API_BASE}/${id}`,
  UPSERT: DESIGN_MANUFACTURING_API_BASE,
};

// Query Keys
export const DESIGN_MANUFACTURING_QUERY_KEYS = {
  FETCH: (id: number | string) => ["DESIGN_MANUFACTURING", id],
};

// Field Names
export const DESIGN_MANUFACTURING_FIELDS = {
  DEVICE_DESIGN: "device_design",
  MANUFACTURING_PROCESS: "manufacturing_process",
  PROJECT_ID: "project_id",
};

// UI Strings
export const DESIGN_MANUFACTURING_LABELS = {
  TITLE: "Design and Manufacturing Information",
  DEVICE_DESIGN: "Device Design",
  MANUFACTURING_PROCESS: "Manufacturing Process",
  SAVE: "Save",
  CANCEL: "Cancel",
};

// Placeholders
export const DESIGN_MANUFACTURING_PLACEHOLDERS = {
  INPUT_TEXT: "Input Text",
};

// Annexure File URLs
export const DESIGN_MANUFACTURING_ANNEXURE = {
  DEVICE_DESIGN: { label: 'Annexure', fileUrl: '/files/annexure1.pdf' },
  MANUFACTURING_PROCESS: { label: 'Annexure', fileUrl: '/files/annexure2.pdf' },
}; 