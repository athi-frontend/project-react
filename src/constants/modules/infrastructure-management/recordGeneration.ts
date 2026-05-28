/**
 * Classification : Confidential
 * Constants for Infrastructure Record Generation module
 */

export const CONTEXT_TYPE_INFRASTRUCTURE = 'infrastructure'

export const RECORD_GENERATION_MODULES = {
  INFRASTRUCTURE: "infrastructure-management"
}

export const RECORD_GENERATION_CONTEXT_TYPES = {
  MAINTENANCE_PLAN: 'record_generation_maintenance_plan',
  INFRASTRUCTURE_QUALIFICATION: 'record_generation_infrastructure_qualification',
} as const

// Title mapping for each form
export const formTitles: Record<string, string> = {
  "infrastructure-request-form": "Infrastructure Request Form",
  "installation-report": "Installation Report",
  "maintenance-report": "Maintenance Report",
  "maintenance-plan": "Maintenance Plan",
  "infrastructure-qualification": "Infrastructure Qualification",
}

export const formIds = {
  INFRASTRUCTURE_REQUEST_FORM: 'infrastructure-request-form',
  INSTALLATION_REPORT: 'installation-report',
  MAINTENANCE_REPORT: 'maintenance-report',
  MAINTENANCE_PLAN: 'maintenance-plan',
  INFRASTRUCTURE_QUALIFICATION: 'infrastructure-qualification',
}

// Common table constants
export const TABLE_CONSTANTS = {
  COMMON: {
    SNO_HEADER: "S.No.",
    VIEW_HEADER: "View",
    VIEW_FILES_LINK: "View Files",
    SNO_FIELD: "sno",
    ACTION_FIELD: "action",
  },
  INFRASTRUCTURE_REQUEST_FORM: {
    ID_FIELD: "infrastructure_request_id",
    REQUEST_NO_HEADER: "Infrastructure Request No.",
    INFRASTRUCTURE_TYPE_HEADER: "Infrastructure Type",
    INFRASTRUCTURE_NAME_HEADER: "Infrastructure Name",
    REQUEST_NO_FIELD: "infrastructure_request_id", // Using ID as request number if no separate field exists
    INFRASTRUCTURE_TYPE_FIELD: "type_name",
    INFRASTRUCTURE_NAME_FIELD: "infrastructure_name",
  },
  INSTALLATION_REPORT: {
    ID_FIELD: "infrastructure_id",
    SERIAL_NO_HEADER: "Infrastructure Serial No.",
    INFRASTRUCTURE_TYPE_HEADER: "Infrastructure Type",
    INFRASTRUCTURE_NAME_HEADER: "Infrastructure Name",
    SERIAL_NO_FIELD: "infrastructure_serial_number",
    INFRASTRUCTURE_TYPE_FIELD: "infrastructure_type_name",
    INFRASTRUCTURE_NAME_FIELD: "infrastructure_name",
  },
  MAINTENANCE_REPORT: {
    ID_FIELD: "maintenance_report_id",
    REQUEST_NO_HEADER: "Infrastructure Request No.",
    INFRASTRUCTURE_TYPE_HEADER: "Infrastructure Type",
    INFRASTRUCTURE_NAME_HEADER: "Infrastructure Name",
    REQUEST_NO_FIELD: "maintenance_report_id",
    INFRASTRUCTURE_TYPE_FIELD: "infrastructure_type",
    INFRASTRUCTURE_NAME_FIELD: "infrastructure_name",
  },
  MAINTENANCE_PLAN: {
    ID_FIELD: "maintenance_id",
  },
  INFRASTRUCTURE_QUALIFICATION: {
    ID_FIELD: "infrastructure_qualification_id",
  },
} as const;

