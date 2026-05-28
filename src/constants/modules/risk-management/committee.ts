/**
 * Classification : Confidential
 **/
import { NUMBERMAP } from '@/constants/common'

const COMMITTEE_BASE_ENDPOINT = 'api/v1/risk/committee';

export const COMMITTEE_API_ENDPOINTS = {
  GET_COMMITTEE_ALL: `${COMMITTEE_BASE_ENDPOINT}/all`,
  UPSERT_COMMITTEE: `${COMMITTEE_BASE_ENDPOINT}`,
  GET_COMMITTEE_BY_ID: (committeeId: number) =>
    `${COMMITTEE_BASE_ENDPOINT}/${committeeId}`,
  DELETE_COMMITTEE: (committeeId: number) =>
    `${COMMITTEE_BASE_ENDPOINT}/${committeeId}`,
  GET_EMPLOYEES: 'api/v1/hrcs/employee/all',
}

export const COMMITTEE_FORM_LABELS = {
  ROLE: 'Role*',
  DESCRIPTION: 'Description*',
  ASSIGNED_EMPLOYEE: 'Committee Member*',
  STATUS: 'Status*',
}

export const COMMITTEE_FORM_PLACEHOLDERS = {
  ROLE: 'Select Role',
  DESCRIPTION: 'Enter Description',
  ASSIGNED_EMPLOYEE: 'Select Committee Member',
  STATUS: 'Select Status',
}

export const COMMITTEE_BUTTON_LABELS = {
  ADD_NEW: 'Add New',
  EDIT: 'Edit',
  DELETE: 'Delete',
  SAVE: 'Save',
  CANCEL: 'Cancel',
  CLOSE: 'Close',
}

export const COMMITTEE_ERROR_MESSAGES = {
  ROLE_REQUIRED: 'Role is required',
  DESCRIPTION_REQUIRED: 'Description is required',
  EMPLOYEE_REQUIRED: 'Committee Member is required',
  FETCH_ERROR: 'Failed to fetch committee data',
  UPSERT_ERROR: 'Failed to save committee data',
  DELETE_ERROR: 'Failed to delete committee member',
  VALIDATION_ERROR: 'Please fill all required fields',
}

export const COMMITTEE_TABLE_COLUMNS = {
  SNO: {
    field: 'sno',
    headerName: 'S.No',
  },
  ROLE: {
    field: 'role',
    headerName: 'Role',
    flex: NUMBERMAP.ONE,
  },
  DESCRIPTION: {
    field: 'description',
    headerName: 'Description',
    flex: NUMBERMAP.TWO,
  },
  ASSIGNED_EMPLOYEE: {
    field: 'assignedEmployee',
    headerName: 'Committee Members',
    flex: NUMBERMAP.TWO,
  },
  STATUS: {
    field: 'status_name',
    headerName: 'Status',
    flex: NUMBERMAP.ONE,
  },
  ACTIONS: {
    field: 'actions',
    headerName: 'Actions',
  },
}

export const COMMITTEE_FORM_KEYS = {
  PROJECT_ID: 'project_id',
  COMMITTEE_ID: 'committee_id',
  ROLE_ID: 'role_id',
  EMPLOYEE_ID: 'employee_id',
  DESCRIPTION: 'description',
  STATUS: 'status',
}

export const COMMITTEE_FIELD_KEYS = {
  ROLE_ID: 'role_id',
  EMPLOYEE_ID: 'employee_id',
  DESCRIPTION: 'description',
  STATUS: 'status',
}

export const COMMITTEE_DROPDOWN_CONFIG = {
  ROLE: {
    KEY_FIELD: 'role_id',
    VALUE_FIELD: 'role_name',
  },
  EMPLOYEE: {
    KEY_FIELD: 'id',
    VALUE_FIELD: 'employee_name',
  },
  STATUS: {
    KEY_FIELD: 'status_id',
    VALUE_FIELD: 'status_name',
  },
}

export const COMMITTEE_STATUS_MESSAGES = {
  STATUS_REQUIRED: 'Status is required',
}

export const COMMITTEE_PAGE_CONSTANTS = {
  PAGE_TITLE: 'Committees',
  STATUS_HEADER: 'Status',
  ID_FIELD: 'committee_id',
  STATUS_ACTIVE: 'Active',
  MODAL_TITLE: 'Committee',
}

export const COMMITTEE_TABLE_FIELDS = {
  SNO: 'sno',
  ROLE_NAME: 'role_name',
  DESCRIPTION: 'description',
  EMPLOYEE_NAME: 'fullName',
  STATUS_NAME: 'status_name',
  ACTIONS: 'actions',
}

export const COMMITTEE_INITIAL_DATA = {
  project_id: null,
  committee_id: null,
  role_id: null,
  employee_id: null,
  description: '',
  status: null,
}

export const COMMITTEE_FIELD_LABEL_MAP = {
  role_id: 'Role*',
  employee_id: 'Committee Member*',
  description: 'Description*',
  status: 'Status*',
} as const

export const COMMITTEE_FIELD_ORDER = Object.keys(COMMITTEE_FIELD_LABEL_MAP)