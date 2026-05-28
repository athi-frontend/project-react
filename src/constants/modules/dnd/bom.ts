import { NUMBERMAP } from '@/constants/common';

export const BASE_URL = '/api/v1';
export const SUB_URL_DND = `${BASE_URL}/dnd`;
export const SUB_URL_ORGANIZATION = `${BASE_URL}/organization`;
export const SUB_BASE_URL_BOM = `${SUB_URL_DND}/bill-of-materials`;
export const BOM_API_ENDPOINTS = {
  ALL: `${SUB_BASE_URL_BOM}/all`,
  VERSIONS: `${SUB_BASE_URL_BOM}/versions`,
  PUBLISH: `${SUB_BASE_URL_BOM}/publish/`,
  UPLOAD: `${SUB_BASE_URL_BOM}/upload/`,
  MODELS: `${SUB_URL_DND}/model/all`,
  ORGANIZATION_UNITS: `${SUB_URL_ORGANIZATION}/unit/all`,
  ORGANIZATION_SITES: `${SUB_URL_ORGANIZATION}/site/all`,
  ASSEMBLY_TYPES: `${SUB_URL_ORGANIZATION}/assembly-type/all`,
} as const;


export const NODE_W = NUMBERMAP.ONEEIGHTY;
export const NODE_H = NUMBERMAP.FORTY;
export const X_STEP = NUMBERMAP.ONEHUNDREDTEN;
export const Y_STEP = NUMBERMAP.FIFTY;
export const SPINE_X = NUMBERMAP.TEN;
export const START_Y = NUMBERMAP.FIVE;

export const PAGE_TITLES = {
  BILL_OF_MATERIAL: 'Bill of Material',
  UPLOAD_BOM: 'Upload BOM',
  MANAGE_PARTS: 'Manage Parts',
} as const;

export const TAB_LABELS = {
  ASSEMBLY_TREE: 'Assembly Tree',
  UPLOAD_BOM: 'Upload BoM',
  MANAGE_PARTS: 'Manage Parts',
} as const;

export const BOM_PAGE_FORM_LABELS = {
  MODEL_NO: 'Model No.*',
  VERSION_NO: 'Version No.*',
} as const;

export const BOM_PAGE_FORM_PLACEHOLDERS = {
  SELECT_MODEL_NO: 'Select Model No.',
  SELECT_VERSION_NO: 'Select Version No.',
} as const;

export const BOM_PAGE_BUTTON_LABELS = {
  PUBLISH: 'Publish',
} as const;

export const BOM_PAGE_ARIA_LABELS = {
  BILL_OF_MATERIAL_TABS: 'bill-of-material-tabs',
} as const;

export const BOM_PAGE_TAB_IDS = {
  ASSEMBLY_TREE: 'bom-tab-0',
  UPLOAD_BOM: 'bom-tab-1',
  MANAGE_PARTS: 'bom-tab-2',
} as const;

export const BOM_PAGE_TAB_PANEL_IDS = {
  ASSEMBLY_TREE: 'bom-tabpanel-0',
  UPLOAD_BOM: 'bom-tabpanel-1',
  MANAGE_PARTS: 'bom-tabpanel-2',
} as const;

export const BOM_PAGE_FORM_FIELDS = {
  PRODUCT_VARIANT_ID: 'product_variant_id',
  MODEL_NAME: 'model_name',
  ID: 'id',
  VALUE: 'value',
  MODEL_NO: 'modelNo',
  VERSION_NO: 'versionNo',
} as const;

export const BOM_PAGE_FIELD_LABEL_MAP = {
  modelNo: BOM_PAGE_FORM_LABELS.MODEL_NO,
  versionNo: BOM_PAGE_FORM_LABELS.VERSION_NO,
} as const;

export const BOM_PAGE_FIELD_ORDER = Object.keys(BOM_PAGE_FIELD_LABEL_MAP);


export const SAFETY_CRITICAL_APPEARANCE_OPTIONS = [
  { value: 'safety', label: 'Safety' },
  { value: 'critical', label: 'Critical' },
  { value: 'appearance', label: 'Appearance' },
  { value: 'others', label: 'Others' },
];

export const UNIT_BATCH_OPTIONS = [
  { value: 'unit', label: 'Unit' },
  { value: 'batch', label: 'Batch' },
];

export const HARDWARE_SOFTWARE_BOTH_OPTIONS = [
  { value: 'hardware', label: 'Hardware' },
  { value: 'software', label: 'Software' },
  { value: 'both', label: 'Both' },
];

export const MAKE_BUY_OPTIONS = [
  { value: 'make', label: 'Make' },
  { value: 'buy', label: 'Buy' },
];

export const MANUFACTURING_PURCHASE_BOM_OPTIONS = [
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'purchase', label: 'Purchase' },
];

export const MANAGE_PARTS_FORM_LABELS = {
  MODEL_NO: 'Model No.*',
  ASSEMBLY_TYPE: 'Assembly Type*',
  UNIT: 'Unit*',
  QUANTITY: 'Quantity*',
  PART_CATEGORY: 'Part Category*',
  PART_NO: 'Part No.*',
  PART_NAME: 'Part Name*',
  DESCRIPTION: 'Description',
  UNIT_OF_MEASUREMENT: 'Unit of Measurement*',
  SAFETY_CRITICAL_APPEARANCE: 'Safety / Critical / Appearance*',
  UNIT_BATCH: 'Unit / Batch*',
  HARDWARE_SOFTWARE_BOTH: 'Hardware / Software / Both*',
  CLASSIFICATION: 'Classification (applicable for SAMD)*',
  MAKE_BUY: 'Make / Buy*',
  MANUFACTURER: 'Manufacturer',
  MANUFACTURER_PART_NO: 'Manufacturer Part No.',
  SPECIFICATIONS: 'Specifications',
  PARENT_ASSEMBLY: 'Parent Assembly',
  ALTERNATIVE_PART_NO: 'Alternative Part No.',
  ASSEMBLY_LEVEL: 'Assembly Level*',
  MANUFACTURING_PURCHASE_BOM: 'Manufacturing or Purchase BOM*',
  UPLOAD_DRAWING: 'Upload Drawing*',
} as const;

export const MANAGE_PARTS_FORM_PLACEHOLDERS = {
  SELECT_MODEL_NO: 'Select Model No.',
  SELECT_ASSEMBLY_TYPE: 'Select Assembly Type',
  SELECT_UNIT: 'Select Unit',
  ENTER_QUANTITY: 'Enter Quantity',
  SELECT_PART_CATEGORY: 'Select Part Category',
  SELECT_PART_NO: 'Select Part No.',
  ENTER_PART_NAME: 'Enter Part Name',
  ENTER_DESCRIPTION: 'Enter Description',
  ENTER_SPECIFICATIONS: 'Enter Specifications',
  SELECT_UNIT_OF_MEASUREMENT: 'Select Unit of Measurement',
  ENTER_CLASSIFICATION: 'Enter Classification (applicable for SAMD)',
  ENTER_MANUFACTURER: 'Enter Manufacturer',
  ENTER_MANUFACTURER_PART_NO: 'Enter Manufacturer Part No.',
  SELECT_PARENT_ASSEMBLY: 'Select Parent Assembly',
  SELECT_ALTERNATIVE_PART_NO: 'Select Alternative Part No.',
} as const;

export const MANAGE_PARTS_TABLE_COLUMNS = {
  SNO: { FIELD: 'sno', HEADER: 'S.No.' },
  PART_NUMBER: { FIELD: 'part_number', HEADER: 'Part No.' },
  PART_NAME: { FIELD: 'part_name', HEADER: 'Part Name' },
  MODEL_NO: { FIELD: 'modelNo', HEADER: 'Model No.' },
  ASSEMBLY_TYPE: { FIELD: 'assembly_type_name', HEADER: 'Assembly Type' },
  MAKE_BUY: { FIELD: 'make_buy_name', HEADER: 'Make / Buy' },
  SAFETY_CRITICAL_APPEARANCE: { FIELD: 'safety_critical_appearance_name', HEADER: 'Safety / Critical / Appearance' },
  PARENT_ASSEMBLY: { FIELD: 'parent_assembly_name', HEADER: 'Parent Assembly' },
  ASSEMBLY_LEVEL: { FIELD: 'assembly_level', HEADER: 'Assembly Level' },
  QUANTITY: { FIELD: 'quantity_per_unit', HEADER: 'Quantity' },
  ACTIONS: { FIELD: 'actions', HEADER: 'Actions' },
} as const;

export const MANAGE_PARTS_FORM_FIELDS = {
  PRODUCT_VARIANT_ID: 'product_variant_id',
  MODEL_NAME: 'model_name',
  ASSEMBLY_TYPE_ID: 'assembly_type_id',
  ASSEMBLY_TYPE_NAME: 'assembly_type_name',
  SITE_ID: 'site_id',
  SITE_NAME: 'site_name',
  ID: 'id',
  PART_ID: 'part_id',
  PART_NUMBER: 'part_number',
  PART_CATEGORY_ID: 'part_category_id',
  PART_CATEGORY_NAME: 'part_category_name',
  PART_NAME: 'part_name',
  UNIT_ID: 'unit_id',
  UNIT_NAME: 'unit_name',
  BOM_PART_ID: 'bom_part_id',
} as const;

export const MANAGE_PARTS_RADIO_GROUP_NAMES = {
  SAFETY_CRITICAL_APPEARANCE: 'safety-critical-appearance',
  UNIT_BATCH: 'unit-batch',
  HARDWARE_SOFTWARE_BOTH: 'hardware-software-both',
  MAKE_BUY: 'make-buy',
  MANUFACTURING_PURCHASE_BOM: 'manufacturing-purchase-bom',
} as const;

export const MANAGE_PARTS_BUTTON_LABELS = {
  ADD_NEW: '+ Add New',
} as const;

export const MANAGE_PARTS_FILE_UPLOAD = {
  ALLOWED_FILE_TYPES: '.pdf,.docx,.xlsx',
  EMPTY_ERROR: '',
} as const;

export const INITIAL_BOM_PART_FORM_DATA = {
  model_id: '',
  assembly_type_id: '',
  location_id: '',
  quantity: '',
  part_category_id: '',
  part_no: '',
  part_name: '',
  description: '',
  unit_id: '',
  part_type: '',
  part_quantity_type: '',
  part_component_type: '',
  classification: '',
  part_purchase_type: '',
  manufacturer: '',
  manufacture_part_no: '',
  specification: '',
  parent_assembly: '',
  alternative_part_no: '',
  assembly_level: '',
  bom_type: '',
  other_unit: '',
};

export const FIELD_LABEL_MAP = {
  model_id: MANAGE_PARTS_FORM_LABELS.MODEL_NO,
  assembly_type_id: MANAGE_PARTS_FORM_LABELS.ASSEMBLY_TYPE,
  location_id: MANAGE_PARTS_FORM_LABELS.UNIT,
  quantity: MANAGE_PARTS_FORM_LABELS.QUANTITY,
  part_category_id: MANAGE_PARTS_FORM_LABELS.PART_CATEGORY,
  part_no: MANAGE_PARTS_FORM_LABELS.PART_NO,
  part_name: MANAGE_PARTS_FORM_LABELS.PART_NAME,
  unit_id: MANAGE_PARTS_FORM_LABELS.UNIT_OF_MEASUREMENT,
  part_type: MANAGE_PARTS_FORM_LABELS.SAFETY_CRITICAL_APPEARANCE,
  part_quantity_type: MANAGE_PARTS_FORM_LABELS.UNIT_BATCH,
  part_component_type: MANAGE_PARTS_FORM_LABELS.HARDWARE_SOFTWARE_BOTH,
  classification: MANAGE_PARTS_FORM_LABELS.CLASSIFICATION,
  part_purchase_type: MANAGE_PARTS_FORM_LABELS.MAKE_BUY,
  uploadedFiles: MANAGE_PARTS_FORM_LABELS.UPLOAD_DRAWING,
  bom_type: MANAGE_PARTS_FORM_LABELS.MANUFACTURING_PURCHASE_BOM,
} as const;

export const FIELD_ORDER = Object.keys(FIELD_LABEL_MAP);

export const VALIDATION_MESSAGES = {
  FIELD_REQUIRED: (fieldName: string) => {
    return `${fieldName} is required`;
  },
  FILE_REQUIRED: 'Upload Drawing is required',
} as const;

export const UPLOAD_BOM_FORM_LABELS = {
  MODEL_NO: 'Model No.*',
  UPLOAD_FILES: 'Upload Files*',
} as const;

export const UPLOAD_BOM_FIELD_LABEL_MAP = {
  model_id: UPLOAD_BOM_FORM_LABELS.MODEL_NO,
  uploadedFiles: UPLOAD_BOM_FORM_LABELS.UPLOAD_FILES,
} as const;

export const UPLOAD_BOM_FIELD_ORDER = Object.keys(UPLOAD_BOM_FIELD_LABEL_MAP);

export const UPLOAD_BOM_TABLE_COLUMNS = {
  SNO: { FIELD: 'sno', HEADER: 'S.No.' },
  FILE_NAME: { FIELD: 'fileName', HEADER: 'File Name' },
  MODEL: { FIELD: 'model_name', HEADER: 'Model' },
  STATUS: { FIELD: 'upload_status', HEADER: 'Status' },
  ACTIONS: { FIELD: 'actions', HEADER: 'Actions' },
} as const;

export const UPLOAD_BOM_ERROR_TABLE_COLUMNS = {
  SNO: { FIELD: 'sno', HEADER: 'S.No.' },
  ROW_NUMBER: { FIELD: 'row_number', HEADER: 'Row Number' },
  ERROR_DESCRIPTION: { FIELD: 'error_description', HEADER: 'Error Description' },
} as const;

export const UPLOAD_BOM_FORM_PLACEHOLDERS = {
  SELECT_MODEL_NO: 'Select Model No.',
} as const;

export const UPLOAD_BOM_LABELS = {
  DOWNLOAD_TEMPLATE: 'Download Template',
  UPLOAD_FILES: 'Upload Files',
  UPLOADED_FILES: 'Uploaded Files',
  ERROR_DETAILS: 'Error Details',
  ADD_NEW: '+ Add New',
  BOM_TEMPLATE: 'BOM Template',
  FILE: 'file',
  DOWNLOAD_BOM_UPLOAD: 'Download BOM Upload',
} as const;

export const UPLOAD_BOM_FORM_FIELDS = {
  PRODUCT_VARIANT_ID: 'product_variant_id',
  MODEL_NAME: 'model_name',
  BOM_UPLOAD_ID: 'bom_upload_id',
  ID: 'id',
} as const;

export const UPLOAD_BOM_FILE_TYPES = {
  ACCEPT: '.pdf,.docx,.xlsx',
  SUPPORTED_FORMATS: 'PDF, DOCX, XLSX',
} as const;

export const ASSEMBLY_TREE_NODE_TYPES = {
  PRODUCT: 'product',
  ASSEMBLY: 'assembly',
  PART: 'part',
} as const;

export const ASSEMBLY_TREE_EDGE_TYPES = {
  SPINE: 'spine',
  STEP: 'step',
} as const;

export const ASSEMBLY_TREE_HANDLE_IDS = {
  SPINE: 'spine',
  SPINE_CONNECTION: 'spine-connection',
  CHILDREN: 'children',
  TARGET: 'target',
} as const;

export const ASSEMBLY_TREE_NODE_IDS = {
  ROOT: 'root',
  PRODUCT: 'product',
} as const;

export const ASSEMBLY_TREE_EDGE_PREFIX = {
  SPINE: 'spine-',
  SEPARATOR: '-',
} as const;

export const ASSEMBLY_TREE_VIEWPORT_CONFIG = {
  UPDATE_INTERVAL: NUMBERMAP.HUNDRED,
  CONTAINER_HEIGHT: NUMBERMAP.SIXHUNDRED,
  FIT_VIEW_PADDING: NUMBERMAP.QUARTER,
  MAX_ZOOM: NUMBERMAP.ONE_HALF,
  MIN_ZOOM: NUMBERMAP.HALF,
} as const;

