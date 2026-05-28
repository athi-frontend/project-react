/**
    Classification : Confidential
**/
const BASE_ADD_TEST_LICENSE_API_PATH = 'api/v1/regulation/add-test-license';

export const ADD_TEST_LICENSE_API_ENDPOINTS = {
  FETCH_BY_ID: (id: number) => `/${BASE_ADD_TEST_LICENSE_API_PATH}/${id}`,
  FETCH_LICENSE_CHECKLIST_FILES: (checklistId: number) => `/${BASE_ADD_TEST_LICENSE_API_PATH}/license/${checklistId}`,
  POST: `/${BASE_ADD_TEST_LICENSE_API_PATH}`,
};

export const ADD_TEST_LICENSE_CONSTANTS = {
  TITLE: 'Add Test License',
  CHECKLIST_ID_FIELD: 'checklist_id',
  UPLOAD_FILE_LABEL: 'Upload File',
};

export const ADD_TEST_LICENSE_COLUMNS = {
  SNO: { FIELD: 'sno', HEADER: 'S.No' },
  SECTION_NO: { FIELD: 'section_no', HEADER: 'Section No.' },
  CHECKLIST_NAME: { FIELD: 'checklist_name', HEADER: 'Checklist Name' },
  UPLOAD_FILE: { FIELD: 'upload', HEADER: 'Upload Files' },
};