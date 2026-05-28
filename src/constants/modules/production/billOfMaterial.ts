/**
 * Classification: Confidential
 * Bill of Material Constants
 */

import { NUMBERMAP } from '@/constants/common'
import { GridColDef } from '@mui/x-data-grid'

const BASE_API_PATH = 'api/v1/production'
const BOM_PATH = 'bill-of-material'
const QUALITY_CONTROL_BASE_PATH = 'api/v1/quality-control'

export const API_ENDPOINTS = {
    FETCH_ALL: (projectId: number) => `${BASE_API_PATH}/${BOM_PATH}/all?project_id=${projectId}`,
    FETCH_BY_ID: (id: number) => `${BASE_API_PATH}/${BOM_PATH}/${id}`,
    FETCH_PART_DETAILS_BY_ID: (partItemId: number) => `${BASE_API_PATH}/${BOM_PATH}/${partItemId}`,
    UPSERT: `${BASE_API_PATH}/${BOM_PATH}`,
    DELETE: (id: number) => `${BASE_API_PATH}/${BOM_PATH}/${id}`,
    PART_SETTING: (id: number) => `${BASE_API_PATH}/${BOM_PATH}/part-setting/${id}`,
    PART_DETAILS: (id: number) => `${BASE_API_PATH}/${BOM_PATH}/part-details/${id}`,
    PART_SETTING_DETAIL: (partItemDetailId: number) => `${BASE_API_PATH}/bill-of-material-settings/${partItemDetailId}`,
    PART_SETTING_UPSERT: `${BASE_API_PATH}/bill-of-material-settings/`,
    FETCH_EQUIPMENT_ITEMS: `${QUALITY_CONTROL_BASE_PATH}/equipment-item/all`,
} as const

export const QUERY_KEYS = {
    LIST: 'bill-of-material-list',
    DETAIL: 'bill-of-material-detail',
    PART_SETTING: 'bill-of-material-part-setting',
    PART_SETTING_DETAIL: 'bill-of-material-part-setting-detail',
    PART_DETAILS: 'bill-of-material-part-details',
    EQUIPMENT_ITEMS: 'bill-of-material-equipment-items',
} as const

export const BOM_CONSTANTS = {
    TITLE: 'Bill of Material',
    PATH: '/production/bill-of-material',
    PART_SETTING_PATH: '/production/bill-of-material/part-setting',
    PART_DETAILS_PATH: '/production/bill-of-material/part-details',
    SETTINGS_COLUMN_HEADER: 'Settings',
    PROJECT_ID: 'project_id',
    FEATURE_ID: 'feature_id',
    VENDOR_SELECTION_CRITERIA_PATH: '/production/vendor-selection-criteria/',
    SUPPLIER_MODAL_MAX_WIDTH: '800px',
} as const

export const STATUS_LABELS = {
    NOT_CONFIGURED: 'Not Configured',
    IN_PROGRESS: 'In Progress',
    COMPLETED: 'Completed',
} as const

export const FIELD_NAMES = {
    PART_NAME: 'part_name',
    SETTINGS: 'Settings',
    QUANTITY_TYPE_SLUG: 'quantity_type_slug',
    QUANTITY_TYPE_ID: 'quantity_type_id',
} as const

export const billOfMaterialColumns: GridColDef[] = [
    {
        field: 'sno',
        headerName: 'S.No.',
        flex: NUMBERMAP.HALF,
    },
    {
        field: 'part_name',
        headerName: 'Part',
        flex: NUMBERMAP.ONE,
    },
    {
        field: 'part_type',
        headerName: 'Type',
        flex: NUMBERMAP.ONE,
    },
    {
        field: 'level',
        headerName: 'Level',
        flex: NUMBERMAP.ONE,
    },
]

export const PART_SETTING_LABELS = {
    TITLE: 'Assembly / Part Settings',
    PRODUCT_ID: 'Product ID',
    PRODUCT_NAME: 'Product Name',
    ASSEMBLY_PART_NAME: 'Assembly / Part Name',
    PART_CODE: 'Part Code',
    CONFIGURATION_SETTINGS: 'Configuration Settings',
    S_NO: 'S.No.',
    FEATURE_SETTINGS: 'Feature Settings',
    APPLICABLE: 'Applicable',
} as const

export const PART_DETAILS_LABELS = {
    TITLE: 'Assembly / Part Details',
    ASSEMBLY_PART_NAME: 'Assembly / Part Name',
    PART_CODE: 'Part Code',
    DESCRIPTION: 'Description',
    PRODUCT_NAME: 'Product Name',
    SAFETY_CRITICAL: 'Safety / critical / Appearance / Others',
    UNIT_BATCH: 'Unit / Batch*',
    VISUAL: 'Visual',
    AQL: 'AQL*',
    PART_TYPE: 'Part Type*',
    MANUFACTURER: 'Manufacturer',
    HARDWARE_SOFTWARE: 'Hardware / Software / Both',
    CLASSIFICATION: 'Classification (Applicable for SAMD)',
    EQUIPMENT_TYPE: 'Equipment Type(For Incoming Inspection)',
    DRAWING_NUMBER: 'Drawing Number',
    SUPPLIER_DETAILS: 'Supplier Details',
    FILES_UPLOAD: 'File Upload*',
    INSPECTION_PROCEDURE: 'Inspection Procedure*',
    ADD_SUPPLIER_DETAILS: 'Add Supplier Details',
    SUPPLIER_NAME: 'Supplier Name',
    SUPPLIER_PART_NO: 'Supplier Part No.',
    MOQ: 'MOQ',
    LEAD_TIME: 'Lead Time',
    VENDOR_SELECTION_CRITERIA: 'Vendor Selection Criteria',
} as const

export const PART_DETAILS_PLACEHOLDERS = {
    ASSEMBLY_PART_NAME: 'Assembly / Part Name',
    PART_CODE: 'Part Code',
    PRODUCT_NAME: 'Product Name',
    SAFETY_CRITICAL: 'Safety / critical / Appearance / Others',
    VISUAL: 'Enter Visual',
    AQL: 'Enter AQL',
    MANUFACTURER: 'Manufacturer',
    HARDWARE_SOFTWARE: 'Hardware / Software / Both',
    CLASSIFICATION: 'Classification (Applicable for SAMD)',
    EQUIPMENT_TYPE: 'Select Equipment Type(For Incoming Inspection)',
    INSPECTION_PROCEDURE: 'Select Inspection Procedure',
    SUPPLIER_NAME: 'Select Supplier Name',
    SUPPLIER_PART_NO: 'Supplier Part No.',
    MOQ: 'MOQ',
    LEAD_TIME: 'Lead Time',
} as const

export const BUTTON_LABELS = {
    SAVE: 'Save',
    CANCEL: 'Cancel',
    ADD_NEW: 'Add New',
    BACK: 'Back',
} as const

export const PART_DETAILS_ERROR_MESSAGES = {
    UNIT_BATCH_REQUIRED: 'Unit / Batch is required',
    AQL_REQUIRED: 'AQL is required',
    PART_TYPE_REQUIRED: 'Part Type is required',
    EQUIPMENT_TYPE_REQUIRED: 'Equipment Type is required',
    FILES_UPLOAD_REQUIRED: 'Files Upload is required',
    INSPECTION_PROCEDURE_REQUIRED: 'Inspection Procedure is required',
} as const

export const configurationSettingsColumns: GridColDef[] = [
    {
        field: 'sno',
        headerName: 'S.No.',
        flex: NUMBERMAP.HALF,
        sortable: false,
    },
    {
        field: 'feature_name',
        headerName: 'Feature Settings',
        flex: NUMBERMAP.TWO,
        sortable: false,
    },
    {
        field: 'applicable',
        headerName: 'Applicable',
        flex: NUMBERMAP.ONE,
        sortable: false,
    },
]

export const supplierDetailsColumns: GridColDef[] = [
    {
        field: 'sno',
        headerName: 'S.No.',
        flex: NUMBERMAP.HALF,
    },
    {
        field: 'vendor_name',
        headerName: 'Supplier Name',
        flex: NUMBERMAP.TWO,
    },
    {
        field: 'part_number',
        headerName: 'Supplier Part No.',
        flex: NUMBERMAP.TWO,
    },

];

export const filesInformationColumns: GridColDef[] = [
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
        field: 'date_of_upload',
        headerName: 'Date of Upload',
        flex: NUMBERMAP.ONE,
    },
    {
        field: 'file_category',
        headerName: 'File Category',
        flex: NUMBERMAP.ONE,
    },
    {
        field: 'file_status',
        headerName: 'File Status',
        flex: NUMBERMAP.ONE,
    },
]

export const PART_ID_FIELD = {
    PART_ID: 'part_id',
}

// Quantity Type Values
export const QUANTITY_TYPE_VALUES = {
    UNIT: 'unit',
    BATCH: 'batch',
} as const

// Dropdown Options
export const QUANTITY_TYPE_OPTIONS = [
    { value: QUANTITY_TYPE_VALUES.UNIT, label: 'Unit' },
    { value: QUANTITY_TYPE_VALUES.BATCH, label: 'Batch' },
] as const

export const BOM_TYPE_OPTIONS = [
    { value: 'manufacture', label: 'Manufacture' },
    { value: 'purchase', label: 'Purchase' },
] as const

// Dropdown Field Mappings
export const DROPDOWN_FIELDS = {
    EQUIPMENT_TYPE: {
        KEY_FIELD: 'equipment_item_id',
        VALUE_FIELD: 'equipment_item',
    },
    SUPPLIER_DETAIL: {
        ID_FIELD: 'supplier_detail_id',
    },
    INSPECTION_PROCEDURE: {
        KEY_FIELD: 'inspection_procedure_id',
        VALUE_FIELD: 'file_name',
    },
    VENDOR: {
        KEY_FIELD: 'id',
        VALUE_FIELD: 'vendor_name',
    },
} as const