/**
      *Classification : Confidential
**/
export const PROJECT_ID = 22

export const FORM_LABELS = {
  HEADER: 'Intended Use',
  PRODUCT_GROUP: 'Product Group',
  PRODUCT_CATEGORY: 'Product Category',
  PRODUCT_TYPE: 'Product Type',
  PRODUCT_SUB_TYPE: 'Product Sub Type',
  PRODUCT_NAME: 'Product Name',
  INTENDED_USE: 'Intended Use*',
  INTENDED_POPULATION: 'Intended Population*',
  INTENDED_POPULATION_PLACEHOLDER: 'Intended population',
  INTENDED_USERS: 'Intended Users*',
  INTENDED_USERS_PLACEHOLDER: 'Intended users',
  INDICATIONS_OF_USE: 'Indications of Use*',
  INDICATIONS_OF_USE_PLACEHOLDER: 'Indications of use',
  CONTRA_INDICATIONS: 'Contra - Indications of Use*',
  CONTRA_INDICATIONS_PLACEHOLDER: 'Contra - indications of use',
  USE_ENVIRONMENT: 'Use Environment*',
  USE_ENVIRONMENT_PLACEHOLDER: 'Select Use Environment',
}

export const BUTTON_LABELS = {
  CANCEL: 'Cancel',
  SAVE: 'Save',
}
export const INTENDED_USE_URL = 'api/v1/dnd/intended-use/'
export const MODEL_URL = 'api/v1/dnd/model/all'
export const USE_ENVIRONMENT_URL = 'api/v1/dnd/use-environment/all'

export const ERROR_NO_DATA = 'No data available'
export const ERROR_NO_MODELS = 'No models found'

export const PLACEHOLDERS = {
  MODELS: 'Models',
  INTENDED_USE: 'Input text',
  INTENDED_POPULATION: 'Enter Intended Population',
  INTENDED_USERS: 'Enter Intended Users',
  INDICATIONS_OF_USE: 'Enter Indications of Use',
  CONTRA_INDICATIONS: 'Enter Contra - indications of Use',
  USE_ENVIRONMENT: 'Select Use Environment',
}

export const ERROR_MESSAGES = {
  INTENDED_USE_REQUIRED: 'Intended Use is required',
  INTENDED_POPULATION_REQUIRED: 'Intended Population is required',
  INTENDED_USERS_REQUIRED: 'Intended Users is required',
  INDICATIONS_REQUIRED: 'Indications of Use is required',
  CONTRA_INDICATIONS_REQUIRED: 'Contra-indications is required',
  USE_ENVIRONMENT_REQUIRED: 'Use Environment is required',
}

export const MODAL_LABELS = {
  ADD_TITLE: 'Add Intended Population',
  EDIT_TITLE: 'Edit Intended Population',
  ADD_INTENDED_USERS_TITLE: 'Add Intended Users',
  EDIT_INTENDED_USERS_TITLE: 'Edit Intended Users',
  ADD_INDICATIONS_TITLE: 'Add Indications of Use',
  EDIT_INDICATIONS_TITLE: 'Edit Indications of Use',
  INTENDED_POPULATION: 'Intended Population*',
  INTENDED_USERS: 'Intended Users*',
  INDICATIONS_OF_USE: 'Indications of Use*',
  MODELS: 'Models*',
  STATUS: 'Status*',
  BACK: 'Back',
  SAVE: 'Save',
}

export const MODAL_PLACEHOLDERS = {
  INTENDED_POPULATION: 'Enter Intended Population',
  INTENDED_USERS: 'Enter Intended Users',
  INDICATIONS_OF_USE: 'Enter Indications of Use',
  MODELS: 'Select Models',
  STATUS: 'Select Status',
}

export const MODAL_ERROR_MESSAGES = {
  INTENDED_POPULATION_REQUIRED: 'Intended Population is required',
  INTENDED_USERS_REQUIRED: 'Intended Users is required',
  INDICATIONS_OF_USE_REQUIRED: 'Indications of Use is required',
  MODELS_REQUIRED: 'Models is required',
  STATUS_REQUIRED: 'Status is required',
}

export const MODAL_FIELD_KEYS = {
  INTENDED_POPULATION: 'intended_population',
  INTENDED_USERS: 'intended_user',
  INDICATIONS_OF_USE: 'indication_use',
  MODELS: 'model_ids',
  STATUS_ID: 'status_id',
  STATUS_ID_FIELD: 'status_id',
  STATUS_NAME_FIELD: 'status_name',
}
export const ONCHANGE = {
  INTENDED_USE: 'intendedUse',
  INTENDED_POPULATION: 'intendedPopulation',
  INTENDED_USERS: 'intendedUsers',
  INDICATIONS_OF_USE: 'indicationsOfUse',
  CONTRA_INDICATIONS: 'contraIndicationsOfUse',
  USE_ENVIRONMENT: 'useEnvironment',
}

// Field label map for validation focus
export const FIELD_LABEL_MAP = {
  intendedUse: FORM_LABELS.INTENDED_USE,
  intendedPopulation: FORM_LABELS.INTENDED_POPULATION,
  intendedUsers: FORM_LABELS.INTENDED_USERS,
  indicationsOfUse: FORM_LABELS.INDICATIONS_OF_USE,
  contraIndicationsOfUse: FORM_LABELS.CONTRA_INDICATIONS,
  useEnvironment: FORM_LABELS.USE_ENVIRONMENT,
}

export const FIELD_ORDER = Object.keys(FIELD_LABEL_MAP)

export const INTENDED_POPULATION_COLUMNS = [
  {
    headerName: 'S.No.',
    field: 'sno',
    sortable: false,
    disableColumnMenu: true,
    flex: 0.5,
  },
  {
    headerName: 'Intended Population',
    field: 'value',
    sortable: false,
    disableColumnMenu: true,
    flex: 2,
  },
  {
    headerName: 'Status',
    field: 'status',
    sortable: false,
    disableColumnMenu: true,
    flex: 1,
  },
]

export const INTENDED_USERS_COLUMNS = [
  {
    headerName: 'S.No.',
    field: 'sno',
    sortable: false,
    disableColumnMenu: true,
    flex: 0.5,
  },
  {
    headerName: 'Intended Users',
    field: 'value',
    sortable: false,
    disableColumnMenu: true,
    flex: 2,
  },
  {
    headerName: 'Status',
    field: 'status',
    sortable: false,
    disableColumnMenu: true,
    flex: 1,
  },
]

export const INDICATIONS_OF_USE_COLUMNS = [
  {
    headerName: 'S.No.',
    field: 'sno',
    sortable: false,
    disableColumnMenu: true,
    flex: 0.5,
  },
  {
    headerName: 'Indications of Use',
    field: 'value',
    sortable: false,
    disableColumnMenu: true,
    flex: 2,
  },
  {
    headerName: 'Status',
    field: 'status',
    sortable: false,
    disableColumnMenu: true,
    flex: 1,
  },
]

export const TABLE_COLUMNS = {
  ACTIONS: 'Actions',
} as const

export const TABLE_FIELDS = {
  ACTIONS: 'actions',
  STATUS: 'status',
  VALUE: 'value',
  ID: 'id',
  REF_ID: 'ref_id',
  USE_ENVIRONMENT: 'use_environment',
} as const

export const DEFAULT_VALUES = {
  EMPTY_DISPLAY: '-',
} as const

export const ALIGNMENT = {
  CENTER: 'center',
} as const

export const ID_FIELDS = {
  ID: 'id',
  INTENDED_USE: 'intendedUse',
} as const

export const TEMP_ID_PATTERN = {
  PREFIX: 'temp-',
} as const
