export const INITIAL_FORM_DATA = {
  planDocuments: [],
  reportDocuments: [],
}
export const INITIAL_FORM_ERRORS = {
  planDocuments: '',
  reportDocuments: '',
}

export const API_FIELD_KEYS = {
  PROJECT_ID: 'project_id',
  DOCUMENTS_TO_DELETE: 'documents_to_delete',
  DOCUMENTS_TO_CREATE: 'documents_to_create',
  CREATE_META_DATA: 'create_meta_data',
  UPDATE_META_DATA: 'update_meta_data',
}
export const ERROR_MESSAGES = {
  PLAN_DOCUMENTS: 'Plan document should be uploaded',
  REPORT_DOCUMENTS: 'Report document should be uploaded',
}
export const QUERY_KEYS = {
  CLINICAL_EVALUATION: 'clinical-evaluation',
  CLINICAL_EVALUATION_PLAN: 'clinical-evaluation-plan',
  CLINICAL_EVALUATION_REPORT: 'clinical-evaluation-report',
}
const BASE_URL = 'api/v1/dnd'
const BASE_API_PATH = `${BASE_URL}/clinical-evaluation`
const BASE_API_PATH_PLAN = `${BASE_URL}/clinical-evaluation-plan`
const BASE_API_PATH_REPORT = `${BASE_URL}/clinical-evaluation-report`
const BASE_API_END = 'project'
export const PROJECT_LIST_SCREEN_URL =  '/dnd/project/list'

export const API_ENDPOINTS = {
  FETCH_BY_ID: (projectID: number) =>
    `/${BASE_API_PATH}/${BASE_API_END}/${projectID}`,
  POST_EVALUATION: `/${BASE_API_PATH}`,
  // Plan endpoints
  FETCH_PLAN_BY_ID: (projectID: number) =>
    `/${BASE_API_PATH_PLAN}/${BASE_API_END}/${projectID}`,
  POST_PLAN: `/${BASE_API_PATH_PLAN}/`,
  // Report endpoints
  FETCH_REPORT_BY_ID: (projectID: number) =>
    `/${BASE_API_PATH_REPORT}/${BASE_API_END}/${projectID}`,
  POST_REPORT: `/${BASE_API_PATH_REPORT}/`,
}

export const FILE_TYPE = {
    PLAN: 'plan',
    REPORT: 'report'
}

export const HEADERS = {
  CLINICAL_EVALUATION: 'Clinical Evaluation',
  CLINICAL_EVALUATION_PLAN: 'Clinical Evaluation - Plan',
  CLINICAL_EVALUATION_REPORT: 'Clinical Evaluation - Report',
  PLAN: 'Plan*',
  REPORT: 'Report*'
}

export const FIELD_LABEL_MAP = {
  planDocuments: 'Plan*',
  reportDocuments: 'Report*'
} as const

export const FIELD_ORDER = Object.keys(FIELD_LABEL_MAP)