import { NUMBERMAP } from '@/constants/common'
import {
  AddSkillFormData,
  AddSkillFormErrors,
} from '@/types/modules/hr/roleDefinition'

export const FORM_LABELS = {
  ROLE: 'Role*',
  EMPLOYMENT_TYPE: 'Type of Employment*',
  DEPARTMENT: 'Department*',
  REPORTS_TO: 'Reports to*',
  EDUCATION: 'Educational Qualification*',
  EXPERIENCE: 'Experience*',
  JOB_RESPONSIBILITIES: 'Job Responsibilities*',
  EXPERTISE: 'Area of Expertise*',
  TRAINING: 'Training & Certifications*',
  ADDITIONAL_RESPONSIBILITY: 'Added Responsibility (if any)*',
  SKILL_NAME: 'Skill Name',
  LEVEL: 'Level',
}

export const FORM_PLACEHOLDERS = {
  ROLE: 'Select Role',
  EMPLOYMENT_TYPE: 'Select Type of Employment',
  DEPARTMENT: 'Select Department',
  REPORTS_TO: 'Select Reports to',
  EDUCATION: 'Enter Educational Qualification',
  EXPERIENCE: 'Enter Experience',
  JOB_RESPONSIBILITIES: 'Enter Job Resposibilites',
  EXPERTISE: 'Enter Area of Expertise',
  TRAINING: 'Enter Training & Certifications',
  ADDITIONAL_RESPONSIBILITY: 'Enter Added Responsibility',
  SKILL_NAME: 'Enter skill name',
  LEVEL: 'Select level',
}

export const FORM_FIELD_NAMES = {
  ROLE: 'role',
  EMPLOYMENT_TYPE: 'employmentType',
  DEPARTMENT: 'department',
  REPORTS_TO: 'reportsTo',
  EDUCATION: 'education',
  EXPERIENCE: 'experience',
  JOB_RESPONSIBILITIES: 'jobResponsibilities',
  EXPERTISE: 'expertise',
  TRAINING: 'training',
  ADDITIONAL_RESPONSIBILITY: 'additionalResponsibility',
  SKILL_NAME: 'skillName',
  SKILL_ID: 'skillId',
  LEVEL_NAME: 'levelName',
  LEVEL_ID: 'levelId',
}

export const SKILL_FORM_LABELS = {
  SKILL_LABEL: 'Skill Name*',
  LEVEL_LABLE: 'Level*',
}

export const SKILL_FORM_PLACEHOLDERS = {
  SKILL_PLACEHOLDER: 'Select Skill Name',
  LEVEL_PLACEHOLDER: 'Select Level',
}

export const SKILL_FORM_KEY_VALUE = {
  SKILL_ID: 'skill_id',
  SKILL_NAME: 'skill_name',
  SKILL_LEVEL_ID: 'skill_level_id',
  SKILL_LEVEL: 'skill_level',
}

export const BUTTON_LABELS = {
  SAVE: 'Save',
  CANCEL: 'Cancel',
  ADD_NEW: 'Add New',
}

export const BUTTON_VARIANTS = {
  CONTAINED: 'contained',
  OUTLINED: 'outlined',
}

export const CONTAINER_ID = 'HR_ROLE_DEFINITION'

export const SKILL_TABLE_COLUMNS = [
  {
    field: 'id',
    headerName: 'S.No.',
    flex: NUMBERMAP.HALF,
  },
  {
    field: 'skillName',
    headerName: 'Skill Name',
    flex: NUMBERMAP.ONE,
  },
  {
    field: 'level',
    headerName: 'Level',
    flex: NUMBERMAP.ONE,
  },
  {
    field: 'actions',
    headerName: 'Action',
    flex: NUMBERMAP.ONE,
  },
]

export const INITIAL_SKILL_FORM_DATA: AddSkillFormData = {
  skillId: 0,
  skillName: '',
  levelName: '',
  levelId: 0,
}

export const INITIAL_SKILL_ERRORS: AddSkillFormErrors = {
  skillId: '',
  levelId: '',
}

export const SKILL_FORM_REQUIRED_MESSAGES = {
  Skill: 'Skill Name is required',
  Level: 'Level is required',
}

export const EDUCATIONAL_QUALIFICATION_ERROR = 'Provide valid Educational Qualification'

export const TABLE_HEADERS = {
  SERIAL_NUMBER: 'S.No.',
  ROLE: 'Role',
  TYPE_OF_EMPLOYMENT: 'Type of Employment',
  STATUS: 'Status',
  ACTION: 'Actions',
} as const

export const TABLE_FIELDS = {
  COMPETENCY_SKILL_FIELD: 'competency_skill_id',
  ROLES_FIELD: 'role_name',
  TYPES_OF_EMPLOYMENT_FIELD: 'employment_type',
  STATUS_FIELD: 'status',
  ACTION_FIELD: 'actions',
}

export const ID_FIELD_LABEL = 'competency_skill_id'
export const PRIMARY_COLOR = 'primary'
export const COLOR_ERROR = 'error'
export const SIZE_SMALL = 'small'
export const DATA_TABLE_DELETE_CLASS = 'data-table-delete'
export const ROLE_DEF_ID = 'role_definition_id'
export const COMPETENCY_LIST = {
  TITLE: 'Competency Skill',
  COMPETENCY_LIST_API_ENDPOINTS: {
    FETCH_COMPETETENCY_LIST: 'api/v1/hrcs/role-definition/all',
    DELETE_COMPETENCY_SKILL: 'api/v1/magic-save/submit',
    FETCH_COMPETENCY_SKILL_BY_ROLE_ID: 'api/v1/hrcs/role-definition',
  },
  COMPETENCY_LIST_API_KEYS: {
    FETCH_COMPETENCY_SKILLS_KEY: 'fetchCompetencySkills',
    DELETE_COMPETENCY_SKILL_KEY: 'DeleteCompetencySkill',
  },
} as const

export const ROUTE_PATHS = {
  getCompetencyByRoleId: (roleId: string) => `/hr/role-definition/${roleId}`,
  createCompetency: '/hr/role-definition/create'
}
export const COMPETENCY_LIST_TITLE = 'Role Definition'
export const DATA_GRID_DELETE_CLASS = '.data-grid-delete'
export const DATA_SOURCE_NAME_SKILL = '[data-sourcename]'
export const ACTION_CLASS_NAME = '.action-buttons'
export const CONTAINER_ID_FOR_SKILL = 'HR_ROLE_DEFINITION'
export const CONTAINER_ID_SKILL ='HR_ROLE_DEFINITION_SKILL_SET'
export const UPDATE = 'update'

export const VALID_EMPLOYMENT_TYPES = ['1', '2', '3'] as const

export const STATUS_ACTIVE = 1
export const DELETE_DATA_GRID = '.data-grid-delete'
export const PATH_MAIN = '/hr/role-definition/create'
export const NUMBERCONST = 56
export const DATA_STATUS = 'data-status'
export const USER_HOOK = 'user'
export const ROLE_HOOK = 'roles'
export const DEPARTMENT_HOOK = 'department'
export const SKILL_HOOK = 'skills'
export const SKILL_LEVEL_HOOK = 'skillLevels'
export const SKILL_NAME = 'skillName'
export const SKILL_HEADER_NAME = 'Skill Name'
export const SKILL_HEADER_SNO = 'S.No.'
export const SKILL_HEADER_LEVEL = 'Level'
export const SKILL_FIELD_NAME = 'levelName'
export const SKILL_HEADER_ACTION = 'actions'
export const SKILL_FIELD_ACTION = 'Actions'
export const SKILL_TITLE_ADD = 'Add Role Definition'
export const SKILL_TITLE_EDIT = 'Edit Role Definition'
export const SUCCESS_COLOR = 'success.main'
export const ERROR_COLOR = 'error.main'
export const MAIN_RUOTE = '/hr/role-definition'

export const API_ENDPOINTS = {
  SKILL_ALL: 'api/v1/hrcs/skill/all?status=1',
  SKILL_LEVEL_ALL: 'api/v1/hrcs/skill-level/all?status=1',
}

export const DATA_SOURCE_NAMES = {
  COMPETENCY_SKILL: 'eqms_hr_role_definition',
  SKILL_LEVEL_MAPPER: 'eqms_hr_role_definition_skill_level_mapper',
} as const

export const DATA_FIELD_NAMES = {
  ROLES_LK_ID: 'fk_eqms_roles_lk_id',
  EMPLOYMENT_TYPE_LK_ID: 'fk_eqms_hr_employment_type_lk_id',
  ORGANIZATION_DEPARTMENT_ID: 'fk_eqms_organization_department_id',
  REPORTS_TO_ROLE_ID: 'fk_eqms_reports_to_role_id',
  EDUCATIONAL_QUALIFICATION: 'educational_qualification',
  EXPERIENCE: 'experience',
  JOB_RESPONSIBILITIES: 'job_responsibilities',
  AREA_OF_EXPERTISE: 'area_of_expertise',
  TRAINING_AND_CERTIFICATIONS: 'training_and_certifications_details',
  ADDITIONAL_RESPONSIBILITY: 'additional_responsibility',
  TENANT_KEY: 'eqms_tenant_key',
  ORGANIZATION_ID: 'fk_eqms_organization_id',
  STATUS: 'status',
  COMPETENCY_SKILL_ID: 'fk_eqms_hr_role_definition_id',
  SKILL_MASTER_ID: 'fk_eqms_hr_skill_master_id',
  SKILL_LEVEL_LK_ID: 'fk_eqms_hr_skill_level_lk_id',
} as const

export const TABLE_COLUMNS = ['id', 'skillName', 'level', 'actions'] as const

export const FORM_HEADERS = {
  ROLE: 'Role',
  EMPLOYMENT_TYPE: 'Type of Employment',
  DEPARTMENT: 'Department',
  REPORTS_TO: 'Reports To',
  EDUCATION: 'Educational Qualification',
  EXPERIENCE: 'Experience',
  JOB_RESPONSIBILITIES: 'Job Responsibilities',
  EXPERTISE: 'Area of Expertise',
  TRAINING: 'Training & Certifications',
  ADDITIONAL_RESPONSIBILITY: 'Added Responsibility',
} as const
export const ID = 'id'
export const NAME = 'name'
export const EMPLOYMENT_ID = 'type_of_employment_id'
export const ROLE_DEFINITION_ID = 'role_definition_id'
export const ROLE_ID = 'role_id'
export const ROLE_NAME = 'role_name'  
export const EMPLOYMENT_TYPE = 'employment_type'
export const STATUS= 'status'
export const CREATE = 'create'  
export const SKILL_SET_ERR = 'A Minimum of One Skill is Needed'
export const AT_LEAST_ONE_SKILL_REQUIRED = 'At least one skill is required'
export const ALERT_MESSAGES = {
  DUPLICATE_ROLE_DEFINITION: {
    title: 'Duplicate Entry',
    text: 'Role definition is already defined',
    icon: 'error',
    cancelButton: false,
    confirmButton: false,
  },
};
export const CUSTOM_ALERT = 'customAlert'
export const ID_NUMBER = 'id'
export const S_NO = 'sno'
export const TEXT_DATA = 'text'
export const TRUE_VALUE = 'true'
export const NUMBER = 'number'
export const SKILL_POPUP_TITLES = {
  EDIT: 'Edit Skill',
  ADD: 'Add Skill',
};
export const ALERT_TEXT={
  ALERT_TITLE: 'Something Went Wrong!',
  TEXT_CONSTANT: 'An unexpected error occurred while deleting the skill',
  ERROR_ICON: 'error'
}
