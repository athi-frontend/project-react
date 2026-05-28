export const ERROR_MESSAGES = {
  FILE_SIZE_EXEEDS: 'File size exceeds 5MB limit',
  FILE_UPLOAD_LIMIT:"The maximum number of files you can upload is 20",
  FILE_TYPE_NOT_SUPPORTED:
    'File type not supported. Please upload PDF, DOCX, XLSX files.',
  FILE_TYPE_IMAGE_NOT_SUPPORTED:
    'File type not supported. Please upload JPG, JPEG, PNG files.',
  REQUIRED_FILE_NAME: 'File name is required',
  REQUIRED_PURPOSE: 'Purpose is required',
  REQUIRED_CATEGORY: 'Category is required',
  REQUIRED_STATUS: 'Status is required',
  REQUIRED_SOURCE: 'Source is required',
  REQUIRED_TAGS: 'At least one tag is required',
  REQUIRED_DESCRIPTION:'Description is required'
}

export const LABELS = {
  LABEL_PURPOSE: 'Purpose*',
  LABEL_CATEGORY: 'File Category*',
  LABEL_TAGS: 'Add Tags*',
  LABEL_SOURCE: 'Source*',
  LABEL_DESCRIPTION: 'Description*',
}

export const PLACEHOLDERS = {
  PURPOSE: 'Enter purpose',
  CATEGORY: 'File category',
  TAGS: 'Add your Tags here',
  SOURCE: 'Enter source',
  DESCRIPTION: 'Enter Description',
}

export const FORM_DATA_VALUES = {
  ID: 'id',
  FIELD_PURPOSE: 'purpose',
  FIELD_CATEGORY: 'categoryId',
  FIELD_TAGS: 'tags',
  FIELD_SOURCE: 'source',
  FIELD_DESCRIPTON: 'description',
  CATEGORY_ID: 'category_id',
  CATEGORY_NAME: 'file_category',
  TAGS_KEY_VALUE: 'tag_value',
} as const

export const FILE_UPLOAD_CONSTANTS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024,
  FILE_STATUS_ACTIVE: 'Active',
  FILE_STATUS_PENDING: 'Pending',
  ACTIVE_STATUS: 1,
  PENDING_STATUS: 2,
  ALLOWED_TYPES: ['.pdf', '.docx', '.xlsx'],
  ALLOWED_TYPES_IMAGE: ['.jpg', '.jpeg', '.png'],
}

export const COLUMN_HEADERS = {
  FILE_NAME: 'File Name',
  SOURCE: 'Source',
  DATE_OF_UPLOAD: 'Date of Upload',
  FILE_CATEGORY: 'File Category',
  FILE_STATUS: 'File Status',
  ACTIONS: 'Actions',
}

export const COLUMN_FIELDS = {
  NAME: 'name',
  SOURCE: 'source',
  UPLOAD_DATE: 'uploadDate',
  CATEGORY_ID: 'categoryId',
  STATUS: 'status',
  ACTIONS: 'actions',
}
export const DATE_FORMATS = {
  DD_MM_YYYY: 'dd-MM-yyyy',
} as const

export const DEFAULT_VALUES = {
  DATE_OF_UPLOAD: new Date().toLocaleDateString(),
}

export const COLUMN_WIDTHS = {
  FILE_NAME: 200,
  SOURCE: 150,
  DATE_OF_UPLOAD: 200,
  FILE_CATEGORY: 180,
  FILE_STATUS: 180,
  ACTIONS: 150,
}

export const FILE_STATUS = {
  ACTIVE: 'Active',
  PENDING: 'Pending',
}
