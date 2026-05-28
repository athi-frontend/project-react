export const INSTALLATION_LIST_KEY = 'fetchInstallationList';

//FETCH_INSTALLATION_LIST
export const API_ENDPOINTS = {
  FETCH_INSTALLATION: (projectId: number) =>
    `api/v1/dnd/installation-procedures/all?project_id=${projectId}`,
  TOOLS: 'api/v1/dnd/design-tools-equipment/tools/all?status=1',
  EQUIPMENTS:'api/v1/dnd/design-tools-equipment/all?status=1',
  SKILL: 'api/v1/hrcs/skill/all',
  POST_INSTALLATION: 'api/v1/dnd/installation-procedures/',
GET_INSTALLATION: (id: number) =>
    `api/v1/dnd/installation-procedures/${id}`,
DELETE_RECORD: (id:number) =>
  `api/v1/dnd/installation-procedures/${id}`
}
export const EDIT_INSTALLATION_URL = (projectId: number, installationId: number) =>
  `/dnd/installation-proceture/form/${projectId}/?installation_procedure_id=${installationId}`;

export const OBJECT = 'object'
export const HEADER_SNO = 'S.No'
export const HEADER_STEP_NO = 'Step No'
export const HEADER_TYPE = 'Type'
export const HEADER_STATUS = 'Status'
export const HEADER_ACTIONS = 'Actions'
export const SNO_VALUE = 'sno'
export const STEP_NO_VALUE = 'step_counter'
export const TYPE_VALUE = 'type'
export const STATUS_VALUE = 'status'
export const ACTIONS_VALUE = 'id'
export const ACTIVE = 'Active'
export const INACTIVE = 'Inactive'
export const FORM_TITLE = 'Installation Procedure'
export const EDIT= 'Edit'

export const INSTALLATION_LIST_SCREEN = (projectId: number) => 
  `/dnd/installation-proceture/${projectId}`;
export const DELETE= 'Delete'
// export const INSTALLATION_LIST_SCREEN_URL='/dnd/installation-proceture/form/'
 // export const CREATE_PATH = '/dnd/installation-proceture/form/create'
export const CREATE_PATH = (projectId: number) => 
  `/dnd/installation-proceture/form/${projectId}`

export const CREATE_PATH_EDIT =(installation_procedure_id:number) =>
  `/dnd/installation-proceture/form/${installation_procedure_id}`


export const FORM_TITLE_INSTALLATION ='Installation Procedure'
export const TOOLS = 'fetchtools'
export const EQUIPMENT = 'fetechequipment'
export const SKILL = 'fetchskill'
export const POSTINSTILATION = 'postInstallation'
export const DELETE_INSTALLATION = 'deleteInstallation'
export const POST_INSTALLATION = 'postInstallation'
export const INSTALLATION_ID = 'installation_procedure_id'
export const EQUIPMENT_DROPDOWN = 'equipment'
export const SKILLS = 'skills'
export const TOOLS_DROPDOWN ='tools'
export const VALIDATIONS ={
  DESCRIPTIONS: 'Description is required',
  SKILLS: 'Skill Required is required',
  TYPE: 'Type is required',
  TOOLS: 'Tools Required is required',
  EQUIPMENT: 'Equipment Required is required',
  SAFETY: 'Safety and Precautions are required'
}
export const INPUT_ONCHANGE = {
  DESCRIPTIONS: 'description',
  SKILLS: 'skills',
  SAFETY:'safety_and_precautions',
  EQUIPMENT: 'equipment',
  TYPE: 'type',
  TOOLS: 'tools',
}
export const PLACEHOLDER ={
  DESCRIPTION: 'Enter the description',
  SKILLS: 'Select Skills',
  TYPE: 'Enter the type',
  TOOLS: 'Select tools',
  EQUIPMENT: 'Select equipment',
}
export const LABELS ={
SKILL_LABEL : 'Skill Required*',
SAFETY : 'Safety and Precautions*',
EQUIPMENT: 'Equipment Required*',
TOOLS: 'Tools Required*',
TYPE: 'Type*',
}
export const VALUE_FIELD = {
  EQUIPMENT: 'equipment_name',
  TOOLS: 'tool_name',
  SKILL : 'skill_name',
  SAFETY : '',
  TYPE: '',
}

export const ID_FIELD = {
  TOOLS: 'tool_id',
SKILL : 'skill_id',
SAFETY : '',
EQUIPMENT: 'equipment_id',
TYPE: '',
}

export const SAVE = 'Save'
export const CANCEL = 'Cancel'

export const FIELD_LABEL_MAP = {
  description: 'Description*',
  skills: 'Skill Required*',
  type: 'Type*',
  tools: 'Tools Required*',
  equipment: 'Equipment Required*',
  safety_and_precautions: 'Safety and Precautions*'
} as const

export const FIELD_ORDER = Object.keys(FIELD_LABEL_MAP)
