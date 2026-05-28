/**
 * Classification : Confidential
 **/

// Error Messages
export const ERROR_MESSAGES = {
  SKILL_SET_REQUIRED: "Skill Set Required is required",
  INFRASTRUCTURE_CATEGORY_REQUIRED: "Infrastructure Category is required",
  INFRASTRUCTURE_TYPE_REQUIRED: "Infrastructure Type is required",
  STATUS_REQUIRED: "Status is required",
  TOOL_TYPE_REQUIRED: "Tool Type is required",
  TOOLS_REQUIRED: "Tools Required is required",
  EQUIPMENT_REQUIRED: "Equipment Required is required",
  EQUIPMENT_TYPE_REQUIRED: "Equipment Type is required",
  MAINTENANCE_PLAN_REQUIRED: "Maintenance Plan is required",
  MAINTENANCE_DESCRIPTION_REQUIRED: "Maintenance Description is required",
  RESPONSIBLE_PERSON_REQUIRED: "Responsible person is required",
  FREQUENCY_REQUIRED: "Frequency is required",
} as const;

// Base URL for infrastructure management APIs
const INFRASTRUCTURE_BASE_URL = 'api/v1/infrastructure'; 

// API Endpoints
export const API_ENDPOINTS = {
  FETCH_MAINTENANCE_PLAN_LIST: `${INFRASTRUCTURE_BASE_URL}/maintenance-plan/all`,
  FETCH_MAINTENANCE_PLAN_BY_ID: (maintenance_id: number) =>
    `${INFRASTRUCTURE_BASE_URL}/maintenance-plan/${maintenance_id}`,
  POST_MAINTENANCE_PLAN: `${INFRASTRUCTURE_BASE_URL}/maintenance-plan/`,
  DELETE_MAINTENANCE_PLAN: (maintenance_id: number) =>
    `${INFRASTRUCTURE_BASE_URL}/maintenance-plan/${maintenance_id}`,
  FETCH_SERVICE_TYPES: `${INFRASTRUCTURE_BASE_URL}/service-type/all`,
  FETCH_FREQUENCY: `${INFRASTRUCTURE_BASE_URL}/frequency/all`,
  FETCH_INFRASTRUCTURE_CATEGORY: `${INFRASTRUCTURE_BASE_URL}/category/all`,
  FETCH_INFRASTRUCTURE_TYPE: `${INFRASTRUCTURE_BASE_URL}/type/all`,
};

// Query Keys
export const FETCH_MAINTENANCE_PLAN_LIST_KEY = 'fetchMaintenancePlanList';
export const FETCH_MAINTENANCE_PLAN_BY_ID_KEY = 'fetchMaintenancePlanById';
export const POST_MAINTENANCE_PLAN_KEY = 'postMaintenancePlan';
export const FETCH_SERVICE_TYPES_KEY = 'fetchServiceTypes';
export const FETCH_FREQUENCY_KEY = 'fetchFrequency';
export const FETCH_INFRASTRUCTURE_CATEGORY_KEY = 'fetchInfrastructureCategory';
export const FETCH_INFRASTRUCTURE_TYPE_KEY = 'fetchInfrastructureType';
export const FETCH_SKILL_SET_KEY = 'fetchSkillSet';

// Entity Types
export const ENTITY_TYPES = {
  TOOL: "tool",
  EQUIPMENT: "equipment",
  MAINTENANCE_PLAN: "maintenancePlan",
} as const;

// Paths
export const CREATE_MAINTENANCE_PLAN_PATH = '/infrastructure-management/maintenance-plan/create'
export const EDIT_MAINTENANCE_PLAN_PATH = (maintenance_id: number) =>
  `/infrastructure-management/maintenance-plan/${maintenance_id}`
export const MAINTENANCE_PLAN_LIST_PATH = '/infrastructure-management/maintenance-plan'

// Route Identifiers
export const ROUTE_IDENTIFIERS = {
  ADD: 'add',
  CREATE: 'create',
} as const

// Table Field Names
export const TABLE_FIELDS = {
  SNO: "sno",
  INFRA_CATEGORY: "infra_category",
  INFRA_TYPE: "infra_type",
  STATUS: "status",
  ACTION: "action",
} as const;

// Table Header Names
export const TABLE_HEADERS = {
  SNO: "S.No.",
  INFRA_CATEGORY: "Infrastructure Category",
  INFRA_TYPE: "Infrastructure Type",
  STATUS: "Status",
  ACTION: "Actions",
} as const;

// Table Configuration
export const TABLE_ID_FIELD = "maintenance_id";
export const TABLE_TITLE = "Maintenance Plan";

// Form Field Names (for DataGrid columns)
export const FORM_FIELDS = {
  SERIAL_NO: "serialNo",
  TOOL_TYPE: "toolType",
  EQUIPMENT_TYPE: "equipmentType",
  MAINTENANCE_DESCRIPTION: "maintenanceDescription",
  TO_BE_DONE_BY: "toBeDoneBy",
  FREQUENCY: "frequency",
  STATUS: "status",
  ACTIONS: "actions",
} as const;

// Form Header Names (for DataGrid columns)
export const FORM_HEADERS = {
  SERIAL_NO: "S.No.",
  TOOL_TYPE: "Tool Type",
  EQUIPMENT_TYPE: "Equipment Type",
  MAINTENANCE_DESCRIPTION: "Maintenance Description",
  TO_BE_DONE_BY: "To be Done by",
  FREQUENCY: "Frequency",
  STATUS: "Status",
  ACTIONS: "Actions",
} as const;

// Form Labels
export const FORM_LABELS = {
  MAINTENANCE_PLAN: "Maintenance Plan",
  INFRASTRUCTURE_CATEGORY: "Infrastructure Category*",
  INFRASTRUCTURE_TYPE: "Infrastructure Type*",
  STATUS: "Status*",
  TOOL_TYPE: "Tool Type*",
  SKILL_SET_REQUIRED: "Skill Set Required*",
  EQUIPMENT_TYPE: "Equipment Type*",
  MAINTENANCE_DESCRIPTION: "Maintenance Description*",
  TO_BE_DONE_BY: "To be Done By*",
  FREQUENCY: "Frequency*",
} as const;

// Form Titles (for sections and modals)
export const FORM_TITLES = {
  MAINTENANCE_PLAN: "Maintenance Plan",
  TOOLS_REQUIRED: "Tools Required",
  EQUIPMENT_REQUIRED: "Equipment Required",
  EDIT_TOOLS_REQUIRED: "Edit Tools Required",
  ADD_TOOLS_REQUIRED: "Add Tools Required",
  EDIT_EQUIPMENT: "Edit Equipment",
  ADD_EQUIPMENT: "Add Equipment",
  EDIT_MAINTENANCE_PLAN: "Edit Maintenance Plan",
  ADD_MAINTENANCE_PLAN: "Add Maintenance Plan",
} as const;

// Form Placeholders
export const FORM_PLACEHOLDERS = {
  SELECT_INFRASTRUCTURE_CATEGORY: "Select Infrastructure Category",
  SELECT_INFRASTRUCTURE_TYPE: "Select Infrastructure Type",
  SELECT_STATUS: "Select Status",
  SELECT_TOOL_CATEGORY: "Select Tool Category",
  SELECT_SKILLS: "Select skills",
  SELECT_EQUIPMENT_TYPE: "Select Equipment Type",
  ENTER_MAINTENANCE_DESCRIPTION: "Enter Maintenance Description",
  SELECT_RESPONSIBLE_PERSON: "Select Responsible Person",
  SELECT_FREQUENCY: "Select Frequency",
} as const;

// Form Key Fields (for dropdowns)
export const FORM_KEY_FIELDS = {
  INFRASTRUCTURE_CATEGORY_ID: "infrastructure_category_id",
  INFRASTRUCTURE_TYPE_ID: "infrastructure_type_id",
  STATUS_ID: "status_id",
  TOOL_ID: "tool_id",
  SKILL_ID: "skill_id",
  EQUIPMENT_ID: "equipment_id",
} as const;

// Form Value Fields (for dropdowns)
export const FORM_VALUE_FIELDS = {
  INFRASTRUCTURE_CATEGORY_NAME: "infrastructure_category_name",
  INFRASTRUCTURE_TYPE_NAME: "infrastructure_type_name",
  STATUS_NAME: "status_name",
  TOOL_NAME: "tool_name",
  SKILL_NAME: "skill_name",
  EQUIPMENT_NAME: "equipment_name",
  MAINTENANCE_SERVICE_TYPE: "maintenance_service_type",
  FREQUENCY_NAME: "frequency_name",
} as const;

// Form ID Fields (for DataGrid tables)
export const FORM_ID_FIELD = "id";

// Form Button Labels
export const FORM_BUTTON_LABELS = {
  CANCEL: "Cancel",
  SAVE: "Save",
} as const;

// Form Default Values
export const FORM_DEFAULT_VALUES = {
  INFRASTRUCTURE_CATEGORY: "Infrastructure Category",
  INFRASTRUCTURE_TYPE: "Infrastructure Type",
} as const;

// Form Initial Error State
export const INITIAL_ERROR_STATE = {
  skillSetRequired: "",
  infrastructureCategory: "",
  infrastructureType: "",
  status: "",
  toolsRequired: "",
  equipmentRequired: "",
  maintenancePlan: "",
};

// Context type for draft save
export const CONTEXT_TYPE = {
  MAINTENANCE_PLAN: 'maintenance_plan',
} as const;

