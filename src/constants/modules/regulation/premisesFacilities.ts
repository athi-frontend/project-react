export const PREMISES_FACILITIES_API_BASE = '/api/v1/regulation/premisses-facilities';

export const PREMISES_FACILITIES_API_ENDPOINTS = {
  FETCH: (id: number | string) => `${PREMISES_FACILITIES_API_BASE}/${id}`,
  UPSERT: PREMISES_FACILITIES_API_BASE,
};

export const PREMISES_FACILITIES_QUERY_KEYS = {
  FETCH: (id: number) => ['PREMISES_FACILITIES', id],
};

export const PREMISES_FACILITIES_FORM_LABELS = {
  TITLE: 'Premises and Facilities',
  LAYOUT_PREMISES: 'Layout of Premises With Indication of Scale',
  NATURE_CONSTRUCTION: 'Nature of Construction and Finishes/Fixtures and Fittings',
  VENTILATION_SYSTEM: 'Brief Description of Ventilation System',
  TOXIC_MATERIALS: 'Areas of Handling Toxic, Hazardous and Sensitizing Materials',
  WATER_SYSTEM: 'Brief Description of Water System',
  MAINTENANCE_PROGRAM: 'Description of Planned Preventive Maintenance Program of Premises',
  CANCEL: 'Cancel',
  SAVE: 'Save',
};

export const PREMISES_FACILITIES_FIELD_KEYS = {
  LAYOUT_PREMISES: 'premises_layout_with_scale',
  NATURE_CONSTRUCTION: 'construction_finishes_fixtures',
  VENTILATION_SYSTEM: 'ventilation_system_description',
  TOXIC_MATERIALS: 'hazardous_material_handling_areas',
  WATER_SYSTEM: 'water_system_description',
  MAINTENANCE_PROGRAM: 'premises_preventive_maintenance_description',
};

export const PREMISES_FACILITIES_ANNEXURE = {
  LAYOUT_PREMISES: {
    LABEL: 'Annexure',
    FILE_URL: '/files/layout-premises.pdf',
  },
  NATURE_CONSTRUCTION: {
    LABEL: 'Annexure',
    FILE_URL: '/files/construction-finishes.pdf',
  },
  VENTILATION_SYSTEM: {
    LABEL: 'Annexure',
    FILE_URL: '/files/ventilation-system.pdf',
  },
};

export const PREMISES_FACILITIES_FORM_PLACEHOLDERS = {
  INPUT_TEXT: 'Input Text',
};