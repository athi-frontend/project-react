import {
  FormErrors,
  FieldMappingEntry,
} from '@/types/modules/dnd/feasibilityStudy'
import { ButtonProps } from '@/types/components/ui/button'
import {
  INITIAL_FORM_DATA,
  FORM_FIELDS,
  COST_FORM_FIELDS,
} from '@/lib/modules/dnd/feasibilityStudy'
import { NUMBERMAP } from '@/constants/common'

/**
  Classification : Confidential
**/
export const COMPONENT_TYPES = {
  DESCRIPTION: 'Description',
  INPUT_FIELD: 'InputField',
  MULTI_SELECT: 'MultiSelect',
  DATA_GRID: 'DataGrid',
} as const

export const VALUE_SOURCES = {
  PROJECT_ID: 'projectId',
  STATIC: 'static',
  FORM_DATA: 'formData',
}

export const FIELD_KEYS = {
  ROLES: 'roles',
  CURRENCY: 'currency',
  COST: 'cost',
  UPLOADED_FILE: 'uploadedFile',
  DOCUMENTS: 'Documents',
}

export const ALERT_MESSAGES = {
  DELETE_CONFIRMATION_TITLE: 'Delete Confirmation',
  DELETE_CONFIRMATION_TEXT: 'Are you sure you want to delete this?',
  DELETE_CONFIRMATION_ICON: 'warning',
}

export const INITIAL_ERRORS: FormErrors = {
  ...Object.keys(INITIAL_FORM_DATA).reduce(
    (acc, key) => ({ ...acc, [key]: '' }),
    {} as FormErrors
  ),

  productCost: '',
  equipmentCost: '',
  developmentalCost: '',
  manufacturingCost: '',
  otherCost: '',
}

export const API_FIELDS_MAPPING = Object.fromEntries(
  FORM_FIELDS.map(({ field, apiKey }) => [field, apiKey])
)

export const COST_API_FIELDS_MAPPING = Object.fromEntries(
  COST_FORM_FIELDS.map(({ field, apiKey }) => [field, apiKey])
)

export const VALIDATION_MESSAGES = {
  ROLES_REQUIRED: 'Role is required',
  FIELD_REQUIRED: (fieldName: string) => `${fieldName} is required`,
}

export const SUBMIT_DATA_MAPPING: Record<
  string,
  {
    formKey: string
    valueSource?: string
    staticValue?: string | number | boolean | null
  }
> = {
  project_id: { formKey: 'project_id', valueSource: VALUE_SOURCES.PROJECT_ID },
  ...Object.fromEntries(
    FORM_FIELDS.map(({ apiKey, field }) => [apiKey, { formKey: field }])
  ),
  status: {
    formKey: 'status',
    valueSource: VALUE_SOURCES.STATIC,
    staticValue: 1,
  },
}

export const BUTTONS: (ButtonProps & { handlerKey?: string })[] = [
  { label: 'Approve' },
  {
    label: 'Send it for CEO Review',
    handlerKey: 'commentsModal',
  },
  { label: 'Redo' },
  { label: 'Cancel' },
  { label: 'Save', handlerKey: 'handleSubmit' },
]

export const BUTTON_HANDLER_KEYS = {
  COMMENTS_MODAL: 'commentsModal',
  HANDLE_SUBMIT: 'handleSubmit',
}

export const CLASS_NAMES = {
  CONTAINER: 'feasibility-study',
  CONTENT_WRAPPER: 'mui-form',
  BUTTON_SECONDARY: 'btn-secondary',
  BUTTON_PRIMARY: 'btn-primary',
}

export const FIELD_MAPPING: FieldMappingEntry[] = FORM_FIELDS.map(
  ({ field, label }) => ({
    field,
    name: label,
    validationName: label.replace(/\*$/, ''),
    apiKey: API_FIELDS_MAPPING[field] ?? field,
  })
)

export const FEASIBILITY_STUDY_KEY = 'feasibilityStudy'
export const FETCH_DECISION = 'feasibilityStudyDecision'
export const FETCH_CURRENCIES = 'currencies'
export const ROLES_KEY = 'roles'
export const SUCCESS_ALERT = 'success'
export const FAILED_ALERT = 'failed'
export const DENIED_ALERT = 'denied'
export const OBJECT = 'object'

export const FEASIBILITY_STUDY_ENDPOINTS = {
  FETCH: (projectId: number) => `api/v1/dnd/feasibility-study/${projectId}`,
  SAVE: 'api/v1/dnd/feasibility-study/',
  FETCH_DECISION: (projectId: number) =>
    `api/v1/dnd/feasibility-study/decision/all?project_id=${projectId}`,
  SAVE_DECISION: 'api/v1/dnd/feasibility-study/decision/',
  FETCH_CURRENCIES: `/api/v1/organization/currency/all?status=${NUMBERMAP.ONE}`,
}

export const FEASIBILITY_STUDY_ENDPOINT = 'api/v1/dnd/feasibility-study'
export const ROLES_ENDPOINT = '/api/v1/organization/roles/all?status=1'

export const COST_LABEL = 'Cost*'
export const DESIGN_TEAM_LABEL = 'Design Team*'
export const DESIGN_TEAM_ROLE_TITLE = 'Design Team Role'
export const MULTI_SELECT_ID_FIELD = 'currency_id'
export const MULTI_SELECT_VALUE_FIELD = 'currency_name'
export const COST_TITLE = 'Cost'

export const ERROR_MESSAGES = {
  UNKNOWN_ERROR: 'Unknown error',
  SAVE_FAILED: 'Failed to save feasibility study data',
  FETCH_DECISION_FAILED: 'Failed to fetch feasibility Decision data',
  SAVE_DECISION_FAILED: 'Failed to save feasibility study Decision data',
  DECISION_REQUIRED: 'Decision is required',
  SAVE_ERROR: 'Failed to save data',
  FETCH_CURRENCIES_FAILED: 'Failed to fetch currencies',
  FETCH_CURRENCIES_ERROR_LOG: 'Error fetching currencies:',
}

export const FEASIBILITY_TYPES = {
  FINANCIAL: 'Financial Feasibility',
  MARKETING: 'Marketing Strategy Alignment',
  TECHNICAL: 'Technical Feasibility',
}

export const STEPS = {
  PROCURE: 'Procure',
  PROCURE_VALUE: 'procure',
  PROCEED: 'Proceed with Design',
  PROCEED_VALUE: 'design',
  DROP: 'Drop',
  DROP_VALUE: 'drop',
}
export const PLACEHOLDER_TEXT = 'Your comment here'
export const SAVING_BUTTON_TEXT = {
  DEFAULT: 'Save',
  SAVING: 'Saving...',
}
export const FIELDS = {
  OTHER_REQUIREMENT: 'otherRequirements',
  CONCLUSION: 'conclusion',
  UPLOAD_FILE: 'uploadedFile',
  DESIGN_TEAM: 'designTeam',
  CURRENCY: 'currency',
}
export const REQUIRED_COST_FIELDS = [
  { id: 'productCost', label: 'Product Bill of Material Cost' },
  { id: 'equipmentCost', label: 'Capital Equipment & Tool Cost' },
  { id: 'developmentalCost', label: 'Developmental Cost' },
  { id: 'manufacturingCost', label: 'Manufacturing Cost per Product' },
]
export const COST_FIELD_MAP: { [key: string]: string } = {
  'Product Bill of Material Cost': 'productCost',
  'Capital Equipment & Tool Cost': 'equipmentCost',
  'Developmental Cost': 'developmentalCost',
  'Manufacturing Cost per Product': 'manufacturingCost',
  'Other Cost, if any': 'otherCost',
}

export const LABELS = {
  DESIGN_TEAM: 'Design Team*',
  COST: 'Cost*',
}

export const TYPOGRAPHY_PROPS = {
  errorCaption: {
    color: 'error',
    variant: 'caption' as const,
  },
}

export const FEASIBILITY_ERROR_FIELDS = [
  'productCost',
  'equipmentCost',
  'developmentalCost',
  'manufacturingCost',
  'otherCost',
  'uploadedFile',
] as const

export const FIELD_SELECTORS: Record<string, string> = {
  uploadedFile: '[data-file-upload-manager]',
}

export const FORM_DATA_KEYS = {
  DOCUMENTS_TO_CREATE: 'documents_to_create',
  DOCUMENTS_TO_DELETE: 'documents_to_delete',
  CREATE_META_DATA: 'create_meta_data',
  UPDATE_META_DATA: 'update_meta_data',
}

export const FIELD_LABEL_MAP = {
  scope: 'Scope*',
  designMethodology: 'Design Methodology*',
  projectDuration: 'Project Duration*',
  totalcost: 'Cost*',
  technicalFeasibility: 'Technical Feasibility*',
  trainingRequirement: 'Training Requirement*',
  projectRisk: 'Project Risk*',
  dependencies: 'Dependencies*',
  impact: 'Impact on the Ongoing Projects*',
  regulatoryImplications: 'Regulatory Implications*',
  otherRequirements: 'Other Requirements Identified',
  conclusion: 'Conclusion*',
  currency: 'Currency',
  roles: 'Design Team*',
  uploadedFile: 'Documents*',
}

export const FIELD_ORDER = Object.keys(FIELD_LABEL_MAP)


export const MENU_NAME = 'FEASIBILITY_STUDY'