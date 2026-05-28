import { NUMBERMAP } from "@/constants/common";
import { GridColDef } from "@mui/x-data-grid";
import { ALERT_MESSAGES_COMMON } from "./common";
import { ErrorItem } from "@/types/validation";
/**
    Classification : Confidential
**/

const BASE_API_PATH = 'api/v1/vendor-purchase/agreement-checklist';
export const API_ENDPOINTS = {
    FETCH_ALL: `${BASE_API_PATH}/all`,
    FETCH_BY_ID: (agreementChecklistId: string) => `${BASE_API_PATH}/${agreementChecklistId}`,
    UPSERT: `${BASE_API_PATH}/`
};

export const VENDOR_AGREEMENT_CHECKLIST_HOOK = 'vendorAgreementChecklist';
export const VENDOR_AGREEMENT_CHECKLIST_BY_ID_HOOK = 'vendorAgreementChecklistById';

export const VENDOR_AGREEMENT_CHECKLIST_CONSTANTS = {
  TITLE: "Vendor Agreement Checklist",
  PATH_NAME: "/vendor-management/vendor-agreement-checklist",
  ACTIVE_STATUS_TEXT: "Active",
  INACTIVE_STATUS_TEXT: "Inactive",
};

export const vendorAgreementChecklistColumns :GridColDef[] = [
  {
    field: "sno",
    headerName: "S.No.",
    flex: NUMBERMAP.HALF,
  },
  {
    field: "vendor_type",
    headerName: "Vendor Type",
    flex: NUMBERMAP.ONE,
  },
  {
    field: "vendor_name",
    headerName: "Vendor Name",
    flex: NUMBERMAP.ONE_HALF,
  },
  {
    field: "contact_number",
    headerName: "Contact Number",
    flex: NUMBERMAP.ONE_HALF,
  },
  {
    field: "status",
    headerName: "Status",
    flex: NUMBERMAP.ONE,
  },
];

export const VENDOR_AGREEMENT_CHECKLIST_LIST_COLUMNS = {
  SNO: {
    FIELD: "sno",
    HEADER: "S.No.",
    FLEX: NUMBERMAP.HALF,
  },
  CHECKLIST_ITEM: {
    FIELD: "check_list_item",
    HEADER: "Checklist Item",
    FLEX: NUMBERMAP.TWO,
  },
  STATUS: {
    FIELD: "status",
    HEADER: "Status",
    FLEX: NUMBERMAP.HALF,
  },
};
export const INITIAL_VENDOR_AGREEMENT_CHECKLIST = {
  vendor_id: null,
  vendor_agreement_checklist_id: "",
  checklist_details: []
};

export const INITIAL_CHECKLIST_DETAIL = {
  vendor_agreement_checklist_status_id: "",
  checklist_id: null,
  checklist_status: 1
};

export const BUTTON_LABELS = {
  submitForReview: "Submit for Review",
  submitForApproval: "Submit for Approval",
  approve: "Approve",
  reject: "Reject",
  cancel: "Cancel",
  save: "Save",
};

export const ALERT_MESSAGES = {
  ...ALERT_MESSAGES_COMMON,
  DELETE_CONFIRMATION: "Are you sure you want to delete this vendor agreement checklist?",
  DELETE_CONFIRMATION_TEXT: "Are you sure you want to delete this vendor agreement checklist?",
  SUCCESS_TEXT: "Vendor agreement checklist deleted successfully!",
};

export const DATA_GRID_CONSTANTS = {
  ID_FIELD: "id",
  CHECKBOX: false,
  CUSTOM_CLASS_NAME: "vendor-agreement-checklist",
};

export const VENDOR_AGREEMENT_CHECKLIST_TITLE = "Vendor Agreement Checklist";

export const VENDOR_AGREEMENT_CHECKLIST_FIELD_LABELS = {
  VENDOR_TYPE: {
    LABEL: "Vendor Type*",
    PLACEHOLDER: "Select Vendor Type",
    keyField: "id",
    valueField: "vendor_type_name",
  },
  VENDOR_NAME: {
    LABEL: "Vendor Name*",
    PLACEHOLDER: "Select Vendor Name",
    keyField: "id",
    valueField: "vendor_name",
  },
  STATUS: {
    LABEL: "Status*",
    PLACEHOLDER: "Select Status",
    keyField: "status_id",
    valueField: "status_name",
  }
}

export const ERROR_MESSAGES = {
  VENDOR_TYPE_ID: 'Vendor Type Required',
  VENDOR_NAME: 'Vendor Name Required',
  CHECKLIST_STATUS_REQUIRED: 'All checklist items must have a status selected',
  STATUS_REQUIRED: 'Status is required',
} as const

export const FIELD_NAMES = {
  VENDOR_ID: 'vendorId',
  VENDOR_TYPE_ID: 'vendorTypeId',
  STATUS: 'status_id',
} as const

export const INITIAL_ERRORS = {
  vendorId: '',
  vendorTypeId: '',
  checklistStatus: '',
  status_id: '',
}

export const STATUS_DROPDOWN_CONFIG = {
  KEY_FIELD: 'status_id',
  VALUE_FIELD: 'status_name',
} as const

export const vendorAgreementChecklistErrorItems: ErrorItem[] = [
  {
    field: 'vendorId',
    errormessage: ERROR_MESSAGES.VENDOR_NAME,
    type: 'number',
    errorKey: 'vendorId',
  },
  {
    field: 'vendorTypeId',
    errormessage: ERROR_MESSAGES.VENDOR_TYPE_ID,
    type: 'number',
    errorKey: 'vendorTypeId',
  },
  {
    field: 'status_id',
    errormessage: ERROR_MESSAGES.STATUS_REQUIRED,
    type: 'number',
    errorKey: 'status_id',
  },
]

export const DRAFT_STATUS_TEXT = 'draft';

export const VENDOR_AGREEMENT_CHECKLIST_LIST_PATH = "/vendor-management/vendor-agreement-checklist";
