/**
 * Classification : Confidential
 **/

// Base URL for infrastructure management APIs
const INFRASTRUCTURE_BASE_URL = 'api/v1/infrastructure'; 
const QUALITY_CONTROL_BASE_URL = 'api/v1/quality-control';

// API Endpoints
export const API_ENDPOINTS = {
  FETCH_MAINTENANCE_REPORT_LIST: `${INFRASTRUCTURE_BASE_URL}/maintenance-report/all`,
  FETCH_MAINTENANCE_REPORT_BY_ID: (maintenance_report_id: number) => 
    `${INFRASTRUCTURE_BASE_URL}/maintenance-report/${maintenance_report_id}`,
  FETCH_MAINTENANCE_REPORT_BY_INFRASTRUCTURE_ID: (infrastructure_id: number) => 
    `${INFRASTRUCTURE_BASE_URL}/maintenance-report/${infrastructure_id}`,
  SAVE_MAINTENANCE_REPORT: `${INFRASTRUCTURE_BASE_URL}/maintenance-report/`,
  DELETE_MAINTENANCE_REPORT: (maintenance_report_id: number) =>
    `${INFRASTRUCTURE_BASE_URL}/maintenance-report/${maintenance_report_id}`,
  FETCH_EQUIPMENT_ITEMS: `${QUALITY_CONTROL_BASE_URL}/equipment-item/all`,
  FETCH_EQUIPMENT_CALIBRATION: `${QUALITY_CONTROL_BASE_URL}/equipment-calibration/all`,
} as const;

// Query Keys
export const FETCH_MAINTENANCE_REPORT_LIST_KEY = 'fetchMaintenanceReportList';
export const FETCH_INFRASTRUCTURE_BY_ID_KEY = 'fetchInfrastructureById';
export const FETCH_MAINTENANCE_REPORT_BY_ID_KEY = 'fetchMaintenanceReportById';
export const FETCH_MAINTENANCE_REPORT_BY_INFRASTRUCTURE_ID_KEY = 'fetchMaintenanceReportByInfrastructureId';
export const SAVE_MAINTENANCE_REPORT_KEY = 'saveMaintenanceReport';
export const FETCH_EQUIPMENT_ITEMS_KEY = 'fetchEquipmentItems';
export const FETCH_EQUIPMENT_CALIBRATION_KEY = 'fetchEquipmentCalibration';

// Paths
export const CREATE_MAINTENANCE_REPORT_PATH = '/infrastructure-management/maintenance-report/create'
export const EDIT_MAINTENANCE_REPORT_PATH = (maintenance_id: number) =>
  `/infrastructure-management/maintenance-report/${maintenance_id}`
export const MAINTENANCE_REPORT_LIST_PATH = '/infrastructure-management/maintenance-report'

// Table Field Names (matching API response)
export const TABLE_FIELDS = {
  SNO: "sno",
  INFRA_CATEGORY: "infrastructure_category",
  INFRA_TYPE: "infrastructure_type",
  INFRA_NAME: "infrastructure_name",
  INFRA_SERIAL_NO: "infrastruture_serial",
  INSPECTED_ON: "inspection_on",
  STATUS: "status_id",
  ACTION: "action",
} as const;

// Table Header Names
export const TABLE_HEADERS = {
  SNO: "S.No.",
  INFRA_CATEGORY: "Infrastructure Category",
  INFRA_TYPE: "Infrastructure Type",
  INFRA_NAME: "Infrastructure Name",
  INFRA_SERIAL_NO: "Infrastructure Serial No.",
  INSPECTED_ON: "Inspected on",
  STATUS: "Status",
  ACTION: "Actions",
} as const;

// Table Configuration
export const TABLE_ID_FIELD = "infrastructure_id";
export const TABLE_TITLE = "Maintenance Report";

// Form Field Names
export const FORM_FIELD_NAMES = {
  INFRASTRUCTURE_CATEGORY: 'infrastructureCategory',
  INFRASTRUCTURE_TYPE: 'infrastructureType',
  SERIAL_NO: 'serialNo',
  STATUS: 'status',
} as const;

// Initial Errors
export const INITIAL_ERRORS: Record<(typeof FORM_FIELD_NAMES)[keyof typeof FORM_FIELD_NAMES], string> = {
  infrastructureCategory: '',
  infrastructureType: '',
  serialNo: '',
  status: '',
  fileUpload:''
};

// Validation messages
export const VALIDATION_MESSAGES = {
  INFRASTRUCTURE_CATEGORY_REQUIRED: 'Infrastructure Category is required',
  INFRASTRUCTURE_TYPE_REQUIRED: 'Infrastructure Type is required',
  SERIAL_NO_REQUIRED: 'Serial No. is required',
  STATUS_REQUIRED: 'Status is required',
  ACTION_CARRIED_OUT_REQUIRED: 'Action Carried Out is required',
  MAINTENANCE_DATE_REQUIRED: 'Maintenance Date is required',
  BY_WHOM_REQUIRED: 'By Whom is required',
  FILE_UPLOAD_REQUIRED: 'File Upload is required',
} as const;

// Error messages for query hooks
export const ERROR_MESSAGES = {
  INFRASTRUCTURE_ID_REQUIRED: 'infrastructure_id is required',
  MAINTENANCE_REPORT_ID_REQUIRED: 'maintenance_report_id is required',
  EQUIPMENT_ITEM_ID_REQUIRED: 'equipment_item_id is required',
} as const;

// Equipment Table Column Headers
export const EQUIPMENT_COLUMN_HEADERS = {
  SNO: 'S.No.',
  EQUIPMENT_CATEGORY: 'Equipment Category',
  EQUIPMENT_TYPE: 'Equipment Type',
  EQUIPMENT_SERIAL_NO: 'Equipment Serial No.',
  CALIBRATION_DETAILS: 'Calibration Details',
} as const;

// Maintenance Details Table Column Headers
export const MAINTENANCE_COLUMN_HEADERS = {
  SNO: 'S.No.',
  MAINTENANCE_DESCRIPTION: 'Maintenance Description',
  TO_BE_DONE_BY: 'To be Done by',
  FREQUENCY: 'Frequency',
  NEXT_SCHEDULE_DATE: 'Next Schedule Date',
  ACTIONS: 'Actions',
} as const;

// Placeholders
export const PLACEHOLDERS = {
  SELECT_EQUIPMENT_SERIAL_NO: 'Select Equipment Serial No.',
} as const;

// Labels
export const LABELS = {
  VIEW_DETAILS: 'View Details',
  NO_DETAILS: 'No Details',
} as const;

// Modal Titles
export const MODAL_TITLES = {
  CALIBRATION_DETAILS: 'Calibration Details',
  ACTIONS_CARRIED_OUT: 'Actions Carried Out',
} as const;

// Aria Labels
export const ARIA_LABELS = {
  EDIT: 'edit',
} as const;

// Equipment Table Column Field Names
export const EQUIPMENT_COLUMN_FIELDS = {
  SNO: 'sno',
  EQUIPMENT_CATEGORY: 'equipmentCategory',
  EQUIPMENT_TYPE: 'equipmentType',
  EQUIPMENT_SERIAL_NO: 'equipmentSerialNo',
  CALIBRATION_DETAILS: 'calibrationDetails',
} as const;

// Maintenance Details Table Column Field Names
export const MAINTENANCE_COLUMN_FIELDS = {
  SNO: 'sno',
  MAINTENANCE_DESCRIPTION: 'maintenanceDescription',
  TO_BE_DONE_BY: 'toBeDoneBy',
  FREQUENCY: 'frequency',
  NEXT_SCHEDULE_DATE: 'nextScheduleDate',
  ACTIONS: 'actions',
} as const;

// Table Header Class Name
export const TABLE_HEADER_CLASS_NAME = 'table-header';

// InputField Key Fields
export const KEY_FIELDS = {
  ID: 'id',
  INFRASTRUCTURE_CATEGORY_ID: 'infrastructure_category_id',
  INFRASTRUCTURE_TYPE_ID: 'infrastructure_type_id',
  INFRASTRUCTURE_ID: 'infrastructure_id',
  STATUS_ID: 'status_id',
  EQUIPMENT_ITEM_ID: 'equipment_item_id',
} as const;

// InputField Value Fields
export const VALUE_FIELDS = {
  NAME: 'name',
  INFRASTRUCTURE_CATEGORY_NAME: 'infrastructure_category_name',
  INFRASTRUCTURE_TYPE_NAME: 'infrastructure_type_name',
  SERIAL_NUMBER: 'serial_number',
  STATUS_NAME: 'status_name',
  MAINTENANCE_SERVICE_TYPE: 'maintenance_service_type',
  EQUIPMENT_ITEM: 'equipment_item',
} as const;

// Page Titles
export const PAGE_TITLES = {
  MAINTENANCE_REPORT: 'Maintenance Report',
  EQUIPMENT_REQUIRED: 'Equipment Required',
  MAINTENANCE_DETAILS: ' Maintenance Details',
} as const;

// Form Labels
export const FORM_LABELS = {
  INFRASTRUCTURE_CATEGORY: 'Infrastructure Category*',
  INFRASTRUCTURE_TYPE: 'Infrastructure Type*',
  SERIAL_NO: 'Serial No.*',
  STATUS: 'Status*',
  INFRASTRUCTURE_NAME: 'Infrastructure Name',
  FUNCTION_DEPARTMENT: 'Function / Department',
  ACTION_CARRIED_OUT: 'Action Carried Out*',
  MAINTENANCE_DATE: 'Maintenance Date*',
  BY_WHOM: 'By Whom*',
} as const;

// Form Placeholders
export const FORM_PLACEHOLDERS = {
  SELECT_INFRASTRUCTURE_CATEGORY: 'Select Infrastructure Category',
  SELECT_INFRASTRUCTURE_TYPE: 'Select Infrastructure Type',
  SELECT_SERIAL_NO: 'Select Serial No.',
  SELECT_STATUS: 'Select Status',
  INPUT_TEXT: 'Input Text',
  SELECT_BY_WHOM: 'Select By Whom',
} as const;

// DataTable Configuration
export const DATA_TABLE_ID_FIELD = 'id';

// File Upload
export const FILE_UPLOAD_SUBHEADER = 'Upload Document*';

// Form Button Labels
export const FORM_BUTTON_LABELS = {
  CANCEL: "Cancel",
  SAVE: "Save",
} as const;

// Initial Form Data
export const INITIAL_FORM_DATA = {
  infrastructureCategory: '',
  infrastructureType: '',
  serialNo: '',
  infrastructureName: '',
  functionDepartment: '',
  status: '',
};

