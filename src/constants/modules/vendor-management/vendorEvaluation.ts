import { NUMBERMAP } from "@/constants/common";
import { BUTTONLABELS } from "@/lib/utils/common";
import { GridColDef } from "@mui/x-data-grid";
import { ALERT_MESSAGES_COMMON } from "./common";
/**
 * Classification : Confidential
**/

const BASE_API_PATH = 'api/v1/vendor-purchase/vendor-evaluation';
export const API_ENDPOINTS = {
    FETCH_ALL: `${BASE_API_PATH}/all`,
    FETCH_BY_ID: (evaluationId: string) => `${BASE_API_PATH}/${evaluationId}`,
    UPSERT: `${BASE_API_PATH}/`
};

export const VENDOR_EVALUATION_HOOK = 'vendorEvaluation';
export const VENDOR_EVALUATION_BY_ID_HOOK = 'vendorEvaluationById';

export const VENDOR_EVALUATION_CONSTANTS = {
  TITLE: "Vendor Evaluation",
  PATH_NAME: "/vendor-management/vendor-evaluation",
  ACTIVE_STATUS_TEXT: "Active",
  INACTIVE_STATUS_TEXT: "Inactive",
};

export const vendorEvaluationColumns: GridColDef[] = [
  {
    field: "sno",
    headerName: "S.No.",
    flex: NUMBERMAP.HALF,
  },
  {
    field: "vendor_name",
    headerName: "Vendor Name",
    flex: NUMBERMAP.ONE,
  },
  {
    field: "part_category_name",
    headerName: "Part Category",
    flex: NUMBERMAP.ONE,
  },
  {
    field: "part_category_type",
    headerName: "Category Type",
    flex: NUMBERMAP.ONE,
  },
  {
    field: "part_sub_class",
    headerName: "Sub Class",
    flex: NUMBERMAP.ONE,
  },
  {
    field: "part_sub_type",
    headerName: "Sub Type",
    flex: NUMBERMAP.ONE,
  },
];

export const VENDOR_EVALUATION_LIST_COLUMNS = {
  SNO: {
    FIELD: "sno",
    HEADER: "S.No.",
    FLEX: NUMBERMAP.HALF,
  },
  VENDOR_NAME: {
    FIELD: "vendor_name",
    HEADER: "Vendor Name",
    FLEX: NUMBERMAP.ONE,
  },
  PRODUCT_NAME: {
    FIELD: "product_name",
    HEADER: "Product Name",
    FLEX: NUMBERMAP.ONE,
  },
  MODEL_NAME: {
    FIELD: "model_name",
    HEADER: "Model Name",
    FLEX: NUMBERMAP.ONE,
  },
  STATUS: {
    FIELD: "status",
    HEADER: "Status",
    FLEX: NUMBERMAP.HALF,
  },
};

export const INITIAL_VENDOR_EVALUATION = {
  create_meta_data: "",
  update_meta_data: "",
  documents_to_create: "",
  documents_to_delete: "",
  audit_conclusion: "",
  customer_support_observation: "",
  logistics_observation: "",
  quality_control_observation: "",
  manufacturing_observation: "",
  design_observation: "",
  vendor_part_category_mapper_id: null,
  criteria_evaluations: []
};

export const INITIAL_OBSERVATION = {
  area: "",
  observation: ""
};

export const BUTTON_LABELS = BUTTONLABELS

export const ALERT_MESSAGES = {
 ...ALERT_MESSAGES_COMMON,
  DELETE_CONFIRMATION: "Are you sure you want to delete this vendor evaluation?",
  DELETE_CONFIRMATION_TEXT: "Are you sure you want to delete this vendor evaluation?",
  SUCCESS_TEXT: "Vendor evaluation deleted successfully!",
};

export const DATA_GRID_CONSTANTS = {
  ID_FIELD: "id",
  CHECKBOX: false,
  CUSTOM_CLASS_NAME: "vendor-evaluation",
};

export const VENDOR_EVALUATION_TITLE = "Vendor Evaluation";

export const VENDOR_EVALUATION_FIELD_LABELS = {
  VENDOR_PART_CATEGORY: {
    LABEL: "Vendor Part Category*",
    PLACEHOLDER: "Select Vendor Part Category",
    keyField: "id",
    valueField: "category_name",
  },
  AUDIT_CONCLUSION: {
    LABEL: "Audit Conclusion*",
    PLACEHOLDER: "Enter audit conclusion",
  }
};

export const VENDOR_EVALUATION_LIST_PATH = "/vendor-management/vendor-evaluation";

// Observation areas for different types
export const OBSERVATION_AREAS = {
  CUSTOMER_SUPPORT: "Customer Support",
  LOGISTICS: "Logistics", 
  QUALITY_CONTROL: "Quality Control",
  MANUFACTURING: "Manufacturing",
  DESIGN: "Design"
};

export const FORM_LABELS = {
  AUDIT_CONCLUSION: "Conclusion of Audit/Visit",
}