export const BUTTONS = {
  CANCEL: 'Cancel',
  SAVE: 'Save',
}

export const CANCELPATH = '/dnd/project/list'
export const TYPES = {
  REVIEW: 'review',
  PND: 'pnd',
}

export const TITLE = 'PND Review'
export const PND_REVIEW_STATUS_TITLE = 'PND Review Status'
export const MESSAGES = {
  LOADER_CONTENT: 'Loading PND Review data...',
}

export const PLACEHOLDERS = {
  COMMENT: 'Enter your comment',
}

export const FIELD_NAMES = {
  ITEM_ID: 'id',
  ITEM: 'item',
  REQUIREMENT: 'requirement',
  COMMENT: 'comment',
  REVIEWED: 'reviewed',
}

export const HEADER_NAMES = {
  ITEMS: 'Items',
  REQUIREMENTS: 'Requirements',
  COMMENTS: 'Comments',
  REVIEWED: 'Reviewed',
}

export const PARAMETERTABLE = {
  HEADERNAME: {
    SNO: 'S.No',
    PARAMETER: 'Parameter',
    SPECIFICATION: 'Technical Specification',
  },
  FIELDNAME: {
    SNO: 'specification_id',
    PARAMETER: 'pnd_parameter',
    SPECIFICATION: 'pnd_specification',
    COMMENTS: 'comments',
    REVIEWED: 'reviewed',
  },
}

export const API_ENDPOINTS = {
  FETCH_PND_REVIEW: (projectId: number) =>
    `/api/v1/dnd/pnd-review/project/${projectId}`,
  UPSERT_PND_REVIEW: '/api/v1/dnd/pnd-review',
}

export const KEYS = {
  FETCH_PND_REVIEW: 'pndReviewFetch',
}

export const FLEX = {
  SMALL: 1,
  MEDIUM: 1.4,
}

export const COLUMN_WIDTH = {
  SERIAL_NUMBER: 100,
  TEXT_FIELD: 250,
  COMMENT_FIELD: 300,
  REVIEW_CHECKBOX: 150,
}
export const MODEL_TABLE = {
  HEADERNAME: {
    MODEL_NAME: 'Model Name',
    MODEL_NUMBER: 'Model Number',
    MODEL_DESCRIPTION: 'Description',
  },
  FIELDNAME: {
    MODEL_ID: 'model_id',
    MODEL_NAME: 'model_name',
    MODEL_NUMBER: 'model_number',
    MODEL_DESCRIPTION: 'model_description',
  },
}
export const ALERT_MESSAGES= {
  TITLE: 'Validation Error',
  TEXT: 'Comments length should not exceed 500 characters.',
  ICON: 'warning',
}
export const PND_REVIEW_STATUS_TABLE = {
  HEADERNAME: {
    SNO: 'S.No',
    ROLE: 'Role',
    STATUS: 'Status',
    DATE: 'Date',
    ACTION: 'Action'
  },
  FIELDNAME: {
    SNO: 'sno',
    ROLE: 'role_name',
    STATUS: 'status_id',
    DATE: 'transition_date',
    ACTION: 'action'
  },
}
export const DD_MM_YYYY_LUXON = 'dd-MM-yyyy'
export const YET_TO_START = 'Yet to Start'
export const DEFAULT_VALUE = '-'

export const PND_REVIEW_STATUS_MODAL_TEXTS = {
  ADD_TITLE: 'PND Review Status',
  EDIT_TITLE: 'Edit Review Status',
  ROLE_LABEL: 'Role*',
  ROLE_PLACEHOLDER: 'Select Role',
  ROLE_REQUIRED: 'Role is required',
  STATUS_LABEL: 'Status*',
  STATUS_PLACEHOLDER: 'Select Status',
  STATUS_REQUIRED: 'Status is required',
  CANCEL_BUTTON: 'Cancel',
  SAVE_BUTTON: 'Save',
}
