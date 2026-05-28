import { MONTH_NAMES } from '@/constants/components/ui/monthYearPicker';
import { NUMBERMAP, FILE_SIZE_LIMITS } from '@/constants/common';
import { ErrorItem } from '@/types/validation';
/**
    Classification : Confidential
**/
const BASE_API_PATH = 'api/v1/sales';
export const API_ENDPOINTS = {
    SALES_FORECAST_ALL: `${BASE_API_PATH}/sales-forecast/all`,
    SALES_FORECAST_BY_ID: (id: string) => `${BASE_API_PATH}/sales-forecast/${id}`,
    SALES_FORECAST_UPSERT: `${BASE_API_PATH}/sales-forecast/`,
    PRIORITY_ALL: `${BASE_API_PATH}/priority/all`,
    MODEL_BY_PRODUCT: (productId: string) => `${BASE_API_PATH}/model/product/${productId}`,
};

export const SALES_FORECAST_HOOK = 'salesForecast';
export const SALES_FORECAST_BY_ID_HOOK = 'salesForecastById';
export const PRIORITY_HOOK = 'priority';
export const PRODUCT_MODEL_HOOK = 'productModel';

export const MODAL_MODE = {
  EDIT: 'edit',
  ADD: 'add',
} as const;

// File upload constants
export const FILE_UPLOAD_LIMITS = {
  MAX_FILE_SIZE_MB: NUMBERMAP.TEN, // for display/use if MB value is needed
  MAX_FILE_SIZE_BYTES: FILE_SIZE_LIMITS.MAX_SIZE, // centralized 10MB limit in bytes
} as const;

// Form field constants
export const FIELD_IS_REQUIRED = {
    PRODUCT_ID: 'Product ID is required',
    MONTH_SELECTION: 'Month selection is required',
    PRIORITY_ID: 'Priority is required',
    UNITS: 'Units is required',
    REMARKS: 'Remarks is required',
    MODEL_ID: 'Model is required',
    DOCUMENTS: 'File upload is required',
};

export const TITLE = 'Sales Forecast';
export const BASIC_INFORMATION_TITLE = 'Basic Information';
export const SALES_FORECAST_TITLE = 'Sales Forecast';

export const LABEL = {
    PRODUCT_ID: 'Product*',
    MODEL_ID: 'Model*',
    MONTH_SELECTION: 'Month Selection*',
    PRIORITY_ID: 'Priority*',
    UNITS: 'Units*',
    REMARKS: 'Remarks*',
    DOCUMENTS: 'Documents*',
};

export const PLACEHOLDER = {
    PRODUCT_ID: 'Select Product',
    MODEL_ID: 'Select Model',
    MONTH_SELECTION: 'Select Month',
    PRIORITY_ID: 'Select Priority',
    UNITS: 'Enter Units',
    REMARKS: 'Enter Remarks',
    DOCUMENTS: 'Upload Documents',
};

export const SAVE = 'Save';
export const CANCEL = 'Cancel';

export const ALERT_ACTIONS = {
    CUSTOM_ALERT: 'customAlert',
    TITLE: 'Something went wrong',
    ERROR: 'error',
};

export const ERROR_MESSAGES = {
    FAILED_TO_LOAD_SALES_FORECASTS: 'Failed to load sales forecasts',
    FAILED_TO_SAVE_SALES_FORECAST: 'Failed to save sales forecast',
};

export const SALES_FORECAST_CONSTANTS = {
    TITLE: "Sales Forecast",
    PATH_NAME: "/sales/sales-forecast",
    ACTIVE_STATUS_TEXT: "Active",
    INACTIVE_STATUS_TEXT: "Inactive",
};

export const BUTTON_LABELS = {
    submitForReview: "Submit for Review",
    submitForApproval: "Submit for Approval",
    approve: "Approve",
    reject: "Reject",
    cancel: "Cancel",
    save: "Save",
};

export const INITIAL_SALES_FORECAST = {
    sales_forecast_id: "",
    product_id: null,
    model_id: null,
    month_selection: "",
    priority_id: null,
    units: null,
    remarks: "",
    documents_to_create: [],
    create_meta_data: "",
};

export const INITIAL_ERRORS = {
    product_id: "",
    model_id: "",
    month_selection: "",
    priority_id: "",
    units: "",
    remarks: "",
    documents: "",
};

export const FIELD_NAMES = {
    SALES_FORECAST_ID: "sales_forecast_id",
    PRODUCT_ID: "product_id",
    MODEL_ID: "model_id",
    MONTH_SELECTION: "month_selection",
    PRIORITY_ID: "priority_id",
    UNITS: "units",
    REMARKS: "remarks",
    DOCUMENTS_TO_CREATE: "documents_to_create",
    CREATE_META_DATA: "create_meta_data",
};

export const VALIDATION_MESSAGES = {
    PROVIDE_VALID_UNITS: "Provide valid units",
    PROVIDE_VALID_MONTH_SELECTION: "Provide valid month selection",
    UNITS_POSITIVE_INTEGER: "Units must be a positive integer greater than 0",
    UNITS_DIGIT_LIMIT: "Units must not exceed 10 digits",
};

export const ALERT_MESSAGES = {
    SUCCESS: "success",
    FAILED: "failed", 
    CUSTOM_ALERT: "customAlert",
    DELETE: "delete",
    ICON_ERROR: "error",
    SAVE_ERROR: 'Failed to save sales forecast',
};

// Page-specific constants
export const PAGE_TITLES = {
    LIST_VIEW: "List View - Sales Forecast",
    SALES: "Sales",
    EDIT_SALES_FORECAST: "Edit Sales Forecast",
    ADD_SALES_FORECAST: "Add Sales Forecast",
};

export const BUTTON_TEXT = {
    ADD_NEW: "Add New",
};

export const PERIOD_DATA = {
    MONTHLY: {
        columns: MONTH_NAMES.slice(NUMBERMAP.ZERO, NUMBERMAP.SIX), // ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
    },
    QUARTERLY: {
        columns: ['Q1', 'Q2', 'Q3', 'Q4'],
    },
    HALF_YEARLY: {
        columns: ['H1', 'H2'],
    },
    YEARLY: {
        columns: [
            new Date().getFullYear().toString(),
            (new Date().getFullYear() + NUMBERMAP.ONE).toString(),
            (new Date().getFullYear() + NUMBERMAP.TWO).toString(),
        ],
    },
};

export const DEFAULT_VALUES = {
    PRIORITY: NUMBERMAP.ONE.toString(),
    UNITS: NUMBERMAP.ZERO.toString(),
    REMARKS: '',
    PRODUCT_ID: NUMBERMAP.ONE,
    MODEL_ID: NUMBERMAP.ONE,
};

export const FILTER_DEFAULTS = {
    TYPE: 'monthly',
    USER: 'user',
};

export const TABLE_COLUMNS = {
    SNO: {
        field: "sno",
        headerName: "S.No.",
        flex: NUMBERMAP.HALF,
        headerAlign: 'center' as const,
        align: 'center' as const,
    },
    PRODUCT_NAME: {
        field: "productName",
        headerName: "Product Name",
        flex: NUMBERMAP.ONE_HALF,
        headerAlign: 'left' as const,
        align: 'left' as const,
    },
    CATEGORY: {
        field: "category",
        headerName: "Category",
        flex: NUMBERMAP.ONE_HALF,
        headerAlign: 'left' as const,
        align: 'left' as const,
    },
    MODEL: {
        field: "modelName",
        headerName: "Model",
        flex: NUMBERMAP.ONE_HALF,
        headerAlign: 'left' as const,
        align: 'left' as const,
    },
} as const;

export const MODAL_CONFIG = {
    EDIT: {
        buttonRequired: false,
    },
    ADD: {
        buttonRequired: false,
    },
};

export const MONTH_ABBREVIATIONS: string[] = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

/**
 * Error items configuration for Sales Forecast form validation
 * Each item defines a field to validate with its error message and type
 * The errorKey maps the field name to the error state key in the component
 */
export const salesForecastErrorItems: ErrorItem[] = [
  {
    field: 'productName',
    errormessage: FIELD_IS_REQUIRED.PRODUCT_ID,
    type: 'string',
    errorKey: 'productName',
  },
  {
    field: 'modelId',
    errormessage: FIELD_IS_REQUIRED.MODEL_ID,
    type: 'string',
    errorKey: 'modelId',
  },
  {
    field: 'monthSelection',
    errormessage: FIELD_IS_REQUIRED.MONTH_SELECTION,
    type: 'string',
    errorKey: 'monthSelection',
  },
  {
    field: 'priority',
    errormessage: FIELD_IS_REQUIRED.PRIORITY_ID,
    type: 'string',
    errorKey: 'priority',
  },
  {
    field: 'unitsRequired',
    errormessage: FIELD_IS_REQUIRED.UNITS,
    type: 'string',
    errorKey: 'unitsRequired',
  },
  {
    field: 'remarks',
    errormessage: FIELD_IS_REQUIRED.REMARKS,
    type: 'string',
    errorKey: 'remarks',
  },
  {
    field: 'uploadedFile',
    errormessage: FIELD_IS_REQUIRED.DOCUMENTS,
    type: 'array',
    errorKey: 'file',
  },
];