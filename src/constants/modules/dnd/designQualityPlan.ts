/**
    Classification : Confidential
**/
export const DQP_TABLE_COLUMNS = {
  STAGE_ID: 'stage_order_id',
  QUALITY_OBJECTIVE: 'quality_objective',
  ITEM_FOR_TEST: 'item_type',
  PARAMETERS: 'parameters_for_inspection',
  TEST_METHODS: 'test_method_acceptance_criteria',
  STATUS: 'status',
  ACTION: 'action',
  ACTIVE_STATUS: 'Approved',
  INACTIVE_STATUS: 'Rejected',
  PENDING_STATUS: 'Draft',
  COMPLETED_STATUS: 'Submitted',
} as const

export const TABLE_HEADERS = {
  STAGE_ID: 'Stages',
  QUALITY_OBJECTIVE: 'Quality Objective',
  ITEM_FOR_TEST: 'Item for Test',
  PARAMETERS: 'Parameters for Inspection',
  TEST_METHODS: 'Test Methods & Acceptance Criteria',
  STATUS: 'Status',
  ACTION: 'Actions',
} as const

export const BUTTON_LABELS = {
  ADD_STAGES: 'Add Stages',
} as const

export const STATUS_LABELS = {
  ACTIVE: 'Approved',
  INACTIVE: 'Rejected',
  PENDING: 'Draft',
  COMPLETED: 'Submitted',
  NULL: '-',
} as const

export const LABELS = {
  DESIGN_QUALITY_PLAN: 'Design Quality Plan',
} as const

export const FIELD_NAMES = {
  QUALITY_OBJECTIVE: 'quality_objective',
  ITEM_FOR_TEST: 'itemForTest',
  PARAMETERS_FOR_INSPECTION: 'parametersForInspection',
  TEST_METHODS_AND_CRITERIA: 'testMethodsAndCriteria',
} as const

// Field label map for validation focus
export const FIELD_LABEL_MAP = {
  quality_objective: 'Quality Objective*',
  parametersForInspection: 'Parameters for Inspection*',
  testMethodsAndCriteria: 'Test Methods and Acceptance Criteria*',
} as const

export const FIELD_ORDER = Object.keys(FIELD_LABEL_MAP)

// Field IDs for validation focus
export const FIELD_IDS = {
  QUALITY_OBJECTIVE: 'Quality Objective*',
  PARAMETERS_FOR_INSPECTION: 'Parameters for Inspection*',
  TEST_METHODS_AND_CRITERIA: 'Test Methods and Acceptance Criteria*',
} as const

export const DESIGN_QUALITY_PLAN = {
  TITLE: 'Design Quality Plan',
  STAGE: {
    LABEL: 'Stage',
    VALUE: 'Stage',
  },
  QUALITY_OBJECTIVE: {
    LABEL: 'Quality Objective*',
    PLACEHOLDER: 'Input Text',
  },
  ITEM_FOR_TEST: {
    LABEL: 'Item for Test*',
    PLACEHOLDER: 'Item for Test',
  },
  PARAMETERS_FOR_INSPECTION: {
    LABEL: 'Parameters for Inspection*',
    PLACEHOLDER: 'Parameters for Inspection',
  },
  TEST_METHODS: {
    LABEL: 'Test Methods and Acceptance Criteria *',
    PLACEHOLDER: 'Input Text',
  },
  BUTTONS: {
    CANCEL: 'Cancel',
    SAVE: 'Save',
  },
  VALIDATION: {
    QUALITY_OBJECTIVE_REQUIRED: 'Quality Objective is required',
    ITEM_FOR_TEST_REQUIRED: 'Item for Test is required',
    PARAMETERS_REQUIRED: 'Parameters for Inspection is required',
    TEST_METHODS_REQUIRED: 'Test Methods and Acceptance Criteria is required',
    FETCH_BY_ID: 'Design Quality Plan not found',
  },
  DESIGN_QUALITY_PLAN_API_ENDPOINTS: {
    GET_DESIGN_QUALITY_PLAN: (projectId: number) =>
      `api/v1/dnd/design-quality-plan/project/${projectId}/all`,
    UPSERT_DESIGN_QUALITY_PLAN: (projectId: number) =>
      `api/v1/dnd/design-quality-plan/project/${projectId}/`,
    GET_DESIGN_STAGE_ITEMS: 'api/v1/dnd/design-stage-item/all?status=1',
    GET_SPECIFICATION_APPLICABILITY: (projectId: number) =>
      `api/v1/dnd/specification-applicability/all?project_id=${projectId}&status=1`,
    GET_DESIGN_QUALITY_PLAN_BY_ID: (projectId: number, stageOrderId: number) =>
  `api/v1/dnd/design-quality-plan/project/${projectId}/all?build_stage_order_id=${stageOrderId}`,
  },
  DESIGN_QUALITY_PLAN_API_KEYS: {
    FETCH_DESIGN_QUALITY_PLAN_KEY: 'fetchDesignQuality',
    UPSERT_DESIGN_QUALITY_PLAN_KEY: 'upsertDesignQuality',
    FETCH_DESIGN_STAGE_ITEMS_KEY: 'fetchDesignStageItems',
    FETCH_SPECIFICATION_APPLICABILITY_KEY: 'fetchSpecificationApplicability',
    FETCH_DESIGN_QUALITY_PLAN_BY_ID_KEY: 'fetchDesignQuality',
    UPSERT_DESIGN_QUALITY_PLAN: 'designQualityPlan',
    PROJECT_DESIGN_QUALITY_PLAN: 'projectDesignQualityPlan',
  },
  FIELD_KEYS: {
    ITEM_KEY_FIELD: 'stage_item_id',
    ITEM_VALUE_FIELD: 'item_type',
    PARAMETER_KEY_FIELD: 'specification_applicability_id',
    PARAMETER_VALUE_FIELD: 'specification_type',
  },
  COLORS: {
    PENDING: '',
    COMPLETED: '',
    NULL: '',
  },
  BUTTON_ATTRIBUTES: {
    LABEL: 'edit',
    ICON_COLOR: 'primary',
    EDIT_COLOR: 'currentColor',
  }, 
  MAX_WIDTH: 'md',
  MODAL_CLOSE: 'modal-close',
  NUMBER: 'number',
  SUCCESS: 'success',
  ERROR: 'error',
  TOP: 'top',
} as const
