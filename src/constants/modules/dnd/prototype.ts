/**
 Classification : Confidential
**/

import { NUMBERMAP } from "@/constants/common";
import { GridColDef } from "@mui/x-data-grid";
import { DESIGN_REVIEW_STATUS_TABLE } from "./designReviewReport";

export const PROTOTYPE_STATUS = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
};
export const PROTOTYPE_STATUS_CODE = {
  ACTIVE: 1,
  INACTIVE: 0,
};
export const DELIVERABLES = 'deliverables'
export const ACTIVE = 'ACTIVE'
export const INACTIVE = 'INACTIVE'


export const ACTION_TYPES = {
  EDIT: "edit",
  DELETE: "delete",
} as const;

export type ActionType = keyof typeof ACTION_TYPES;
export type ActionValue = (typeof ACTION_TYPES)[ActionType];

export const COLUMN_FIELDS = {
  SERIAL_NUMBER: "serialNumber",
  ID: "id",
  ROLE: "role",
  STATUS: "status",
  ACTIONS: "actions",
};

export const COLUMN_HEADERS = {
  ID: "S.No.",
  ROLE: "Stage",
  STATUS: "Status",
  ACTIONS: "Action",
};

export const COLUMN_WIDTH = {
  ID: 200,
  ROLE: 300,
  STATUS: 250,
  ACTIONS: 200,
};

export const PLACEHOLDER = {
  DESCRIPTION: 'Enter description',
  OTHER_DETAILS: 'Enter other details',
  ADDITIONAL_REQUIREMENTS: 'Enter additional requirements',
  REMARKS: 'Enter remarks',
  CONCLUSION: 'Enter conclusion',
  INPUT_TEXT: 'Input Text',
}

export const TOOLTIP_TITLES = {
  VERIFICATION: "Generate Verification Report",
  REPORT: "Design Review Report",
};
export const FETCH_ACTIONS = "fetchActions";
export const PAGE_TITLE = "List Prototype";
export const ID_FIELD = 'id';
export const BASE_INDEX = 1;
export const API_ENDPOINTS = {
  GET_PROTOTYPE_PROJECT_STAGE: (projectId: number) =>
    `api/v1/dnd/execution-stage/project-stage-type/${projectId}`,

  POST_PROTOTYPE: (projectId: number) => `api/v1/dnd/execution-stage/${projectId}`,
  GET_ACTION: (execution_stage_id: number) => `api/v1/dnd/design-review-report/${execution_stage_id}`,
};
export const QUERY_KEYS = {
  PROTOTYPE_LIST: ["prototypeList"],
};
export const TOOLTIP_PLACEMENT = {
  TOP: 'top',
};
export const ICON_SIZES = {
  MEDIUM: 28,
};
export const DESIGN_STAGES = {
  PROTOTYPE: "Prototype",
};
export const POSTPROTOTYPE = "postPrototype";
export const UNDERLINE = "underline";
export const PROJECT_STAGE_ORDER_ID = 'project_stage_order_id'

export const PROTOTYPE_ROUTES = {
  PROTOTYPE_DETAIL: "/dnd/project-stages/prototype/",
};

export const PROTOTYPE_LIST_SCREEN = (projectId: number) =>
  `/dnd/prototype/${projectId}`;


export const DESIGN_REVIEW_SCREEN = (
  projectStageOrderId: number | string,
  projectId: number | string
): string =>
  `/dnd/design-review/${projectId}?project_stage_order_id=${projectStageOrderId}`;


export const PROJECT_ID = 'project_id';

export const PROTOTYPE_STAGE_ROUTE = '/dnd/project-stages/prototype/'
export const PILOT_STAGE_ROUTE = '/dnd/pilot/add/'

export const getColumns = (): GridColDef[] => [
  {
    field: DESIGN_REVIEW_STATUS_TABLE.FIELDNAME.SNO,
    headerName: DESIGN_REVIEW_STATUS_TABLE.HEADERNAME.SNO,
    flex: NUMBERMAP.ONE,

  },
  {
    field: DESIGN_REVIEW_STATUS_TABLE.FIELDNAME.MEMBER_NAME,
    headerName: DESIGN_REVIEW_STATUS_TABLE.HEADERNAME.MEMBER_NAME,
    flex: NUMBERMAP.ONE,
    renderCell: (params) => {
      const firstName = params.row.firstName ?? ''
      const lastName = params.row.lastName ?? ''
      const fullName = `${firstName} ${lastName}`.trim()
      return fullName ?? '-'
    },
  },
  {
    field: DESIGN_REVIEW_STATUS_TABLE.FIELDNAME.ROLE,
    headerName: DESIGN_REVIEW_STATUS_TABLE.HEADERNAME.ROLE,
    flex: NUMBERMAP.ONE,
  },
  {
    field: DESIGN_REVIEW_STATUS_TABLE.FIELDNAME.STATUS,
    headerName: DESIGN_REVIEW_STATUS_TABLE.HEADERNAME.STATUS,
    flex: NUMBERMAP.ONE,
  },

]
