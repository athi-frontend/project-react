// Section titles
export const SECTION_TITLES = {
  DESIGN_OUTPUT_DOCUMENT: 'Design Output Document',
  OUTPUT_DOCUMENTS: 'Output Documents',
  SYSTEM_GENERATE_TITLE: 'Design Output Documents - System Generate',
}

export const HEADERS = {
  S_NO: 'S.No',
  DOCUMENT_NAME: 'Document Name',
  DOCUMENT_TEMPLATE: 'Document Template',
  UPLOAD_OR_SYSTEM_GENERATE: 'Upload/System Generate',
  UPLOAD: 'Upload',
  SYSTEM_GENERATE: 'System Generate',
}

export const FIELDS = {
  S_NO_FIELD: 'sno',
  DOCUMENT_NAME_FIELD: 'document_name',
  DOCUMENT_TEMPLATE_FIELD: 'document_template',
  DOCUMENT_TYPE_FIELD: 'document_type',
  UPLOAD: 'uploadLink',
  SYSTEM_GENERATE: 'system_generate',
}

export const CONTENT_MODE = {
  CENTER: 'center',
  BLOB: 'blob',
  TEXT: 'text',
} as const

export const DESIGN_OUTPUT_DOCUMENT_API_ENDPOINTS = {
  GET_DESIGN_OUTPUT_DOCUMENTS: (projectId: number) =>
    `api/v1/dnd/design-output-document/project/${projectId}`,
  SUBMIT_DESIGN_OUTPUT: 'api/v1/dnd/design-output-document',
  FETCH_DESIGN_TRANSFER_PLAN_BY_ID: (designTransferPlanId: number) =>
    `api/v1/dnd/design-output-document/design-transfer-plan/${designTransferPlanId}`,
}

export const DESIGN_OUTPUT_DOCUMENT_QUERY_KEYS = {
  FETCH_DESIGN_OUTPUT_DOCUMENT_KEY: 'Fetch_Design_Output_Document',
  FETCH_DESIGN_TRANSFTER_PLAN_KEY: 'Fetch_Design_Transfer_Plan'
}

export const API_FIELD_KEYS = {
  PROJECT_ID: 'project_id',
  DESIGN_TRANSFER_PLAN_ID: 'design_transfer_plan_id',
  DOCUMENTS_TO_DELETE: 'documents_to_delete',
  DOCUMENTS_TO_CREATE: 'documents_to_create',
  CREATE_META_DATA: 'create_meta_data',
  UPDATE_META_DATA: 'update_meta_data',
}

export const UI_TEXT = {
  CLICK_HERE: 'Click Here',
  TEMPLATE_PREFIX: 'Template_',
}
