const BASE_API_PATH = 'api/v1/regulation/test-license';
const ADD_TEST_LICENSE_API_PATH = 'api/v1/regulation/add-test-license';
const ADD_TEST_LICENSE_FILES_API_PATH = 'api/v1/regulation/add-test-license/license';

export const API_ENDPOINTS = {
  FETCH_BY_ID: (id: number) => `/${BASE_API_PATH}/${id}`,
  POST_CHECKLIST: (id: number) =>  `/${BASE_API_PATH}/${id}`,
  GET_ADD_TEST_LICENSE: (userId: string) => `/${ADD_TEST_LICENSE_API_PATH}/${userId}`,
  GET_ADD_TEST_LICENSE_BY_ID: (id: number) => `/${ADD_TEST_LICENSE_API_PATH}/${id}`,
  GET_ADD_TEST_LICENSE_FILES: (checklistId: number) => `/${ADD_TEST_LICENSE_FILES_API_PATH}/${checklistId}`,
  POST_ADD_TEST_LICENSE: `/${ADD_TEST_LICENSE_API_PATH}`,
};

export const TEST_LICENSE_CHECKLIST_CONSTANTS = {
  TITLE: 'Test License Checklist',
  BUTTON_LABELS: {
    CANCEL: 'Cancel',
    SAVE: 'Save',
  },
  ID_FIELD: 'checklist_id',
};

export const TEST_LICENSE_CHECKLIST_COLUMNS = {
  SNO: { FIELD: 'sno', HEADER: 'S.No' },
  SECTION_NO: { FIELD: 'section_no', HEADER: 'Section No.' },
  CHECKLIST_NAME: { FIELD: 'checklist_name', HEADER: 'Checklist Name' },
  IS_MANDATORY: { FIELD: 'is_mandatory', HEADER: 'Is Mandatory' },
};