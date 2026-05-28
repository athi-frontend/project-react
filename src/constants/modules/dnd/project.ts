import { NUMBERMAP } from '@/constants/common'
import { convertUtcToLocal } from '@/lib/utils/common';
import { ProjectFormData } from '@/types/modules/dnd/project'
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'

export const getProjectPageTitle = (projectId?: number) => projectId ? 'Edit Project' : 'Create New Project';

export type ValueType = string | number | null | (string | number)[]

export const FILE_UPLOAD_COLUMN_FIELDS = {
  ACTIONS: 'actions',
  STATUS: 'status',
} as const

// In your constants file (e.g., @/constants/modules/dnd/project)
export const ERROR_MESSAGES = {
  DUPLICATE_PRODUCT_NAME: {
    TITLE: 'Duplicate Product Name',
    TEXT: 'A project with this product name already exists. Please choose a different product name.',
  }
} as const

export const FILE_UPLOAD_COLUMN_LABELS = {
  ACTIONS: 'actions',
  FILE_STATUS: 'File Status',
  NAME: 'name',
  FILE_NAME: 'File Name',
  CREATED_DATE: 'created_date',
  UPLOADED_DATE: 'Uploaded Date',
  CATEGORY: 'category',
  FILE_CATEGORY: 'File Category',
} as const

export const SUMMARY_LABELS = {
  PRODUCT_NAME: 'Product Name',
  GENERIC_NAME: 'Generic Name',
  DECISION: 'Decision',
  DESCRIPTION: 'Description',
  PRODUCT_GROUP: 'Product Group',
  PRODUCT_CATEGORY: 'Product Category',
  PRODUCT_TYPE: 'Product Type',
  PRODUCT_SUB_TYPE: 'Product Sub Type',
  REASON: 'Reason',
  IS_HLD_REQUIRED: 'Is HLD Required',
  IS_FEASIBILITY_STUDY_REQUIRED: 'Is Design Feasibility Study Required',
  IS_PND_REQUIRED: 'Is PND Required',
  MARKET: 'Market',
  REGULATIONS: 'Regulations',
} as const

export const EXCLUDED_FIELDS = [
  'tid',
  'eid',
  'org_id',
  'project_id',
  'organization_project_id',
] as const

export const STATUS={
  ACTIVE:'Active',
  INACTIVE:'Inactive',
  CATEGORY:'No Category',
}

export const PROJECT_REASON_OPTIONS = [
  { label: 'New', value: 'New' },
  { label: 'Engineering Change Request', value: 'engineering_change' },
]

export const REQUIRED_RADIO_OPTIONS = [
  { label: 'Yes', value: 1 },
  { label: 'No', value: 0 },
]

export const FIELD_NAMES = {
  PRODUCT_NAME: 'product_name',
  GENERIC_NAME: 'product_generic_name',
  PRODUCT_GROUP_ID: 'product_group_id',
  PRODUCT_GROUP: 'product_group',
  PRODUCT_CATEGORY_ID: 'product_category_id',
  PRODUCT_CATEGORY: 'product_category',
  PRODUCT_TYPE_ID: 'product_type_id',
  PRODUCT_TYPE: 'product_type',
  PRODUCT_SUB_TYPE_ID: 'product_sub_type_id',
  PRODUCT_SUB_TYPE: 'product_sub_type',
  PROJECT_REASON: 'project_reason',
  IS_HLD_REQUIRED: 'is_hld_required',
  IS_PND_REQUIRED: 'is_pnd_required',
  IS_FEASIBILITY_STUDY_REQUIRED: 'is_feasibility_study_required',
  PRODUCT_DESCRIPTION: 'product_description',
  PRODUCT_MARKET: 'market',
  PRODUCT_MARKET_ID: 'market_id',
  PRODUCT_MARKET_NAME: 'market_name',
  PRODUCT_REGULATIONS: 'regulations',
  PRODUCT_REGULATION_ID: 'regulation_id',
  PRODUCT_REGULATION_NAME: 'regulation',
  PROJECT_DOCUMENTS: 'documents',
  SAFETY_PRECAUTIONS: 'safety_precautions',
  STEPS: 'steps',
} as const

export const FORM_FIELDS_CONFIG = {
  PRODUCT_NAME: {
    label: 'Product Name*',
    placeholder: 'Enter Product Name',
    onChange: FIELD_NAMES.PRODUCT_NAME,
  },
  GENERIC_NAME: {
    label: 'Generic Name*',
    placeholder: 'Enter Generic Name',
    onChange: FIELD_NAMES.GENERIC_NAME,
  },
  PRODUCT_GROUP: {
    label: 'Product Group*',
    placeholder: 'Select Product Group',
    isDropdown: true,
    onChange: FIELD_NAMES.PRODUCT_GROUP_ID,
    keyField: FIELD_NAMES.PRODUCT_GROUP_ID,
    valueField: FIELD_NAMES.PRODUCT_GROUP,
  },
  PRODUCT_CATEGORY: {
    label: 'Product Category*',
    placeholder: 'Select Product Category',
    isDropdown: true,
    onChange: FIELD_NAMES.PRODUCT_CATEGORY_ID,
    keyField: FIELD_NAMES.PRODUCT_CATEGORY_ID,
    valueField: FIELD_NAMES.PRODUCT_CATEGORY,
  },
  PRODUCT_TYPE: {
    label: 'Product Type*',
    placeholder: 'Select Product Type',
    idField: FIELD_NAMES.PRODUCT_TYPE_ID,
    valueField: FIELD_NAMES.PRODUCT_TYPE,
    onChange: FIELD_NAMES.PRODUCT_TYPE_ID,
  },
  PRODUCT_SUB_TYPE: {
    label: 'Product Sub Type*',
    placeholder: 'Select Product Sub Type',
    idField: FIELD_NAMES.PRODUCT_SUB_TYPE_ID,
    valueField: FIELD_NAMES.PRODUCT_SUB_TYPE,
    onChange: FIELD_NAMES.PRODUCT_SUB_TYPE_ID,
  },
  PROJECT_REASON: {
    label: 'Reason',
    name: 'project_reason',
    options: PROJECT_REASON_OPTIONS,
    onChange: FIELD_NAMES.PROJECT_REASON,
  },
  IS_HLD_REQUIRED: {
    label: 'Is HLD Required*',
    name: 'isHLDRequired',
    options: REQUIRED_RADIO_OPTIONS,
    onChange: FIELD_NAMES.IS_HLD_REQUIRED,
  },
  IS_PND_REQUIRED: {
    label: 'Is PND Required*',
    name: 'isPNDRequired',
    options: REQUIRED_RADIO_OPTIONS,
    onChange: FIELD_NAMES.IS_PND_REQUIRED,
  },
  IS_FEASIBILITY_STUDY_REQUIRED: {
    label: 'Is Design Feasibility Required*',
    name: 'isDesignFeasibilityRequired',
    options: REQUIRED_RADIO_OPTIONS,
    onChange: FIELD_NAMES.IS_FEASIBILITY_STUDY_REQUIRED,
  },
  PRODUCT_DESCRIPTION: {
    label: 'Description*',
    placeholder: 'Enter Description',
    onChange: FIELD_NAMES.PRODUCT_DESCRIPTION,
  },
  PRODUCT_MARKET: {
    label: 'Market*',
    placeholder: 'Enter Market',
    idField: FIELD_NAMES.PRODUCT_MARKET_ID,
    valueField: FIELD_NAMES.PRODUCT_MARKET_NAME,
    onChange: FIELD_NAMES.PRODUCT_MARKET,
  },
  PRODUCT_REGULATIONS: {
    label: 'Regulations*',
    placeholder: 'Enter Regulations',
    idField: FIELD_NAMES.PRODUCT_REGULATION_ID,
    valueField: FIELD_NAMES.PRODUCT_REGULATION_NAME,
    onChange: FIELD_NAMES.PRODUCT_REGULATIONS,
  },
  PRODUCT_MARKET_WITHOUT_CONFIRMATION: {
    label: 'Market',
  },
  PRODUCT_REGULATIONS_WITHOUT_CONFIRMATION: {
    label: 'Regulations',
  },
  PROJECT_DOCUMENTS: {
    label: 'Documents*',
    onChange: FIELD_NAMES.PROJECT_DOCUMENTS,
  },
  SAFETY_PRECAUTIONS:{
    lable:'Safety and Precautions*',
    onChange: FIELD_NAMES.SAFETY_PRECAUTIONS,
    placeholder: 'Input Text',

  },
  STEPS: {
    label: 'Project Steps*',
    onChange: FIELD_NAMES.STEPS,
  },
  FIELDS_TO_APPEND_CONFIG: {
    product_name: (data: ProjectFormData) => data.product_name?.trim(),
    generic_name: (data: ProjectFormData) => data.product_generic_name?.trim(),
    product_group: (data: ProjectFormData) => data.product_group_id?.toString(),
    product_category: (data: ProjectFormData) =>
      data.product_category_id?.toString(),
    product_type: (data: ProjectFormData) => data.product_type_id?.toString(),
    product_sub_type: (data: ProjectFormData) =>
      data.product_sub_type_id?.toString(),
    product_reason: (data: ProjectFormData) => data.project_reason,
    is_hld_required: (data: ProjectFormData) =>
      data.is_hld_required?.toString(),
    is_pnd_required: (data: ProjectFormData) =>
      data.is_pnd_required?.toString(),
    is_design_feasibility_study_required: (data: ProjectFormData) =>
      data.is_feasibility_study_required?.toString(),
    description: (data: ProjectFormData) => data.product_description?.trim(),
    market: (data: ProjectFormData) => JSON.stringify(data.market),
    regulations: (data: ProjectFormData) => JSON.stringify(data.regulations),
    steps: (data: ProjectFormData) => JSON.stringify(data.steps),
    documents_to_create: (data: ProjectFormData) => data.documents,
  },
}

export const FILE_SIZE_LIMITS = {
  MAX_SIZE: 10 * 1024 * 1024,
  ERROR_MESSAGE: 'File size should be less than 10 MB',
} as const
export const REASON_OPTIONS = 'New'
export const API_PARAMS = {
  PROJECT_ID: 'projectId',
  PROJECT_ID_DB: 'project_id',
  STATUS: 'status',
  ORGANIZATION_PROJECT_ID: 'organization_project_id',
  DOCUMENTS_TO_CREATE: 'documents_to_create',
  DOCUMENTS_TO_DELETE: 'documents_to_delete',
} as const

export const PROJECT_TYPES = {
  ENGINEERING_CHANGE: 'engineering_change',
} as const

export const RESPONSE_KEYS = {
  PROJECT_LIST: 'projectListData',
  PROJECT_INFO: 'projectInfo',
  FILE_URL: 'fileUrl',
  PRODUCT_CATEGORY: 'productCategory',
  PRODUCT_GROUP: 'productGroupList',
  PRODUCT_TYPE: 'productType',
  PRODUCT_SUBTYPE: 'productSubType',
  MARKET: 'marketListData',
  REGULATION: 'RegulationListData',
  TAGS: 'tagsList',
} as const

export const VALIDATION_MESSAGES={
  IS_HLD_REQUIRED: 'is_hld_required',
  IS_PND_REQUIRED: 'is_pnd_required',
  IS_FEASIBILITY_STUDY_REQUIRED: 'is_feasibility_study_required',
}
export const ROUTE_PATHS = {
  CREATE_PROJECT: '/project-details/create',
  PROJECT_LIST: '/project-details/list',
  DND_PROJECT_LIST: '/dnd/project/list',
  PROJECT_INFO: '/dnd/project',
} as const

export const PROJECT_TABLE_COLUMNS = {
  SERIAL_NO: 'sno',
  PROJECT_ID: 'project_id',
  PRODUCT_NAME: 'product_name',
  PRODUCT_CATEGORY: 'product_category',
  PRODUCT_TYPE: 'product_type',
  PRODUCT_SUBTYPE: 'product_subtype',
  PROJECT_REASON: 'project_reason',
  STATUS: 'project_status',
  SUB_STATUS: 'project_substatus',
  ACTION: 'action',
} as const

export const TABLE_HEADERS = {
  SERIAL_NO: 'S.No',
  PROJECT_ID: 'Project ID',
  PRODUCT_NAME: 'Product Name',
  PRODUCT_CATEGORY: 'Product Category',
  PRODUCT_TYPE: 'Product Type',
  PRODUCT_SUBTYPE: 'Product Sub Type',
  PROJECT_REASON: 'Reason',
  SUB_STATUS: 'Sub Status',
  STATUS: 'Status',
  ACTION: 'Action',
} as const

export const PROJECT_SUB_STATUS_KEYWORDS = {
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const

export const PROJECT_SUB_STATUS_DISPLAY = {
  EMPTY: '-',
} as const

export const BUTTON_LABELS = {
  CREATE_PROJECT: '+ Create Project',
} as const

export const STATUS_LABELS = {
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  STYLE: {
    ACTIVE:'success.main',
    INACTIVE: 'error.main',
  }
} as const

export const PROJECT_INFO = {
  DOWNLOAD: 'Download',
  ERROR: 'Error downloading file',
  EN_US: 'en-US',
  VARIANT: {
    H5: "h5", 
    BODY1: "body1"
  },
  FILE: {
    FILE_ID: 'file_id',
  }
}

export const ALERT_MESSAGES = {
  DELETE: 'delete',
  DENIED: 'denied',
  SUCCESS: 'success',
  FAILED: 'failed',
} as const

export const LABELS = {
  LIST_PROJECT: 'List Project',
} as const

export const PROJECT_SEARCH_PLACEHOLDER = 'Search'

export const getFileUploadColumns = (
  renderStausCell: (params: GridRenderCellParams) => React.ReactNode,
  renderActionCell: (params: GridRenderCellParams) => React.ReactNode,
): GridColDef[] => [
  {
      field: 'file_name',
      headerName: 'File Name',
      flex: NUMBERMAP.ONE,
    },
    {
      field: 'source',
      headerName: 'Source',
      flex: NUMBERMAP.ONE,
    },
    {
      field: 'uploaded_date',
      headerName: 'Uploaded Date',
      flex: NUMBERMAP.ONE,
      renderCell: (params: any) => {
        if (!params.value) return "-";
        return convertUtcToLocal(params.value, "dd-MM-yyyy");
      },
    },
    {
      field: 'file_category',
      headerName: 'File Category',
      flex: NUMBERMAP.ONE,
    },
    {
      field: 'status',
      headerName: 'File Status',
      flex: NUMBERMAP.ONE,
      renderCell: renderStausCell,
    },
    {
      field: 'actions',
      headerName: 'Action',
      flex: 0.5,
      sortable: false,
      filterable: false,
      renderCell: renderActionCell
    },
]

export const getFileColumns = (
  renderActionsCell: (params: GridRenderCellParams) => React.ReactNode,
): GridColDef[] => [
  {
    field: 'file_name',
      headerName: 'File Name',
      flex: NUMBERMAP.ONE,
      sortable: false,
      filterable: false,
  },{
    field: 'actions',
      headerName: 'Action',
      flex: NUMBERMAP.HALF,
      sortable: false,
      filterable: false,
       renderCell: renderActionsCell
  }
]

export const COMMON_CONSTANTS = {
  ACTIVE_STATUS: 1,
  SUCCESS_ALERT: 'success',
  DENIED_ALERT: 'denied',
  INDEX_ONE: 1,
  INDEX_ZERO: 0,
  EMPTY_ARRAY_LENGTH: 0,
} as const

export const BASE_API_PATH = 'api/v1/dnd'
export const BASE_PROJECT_API = `${BASE_API_PATH}/projects`

export const API_URLS = {
  PROJECT: {
    BASE: BASE_PROJECT_API,
    FETCH: `${BASE_PROJECT_API}/all`,
    CREATE: BASE_PROJECT_API,
    UPDATE: BASE_PROJECT_API,
    DELETE: BASE_PROJECT_API,
  },
  PRODUCT: {
    ALL: `${BASE_API_PATH}/product/all`,
    GROUP: `${BASE_API_PATH}/product-group/all`,
    CATEGORY: `${BASE_API_PATH}/product-category/all`,
    TYPE: `${BASE_API_PATH}/product-type/all`,
    SUB_TYPE: `${BASE_API_PATH}/product-subtypes/all`,
  },
  MARKET: {
    LIST: `api/v1/organization/market/all`,
  },
  REGULATION: {
    BASE: 'api/v1/organization/regulation/all/?market_id=',
  },
  FILE: {
    DOWNLOAD: 'api/v1/dms/assets/download',
  },
  DMS: {
    DOWNLOAD: (fileId: string) => `api/v1/dam/assets/download/${fileId}`,
    TAGS: 'api/v1/dms/tags/all',
  },
}

export const FIELD_LABEL_MAP: { [key: string]: string } = {
  project_reason: FORM_FIELDS_CONFIG.PROJECT_REASON.label,
  product_name: FORM_FIELDS_CONFIG.PRODUCT_NAME.label,
  product_generic_name: FORM_FIELDS_CONFIG.GENERIC_NAME.label,
  product_group_id: FORM_FIELDS_CONFIG.PRODUCT_GROUP.label,
  product_category_id: FORM_FIELDS_CONFIG.PRODUCT_CATEGORY.label,
  product_type_id: FORM_FIELDS_CONFIG.PRODUCT_TYPE.label,
  product_sub_type_id: FORM_FIELDS_CONFIG.PRODUCT_SUB_TYPE.label,
  product_description: FORM_FIELDS_CONFIG.PRODUCT_DESCRIPTION.label,
  market: FORM_FIELDS_CONFIG.PRODUCT_MARKET.label,
  regulations: FORM_FIELDS_CONFIG.PRODUCT_REGULATIONS.label,
  is_hld_required: FORM_FIELDS_CONFIG.IS_HLD_REQUIRED.label,
  is_pnd_required: FORM_FIELDS_CONFIG.IS_PND_REQUIRED.label,
  is_feasibility_study_required: FORM_FIELDS_CONFIG.IS_FEASIBILITY_STUDY_REQUIRED.label,
};

export const VALIDATION_ORDER = Object.keys(FIELD_LABEL_MAP)


export  const MARKET_REGULATION_REQUIRED = 'Each selected market must have at least one regulation assigned.'
