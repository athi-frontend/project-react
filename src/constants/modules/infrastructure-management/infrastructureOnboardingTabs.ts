/**
 * Classification : Confidential
 * 
 * Consolidated constants for Infrastructure Onboarding
 * This file contains all constants for:
 * - Grid: Infrastructure Onboarding List Page
 * - Tab 1: Infrastructure Onboarding (Infrastructure Request Form)
 * - Tab 2: Installation Report
 * - Tab 3: Infrastructure Qualification Checklist
 * - Tab 4: Maintenance Plan
 **/

import { InfrastructureFormData } from "@/types/modules/infrastructure-management/infrastructureOnboardingTabs"
import { NUMBERMAP } from '@/constants/common'
import { stripHtml } from "@/lib/utils/common"

// Base URL for infrastructure management APIs
const INFRASTRUCTURE_BASE_URL = 'api/v1/infrastructure'
const INFRASTRUCTURE_API_BASE_URL = '/api/v1/infrastructure/'
const INFRASTRUCTURE_ONBOARDING_END_URL = 'infrastructure-onboarding/'

// ============================================================================
// GRID: INFRASTRUCTURE ONBOARDING LIST PAGE CONSTANTS
// ============================================================================

export const INFRASTRUCTURE_ONBOARDING_CONSTANTS = {
  TITLE: 'Infrastructure Onboarding',
  DATATABLE_IDFIELD: 'infrastructure_id',
  TABLE_COLUMNS: {
    SNO: {
      field: 'sno',
      headerName: 'S.No.',
      flex: NUMBERMAP.HALF,
    },
    INFRASTRUCTURE_CATEGORY: {
      field: 'infrastructure_category_name',
      headerName: 'Infrastructure Category',
      flex: NUMBERMAP.ONE_HALF,
    },
    INFRASTRUCTURE_TYPE: {
      field: 'infrastructure_type_name',
      headerName: 'Infrastructure Type',
      flex: NUMBERMAP.ONE_HALF,
    },
    INFRASTRUCTURE_NAME: {
      field: 'infrastructure_name',
      headerName: 'Infrastructure Name',
      flex: NUMBERMAP.ONE_HALF,
    },
    INFRASTRUCTURE_SERIAL_NO: {
      field: 'infrastructure_serial_number',
      headerName: 'Infrastructure Serial No.',
      flex: NUMBERMAP.ONE_HALF,
    },
    STATUS: {
      field: 'status_id',
      headerName: 'Status',
      flex: NUMBERMAP.ONE,
    },
    ACTIONS: {
      field: 'action',
      headerName: 'Actions',
      flex: NUMBERMAP.ONE,
    },
  },
}

export const INFRASTRUCTURE_ONBOARDING_API_ENDPOINTS = {
  GET_ALL: `${INFRASTRUCTURE_API_BASE_URL}${INFRASTRUCTURE_ONBOARDING_END_URL}all`,
  GET_BY_ID: (infrastructureId: number) =>
    `${INFRASTRUCTURE_API_BASE_URL}${INFRASTRUCTURE_ONBOARDING_END_URL}${infrastructureId}`,
  DELETE: (infrastructureId: number) =>
    `${INFRASTRUCTURE_API_BASE_URL}${INFRASTRUCTURE_ONBOARDING_END_URL}${infrastructureId}`,
}

export const INFRASTRUCTURE_ONBOARDING_QUERY_KEYS = {
  LIST: 'infrastructure-onboarding-list',
  FETCH_BY_ID: 'infrastructure-onboarding-by-id',
}

export const INFRASTRUCTURE_ONBOARDING_ROUTES = {
  CREATE: '/infrastructure-management/infrastructure-onboarding/create',
  EDIT: (id: number) => `/infrastructure-management/infrastructure-onboarding/${id}`,
}

// ============================================================================
// TAB 1: INFRASTRUCTURE ONBOARDING (INFRASTRUCTURE REQUEST FORM) CONSTANTS
// ============================================================================

// API Endpoints
export const API_ENDPOINTS = {
  FETCH_POWER_SUPPLY: (status?: number) => {
    const baseUrl = `${INFRASTRUCTURE_BASE_URL}/power-supply/all`;
    return status ? `${baseUrl}?status=${status}` : baseUrl;
  },
  FETCH_INFRASTRUCTURE_ONBOARDING_BY_ID: (infrastructureId: number) => {
    return `${INFRASTRUCTURE_BASE_URL}/infrastructure-onboarding/${infrastructureId}`;
  },
  SAVE_INFRASTRUCTURE_ONBOARDING: () => {
    return `${INFRASTRUCTURE_BASE_URL}/infrastructure-onboarding/`;
  },
  FETCH_PURCHASE_ORDERS: () => {
    return `api/v1/vendor-purchase/purchase-order/all`;
  },
  FETCH_PURCHASE_ORDER_DETAILS: (purchaseOrderId: string | number) => {
    return `api/v1/vendor-purchase/purchase-order/${purchaseOrderId}`;
  },
}

// Query Keys
export const FETCH_POWER_SUPPLY = 'fetchPowerSupply';
export const FETCH_INFRASTRUCTURE_ONBOARDING_BY_ID = 'fetchInfrastructureOnboardingById';
export const FETCH_PURCHASE_ORDERS = 'fetchPurchaseOrders';
export const FETCH_PURCHASE_ORDER_DETAILS = 'fetchPurchaseOrderDetails';

// Error Messages
export const ERROR_MESSAGES = {
  PURCHASE_ORDER_NUMBER_REQUIRED: "Purchase Order Number is required",
  INFRASTRUCTURE_CATEGORY_REQUIRED: "Infrastructure Category is required",
  INFRASTRUCTURE_TYPE_REQUIRED: "Infrastructure Type is required",
  INFRASTRUCTURE_NAME_REQUIRED: "Infrastructure Name is required",
  MODEL_NUMBER_REQUIRED: "Model Number is required",
  SERIAL_NUMBER_REQUIRED: "Serial Number is required",
  DEPARTMENT_REQUIRED: "Department / Function Name is required",
  PRODUCT_DESCRIPTION_REQUIRED: "Product Description is required",
  POWER_SUPPLY_REQUIRED: "Power Supply selection is required",
  INSTALLATION_PROCEDURE_REQUIRED: "Please specify if an installation procedure is available",
  PROCESS_EQUIPMENT_REQUIRED: "Please specify if the process equipment is available",
  MAINTENANCE_START_DATE_REQUIRED: "Maintenance Start Date is required",
  NOTIFICATION_REQUIRED: "Notification preference is required",
  STATUS_REQUIRED: "Status selection is required",
  UPLOAD_IMAGE_REQUIRED: "Upload Image is required",
  UPLOAD_DOCUMENT_REQUIRED: "Upload Document is required",
} as const;

// Initial Form Data
export const INITIAL_FORM_DATA: InfrastructureFormData = {
  purchaseOrderNumber: "",
  infrastructureCategory: "",
  infrastructureType: "",
  infrastructureName: "",
  modelNo: "",
  serialNo: "",
  departmentFunction: "",
  productDescription: "",
  powerSupply: "",
  installationProcedure: "",
  processEquipment: "",
  maintenanceStartDate: "",
  setNotifications: "",
  status: "",
  uploadImage: [],
  uploadDocument: [],
};

// Initial Errors
export const INITIAL_ERRORS = {
  purchaseOrderNumber: "",
  infrastructureCategory: "",
  infrastructureType: "",
  infrastructureName: "",
  modelNo: "",
  serialNo: "",
  departmentFunction: "",
  productDescription: "",
  powerSupply: "",
  installationProcedure: "",
  processEquipment: "",
  maintenanceStartDate: "",
  setNotifications: "",
  status: "",
  uploadImage: "",
  uploadDocument: "",
};

// API Field Names
export const API_FIELD_NAMES = {
  INFRASTRUCTURE_ID: "infrastructure_id",
  PURCHASE_ORDER_NUMBER_ID: "purchase_order_number_id",
  INFRASTRUCTURE_CATEGORY_ID: "infrastructure_category_id",
  INFRASTRUCTURE_TYPE_ID: "infrastructure_type_id",
  NAME_OF_INFRASTRUCTURE: "name_of_infrastructure",
  MODEL_NO_ID: "model_no_id",
  SERIAL_NO: "serial_no",
  DEPARTMENT_FUNCTION_ID: "department_function_id",
  DESCRIPTION_OF_PRODUCT: "description_of_product",
  POWER_SUPPLY_ID: "power_supply_id",
  INSTALLATION_PROCEDURE_AVAILABLE: "installation_procedure_available",
  PROCESS_EQUIPMENT: "process_equipment",
  MAINTENANCE_START_DATE: "maintenance_start_date",
  SET_NOTIFICATION_ID: "set_notification_id",
  STATUS: "status",
  DOCUMENTS_TO_CREATE: "documents_to_create",
  CREATE_META_DATA: "create_meta_data",
  DOCUMENTS_TO_DELETE: "documents_to_delete",
  UPDATE_META_DATA: "update_meta_data",
} as const;

// Form Labels
export const FORM_LABELS = {
  INFRASTRUCTURE_REQUEST_DETAILS: "Infrastructure Request Details",
  PURCHASE_ORDER_NUMBER: "Purchase Order Number",
  INFRASTRUCTURE_CATEGORY: "Infrastructure Category*",
  INFRASTRUCTURE_TYPE: "Infrastructure Type*",
  NAME_OF_INFRASTRUCTURE: "Name of the Infrastructure*",
  MODEL_NO: "Model No.*",
  SERIAL_NO: "Serial No.*",
  DEPARTMENT_FUNCTION_NAME: "Department / Function Name*",
  DESCRIPTION_OF_PRODUCT: "Description of the product*",
  POWER_SUPPLY: "Power Supply",
  INSTALLATION_PROCEDURE_AVAILABLE: "Is Installation procedure available",
  PROCESS_EQUIPMENT: "Process Equipment",
  MAINTENANCE_START_DATE: "Maintenance Start Date*",
  SET_NOTIFICATIONS: "Set Notifications",
  STATUS: "Status*",
  UPLOAD_IMAGE: "Upload Image*",
  UPLOAD_DOCUMENT: "Upload Document*",
  INFRASTRUCTURE_DETAILS: "Infrastructure Details",
} as const;

// Form Placeholders
export const FORM_PLACEHOLDERS = {
  SELECT_PURCHASE_ORDER_NUMBER: "Select Purchase Order Number",
  SELECT_INFRASTRUCTURE_CATEGORY: "Select Infrastructure Category",
  SELECT_INFRASTRUCTURE_TYPE: "Select Infrastructure Type",
  ENTER_NAME_OF_INFRASTRUCTURE: "Enter Name of the Infrastructure",
  SELECT_MODEL_NO: "Select Model No.*",
  ENTER_SERIAL_NO: "Enter Serial No.",
  SELECT_DEPARTMENT_FUNCTION_NAME: "Select Department / Function Name",
  INPUT_TEXT: "Input Text",
  SELECT_POWER_SUPPLY: "Select Power Supply",
  SELECT_SET_NOTIFICATIONS: "Select Set Notifications",
  SELECT_STATUS: "Select Status",
} as const;

// Form Field Keys
export const FORM_FIELD_KEYS = {
  PURCHASE_ORDER_ID: "purchase_order_id",
  PURCHASE_ORDER_NUMBER: "purchase_order_number",
  INFRASTRUCTURE_CATEGORY_ID: "infrastructure_category_id",
  INFRASTRUCTURE_CATEGORY_NAME: "infrastructure_category_name",
  INFRASTRUCTURE_TYPE_ID: "infrastructure_type_id",
  INFRASTRUCTURE_TYPE_NAME: "infrastructure_type_name",
  KEY: "infrastructure_detail_id",
  VALUE: "model_no",
  DEPARTMENT_ID: "department_id",
  DEPARTMENT_NAME: "department_name",
  ID: "id",
  POWER_SUPPLY_NAME: "power_supply_name",
  STATUS_ID: "status_id",
  STATUS_NAME: "status_name",
  FREQUENCY_NAME: "frequency_name",
  INFRASTRUCTURE_CATEGORY: "infrastructure_category",
  INFRASTRUCTURE_TYPE: "infrastructure_type",
} as const;

// Form Field Names (for component name props)
export const FORM_FIELD_NAMES = {
  INSTALLATION_PROCEDURE: "installationProcedure",
  PROCESS_EQUIPMENT: "processEquipment",
} as const;

// Radio Options
export const RADIO_OPTIONS = {
  YES: "yes",
  NO: "no",
  YES_LABEL: "Yes",
  NO_LABEL: "No",
} as const;

// File Upload Constants
export const FILE_UPLOAD = {
  IMAGE: "image",
  DOCUMENT: "document",
  IMAGE_ALLOWED_TYPES: "image/*",
  DOCUMENT_ALLOWED_TYPES: [".pdf", ".doc", ".docx", ".xls", ".xlsx"],
  SUPPORTED_FORMATS: "PDF, DOC, DOCX, XLS, XLSX",
} as const;

// Button Labels
export const BUTTON_LABELS = {
  CANCEL: "Cancel",
  SAVE: "Save",
} as const;

// Route Paths
export const ROUTE_PATHS = {
  INFRA_ONBOARDING: "/infrastructure-management/infrastructure-onboarding",
} as const;

// Page Constants
export const INFRASTRUCTURE_ONBOARDING_PAGE_CONSTANTS = {
  TITLE: 'Infrastructure Onboarding',
  ARIA_LABEL: 'infrastructure onboarding tabs',
  TAB_LABELS: {
    INFRASTRUCTURE_ONBOARDING: 'Infrastructure Onboarding',
    INSTALLATION_REPORT: 'Installation Report',
    INFRASTRUCTURE_QUALIFICATION_CHECKLIST: 'Infrastructure Qualification Checklist',
    MAINTENANCE_PLAN: 'Maintenance Plan',
  },
} as const

// ============================================================================
// TAB 2: INSTALLATION REPORT CONSTANTS
// ============================================================================

export const INSTALLATION_REPORT_API_ENDPOINTS = {
  FETCH_BY_ID: (infrastructureId: number) =>
    `${INFRASTRUCTURE_BASE_URL}/installation-report/${infrastructureId}`,
  UPSERT: `${INFRASTRUCTURE_BASE_URL}/installation-report/`,
  GET_SERVICE_TYPES: `${INFRASTRUCTURE_BASE_URL}/service-type/all?status=${NUMBERMAP.ONE}`,
}

export const INSTALLATION_REPORT_FIELD_KEYS = {
  INFRASTRUCTURE_ID: 'infrastructure_id',
  DATE_OF_INSTALLATION: 'date_of_installation',
  INSTALLED_BY_ID: 'installed_by_id',
  DATE_OF_RECEIPT: 'date_of_receipt',
  LOCATION: 'location',
  STATUS: 'status',
  DOCUMENTS_TO_CREATE: 'documents_to_create',
  CREATE_META_DATA: 'create_meta_data',
  UPDATE_META_DATA: 'update_meta_data',
  DOCUMENTS_TO_DELETE: 'documents_to_delete',
} as const

export const INSTALLATION_REPORT_ERROR_MESSAGES = {
  DATE_OF_INSTALLATION_REQUIRED: 'Date of Installation is required',
  INSTALLED_BY_REQUIRED: 'Installed By is required',
  DATE_OF_RECEIPT_REQUIRED: 'Date of Receipt is required',
  LOCATION_REQUIRED: 'Location is required',
  UPLOAD_REQUIRED: 'Upload is required',
  FILE_UPLOAD_REQUIRED: 'File/documents are required',
} as const

export const INSTALLATION_REPORT_QUERY_KEYS = {
  INSTALLATION_REPORT_FETCH: 'installationReportFetch',
  SERVICE_TYPES: 'serviceTypes',
} as const

export const INSTALLATION_REPORT_LABELS = {
  INSTALLATION_REPORT: 'Installation Report',
  INFRASTRUCTURE_NAME: 'Infrastructure Name',
  SERIAL_NO: 'Serial No.',
  MANUFACTURER: 'Manufacturer',
  SUPPLIER: 'Supplier',
  PO_NO: 'PO No.',
  PO_DATE: 'PO Date',
  INVOICE_NO: 'Invoice No.',
  INVOICE_DATE: 'Invoice Date',
  MODEL_NO: 'Model No.',
  FUNCTION: 'Function',
  DATE_OF_INSTALLATION: 'Date of Installation*',
  INSTALLED_BY: 'Installed By*',
  DATE_OF_RECEIPT: 'Date of Receipt*',
  LOCATION: 'Location*',
  UPLOAD: 'Upload Document*',
  SELECT_INSTALLED_BY: 'Select Installed By',
  ENTER_LOCATION: 'Enter Location',
  CANCEL: 'Cancel',
  SAVE: 'Save',
} as const

export const INSTALLATION_REPORT_INITIAL_FORM_DATA = {
  infrastructure_id: null,
  date_of_installation: '',
  installed_by_id: null,
  date_of_receipt: '',
  location: '',
  status: null,
  documents: [],
} as const

export const INSTALLATION_REPORT_INITIAL_ERRORS = {
  date_of_installation: '',
  installed_by_id: '',
  date_of_receipt: '',
  location: '',
  upload: '',
  fileUpload:''
} as const

export const INSTALLATION_REPORT_ROUTES = {
  GRID_PAGE: '/infrastructure-management/infrastructure-onboarding',
} as const

export const INSTALLATION_REPORT_DROPDOWN_FIELDS = {
  INSTALLED_BY: {
    KEY_FIELD: 'id',
    VALUE_FIELD: 'maintenance_service_type',
  },
} as const

// ============================================================================
// TAB 3: INFRASTRUCTURE QUALIFICATION CHECKLIST CONSTANTS
// ============================================================================

export const QUALIFICATION_CHECKLIST_API_ENDPOINTS = {
  FETCH_BY_ID: (infrastructureId: number) => 
    `${INFRASTRUCTURE_BASE_URL}/qualification-checklist/${infrastructureId}`,
  UPSERT: `${INFRASTRUCTURE_BASE_URL}/qualification-checklist/`,
} as const

export const QUALIFICATION_CHECKLIST_QUERY_KEYS = {
  QUALIFICATION_CHECKLIST: 'qualificationChecklist',
  QUALIFICATION_CHECKLIST_BY_ID: (infrastructureId: number) => 
    ['qualificationChecklist', infrastructureId],
} as const

export const QUALIFICATION_CHECKLIST_LABELS = {
  TITLE: 'Infrastructure Qualification Checklist',
  EDIT_TITLE: 'Edit Infrastructure Qualification Checklist',
  ADD_TITLE: 'Add Infrastructure Qualification Checklist',
  SNO: 'S.No.',
  TEST_PERFORMED: 'Test Performed',
  ACCEPTANCE_CRITERIA: 'Acceptance Criteria',
  STATUS: 'Status',
  ACTIONS: 'Actions',
} as const

export const QUALIFICATION_CHECKLIST_ERROR_MESSAGES = {
  TEST_PERFORMED_REQUIRED: 'Test Performed is required',
  ACCEPTANCE_CRITERIA_REQUIRED: 'Acceptance Criteria is required',
  STATUS_REQUIRED: 'Status is required',
  INFRASTRUCTURE_ID_REQUIRED: 'Infrastructure ID is required',
  CHECKLIST_ITEMS_REQUIRED : 'Qualification Checklist Items are required',
} as const

export const QUALIFICATION_CHECKLIST_TABLE_COLUMNS = {
  SNO: {
    field: 'sno',
    headerName: QUALIFICATION_CHECKLIST_LABELS.SNO,
    flex: NUMBERMAP.HALF,
  },
  TEST_PERFORMED: {
    field: 'test_performed',
    headerName: QUALIFICATION_CHECKLIST_LABELS.TEST_PERFORMED,
    flex: NUMBERMAP.ONE_HALF,
  },
  ACCEPTANCE_CRITERIA: {
    field: 'rich_text-acceptance_criteria',
    headerName: QUALIFICATION_CHECKLIST_LABELS.ACCEPTANCE_CRITERIA,
    valueGetter: (value, row) => {
      return stripHtml(row['acceptance_criteria'])
    },
    renderCell: (params: any) => (
      stripHtml(params.row.acceptance_criteria)
    ),
    flex: NUMBERMAP.ONE_HALF,
  },
  STATUS: {
    field: 'status_name',
    headerName: QUALIFICATION_CHECKLIST_LABELS.STATUS,
    flex: NUMBERMAP.ONE,
  },
  ACTIONS: {
    field: 'action',
    headerName: QUALIFICATION_CHECKLIST_LABELS.ACTIONS,
    flex: NUMBERMAP.ONE,
  },
} as const

export const QUALIFICATION_CHECKLIST_FIELD_NAMES = {
  QUALIFICATION_CHECKLIST_ITEMS_ID: 'qualification_checklist_items_id',
  STATUS_ID: 'status_id',
  STATUS_NAME: 'status_name',
  TEST_PERFORMED: 'testPerformed',
  ACCEPTANCE_CRITERIA: 'acceptanceCriteria',
  STATUS_ID_FIELD: 'status_id',
} as const

export const QUALIFICATION_CHECKLIST_UI_STRINGS = {
  TEST_PERFORMED_LABEL: 'Test Performed*',
  TEST_PERFORMED_PLACEHOLDER: 'Enter Test Performed',
  ACCEPTANCE_CRITERIA_LABEL: 'Acceptance Criteria*',
  ACCEPTANCE_CRITERIA_PLACEHOLDER: 'Enter Acceptance Criteria',
  STATUS_LABEL: 'Status*',
  STATUS_PLACEHOLDER: 'Select Status',
} as const

export const QUALIFICATION_CHECKLIST_PATHS = {
  DEFAULT_PATH: '#',
} as const

// ============================================================================
// TAB 4: MAINTENANCE PLAN CONSTANTS
// ============================================================================

export const MAINTENANCE_PLAN_ERROR_MESSAGES = {
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
} as const

export const MAINTENANCE_PLAN_API_ENDPOINTS = {
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
}

export const INFRASTRUCTURE_ONBOARDING_MAINTENANCE_PLAN_API_ENDPOINTS = {
  FETCH_MAINTENANCE_PLAN_BY_ID: (infrastructure_id: number) =>
    `${INFRASTRUCTURE_BASE_URL}/infrastructure-maintenance-plan/${infrastructure_id}`,
  POST_MAINTENANCE_PLAN: () =>
    `${INFRASTRUCTURE_BASE_URL}/infrastructure-maintenance-plan/`,
}

export const MAINTENANCE_PLAN_QUERY_KEYS = {
  FETCH_MAINTENANCE_PLAN_LIST_KEY: 'fetchMaintenancePlanList',
  FETCH_MAINTENANCE_PLAN_BY_ID_KEY: 'fetchMaintenancePlanById',
  POST_MAINTENANCE_PLAN_KEY: 'postMaintenancePlan',
  FETCH_SERVICE_TYPES_KEY: 'fetchServiceTypes',
  FETCH_FREQUENCY_KEY: 'fetchFrequency',
  FETCH_INFRASTRUCTURE_CATEGORY_KEY: 'fetchInfrastructureCategory',
  FETCH_INFRASTRUCTURE_TYPE_KEY: 'fetchInfrastructureType',
  FETCH_SKILL_SET_KEY: 'fetchSkillSet',
  FETCH_INFRASTRUCTURE_ONBOARDING_MAINTENANCE_PLAN_BY_ID_KEY: 'fetchInfrastructureOnboardingMaintenancePlanById',
  POST_INFRASTRUCTURE_ONBOARDING_MAINTENANCE_PLAN_KEY: 'postInfrastructureOnboardingMaintenancePlan',
}

export const MAINTENANCE_PLAN_ENTITY_TYPES = {
  TOOL: "tool",
  EQUIPMENT: "equipment",
  MAINTENANCE_PLAN: "maintenancePlan",
} as const

export const MAINTENANCE_PLAN_ROUTES = {
  CREATE_MAINTENANCE_PLAN_PATH: '/infrastructure-management/maintenance-plan/create',
  EDIT_MAINTENANCE_PLAN_PATH: (maintenance_id: number) =>
    `/infrastructure-management/maintenance-plan/${maintenance_id}`,
  MAINTENANCE_PLAN_LIST_PATH: '/infrastructure-management/maintenance-plan',
}

export const MAINTENANCE_PLAN_ROUTE_IDENTIFIERS = {
  ADD: 'add',
  CREATE: 'create',
} as const

export const MAINTENANCE_PLAN_TABLE_FIELDS = {
  SNO: "sno",
  INFRA_CATEGORY: "infra_category",
  INFRA_TYPE: "infra_type",
  STATUS: "status",
  ACTION: "action",
} as const

export const MAINTENANCE_PLAN_TABLE_HEADERS = {
  SNO: "S.No.",
  INFRA_CATEGORY: "Infrastructure Category",
  INFRA_TYPE: "Infrastructure Type",
  STATUS: "Status",
  ACTION: "Actions",
} as const

export const MAINTENANCE_PLAN_TABLE_CONFIG = {
  TABLE_ID_FIELD: "maintenance_id",
  TABLE_TITLE: "Maintenance Plan",
}

export const MAINTENANCE_PLAN_FORM_FIELDS = {
  SERIAL_NO: "serialNo",
  TOOL_TYPE: "toolType",
  EQUIPMENT_TYPE: "equipmentType",
  MAINTENANCE_DESCRIPTION: "maintenanceDescription",
  TO_BE_DONE_BY: "toBeDoneBy",
  FREQUENCY: "frequency",
  STATUS: "status",
  ACTIONS: "actions",
} as const

export const MAINTENANCE_PLAN_FORM_HEADERS = {
  SERIAL_NO: "S.No.",
  TOOL_TYPE: "Tool Type",
  EQUIPMENT_TYPE: "Equipment Type",
  MAINTENANCE_DESCRIPTION: "Maintenance Description",
  TO_BE_DONE_BY: "To be Done by",
  FREQUENCY: "Frequency",
  STATUS: "Status",
  ACTIONS: "Actions",
} as const

export const MAINTENANCE_PLAN_FORM_LABELS = {
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
  ONBOARDING_INFRASTRUCTURE_CATEGORY: "Infrastructure Category",
  ONBOARDING_INFRASTRUCTURE_TYPE: "Infrastructure Type",
} as const

export const MAINTENANCE_PLAN_FORM_TITLES = {
  MAINTENANCE_PLAN: "Maintenance Plan",
  TOOLS_REQUIRED: "Tools Required",
  EQUIPMENT_REQUIRED: "Equipment Required",
  EDIT_TOOLS_REQUIRED: "Edit Tools Required",
  ADD_TOOLS_REQUIRED: "Add Tools Required",
  EDIT_EQUIPMENT: "Edit Equipment",
  ADD_EQUIPMENT: "Add Equipment",
  EDIT_MAINTENANCE_PLAN: "Edit Maintenance Plan",
  ADD_MAINTENANCE_PLAN: "Add Maintenance Plan",
} as const

export const MAINTENANCE_PLAN_FORM_PLACEHOLDERS = {
  SELECT_INFRASTRUCTURE_CATEGORY: "Select Infrastructure Category",
  SELECT_INFRASTRUCTURE_TYPE: "Select Infrastructure Type",
  SELECT_STATUS: "Select Status",
  SELECT_TOOL_CATEGORY: "Select Tool Category",
  SELECT_SKILLS: "Select skills",
  SELECT_EQUIPMENT_TYPE: "Select Equipment Type",
  ENTER_MAINTENANCE_DESCRIPTION: "Enter Maintenance Description",
  SELECT_RESPONSIBLE_PERSON: "Select Responsible Person",
  SELECT_FREQUENCY: "Select Frequency",
} as const

export const MAINTENANCE_PLAN_FORM_KEY_FIELDS = {
  INFRASTRUCTURE_CATEGORY_ID: "infrastructure_category_id",
  INFRASTRUCTURE_TYPE_ID: "infrastructure_type_id",
  STATUS_ID: "status_id",
  TOOL_ID: "tool_id",
  SKILL_ID: "skill_id",
  EQUIPMENT_ID: "equipment_id",
} as const

export const MAINTENANCE_PLAN_FORM_VALUE_FIELDS = {
  INFRASTRUCTURE_CATEGORY_NAME: "infrastructure_category_name",
  INFRASTRUCTURE_TYPE_NAME: "infrastructure_type_name",
  STATUS_NAME: "status_name",
  TOOL_NAME: "tool_name",
  SKILL_NAME: "skill_name",
  EQUIPMENT_NAME: "equipment_name",
  MAINTENANCE_SERVICE_TYPE: "maintenance_service_type",
  FREQUENCY_NAME: "frequency_name",
} as const

export const MAINTENANCE_PLAN_FORM_ID_FIELD = "id"

export const MAINTENANCE_PLAN_FORM_BUTTON_LABELS = {
  CANCEL: "Cancel",
  SAVE: "Save",
} as const

export const MAINTENANCE_PLAN_FORM_DEFAULT_VALUES = {
  INFRASTRUCTURE_CATEGORY: "Infrastructure Category",
  INFRASTRUCTURE_TYPE: "Infrastructure Type",
} as const

export const MAINTENANCE_PLAN_INITIAL_ERROR_STATE = {
  skillSetRequired: "",
  infrastructureCategory: "",
  infrastructureType: "",
  status: "",
  toolsRequired: "",
  equipmentRequired: "",
  maintenancePlan: "",
}

export const MAINTENANCE_PLAN_SET_EDITING_ID_KEYS = {
  TOOL: 'tool',
  EQUIPMENT: 'equipment',
  MAINTENANCE_PLAN: 'maintenancePlan',
} as const

export const MAINTENANCE_PLAN_ERROR_KEYS = {
  TOOLS_REQUIRED: 'toolsRequired',
  EQUIPMENT_REQUIRED: 'equipmentRequired',
  MAINTENANCE_PLAN: 'maintenancePlan',
} as const

