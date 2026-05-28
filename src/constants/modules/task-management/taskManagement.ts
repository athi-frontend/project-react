import { NUMBERMAP } from "@/constants/common"

export const BASE_API__TM_PMS = "api/v1/pms"
export const API_ENDPOINTS_TM = {
  GET_PROJECT_TYPE_MODULE_ALL: `${BASE_API__TM_PMS}/project-type-module/all`,
  GET_TASK_TRANSITION_TASKS_ALL: `${BASE_API__TM_PMS}/task-transition/tasks/all`,
} as const

export const TM_QUERY_KEYS = {
  PROJECT_TYPE_MODULE: 'project-type-module',
  TASK_TRANSITION: 'task-transition',
  COMBINED_TASK_DATA: 'combined-task-data',
} as const

const createColumn = (field: string, headerName: string) => ({
  field,
  headerName,
  flex: NUMBERMAP.ONE,
});

export const TM_TABLE_COLUMNS = [
  createColumn("sno", "S.No."),
  createColumn("task", "Task"),
  createColumn("projectName", "Project Name"),
  createColumn("moduleName", "Module Name"),
  createColumn("taskDescription", "Task Description"),
  createColumn("assignedDate", "Assigned Date"),
  createColumn("status", "Status"),
];

export const TM_TYPOGRAPHY_VARIANT = "h4"
export const TM_ID_FIELD = "id"

const SMALL = "small";
const BODY2 = "body2";
const VERTICAL = "vertical";
const HORIZONTAL = "horizontal";
const RIGHT = "right";
const BOTTOM = "bottom";
const TOP = "top";
const LEFT = "left";

const SEARCH_TEXT = "Search";
const VIEW_ALL_TEXT = "View All";
const ALL_TEXT = "All";
const NO_MODULE_FOUND_TEXT = "No module name found";

export const TASK_MANAGEMENT = {
  ICON_BUTTON_SIZE: SMALL,
  TYPOGRAPHY_VARIANT: BODY2,
  DIVIDER_ORIENTATION: VERTICAL,
  COLLAPSE_ORIENTATION: HORIZONTAL,
  INPUT_FIELD_PLACEHOLDER: "Search here...",
  SEARCH_LABEL: SEARCH_TEXT,
  VIEW_ALL_LABEL: VIEW_ALL_TEXT,
  MENU_ANCHOR_VERTICAL: BOTTOM,
  MENU_ANCHOR_HORIZONTAL: RIGHT,
  MENU_TRANSFORM_VERTICAL: TOP,
  MENU_TRANSFORM_HORIZONTAL: RIGHT,
  LEFT,
  ALL_MODULES_OPTION: ALL_TEXT,
  PAGE_TITLE: "Task Management",
  NO_MODULE_FOUND: NO_MODULE_FOUND_TEXT,
  COMBINED_TASK_DATA_FETCH_SUCCESS: "combined_task_data_fetch_success",
} as const;