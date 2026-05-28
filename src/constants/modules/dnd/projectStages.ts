export const PROJECT_STAGES = {
  TITLE: 'Project Stages',

  STAGE: {
    LABEL: 'Stage*',
    PLACEHOLDER: 'Stages',
  },

  TYPE_OF_STAGE: {
    LABEL: 'Type of Stage',
    VALUE: 'Type of Stage',
  },

  NUMBER_OF_STAGES: {
    LABEL: 'Number of Stages Required*',
    PLACEHOLDER: 'Enter number of stages required',
  },

  BUTTONS: {
    CANCEL: 'Cancel',
    SAVE: 'Save',
  },

  VALIDATION: {
    STAGE_REQUIRED: 'Stage is required',
    NUMBER_OF_STAGES_REQUIRED: 'Number of stages is required',
  },

  FIELD_VALUES: {
    STAGE_ID_FIELD: 'stage_id',
    DESIGN_STAGE_FIELD: 'design_stage',
    STAGE_COUNT_FIELD: 'stage_count',
    STAGE_ORDER_ID_FIELD: 'stage_order_id',
  },

  PROJECT_STAGE_API_ENDPOINTS: {
    GET_PRODUCT_CATEGORY: 'api/v1/dnd/product-category/all?status=1',
    GET_END_USER: 'api/v1/organization/end-user/all?status=1',
    GET_PROJECT_STAGE_DROPDOWN: '/api/v1/dnd/stage/all?status=1',
    SUBMIT_PROJECT_STAGE: 'api/v1/dnd/project-stage/',
  },

  PROJECT_STAGE_API_KEYS: {
    PROJECT_STAGE_KEY: 'projectStage',
  },
} as const

export const ID_FIELD = 'project_stage_order_id'
export const UNDERLINE = 'underline'
export const STAGE = 'stage'
export const TYPE_OF_STAGE = 'type_of_stage'
export const STATUS = 'status'
export const NA = 'N/A'
export const ADD = 'Add New'
export const AUTO = 'auto'
export const IMG_SRC =""
export const ADD_ICON = 'Add icon'
export const WIDTH = '15px'
export const HEIGHT = '15PX'
export const ACTIVE = 'Active'
export const INACTIVE = 'Inactive'
export const STROKE_WIDTH = '1.875px'
export const REGEX = /^\d*$/
export const LABEL = 'Label'
