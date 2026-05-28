import { FormState } from "@/types/modules/dnd/uatValidation";
import { FinalFileData } from "@/lib/utils/common";

/**
 Classification : Confidential
**/

export const FILE_TYPE = {
  SUPPORTING: 'supporting_document',
  FEEDBACK: 'feedback',
};

export const initialFormState: FormState = {
  data: {
    validationPlanDetails: '',
    purposeOfValidation: '',
    numberOfUnits: '',
    periodOfUsage: '',
    unitConfiguration: '',
    functionInvolved: '',
    validationPlaces: '',
    validationDocuments: '',
    basicModel: '',
  },
  errors: {
    validationPlanDetails: '',
    purposeOfValidation: '',
    numberOfUnits: '',
    periodOfUsage: '',
    unitConfiguration: '',
    functionInvolved: '',
    validationPlaces: '',
    validationDocuments: '',
    basicModel: '',
    feedbackFilesError: '',
  },
};

export const fieldLabels: Record<keyof FormState['data'], string> = {
  validationPlanDetails: 'Validation Plan Details',
  purposeOfValidation: 'Purpose of Validation',
  numberOfUnits: 'No. of Units to be Validated',
  periodOfUsage: 'Period of Usage for Validation',
  unitConfiguration: 'Unit Configuration',
  functionInvolved: 'Function Involved in Validation',
  validationPlaces: 'Validation Places',
  validationDocuments: 'Validation Documents',
  basicModel: 'Basic Model (if derivative)',
};

export const INITIAL_FILE_DATA: FinalFileData = {
  documents_to_create: [],
  documents_to_delete: [],
  create_meta_data: {},
  update_meta_data: {},
  local_files_to_delete: [],
};

export const MODAL_CONSTANTS = {
  validationPlan: {
    title: {
      add: "Add Validation Plan",
      edit: "Edit Validation Plan",
    },
    duplicate_entry : 'Duplicate Place of Validation is not allowed.',
    inputLabel: "Validation Plan Name*",
  },
  standardDoc: {
    title: {
      add: "Add Standard Document",
      edit: "Edit Standard Document",
    },
    duplicate_entry : 'Duplicate Standard Document Name is not allowed.',
    inputLabel: "Standard Document Name*",
  },
};

// formDataKeys.ts

export const FORM_DATA_KEYS = {
  PROJECT_ID: "project_id",
  VALIDATION_PLAN_DETAILS: "validation_plan_details",
  PURPOSE_OF_VALIDATION: "purpose_of_validation",
  UNITS_TO_BE_VALIDATED: "units_to_be_validated",
  FUNCTION: "function",
  PLACE_OF_VALIDATION: "place_of_validation",
  PERIOD_OF_USAGE: "period_of_usage",
  UNIT_CONFIGURATION: "unit_configuration",
  STANDARD_DOCUMENTS: "standard_documents",
  DOCUMENTS_TO_DELETE: "documents_to_delete",
  CREATE_META_DATA: "create_meta_data",
  UPDATE_META_DATA: "update_meta_data",
  DOCUMENTS_TO_CREATE: "documents_to_create",
  BASIC_MODEL: "basic_model"
};

export const VALIDATION_PLAN='validationPlan'
export const STANDARD_DOC='standardDoc'
export const STYLE={ mt: 1, display: "block" }
export const UAT_VALIDATION='uatValidation'

export const COLUMNS=[
                { field: 'id', headerName: 'ID', flex: 1 },
                { field: 'name', headerName: 'Name', flex: 2 },
              ]

export const COLUMNS1=[
                { field: 'sno', headerName: 'S.No', flex: 1 },
                { field: 'place', headerName: 'Place of Validation', flex: 2 },
              ]

export const COLUMNS2=[
                { field: 'sno', headerName: 'S.No', flex: 1 },
                { field: 'document', headerName: 'Document Name', flex: 2 },
              ]


export const FORM_CONSTANTS = {
  PAGE_TITLE: "User Acceptance and Validation Plan",
  LABEL_DESIGN: "Design",
  LABEL_BASIC_MODEL: "Basic Model (if derivative)",

  KEY_VALIDATION_PLAN_DETAILS: "validation-plan-details",
  LABEL_VALIDATION_PLAN_DETAILS: "Validation Plan Details*",
  PLACEHOLDER_VALIDATION_PLAN_DETAILS: "Enter validation plan details",

  KEY_PURPOSE_OF_VALIDATION: "purpose-of-validation",
  LABEL_PURPOSE_OF_VALIDATION: "Purpose of Validation*",
  PLACEHOLDER_PURPOSE_OF_VALIDATION: "Enter purpose of validation",

  LABEL_UNITS_TO_BE_VALIDATED: "No. of Units to be Validated*",
  PLACEHOLDER_UNITS_TO_BE_VALIDATED: "Enter No. of Units to be Validated",

  LABEL_PERIOD_OF_USAGE: "Period of Usage for Validating*",
  PLACEHOLDER_PERIOD_OF_USAGE: "Enter Period of Usage for Validating",

  LABEL_UNIT_CONFIGURATION: "Unit Configuration*",
  PLACEHOLDER_UNIT_CONFIGURATION: "Enter Unit Configuration",

  KEY_FUNCTION_INVOLVED: "function-involved",
  LABEL_FUNCTION_INVOLVED: "Functions Involved in Validating*",
  PLACEHOLDER_FUNCTION_INVOLVED: "Enter Functions Involved in Validating",

  TITLE_PLACE_OF_VALIDATION: "Place of Validation*",
  TITLE_STANDARD_DOCS: "Standard Documents Required for Validation",

  KEY_FEEDBACK_FILES: "feedback-files",
  FEEDBACK_UPLOAD_LABEL: "Feedback Upload*",
  FEEDBACK_FILES_REQUIRED_ERROR: "Feedback Upload is required",

  PLACE_OF_VALIDATION_REQUIRED :'Place of Validation is required',

  KEY_SUPPORTING_FILES: "supporting-files",

  // Alert constants
  CUSTOM_ALERT: "customAlert" as const,
  UPLOAD_LIMIT_ALERT_TITLE: "Upload Limit Reached",
  UPLOAD_LIMIT_ALERT_TEXT: "You can upload one feedback file at a time.",

  // File action constants
  FILE_TYPE_FEEDBACK: "feedback" as const,
  FILE_TYPE_SUPPORTING: "supporting" as const,
  FILE_ACTION_UPLOAD: "upload" as const,
  FILE_ACTION_EDIT: "edit" as const,

  ERROR: "error" as const,
  CAPTION:"caption",
  REGEX:/<[^<>]*>/g,
  VALIDATION_PLAN_DETAILS:'validationPlanDetails',
  PURPOSE_OF_VALIDATION:'purposeOfValidation',
  FUNCTION_INVOLVED:'functionInvolved',
  SUBMITTED:'submitted',
  PATH:"",
};

export const UAT_VALIDATION_SERVICES={
  ENDPOINTS:{
    FETCH_UAT:"api/v1/dnd/user-acceptance/project/",
    POST_UAT:"api/v1/dnd/user-acceptance"
  }
}

export const FIELD_LABEL_MAP = {
  validationPlanDetails: 'Validation Plan Details*',
  purposeOfValidation: 'Purpose of Validation*',
  numberOfUnits: 'No. of Units to be Validated*',
  periodOfUsage: 'Period of Usage for Validating*',
  unitConfiguration: 'Unit Configuration*',
  functionInvolved: 'Functions Involved in Validating*',
  feedbackFiles: 'Feedback Upload*'
} as const

export const FIELD_ORDER = Object.keys(FIELD_LABEL_MAP)


