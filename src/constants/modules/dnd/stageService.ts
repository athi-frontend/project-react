import { NUMBERMAP } from '@/constants/common'

export const PROJECT_STAGES_TABLE_COLUMNS = {
  SERIAL_NO: 'project_stage_order_id',
  STAGE_ORDER: 'stage_order',
  STAGE_ID: 'project_stage_id',
  STAGE_NAME: 'stage',
  TYPE_OF_STAGE: 'type_of_stage',
  STATUS_OF_STAGE: 'status',
  ACTION: 'action',
}

export const TABLE_HEADERS = {
  SERIAL_NO: 'S.No.',
  STAGE_ID: 'Stage #',
  STAGE_NAME: 'Stage Name',
  TYPE_OF_STAGE: 'Type of Stage',
  STATUS_OF_STAGE: 'Status of Stage',
  ACTION: 'Action',
}

export const BUTTON_LABELS = {
  ADD_NEW_STAGE: 'Add New',
}

export const LABELS = {
  PROJECT_STAGES: 'Project Stages',
}

export const ALERT_MESSAGES = {
  DELETE: {
    title: 'Are you sure?',
    text: 'You will not be able to recover this stage!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'No, keep it',
  },
  DENIED: {
    title: 'Cancelled',
    text: 'Your stage is safe :)',
    icon: 'error',
  },
}

export const STAGE_ROUTES = {
  STAGE_LIST: '/project-stages',
  STAGE_DETAIL: '/dnd/project-stages',
  STAGE_CREATE: '/project-stages/create',
  STAGE_EDIT: '/project-stages/edit',
}

export const stageId = 'id'

export const PROJECT_STAGES = {
  TITLE: 'Project Stages',
  STAGE: {
    LABEL: 'Stage*',
    PLACEHOLDER: 'Stages',
  },
  STAGE_NAME: {
    LABEL: 'Stage Name*',
    PLACEHOLDER: 'Enter Stage Name',
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
  ACTIVITY: {
    LABEL: 'Activity*',
    VALUE: 'Enter Activity',
  },
}

export const STAGE_OPTIONS = [
  { key: 'stage1', value: 'Stage 1' },
  { key: 'stage2', value: 'Stage 2' },
  { key: 'stage3', value: 'Stage 3' },
]

export const DIR_OPTIONS = [
  { id: 'dir1', label: 'DIR 1' },
  { id: 'dir2', label: 'DIR 2' },
  { id: 'dir3', label: 'DIR 3' },
  { id: 'dir4', label: 'DIR 4' },
]

export const PROJECT_STAGES_SERVICE = {
  ENDPOINTS: {
    GET_PROJECT_STAGES: (projectId: number) =>
      `/api/v1/dnd/project-stage/${projectId}?page_size=${NUMBERMAP.THOUSAND}&page=${NUMBERMAP.ONE}`,
    GET_STAGES_DROPDOWN: `/api/v1/dnd/stage/all?status=${NUMBERMAP.ONE}`,
    CREATE_PROJECT_STAGE: '/api/v1/dnd/project-stage/',
    DELETE_PROJECT_STAGE: (stageId: number) =>
      `/api/v1/dnd/project-stage/${stageId}`,
    GET_PROTOTYPE_DATA: (projectStageOrderId: number) =>
      `/api/v1/dnd/execution-stage/${projectStageOrderId}`,
    UPDATE_PROTOTYPE_DATA: (projectStageOrderId: number) =>
      `/api/v1/dnd/project-stage/${projectStageOrderId}`,
    GET_DIR_LIST: (projectId: number, projectStageOrderId: number) =>
      `/api/v1/dnd/dir/all?project_id=${projectId}&project_stage_order_id=${projectStageOrderId}`,
    CREATE_VERIFICATION_PLAN: '/api/v1/dnd/verification-plan/',
    GET_VERIFICATION_PLANS: (projectStageOrderId: number) =>
      `/api/v1/dnd/verification-plan/all/${projectStageOrderId}`,
    DELETE_VERIFICATION_PLAN: (verificationPlanId: number) =>
      `/api/v1/dnd/verification-plan/${verificationPlanId}`,
    GET_VERIFICATION_PLAN_BY_ID: (
      projectStageOrderId: number,
      verificationPlanId: number
    ) => `/api/v1/dnd/verification-plan/${verificationPlanId}?project_stage_order_id=${projectStageOrderId}`,
    UPDATE_VERIFICATION_PLAN:() =>
      `/api/v1/dnd/verification-plan/`,
    GET_PROJECT_STAGE_BY_ID: (stageId: number) =>
      `api/v1/dnd/project-stage/project-stage-order/${stageId}`,
  },

  ERRORS: {
    FAILED_TO_FETCH_PROJECT_STAGES: 'Failed to fetch project stages',
    FAILED_TO_FETCH_STAGES_DROPDOWN: 'Failed to fetch stages dropdown',
    FAILED_TO_CREATE_PROJECT_STAGE: 'Failed to create project stage',
    FAILED_TO_FETCH_PROTOTYPE_DATA: 'Failed to fetch prototype data',
    FAILED_TO_UPDATE_PROTOTYPE_DATA: 'Failed to update prototype data',
    FAILED_TO_FETCH_DIR_LIST: 'Failed to fetch DIR list',
    FAILED_TO_CREATE_VERIFICATION_PLAN: 'Failed to create verification plan',
    FAILED_TO_FETCH_VERIFICATION_PLANS: 'Failed to fetch verification plans',
    FAILED_TO_DELETE_VERIFICATION_PLAN: 'Failed to delete verification plan',
    FAILED_TO_FETCH_VERIFICATION_PLAN_BY_ID:
      'Failed to fetch verification plan by ID',
    FAILED_TO_UPDATE_VERIFICATION_PLAN: 'Failed to update verification plan',
  },
}

export const PROJECT_STAGES_QUERIES = {
  QUERY_KEYS: {
    PROJECT_STAGES: (projectId: number) => ['projectStages', projectId],
    STAGES_DROPDOWN: ['stagesDropdown'],
    PROTOTYPE_DATA: (projectStageOrderId: number) => [
      'prototypeData',
      projectStageOrderId,
    ],
    DIR_LIST: (projectId: number, page: number, pageSize: number) => [
      'dirList',
      projectId,
      page,
      pageSize,
    ],
    VERIFICATION_PLANS: (projectStageOrderId: number) => [
      'verificationPlans',
      projectStageOrderId,
    ],
    VERIFICATION_PLAN_BY_ID: (
      projectStageOrderId: number,
      verificationPlanId: number | null
    ) => ['verificationPlan', projectStageOrderId, verificationPlanId],
  },

  INVALIDATION_KEYS: {
    PROJECT_STAGES: ['projectStages'],
    PROTOTYPE_DATA: (projectStageOrderId: number) => [
      'prototypeData',
      projectStageOrderId,
    ],
    VERIFICATION_PLANS: ['verificationPlans'],
  },

  CANNOT_BE_NULL: 'verificationPlanId cannot be null',
}

export const VERIFICATION_PLAN = 'Verification Plan ID is required'

export const PROJECT_STAGES_MODAL_TEXT = {
  INPUT: {
    STAGE: 'Stage',
    CUSTOM_STAGE_NAME: 'Enter custom stage name',
    ACTIVITY: 'Activity*',
    ENTER_ACTIVITY: 'Enter activity',
    NUMBER_OF_STAGES: {
      LABEL: 'Number of Stages',
      PLACEHOLDER: 'Enter number of stages',
    },
  },
  PLACEHOLDERS: {
    STAGE: 'Select a stage',
    LOADING: 'Loading stages...',
    ERROR: 'Failed to load stages',
  },
  LABELS: {
    TYPE_OF_STAGE: 'Type of Stage',
    ACTIVITIES: 'Activities',
    STAGE: 'Stage',
    ACTIVITY: 'Activity',
  },
  BUTTONS: {
    CANCEL: 'Cancel',
    SAVE: 'Save',
    ADD_ACTIVITY: 'Add Activity',
  },
  ERRORS: {
    REQUIRED_STAGE: 'Stage is required',
    REQUIRED_CUSTOM_NAME: "Stage Name is required when 'Other' is selected",
    DUPLICATE_STAGE:
      'Stage name already exists. Please choose a different name.',
    REQUIRED_NUMBER: 'Number of stages is required',
    REQUIRED_ACTIVITY: 'Activity is required',
  },
  TITLE: 'Add Project Stage',
  ALERT: {
    DELETE: 'Are you sure you want to delete this activity?',
    SUCCESS: 'Successfully saved',
    FAILED: 'Something went wrong',
  },
  OTHER_OPTION: 'Other',
}

export const BUILD_STAGE = 'Build Stage';
export const STAGE_NAME_KEY = 'stageName';
export const STAGE_FIELD_KEY = 'stage';
export const ACTIVITY_FIELD_KEY = 'activity';

export const ACTION_COLUMN_HEADER = 'Action';