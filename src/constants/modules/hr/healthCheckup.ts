import { NUMBERMAP } from "@/constants/common";
import { HealthCheckupFormData } from "@/types/modules/hr/healthTypes";
/**
 * Classification: confidential
 */
export const HEALTH_CHECKUP_SERVICE = {
    ENDPOINTS: {
      GET_HEALTH_CHECKUPS: 'api/v1/hrcs/health-checkup/all',
      GET_SITES: 'api/v1/hrcs/organization-site/all',

    },
    ERRORS: {
      FAILED_TO_FETCH_HEALTH_CHECKUPS: 'Failed to fetch health checkups',
    },
    
  };
  export const SITES='sites'
  export const RESPONSE_KEYS = {
    HEALTH_CHECKUP: 'eqms_hr_health_checkup',
  };
  export const ACTIVE_ONE= NUMBERMAP.ONE
  export const ACTIVE_ZERO= NUMBERMAP.ZERO
  export const HEALTH_CHECKUP_TABLE_COLUMNS = {
    EMPLOYEE_NAME: 'fullName',
    DEPARTMENTS: 'department_name',
    SERIAL_NO: 'sno',
    SUBMITTED_DATE: 'last_submitted_date',
    NEXT_VISIT: 'next_preventive_visit',
    STATUS: 'status',
    ACTIONS: 'actions',
  };
  
  export const TABLE_HEADERS = {
    SERIAL_NO: 'S.No.',
    EMPLOYEE_NAME: 'Employee Name',
    DEPARTMENTS: 'Department',
    DESIGNATION: 'Designation',
    SUBMITTED_DATE: 'Submitted Date',
    NEXT_VISIT: 'Next Preventive Visit',
    STATUS: 'Status',
    ACTIONS: 'Action',
  };
  
  export const LABELS = {
    HEALTH_CHECKUP: 'Health Checkup Declaration',
    EMPLOYEE_NAME :'Employee Name*'
  };

export const EMPLOYEE_ID="employeeId"
export const PLACE_HOLDER="Select Employee"
export const DATA_FIELD_NAME="fk_eqms_organization_employee_id"
export const GREEN= 'green';
export const RED= 'red';
export const ACTIVE= 'Active';
export const INACTIVE= 'Inactive';
export const HEALTH_CHECKUP_DECLARATION="Health Checkup Declaration";
export const PATHNAME= "/hr/healthcare-checkup/create";
export const LIST_PATHNAME= "/hr/healthcare-checkup/list";
export const ADD= 'Add';
export const AUTO= 'auto';
export const ID= "id";

export const CUSTOM_CLASS_NAME= "data-grid-delete row-";
export const DATA_GRID_DELETE= "data-grid-delete";
export const HIDDEN="hidden"
export const EVENT_CLASS=".data-grid-delete"
export const CONTAINER_ID="HR_HEALTH_CHECKUP"
export const GET_DEPARTMENTS='api/v1/organization/department/all?status=1'

export const HEALTH_CHECKUP_SERVICE_BY_ID = {
  ENDPOINTS: {
    GET_HEALTH_CHECKUPS: 'api/v1/hrcs/health-checkup',
  },
  ERRORS: {
    FAILED_TO_FETCH_HEALTH_CHECKUPS: 'Failed to fetch health checkups',
    FAILED_TO_FETCH_HEALTH_CHECKUP_BY_ID: 'Failed to fetch health checkup by ID',
  },
};

export const safeInitialFormData: HealthCheckupFormData = {
  employeeInfo: {
    name: "",
    role: "",
    department: "",
    lastSubmittedDate: new Date().toLocaleDateString(),
  },
  eyeTest: {
    description: "",
    files: [],
  },
  communicableDisease: {
    description: "",
    files: [],
  },
  vaccinations: {
    description: "",
    files: [],
  },
};
export const VALUE="employee_name"

export const NA="N/A"
export const EMPLOYEE_NAME="Employee Name is required"
export const EYE_TEST="eyeTest"
export const COMMUNICABLE_DISEASE="communicableDisease"
export const VACCINATIONS="vaccinations"
export const DESCRIPTION_IS_REQUIRED="description is required"
export const EYE="eqms_hr_health_checkup_eye_test_supporting_document"
export const COMMUNICABLE="eqms_hr_health_checkup_com_dis_supporting_document"
export const VACCINE="eqms_hr_health_checkup_vaccinations_supporting_document"
export const FAILED="failed"
export const SUCCESS="success"
export const ENTER_DESCRIPTION="Enter Description"
export const DATA_SOURCE_NAME="eqms_hr_health_checkup"
export const EYE_TEST_DESC="encrypted_eye_test_description"
export const CANCEL="Cancel"
export const SAVE="Save"
export const EYE_TEST_ERROR="eyeTest.description"
export const COMMUNICABLE_ERROR="communicableDisease.description"
export const COMMUNICABLE_FIELD_NAME="encrypted_communicable_disease_description"
export const VACCINATIONS_FIELD_NAME="encrypted_vaccinations_description"
export const VACCINATIONS_ERROR="vaccinations.description"
export const UPDATE="update"
export const INSERT="insert"
export const EDIT="edit"
export const ADD_MODE="add"
export const CREATE="create"
export const UNKNOWN_DEPARTMENT="Unknown Department"
export const ROLE_NAME="Role Name:"
export const DEPARTMENTS='departments'
export const FAILED_TO_FETCH_DEPARTMENTS='Failed to fetch departments'
export const PATHNAME2="/hr/healthcare-checkup/"
export const DATE_FORMATTER='YYYY-MM-DD'
export const UTC='utc'

export const sectionErrorMap: Record<string, { key: string; message: string }> = {
  [EYE_TEST]: { key: EYE_TEST_ERROR, message: "Eye Test Description is required" },
  [COMMUNICABLE_DISEASE]: { key: COMMUNICABLE_ERROR, message: "Communicable Disease Description is required" },
  [VACCINATIONS]: { key: VACCINATIONS_ERROR, message: "Vaccinations Description is required" },
};
export const UPLOAD='Upload'

export const SECTION_HEADERS = {
  EYE_TEST: "Eye Test",
  COMMUNICABLE_DISEASE: "Communicable Disease",
  VACCINATIONS: "Vaccinations",
};

export const HEALTH_CHECKUP_ERROR = {
  UNHANDLED_ERROR_TITLE: 'Something Went Wrong',
  VISIT_HOME_BUTTON: 'Visit Home Page',
  ICON: 'error',
  CUSTOM_ALERT: 'customAlert',
};