export const API_BASE_PATH='api/v1/dnd/design-pre-transfer-document'
export const API_ENDPOINTS = {
  FETCH_ALL: (projectId: number) => `${API_BASE_PATH}/${projectId}`,
  DOCUMENT_UPLOAD: `${API_BASE_PATH}`,
  FETCH_BY_ID:(design_transfer_plan_id:number)=>`${API_BASE_PATH}/design-transfer-plan/${design_transfer_plan_id}`
};

export const FIELDS = {
  S_NO: 'sno',
  DOCUMENT_NAME: 'document_name',
  TEMPLATE: 'document_template_id',
  PROJECT_ID: 'project_id',
  DESIGN_TRANSFER_PLAN_ID: 'design_transfer_plan_id',
  DOCUMENTS_TO_CREATE: 'documents_to_create',
  CREATE_META_DATA: 'create_meta_data',
  DOCUMENTS_TO_DELETE: 'documents_to_delete',
  UPDATE_META_DATA: 'update_meta_data',
  UPLOAD:'uploadLink',
  GENERATE:'Upload/System Generate',
  SYSTEM_GENERATE:'system_generate',
};
export const BLOB_NAME='blob'
export const CENTER="center"
export const LEFT='left'
export const TITLE_NAME="Design Output Documents"
export const SYSTEM_GENERATE_TITLE="Design Output Documents - System Generate"
export const HEADERS = {
  S_NO: 'S.No.',
  DOCUMENT_NAME: 'Document Name',
  DOCUMENT_TEMPLATE: 'Document Template',
  UPLOAD: 'Upload',
  SYSTEM_GENERATE: 'System Generate',
};

export const TITLE = 'Pre Transfer Design Output Document';

export const FILE_TYPE = {
  DESIGN_DOCUMENT: 'design_document',
};

export const ERROR_MESSAGES = {
  NO_FILES: 'At least one file must be uploaded',
};

export const FINAL_FILE_INITIAL_DATA = {
  documents_to_create: [],
  create_meta_data: {},
  documents_to_delete: [],
  update_meta_data: {},
  local_files_to_delete: [],
};
export const APPEND_FIELDS={
  PROJECT_ID:'project_id',
  DESIGN:'design_transfer_plan_id',
 CREATE :'documents_to_create',
 META_CREATE:'create_meta_data',
 DELETE:'documents_to_delete',
 UPDATE:'update_meta_data',
 LOCAL_DELETE:'local_files_to_delete'
}
export const QUERY_KEYS={
 PRE_TRANSFER :'use-pre-transfer',
 PRE_TRANSFER_BY_ID:'use-pre-transfer-by-id'
}
export const PROJECT='project_id'