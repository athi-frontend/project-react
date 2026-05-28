export const INDUCTION_TRAINING_CONSTANTS = {
  INDUCTION_TRAINING_SERVICE: {
    ENDPOINTS: {
    GET_INDUCTION_TRAININGS: 'api/v1/hrcs/induction/',
    GET_DESIGN_OUTPUT_DOCUMENTS: (projectId: number) =>
      `api/v1/dnd/design-output-document/project/${projectId}`,
    GET_ALL_TOPICS: 'api/v1/hrcs/induction/topic/all',
  },
    ERRORS: {
      FAILED_TO_FETCH_INDUCTION_TRAININGS: 'Failed to fetch induction trainings',
      FAILED_TO_FETCH_DOD: 'Failed to fetch design output documents',
    },
  },
  RESPONSE_KEYS: {
    INDUCTION_TRAINING: 'induction_training',
    USERS: 'users',
  },
  INDUCTION_TRAINING_TABLE_COLUMNS: {
    SERIAL_NO: 'induction_training_id',
    TOPIC: 'topic',
    DOCUMENT: 'document',
    CONDUCTED_BY: 'conductedby',
    CONDUCTED_ON: 'conductedon',
    COMPLETED: 'completed',
  },
  TABLE_HEADERS: {
    SERIAL_NO: 'S.No.',
    TOPIC: 'Topic',
    DOCUMENT: 'Document',
    CONDUCTED_BY: 'Conducted By',
    CONDUCTED_ON: 'Conducted On',
    COMPLETED: 'Completed',
  },
  LABELS: {
    INDUCTION_TRAINING: 'Induction Training',
  },
  DESIGN_OUTPUT_DOCUMENT_QUERY_KEYS: {
    FETCH_DESIGN_OUTPUT_DOCUMENT_KEY: 'Fetch_Design_Output_Document',
  },
  BUTTONS: {
    CANCEL: "Cancel",
    SAVE: "Save",
  },
  CONTAINER: {
    CONTAINER_ID: "HR_INDUCTION",
    ID: "id",
    EMPLOYEE_NAME: "employee_name"
  },
  DOCUMENT: {
    NO_DOCUMENT: "No Document",
    NOT_CONDUCTED: "Not Conducted",
    HREF: "/api/documents/",
  },
  LINK: {
    TARGET: "_blank",
    UNDERLINE: "underline",
  },
  DROPDOWN: {
    EMPLOYEE_LIST: "employee-list",
    SELECT: "Select",
    NAME: "name",
  },
  DATA: {
    DATA_SOURCE_NAME: "eqms_hr_induction_training",
    USER_ID_FIELD_NAME: "fk_eqms_organization_employee_id",
    DATA_FIELD_NAME: "fk_eqms_hr_induction_training_topic_supporting_file_id",
    ORG_ID: "fk_eqms_organization_id",
    DATA_FRAMEWORK_OTHER_PARAMS: {
      eqms_hr_induction_training: [{
        status: 1,
      }],
      "eqms_hr_induction_training_employee_header": [
      {
        "status":1
      }
    ]
    },
    KEYS: {
      // eqms_hr_induction_training: {
      //   fk_eqms_organization_id: 1,
      // },
    },
  },
  STYLES: {
    STYLE: { display: "none" },
    STYLE2: {
      "& .MuiSvgIcon-root": {
        fontSize: 32,
      },
    },
  },
  FIELDS: {
    CONDUCTED_ON: "conducted_on",
    IS_COMPLETE: "is_complete",
  },
  CLASSES: {
    SCOPED_CLASS: ".MuiDataGrid-row",
  },
  OPERATION: {
    UPDATE: "update",
  },
  VALUES: {
    PRIMARY: "primary",
    STATUS: { status: 1 },
    VALUE: "value",
    DATA_SOURCE: "data-sourcename",
    DATA_FIELD: "data-fieldname",
    ONE: "1",
    ZERO: "0",
  },
  REGEX: {
    NUMBER: /\s+/g,
  },
  RESPONSE: {
    BUTTON: "button",
    BLOB: "blob",
  },
  EMPLOYEE_ERROR: "Employee Name is required",
  TABLE_ERROR: "At least one training row must be completely filled",
};

export const FAILED= "failed"
export const SUCCESS= "success"