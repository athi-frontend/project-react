/**
 * Risk Team Constants
 * Classification: Confidential
 */

import { NUMBERMAP } from '@/constants/common'
import {
  RiskControlMeasureData,
  RiskControlMeasureFormErrors,
} from '@/types/modules/risk-management/riskTeam'

export const BASE_RISK_TEAM_API_PATH = '/api/v1/risk/risk-team'

export const API_ENDPOINTS = {
  GET_RISK_TEAM_ALL: `${BASE_RISK_TEAM_API_PATH}/all`,
  GET_RISK_TEAM_BY_ID: (risk_team_id: number) =>
    `${BASE_RISK_TEAM_API_PATH}/${risk_team_id}`,
  POST_RISK_TEAM: BASE_RISK_TEAM_API_PATH,
  DELETE_RISK_TEAM: (risk_team_id: number) =>
    `${BASE_RISK_TEAM_API_PATH}/${risk_team_id}`,
  GET_STAGES: '/api/v1/risk/risk-applicability-stages/all',
  GET_RESPONSIBILITIES: '/api/v1/risk/responsibility/all',
  GET_EMPLOYEES_BY_SKILLS: (skill_ids: string) =>
    `/api/v1/hrcs/employee/all?skill_id=${skill_ids}`,
}

// UI Constants
export const RISK_TEAM = {
  PAGE_TITLE: 'Risk Team',
  TABLE_COLUMNS: {
    SNO: 'S.No',
    STAGE: 'Stage',
    RESPONSIBILITY: 'Responsibility',
    ASSIGNED_MEMBERS: 'Assigned Members',
    STATUS: 'Status',
    ACTIONS: 'Actions',
  },
  FIELD_NAMES: {
    SNO: 'sno',
    STAGE_NAME: 'stage_name',
    RESPONSIBILITY_NAME: 'responsibility_name',
    EMPLOYEE_NAME: 'employee_name',
    STATUS: 'status',
    STATUS_NAME: 'status_name',
    STATUS_ID: 'status_id',
    ACTIONS: 'actions',
    RISK_TEAM_ID: 'risk_team_id',
  },
}

// Risk Team Table Columns
const createColumn = (
  field: string,
  headerName: string,
  flex?: number,
  renderCell?: any
) => ({
  field,
  headerName,
  flex: flex || NUMBERMAP.ONE,
  ...(renderCell && { renderCell }),
})

export const RT_TABLE_COLUMNS = [
  createColumn('sno', 'S.No.'),
  createColumn('stageName', 'Stage', NUMBERMAP.ONE),
  createColumn('responsibility', 'Responsibility', NUMBERMAP.TWO),
  createColumn('assignedEmployee', 'Assigned Person', NUMBERMAP.ONE_HALF),
  createColumn('status', 'Status', NUMBERMAP.ONE),
  createColumn('actions', 'Actions'),
]

// Risk Team Form Fields
export const RT_FORM_FIELDS = {
  STAGE: 'stage',
  RESPONSIBILITY: 'responsibility',
  SKILL_REQUIRED: 'skillRequired',
  RESOURCE: 'resource',
  STATUS: 'status',
} as const

// Risk Team Form Labels
export const RT_FORM_LABELS = {
  STAGE: 'Stage',
  RESPONSIBILITY: 'Responsibility',
  SKILL_REQUIRED: 'Skills Required',
  RESOURCE: 'Resource',
  STATUS: 'Status',
} as const

// Risk Team Form Placeholders
export const RT_FORM_PLACEHOLDERS = {
  STAGE: 'Select Stage',
  RESPONSIBILITY: 'Select Responsibility',
  SKILL_REQUIRED: 'Select Skills Required',
  RESOURCE: 'Select Resource',
  STATUS: 'Select Status',
} as const

// Risk Team Page Titles
export const RT_PAGE_TITLES = {
  MAIN: 'Risk Team',
  MODAL: 'Add Risk Team',
  EDIT_MODAL: 'Edit Risk Team',
} as const

// Risk Team Validation Rules
export const RT_VALIDATION_RULES = {
  REQUIRED_FIELDS: [
    'stage',
    'responsibility',
    'skillRequired',
    'resource',
    'status',
  ],
} as const

// Risk Team Validation Messages
export const RT_VALIDATION_MESSAGES = {
  REQUIRED: 'is required',
} as const

// Risk Team API Constants
export const RT_API_CONSTANTS = {
  WORKFLOW_STATUS: 'Approved',
} as const

// Risk Team Modal Constants
export const RT_INITIAL_FORM_DATA: RiskControlMeasureData = {
  stage: null,
  responsibility: null,
  skillRequired: [],
  resource: null,
  status: null,
}

export const RT_INITIAL_ERRORS: RiskControlMeasureFormErrors = {
  stage: '',
  responsibility: '',
  skillRequired: '',
  resource: '',
  status: '',
}

// Risk Team Field Labels for Validation
export const RT_FIELD_LABELS = {
  [RT_FORM_FIELDS.STAGE]: RT_FORM_LABELS.STAGE,
  [RT_FORM_FIELDS.RESPONSIBILITY]: RT_FORM_LABELS.RESPONSIBILITY,
  [RT_FORM_FIELDS.SKILL_REQUIRED]: RT_FORM_LABELS.SKILL_REQUIRED,
  [RT_FORM_FIELDS.RESOURCE]: RT_FORM_LABELS.RESOURCE,
  [RT_FORM_FIELDS.STATUS]: RT_FORM_LABELS.STATUS,
} as const

// Risk Team Dropdown Field Mappings
export const RT_DROPDOWN_FIELDS = {
  STAGE: {
    KEY_FIELD: 'stage_applicable_id',
    VALUE_FIELD: 'stage_name',
  },
  RESPONSIBILITY: {
    KEY_FIELD: 'responsibility_id',
    VALUE_FIELD: 'responsibility_name',
  },
  SKILL: {
    ID_FIELD: 'skill_id',
    VALUE_FIELD: 'skill_name',
  },
  EMPLOYEE: {
    KEY_FIELD: 'id',
    VALUE_FIELD: 'employee_name',
  },
  STATUS: {
    KEY_FIELD: 'status_id',
    VALUE_FIELD: 'status_name',
  },
} as const

export const RISK_TEAM_FIELD_LABEL_MAP = {
  stage: 'Stage*',
  responsibility: 'Responsibility*',
  skillRequired: 'Skills Required*',
  resource: 'Resource*',
  status: 'Status*',
} as const

export const RISK_TEAM_FIELD_ORDER = Object.keys(RISK_TEAM_FIELD_LABEL_MAP)