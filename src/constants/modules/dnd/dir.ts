/**
    Classification : Confidential
**/
export const FORM_TITLES = {
  MAIN_TITLE: 'DIR Information',
}

export const FIELD_LABELS = {
  DIR_NAME: 'Name of DIR',
  DIR_CATEGORY: 'DIR Category',
  STAGE: 'Stage',
  OWNER: 'Owner',
  SOFTWARE_UNIT: 'Software Unit',
  MODULE_SUBMODULE: 'Module/Submodule',
  HARDWARE_SOFTWARE_OTHER: 'Hardware/Software/Other*',
  REFERENCE_TO_EXISTING_DIR: 'Reference to Existing DIR*',
  DIR_NUMBER: 'DIR #',
  ALLOCATE_EXECUTION_STAGE: 'Allocate Execution Stage*',
  ALLOCATE_VERIFICATION_STAGE: 'Allocate Verification Stage*',
  REASON_FOR_CREATING: 'Reason for Creating this DIR*',
  DIR_SPECIFICATION: 'DIR Specification',
  VERIFICATION_METHOD: 'Verification Method*',
  VERIFICATION_PLAN: 'Verification Plan',
  COMMENTS: 'Comments',
  CONFLICT_WITH_OTHER: 'Does any DIR conflict with any other DIR',
  UNAMBIGUOUS: 'Are all the DIRs unambiguous*',
  CONFLICT_REMARKS: 'Remarks',
  VERIFIABLE: 'Can each of the DIR be verified and validated*',
  VERIFIABLE_REMARKS: 'Remarks',
  RETESTED: 'Should any DIR be retested*',
  COMPLETED: 'All the DIRs are gathered, identified and complete*',
  COMPLETE_REMARKS: 'Remarks',
}

export const PLACEHOLDERS = {
  DIR_NUMBER: 'DIR',
  ALLOCATE_EXECUTION_STAGE: 'Allocate Execution Stage',
  ALLOCATE_VERIFICATION_STAGE: 'Allocate Verification Stage',
  REASON_FOR_CREATING: 'Enter Reason for Creating this DIR', 
  VERIFICATION_METHOD: 'Enter Verification Method',
  VERIFICATION_PLAN: 'Enter Verification Plan',
  COMMENTS: 'Enter Comments',
  REMARKS: 'Enter Remarks',
  SELECT_DIR: 'Select DIR',
}

export const BUTTON_LABELS = {
  SUBMIT_FOR_REVIEW: 'Submit for Review',
  SUBMIT_FOR_APPROVAL: 'Submit for Approval',
  APPROVE: 'Approve',
  REDO: 'Redo',
  CANCEL: 'Cancel',
  SAVE: 'Save',
}

export const RADIO_OPTIONS = {
  HARDWARE: 'Hardware',
  SOFTWARE: 'Software',
  OTHER: 'Other',
  YES: 'Yes',
  NO: 'No',
}

export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
}
export const API_ENDPOINTS = {
  FETCH_DIR_BY_ID: 'api/v1/dnd/dir/',
  FETCH_EXECUTION_STAGES: 'api/v1/dnd/project-stage/execution-stage/all',
  FETCH_DIR_LIST: 'api/v1/dnd/dir/all',
  SAVE_DIR: 'api/v1/dnd/dir/',
  FUNCTIONAL_BLOCK: 'api/v1/dnd/functional-block-type/all?status=1',
}
export const QUERY_KEYS = {
  DIR: 'dir',
  DIR_LIST: 'dirList',
  DIRS: 'dirs',
  EXECUTION_STAGES: 'executionStages',
  FUNCTIONAL_BLOCK_TYPES: 'functionalBlockTypes',
  EXECUTION_STAGE_MAPPER: 'executionStageMapper',
};

export const ROUTES = {
  DIR_INFO: '/dnd/dir/info',
  DIR: (project_id: number) => `/dnd/dir/${project_id}`
}

export const PAGE_TITLES = {
  DIR: 'DIR',
};

export const TABLE_FIELDS = {
  ACTIONS: 'actions',
  STATUS: 'status',
};

export const TABLE_HEADERS = {
  ACTIONS: 'Actions',
};

export const STATUS_LABELS = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
};

export const TABLE_CONFIG = {
  CHECKBOX: false,
};

export const POPUP_FIELD_LABEL_MAP = {
  isUnambiguous: "are_all_the_dirs_unambiguous*",
  isverified: "can_each_of_the_dir_be_verified_and_validated*",
  isRetested: "should_any_dir_be_retested*",
  isCompleted: "all_the_dirs_are_gathered,_identified_and_complete*",
} as const

export const POPUP_FIELD_ORDER = Object.keys(POPUP_FIELD_LABEL_MAP)

export const DIR_INFO = {
  VALIDATION: {
    UNAMBIGUOUS: 'Please select an option for DIRs unambiguous',
    VERIFIED: 'Please select an option for DIR be verified and validated',
    RETESTED: 'Please select an option for DIR be tested',
    COMPLETED: 'Please select an option for DIRs are gathered, identified and complete',
    DIR_CONFLICT: "Please select at least one DIR Conflict"
  },
  VALIDATION_MESSAGES: {
      FUNCTIONAL_BLOCK_TYPE: 'Please select a functional block type.',
      REFERENCE_DIR: 'Please select an option for Reference to existing DIR.',
      EXECUTION_STAGE: 'Please select at least one execution stage.',
      VERIFICATION_STAGE: 'Please select at least one verification stage.',
      REASON_FOR_CREATING: 'Please provide a reason for creating this DIR.',
      VERIFICATION_METHOD: 'Please provide a verification method.',
  },
  FIELD_ORDER: [
    'hardwareSoftwareOther',
    'reasonForCreating',
    'allocateExecutionStage',
    'verificationMethod',
    'referenceToExistingDir',
  ],
  FIELD_LABEL_MAP: {
    hardwareSoftwareOther: 'Hardware/Software/Other*',
    reasonForCreating: 'Reason for Creating this DIR*',
    allocateExecutionStage: 'Allocate Execution Stage*',
    verificationMethod: 'Verification Method*',
    referenceToExistingDir: 'Reference to Existing DIR*',
  } as const,
  EXECUTION_STAGE: {
    idField: 'execution_stage_id',
    valueField: 'display_value',
  },
  DIR: {
    keyField: 'design_input_requirement_id',
    valueField: 'dir_id',
    IdField: 'design_input_requirement_id',
    DIRID: 'id',
    DIRVALUE: 'value',

  },
 FORM_FIELDS: {
  HARDWARE_SOFTWARE_OTHER: 'hardwareSoftwareOther',
  REASON_FOR_CREATING: 'reasonForCreating',
  EXISTING_DIR: 'referenceToExistingDir',
  DIR_NUMBER: 'dirNumber',
  VERIFICATION_METHOD: 'verificationMethod',
  VERIFCATION_STAGE: 'allocateVerificationStage',
  EXECUTION_STAGE: 'allocateExecutionStage',
  COMMENTS: 'comments',
  CONFLICT_DIR: 'dirConfict',
  UNAMBIGUOUS: 'isUnambiguous',
  CONFLICT_REMARKS: 'conflictRemarks',
  VERIFIED: 'isverified',
  VERIFIABLE_REMARKS: 'verifiableRemarks',
  RETESTED: 'isRetested',
  COMPLETED: 'isCompleted',
  COMPLETE_REMARKS: 'completeRemarks',
},
ACTION_ALERT_TYPES: {
  SUCCESS: 'success',
  FAILED: 'failed',
} as const,
STATUS: {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
},
}
