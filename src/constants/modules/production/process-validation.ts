/**
 * Classification: Confidential
 * Process Validation Constants
 */
import { NUMBERMAP } from '@/constants/common'

// Route Paths
export const PROCESS_VALIDATION_ROUTES = {
  BASE: '/production/process-validation',
  DETAIL: (projectId: number | string, processChecklistId: number | string) =>
    `/production/process-validation/${projectId}/${processChecklistId}`,
}

// API Endpoints
export const PROCESS_VALIDATION_API_ENDPOINTS = {
  // Installation Qualification
  INSTALLATION_QUALIFICATION_UPSERT: 'api/v1/production/installation-qualification/',
  INSTALLATION_QUALIFICATION_FETCH_ALL: (processChecklistId: number) =>
    `api/v1/production/installation-qualification/all?process_checklist_id=${processChecklistId}`,
  INSTALLATION_QUALIFICATION_FETCH_BY_ID: (iqcDetailId: number) =>
    `api/v1/production/installation-qualification/${iqcDetailId}`,
  INSTALLATION_QUALIFICATION_DELETE: (iqcDetailId: number) =>
    `api/v1/production/installation-qualification/${iqcDetailId}`,

  // Operational Qualification
  OPERATIONAL_QUALIFICATION_UPSERT: 'api/v1/production/operational-qualification/',
  OPERATIONAL_QUALIFICATION_FETCH_ALL: (processChecklistId: number) =>
    `api/v1/production/operational-qualification/all?process_checklist_id=${processChecklistId}`,
  OPERATIONAL_QUALIFICATION_FETCH_BY_ID: (oqcDetailId: number) =>
    `api/v1/production/operational-qualification/${oqcDetailId}`,
  OPERATIONAL_QUALIFICATION_DELETE: (oqcDetailId: number) =>
    `api/v1/production/operational-qualification/${oqcDetailId}`,

  // Performance Qualification
  PERFORMANCE_QUALIFICATION_UPSERT: 'api/v1/production/performance-qualification/',
  PERFORMANCE_QUALIFICATION_FETCH_ALL: (processChecklistId: number) =>
    `api/v1/production/performance-qualification/all?process_checklist_id=${processChecklistId}`,
  PERFORMANCE_QUALIFICATION_FETCH_BY_ID: (pqcDetailId: number) =>
    `api/v1/production/performance-qualification/${pqcDetailId}`,
  PERFORMANCE_QUALIFICATION_DELETE: (pqcDetailId: number) =>
    `api/v1/production/performance-qualification/${pqcDetailId}`,

  // IQC Group Dropdown
  IQC_GROUP_FETCH_ALL: 'api/v1/production/iqc-group/all',
  PROCESS_CHECKLIST_BY_PROJECT: (projectId: number) =>
    `api/v1/production/product-traceability-card/project/${projectId}?status_id=1`,
}

// Query Keys
export const PROCESS_VALIDATION_QUERY_KEYS = {
  INSTALLATION_QUALIFICATION_LIST: 'installationQualificationList',
  INSTALLATION_QUALIFICATION_BY_ID: 'installationQualificationById',
  OPERATIONAL_QUALIFICATION_LIST: 'operationalQualificationList',
  OPERATIONAL_QUALIFICATION_BY_ID: 'operationalQualificationById',
  PERFORMANCE_QUALIFICATION_LIST: 'performanceQualificationList',
  PERFORMANCE_QUALIFICATION_BY_ID: 'performanceQualificationById',
  IQC_GROUP_LIST: 'iqcGroupList',
  PROCESS_CHECKLIST_LIST: 'processChecklistList',
}

// Form Labels
export const PROCESS_VALIDATION_FORM_LABELS = {
  INSTALLATION_QUALIFICATION_REPORT_BY: 'Installation Qualification Report By *',
  MANUFACTURER_NAME: 'Manufacturer Name *',
  AUTHORIZED_SUPPLIER_NAME: 'Authorized Supplier Name *',
  AGENT_NAME: 'Agent Name *',
  INSTALLATION_QUALIFICATION_DONE_IN_HOUSE: 'Installation Qualification Done In - House *',
  IQ_GROUP_NAME: 'IQ Group Name *',
  PARAMETER: 'Parameter *',
  REQUIREMENT_SPECIFICATION: 'Requirement Specification *',
  MEASUREMENT: 'Measurement *',
  RESULT: 'Result *',
  STATUS: 'Status *',
  CRITICAL_PARAMETER: 'Critical Parameter *',
  WORST_CASE_SETTINGS: 'Worst Case Settings *',
  BEST_CASE_SETTINGS: 'Best Case Settings *',
  RESULT_EXPECTED: 'Result Expected *',
  RESULT_MEASURED_LATER: 'Result Measured Later *',
  OPTIMUM_RANGE: 'Optimum Range *',
  VALUE_SET: 'Value Set *',
  MIN: 'Min',
  MAX: 'Max',
}

// Form Placeholders
export const PROCESS_VALIDATION_FORM_PLACEHOLDERS = {
  ENTER_MANUFACTURER_NAME: 'Enter Manufacturer Name',
  ENTER_AUTHORIZED_SUPPLIER_NAME: 'Enter Authorized Supplier Name',
  ENTER_AGENT_NAME: 'Enter Agent Name',
  SELECT_IQ_GROUP_NAME: 'Select IQ Group Name',
  ENTER_PARAMETER: 'Enter Parameter',
  ENTER_REQUIREMENT_SPECIFICATION: 'Enter Requirement Specification',
  ENTER_MEASUREMENT: 'Enter Measurement',
  SELECT_STATUS: 'Select Status',
  ENTER_CRITICAL_PARAMETER: 'Enter Critical Parameter',
  ENTER_WORST_CASE_SETTING: 'Enter Worst Case Setting',
  ENTER_WORST_CASE_SETTINGS: 'Enter Worst Case Settings',
  ENTER_BEST_CASE_SETTING: 'Enter Best Case Setting',
  ENTER_BEST_CASE_SETTINGS: 'Enter Best Case Settings',
  ENTER_RESULT_EXPECTED: 'Enter Result Expected',
  ENTER_RESULT_MEASURED_LATER: 'Enter Result Measured Later',
  ENTER_OPTIMUM_RANGE: 'Enter Optimum Range',
  ENTER_VALUE_SET: 'Enter Value Set',
  ENTER_MIN: 'Enter Min',
  ENTER_MAX: 'Enter Max',
}

// Error Messages
export const PROCESS_VALIDATION_ERROR_MESSAGES = {
  MANUFACTURER_NAME_REQUIRED: 'Manufacturer Name is required',
  AUTHORIZED_SUPPLIER_NAME_REQUIRED: 'Authorized Supplier Name is required',
  AGENT_NAME_REQUIRED: 'Agent Name is required',
  IQ_GROUP_NAME_REQUIRED: 'IQ Group Name is required',
  PARAMETER_REQUIRED: 'Parameter is required',
  REQUIREMENT_SPECIFICATION_REQUIRED: 'Requirement Specification is required',
  MEASUREMENT_REQUIRED: 'Measurement is required',
  RESULT_REQUIRED: 'Result is required',
  INSTALLATION_QUALIFICATION_REPORT_BY_REQUIRED: 'Installation Qualification Report By is required',
  INSTALLATION_QUALIFICATION_DONE_IN_HOUSE_REQUIRED: 'Installation Qualification Done In - House is required',
  CRITICAL_PARAMETER_REQUIRED: 'Critical Parameter is required',
  WORST_CASE_SETTING_REQUIRED: 'Worst Case Setting is required',
  WORST_CASE_SETTINGS_REQUIRED: 'Worst Case Settings is required',
  BEST_CASE_SETTING_REQUIRED: 'Best Case Setting is required',
  BEST_CASE_SETTINGS_REQUIRED: 'Best Case Settings is required',
  RESULT_EXPECTED_REQUIRED: 'Result Expected is required',
  RESULT_MEASURED_LATER_REQUIRED: 'Result Measured Later is required',
  OPTIMUM_RANGE_REQUIRED: 'Optimum Range is required',
  VALUE_SET_REQUIRED: 'Value Set is required',
  MIN_REQUIRED: 'Min is required',
  MAX_REQUIRED: 'Max is required',
  STATUS_REQUIRED: 'Status is required',
}

// Button Labels
export const PROCESS_VALIDATION_BUTTON_LABELS = {
  CANCEL: 'Cancel',
  SAVE: 'Save',
  ADD_NEW: 'Add New',
}

// Report By Values
export const REPORT_BY_VALUES = {
  MANUFACTURER: 'manufacturer',
  AUTHORIZED_SUPPLIER: 'authorised_supplier',
  AGENT: 'agent',
} as const

// Radio Button Options
export const REPORT_BY_OPTIONS = [
  { value: REPORT_BY_VALUES.MANUFACTURER, label: 'Manufacturer' },
  { value: REPORT_BY_VALUES.AUTHORIZED_SUPPLIER, label: 'Authorized Supplier' },
  { value: REPORT_BY_VALUES.AGENT, label: 'Agent' },
]

// Form Field Names
export const INSTALLATION_QUALIFICATION_FIELD_NAMES = {
  INSTALLATION_QUALIFICATION_REPORT_BY: 'installationQualificationReportBy',
  INSTALLATION_QUALIFICATION_DONE_IN_HOUSE: 'installationQualificationDoneInHouse',
} as const

// Common Field Names
export const COMMON_FIELDS = {
  ID: 'id',
  IQC_GROUP_NAME: 'iqc_group_name',
} as const

export const IN_HOUSE_OPTIONS = [
  { value: NUMBERMAP.ONE, label: 'Yes' },
  { value: NUMBERMAP.TWO, label: 'No' }, // API expects 2 for "No" instead of 0
]

export const RESULT_OPTIONS = [
  { value: 'pass', label: 'Pass' },
  { value: 'fail', label: 'Fail' },
]

// OQC Type Options
export const OQC_TYPE_OPTIONS = [
  { value: 'best', label: 'Best Case' },
  { value: 'worst', label: 'Worst Case' },
]

// OQC Type Values
export const OQC_TYPE = {
  BEST: 'best' as const,
  WORST: 'worst' as const,
}

// OQC Field Names
export const OQC_FIELDS = {
  OQC_DETAIL_ID: 'oqc_detail_id',
}

// Status Dropdown Field Config
export const STATUS_DROPDOWN_CONFIG = {
  KEY_FIELD: 'status_id',
  VALUE_FIELD: 'status_name',
} as const

// Temporary ID Prefix
export const TEMP_ID_PREFIX = 'temp_'

// List Page UI Labels
export const PROCESS_VALIDATION_LIST_PAGE_LABELS = {
  TITLE: 'Process Validation',
  VALIDATION: 'Validation',
  FIELD_SNO: 'sno',
  FIELD_PROCESS_GROUP: 'process_checklist_group_name',
  FIELD_PROCESS_NAME: 'process_checklist_name',
  SETTINGS_FIELD: 'settings',
  SNO: 'S.No.',
  PROCESS_GROUP: 'Process Group',
  PROCESS_NAME: 'Process Name',
  ACTIONS: 'Actions',
}

// Detail Page UI Labels
export const PROCESS_VALIDATION_DETAIL_PAGE_LABELS = {
  TITLE: 'Process Validation',
  INSTALLATION_QUALIFICATION_TAB: 'Installation Qualification',
  OPERATIONAL_QUALIFICATION_TAB: 'Operational Qualification',
  PERFORMANCE_QUALIFICATION_TAB: 'Performance Qualification',
  TABS_ARIA_LABEL: 'process validation tabs',
}

// DataGrid/Table field keys for each form
export const INSTALLATION_QUALIFICATION_FIELDS = {
  SNO: 'sno',
  PARAMETER: 'parameter',
  REQUIREMENT_SPECIFICATION: 'requirement_specification',
  MEASUREMENT: 'measurement',
  RESULT: 'result',
  STATUS: 'status',
  ACTION: 'action',
};

export const INSTALLATION_QUALIFICATION_HEADERS = {
  SNO: 'S.No.',
  PARAMETER: 'Parameter',
  REQUIREMENT_SPECIFICATION: 'Requirements Specifications',
  MEASUREMENT: 'Measurement',
  RESULT: 'Result',
  STATUS: 'Status',
  ACTION: 'Actions',
  TITLE: 'Installation Qualification',
  ADD_TITLE: 'Add Installation Qualification',
  EDIT_TITLE: 'Edit Installation Qualification',
};

export const OPERATIONAL_QUALIFICATION_FIELDS = {
  SNO: 'sno',
  CRITICAL_PARAMETER: 'critical_parameter',
  WORST_CASE_SETTING: 'worst_case_setting',
  BEST_CASE_SETTING: 'best_case_setting',
  RESULT_EXPECTED: 'result_expected',
  RESULT_MEASURED_LATER: 'result_measured_later',
  STATUS: 'status',
  ACTION: 'action',
};

export const OPERATIONAL_QUALIFICATION_HEADERS = {
  SNO: 'S.No.',
  CRITICAL_PARAMETER: 'Critical Parameter',
  WORST_CASE_SETTING: 'Worst Case Setting *',
  BEST_CASE_SETTING: 'Best Case Setting *',
  RESULT_EXPECTED: 'Result Expected',
  RESULT_MEASURED_LATER: 'Result Measured Later',
  STATUS: 'Status',
  ACTION: 'Actions',
  WORST_CASE_SETTINGS: 'Worst Case Settings',
  BEST_CASE_SETTINGS: 'Best Case Settings',
  ADD_WORST_TITLE: 'Add Worst Case Setting',
  EDIT_WORST_TITLE: 'Edit Worst Case Setting',
  ADD_BEST_TITLE: 'Add Best Case Setting',
  EDIT_BEST_TITLE: 'Edit Best Case Setting',
};

export const PERFORMANCE_QUALIFICATION_FIELDS = {
  SNO: 'sno',
  CRITICAL_PARAMETER: 'critical_parameter',
  OPTIMUM_RANGE: 'optimum_range',
  VALUE_SET: 'value_set',
  RESULT: 'result',
  STATUS: 'status',
  ACTION: 'action',
  MIN: 'min',
  MAX: 'max',
};

export const PERFORMANCE_QUALIFICATION_HEADERS = {
  SNO: 'S.No.',
  CRITICAL_PARAMETER: 'Critical Parameters',
  OPTIMUM_RANGE: 'Optimum Range',
  VALUE_SET: 'Value Set',
  RESULT: 'Result',
  STATUS: 'Status',
  ACTION: 'Actions',
  TABLE_TITLE: 'Performance Qualification',
  ADD_TITLE: 'Add Performance Qualification',
  EDIT_TITLE: 'Edit Performance Qualification',
  FINAL_RESULT: 'Final Result',
  MIN: 'Min',
  MAX: 'Max',
};

