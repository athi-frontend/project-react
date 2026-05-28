/**
 * Quality Control Form Team Constants
 * Classification: Confidential
 */

import { NUMBERMAP } from '@/constants/common'
import { FETCH_ALL_SKILL } from '@/constants/modules/hr/skill'
import { API_ENDPOINTS as RISK_TEAM_API_ENDPOINTS } from '@/constants/modules/risk-management/riskTeam'
import { 
  FormTeamFormData, 
  FormTeamFormErrors,
  TeamMemberModalData,
  TeamMemberModalFormErrors,
} from '@/types/modules/quality-control-management/formTeam'

export const BASE_FORM_TEAM_API_PATH = '/api/v1/quality-control/form-team'

// Base Route Path
export const FT_BASE_ROUTE_PATH = '/quality-control-management/form-team'

// Route Paths
export const FT_ROUTE_PATHS = {
  LIST: FT_BASE_ROUTE_PATH,
  CREATE: `${FT_BASE_ROUTE_PATH}/create`,
  EDIT: (id: number) => `${FT_BASE_ROUTE_PATH}/${id}`,
} as const

// Table Field Names
export const FT_TABLE_FIELDS = {
  ID: 'purchase_order_id',
  SNO: 'sno',
  PURCHASE_ORDER_NO: 'purchase_order_no',
  PURCHASE_ORDER_DATE: 'purchase_order_date',
  STATUS: 'status',
  ACTIONS: 'actions',
} as const

// Table Column Headers
export const FT_TABLE_COLUMN_HEADERS = {
  SNO: 'S.No.',
  PURCHASE_ORDER_NUMBER: 'Purchase Order Number',
  PURCHASE_ORDER_DATE: 'Purchase Order Date',
  STATUS: 'Status',
  ACTIONS: 'Actions',
} as const

export const API_ENDPOINTS = {
  GET_FORM_TEAM_ALL: `${BASE_FORM_TEAM_API_PATH}/all?status=1`,
  GET_FORM_TEAM_BY_ID: (purchase_order_id: number) =>
    `${BASE_FORM_TEAM_API_PATH}/${purchase_order_id}`,
  POST_FORM_TEAM: BASE_FORM_TEAM_API_PATH,
  DELETE_FORM_TEAM: (team_id: number) =>
    `${BASE_FORM_TEAM_API_PATH}/${team_id}`,
  GET_PURCHASE_ORDERS: '/api/v1/vendor-purchase/purchase-order/all',
  GET_PART_CATEGORIES: (purchase_order_id: number) =>
    `/api/v1/quality-control/part-category?purchase_order_id=${purchase_order_id}`,
  GET_SKILLS: `/${FETCH_ALL_SKILL}`,
  GET_EMPLOYEES_BY_SKILLS: RISK_TEAM_API_ENDPOINTS.GET_EMPLOYEES_BY_SKILLS,
} as const

// UI Constants
export const FORM_TEAM = {
  PAGE_TITLE: 'Form a Team',
  TABLE_COLUMNS: {
    SNO: 'S.No',
    PURCHASE_ORDER_NUMBER: 'Purchase Order Number',
    PURCHASE_ORDER_DATE: 'Purchase Order Date',
    ACTIONS: 'Actions',
  },
  FIELD_NAMES: {
    SNO: 'sno',
    PURCHASE_ORDER_NUMBER: 'purchase_order_no',
    PURCHASE_ORDER_DATE: 'purchase_order_date',
    ACTIONS: 'actions',
    TEAM_ID: 'team_id',
  },
} as const

// Form Team Table Columns
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

export const FT_TABLE_COLUMNS = [
  createColumn('sno', 'S.No.'),
  createColumn('purchase_order_no', 'Purchase Order Number', NUMBERMAP.TWO),
  createColumn('purchase_order_date', 'Purchase Order Date', NUMBERMAP.TWO),
  createColumn('actions', 'Actions'),
]

// Form Team Form Fields
export const FT_FORM_FIELDS = {
  PURCHASE_ORDER_NUMBER: 'purchase_order_number',
  PURCHASE_ORDER_DATE: 'purchase_order_date',
} as const

// Form Team Form Labels
export const FT_FORM_LABELS = {
  PURCHASE_ORDER_NUMBER: 'Purchase Order Number',
  PURCHASE_ORDER_DATE: 'Purchase Order Date',
  STATUS: 'Status',
} as const

// Form Team Form Placeholders
export const FT_FORM_PLACEHOLDERS = {
  PURCHASE_ORDER_NUMBER: 'Select Purchase Order Number',
  PURCHASE_ORDER_DATE: 'Select Purchase Order Date',
  STATUS: 'Select Status',
} as const

// Form Team Page Titles
export const FT_PAGE_TITLES = {
  MAIN: 'Form a Team',
  MODAL: 'Add Team Member',
  EDIT_MODAL: 'Edit Team Member',
} as const

// Form Team Validation Rules
export const FT_VALIDATION_RULES = {
  REQUIRED_FIELDS: ['purchase_order_number'],
} as const

// Form Team Validation Messages
export const FT_VALIDATION_MESSAGES = {
  REQUIRED: 'is required',
  PURCHASE_ORDER_NUMBER_REQUIRED: 'Purchase Order Number is required',
  STATUS_REQUIRED: 'Status is required',
  DUPLICATE_PART_CATEGORY_RESOURCE: 'This combination of Part Category and Resource already exists for this Purchase Order',
  TEAM_MEMBER_REQUIRED: 'At least one team member is required',
} as const

// Form Team Dropdown Field Mappings
export const FT_DROPDOWN_FIELDS = {
  PURCHASE_ORDER: {
    KEY_FIELD: 'purchase_order_id',
    VALUE_FIELD: 'purchase_order_number',
  },
  PART_CATEGORY: {
    KEY_FIELD: 'part_category_id',
    VALUE_FIELD: 'part_category_name',
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

// Team Details Table Constants
export const TEAM_DETAILS_TABLE = {
  COLUMNS: {
    SNO: 'S.No.',
    SKILL_REQUIRED: 'Skill Required',
    RESOURCE: 'Resource',
    RESPONSIBILITY: 'Responsibility',
    STATUS: 'Status',
    ACTIONS: 'Actions',
  },
  FIELD_NAMES: {
    SNO: 'sno',
    SKILL_REQUIRED: 'skill_required',
    RESOURCE: 'resource',
    RESPONSIBILITY: 'responsibility',
    STATUS: 'status',
    ACTIONS: 'actions',
  },
  BUTTON_TEXT: {
    ADD_NEW: '+ Add New',
  },
  COLUMN_FIELDS: {
    ACTION: 'action',
    CATEGORY: 'category',
    RESOURCE: 'resource',
    RESPONSIBILITY: 'responsibility',
    STATUS: 'status',
    ACTIONS: 'actions',
  },
  COLUMN_FLEX: {
    SNO: NUMBERMAP.ONE,
    SKILL_REQUIRED: NUMBERMAP.ONE_HALF,
    RESOURCE: NUMBERMAP.ONE,
    RESPONSIBILITY: NUMBERMAP.ONE_HALF,
    STATUS: NUMBERMAP.ONE,
    ACTIONS: NUMBERMAP.ONE,
  },
  ID_PREFIX: {
    GROUP: 'group-',
  },
  EXPANDED_MARKERS: {
    EXPANDED: 'expanded',
    COLLAPSED: 'collapsed',
  },
  CUSTOM_CLASS_NAME: 'qc-team-group',
  PADDING: {
    ZERO_PADDING: String(NUMBERMAP.ZERO),
    PADDING_LENGTH: NUMBERMAP.TWO,
  },
} as const

// Team Member Modal Constants
export const TEAM_MEMBER_MODAL = {
  PART_CATEGORY_LABEL: 'Part Category*',
  PART_CATEGORY_PLACEHOLDER: 'Select Part Category',
  SKILL_REQUIRED_LABEL: 'Skill Required*',
  SKILL_REQUIRED_PLACEHOLDER: 'Select Skill Required',
  RESOURCE_LABEL: 'Resource*',
  RESOURCE_PLACEHOLDER: 'Select Resource',
  RESPONSIBILITY_LABEL: 'Responsibility*',
  RESPONSIBILITY_PLACEHOLDER: 'Enter Responsibility',
  RESPONSIBILITY_DESCRIPTION_LABEL: 'Responsibility Description',
  RESPONSIBILITY_DESCRIPTION_PLACEHOLDER: 'Enter Responsibility Description',
  STATUS_LABEL: 'Status*',
  STATUS_PLACEHOLDER: 'Select Status',
  PART_CATEGORY_REQUIRED: 'Part Category is required',
  SKILL_REQUIRED_REQUIRED: 'Skill Required is required',
  RESOURCE_REQUIRED: 'Resource is required',
  RESPONSIBILITY_REQUIRED: 'Responsibility is required',
  STATUS_REQUIRED: 'Status is required',
  FIELD_NAMES: {
    PART_CATEGORY: 'part_category_id',
    SKILL_REQUIRED: 'skill_id',
    RESOURCE: 'employee_id',
    RESPONSIBILITY: 'responsibility',
    RESPONSIBILITY_DESCRIPTION: 'responsibility_description',
    STATUS: 'status',
  },
} as const

// Query Keys
export const QUERY_KEYS = {
  FORM_TEAM_LIST: 'formTeamList',
  FORM_TEAM_DETAIL: 'formTeamDetail',
  PURCHASE_ORDERS: 'purchaseOrders',
  PART_CATEGORIES: 'partCategories',
  SKILLS: 'skills',
  EMPLOYEES: 'employees',
} as const

// Initial Form State
export const INITIAL_FORM_DATA: FormTeamFormData = {
  purchase_order_number_id: null,
  purchase_order_date: '',
  status_id: null,
  purchase_team_details: [],
}

export const INITIAL_ERRORS: FormTeamFormErrors = {
  purchase_order_number_id: '',
  purchase_order_date: '',
  status_id: '',
  purchase_team_details: '',
}

// Route and Mode Constants
export const FT_ROUTE_MODE = {
  CREATE: 'create',
} as const

// Status Labels
export const FT_STATUS_LABELS = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
} as const

// Alert Types
export const FT_ALERT_TYPES = {
  CUSTOM_ALERT: 'customAlert',
} as const

// Alert Messages
export const FT_ALERT_MESSAGES = {
  ERROR_TITLE: 'Error',
  SELECT_PURCHASE_ORDER_FIRST: 'Please select Purchase Order Number first',
  ERROR_ICON: 'error',
} as const

// Button Labels
export const FT_BUTTON_LABELS = {
  CANCEL: 'Cancel',
  SAVE: 'Save',
} as const

// Category and ID Prefixes
export const FT_CATEGORY_LABELS = {
  UNKNOWN_CATEGORY: 'Unknown Category',
  PART_CATEGORY_PREFIX: 'Part Category : ',
} as const

// Temporary ID Prefix
export const FT_TEMP_ID_PREFIX = 'temp_'

// Draft Context Type
export const FT_DRAFT_CONTEXT_TYPE = 'purchase_order'

// Date Format
export const FT_DATE_FORMAT = {
  DEFAULT: 'YYYY-MM-DD',
} as const

// Team Member Modal Initial Data
export const INITIAL_TEAM_MEMBER_FORM_DATA: TeamMemberModalData = {
  part_category_id: null,
  skill_id: null,
  employee_id: null,
  responsibility: '',
  responsibility_description: '',
  status: null,
}

export const INITIAL_TEAM_MEMBER_ERRORS: TeamMemberModalFormErrors = {
  part_category_id: '',
  skill_id: '',
  employee_id: '',
  responsibility: '',
  responsibility_description: '',
  status: '',
}

