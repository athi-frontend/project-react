export const FORM_LABELS = {
  NAME: 'Name*',
  RECRUITMENT_ID: 'Recruitment ID*',
  RESOURCE_REQUISITION_ID: 'Resource Requisition ID*',
  FIRST_NAME: 'First Name*',
  LAST_NAME: 'Last Name*',
  ROLE: 'Role',
  INTERVIEW_DATE: 'Date of Interview*',
  EDUCATION_JD: 'Educational Qualification - As per JD',
  ACTUAL_EDUCATION: 'Actual Educational Qualification*',
  EXPERIENCE_JD: 'Experience - As per JD',
  ACTUAL_EXPERIENCE: 'Actual Experience*',
  ACTUAL: 'Actual*',
  INTERVIEWED_BY: 'Interviewed By*',
  STATUS: 'Status*',
  COMMENTS: 'Comments',
  JUSTIFICATION: 'Justification'
}

export const VALIDATION_MESSAGES = {
  NAME: 'Name is required',
  RECRUITMENTID: 'Recruitment ID is required',
  RESOURCEREQUISITIONID: 'Resource Requisition ID is required',
  FIRSTNAME: 'First Name is required',
  LASTNAME: 'Last Name is required',
  INTERVIEWDATE: 'Interview Date is required',
  ACTUALEDUCATION: 'Actual Education Qualification is required',
  ACTUALEXPERIENCE: 'Actual Experience is required',
  INTERVIEWEDBY: 'Interviewed By is required',
  STATUS: 'Status is required',
  SKILLS: 'All skill levels must be filled',
  EDUCATIONAL_QUALIFICATION_INVALID: 'Provide valid Educational Qualification',
};

export const FORM_PLACEHOLDERS = {
  NAME: 'Enter name',
  RESOURCE_REQUISITION_ID: 'Select Resource Requisition ID',
  FIRST_NAME: 'Enter First Name',
  LAST_NAME: 'Enter Last Name',
  INTERVIEW_DATE: 'DD-MM-YYYY | HH : MM',
  ACTUAL: 'Enter Actual',
  ACTUAL_EXPERIENCE: 'Enter actual',
  INTERVIEWED_BY: 'Select Interviewed by',
  STATUS: 'Select Status',
  JUSTIFICATION: 'Enter Justification',
  COMMENTS: 'Enter Comments',
}

export const FORM_FIELD_NAMES = {
  // NAME: 'name',
  // RECRUITMENT_ID: 'recruitmentId',
  RESOURCE_REQUISITION_ID : 'resourceRequisitionId',
  FIRST_NAME: 'firstName',
  LAST_NAME: 'lastName',
  ROLE: 'role',
  INTERVIEW_DATE: 'interviewDate',
  EDUCATION_JD: 'educationJd',
  ACTUAL_EDUCATION: 'actualEducation',
  EXPERIENCE_JD: 'experienceJd',
  ACTUAL_EXPERIENCE: 'actualExperience',
  INTERVIEWED_BY: 'interviewedBy',
  STATUS: 'status',
  COMMENTS: 'comments',
  JUSTIFICATION: 'justification'
}

export const BUTTON_LABELS = {
  SUBMIT_FOR_REVIEW: 'Submit for Review',
  SUBMIT_FOR_APPROVAL: 'Submit for Approval',
  APPROVE: 'Approve',
  REJECT: 'Reject',
  CANCEL: 'Cancel',
  SAVE: 'Save',
}

export const BUTTON_VARIANTS = {
  OUTLINED: 'outlined',
  CONTAINED: 'contained',
  TEXT: 'text',
}

export const SUPPORTINGFILE_CONSTANTS = {
  table: 'eqms_hr_candidate_evalution_supporting_files',
  idColumn: 'fk_eqms_file_id',
}
export const CANDIDATE_EVALUATION_CONSTANTS = {
  CANDIDATE_EVALUATION_SERVICE: {
    ENDPOINTS: {
      GET_CANDIDATE_EVALUATIONS: 'api/v1/hrcs/candidate-evaluation/all',
      DELETE_CANDIDATE_EVALUATION: (id: number) => `api/v1/hrcs/candidate-evaluation/${id}`,
      GET_CANDIDATE_EVALUATION_BY_ID: (id: number) => `api/v1/hrcs/candidate-evaluation/${id}`,
    },
    ERRORS: {
      FAILED_TO_FETCH_CANDIDATE_EVALUATIONS: 'Failed to fetch candidate evaluations',
      FAILED_TO_DELETE_CANDIDATE_EVALUATION: 'Failed to delete candidate evaluation',
      FAILED_TO_FETCH_CANDIDATE_EVALUATION_BY_ID: 'Failed to fetch candidate evaluation by ID',
    },
  },
  RESPONSE_KEYS: {
    CANDIDATE_EVALUATION: 'candidate_evaluation',
  },
  
  CONTEXT_TYPE: 'hr_candidate_evaluation',
  TABLE_COLUMNS: {
    SERIAL_NO: 'sno',
    CANDIDATE_NAME: 'candidate_name',
    RECRUITMENT_ID: 'candidate_recruitment_details_id',
    INTERVIEW_DATE: 'date_of_interview',
    INTERVIEW_STATUS: 'interview_status',
    ACTIONS: 'actions',
    STATUS: 'status',
  },
  TABLE_HEADERS: {
    SERIAL_NO: 'S.No.',
    CANDIDATE_NAME: 'Candidate Name',
    RECRUITMENT_ID: 'Resource Requisition ID',
    INTERVIEW_DATE: 'Interview Date',
    INTERVIEW_STATUS: 'Interview Status',
    ACTIONS: 'Actions',
  },
  LABELS: {
    CANDIDATE_EVALUATION: 'Candidate Evaluation',
  },
  CONTAINER: {
    ID: 'id',
    FORM_ID: 'HR_CANDIDATE_EVALUATION',
  },
  DATA: {
    DATA_SOURCE_NAME: 'eqms_hr_candidate_evalution',
    DATA_DELETE_ROW: 'data-grid-delete row-',
    DELETE_DATA_GRID: '.data-grid-delete',
    STATUS: 'status',
  },
  OPERATION: {
    UPDATE: 'update',
  },
  VALUES: {
    ONE: 1,
    ZERO: 0,
  },
  STATUS: {
    ACTIVE: 1,
  },
  PATHNAME:"/hr/candidate-evaluation/create",
  PATH:"/hr/candidate-evaluation"
};

export const DELETE="delete";
export const SUCCESS="success";
export const FAILED="failed";
export const DATA_SOURCE_NAME="eqms_hr_candidate_evalution";
export const COMMENTS='comments';
export const JUSTIFICATION='justification';
export const STATUS_FIELD_NAME='fk_eqms_hr_evalution_status_lk_id';
export const ID="id"
export const NAME="employee_name"
export const STATUS_ID="status_id"
export const STATUS_NAME="evaluation_status"
export const ACTUAL_EXP='actual_experience'
export const ACTUAL_EDU='actual_educational_qualification'
export const ISO_FORMAT="YYYY-MM-DDTHH:mm:ss.000[Z]"
export const DATE_OF_INTERVIEW="date_of_interview"
export const RECRUITMENT_DETAILS='fk_eqms_hr_resource_requisition_id'
export const CANDIDATE_FITST_NAME='encrypted_candidate_first_name'
export const CANDIDATE_LAST_NAME='encrypted_candidate_last_name'
export const CANDIDATE_EVALUATION="candidate_evaluation"
export const CONTAINER_ID="HR_CANDIDATE_EVALUATION"
export const EDUCATION_QUALIFICATION='Educational Qualification'
export const EXPERIENCE='Experience'
export const SKILL_SET_DATA_SOURCE_NAME="eqms_hr_candidate_evalution_skill_set"
export const SKILL_SET_DATA_FIELD_NAME="fk_eqms_hr_skill_level_lk_id"
export const MUST_BE_FILLED='All skill levels must be filled'
export const INVALID_DATE_FORMAT='Invalid date format'
export const INSERT='insert'
export const UPDATE='update'
export const FAILED_TO_SAVE_DATA='Failed to save data. Please try again.'
export const UNEXPECTED_ERROR='An unexpected error occurred.'
export const USER_ID_FIELD_NAME='fk_eqms_organization_employee_id'
export const USER_ID_SOURCE_NAME='eqms_hr_candidate_interviewer'
export const SKILL='Skill '
export const TEXT="text"
export const SKILL_NAME = 'skillName';
export const LEVEL_POSSESSED = 'levelPossessed';
export const ACTIONS = 'actions';
export const HEADER_ID = 'S.No.';
export const HEADER_SKILL_NAME = 'Skill Required as per JD';
export const HEADER_LEVEL_POSSESSED = 'Level of Skills as per JD';
export const HEADER_ACTIONS = 'Level of Skill Possess';
export const RECRUITMENT_ID = 'recruitmentId';
export const RESOURCE_REQUISITION_ID = 'resourceRequisitionId';
export const FIRST_NAME = 'firstName';
export const LAST_NAME = 'lastName';
export const INTERVIEW_DATE = 'interviewDate';
export const ACTUAL_EDUCATION = 'actualEducation';
export const ACTUAL_EXPERIENCE = 'actualExperience';
export const INTERVIEWED_BY = 'interviewedBy';
export const STATUS = 'status';
export const USERS='users'
export const INTERVIEW_STATUS='interviewStatus'
export const NOT_SPECIFIED='Not Specified'
export const LEVEL_REQUIRED='levelRequired'
export const SKILL_LEVEL_ID="skill_level_id"
export const SKILL_LEVEL="skill_level"
export const STATUS_SELECTED_FIELD_VALUE = '3'
export const CREATE_PAGE_TITLE = 'Add Candidate Evaluation'
export const EDIT_PAGE_TITLE = 'Edit Candidate Evaluation'
export const CREATE = 'create'