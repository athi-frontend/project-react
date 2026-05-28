/**
    Classification : Confidential
**/



export const QUERY_KEYS = {
  PLACE_OF_VALIDATION: 'placeOfValidation',
  VALIDATION_REPORT: 'validationReport',
  DIR_OPTIONS: 'dirOptions',
  DECISION_OPTION: 'decision',
  FUNCTIONAL_BLOCK_OPTION: 'functionalblock',
};
export const API_BASE = {
  PILOT_VALIDATION_REPORT: 'pilot-validation-report',
  API_ROOT:'api/v1/dnd',
};

export const API_ENDPOINTS = {
  GET_PLACE_OF_VALIDATION: (projectId: number) => `${API_BASE.API_ROOT}/${API_BASE.PILOT_VALIDATION_REPORT}/place-of-validation/${projectId}`,
  GET_VALIDATION_REPORT: (validationId: number) => `${API_BASE.API_ROOT}/${API_BASE.PILOT_VALIDATION_REPORT}/${validationId}`,
  POST_VALIDATION_REPORT: () => `${API_BASE.API_ROOT}/${API_BASE.PILOT_VALIDATION_REPORT}`,
  GET_DIR_OPTIONS: (projectId: number, projectStageOrderId: number) =>
    `${API_BASE.API_ROOT}/dir/all?project_id=${projectId}&project_stage_order_id=${projectStageOrderId}`,
  GET_FUNCTIONAL_BLOCK: (projectId: number) => `${API_BASE.API_ROOT}/functional-block/${projectId}`,
  GET_DECISION: `/${API_BASE.API_ROOT}/decision/all`,
  TEMPLATE_DOWNLOAD: (mediaId: number) => `api/v1/dms/assets/download/${mediaId}`,
};

export const PATIENT_MODAL = {
  TITLE_ADD: 'Patient Details',
  TITLE_EDIT: 'Edit Patient Details',
  LABELS: {
    PATIENT_NAME: 'Name of the Patient*',
    DATE_TIME: 'Date and Time*',
    AGE: 'Age*',
    GENDER: 'Gender*',
    PARAMETERS_MEASURED: 'Parameters Measured*',
    MEASURED_VALUES: 'Measured Values*',
    COMMENTS: 'Comments',
  },
  PLACEHOLDERS: {
    PATIENT_NAME: 'Enter Patient Name',
    DATE_TIME: 'Enter Date and Time',
    AGE: 'Enter Age',
    PARAMETERS_MEASURED: 'Enter Parameters Measured',
    MEASURED_VALUES: 'Enter Measured Values',
    COMMENTS: 'Input text',
  },
  ERRORS: {
    PATIENT_NAME: 'Patient Name is required',
    DATE_TIME: 'Date and Time is required',
    AGE: 'Age is required',
    GENDER: 'Gender is required',
    PARAMETERS_MEASURED: 'Parameters Measured is required',
    MEASURED_VALUES: 'Measured Values is required',
  },
  GENDER_OPTIONS: {
    MALE: 'Male',
    FEMALE: 'Female',
    OTHERS: 'Others',
  },
  FIELDS: {
    PATIENT_NAME: 'patientName',
    DATE_TIME: 'dateTime',
    AGE: 'age',
    GENDER: 'gender',
    PARAMETERS_MEASURED: 'parameters_measured',
    MEASURED_VALUE: 'measured_value',
    COMMENTS: 'comments',
  },
  MISC: {
    SLASH: '/',
    LOG_PREFIX: 'Saving with patientInfo:',
    EMPTY_STRING: '',
  },
  DATE_FORMAT: "yyyy-MM-dd'T'HH:mm:ssXXX",
  FORMCONTROL_COMPONENT: "fieldset",
  BOX_COMPONENT: "legend",
} as const;

export const FEEDBACK_MODAL = {
  TITLE_ADD: 'Feedback Details',
  TITLE_EDIT: 'Edit Feedback',
  LABELS: {
    INTENDED_USE_MET: 'Has the Intended use is met?',
    FEEDBACK: 'Feedback Details*',
    FUNCTIONAL_BLOCK: 'Functional Block*',
    DIR: 'DIR*',
    DECISION: 'Decision*',
    MEASURED_VALUES: 'Measured Values*',
    COMMENTS: 'Comments',
  },
  PLACEHOLDERS: {
    FEEDBACK: 'Enter Feedback Details',
    FUNCTIONAL_BLOCK: 'Enter Functional Block',
    DIR: 'Select DIR',
    DECISION: 'Enter Decision',
    MEASURED_VALUES: 'Enter Measured Values',
    COMMENTS: 'Input text',
  },
  ERRORS: {
    FEEDBACK: 'Feedback Details is required',
    FUNCTIONAL_BLOCK: 'Functional Block is required',
    DIR: 'DIR is required',
    DECISION: 'Decision is required',
    MEASURED_VALUES: 'Measured Values is required',
  },
  FIELDS: {
    INTENDED_USE_MET: 'intended_use_met',
    FEEDBACK: 'feedback',
    FUNCTIONAL_BLOCK: 'functional_block',
    DIR: 'dir',
    DECISION: 'decision',
    MEASURED_VALUE: 'measured_value',
    COMMENTS: 'comments',
  },
  RADIO_OPTIONS: {
    YES: 'yes',
    NO: 'no',
  },
  DROPDOWN_KEYS: {
    FUNCTIONAL_BLOCK_ID: 'functional_block_id',
    TITLE: 'title',
    DESIGN_INPUT_REQUIREMENT_ID: 'design_input_requirement_id',
    DIR_ID: 'dir_id',
    DECISION_ID: 'decision_id',
    DECISION: 'decision',
  },
  MISC: {
    DATA: 'data',
    BLOCKS: 'blocks',
    EMPTY_STRING: '',
  },
} as const;

export const PILOT_VALIDATION = {
  // Error Messages
  ERROR_MESSAGES: {
    PLACE_OF_VALIDATION: 'Place of Validation is required',
    PRODUCT_SERIAL_NO: 'Product Serial No. is required',
    SW_VERSION_NO: 'S/W Version No. is required',
    CORRECTIONS_TEXT: 'Corrections/Corrective Actions is required',
    CONCLUSION: 'Conclusion is required',
    FEEDBACK_DETAILS: 'Feedback details is required',
    FEEDBACK_DOCUMENTS: 'Feedback document is required',
    FEEDBACK_DOCUMENTS_MULTIPLE: 'Only one feedback file is allowed',
  },

  // UI Text
  UI_TEXT: {
    PAGE_TITLE: 'Pilot Validation Report',
    PLACE_OF_VALIDATION_LABEL: 'Place of Validation*',
    PLACE_OF_VALIDATION_PLACEHOLDER: 'Select Place of Validation',
    PRODUCT_SERIAL_NO_LABEL: 'Product Serial No.*',
    PRODUCT_SERIAL_NO_PLACEHOLDER: 'Enter Product Serial No.',
    SW_VERSION_NO_LABEL: 'S/W Version No.*',
    SW_VERSION_NO_PLACEHOLDER: 'Enter S/W Version No.',
    PATIENT_DETAILS_TITLE: 'Patient Details',
    FEEDBACK_TITLE: 'Feedback',
    FEEDBACK_UPLOAD_TITLE: 'Feedback Upload',
    CORRECTIONS_LABEL: 'Corrections/Corrective Actions*',
    CORRECTIONS_PLACEHOLDER: 'Enter Corrections/Corrective Actions',
    CONCLUSION_LABEL: 'Conclusion*',
    CONCLUSION_PLACEHOLDER: 'Enter Conclusion',
    DOWNLOAD_TEMPLATE: 'Download Template',
    CANCEL_BUTTON: 'Cancel',
    SAVE_BUTTON: 'Save',
    SAVING_BUTTON: 'Saving...',
  },

  // Static Labels (NEWLY ADDED)
  STATIC_LABELS: {
    LOADING: 'Loading...',
    SERIAL_NO: 'S.No.',
    DATE_TIME: 'Date and Time',
    PATIENT_INFO: 'Name of the Patient/Age/Sex',
    PARAMETERS_MEASURED: 'Parameters Measured',
    ACTION_LOWER: 'action',
    ACTION_CAPS: 'Action',
    FEEDBACK_DETAILS: 'Feedback Details',
    FUNCTIONAL_BLOCK: 'Functional Block',
    DIR: 'DIR',
    DIR_ROW: 'DIR for row:',
    DECISION: 'Decision',
    ID: 'id',
    PLACE: 'place',
    BUTTON: 'button',
    CONTAINED: 'contained',
    OUTLINED: 'outlined',
    NUMBER: 'number',
    DOWNLOADING: 'Downloading...',
  },

  // Other Constants
  DATE_FORMAT: 'dd/MM/yyyy',
  DATE_TIME_FORMAT: 'dd/MM/yyyy hh:mm a',
  


  ALERT_MESSAGES: {
    CUSTOME_ALERT: 'customAlert',
    TITLE: "Can't Upload Feedback File",
    TEXT: 'You can upload one feedback file at a time.',
    ICON: 'error',
    TEMPLATE_DOWNLOAD: 'Template file not available',
    TEMPLATE_DOWNLOAD_TITLE: 'Error',
  },

  API_FIELDS: {
    PLACE_OF_VALIDATION: 'place_of_validation',
    SERIAL_NO: 'serial_no',
    VERSION_NO: 'version_no',
    CORRECTIVE_ACTIONS: 'corrective_actions',
    CONCLUSION: 'conclusion',
    PATIENT_DETAILS: 'patient_details',
    FEEDBACK_DETAILS: 'feedback_details',
    DOCUMENTS_TO_CREATE: 'documents_to_create',
    DOCUMENTS_TO_DELETE: 'documents_to_delete',
    CREATE_META_DATA: 'create_meta_data',
    UPDATE_META_DATA: 'update_meta_data',
  },
  FORM_FIELDS: {
    PLACE_OF_VALIDATION: 'placeOfValidation',
    PRODUCT_SERIAL_NO: 'productSerialNo',
    SW_VERSION_NO: 'swVersionNo',
    CORRECTIONS_TEXT: 'correctionsText',
    CONCLUSION: 'conclusion',
    PATIENT_DETAILS: 'patient_details',
    FEEDBACK_DETAILS: 'feedback_details',
    FEEDBACK_DOCUMENTS: 'feedbackDocuments',
    SUPPORTING_DOCUMENTS: 'supportingDocuments',
  },
  FILE: {
    TYPE_FEEDBACK: 'feedback',
    TYPE_SUPPORTING: 'supporting_document',
    DEFAULT_FILE_TYPE: 'application/pdf',
  },
  FEEDBACK_FIELDS: {
    ID: 'id',
    FEEDBACK: 'feedback',
    FUNCTIONAL_BLOCK: 'functional_block',
    DIR: 'dir',
    DECISION: 'decision',
    MEASURED_VALUE: 'measured_value',
    COMMENTS: 'comments',
  },
  FILE_META: {
    FILE_ID: 'file_id',
    FILE_NAME: 'file_name',
    FILE_TYPE: 'file_type',
    FILE_CATEGORY_ID: 'file_category_id',
    FILE_DESCRIPTION: 'file_description',
    DATE_OF_UPLOAD: 'date_of_upload',
    SOURCE: 'source',
    PURPOSE: 'purpose',
    FILE_TAGS: 'file_tags',
    TAG_ID: 'tag_id',
    TAG_NAME: 'tag_name',
  },
  FILE_ID_KEYS: {
    FILE_ID: 'file_id',
    ID: 'id',
  },
  ACTION_TYPES: {
    SUCCESS: 'success',
    FAILED: 'failed',
    DELETE: 'delete',
  },
  TABLE_COLUMNS: {
    PATIENT: {
      SERIAL_NO: 'serialNo',
      DATE_TIME: 'dateTime',
      PATIENT_INFO: 'patientInfo',
      PARAMETERS_MEASURED: 'parameters_measured',
    },
    FEEDBACK: {
      FEEDBACK: 'feedback',
      FUNCTIONAL_BLOCK: 'functional_block_id',
      DIR: 'dir',
      DECISION: 'decision',
    },
  },
  DOWNLOAD_TEMPLATE: {
    ERROR_MESSAGES: {
      ASSET_URL_NOT_FOUND: 'Asset URL not found in the API response',
      FETCH_FILE_FAILED: 'Failed to fetch file from asset URL:',
    },
    DEFAULT_FILENAME: 'template.xlsx',
    HTTP_METHOD: 'GET',
    HEADERS: {
      CONTENT_DISPOSITION: 'content-disposition',
      CONTENT_TYPE: 'content-type',
    },
    CONTENT_DISPOSITION: {
      ATTACHMENT: 'attachment',
    },
    CONTENT_TYPES: {
      WORD_DOCUMENT: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      EXCEL_XLSX: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      EXCEL_XLS: 'application/vnd.ms-excel',
      PDF: 'application/pdf',
      CSV: 'text/csv',
    },
    FILENAMES: {
      DOCX: 'template.docx',
      XLSX: 'template.xlsx',
      XLS: 'template.xls',
      PDF: 'template.pdf',
      CSV: 'template.csv',
    },
    REGEX: {
      FILENAME_EXTRACTION: /filename="([^"]+)"/,
    },
  },

  // Default Form Objects
  DEFAULT_FORMS: {
    VALIDATION_FORM: {
      placeOfValidation: '',
      productSerialNo: '',
      swVersionNo: '',
      correctionsText: '',
      conclusion: '',
      feedbackDocuments: [] as any[],
      supportingDocuments: [] as any[],
      patient_details: [] as any[],
      feedback_details: [] as any[],
    },
    PATIENT: {
      id: null,
      patientName: '',
      dateTime: '',
      age: '',
      gender: '',
      parameters_measured: '',
      measured_value: '',
      comments: '',
    },
    FEEDBACK: {
      id: null,
      intended_use_met: '',
      feedback: '',
      functional_block: 0,
      dir: [] as number[],
      decision: 0,
      measured_value: '',
      comments: '',
    },
  },
} as const;

export const FIELD_LABEL_MAP = {
  placeOfValidation: 'Place of Validation*',
  productSerialNo: 'Product Serial No.*',
  swVersionNo: 'S/W Version No.*',
  correctionsText: 'Corrections/Corrective Actions*',
  conclusion: 'Conclusion*',
} as const

export const FIELD_ORDER = Object.keys(FIELD_LABEL_MAP)


export const PATIENT_FIELD_LABEL_MAP = {
  patientName: 'Name of the Patient*',
  dateTime: 'Date and Time*',
  age: 'Age*',
  gender: 'Gender*',
  parameters_measured: 'Parameters Measured*',
  measured_value: 'Measured Values*'
} as const

export const PATIENT_FIELD_ORDER = Object.keys(PATIENT_FIELD_LABEL_MAP)

export const FEEDBACK_FIELD_LABEL_MAP = {
  feedback: 'Feedback Details*',
  functional_block: 'Functional Block*',
  dir: 'DIR*',
  decision: 'Decision*',
  measured_value: 'Measured Values*'
} as const

export const FEEDBACK_FIELD_ORDER = Object.keys(FEEDBACK_FIELD_LABEL_MAP)
