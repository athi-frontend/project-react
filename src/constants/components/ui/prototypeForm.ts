import React from 'react'
import { NUMBERMAP } from "@/constants/common";
import { FormState, ButtonProps,
  RadioOption, } from "@/types/components/modules/prototypeForm";
import { CreateProjectStageData, ProjectStagesFormData, StageDropdownItem } from "@/types/modules/dnd/stageTypes";
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'

export const useProjectStagesData = (page: number, pageSize: number) => {
  return {
    data: {
      data: [],
      rowsAffected: {
        total_count: NUMBERMAP.ZERO,
      },
    },
    isLoading: false,
    error: null,
  }
}

export const useDeleteStage = () => {
  return {
    mutate: (id: string) => {},
  }
}

export const FORM_BUTTONS: ButtonProps[] = [
  {
    label: 'Submit for Review',
    onClick: () => {},
  },
  {
    label: 'Submit for Approval',
    onClick: () => {},
  },
  { label: 'Approve', onClick: () => {} },
  { label: 'Reject', onClick: () => {} },
  { label: 'Cancel', onClick: () => {} },
  { label: 'Save', onClick: () => {} },
]

export const REGULATORY_OPTIONS: RadioOption[] = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
]

export const getDeliverableColumns = (
  renderCommentsCell?: (params: GridRenderCellParams) => React.ReactNode
): GridColDef[] => [
  {
    field: 'dir_category',
    headerName: 'DIR Category',
    flex: NUMBERMAP.ONE,
    headerClassName: 'table-header',
    cellClassName: 'table-cell',
  },
  {
    field: 'dir_id',
    headerName: 'DIR #',
    flex: NUMBERMAP.ONE,
    headerClassName: 'table-header',
    cellClassName: 'table-cell',
  },
  {
    field: 'comments',
    headerName: 'Comments',
    flex: NUMBERMAP.ONE,
    headerClassName: 'table-header',
    cellClassName: 'table-cell',
    renderCell: renderCommentsCell,
  }
]


export const PROJECT_STAGES_MODAL = {
  INITIAL_FORM_DATA: {
    STAGE: "",
    TYPE_OF_STAGE: "",
    NUMBER_OF_STAGES: "",
  },

  REGEX: {
    NUMBER_OF_STAGES: /^\d*$/,
  },

  PROJECT_ID: 3,

  ERROR_MESSAGES: {
    INVALID_STAGE: "Please select a valid stage",
    FAILED_TO_CREATE: "Failed to create project stage",
    LOADING_STAGES: "Loading stages...",
    ERROR_LOADING_STAGES: "Error loading stages",
    FAILED_TO_LOAD_STAGES: "Failed to load stages",
  },

  STYLES: {
    MARGIN_TOP_20PX: "20px",
    MARGIN_TOP_40PX: "40px",
    JUSTIFY_CONTENT_FLEX_END: "flex-end",
  },

  ARIA_LABELS: {
    CLOSE_BUTTON: "close",
  },

  DIALOG: {
    MAX_WIDTH: "md",
    FULL_WIDTH: true,
  },

  FIELD_NAMES: {
    STAGE: "stage",
    NUMBER_OF_STAGES: "numberOfStages",
    DESIGN_STAGE: "design_stage",
  },

  BUTTONS: {
    VARIANT_OUTLINED: "outlined",
    VARIANT_CONTAINED: "contained",
    COLOR_PRIMARY: "primary",
  },
};

// constants/components/ProtocolModalConstants.ts
export const PROTOCOL_MODAL = {
  INITIAL_FORM_DATA: {
    DIR_ID: null,
    NUMBER_OF_UNITS: "",
    VERIFICATION_PLAN: "",
    ACCEPTANCE_CRITERIA: "",
  },

  MODES: {
    ADD: "add",
    EDIT: "edit",
  },

  REGEX: {
    NUMBER_OF_UNITS: /\D/g,
  },

  FIELD_NAMES: {
    DIR_ID: "dirId",
    NUMBER_OF_UNITS: "numberOfUnits",
    VERIFICATION_PLAN: "verificationPlan",
    ACCEPTANCE_CRITERIA: "acceptanceCriteria",
    DESIGN_INPUT_REQUIREMENT_ID: "design_input_requirement_id",
    DIR_NAME: "dir_name",
  },

  PAYLOAD_KEYS: {
    DIR_ID: "dir_id",
    UNITS_TO_BE_VERIFIED: "units_to_be_verified",
    ACCEPTANCE_CRITERIA: "acceptance_criteria",
    VERIFICATION_PLAN: "verification_plan",
  },

  ERROR_MESSAGES: {
    DIR_REQUIRED: "DIR is required",
    NUMBER_OF_UNITS_REQUIRED: "No. of Units to be Verified is required",
    ACCEPTANCE_CRITERIA_REQUIRED: "Acceptance Criteria is required",
    VERIFICATION_PLAN_REQUIRED: "Verification Plan is required",
    FAILED_TO_CREATE: "Failed to create verification plan",
    FAILED_TO_UPDATE: "Failed to update verification plan",
    LOADING_VERIFICATION_PLAN: "Loading verification plan...",
    FAILED_TO_LOAD_PREFIX: "Failed to load verification plan: ",
  },

  ERROR_KEYS: {
    GENERAL: "general",
  },

  DROPDOWN: {
    PLACEHOLDER: { DESIGN_INPUT_REQUIREMENT_ID: null, DIR_NAME: "Select DIR" },
  },

  UI: {
    TITLE_ADD: "Add Verification Plan",
    TITLE_EDIT: "Edit Verification Plan",
    ARIA_LABEL_CLOSE: "close",
    DIALOG_MAX_WIDTH: "md",
    DIALOG_FULL_WIDTH: true,
    COLOR_RED: "red",
  },

  INPUT_FIELDS: {
    DIR_LABEL: "DIR",
    NUMBER_OF_UNITS_LABEL: "No. of Units to be Verified",
    NUMBER_OF_UNITS_PLACEHOLDER: "Enter number of units",
    VERIFICATION_PLAN_LABEL: "Verification Plan",
    ACCEPTANCE_CRITERIA_LABEL: "Acceptance Criteria",
    TYPE_NUMBER: "number",
  },

  STYLES: {
    GRID_SPACING: 2,
    GRID_SIZE_MD_12: { md: 12 },
    MARGIN_TOP_10PX: "10px",
    MARGIN_TOP_40PX: "40px",
    JUSTIFY_CONTENT_FLEX_END: "flex-end",
  },

  BUTTONS: {
    CANCEL_LABEL: "Cancel",
    SAVE_LABEL: "Save",
    UPDATE_LABEL: "Update",
    VARIANT_OUTLINED: "outlined",
    VARIANT_CONTAINED: "contained",
    COLOR_PRIMARY: "primary",
  },

  DIR_LIST: {
    PROJECT_ID: 25,
    PAGE: 1,
    PAGE_SIZE: 10,
    INTEGER: /\D/g,
    TEN: 10,
  },
};


// constants/VerificationTableConstants.ts
export const DELETE = "delete";
export const S_NO = "S.No.";
export const S_NO_FIELD="sno";
export const DIR_NUMBER = "DIR";
export const DIR_CATEGORY= "DIR Category";
export const DIR_NO= "dir_id";
export const DIR= "dir";
export const CATEGORY= "dir_category";
export const UNITS= "dir_units"
export const VERIFICATION= "verification"
export const UNKNOWN_ERROR="Unknown error"
export const UNITS_TO_VERIFY = "No. of Units to be Verified";
export const INITIATE_VERIFICATION = "Initiate Verification";
export const ACTIONS = "Actions";
export const ACTIONS_FIELD= "actions"
export const STATUS_HEADER= "Status"
export const STATUS_FIELD= "status"
export const VERIFICATION_PLAN = "Verification Plan";
export const ADD_NEW = "Add New";
export const NA = "N/A";
export const INITIATE = "Initiate";
export const TABLE_HEADER = "table-header";
export const TABLE_CELL = "table-cell";
export const LOADING_MESSAGE = "Loading verification plans...";
export const ERROR_MESSAGE_PREFIX = "Error loading verification plans: ";
export const ERROR_TITLE = "Error";
export const DELETE_ERROR_MESSAGE = "Failed to delete verification plan";
export const SMALL = "small"
export const ADVISORY= "advisory"

// constants/serviceConstants/dnd/stageServiceConstants.ts
export const PROJECT_STAGES = {
  TITLE: "Project Stages",
  STAGE: {
    LABEL: "Stage",
    PLACEHOLDER: "Select a stage",
  },
  TYPE_OF_STAGE: {
    LABEL: "Type of Stage",
    VALUE: "Design",
  },
  NUMBER_OF_STAGES: {
    LABEL: "Number of Stages",
    PLACEHOLDER: "Enter number of stages",
  },
  BUTTONS: {
    CANCEL: "Cancel",
    SAVE: "Save",
  },
  VALIDATION: {
    STAGE_REQUIRED: "Stage is required",
    NUMBER_OF_STAGES_REQUIRED: "Number of stages is required",
  },
};


// constants/components/PrototypeFormConstants.ts
export const PROTOCOL_MODAL_FORM = {
  DIR_ID_VALUE: "",
  NUMBER_OF_UNITS_VALUE: "",
  VERIFICATION_PLAN_VALUE: "",
  ACCEPTANCE_CRITERIA_VALUE: "",
  ADD: "add",
  EDIT: "edit",
  SELECT_DIR: "Select DIR",
  DIR_LABEL: "DIR#*",
  NO_OF_UNITS_TO_BE_VERIFIED: "No. of Units to be Verified*",
  ENTER_NUMBER_OF_UNITS: "Enter number of units",
  VERIFICATION_PLAN_LABEL: "Verification Plan",
  ACCEPTANCE_CRITERIA_LABEL: "Acceptance Criteria",
  CANCEL: "Cancel",
  SAVE: "Save",
  UPDATE: "Update",
  MAX_WIDTH_MD: "md",
  CLOSE: "close",
  COLOR_RED: "red",
  MARGIN_TOP_10PX: "10px",
  MARGIN_TOP_40PX: "40px",
  DISPLAY_FLEX: "flex",
  JUSTIFY_CONTENT_FLEX_END: "flex-end",
  VARIANT_OUTLINED: "outlined",
  VARIANT_CONTAINED: "contained",
  COLOR_PRIMARY: "primary",
  VERIFICATION_PLAN_PLACEHOLDER: "Enter verification plan",
  ACCEPTANCE_CRITERIA_PLACEHOLDER: "Enter acceptance criteria",
  LOADING_VERIFICATION_PLAN: "Loading verification plan...",
  FAILED_TO_LOAD_VERIFICATION_PLAN: "Failed to load verification plan: ",
  FAILED_TO_CREATE_VERIFICATION_PLAN: "DIR already has a plan",
  FAILED_TO_UPDATE_VERIFICATION_PLAN: "DIR already has a plan",
  DIR_IS_REQUIRED: "DIR is required",
  NO_OF_UNITS_REQUIRED: "No. of Units to be Verified is required",
  NO_OF_UNITS_REQUIRED2: "Number of units must be a positive integer",
  VERIFICATION_PLAN_REQUIRED: "Verification Plan is required",
  ACCEPTANCE_CRITERIA_REQUIRED: "Acceptance Criteria is required",
  NUMBER: "number",
  DESIGN_INPUT_REQUIREMENT_ID: "design_input_requirement_id",
  DIR_NAME: "dir_name",
  UNITS_TO_BE_VERIFIED: "units_to_be_verified",
  DIR_ID: "dir_id",
  ACCEPTANCE_CRITERIA: "Acceptance Criteria*",
  VERIFICATION_PLAN: "Verification Plan*",
  ACCEPTANCE: "acceptance_criteria",
  VERIFICATION: "verification_plan",
  ADD_VERIFICATION_PLAN: "Add Verification Plan",
  EDIT_VERIFICATION_PLAN: "Edit Verification Plan",
  NO_OF_UNITS:"numberOfUnits"
};

// constants/components/PrototypeFormConstants.ts
// constants/components/PrototypeFormConstants.ts
export const PROTOTYPE_FORM_CONSTANTS = {
  YES: "yes",
  NO: "no",
  OWNER: "Owner",
  MEMBERS: "Members",
  QUALITY_OBJECTIVE: "Quality objective",
  PROTOTYPE: "Prototype",
  ACTIVE: "Active",
  INACTIVE: "Inactive",
  DESCRIPTION_REQUIRED: "Description is required",
  VERIFICATION_METHOD_REQUIRED: "Verification Method is required",
  REGULATORY_CHECK_REQUIRED: "Regulatory Check selection is required",
  ADVISORY_REQUIRED: "Advisory is required",
  SUCCESS: "success",
  FAILED_TO_UPDATE: "Failed to update prototype data",
  CUSTOM_ALERT: "customAlert",
  ERROR_TITLE: "Error",
  ERROR_TEXT: "Failed to update prototype data",
  ERROR_ICON: "error",
  UNKNOWN_ERROR: "Unknown error",
  DESCRIPTION_LABEL: "Description*",
  DESCRIPTION_FIELD: "description" as keyof FormState,
  OTHER_DETAILS_LABEL: "Other Details",
  OTHER_DETAILS_FIELD: "otherDetails" as keyof FormState,
  ADDITIONAL_REQUIREMENTS_LABEL: "Additional Design Quality Requirement",
  CONCLUSION_LABEL: "Conclusion",
  REMARKS_LABEL: "Remarks",
  REMARKS_FIELD: "remarks" as keyof FormState,
  CONCLUSION_FIELD: "conclusion" as keyof FormState,
  COMMENTS_FIELD: "comments" as keyof FormState,
  COMMENTS_LABEL: "Comments",
  COMMENTS_PLACEHOLDER: "Enter comments",
  ADDITIONAL_REQUIREMENTS_FIELD: "additionalRequirements" as keyof FormState,
  VERIFICATION_METHOD_LABEL: "Verification Method*",
  VERIFICATION_METHOD_FIELD: "verificationMethod" as keyof FormState,
  IS_REGULATORY_CHECK_LABEL: "Is Regulatory Check Applicable*",
  IS_REGULATORY_CHECK_FIELD: "isRegulatoryCheck" as keyof FormState,
  ADVISORY_LABEL: "Advisory*",
  ADVISORY_PLACEHOLDER: "Advisory",
  ADVISORY_FIELD: "advisory" as keyof FormState,
  ADD: "add",
  SAVE: "Save",
  CANCEL: "Cancel",
  NO_OF_STAGES: "numberOfStages" as keyof ProjectStagesFormData,
  NO_OF_UNITS: "numberOfUnits",
  MD: "md",
  EDIT: "edit",
  SELECT_VALID: "Please select a valid stage",
  FAILED_TO_CREATE: "Failed to create project stage",
  FAILED_TO_LOAD_STAGES: "Failed to load stages",
  STAGE: "stage" as keyof ProjectStagesFormData,
  VARIANT_CONTAINED: "contained",
  COLOR_PRIMARY: "primary",
  VARIANT_OUTLINED: "outlined",
  LOADING_STAGES: "Loading stages...",
  ERROR_LOADING_STAGES: "Error loading stages",
  MAX_WIDTH_MD: 'md',
  CLOSE: "close",
  MARGIN_TOP_10PX: "10px",
  MARGIN_TOP_20PX: "20px",
  DESIGN_STAGE: "design_stage" as keyof StageDropdownItem,
  MARGIN_TOP_40PX: "40px",
  DISPLAY_FLEX: "flex",
  JUSTIFY_CONTENT_FLEX_END: "flex-end",
  TYPE_OF_STAGE: "typeOfStage",
  PROJECT_ID: "project_id",
  STAGE_ITEM_ID: "stage_id" as keyof StageDropdownItem,
  STAGE_ID: "stage_id" as keyof CreateProjectStageData,
  STAGE_COUNT: "stage_count",
  NUMBER: "number",
  RED: "red",
  ERROR: "error",
};

export const ALERT_MODAL_FORM = {
  SUCCESS: 'success',
  FAILD: 'failed',
  CUSTOM_ALERT: 'customAlert',
  ACCESS_DENIED_TITLE: 'Access Denied',
  ACCESS_DENIED_ICON: 'error',
  ACCESS_DENIED_TEXT: 'Verification plan insert already exists',
} as const;

export const CUSTOM_ALERT='customAlert';
export const TEXT='DIR already has a plan';
export const TITLE='Error'
export const ICON='error';
export const ID="verification_plan_id"
export const FLEX = {
  HALF:0.5,
  ONE:1,
  QUARTER:0.75
};
export const HEIGHT=24
export const WIDTH=24
export const NUMBER=70

export const ID_NUMBER=10
export const MODE_ADD = "add";
export const MODE_EDIT = "edit";
export const ONE= NUMBERMAP.ONE

// Verification Plan Page Constants
export const VERIFICATION_PLAN_PAGE = {
  INVALID_PROJECT_STAGE_ORDER_ID: "Invalid project stage order ID",
  VERIFICATION_PLAN_TITLE: "Verification Plan",
  ADD_NEW_BUTTON: "+ Add New",
} as const;

export const FIELD_LABEL_MAP = {
  description: 'Description*'
} as const

export const FIELD_ORDER = Object.keys(FIELD_LABEL_MAP)

// Validation constants for ProtocolModal
export const PROTOCOL_FIELD_ORDER = [
  'design_input_requirement_id',
  'verification_plan',
  'acceptance_criteria'
] as const

export const PROTOCOL_FIELD_LABEL_MAP = {
  design_input_requirement_id: 'DIR#*',
  verification_plan: 'Verification Plan*',
  acceptance_criteria: 'Acceptance Criteria*'
} as const

// Units Verification Table Constants
export const UNITS_VERIFICATION = {
  LABEL: 'No. of Units to be Verified',
  PLACEHOLDER: 'Enter number of units',
  S_NO_HEADER: 'S.No.',
  BATCH_NO_HEADER: 'Sl. No/Batch No.',
  UNIT_NAME_HEADER: 'Unit / Batch Name',
  BATCH_NO_PLACEHOLDER: 'Enter Sl. No/Batch No.',
  UNIT_NAME_PLACEHOLDER: 'Enter Unit / Batch Name',
  ACTIONS_HEADER: 'Actions',
  DELETE_ARIA_LABEL: 'delete',
  S_NO_FIELD: 'sno',
  BATCH_NO_FIELD: 'batch_no',
  UNIT_NAME_FIELD: 'unit_name',
  ACTIONS_FIELD: 'actions',
} as const
