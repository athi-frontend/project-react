export const LABELLING_API_FIELDS = {
  PROJECT_ID: 'project_id',
  PRODUCT_LABELS: 'product_labels',
  UTILITY_TYPE_LABELS: 'utility_type_lables',
  PRODUCT_BROCHURE: 'product_brochure',
};

export const LABELLING_API_BASE = '/api/v1/regulation/labelling';

export const LABELLING_API_ENDPOINTS = {
  GET_LABELLING: (id: number | string) => `${LABELLING_API_BASE}/${id}`,
  UPSERT_LABELLING: LABELLING_API_BASE,
};

export const REGULATION_LABELLING_QUERY_KEY = 'regulation_labelling';

export interface LabellingFormData {
  labelling_id?: number;
  device_master_file_id?: number;
  product_labels: string;
  utility_type_lables: string;
  product_brochure: string;
  instruction_of_use?: string; 
}

export const INITIAL_LABELLING_FORM_DATA: LabellingFormData = {
  product_labels: '',
  utility_type_lables: '',
  product_brochure: '',
  instruction_of_use: '',
};

export const LABELLING_PAGE_TEXT = {
  title: 'Labelling',
  copyOfOriginalLabel: 'Copy of Original Label',
  productLabels: 'Product Labels',
  accessoryLabels: 'Accessory and Consumables Labels',
  productBrochure: 'Product Brochure / Promotional Material',
  instructionsForUse: 'Instructions for use',
  inputText: 'Input Text',
  annexureLabel: 'Annexure',
  annexureFileUrl: '/files/annexure3.pdf',
  cancel: 'Cancel',
  save: 'Save',
  cancelledTitle: 'Cancelled',
  cancelledText: 'You have cancelled the operation.',
  alertInfoIcon: 'info' as const,
}; 