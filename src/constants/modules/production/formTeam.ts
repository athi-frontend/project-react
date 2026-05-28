/**
 * Classification: Confidential
 * Form Team Constants
 */

import { FormTeamModalData } from '@/types/modules/production/formTeam'
export const INITIAL_FORM_DATA: FormTeamModalData = {
  role: '',
  resource: '',
  responsibility: '',
  status: '',
}

export const FORM_TEAM_COLUMN_FIELDS = {
  SNO: 'sno',
  ROLE: 'role_name',
  RESOURCE: 'employee_name',
  RESPONSIBILITY: 'responsibility_description',
  STATUS: 'status_id',
  ACTION: 'action',
} as const

export const FORM_TEAM_COLUMN_HEADERS = {
  SNO: 'S.No.',
  ROLE: 'Role',
  RESOURCE: 'Resource',
  RESPONSIBILITY: 'Responsibility',
  STATUS: 'Status',
  ACTION: 'Actions',
} as const

export const FORM_TEAM_ERROR_MESSAGES = {
  TEAM_NAME_REQUIRED: 'Team Name is required',
  FORM_TEAM_REQUIRED: 'At least one Form Team entry is required',
  REMARK_REQUIRED: 'Remark is required',
  ROLE_REQUIRED: 'Role is required',
  RESOURCE_REQUIRED: 'Resource is required',
  RESPONSIBILITY_REQUIRED: 'Responsibility is required',
  STATUS_REQUIRED: 'Status is required',
} as const

export const FORM_TEAM_FIELD_LABELS = {
  ROLE: 'Role*',
  RESOURCE: 'Resource*',
  RESPONSIBILITY: 'Responsibility*',
  STATUS: 'Status*',
} as const

export const FORM_TEAM_FIELD_PLACEHOLDERS = {
  ROLE: 'Select Role',
  RESOURCE: 'Select Resource',
  RESPONSIBILITY: 'Enter Responsibility',
  STATUS: 'Select Status',
} as const

export const FORM_TEAM_FIELD_KEY_FIELDS = {
  ROLE: 'role_id',
  RESOURCE: 'id',
  STATUS: 'status_id',
} as const

export const FORM_TEAM_FIELD_VALUE_FIELDS = {
  ROLE: 'role_name',
  RESOURCE: 'employee_name',
  STATUS: 'status_name',
} as const

export const FORM_TEAM_PAGE_LABELS = {
  TEAM_NAME: 'Team Name*',
  REMARK: 'Remarks',
  FORM_TEAM: 'Form Team',
} as const

export const FORM_TEAM_PAGE_PLACEHOLDERS = {
  TEAM_NAME: 'Enter Team Name',
  REMARK: 'Enter Remark',
} as const

export const FORM_TEAM_PAGE_FIELDS = {
  ID_FIELD: 'team_details_id',
} as const

export const FORM_TEAM = {
  PATH: '/production/list',
} as const

export const BUTTON_LABELS = {
  SAVE: 'Save',
  CANCEL: 'Cancel',
  ADD_NEW: 'Add New',
} as const

// API Endpoints
const BASE_API_PATH = 'api/v1/production/form-a-team'

export const API_ENDPOINTS = {
  POST_FORM_TEAM: BASE_API_PATH,
  GET_FORM_TEAM_BY_PROJECT: (projectId: number) => `${BASE_API_PATH}/project/${projectId}`,
} as const

// Query Keys
export const QUERY_KEYS = {
  POST_FORM_TEAM: 'post-form-team',
  GET_FORM_TEAM_BY_PROJECT: 'get-form-team-by-project',
} as const

// Success/Error Messages - using string constants for showActionAlert
export const SUCCESS_ALERT = 'success'
export const FAILED_ALERT = 'failed'
export const CUSTOM_ALERT = 'customAlert'

// Modal Mode Constants
export const MODAL_MODE = {
  ADD: 'add',
  EDIT: 'edit',
} as const

// Status Constants
export const FORM_TEAM_STATUS = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
} as const

// Modal Title Constants
export const MODAL_TITLES = {
  ADD: 'Add Form Team',
  EDIT: 'Edit Form Team',
} as const

// Duplicate Alert Constants
export const DUPLICATE_ALERT = {
  TITLE: 'Duplicate Entry',
  MESSAGE: 'This role and resource combination already exists. Please select a different combination.',
  ICON: 'error',
  CONFIRM_BUTTON_TEXT: 'OK',
} as const

