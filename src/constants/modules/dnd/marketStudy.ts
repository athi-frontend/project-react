export const TITLE_TEXT = 'Market Research & Study'
export const ADD_FEEDBACK_TEXT = 'Add New'
export const DESCRIPTION_LABEL = 'Description'
export const DESCRIPTION_PLACEHOLDER = 'Enter Description'
export const INPUT_LABEL_DESCRIPTION_SOURCE = 'Source'
export const FEEDBACK_LABEL = 'All Feedbacks'
export const SOURCE_LABEL = 'Source*'
export const SOURCE_PLACEHOLDER = 'Enter Source'
export const FEEDBACK_PLACEHOLDER = 'Enter your feedback'
export const MODAL_SUBTITLE =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.'
export const ERROR_MESSAGES = {
  SOURCES: 'Source is required',
  DESCRIPTION: 'Description is required',
  FEEDBACK: 'Feedback is required',
  UPLOADED_FILR: 'File upload is required',
}
export const FEEDBACK_REQUIRED_LABEL = 'Feedback*'
export const FORM_VALID_MESSAGE = 'Form is valid, saving data...'
export const PATH_TO_PROJECT_SCREEN = '/dnd/project'
export const TITLE_VARIANT = 'h1'
export const BUTTON_VARIANT = 'outlined'
export const BUTTON_COLOR = 'primary'
export const TEXTFIELD_VARIANT = 'outlined'
export const PAPER_ELEVATION = 0
export const PAPER_VARIANT = 'outlined'
export const GRID_SIZE = {
  HALF_WIDTH: 6,
  FULL_WIDTH: 12,
}
export const TEXTFIELD_ROWS = 4
export const PAPER_HEIGHT = 300
export const MODAL_ARIA_LABEL = 'add-feedback-modal'
export const MODAL_ARIA_DESC = 'modal-to-add-new-feedback'

export const BASE_API_PATH = 'api/v1/dnd'
export const BASE_API_END = 'market-research-study'
export const QUERY_KEYS = {
  MARKET: 'market-research-list',
}

export const API_URLS = {
  TEAM: {
    BASE: `${BASE_API_PATH}/${BASE_API_END}`,
    FETCH: `${BASE_API_PATH}/${BASE_API_END}/all?project_id=`,
    CREATE: `${BASE_API_PATH}/${BASE_API_END}`,
    FETCH_ID: `${BASE_API_PATH}/${BASE_API_END}/`,
    UPDATE: `${BASE_API_PATH}/${BASE_API_END}`,
    DELETE: `${BASE_API_PATH}/${BASE_API_END}`,
  },
}
export const INITIAL_FORM_DATA = {
  sources: '',
  description: '',
  uploadedFile: [],
  documentIdToDelete: [],
}

export const API_FIELD_KEYS = {
  PROJECT_ID: 'project_id',
  SOURCE: 'source',
  DESCRIPTION: 'description',
  DOCUMENTS_TO_DELETE: 'documents_to_delete',
  DOCUMENTS_TO_CREATE: 'documents_to_create',
  CREATE_META_DATA: 'create_meta_data',
  UPDATE_META_DATA: 'update_meta_data',
}
export const TABLE_FIELD_KEYS = {
  MARKET_RESEARCH_STUDY_ID: 'market_research_study_id',
}

export const FIELD_ORDER = ['sources', 'description']