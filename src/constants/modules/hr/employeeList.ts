import React from "react";
import { NUMBERMAP } from "@/constants/common";
import { GridColDef } from "@mui/x-data-grid";

/**
 * Classification: confidential
 */

export const API_ENDPOINTS = {
    SKILL_FETCH: 'api/v1/hrcs/skill/all?status=1',
    SOURCE_FETCH: 'api/v1/hrcs/source/all?status=1',
    SKILL_LEVEL_ALL: 'api/v1/hrcs/skill-level/all',
    REQUIREMENT_ID: 'api/v1/hrcs/type-of-recruitment/all',
    EMPLOYMENT_TYPE_ALL: 'api/v1/hrcs/type-of-employment/all',
    FETCH_ALL_EMPLOYEES: 'api/v1/hrcs/employee/all',
    FETCH_COMPETENCYBYID: 'api/v1/hrcs/role-definition/',
    FETCH_BY_ID: (employeeId: number) => 
      `api/v1/hrcs/employee/${employeeId}`,
    UPSERT_EMPLOYEE: 'api/v1/hrcs/employee'
}
export const EMPLOYMENT_TYPE_HOOK = 'employmentTypes';
export const REQUIREMENT_HOOK = 'requirementTypes';
export const DATA_GRID_DELETE_CLASS = ".data-grid-delete"
export const SKILL_LEVEL_HOOK = 'skillLevels';
export const SKILL_HOOK = 'skills';
export const SOURCE_HOOK = 'source';
export const CREATE_MODE = 'create';
export const EMPLOYEE_TRAINING_NEEDS_CONTAINER = 'HR_ADD_EMPLOYEE_TRAINING_NEEDS'

export const EMPLOYEE_CONSTANTS = {
  CONTEXT_TYPE: 'hr_employee_onboarding',
}

export const SPECIFICATION_SCHEMA = {
  EQMS_DIG_SPECIFICATION: 'eqms_hr_add_employee_training_needs',
  EQMS_DIG_SPECIFICATION_MAPPER: 'eqms_dig_specification_mapper',
  EQMS_DIR_SUPPORTING_DOCUMENT: 'eqms_hr_add_employee_training_supporting_documentt',
  FK_EQMS_SUPPORTING_DOCUMENT_ID: 'fk_eqms_hr_add_employee_training_supporting_document_id',
  FK_EQMS_SUPPORTING_FILE_ID: 'fk_eqms_supporting_file_id',
  DESIGN_INPUT_GATHERING_ID: 'fk_eqms_organization_employee_id',
  STATUS: 'status',

}

export const INITIAL_EMPLOYEE = {
  first_name: "",
  last_name: "",
  employee_id: "",
  age: "",
  role: null,
  dateOfJoining: "", 
  department: null,
  recruitmentId: null,
  employmentType: "",
  educationalQualification: "",
  experience: "",
  areaOfExpertise: "",
  skillSet: "",
  trainingEffectiveness: "",
  functional_reports_to_user_id: "",
  administrativeReports: [],
  trainingNeeds: [],
  candidate_evaluation_id: "", 
  educationalQualificationAsPerJd: "", 
  experienceAsPerJd: "",
  areaOfExpertiseAsPerJd: "",
  responsibilityAsPerJd: "",
  designation_id:'',
  id: undefined // Database ID for updates
};

export const getEmployeeListColumns = (
  renderStatusCell: (params: any) => React.JSX.Element,
  renderActionCell: (params: any) => React.JSX.Element
): GridColDef[] => [
  {
    field: "sno",
    headerName: "S.No.",
    flex:NUMBERMAP.HALF,
  },
  {
    field: "employee_name",
    headerName: "Employee Name",
   flex:NUMBERMAP.ONE,
  },
  {
    field: "department",
    headerName: "Department",
       flex:NUMBERMAP.ONE,

  },
  {
    field: "role",
    headerName: "Role",
       flex:NUMBERMAP.ONE,

  },
  {
    field: "status",
    headerName: "Status",
      flex:NUMBERMAP.HALF,

    renderCell: renderStatusCell,
  },
  {
    field: "actions",
    headerName: "Action",
      flex:NUMBERMAP.HALF,

    sortable: false,
    renderCell: renderActionCell,
  },
];
 export const INITIAL_ERRORS={
  first_name: "",
    last_name: "",
    employee_id: "",
    age: "",
    role: "",
    dateOfJoining: "",
    department: "",
    employmentType: "",
    educationalQualification: "",
    experience: "",
    areaOfExpertise: "",
    trainingEffectiveness: "",
    administrativeReports: "",
    functional_reports_to_user_id: "",
    recruitmentId: "",
    candidate_evaluation_id: "",
    designation_id:''
 }
 export const FIELD_ATTRIBUTESTRAININGNEEDS = {
  SKILL: {
    label: "Skill*",
    placeholder: "Select skill",
    type: "dropdown",
    keyField: "skill_id",
    valueField: "skill_name",
    fieldKey: "skill",
    required: true,
  },
  SOURCE: {
    label: "Source",
    placeholder: "Select Source",
    type: "dropdown",
    keyField: "source_id",
    valueField: "source",
    fieldKey: "source",
    required: false,
  },
  TARGET_DATE: {
    label: "Target Date*",
    placeholder: "DD-MM-YYYY | HH : MM",
    type: "date",
    fieldKey: "dateOfJoining",
    required: true,
  },
};

export const MODAL_TITLESTRAININGNEEDS = {
  TRAINING_NEEDS: "Training Needs",
};


export const ERROR_DUBLICATE_ENTRY = {
  ERROR_CHECK:'Data Already Exist',
  ERROR_MESSAGE:'This employee number already exists. Please enter a unique number.'
}


export const FILE_SECTION_TABLES = {
  educationalQualification: "eqms_hr_employee_edu_qual_supporting_document",
  experience: "eqms_hr_employee_experience_supporting_document",
  areaOfExpertise: "eqms_hr_employee_area_expertise_supporting_document",
  skillSet: "eqms_hr_employee_skill_supporting_document",
  trainingNeeds: "eqms_hr_add_employee_training_supporting_document",
  trainingEffectiveness: "eqms_organization_employee_supporting_document",
  trainingEffectivenessModal:"eqms_hr_employee_training_evaluation_supporting_files",
};

export const FORM_ERRORS = {
  recruitmentId: "Recruitment ID is Required",
  first_name: "First Name is Required",
  last_name: "Last Name is Required",
  employee_id: "Employee Id is Required",
  employeeNumber: "Employee Number is required",
  age: "Age is Required",
  role: "Role is Required",
  dateOfJoining: "Date of Joining is Required",
  department: "Department is Required",
  employmentType: "Employment Type is Required",
  educationalQualification: "Education Qualification is Required",
  experience: "Experience is Required",
  areaOfExpertise: "Area of Expertise is Required",
  trainingEffectiveness: "Training & Certifications is Required",
  candidate_evaluation_id: "Name is Required",
  administrative_reports: "Atleast one Administrative Report is Required",
  functional_reports_to_user_id: "Functional Reports to is Required",
  designation_id:'Designation is Required'
};

export const FIELD_ATTRIBUTES = {
  firstName: {
    label: "First Name*",
    placeholder: "Enter First Name",
    dataSourceName: "eqms_organization_employee",
    dataFieldName: "encrypted_employee_first_name",
  },
  lastName: {
    label: "Last Name*",
    placeholder: "Enter Last Name",
    dataSourceName: "eqms_organization_employee",
    dataFieldName: "encrypted_employee_last_name",
  },
  employeeNumber: {
    label: "Employee Number*",
    placeholder: "Enter Employee Number",
    dataSourceName: "eqms_organization_employee",
    dataFieldName: "employee_id",
  },
  age: {
    label: "Age*",
    placeholder: "Enter Age",
    dataSourceName: "eqms_organization_employee",
    dataFieldName: "age",
  },
  role: {
    label: "Role*",
    placeholder: "Select Role",
    dataSourceName: "eqms_organization_employee",
    dataFieldName: "fk_eqms_role_lk_id",
  },
  dateOfJoining: {
    label: "Date of Joining*",
    placeholder: "DD-MM-YYYY | HH : MM",
    dataSourceName: "eqms_organization_employee",
    dataFieldName: "joining_date",
  },
  department: {
    label: "Department*",
    placeholder: "Select Department",
    dataSourceName: "eqms_organization_employee",
    dataFieldName: "fk_eqms_organization_department_id",
  },
  recruitmentId: {
    label: "Resource Requisition ID*",
    placeholder: "Select Recruitment ID",
    dataSourceName: "eqms_organization_employee",
    dataFieldName: "fk_eqms_hr_resource_requisition_id",
  },
  employmentType: {
    label: "Type of Employment*",
    placeholder: "Select Type of Employment",
    dataSourceName: "eqms_organization_employee",
    dataFieldName: "fk_eqms_hr_employment_type_lk_id",
  },
  employeeName: {
    label: "Name*",
    placeholder: "Select Name",
    dataSourceName: "eqms_organization_employee",
    dataFieldName: "fk_eqms_hr_candidate_evalution_id",
  },
  educationalQualification: {
    label: "Actual*",
    placeholder: "Enter Actual Educational Qualification",
    dataSourceName: "eqms_organization_employee",
    dataFieldName: "actual_educational_qualification",
  },
  experience: {
    label: "Actual*",
    placeholder: "Enter Actual Experience",
    dataSourceName: "eqms_organization_employee",
    dataFieldName: "actual_experience",
  },
  areaOfExpertise: {
    label: "Actual*",
    placeholder: "Enter Actual Area of Expertise",
    dataSourceName: "eqms_organization_employee",
    dataFieldName: "actual_area_of_expertise",
  },
  trainingEffectiveness: {
    label: "Training & Certifications*",
    placeholder: "Enter Training and Certifications",
    dataSourceName: "eqms_organization_employee",
    dataFieldName: "training_and_certifications_details",
  },
  functional_reports_to_user_id: {
    label: "Functional Reports to*",
    placeholder: "Select User",
    dataSourceName: "eqms_organization_employee",
    dataFieldName: "fk_eqms_functional_reports_to_user_id",
  },
};

export const MODAL_TITLES = {
  skillSet: "Skill Set",
  editSkillSet: "Edit Skill Set",
  trainingNeeds: "Training Needs",
  editTrainingNeed: "Edit Training Need",
  additionalSkills: "Additional Skills",
};

export const BUTTON_LABELS = {
  submitForReview: "Submit for Review",
  submitForApproval: "Submit for Approval",
  approve: "Approve",
  reject: "Reject",
  cancel: "Cancel",
  save: "Save",
};


// Training Needs Table Columns
export const TRAINING_NEEDS_TABLE_COLUMNS = {
  ID: {
    field: "sno",
    headerName: "S.No.",
    flex: 1,
    dataSourceName: "eqms_hr_add_employee_training_needs",
    dataFieldName: "fk_eqms_hr_skill_master_id",
  },
  SKILL_NAME: {
    field: "skill_name",
    headerName: "Skills",
    flex: 1,
    dataSourceName: "eqms_hr_add_employee_training_needs",
    dataFieldName: "fk_eqms_hr_skill_master_id",
  },
  TARGET_DATE: {
    field: "dateOfJoining",
    headerName: "Target Date",
    flex: 1,
    dataSourceName: "eqms_hr_add_employee_training_needs",
    dataFieldName: "target_date",
    dateFormat: "YYYY-MM-DD",
  },
  SOURCE: {
    field: "source",
    headerName: "Source",
    flex: 1,
    dataSourceName: "eqms_hr_add_employee_training_needs",
    dataFieldName: "fk_eqms_hr_employee_source_lk_id",
  },
};



export const EMPLOYEE_LIST_CONSTANTS = {
  TITLE: "Employee List",
  PATH_NAME: "/hr/employee",
  ACTIVE_STATUS_TEXT: "Active",
  INACTIVE_STATUS_TEXT: "Inactive",
};

export const MAGIC_SAVE_CONSTANTS = {
  MODIFIED_BY: 56,
  MODIFIED_DATE: () => new Date().toISOString(),
  STATUS_ACTIVE: 1,
  STATUS_INACTIVE: 0,
};

export const DATA_GRID_CONSTANTS = {
  ID_FIELD: "id",
  CHECKBOX: false,
  CUSTOM_CLASS_NAME: "data-grid-delete row-",
};


// Generic Modal Constants
export const GENERIC_MODAL_CONSTANTS = {
  BUTTONS: {
    CANCEL: "Cancel",
    SAVE: "Save",
  },
  TITLE: "Generic Modal",
  FIELD_REQUIRED_ERROR: (fieldLabel: string) => `${fieldLabel?.replace("*",'')} is required`,
};

export const FIELD_TYPES = {
  TEXT: "text",
  DATE: "date",
  DROPDOWN: "dropdown",
  DESCRIPTION: "description",
};

export const EMPLOYEE_UI_CONSTANTS = {
  ADD_EMPLOYEE_TITLE: "Add Employee",
  EDIT_EMPLOYEE_TITLE: "Edit Employee",
  UNKNOWN: "Unknown",
  UNKNOWN_SOURCE: " ",
  UNKNOWN_SKILL: " ",
  ADMIN_REPORTS_TO_TITLE: "Administrative Reports to",
  TRAINING_NEEDS_TITLE: "Training Needs",
  SNO_HEADER: "S.No.",
  SKILLS_IMPARTED_HEADER: "Skills Imparted",
  LEVEL_REQUIRED_HEADER: "Level Required",
  LEVEL_ACQUIRED_HEADER: "Level Acquired",
  METHOD_OF_EVALUATION_HEADER: "Method of Evaluation",
  EVALUATION_REMARKS_HEADER: "Evaluation/Remarks",
};

export type FileSection = keyof typeof FILE_SECTION_TABLES;

export const EMPLOYEE_FORM_BUTTONS = [
  {
    label: BUTTON_LABELS.submitForReview,
    onClick: undefined, // To be set in component
  },
  {
    label: BUTTON_LABELS.submitForApproval,
    onClick: undefined, // To be set in component
  },
  { label: BUTTON_LABELS.approve, onClick: undefined },
  { label: BUTTON_LABELS.reject, onClick: undefined },
  { label: BUTTON_LABELS.cancel, onClick: undefined },
  { label: BUTTON_LABELS.save, onClick: undefined, isLoading: false },
];

export const VALIDATION_MESSAGES = {
  PROVIDE_VALID_EMPLOYEE_NUMBER: "Provide valid Employee Number",
  PROVIDE_VALID_AGE: "Provide valid Age",
};

export const ALERT_MESSAGES = {
  SUCCESS: "success",
  FAILED: "failed", 
  CUSTOM_ALERT: "customAlert",
  DELETE: "delete",
  DUPLICATE_ENTRY_TITLE: "Duplicate Entry",
  DUPLICATE_ENTRY_TEXT: "The same site and user should not be entered again.",
  ICON_ERROR: "error",
};

export const FIELD_NAMES = {
  RECRUITMENT_ID: "recruitmentId",
  CANDIDATE_EVALUATION_ID: "candidate_evaluation_id", 
  EMPLOYEE_ID: "employee_id",
  AGE: "age",
  ADMINISTRATIVE_REPORTS: "administrativeReports",
  FILE_ID: "file_id",
  DOCUMENT_ID: "document_id",
  ID: "id",
};

export const TRAINING_NEED_DEFAULTS = {
  DATE_OF_JOINING: null,
  STATUS_PENDING: "Pending",
  SOURCE_EMPTY: " ",
  SKILL_EMPTY: "",
};

export const API_FORM_FIELDS = {
  EMPLOYEE_ID: "employee_id",
  RESOURCE_REQUISITION_ID: "resource_requisition_id",
  EMPLOYEE_ROLE_ID: "employee_role_id", 
  TYPE_OF_EMPLOYMENT_ID: "type_of_employment_id",
  DEPARTMENT_ID: "department_id",
  EMPLOYEE_FIRST_NAME: "employee_first_name",
  EMPLOYEE_LAST_NAME: "employee_last_name",
  EMPLOYEE_NUMBER: "employee_number",
  CANDIDATE_EVALUATION_ID: "candidate_evaluation_id",
  AGE: "age",
  DATE_OF_JOINING: "date_of_joining", 
  FUNCTIONAL_REPORT_ID: "functional_report_id",
  ADMINISTRATIVE_REPORT_TO: "administrative_report_to",
  ACTUAL_EDUCATIONAL_QUALIFICATION: "actual_educational_qualification",
  ACTUAL_EXPERIENCE: "actual_experience",
  ACTUAL_AREA_OF_EXPERTISE: "actual_area_of_expertise",
  SKILL_SET: "skill_set",
  TRAINING_AND_CERTIFICATIONS: "training_and_certifications",
  TRAINING_NEEDS: "training_needs",
  DOCUMENTS_TO_CREATE: "documents_to_create",
  CREATE_META_DATA: "create_meta_data",
  UPDATE_META_DATA: "update_meta_data", 
  DOCUMENTS_TO_DELETE: "documents_to_delete",
  DESIGNATION_ID:'designation_id'
};

export const FILE_SECTION_NAMES = {
  EDUCATIONAL_QUALIFICATION: "educational_qualification",
  EXPERIENCE: "experience", 
  EXPERTISE: "expertise",
  SKILL_SET: "skill_set",
  EMPLOYEE_SUPPORTING_DOCUMENT: "employee_supporting_document",
  TRAINING_NEEDS: "training_needs",
};

export const DATE_FORMATS = {
  YYYY_MM_DD: "YYYY-MM-DD",
  ISO_STRING_DATE_PART: "T",
  ISO_STRING_INDEX: 0,
};

export const NAVIGATION_PATHS = {
  HR_EMPLOYEE: "/hr/employee",
};

export const MODAL_BUTTON_CONFIG = {
  CANCEL_BUTTON: false,
  CONFIRM_BUTTON: false,
};

export const TRANSFORMED_FIELDS = {
  SITE_ID: "site_id",
  ADMINISTRATIVE_REPORT_ID: "administrative_report_id",
  ROLE_DEFINITION_SKILL_LEVEL_MAPPER_ID: "role_definition_skill_level_mapper_id", 
  SKILL_LEVEL_ID: "skill_possess_level_id",
  SKILL_ID: "skill_id",
  SOURCE_ID: "source_id",
  TARGET_DATE: "target_date",
};

export const RESET_FORM_VALUES = {
  EMPTY_STRING: "",
  NULL_VALUE: null,
  EMPTY_ARRAY: [],
};