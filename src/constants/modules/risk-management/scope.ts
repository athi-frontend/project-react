/**
 *Classification : Confidential
 **/
export const POSTSCOPE = 'postScope'
export const GETSCOPE = 'getScope'
export const GETPROJECTSTAGES = 'getProjectStages'
export const BASE_API_PATH = '/api/v1/'

export const API_ENDPOINTS = {
  POST_SCOPE_API: `${BASE_API_PATH}risk/scope`,
  GET_SCOPE: (project_id: number) => `${BASE_API_PATH}risk/scope/${project_id}`,
  GET_PROJECT_STAGES: (project_id: number) =>
    `${BASE_API_PATH}dnd/project-stage/${project_id}`,
  GET_RISK_STAGES: `${BASE_API_PATH}risk/risk-stages/all`
}

export const PROJECT_ID = 'project_id'

export const FIELD_IS_REQUIRED = {
  PLAN_TITLE: 'Plan Title is required',
  MEDICAL_DEVICE_DESCRIPTION: 'Medical Device Description is required',
  INTENDED_USE: 'Intended Use is required',
  USER_PROFILES: 'User Profiles selection is required',
  OPERATING_PRINCIPLE: 'Operating Principle Description is required',
  APPLICABLE_STAGES: 'Applicable Stages selection is required',
  PATIENT_POPULATION: 'At least one Patient Population entry is required',
  ANATOMICAL_SCOPE: 'At least one Anatomical Scope entry is required',
}

export const TITLE = 'Scope'
export const BASIC_INFORMATION_TITLE = 'Basic Information'
export const PATIENT_POPULATION_TITLE = 'Patient Population'
export const ANATOMICAL_SCOPE_TITLE = 'Anatomical Scope'
export const USER_PROFILES_TITLE = 'User Profiles'
export const OPERATING_PRINCIPLE_TITLE = 'Operating Principle'
export const APPLICABLE_STAGES_TITLE = 'Applicable Stages'

export const LABEL = {
  PLAN_TITLE: 'Plan Title*',
  MEDICAL_DEVICE_DESCRIPTION: 'Medical Device Description*',
  INTENDED_USE: 'Intended Use*',
  USER_PROFILES: 'User Profiles*',
  OPERATING_PRINCIPLE: 'Operating Principle Description*',
  APPLICABLE_STAGES: 'Applicable Stages*',
}

export const ONCHANGE_VALUE = {
  PLAN_TITLE: 'planTitle',
  MEDICAL_DEVICE_DESCRIPTION: 'medicalDeviceDescription',
  INTENDED_USE: 'intendedUse',
  USER_PROFILES: 'userProfiles',
  OPERATING_PRINCIPLE: 'operatingPrincipleDescription',
  APPLICABLE_STAGES: 'applicableStages',
}

export const PLACEHOLDER = {
  PLAN_TITLE: 'Enter Plan Title',
  MEDICAL_DEVICE_DESCRIPTION: 'Enter Medical Device Description',
  INTENDED_USE: 'Enter Intended Use',
  USER_PROFILES: 'Select User Profiles',
  USER_PROFILES_LOADING: 'Loading user profiles...',
  OPERATING_PRINCIPLE: 'Enter Operating Principle Description',
  APPLICABLE_STAGES: 'Select Applicable Stages',
  INPUT_TEXT: 'Input Text',
}

export const FIELD_COLUMN = {
  SNO: 'sno',
  AGE_RANGE: 'age_range',
  GENDER: 'gender',
  DISEASE_STATE: 'disease_state',
  BODY_PART: 'body_part',
  TYPE_OF_TISSUE: 'type_of_tissue',
  ACTION: 'actions',
}

export const FIELD_VALUE = {
  SNO: 'S.No.',
  AGE_RANGE: 'Age Range',
  GENDER: 'Gender',
  DISEASE_STATE: 'Disease State',
  BODY_PART: 'Body part',
  TYPE_OF_TISSUE: 'Type of Tissue',
  ACTION: 'Actions',
}

export const SAVE = 'Save'
export const CANCEL = 'Cancel'

export const ALERT_ACTIONS = {
  CUSTOM_ALERT: 'customAlert',
  TITLE: 'Something went wrong',
  ERROR: 'error',
}

export const ERROR_MESSAGES = {
  FAILED_TO_LOAD_USER_PROFILES: 'Failed to load user profiles',
}

// Patient Population Modal Constants
export const PATIENT_POPULATION_MODAL = {
  TITLE: 'Patient Population',
  AGE_RANGE_LABEL: 'Age Range*',
  AGE_RANGE_PLACEHOLDER: 'Enter Age Range*',
  GENDER_LABEL: 'Gender*',
  GENDER_PLACEHOLDER: 'Select Gender',
  GENDER_LOADING_PLACEHOLDER: 'Loading genders...',
  DISEASE_STATE_LABEL: 'Disease State*',
  DISEASE_STATE_PLACEHOLDER: 'Enter Disease State',
  AGE_RANGE_REQUIRED: 'Age Range is required',
  GENDER_REQUIRED: 'Gender is required',
  DISEASE_STATE_REQUIRED: 'Disease State is required',
  FAILED_TO_LOAD_GENDERS: 'Failed to load genders',
  // Field names for onChange handlers
  FIELD_NAMES: {
    AGE_RANGE: 'ageRange',
    GENDER: 'gender',
    DISEASE_STATE: 'diseaseState',
  },
}

// Anatomical Scope Modal Constants
export const ANATOMICAL_SCOPE_MODAL = {
  TITLE: 'Anatomical Scope',
  BODY_PART_LABEL: 'Body Part*',
  BODY_PART_PLACEHOLDER: 'Enter Body Part',
  TYPE_OF_TISSUE_LABEL: 'Type of Tissue*',
  TYPE_OF_TISSUE_PLACEHOLDER: 'Enter Type of Tissue',
  BODY_PART_REQUIRED: 'Body Part is required',
  TYPE_OF_TISSUE_REQUIRED: 'Type of Tissue is required',
  // Field names for onChange handlers
  FIELD_NAMES: {
    BODY_PART: 'bodyPart',
    TYPE_OF_TISSUE: 'typeOfTissue',
  },
}

// Field names for InputField components
export const FIELD_NAMES = {
  ID: 'id',
  GENDER_NAME: 'gender_name',
  USER_TYPE_NAME: 'user_type_name',
  PROJECT_STAGE_ORDER_ID: 'project_stage_order_id',
  DISPLAY_VALUE: 'displayValue',
  RISK_STAGE_ID: 'stage_id',
  RISK_STAGE_NAME: 'stage_name',
}

// Form field names for onChange handlers
export const FORM_FIELD_NAMES = {
  AGE_RANGE: 'ageRange',
  GENDER: 'gender',
  DISEASE_STATE: 'diseaseState',
  BODY_PART: 'bodyPart',
  TYPE_OF_TISSUE: 'typeOfTissue',
}

// Validation field names
export const VALIDATION_FIELD_NAMES = {
  AGE_RANGE: 'ageRange',
  GENDER: 'gender',
  DISEASE_STATE: 'diseaseState',
  BODY_PART: 'bodyPart',
  TYPE_OF_TISSUE: 'typeOfTissue',
  PLAN_TITLE: 'planTitle',
  MEDICAL_DEVICE_DESCRIPTION: 'medicalDeviceDescription',
  INTENDED_USE: 'intendedUse',
  USER_PROFILES: 'userProfiles',
  OPERATING_PRINCIPLE_DESCRIPTION: 'operatingPrincipleDescription',
  APPLICABLE_STAGES: 'applicableStages',
}
export const STRING_TYPE = 'string'
export const TEMP_ID_PREFIX = 'temp_'
export const ID_FIELD = 'id'

export const VALIDATION_FIELD_LABEL_MAP = {
  planTitle: 'Plan Title*',
  medicalDeviceDescription: 'Medical Device Description*',
  intendedUse: 'Intended Use*',
  userProfiles: 'User Profiles*',
  operatingPrincipleDescription: 'Operating Principle Description*',
  applicableStages: 'Applicable Stages*',
}

export const SCOPE_FIELD_ORDER = Object.keys(VALIDATION_FIELD_LABEL_MAP)
