/**
Classification : Confidential
**/
import {
  ProjectFormData,
  FormErrors,
  FormFieldConfig,
  FieldMapping,
  ButtonConfig,
} from '@/types/modules/dnd/projectPlan'

import { DESIGN_TEAM_COLUMNS } from '@/constants/designTeamConstants'
import {
  FILE_INFO_COLUMNS,
  FILE_INFO_ROWS,
} from '@/constants/fileInfoTableConstants'
import { GridColDef } from '@mui/x-data-grid'
import { NUMBERMAP } from '@/constants/common'
import { DATA_GRID_CONSTANTS } from '@/constants/components/ui/dataGrid'


export const DRAGANDDROP = "/images/fluent_drag-20-regular.svg"
export const PROJECT_PLAN_TITLES = {
  DESIGN_PROJECT_PLAN_TITLE: 'Design Project Plan',
  PROJECT_STAGES_TITLE: 'Project Stages',
  DESIGN_TEAM_TITLE: 'Design Team',
  ADD_TEAM_TITLE: 'Add Team',
  QMS_PROCEDURES_AND_DOCUMENTS_TITLE: 'QMS Procedures and Documents',
  DESIGN_TRANSFER_TITLE: 'Design Transfer',
  SELECT_TITLE: 'Select',
};

export const STAGE_RESOURCE_TITLE = 'Stage Resources / Deliverables'

export const DISPLAY_DATE_FORMAT = 'MMM dd'
export const MONTH_YEAR_FORMAT = 'MMMM yyyy'
export const YEAR_MONTH_FORMAT = 'yyyy-MM'
export const DATE_FORMAT = 'yyyy-MM-dd'
export const SIZE = 'small'
export const WEIGHT = 'bold'
export const FINAL_SUBMIT = 'finalSubmit'
export const PROJECT_BUTTONS = {
  SAVE: 'Save',
  CANCEL: 'Cancel',
  CLOSE: 'close',
}
export const StageOptions = [
  { key: 'stage1', value: 'Stage 1' },
  { key: 'stage2', value: 'Stage 2' },
  { key: 'stage3', value: 'Stage 3' },
]

export { DESIGN_TEAM_COLUMNS, FILE_INFO_COLUMNS, FILE_INFO_ROWS }

export const COMPONENT_TYPES = {
  INPUT_FIELD: 'INPUT_FIELD',
  RICH_TEXT_EDITOR: 'RICH_TEXT_EDITOR',
  MULTI_SELECT: 'MULTI_SELECT',
  FILE_UPLOAD: 'FILE_UPLOAD',
  DESCRIPTION: 'DESCRIPTION'
}

export const FIELD_KEYS = {
  DESIGN_TYPE: 'designType' as const,
  BASIC_MODEL: 'basicModel' as const,
  DESIGN_OBJECTIVE: 'designObjective' as const,
  MARKETS_INTENDED: 'marketsIntended' as const,
  RISK_MANAGEMENT: 'riskManagement' as const,
  VERIFICATION_METHOD: 'verificationMethod' as const,
  VALIDATION_METHOD: 'validationMethod' as const,
  OTHER_DETAILS: 'otherDetails' as const,
  TRACEABILITY_METHOD: 'traceabilityMethod' as const,
  TOOLS: 'tools' as const,
  EQUIPMENTS: 'equipments' as const,
  DESIGN_TRANSFER: 'designTransfer' as const,
  DOCUMENT_REFERENCES: 'documentReferences' as const,
}

export const BUTTON_HANDLER_KEYS = {
  HANDLE_SUBMIT: 'HANDLE_SUBMIT',
  SEND_FOR_REVIEW: 'SEND_FOR_REVIEW',
  SEND_FOR_APPROVAL: 'SEND_FOR_APPROVAL',
  APPROVE: 'APPROVE',
  REJECT: 'REJECT',
  CANCEL: 'CANCEL',
  INITIATE_DESIGN_INPUT_GATHERING: 'INITIATE_DESIGN_INPUT_GATHERING',
}

export const VALIDATION_MESSAGES = {
  FIELD_REQUIRED: (fieldName: string) => `${fieldName} is required`,
  TOOLS_REQUIRED: 'Tools and Equipment are required',
  DESIGN_TRANSFER_REQUIRED: 'Design Transfer is required',
  SCHEDULE_REQUIRED: 'Schedule is required',
}

export const INITIAL_FORM_DATA: ProjectFormData = {
  designType: '',
  basicModel: '',
  designObjective: '',
  marketsIntended: [],
  riskManagement: '',
  verificationMethod: '',
  validationMethod: '',
  otherDetails: '',
  traceabilityMethod: '',
  models: [],
  documentReferences: [],
  uploadedFile: [],
  documentIdToDelete: [],
  tools: [],
  equipments: [],
  designTransfer: [],
  toolsRequired: [],
  equipmentsRequired: [],
  schedule: [],
  stageData: [],
  projectStages: [],
  stageResources: [],
  designTeam: [],
}

export const INITIAL_ERRORS: FormErrors = {
  designType: '',
  basicModel: '',
  designObjective: '',
  marketsIntended: '',
  riskManagement: '',
  verificationMethod: '',
  validationMethod: '',
  otherDetails: '',
  traceabilityMethod: '',
  tools: '',
  equipments: '',
  designTransfer: '',
  documentReferences: '',
}

export const FIELD_MAPPING: FieldMapping[] = [
  { field: FIELD_KEYS.DESIGN_OBJECTIVE, name: 'Design Objective' },
  { field: FIELD_KEYS.VERIFICATION_METHOD, name: 'Verification Method' },
  { field: FIELD_KEYS.VALIDATION_METHOD, name: 'Validation Method' },
  { field: FIELD_KEYS.TOOLS, name: 'Tools' },
  { field: FIELD_KEYS.EQUIPMENTS, name: 'Equipments' },
  { field: FIELD_KEYS.DESIGN_TRANSFER, name: 'Design Transfer' },
]

export const FORM_FIELDS: FormFieldConfig[] = [
  {
    field: FIELD_KEYS.DESIGN_OBJECTIVE,
    label: 'Design Objective*',
    placeholder: 'Enter Design Objective',
    required: true,
    type: COMPONENT_TYPES.RICH_TEXT_EDITOR,
  },
  {
    field: FIELD_KEYS.TOOLS,
    label: 'Tools Required*',
    placeholder: 'Select tools',
    required: true,
    type: COMPONENT_TYPES.MULTI_SELECT,
    idField: 'tool_id',
    valueField: 'tool_name',
  },
  {
    field: FIELD_KEYS.EQUIPMENTS,
    label: 'Equipment Required*',
    placeholder: 'Select equipments',
    required: true,
    type: COMPONENT_TYPES.MULTI_SELECT,
    idField: 'equipment_id',
    valueField: 'equipment_name',
  },
  {
    field: FIELD_KEYS.RISK_MANAGEMENT,
    label: 'Risk Management Activities',
    placeholder: 'Enter Risk Management Activities',
    type: COMPONENT_TYPES.DESCRIPTION,
  },
  {
    field: FIELD_KEYS.TRACEABILITY_METHOD,
    label: 'Method of traceability of outputs to inputs',
    placeholder: 'Method of traceability of outputs to inputs',
    type: COMPONENT_TYPES.DESCRIPTION,
  },
  {
    field: FIELD_KEYS.VERIFICATION_METHOD,
    label: 'Verification Method*',
    placeholder: 'Enter Verification Method',
    required: true,
    type: COMPONENT_TYPES.RICH_TEXT_EDITOR,
  },
  {
    field: FIELD_KEYS.VALIDATION_METHOD,
    label: 'Validation Method*',
    placeholder: 'Enter Validation Method',
    required: true,
    type: COMPONENT_TYPES.RICH_TEXT_EDITOR,
  },
  {
    field: FIELD_KEYS.OTHER_DETAILS,
    label: 'Other Details (if any)',
    placeholder: 'Enter Other Details',
    type: COMPONENT_TYPES.RICH_TEXT_EDITOR,
  },
]

export const BUTTONS: ButtonConfig[] = [
  {
    label: 'Initiate Design Input Gathering',
    handlerKey: BUTTON_HANDLER_KEYS.INITIATE_DESIGN_INPUT_GATHERING,
  },
  {
    label: 'Cancel',
    handlerKey: BUTTON_HANDLER_KEYS.CANCEL,
  },
  {
    label: 'Save',
    handlerKey: BUTTON_HANDLER_KEYS.HANDLE_SUBMIT,
  },
]

export const CLASS_NAMES = {
  CONTAINER: 'design-project-plan-container',
  CONTENT_WRAPPER: 'design-project-plan-content-wrapper',
  SECTION_TITLE: 'section-title',
  FORM_SECTION: 'form-section',
}

export const ALERT_TYPES = {
  DELETE: 'delete',
  SUCCESS: 'success',
  FAILED: 'failed',
} as const;

export type AlertType = typeof ALERT_TYPES[keyof typeof ALERT_TYPES];

export const DRAG_DROP_TYPES = {
  MOVE: 'move',
  TOP: 'top',
  BOTTOM: 'bottom',
} as const;

export type DragDropType = typeof DRAG_DROP_TYPES[keyof typeof DRAG_DROP_TYPES];

export const QUERY_KEYS = {
  DESIGN_TOOLS: ['designTools'],
  DESIGN_EQUIPMENTS: ['designEquipments'],
  DESIGN_TRANSFER: (projectId: number) => ['designTransfer', projectId],
  DOC_REF: (projectId: number) => ['docRef', projectId],
  DESIGN_INPUT_GATHERING: 'designInputGathering',
  PROJECT_PLAN: (projectId: number) => ['projectPlan', projectId],
  DESIGN_TEAM: (projectId: string) => ['designTeam', projectId],
}

export const API_ENDPOINTS = {
  DESIGN_TOOLS: 'api/v1/dnd/design-tools-equipment/tools/all?status=1',
  DESIGN_EQUIPMENTS: 'api/v1/dnd/design-tools-equipment/all?status=1',
  DESIGN_TRANSFER: (projectId: number) =>
    `api/v1/dnd/design-transfer/project/${projectId}`,
  DOCUMENT_REFERENCE: 'api/v1/dnd/document-reference/all',
  POST_DOCUMENT_REFERENCE: 'api/v1/dnd/document-reference',
  PROJECT_PLAN: (projectId: number) =>
    `api/v1/dnd/design-project-plan/${projectId}`,
  DESIGN_TEAM: (projectId: string) =>
    `api/v1/dnd/teams/all?project_id=${projectId}`,
  UPSERT_PROJECT_PLAN: 'api/v1/dnd/design-project-plan/',
  GET_DESIGN_INPUT_GATHERING: (projectId: number) =>
    `api/v1/dnd/design-quality-plan?project_id=${projectId}`,
  UPSERT_DESIGN_INPUT_GATHERING: 'api/v1/dnd/design-quality-plan',
  GET_STAGE_WISE_LIST_BY_ID: (stageId: number) =>
    `api/v1/dnd/design-project-plan/stage-wise-deliverable/${stageId}`,
  UPSERT_STAGE_WISE: `api/v1/dnd/design-project-plan/stage-wise-deliverable`,
}
export const DOCUMENT_STATUS = {
  ACTIVE: 'Active',
  PENDING: 'Pending',
}

export const FIELD_NAMES = {
  TOOLS_REQUIRED: 'toolsRequired',
  EQUIPMENTS_REQUIRED: 'equipmentsRequired',
  TOOLS: 'tools',
  EQUIPMENTS: 'equipments',
  DESIGN_TRANSFER: 'designTransfer',
  DOCUMENT_REFERENCES: 'documentReferences',
}

export const BUTTON_LABELS = {
  ADD_STAGE: 'Add Stage',
}

export const LABEL_TEXTS = {
  DESIGN_TYPE: 'Design Type',
  BASIC_MODEL: 'Model (if derivative)',
  MARKETS_INTENDED: 'Markets / Intended',
}

export const MARKET_REGULATION_TABLE_HEADERS = {
  S_NO: 'S.No.',
  MARKET: 'Market',
  REGULATIONS: 'Regulations',
}

export const MARKET_REGULATION_EMPTY_STATE = 'No market regulations found'

export const MARKET_REGULATION_COLUMNS: GridColDef[] = [
  {
    field: DATA_GRID_CONSTANTS.SNO,
    headerName: MARKET_REGULATION_TABLE_HEADERS.S_NO,
    flex: NUMBERMAP.ONE,
  },
  {
    field: 'market_name',
    headerName: MARKET_REGULATION_TABLE_HEADERS.MARKET,
    flex: NUMBERMAP.ONE,
  },
  {
    field: 'regulation_name',
    headerName: MARKET_REGULATION_TABLE_HEADERS.REGULATIONS,
    flex: NUMBERMAP.ONE,
  },
]

export const TOOLTIP_DISPLAY = {
  ARROW_PLACEMENT: 'top',
}
export const TYPE_NAMES = {
  STRING: 'string',
}

export const API_FIELD_KEYS = {
  PROJECT_ID: 'project_id',
  DESIGN_OBJECTIVE: 'design_objective',
  SCHEDULE: 'schedule',
  STAGE_ORDER:'stage_order',
  TOOLS: 'tools',
  EQUIPMENTS: 'equipments',
  RISK_MANAGEMENT_ACTIVITIES: 'risk_management_activities',
  VERIFICATION_METHOD: 'verification_method',
  VALIDATION_METHOD: 'validation_method',
  DESIGN_TRANSFER: 'design_transfer',
  DOCUMENT_REFERENCE: 'document_reference',
  OTHER_DETAILS: 'other_details',
  METHOD_OF_TRACEABILITY: 'method_of_traceability',
  DOCUMENTS_TO_CREATE: 'documents_to_create',
  DOCUMENTS_TO_DELETE: 'documents_to_delete',
  CREATE_META_DATA: 'create_meta_data',
  UPDATE_META_DATA: 'update_meta_data',
}

export const TOOL_PAYLOAD_KEYS = {
  IS_NEW: 'is_new_tool',
  NAME: 'tool_name',
  ID: 'tool_id',
}

export const EQUIPMENT_PAYLOAD_KEYS = {
  IS_NEW: 'is_new_equipment',
  NAME: 'equipment_name',
  ID: 'equipment_id',
}

export const SCHEDULE_COLUMNS = {
  SERIAL_NO: 's_no',
  STAGE_ORDER_ID: 'stage_order_id',
  DESCRIPTOIN: 'description',
  STAGE_NAME: 'stage_name',
  START_DATE: 'start_date',
  END_DATE: 'end_date',
}

export const SCHEDULE_HEADERS = {
  SERIAL_NO: 'S.No',
  DESCRIPTION: 'Description / Activities',
  PROJECT_ID: 'Project ID',
  PRODUCT_NAME: 'Product Name',
  PRODUCT_CATEGORY: 'Product Category',
  PRODUCT_TYPE: 'Product Type',
  PRODUCT_SUBTYPE: 'Product Sub Type',
  PROJECT_REASON: 'Reason',
  SUB_STATUS: 'Sub Status',
  STATUS: 'Status',
  ACTION: 'Action',
}
export const GRID_SIZE = 12

export const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

export const DATE_PICKER_ERRORS = {
  REQUIRED_START_DATE: 'Start date is required',
  REQUIRED_END_DATE: 'End date is required',
  END_DATE_AFTER_START_DATE: 'End date must be after start date',
}

export const TOTAL_MONTHS = 12

export const STAGE_FORM = {
  ARIA_FIELD: 'stage-resources-modal',
  ARIA_DESCRIBED: 'stage-resources-form',
  OWNER: 'Owner*',
  OWNER_PLACEHOLDER: 'Enter Owner',
  KEY_FIELD: 'id',
  MARKET_ID: 'market_id',
  VALUE_FIELD: 'employee_name',
  INPUTS: 'Inputs*',
  INPUT_DESCRIPTION: 'Enter Inputs',
  DESCRIPTION: 'Description*',
  DELIVERABLES: 'Deliverables',
  DESCRIPTION_PLACEHOLDER: 'Enter Description',
  USER: 'User',
  USER_PLACEHOLDER: 'Select User',
  RESOURCE: 'Resource*',
  RESOURCE_PLACEHOLDER: 'Select Resource',
  USER_KEY: 'id',
  USER_VALUE: 'firstName',
  LAST_NAME: 'lastName',
  EMPLOYEE_NAME: 'employee_name',
  ROLE: 'role',
  ROLE_LABEL: 'Role*',
  ROLE_PLACEHOLDER: 'Select Role',
  ROLE_KEY: 'role_id',
  ROLE_VALUE: 'role_name',
  RESPONSIBILITY_LABEL: 'Responsibility*',
  RESPONSIBILITY: 'Responsibility',
  RESPONSIBILITY_PLACEHOLDER: 'Enter Responsibility',
  PROJECT_ARIA_LABEL: 'project-stages-modal',
  PROJECT_ARIA_DESCRIBE: 'modal-to-configure-project-stages',
  COMPONENT: 'h2',
  DATA_TABLE_TITLE: 'Design Review',
  PROJECT_ID: 'project-stages-modal',
  STAGE: 'Stage*',
  STAGE_PLACEHOLDER: 'Stages',
  COMPONENT_LABEL: 'label',
  STAGE_INPUT: 'Number of Stages Required*',
  STAGE_INPUT_PLACEHOLDER: 'Enter number of stages required',
  STAGE_LABEL: 'Type of Stage',
}

export const STAGE_RESOURCE_COLUMNS: GridColDef[] = [
  { field: 'sno', headerName: 'S.No', width: 80, flex: 1 },
  { field: 'stage_name', headerName: 'Stage Name', width: 300, flex: 2 },
  { field: 'stage_type', headerName: 'Type of Stage', width: 300, flex: 2 },
  { field: 'actions', headerName: 'Actions', width: 150 },
]

export const PROCEDURES_AND_DOCUMENTS_COLUMNS: GridColDef[] = [
  {
    field: 'sno',
    headerName: 'S.No',
    width: 80,
    sortable: false,
    disableColumnMenu: true,
  },
  {
    field: 'document_name',
    headerName: 'Document Name',
    flex: NUMBERMAP.TWO,
    sortable: false,
    disableColumnMenu: true,
  },
  {
    field: 'download_file',
    headerName: 'Download Files',
    flex: NUMBERMAP.ONE,
    sortable: false,
    disableColumnMenu: true,
  },
  {
    field: 'checkbox',
    headerName: 'Checkbox',
    flex: NUMBERMAP.ONE,
    sortable: false,
    disableColumnMenu: true,
  },
]

export const PROCEDURES_AND_DOCUMENTS_TITLE = 'QMS Procedures and Documents'
export const DOWNLOAD_FILE = 'download_file'
export const CHECKBOX = 'checkbox'
export const FINAL_DESIGN_TRANSFER = 'final_design_transfer'
export const PRE_TRANSFER = 'pre_transfer'

export const DESIGN_TRANSFER_COLUMNS: GridColDef[] = [
  {
    field: 'sno',
    headerName: 'S.No',
    flex: NUMBERMAP.HALF,
    sortable: false,
    disableColumnMenu: true,
  },
  {
    field: 'transfer_type',
    headerName: 'Document Name',
    flex: NUMBERMAP.TWO,
    sortable: false,
    disableColumnMenu: true,
  },
  {
    field: 'pre_transfer',
    headerName: 'Pre Transfer',
    flex: NUMBERMAP.ONE,
    sortable: false,
    disableColumnMenu: true,
  },
  {
    field: 'final_design_transfer',
    headerName: 'Final Design Transfer',
    flex: NUMBERMAP.ONE,
    sortable: false,
    disableColumnMenu: true,
  },
]

export const DESIGN_TRANSFER_TITLE = 'Design Transfer'
export const STAGE_RESOURCE_COLUMN_HEADERS = {
  USER_FIELD: 'user',
  USER_HEADER: 'Resource',
  ROLE_HEADER: 'Role',
  RESPONSIBILITY_FIELD: 'responsibility',
  ACTIONS_FIELD: 'actions',
  ACTIONS_HEADER: 'Actions',
}

export const STAGE_RESOURCE_ERROR_MESSAGE = {
  OWNER: 'Owner is required.',
  DESCRIPTION: 'Description is required.',
  INPUT: 'Input is required',
}

export const ID_FIELDS = {
  PROJECT_STAGE_ORDER_ID: 'project_stage_order_id',
}

export const DESIGN_REVIEW_ERROR_MESSAGES = {
  USER: 'Resource is Required',
  ROLE: 'Role is Required',
  RESPONSIBILITY: 'Responsibility is Required',
}

export const DESIGN_REVIEW_MODAL_TITLES = {
  ADD: 'Add Design Review Member',
  EDIT: 'Edit Design Review Member',
}

export const DESIGN_REVIEW_FIELDS = {
  USER: 'user',
  ROLE: 'role',
  RESPONSIBILITY: 'responsibility',
}

export const DESIGN_REVIEW_MODES = {
  ADD: 'add',
  EDIT: 'edit',
}

export const DOCUMENT_REFERENCE = 'QMS Procedures and Documents'
export const DESIGN_TRANSFER = 'Design Transfer'
export const DOCUMENT_REFERENCE_DESIGN_TRANSFER_FIELDS = {
  SNO_FIELD: 'sno',
  DOCUMENT_FIELD: 'document',
  PRE_TRANSFER_FIELD: 'preTransfer',
  FINAL_DESIGN_TRANSFER_FIELD: 'finalDesignTransfer',
  DOWNLOAD_FIELD: 'download',
  CHECKBOX_FIELD: 'checkbox',
}
export const DOCUMENT_REFERENCE_DESIGN_TRANSFER_HEADERS = {
  SNO: 'S.No',
  DOCUMENT: 'Document Name',
  PRE_TRANSFER: 'Pre Transfer',
  FINAL_DESIGN_TRANSFER: 'Final Design Transfer',
  DOWNLOAD: 'Download',
  CHECKBOX: 'Checkbox',
}

export const TASK_SCHEDULE_LABELS = {
  S_NO: 'S.No.',
  MONTH: 'Month',
  WEEK: 'Week',
  DAY: 'Day',
}

export const TASK_SCHEDULE_VIEW = {
  MONTH: 'month',
  WEEK: 'week',
  DAY: 'day',
  ACTIVE_CLASS: 'active',
} as const

export const DATA_GRID_REORDER = {
  SNO: 'sno',
  TEXT_PLAIN: 'text/plain',
  DRAGGING: 'dragging',
  DRAG_OVER: 'drag-over',
  DRAG_OVER_BOTTOM: 'drag-over-bottom',
  DATA_ID: 'data-id',
  VISIBLE:'visible'
}

// Field label mapping for validation focus
export const FIELD_LABEL_MAP = {
  designObjective: 'designObjective',
  tools: 'tools_required*',
  equipments: 'equipment_required*',
  verificationMethod: 'verificationMethod',
  validationMethod: 'validationMethod',
}

export const FIELD_ORDER = Object.keys(FIELD_LABEL_MAP)



