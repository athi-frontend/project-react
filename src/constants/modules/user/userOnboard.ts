import { NUMBERMAP, API_URLS } from '@/constants/common'
import { DEFAULT_FORM_DATA } from '@/lib/modules/user/userOnboard'

export const CONTACT_NUMBER_FIELD = 'contactNumber'
export const EMAIL_ID_FIELD = 'emailId'
export const ROLE_FIELD = 'role'
export const ONBOARDED_USER_ROUTE = '/user/list'
export const InputTypes = {
  EMAIL: 'email',
}

export const BUTTONLABELS = {
  CANCEL: 'Cancel',
  SAVE: 'Save',
  UPDATE: 'Update',
  CREATE_PROJECT: 'Create Project',
}

export const FORMLABELS = {
  EMPLOYEE_NO: 'Employee No.*',
  FIRST_NAME: 'First Name*',
  LAST_NAME: 'Last Name*',
  NICK_NAME: 'Nick Name*',
  EMAIL_ID: 'Email ID*',
  CONTACT_NUMBER: 'Contact Number*',
  DEPARTMENT: 'Department',
  EMPLOYEE_ROLE: 'Employement Role',
  RESPONSIBILITY: 'Responsibility*',
  ROLE: 'Role*',
  GROUP_NAME: 'Group Name*',
  DESIGNATION: 'Designation*',
}

export const FORMPLACEHOLDERS = {
  EMPLOYEE_NO: 'Enter Employee No.',
  FIRST_NAME: 'Enter First Name',
  LAST_NAME: 'Enter Last Name',
  NICK_NAME: 'Enter Nick Name',
  EMAIL_ID: 'Enter Email ID',
  CONTACT_NUMBER: 'Enter Contact Number',
  DEPARTMENT: 'Select Department',
  RESPONSIBILITY: 'Select Responsibility',
  ROLE: 'Select Roles',
  GROUP_NAME: 'Select Group Name',
  DESIGNATION: 'Select Designation',
}

export const FORMFIELDNAMES = {
  FIRST_NAME: 'firstName',
  LAST_NAME: 'lastName',
  NICK_NAME: 'nickName',
  EMAIL_ID: 'emailId',
  CONTACT_NUMBER: 'contactNumber',
  DEPARTMENT: 'department',
  RESPONSIBILITY: 'responsibility',
  ROLE: 'role',
  GROUP_NAME: 'groupName',
  DESIGNATION: 'designation',
}

export const KEYFIELDS = {
  EMPLOYEE_NO: 'id',
  DEPARTMENT: 'department_id',
  RESPONSIBILITY: 'responsibility_id',
  ROLE: 'role_id',
  GROUP_NAME: 'group_id',
  DESIGNATION: 'designation_id',
}

export const VALUEFIELDS = {
  EMPLOYEE_NO: 'employee_id',
  DEPARTMENT: 'department_name',
  RESPONSIBILITY: 'responsibility',
  ROLE: 'role_name',
  GROUP_NAME: 'group_name',
  DESIGNATION: 'designation',
}

export type FormFieldKey = keyof typeof DEFAULT_FORM_DATA

export const TABLESTRINGCONSTANTS = {
  FIELD_NAMES: {
    ID: 'id',
    EMAIL_ID: 'emailId',
    NAME: 'Name',
    ROLE_NAME: 'roleName',
    DEPARTMENT_NAME: 'department_name',
    STATUS: 'status',
    ACTION: 'action',
  },
  HEADER_NAMES: {
    S_NO: 'S.No.',
    EMAIL_ID: 'Email ID',
    NAME: 'Full Name',
    ROLE_CATEGORY: 'Role',
    DEPARTMENT: 'Department',
    STATUS: 'Status',
    ACTION: 'Action',
  },
  COLUMN_WIDTHS: {
    S_NO: 80,
    EMAIL_ID: 250,
    NAME: 220,
    ROLE_CATEGORY: 200,
    DEPARTMENT: 200,
    STATUS: 200,
    ACTION: 150,
  },
  STATUS: {
    ACTIVE: 'Active',
    INACTIVE: 'Inactive',
  },
  ARIA_LABELS: {
    EDIT: 'edit',
    DELETE: 'delete',
  },
  COLORS: {
    EDIT_BUTTON: 'primary',
    DELETE_BUTTON: 'error',
    ICON_INHERIT: 'currentColor',
  },
  STATUS_FIELD: {
    INACTIVE: 0,
    ACTIVE: 1,
  },
  HEADER_TITLE: 'Users List',
  HREF_CREATE: '/user/onboard/create',
  ID_FIELD: 'id',
  CONTACT_TYPE_EMAIL: 'email',
  CONTACT_TYPE_MOBILE: 'mobile number',
}

export const QUERYCONSTANTS = {
  QUERY_KEYS: {
    ROLES: 'roles',
    GROUP: 'group',
    DESIGNATION: 'designation',
    DEPARTMENT: 'department',
    RESPONSIBILITY: 'responsibility',
    PROJECT_USERS: 'projectUsers',
    USER_DELETE: 'delete',
    USER_ONBOARD: 'userOnboard',
    USER: 'user',
  },
  ALERT_TYPES: {
    SUCCESS: 'success',
    CUSTOM_ALERT: 'customAlert',
  },
  ALERT_MESSAGES: {
    ACCESS_DENIED_TITLE: 'Access Denied',
    USER_EXISTS_TEXT: 'Email Already Exists.',
    ERROR_ICON: 'error',
    PAGE_DENIED: 'You do not have permission to access this page.',
  },
}

export const API_ENDPOINTS = {
  ROLES_ALL: `api/v1/roles/all?status=${NUMBERMAP.ONE}`,
  GROUP_ALL: 'api/v1/organization/group/all',
  DESIGNATION_ALL: `api/v1/organization/designation/all?status=${NUMBERMAP.ONE}`,
  DEPARTMENT_ALL: `api/v1/organization/department/all?status=${NUMBERMAP.ONE}`,
  RESPONSIBILITY_ALL: `api/v1/organization/responsibility/all?status=${NUMBERMAP.ONE}`,
  INSERT_USER: 'api/v1/organization/users/',
  FETCH_USER: 'api/v1/organization/users/all',
  UPDATE_USER: 'api/v1/organization/users',
  DELETE_USER: 'api/v1/organization/users',
  LOGOUT: 'api/v1/auth/logout',
  ROLES: `api/v1/organization/roles/all?is_active=${NUMBERMAP.ONE}`,
  GET_USER: `api/v1/organization/users/all?status=${NUMBERMAP.ONE}`,
  GET_STAGE: 'api/v1/dnd/project-stage',
  GET_INTERVIEW_STATUS: `api/v1/hrcs/interview-status/dropdown?status=${NUMBERMAP.ONE}`,
  TENANT_ALL: 'api/v1/organization/tenant',
  // Workflow action endpoints
  WORKFLOW_ACTION: API_URLS.WORKFLOW_ACTION,
  GET_USER_BY_ID: (userId: string) => `api/v1/organization/users/${userId}`,
}
export const NEW_USER_ID = 'create'
export const CONTEXT_TYPES = {
  USER_ONBOARDING: 'user_onboarding',
}
export const PERMISSION_ACTIONS = {
  VIEW: 'view',
  SAVE: 'Save',
  CANCEL: 'Cancel',
}
export const FORM_HEADER_LABELS = {
  EDIT: 'User registration',
}
export const REQUIRED_FIELD_MESSAGE = 'is required'
export const GENERIC_REQUIRED_MESSAGE = (field: string) => `${field} is required`
export const EMPTY_STRING = ''
export const BUTTON_VARIANTS = {
  OUTLINED: 'outlined',
  CONTAINED: 'contained',
}
export const USER_ONBOARD_ROUTES = {
  BASE: '/user/registration',
  NEW: '/user/registration/create',
}

export const USER_ONBOARD_LABELS = {
  CREATE_USER: 'Create User',
}

export const USER_ONBOARD_CLASSNAMES = {
  INACTIVE_ROW: 'inactive-row',
}

export const DELETE_USER_ALERT = {
  NAME: 'customAlert' as const,
  TITLE: 'Delete Confirmation',
  TEXT: 'Are you sure you want to delete this?',
  ICON: 'warning' as const,
}


export const REGISTER_USER_ALERT = {
  NAME: 'customAlert' as const,
  TITLE: 'Success!',
  TEXT: 'User Registration Successful',
  ICON: 'success' as const,
}

export const USER_ON_BOARD = 'userOnboard'