// Manufacturing License Constants

// Full API endpoint constants
export const MANUFACTURING_LICENSE_API_URL = '/api/v1/regulation/manufacturing-license';
export const ADD_MANUFACTURING_LICENSE_API_URL = '/api/v1/regulation/add-manufacturing-license';

export const API_ENDPOINTS = {
    FETCH_MANUFACTURING_LICENCE_CHECKLIST: (id: number) => `${MANUFACTURING_LICENSE_API_URL}/${id}`,
    UPSERT_MANUFACTURING_LICENCE_CHECKLIST: (id: number) => `${MANUFACTURING_LICENSE_API_URL}/${id}`,
    FETCH_ADD_TEST_LICENSE: (id: number) => `${ADD_MANUFACTURING_LICENSE_API_URL}/license/${id}`,
    UPSERT_ADD_TEST_LICENSE: ADD_MANUFACTURING_LICENSE_API_URL,
    FETCH_ALL_ADD_TEST_LICENSE: (id: number) => `${ADD_MANUFACTURING_LICENSE_API_URL}/${id}`,
    GET_ADD_MANUFACTURING_LICENSE: (userId: string) => `${ADD_MANUFACTURING_LICENSE_API_URL}/${userId}`,
};

export const MANUFACTURING_LICENSE_ACTION = {
  MODAL_TITLE: 'Add Manufacturing License',
  BUTTON_LABEL_SAVE: 'Save',
  BUTTON_LABEL_CANCEL: 'Cancel',
  UPLOAD_SUBHEADER: 'Upload*',
  LINK_UPLOAD_FILE: 'Upload File',
};

export const MANUFACTURING_LICENSE_FORM_FIELDS = {
  LICENSE_ID: 'license_id',
  DOCUMENTS_TO_CREATE: 'documents_to_create',
  CREATE_META_DATA: 'create_meta_data',
  DOCUMENTS_TO_DELETE: 'documents_to_delete',
  UPDATE_META_DATA: 'update_meta_data',
  CHECKLIST_ID_FIELD: 'checklist_id',
};

export const MANUFACTURING_LICENSE_FIELDS = {
  SERIAL_NO: 'serialNo',
  SECTION_NO: 'section_no',
  CHECKLIST_NAME: 'checklist_name',
  MANDATORY: 'isMandatory',
};

export const MANUFACTURING_LICENSE_COLUMNS = {
  SNO: 'S.No',
  SECTION_NO: 'Section No',
  CHECKLIST_NAME: 'Checklist Name',
  MANDATORY: 'Mandatory',
};

export const MANUFACTURING_LICENSE_CHECKLIST_FIELDS = {
  SNO: 'S.No',
  SECTION_NO: 'section_no',
  CHECKLIST_NAME: 'checklist_name',
  IS_MANDATORY: 'is_mandatory',
};

export const MANUFACTURING_LICENSE_CHECKLIST_HEADERS = {
  SNO: 'S.No',
  SECTION_NO: 'Section No',
  CHECKLIST_NAME: 'Checklist Name',
  IS_MANDATORY: 'Mandatory',
};

export const MANUFACTURING_LICENSE_CHECKLIST_META = {
  TITLE: 'Manufacturing License Checklist',
  ID_FIELD: 'checklist_id',
};

export const MANUFACTURING_LICENSE_CHECKLIST_BUTTONS = {
  CANCEL: 'Cancel',
  SAVE: 'Save',
};

export const MANUFACTURING_LICENSE_CHECKLIST_ALERTS = {
  CANCELLED_TITLE: 'Cancelled',
  CANCELLED_MESSAGE: 'You have cancelled the operation.',
};

export const INITIAL_FILE_DATA = {
  documents_to_create: [],
  documents_to_delete: [],
  create_meta_data: {},
  update_meta_data: {},
  local_files_to_delete: [],
};

export const MANUFACTURING_LICENSE_UI = {
  CHECKLIST_ID_FIELD: 'checklist_id',
};

export interface ManufacturingLicenseChecklistItem {
  checklist_id: number;
  section_no: string;
  checklist_name: string;
  is_mandatory: number;
}