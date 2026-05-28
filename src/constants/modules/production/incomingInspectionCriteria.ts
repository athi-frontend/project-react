/**
 * Classification: Confidential
 * Constants for Incoming Inspection Criteria module
 */

// Base URL for production APIs
const PRODUCTION_BASE_URL = 'api/v1/production';

// API Endpoints
export const API_ENDPOINTS = {
  FETCH_INCOMING_INSPECTION_CRITERIA_LIST: `${PRODUCTION_BASE_URL}/incoming-inspection-criteria/all`,
  FETCH_INCOMING_INSPECTION_CRITERIA_BY_ID: (id: number) =>
    `${PRODUCTION_BASE_URL}/incoming-inspection-criteria/${id}`,
  DELETE_INCOMING_INSPECTION_CRITERIA: (id: number) =>
    `${PRODUCTION_BASE_URL}/incoming-inspection-criteria/${id}`,
  UPSERT_INCOMING_INSPECTION_CRITERIA: `${PRODUCTION_BASE_URL}/incoming-inspection-criteria`,
  PRE_PRODUCTION_GROUP_ALL :`${PRODUCTION_BASE_URL}/pre-production-group/all`,
  PRE_PRODUCTION_GROUP_CRITERIA_ALL:`${PRODUCTION_BASE_URL}/pre-production-group/criteria/all`
};

// Query Keys
export const FETCH_INCOMING_INSPECTION_CRITERIA_LIST_KEY = 'fetchIncomingInspectionCriteriaList';
export const FETCH_INCOMING_INSPECTION_CRITERIA_BY_ID_KEY = 'fetchIncomingInspectionCriteriaById';

// Table Field Names
export const TABLE_FIELDS = {
  SNO: "sno",
  PART_TYPE_NAME: "part_type_name",
  PART_SUB_TYPE_NAME: "part_sub_type_name",
  PART_SUB_CLASS_NAME: "part_sub_class_name",
  PART_CATEGORY_NAME: "part_category_name",
  STATUS: "status",
  ACTION: "action",
} as const;

// Table Header Names
export const TABLE_HEADERS = {
  SNO: "S.No.",
  PART_TYPE_NAME: "Part type",
  PART_SUB_TYPE_NAME: "Part Sub Type",
  PART_SUB_CLASS_NAME: "Part Sub Class",
  PART_CATEGORY_NAME: "Part Category Name",
  STATUS: "Status",
  ACTION: "Actions",
} as const;

// Table Configuration
export const TABLE_ID_FIELD = "incoming_inspection_criteria_id";
export const TABLE_TITLE = "Incoming Inspection Criteria";

// Page Constants
export const PAGE_CONSTANTS = {
  TITLE: "Incoming Inspection Criteria",
  CREATE_PATH: "/production/incoming-inspection-criteria/create",
  EDIT_PATH: (id: number) => `/production/incoming-inspection-criteria/${id}`,
};

// Data Grid constants 
export const DATA_GRID_CONSTANTS = {
  ID_FIELD: 'incoming_inspection_criteria_id'
};
export const FORM_LABEL = {
  STATUS: 'Status*',
};
export const DROPDOWN_FIELD = {
  STATUS: {
    KEY_FIELD: 'status_id',
    VALUE_FIELD: 'status_name'
  }
};

// Validation Error Messages
export const VALIDATION_MESSAGES = {
  EQUIPMENT_TYPE_REQUIRED: 'Equipment Type is required',
  STATUS_REQUIRED: 'Status is required',
  FILE_UPLOAD_REQUIRED: 'File Upload is required',
  CRITERIA_REQUIRED: 'At least one criteria is required',
};