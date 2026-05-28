/**
 * Classification : Confidential
**/

import { VendorCriteria } from "@/components/modules/vendor-management/vendor-selection-criteria/VendorSelectionCriteriaTable";
import { NUMBERMAP } from "@/constants/common";
import { VendorReEvaluationFormData } from "@/types/modules/vendor-management/vendorReEvaluation";

const VENDOR_BASE_URL = 'api/v1/vendor-purchase/vendor-reevaluation';

export const  VENDOR_RE_EVALUATION_CONSTANTS = {
    PAGE_TITLE : "Vendor Re-Evaluation",
    API_ENDPOINTS : {
        vendor_re_evaluation_list : `${VENDOR_BASE_URL}/all`,
        FETCH_BY_ID: (id: string) => `${VENDOR_BASE_URL}/${id}`,
        UPSERT: `${VENDOR_BASE_URL}/`,
        DELETE: (id: number) => `${VENDOR_BASE_URL}/${id}`,
        FETCH_CRITERIA_DETAILS: (criteriaId: number) => `api/v1/vendor-purchase/vendor-re-evaluation-criteria/details?part_category_id=${criteriaId}`
    },
    QUERY_KEY :{
        REEVALUATION_LIST : 'vendor-re-evaluation-list',
        REEVALUATION_BY_ID: 'vendor-re-evaluation-by-id',
        REEVALUATION_CRITERIA: 'vendor-re-evaluation-criteria'
    },
    ROUTES : {
        BASE_PATH : '/vendor-management/vendor-re-evaluation/',
        CREATE : 'create',
        LIST: '/vendor-management/vendor-re-evaluation',
    },
    LIST_PAGE_COLUMNS : {
        FIELD_NAME : {
            SNO : "sno",
            VENDOR_TYPE_NAME : "vendor_type_name",
            VENDOR_NAME : "vendor_name",
            PART_CATEGORY_NAME : "part_category_name",
            FROM_DATE : "from_date",
            TO_DATE : "to_date",
            STATUS : "status",
            ACTION : "action",
        },
        HEADER_NAME :{
            SNO : "S.No.",
            VENDOR_TYPE : "Vendor Type",
            VENDOR_NAME : "Vendor Name",
            PART_CATEGORY : "Part Category",
            FROM_DATE : "From Date",
            TO_DATE : "To Date",
            STATUS : "Status",
            ACTIONS : "Actions",
        }
    },
    ID_FIELD : "vendor_reevaluation_id",
    ROUTE_DETAIL : (id: number) => `/vendor-management/vendor-re-evaluation/${id}`
}

// Initial Form Data
export const INITIAL_FORM_DATA: VendorReEvaluationFormData = {
    vendor_reevaluation_id: NUMBERMAP.ZERO,
    vendor_type_id: NUMBERMAP.ZERO,
    vendor_id: NUMBERMAP.ZERO,
    part_category_mapper_id: NUMBERMAP.ZERO,
    re_evaluated_date: "",
    evaluation_from_date: "",
    evaluation_to_date: "",
    reevaluation_criteria: [],
    quality_rating: NUMBERMAP.ZERO,
    delivery_rating: NUMBERMAP.ZERO,
    supporting_rating: NUMBERMAP.ZERO,
    overall_rating: NUMBERMAP.ZERO,
    design_observation: "",
    manufacturing_observation: "",
    quality_control_observation: "",
    logistics_observation: "",
    customer_support_observation: "",
    conculation: "",
    response_quality_issues: [],
    re_evaluation_conclusion: "",
    status: null,
};

// Status Options
export const STATUS_OPTIONS = [
    { value: NUMBERMAP.ONE, label: "Yes" },
    { value: NUMBERMAP.ZERO, label: "No" },
];

// Rating Options
export const RATING_OPTIONS = [
    { key: "1", value: "1" },
    { key: "2", value: "2" },
    { key: "3", value: "3" },
    { key: "4", value: "4" },
    { key: "5", value: "5" },
];

// Observation Type Mapping
export const OBSERVATION_TYPE_MAP: Record<string, string> = {
    'design': 'design_observation',
    'manufacturing': 'manufacturing_observation',
    'quality': 'quality_control_observation',
    'logistics': 'logistics_observation',
    'support': 'customer_support_observation',
};

// Vendor Visit Areas
export const VENDOR_VISIT_AREAS = [
    { id: "design-1", area: "Design", field: "design_observation" },
    { id: "manufacturing-1", area: "Manufacturing", field: "manufacturing_observation" },
    { id: "quality-1", area: "Quality Control", field: "quality_control_observation" },
    { id: "logistics-1", area: "Logistics", field: "logistics_observation" },
    { id: "support-1", area: "Customer Support", field: "customer_support_observation" },
];

// Form Field Labels
export const FORM_LABELS = {
    VENDOR_TYPE: "Vendor Type*",
    VENDOR_NAME: "Vendor Name*",
    PART_CATEGORY: "Part Category*",
    LAST_RE_EVALUATION_ON: "Last Re-Evaluation On",
    FROM_DATE: "From Date",
    TO_DATE: "To Date",
    STATUS: "Status*",
    VENDOR_RE_EVALUATION_CRITERIA: "Vendor Re-Evaluation Criteria",
    PERFORMANCE: "Performance",
    VENDOR_VISIT: "Vendor Visit",
    CONCLUSION_OF_AUDIT_VISIT: "Conclusion of Audit/Visit*",
    RESPONSE_TO_QUALITY_ISSUES: "Response to Quality Issues Raised During the Period",
    CONCLUSION_OF_RE_EVALUATION: "Conclusion of Re-Evaluation*",
    FILE_UPLOAD: "File Upload*",
};

// Form Field Placeholders
export const FORM_PLACEHOLDERS = {
    SELECT_VENDOR_TYPE: "Select Vendor Type",
    SELECT_VENDOR_NAME: "Select Vendor Name",
    SELECT_PART_CATEGORY: "Select Part Category",
    SELECT_STATUS: "Select Status",
    INPUT_TEXT: "Input Text",
    OBSERVATION: "Observation",
    RATING: "Rating",
    ADD_NEW: "Add New",
};

// FormData Field Names
export const FORMDATA_FIELDS = {
    VENDOR_RE_EVALUATION_ID: 'vendor_reevaluation_id',
    PART_CATEGORY_MAPPER_ID: 'part_category_mapper_id',
    RE_EVALUATED_DATE: 're_evaluated_date',
    EVALUATION_FROM_DATE: 'evaluation_from_date',
    EVALUATION_TO_DATE: 'evaluation_to_date',
    REEVALUATION_CRITERIA: 'reevaluation_criteria',
    QUALITY_RATING: 'quality_rating',
    DELIVERY_RATING: 'delivery_rating',
    SUPPORTING_RATING: 'supporting_rating',
    OVERALL_RATING: 'overall_rating',
    DESIGN_OBSERVATION: 'design_observation',
    MANUFACTURING_OBSERVATION: 'manufacturing_observation',
    QUALITY_CONTROL_OBSERVATION: 'quality_control_observation',
    LOGISTICS_OBSERVATION: 'logistics_observation',
    CUSTOMER_SUPPORT_OBSERVATION: 'customer_support_observation',
    CONCULATION: 'conculation',
    RESPONSE_QUALITY_ISSUES: 'response_quality_issues',
    RE_EVALUATION_CONCLUSION: 're_evaluation_conclusion',
    STATUS: 'status',
    DOCUMENTS_TO_CREATE: 'documents_to_create',
    CREATE_META_DATA: 'create_meta_data',
    UPDATE_META_DATA: 'update_meta_data',
    DOCUMENTS_TO_DELETE: 'documents_to_delete',
};

// Document Metadata Keys
export const DOCUMENT_METADATA_KEYS = {
    EVALUATION_SUPPORTING_FILES: 'evaluation_supporting_files',
    GROUPS_SUPPORT: 'groups_support',
    REEVALUATION_SUPPORT: 'reevaluation_support',
};

// Status Values
export const STATUS_VALUES = {
    ACTIVE: 1,
    INACTIVE: 0,
};

// ID Prefixes
export const ID_PREFIXES = {
    QUALITY_ISSUE: 'issue-',
    PARENT_ROW: 'parent_',
    CHILD_ROW: 'child_',
    EXISTING_FILE: 'existing-',
};

// Button Labels
export const BUTTON_LABELS = {
    CANCEL: 'Cancel',
    SAVE: 'Save',
    VIEW_FILES: 'View/Upload Files',
};

// Column Headers
export const COLUMN_HEADERS = {
    AREAS: "Areas",
    OBSERVATION: "Observation",
    PERIOD: "Period",
    QUALITY_RATING_A: "Quality Rating A",
    DELIVERY_RATING_B: "Delivery Rating B",
    SUPPORT_RATING_C: "Support Rating C",
    OVERALL_RATING: "Overall Rating A+B+C",
    SNO: "S.No.",
    SL_NO_OF_PART_PRODUCT: "SL No. of Part/Product",
    ISSUE_RAISED_AND_DATA: "Issue Raised and Data",
    RESOLUTION_AND_DATA: "Resolution and Data",
    EFFECTIVENESS: "Effectiveness",
    STATUS: "Status",
    ACTIONS: "Actions",
};

// Status Display Text
export const STATUS_DISPLAY = {
    ACTIVE: 'Active',
    INACTIVE: 'InActive',
};

// Table Field Names
export const TABLE_FIELD_NAMES = {
    AREA: "area",
    OBSERVATION: "observation",
    PERIOD: "period",
    QUALITY_RATING: "qualityRating",
    DELIVERY_RATING: "deliveryRating",
    SUPPORT_RATING: "supportRating",
    OVERALL_RATING: "overallRating",
    SNO: "sno",
    SERIAL_NUMBER: "serial_number",
    ISSUE_RAISED: "issue_raised",
    RESOLUTION: "resolution",
    EFFECTIVENESS: "effectiveness",
    STATUS: "status",
    ACTIONS: "actions",
};

// Dropdown Key and Value Fields
export const DROPDOWN_FIELDS = {
    KEY: {
        RATING: "key",
        VENDOR_TYPE: "id",
        VENDOR: "id",
        PART_CATEGORY: "part_category_id",
        STATUS: "status_id",
    },
    VALUE: {
        RATING: "value",
        VENDOR_TYPE: "vendor_type_name",
        VENDOR: "vendor_name",
        PART_CATEGORY: "part_category_name",
        STATUS: "status_name",
    },
};
export const fieldsToValidation = ['design_observation','manufacturing_observation','quality_control_observation','logistics_observation','customer_support_observation','conculation','re_evaluation_conclusion']

// Validation Error Messages
export const VALIDATION_ERROR_MESSAGES = {
    VENDOR_TYPE_REQUIRED: "Vendor Type is Required",
    VENDOR_NAME_REQUIRED: "Vendor Name is Required",
    PART_CATEGORY_REQUIRED: "Part Category is Required",
    STATUS_REQUIRED: "Status is Required",
    PERFORMANCE_RATINGS_REQUIRED: "Performance Ratings is Required",
    design_observation: "Design observation field is Required",
    manufacturing_observation: "Manufacturing observation field is Required",
    quality_control_observation: "Quality Control observation field is Required",
    logistics_observation: "Logistics observation field is Required",
    customer_support_observation: "Customer Support observation field is Required",
    conculation: "Conclusion of Audit/Visit field is Required",
    re_evaluation_conclusion: "Conclusion of Re-Evaluation field is Required",
    RESPONSE_QUALITY_ISSUES_REQUIRED: "Response to Quality Issues Raised During the Period is mandatory",
    FILE_UPLOAD_REQUIRED: "At least one file is required",
    MINIMUM_SCORE_REQUIRED: "Minimum score required is 10 out of 15",
};

export const VENDOR_REEVALUATION_HINTS ={
    PERFORMANCE_HINT : `Evaluation based on a 1-5 scale (data provided by QAD); on an average score of at least 10 out of 15 is required for acceptance`
}


export const CRITERIA_COLUMNS = (criteriaColumnRenderCell: (params: { row: VendorCriteria }) => ReactNode) => ([

  {
    field: 'criteria',
    headerName: 'Criteria',
    flex: NUMBERMAP.ONE,
    sortable: false,
    filterable: false,
    renderCell: criteriaColumnRenderCell,
  },
  {
    field: 'requirement',
    headerName: 'Requirement',
    flex: NUMBERMAP.ONE,
    sortable: false,
    filterable: false,
    renderCell: (params: { row: VendorCriteria }) => {
      const row = params.row;
      const isParent = row?.isParent;
      if (isParent) {
        // If parent has requirement data, show it, otherwise show dash
        return row.requirement && row.requirement !== '-' ? row.requirement : '-';
      }
      return params.value ?? ''
    },
  }
])