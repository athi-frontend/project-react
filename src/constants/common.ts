/**
    Classification : Confidential
**/
export const STATUS = {
  SUCCESS: 'success',
  FAILED: 'failed',
  DENIED: 'denied',
  DELETE: 'delete',
} as const

export const IGNOREPATHS = [
  '/dnd/project/list',
  '/dnd/project/create',
  '/dnd/project',
  '/project-details/list',
  '/project-details/create',
  '/regulation',
  '/risk-management',
  '/vendor-management',
  '/production/list'
]

export const PROJECT_DETAILS_ID_REGEX = /^\/project-details\/\d+$/
export const LAYOUTIGNOREPATHS = '/dnd/website-content'
export const LAYOUTIGNOREBROUCHER = '/dnd/brochure-content'
export const REGULATIONPATH  = '/regulation'

export const FINALFILEINITIALDATA = {
  documents_to_create: [],
  documents_to_delete: [],
  create_meta_data: {},
  update_meta_data: {},
  local_files_to_delete: [],
}

export const NUMBERMAP = {
  NEGATIVE_ONE : -1,
  QUARTER: 0.25,
  HALF:0.5,
  ZERO: 0,
  ONE: 1,
  THREE_QUARTER:0.75,
  ONE_QUARTER:1.25,
  ONE_HALF:1.5,
  TWO: 2,
  THREE: 3,
  FOUR: 4,
  FIVE: 5,
  SIX: 6,
  SEVEN: 7,
  EIGHT: 8,
  NINE: 9,
  TEN: 10,
  ELEVEN: 11,
  TWELVE: 12,
  THIRTEEN: 13,
  FOURTEEN: 14,
  FIFTEEN: 15,
  SIXTEEN: 16,
  SEVENTEEN: 17,
  EIGHTEEN: 18,
  NINETEEN: 19,
  TWENTY: 20,
  TWENTYONE: 21,
  TWENTYTWO: 22,
  TWENTYFOUR:24,
  TWENTYFIVE:25,
  TWENTYSIX:26,
  TWENTYSEVEN:27,
  THIRTYTWO:32,
  FORTY: 40,
  FORTYSIX: 46,
  FIFTY:50,
  SEVENTY: 70,
  HUNDRED: 100,
  ONEHUNDREDTEN: 110,
  ONETWENTY: 120,
  ONEEIGHTY: 180,
  TWOHUNDRED:200,
  TWOFOURTY:240,
  TWOFIFTY: 250,
  TWOFIFTYFIVE: 255,
  THREEHUNDRED: 300,
  FOURHUNDRED: 400,
  UNAUTHORIZED_401:401,
  TOKENREVOKE_403:403,
  THOUSAND: 1000,
  ONEFIFTYFIVE: 155,
  FIVEHUNDRED:500,
  SIXHUNDRED:600,
  FIVENINTY: 590,
  SIXFOURTYONE: 641,
  ONEFIFTY:150,
  SIXHUNDREDSEVENTYTWO: 672,
  ONETHOUSANDNINEHUNDRED: 1900,
  TWOTHOUSAND:2000,
  TWOTHOUSANDONEHUNDRED: 2100,
  THREETHOUSAND: 3000,
  THREETHOUSANDFIVEHUNDRED: 3500,
  THIRTYONE: 31,
  THIRTYSIX: 36,
}

export const DEFAULT_DATEZONE = {
  format:'dd-MM-yyyy',
  zone:'IST',
}

export const SESSION_EXPIRED_MESSAGE = "auth_user_user-access_access-token-expired"
export const DEFAULT_PROFILE_URL ='/images/usericon.jpg'
export const UNKNOWN_ERROR_MESSAGE = 'Unknown error'
export const NO_RECORDS_FOUND = 'No Records Found...'
export const CALENDAR_ICON_COLOR = '#652D90'
export const FETCH_ERROR_PREFIX = 'Error loading specifications: '
export const SAVE_ERROR_PREFIX = 'Save failed: '
export const BASE_ORGANIZATION_API = 'api/v1/organization'
export const BASE_HR_API = 'api/v1/hrcs'
export const API_URLS = {
  ROLES: `${BASE_ORGANIZATION_API}/roles/all?status=1`,
  USERS: `${BASE_ORGANIZATION_API}/users/all?status=1`,
  OPERATORS: `${BASE_ORGANIZATION_API}/operator/all`,
  FILE_DOWNLOAD: 'api/v1/dms/assets/download',
  RECORD_DOWNLOAD: 'api/v1/dms/records/download',
  GET_SESSION_TOKEN: 'api/v1/auth/refresh-token',
  GET_PROJECT_STAGE_DROPDOWN: '/api/v1/dnd/stage/all?status=1',
  GET_EMPLOYEE_LIST_DROPDOWN: '/api/v1/hrcs/employee/all?status=1',
   CATEGORY :'api/v1/dms/assets/category',
  SUBMIT_PROJECT_STAGE: '/api/v1/dnd/project-stage/',
  ACTIONS: {
    SUBMIT_FOR_REVIEW: 'api/v1/dnd/workflow-actions',
  },
  HR_ACTIONS: {
    WORKFLOW_ACTION: 'api/v1/hrcs/workflow-action'
  },
  RISK_MANAGEMENT_ACTIONS: {
    WORKFLOW_ACTION: 'api/v1/risk/workflow-action'
  },
  USER_ACCESS: 'api/v1/auth/user-access',
  USER_ACCESS_FOR_MENU: (menuId: number) => `api/v1/auth/user-access?menu_id=${menuId}`,
  WORKFLOW_ACTION: 'api/v1/organization/workflow-action',
  REVIEWERS_ALL: (department_id: number) =>
    `api/v1/organization/users/all?department_id=${department_id}&status=${NUMBERMAP.ONE}`,
  GET_TENANT: 'api/v1/organization/tenant',
  EMPLOYMENT_TYPE_ALL: `${BASE_HR_API}/type-of-employment/all`,
  GET_GENDERS: `${BASE_ORGANIZATION_API}/gender/all`,
  GET_USER_PROFILES: 'api/v1/risk/user-profiles/all',
  ORGANIZATION_STATUS_ALL: `${BASE_ORGANIZATION_API}/status/all`,
}

export const DEFAULT_ORGANIZATION_ID = 1
export const DEFAULT_TENANT_ID = 1
export const CATEGORY_ID = 1

export const KEY_VALUE = 'dnd'
export const KEY = 'project'
export const CATEGORY_KEY = 'categorylist'
export const PROJECT_STAGE_KEY = 'projectStage'
export const OPERATOR_QUERY_KEY = 'operator'
// Organization level query keys
export const GETGENDERS = 'getGenders'
export const GETUSERPROFILES = 'getUserProfiles'
export const ORGANIZATION_STATUS_KEY = 'organizationStatus'
export const USER_ACCESS_KEY = 'user-access'
export const PROCESS_CHECKLIST_GROUP_KEY = 'processChecklistGroup'
export const PROCESS_CHECKLIST_KEY = 'processChecklist'

export const FILE_SIZE_LIMITS = {
  MAX_SIZE: 10 * 1024 * 1024,
  ERROR_MESSAGE: 'File size should be less than 10 MB',
} as const

export const BUTTON_LABEL = {
  SAVE: 'Save',
  CANCEL: 'Cancel',
  NEXT: 'Next',
  BACK: 'Back',
  REJECT: 'Reject',
  APPROVE: 'Approve',
  SUBMIT_FOR_REVIEW: 'Submit For Review',
  INITIATE: 'Initiate Design Feasibility Study',
  SUBMIT_FOR_APPROVAL: 'Submit for Approval',
  CEO_DECISION: 'CEO Decision',
  INITIATE_DESIGN_INPUT_GATHERING: 'Initiate Design Input Gathering',
}

export const PERMISSION_ACTIONS = {
  VIEW: 'view',
} as const

export const WORKFLOW_ACTIONS = {
  SAVE: 'Save',
  CANCEL: 'Cancel',
  REJECT: 'Reject',
  APPROVE: 'Approve',
  SUBMIT_FOR_REVIEW: 'Submit For Review',
  INITIATE: 'Initiate Design Feasibility Study',
  SUBMIT_FOR_APPROVAL: 'Submit for Approval',
  CEO_DECISION: 'CEO Decision',
  INITIATE_DESIGN_INPUT_GATHERING: 'Initiate Design Input Gathering',
}

export const BUTTON_ORDER = [
  BUTTON_LABEL.BACK,
  BUTTON_LABEL.SUBMIT_FOR_REVIEW,
  BUTTON_LABEL.SUBMIT_FOR_APPROVAL,
  BUTTON_LABEL.INITIATE_DESIGN_INPUT_GATHERING,
  BUTTON_LABEL.APPROVE,
  BUTTON_LABEL.CEO_DECISION,
  BUTTON_LABEL.REJECT,
  BUTTON_LABEL.CANCEL,
  BUTTON_LABEL.SAVE
]

export const getButtonConfig = ({
  handleSubmitForReview,
  handleApprove,
  handleReject,
  handleCancel,
  handleSave,
  handleInitiate,
  handleSubmitApproval,
  handleCEODecision,
  handleDIG,
  isDisabled,
}: {
  handleSubmitForReview?: () => void
  handleApprove?: () => void
  handleReject?: () => void
  handleCancel?: () => void
  handleSave?: () => void
  handleInitiate?: () => void
  handleDIG?: () => void
  handleSubmitApproval?: () => void
  handleCEODecision?: () => void
  isDisabled?: boolean
}) => {
 return {
    [BUTTON_LABEL.SAVE]: handleSave,
    [BUTTON_LABEL.CANCEL]: handleCancel,
    [BUTTON_LABEL.SUBMIT_FOR_REVIEW]: handleSubmitForReview,
    [BUTTON_LABEL.REJECT]: handleReject,
    [BUTTON_LABEL.SUBMIT_FOR_APPROVAL]: handleSubmitApproval,
    [BUTTON_LABEL.APPROVE]: handleApprove,
    [BUTTON_LABEL.INITIATE]: handleInitiate,
    [BUTTON_LABEL.CEO_DECISION]: handleCEODecision,
    [BUTTON_LABEL.INITIATE_DESIGN_INPUT_GATHERING]: handleDIG,
  }
}

export const GLOBAL_STYLES = {
  NONE: 'none',
  AUTO: 'auto',
}

export const REVIEWER_FORM = {
  REVIEW_LABEL: 'Reviewer*',
  REVIEW_ID: 'id',
  REVIEW_VALUE: 'full_name',
  REVIEW_PLACEHOLDER: 'Select Reviewer',
  COMMENT_HISTORY: 'Comments History',
  COMMENTS: 'Comments',
  COMMENTS_REQUIRED: 'Comments*',
  COMMENT_HISTORY_PLACEHOLDER: 'Comment History',
  COMMENTS_PLACEHOLDER: 'Enter Comments',
  SUBMIT_BUTTON: 'Submit',
  REVIEWER_REQUIRED: 'Please select a reviewer',
  NO_COMMENTS: 'No Comments Provided',
  COMMENT_REQUIRED_FOR_REJECTION: 'Comments is required for rejection',
}
export const CONTENT_MODE = {
  CENTER: 'center',
  BLOB: 'blob',
  TEXT: 'text',
} as const

export const radioOptions = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
]


export const radioOptionsPASSFAIL = [
  { value: 'yes', label: 'Pass' },
  { value: 'no', label: 'Fail' },
]

// Error handling constants for apiClient
export const API_CLIENT_ERROR = {
  UNHANDLED_ERROR_TITLE: 'Unhandled Error',
  UNHANDLED_ERROR_MESSAGE: 'An unexpected error has occurred. Please try again or contact support if the problem persists.',
  VISIT_HOME_BUTTON: 'Visit Home Page',
  ICON: 'error',
  CUSTOM_ALERT: 'customAlert',
  SESSION_EXPIRED: 'Session expired. No further requests allowed.',
  SESSION_TIMEOUT_TITLE: 'Session Expired',
  SESSION_TIMEOUT_MESSAGE: 'Your session has expired. Please log in again to continue.',
  SESSION_TIMEOUT_BUTTON: 'OK',
};

export const HOME_URL = '/';
export const FILE_UPLOAD_SUB_HEADER = 'Upload'
export const ADD_NEW = 'Add New'

export const SPECIAL_SECTION = 'create';
export const HR_SECTION_REGEX = /^\/hr\/([^/]+)\/([^/]+)(\/.*)?$/;
export const VALID_SECTION_PATTERN = /^\d+$/;
export const TRAILING_SLASHES_REGEX = /\/{1,100}$/u;


export const HTTP_STATUS = {OK: 200};
export const ARRAY_INDEX = {FIRST: 0};

export const DATE_FORMATS ={
  DD_MM_YYYY: 'DD-MM-YYYY'
} as const


export const CURRENT_COLOR= 'currentColor'
export const LOGIN_URL = '/login';
export const MULTISELECT_LABELS = {
  SELECT_ALL: 'Select All',
  SELECT_ALL_ID: '__all__',
}
export const STATUS_VALUE = {
  'Active': NUMBERMAP.ONE,
  'Inactive': NUMBERMAP.ZERO,
}

// Modal constants
export const MODAL_CONSTANTS = {
  SELECTED_LIST_MODAL_TITLE: 'selected-list-modal-title',
  SELECTED_LIST_MODAL_DESCRIPTION: 'selected-list-modal-description',
  OUTLINED_VARIANT: 'outlined',
} as const

export const POSITIVE_INTEGER_REGEX = /^([1-9]\d*)$/
export const BUTTONSTYLE = { padding: '40px' }

export const FIELD_LENGTH = {
  MAX_DESCRIPTION_LENGTH: 3500,
}

export const DRAFT = 'draft' 

export const unHandledErrorMessage = ["Access Token Has Been Revoked"]

