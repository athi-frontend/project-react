import { TableData } from '@/types/modules/dnd/formTeam'
import { GridRenderCellParams } from '@mui/x-data-grid'

export const PROJECT_ID = 16
export const INITIAL_TABLE_DATA: TableData[] = []
export const TITLE = 'Form a Team'
export const ADD_BUTTON_TITLE = 'Add Row'
export const INITIATE_BUTTON_TEXT = 'Initiate Design Input Gathering'
export const NO_RESPONSIBILITY = 'No Responsibility'
export const DELETE_ALERT = 'delete'
export const DENIED_ALERT = 'denied'
export const TITLE_VARIANT = 'h1'
export const BUTTON_VARIANT = 'contained'
export const BASE_API_PATH = 'api/v1/dnd'
export const BASE_API_END = 'teams'
export const DATE_FORMAT = 'YYYY-MM-DD'
export const ID_FIELD = 'id'
export const OTHERS = 'others'
export const SUCCESS_ALERT = 'success'
export const FAILED_ALERT = 'failed'
export const USER_EXISTS_CODE = 409
export const ACTIVE_STATUS_TEXT = 'Active'
export const IN_ACTIVE_STATUS_TEXT = 'Inactive'

export const API_URLS = {
  TEAM: {
    BASE: `${BASE_API_PATH}/${BASE_API_END}`,
    FETCH: `${BASE_API_PATH}/${BASE_API_END}/all`,
    CREATE: `${BASE_API_PATH}/${BASE_API_END}`,
    UPDATE: `${BASE_API_PATH}/${BASE_API_END}`,
    DELETE: `${BASE_API_PATH}/${BASE_API_END}`,
  },
}

export const TEAM_FETCH_QUERY = (projectId: number | string) =>
  `${API_URLS.TEAM.FETCH}?project_id=${Number(projectId)}`


export const QUERY_KEYS = {
  ROLES: 'roles',
  USERS: 'users',
  TEAMS: 'teams',
  RESPONSIBILITIES: 'responsibilities',
  STAGES: 'stages',
}

export const FORM_MODAL_CONSTANTS = {
  ROLES: 'roles',
  USERS: 'users',
  TEAMS: 'teams',
  STAGE_LABEL: 'Stage*',
  STAGE_PLACEHOLDER: 'Select Stage',
  START_DATE_LABEL: 'Start Date',
  START_DATE: 'start_date',
  STATUS_LABEL: 'Status',
  START_DATE_PLACEHOLDER: 'DD-MM-YYYY | HH:MM',
  END_DATE_LABEL: 'End Date',
  END_DATE: 'end_date',
  END_DATE_PLACEHOLDER: 'DD-MM-YYYY | HH:MM',
  RESPONSIBILITY_DESCRIPTION_LABEL: 'Responsibility Description*',
  RESPONSIBILITY_PLACEHOLDER: 'Enter Responsibility',
  ROLE_LABEL: 'Role*',
  ROLE_REQUIRED: 'Role is required',
  USER_REQUIRED: 'User is required',
  RESPONSIBILITY_REQUIRED: 'Responsibility is required',
  ROLE_PLACEHOLDER: 'Select role',
  RESOURCE_REQUIRED: 'Resource is required',
  RESOURCE_LABEL: 'Resource*',
  RESOURCE_PLACEHOLDER: 'Enter Resource',
  RESPONSIBILITY_LABEL: 'Responsibility*',
  STAGE_REQUIRED: 'Stage is required',
  INVALID_DATE_FORMAT: 'Invalid date format',
  END_DATE_AFTER_START: 'End date must be after start date',
  STATUS_REQUIRED: 'Status is required',
  RESPONSIBILITY_DESCRIPTION_REQUIRED: 'Responsibility description is required',
  EDIT_TEAM_TITLE: 'Edit Team',
  FORM_TEAM_TITLE: 'Form a Team',
  CANCEL_BUTTON: 'Cancel',
  SAVE_BUTTON: 'Save',
  UPDATE_BUTTON: 'Update',
  ACCESS_DENIED_TITLE: 'Error',
  USER_EXISTS_TEXT: 'User Already Exists',
  ERROR_ICON: 'error',
  SUCCESS_ALERT: 'success',
  CUSTOM_ALERT: 'customAlert',
  ID_FIELD: 'id',
  ROLE_NAME_FIELD: 'roleName',
  FULL_NAME_FIELD: 'fullName',
  LICENSE_KEY: 'GPL',
}

export interface FormData {
  role: number | string
  user: number | string
  other_resource: string
  responsibility: string
  responsibility_description: string
  project_id: number
  design_team_id: number
  stage_name: string
  stage_id: string
  project_stage_order_id: string
  start_date: string
  end_date: string
  status: number
}

export const DEFAULT_FORM_TEAM_DATA = (projectId: number): FormData => ({
  role: '',
  user: '',
  other_resource: '',
  responsibility: '',
  stage_name: '',
  responsibility_description: '',
  project_id: projectId,
  design_team_id: 0,
  stage_id: '',
  project_stage_order_id: '',
  start_date: '',
  end_date: '',
  status: 1,
})

export const TABLE_COLUMNS = [
  { field: 'role_name', headerName: 'Role', width: 250 },
  {
    field: 'user_name',
    headerName: 'Users',
    width: 150,
    renderCell: (params: GridRenderCellParams) => {
      if (params.row.role_name.toLowerCase() === OTHERS) {
        return params.row.other_resource ?? 'N/A'
      }
      return params.row.user_name ?? 'N/A'
    },
  },
  { field: 'responsibility', headerName: 'Responsibility', width: 200 },
  { field: 'stage_name', headerName: 'Stage', width: 200 },
]

export const FIELD_CONFIGS = {
  ROLE: {
    field: 'role' as keyof FormData,
    label: FORM_MODAL_CONSTANTS.ROLE_LABEL,
    placeholder: FORM_MODAL_CONSTANTS.ROLE_PLACEHOLDER,
    keyField: 'role_id',
    valueField: 'role_name',
  },
  USER: {
    field: 'user' as keyof FormData,
    label: FORM_MODAL_CONSTANTS.RESOURCE_LABEL,
    placeholder: FORM_MODAL_CONSTANTS.RESOURCE_PLACEHOLDER,
    keyField: 'id',
    valueField: 'employee_name',
  },
  OTHER_RESOURCE: {
    field: 'other_resource' as keyof FormData,
    label: FORM_MODAL_CONSTANTS.RESOURCE_LABEL,
    placeholder: FORM_MODAL_CONSTANTS.RESOURCE_PLACEHOLDER,
  },
  RESPONSIBILITY: {
    field: 'responsibility' as keyof FormData,
    label: FORM_MODAL_CONSTANTS.RESPONSIBILITY_LABEL,
    placeholder: FORM_MODAL_CONSTANTS.RESPONSIBILITY_PLACEHOLDER,
  },
  RESPONSIBILITY_DESCRIPTION: {
    field: 'responsibility_description' as keyof FormData,
    label: FORM_MODAL_CONSTANTS.RESPONSIBILITY_DESCRIPTION_LABEL,
    placeholder: FORM_MODAL_CONSTANTS.RESPONSIBILITY_PLACEHOLDER,
  },
  STAGE: {
    field: 'project_stage_order_id' as keyof FormData,
    label: FORM_MODAL_CONSTANTS.STAGE_LABEL,
    placeholder: FORM_MODAL_CONSTANTS.STAGE_PLACEHOLDER,
    keyField: 'project_stage_order_id',
    valueField: 'stage',
  },
  START_DATE: {
    field: 'start_date' as keyof FormData,
    label: FORM_MODAL_CONSTANTS.START_DATE_LABEL,
  },
  END_DATE: {
    field: 'end_date' as keyof FormData,
    label: FORM_MODAL_CONSTANTS.END_DATE_LABEL,
  },
  STATUS: {
    field: 'status' as keyof FormData,
    label: FORM_MODAL_CONSTANTS.STATUS_LABEL,
  },
}

export const STATUS_DISPLAY = {
  ACTIVE: ACTIVE_STATUS_TEXT,
  INACTIVE: IN_ACTIVE_STATUS_TEXT,
}

export const FORM_DESIGN = {
  overflow: 'auto',
  height: '400px',
  scrollbarWidth: 'none',
}

export const OVERFLOW = { overflow: 'hidden' }

export const getStatusDisplay = (status: number | undefined): string =>
  status === 0 ? STATUS_DISPLAY.INACTIVE : STATUS_DISPLAY.ACTIVE

export const COMMON_CONSTANTS = {
  SUCCESS_ALERT: SUCCESS_ALERT,
  FAILED_ALERT: FAILED_ALERT,
  USER_EXISTS_CODE: USER_EXISTS_CODE,
  USER_EXISTS_TEXT: FORM_MODAL_CONSTANTS.USER_EXISTS_TEXT,
  ACTIVE_STATUS_TEXT: ACTIVE_STATUS_TEXT,
  IN_ACTIVE_STATUS_TEXT: IN_ACTIVE_STATUS_TEXT,
}

export const ICON_NEW = 'error'
export const ICON_NEWERROR = 'Error'
