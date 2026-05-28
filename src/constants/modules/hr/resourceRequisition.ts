import { NUMBERMAP } from "@/constants/common"
export const FORMFIELDNAMES = {
  ROLE: 'role',
  RESOURCE_REQUIRED: 'resourceRequired',
  REASON_FOR_RECRUITMENT: 'reasonForRecruitment',
  ESTIMATED_CTC: 'estimatedCTC',
  REPORTS_TO: 'reportsTo',
  DEPARTMENT: 'department',
  ONBOARD_BY: 'onboardBy',
  OPENINGS: 'openings',
  RECRUITMENT_TYPE: 'recruitmentType',
  DESCRIPTION: 'description',
} as const

export const FORMLABELS = {
  ROLE: 'Role*',
  RESOURCE_REQUIRED: 'Resource Required*',
  REASON_FOR_RECRUITMENT: 'Reason for Recruitment',
  ESTIMATED_CTC: 'Estimated Cost to Company*',
  REPORTS_TO: 'Reports to',
  DEPARTMENT: 'Department',
  ONBOARD_BY: 'To be Onboard By*',
  OPENINGS: 'Number of Openings*',
  RECRUITMENT_TYPE: 'Type of Recruitment*',
  DESCRIPTION: 'Description*',
} as const

export const FORMPLACEHOLDERS = {
  ROLE: 'Select Role',
  RESOURCE_REQUIRED: 'Select Resource Required',
  REASON_FOR_RECRUITMENT: 'Enter Reason for Recruitment',
  ESTIMATED_CTC: 'Enter Estimated Cost to Company',
  REPORTS_TO: 'Reports to',
  DEPARTMENT: 'Department',
  ONBOARD_BY: 'DD-MM-YYYY',
  OPENINGS: 'Enter Number of Openings',
  RECRUITMENT_TYPE: 'Select Type of Recruitment',
  DESCRIPTION: 'Description',
} as const

export const KEYFIELDS = {
  RESOURCE_REQUIRED: 'resource_required_id',
  PRODUCT: 'product_id',
  REPORTS_TO: 'id',
  ROLE: 'role_id',
  DEPARTMENT: 'department_id',
  RECRUITMENT_TYPE: 'type_of_recruitment_id',
  ONBOARD_BY: 'id',
} as const

export const VALUEFIELDS = {
  RESOURCE_REQUIRED: 'resource_required_type',
  PRODUCT: 'product_name',
  REPORTS_TO: 'firstName',
  ROLE: 'role_name',
  DEPARTMENT: 'department_name',
  RECRUITMENT_TYPE: 'recruitment_type',
  ONBOARD_BY: 'firstName',
} as const

export const BUTTONLABELS = {
  SAVE: 'Save',
  CANCEL: 'Cancel',
  SUBMIT_REVIEW: 'Submit for Review',
  SUBMIT_APPROVAL: 'Submit for Approval',
  APPROVE: 'Approve',
  REJECT: 'Reject',
} as const

export const BUTTON_VARIANTS = {
  CONTAINED: 'contained',
  OUTLINED: 'outlined',
  TEXT: 'text',
} as const

export const FORM_HEADER = 'Add Resource Requisition'
export const EDIT_RECRUITMENT = 'Edit Resource Requisition'
export const FORM_ID = 'HR_RESOURCE_REQUISITION'
export const DATA_SOURCE_NAME = 'eqms_hr_resource_requisition'
export const DESCRIPTION = 'description'
export const RECRUITMENT_TYPE = 'fk_eqms_hr_recruitment_type_lk_id'
export const DEPARTMENT_ID = 'fk_eqms_organization_department_id'
export const ROLES_ID = 'fk_eqms_roles_lk_id'
export const OPENINGS = 'number_of_openings'
export const ONBOARD_BY = 'onboard_date'
export const REASON = 'reason'
export const ESTIMATED_CTC = 'estimated_cost_to_company'
export const REPORTS_TO = 'fk_eqms_reports_to_role_id'
export const PRODUCT_ID = 'fk_eqms_organization_product_id'
export const RESOURCE_REQUIRED = 'fk_eqms_hr_resource_required_type_lk_id'
export const STRING = 'string'
export const INSERT = 'insert'
export const DELETE = 'delete'
export const ACTIVE = 'Active'
export const DELETE_DATA_GRID = '.data-grid-delete'
export const UPDATE = 'update'
export const DATA_DELETE_ROW = 'data-grid-delete row-'
export const ID = 'id'
export const RESOURCE_REQUISITION='resource_requisition_id'
export const PATHNAME = '/hr/resource-requisition/create'

export const RESOURCE_REQUISITION_CONSTANTS = {
  CONTEXT_TYPE: 'hr_role_requisition',
}
export const TITLE = 'Resource Requisition'
export const STATUS = 'status'
export const SNO = 'sno'
export const S_NO = 'S.No.'
export const DECRIPTION = 'Description'
export const DECRIPTON = 'description'
export const OPENINGSS = 'openings'
export const NO_OF_OPENINGSS = 'No. of Openings'
export const ROLE = 'Role'
export const FIELD_ROLE = 'role'
export const FIELD_STATUS = 'status'
export const STATUS_NAME = 'Status'
export const ACTIONS = 'actions'
export const ACTION = 'Action'
export const ENTER_DESC = 'Enter description'

export const RECRUITMENT_LIST_ROUTE = '/hr/resource-requisition'

// Base API paths
const BASE_PATH = 'api/v1'
const HRCS_PATH = `${BASE_PATH}/hrcs`
const ORGANIZATION_PATH = `${BASE_PATH}/organization`
const DND_PATH = `${BASE_PATH}/dnd`
 
// HRCS sub-paths
const RESOURCE_REQUISITION_PATH = `${HRCS_PATH}/resource-requisition`
const RECRUITMENT_TYPE_PATH = `${HRCS_PATH}/type-of-recruitment`
const RESOURCE_REQUIRED_PATH = `${HRCS_PATH}/resource-required`
const ROLE_DEFINITION_PATH = `${HRCS_PATH}/role-definition`
 
// Organization sub-paths
const DEPARTMENT_PATH = `${ORGANIZATION_PATH}/department`
const USERS_PATH = `${ORGANIZATION_PATH}/users`
 
// DND sub-paths
const PRODUCT_PATH = `${DND_PATH}/product`
 
export const API_ENDPOINTS = {
  RECRUITMENT: {
    // Resource Requisition endpoints
    FETCH_ALL: `${RESOURCE_REQUISITION_PATH}/all`,
    FETCH_BY_ID: (id: string) => `${RESOURCE_REQUISITION_PATH}/${id}`,
    FETCH_ID: RESOURCE_REQUISITION_PATH,
   
    // Recruitment Type endpoints
    FETCH_RECRUITMENT_TYPES: `${RECRUITMENT_TYPE_PATH}/all?status=${NUMBERMAP.ONE}`,
   
    // Resource Required Type endpoints
    FETCH_RESOURCE_REQUIRED_TYPES: `${RESOURCE_REQUIRED_PATH}/all?status=${NUMBERMAP.ONE}`,
   
    // Role Definition endpoints
    FETCH_ROLES: `${ROLE_DEFINITION_PATH}/all?status=${NUMBERMAP.ONE}`,
   
    // Department endpoints
    FETCH_DEPARTMENTS: `${DEPARTMENT_PATH}/all?status=${NUMBERMAP.ONE}`,
   
    // User endpoints
    FETCH_USERS: (roleId: number) => `${USERS_PATH}/all?status=${NUMBERMAP.ONE}&role_id=${roleId}`,
   
    // Product endpoints
    FETCH_PRODUCT: `${PRODUCT_PATH}/all`,
  },
}

export const ONE = 1
export const ON_EDIT = '/hr/resource-requisition/'
export const USE_RECRUITMENT_TYPES = 'recruitmentTypes'
export const RESOURCE_REQUIRED_TYPES = 'resourceRequiredTypes'
export const RECRUITMENTS = 'recruitments'
export const RECRUITMENT_BY_ID = 'recruitment'
export const ROLES = 'roles'
export const DEPARTMENTS = 'departments'
export const USERS = 'users'
export const PRODUCT = 'products'
export const INACTIVE = 'Inactive'
export const SUCCESS_COLOR = 'success.main'
export const ERROR_MAIN = 'error.main'

export const TWO = 2
export const STATUS_WIDTH = 100
export const IS_NULL = 'ID is null'
export const CENTER = 'center'

export const COLUMFIELDCONFIG = {
  SNO: {
    FIELD: 'sno',
    HEADERNAME: 'S.No.',
    WIDTH: 100,
  },
  DESCRIPTION: {
    FIELD: 'description',
    HEADERNAME: 'Description',
    WIDTH: 250,
  },
  OPENINGS: {
    FIELD: 'number_of_openings',
    HEADERNAME: 'No. of Openings',
    WIDTH: 150,
  },
  ROLE: {
    FIELD: 'role',
    HEADERNAME: 'Role',
    WIDTH: 200,
  },
  ACTIONS: {
    FIELD: 'actions',
    HEADERNAME: 'Actions',
    WIDTH: 170,
  },
  DEPARTMENT :{
    HEADERNAME:'Department',
    FIELD:'department_name'
  }
}