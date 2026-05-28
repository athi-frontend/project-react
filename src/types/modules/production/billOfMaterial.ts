/**
 * Classification: Confidential
 * Bill of Material Types
 */

import { NUMBERMAP } from "@/constants/common"

export interface BillOfMaterial {
    part_id: number | string
    part_name: string
    part_number: string
    part_type: string
    assembly_parts_item_id: string
    part_item_detail_id: number
}

export interface BillOfMaterialListResponse {
    code: number
    message: string
    data: BillOfMaterial[]
}

export interface BillOfMaterialDeleteResponse {
    code: number
    message: string
    data?: any
}

export interface PartSettingFormData {
    part_item_detail_id: number
    product_id: string | null
    product_name: string
    assembly_part: string
    part_code: string
    configuration_settings: ConfigurationSetting[]
    status?: number
}

export interface PartSettingDetailResponse {
    code: number
    message: string
    data: PartSettingFormData[]
}

export interface ConfigurationSetting {
    applicable_setting_id: string | number
    feature_id: number
    feature_name: string
    applicable: number // 0 or 1
    // Legacy fields for backward compatibility
    id?: number | string
    sno?: number
    feature_setting?: string
}

export interface PartSettingConfigurationItem {
    feature_id: number
    applicable: number
}

export interface PartSettingUpsertRequest {
    part_item_detail_id: number
    configuration_settings: PartSettingConfigurationItem[]
}

export interface PartSettingUpsertResponse {
    code: number
    message: string
    data?: any
}

export interface PartSupplierDetail {
    supplier_detail_id: number;
    vendor_id: number;
    vendor_name?: string;
    part_number: string | null;
    moq: string | null;
    lead_time: string | null;
    status: number;
}

export interface PartDocument {
    file_id: number;
    file_name: string;
    file_description: string | null;
    file_object_key: string;
    purpose: string | null;
    guid: string;
    source: string | null;
    file_size: number;
    version: string;
    updated_date: string | null;
    updated_by: string | null;
    status: number;
    uploaded_date: string;
    extension: string;
    file_bucket: string;
    file_tags: any[];
}

export interface PartDetailsFormData {
    assembly_part_item_id: number;
    part_item_detail_id: number;
    project_id: number;
    part_name: string;
    part_number: string;
    part_description: string | null;
    product_name: string | null;
    part_type: string;
    quantity_type_id: number;
    quantity_type_slug: string;
    quantity_type: string;
    visual: string;
    aql: string;
    bom_type: string;
    bom_type_id: number;
    bom_type_slug: string;
    component_type_lk: string;
    classification: string;
    equipment_name: string;
    equipment_type_id: number;
    drawing_number: any[];
    inspection_procedure: number;
    supplier_details: PartSupplierDetail[];
    document: PartDocument[];
}

export interface PartDetailsResponse {
    data: PartDetailsFormData[];
}

// PAYLOAD STRUCTURE FOR ASSEMBLE/PART DETAILS UPSERT
export interface EquipmentItem {
    equipment_item_id: number
    equipment_item: string
    status: number
}

export interface EquipmentItemResponse {
    code: number
    message: string
    data: EquipmentItem[]
}

export interface PartDetailsUpsertRequest {
    project_id: number
    assembly_part_item_id: number
    aql: string
    visual: string
    part_quantity_type: number // 1 for unit, 2 for batch
    part_type: number // 1 for manufacturing, 2 for purchase
    supplier_details: string // JSON stringified array
    equipment_type_id: number
    inspection_procedure: string
    documents_to_create: string[] // Array of file names
    create_meta_data: string // JSON stringified object
    documents_to_delete: string // JSON stringified array
    update_meta_data: string // JSON stringified object
}

export interface PartDetailsUpsertResponse {
    code: number
    message: string
    data?: any
}

// RESPONSE STRUCTURE FOR ASSEMBLE/PART DETAILS
export interface PartDetailsResponse {
    assembly_part_item_id: number,
    part_item_detail_id: number,
    project_id: number,
    part_name: string,
    part_number: string,
    part_description: string,
    product_name: string,
    part_type: string,
    quantity_type_id: number,
    quantity_type_slug: string,
    quantity_type: string,
    visual: string,
    aql: string,
    bom_type: string,
    bom_type_id: number,
    bom_type_slug: string,
    component_type_lk: string,
    classification: string,
    equipment_name: string,
    equipment_type_id: number,
    drawing_number: number[],
    inspection_procedure: number | string,
    supplier_details: [
        {
            supplier_detail_id: number,
            vendor_id: number,
            vendor_name: string,
            part_number: string | null,
            moq: string | null,
            lead_time: string | null,
            status: number
        }
    ],
    document: [],
}

export interface DrawingFile {
    id: number | string
    sno: number
    file_name: string
    progress?: number
}

export interface SupplierDetail {
    vendor_id: number | string
    vendor_name?: string
    supplier_part_no: string
    moq?: string
    lead_time?: string
    status?: number
    supplier_detail_id?: number
}

export interface UploadedFile {
    id: number | string
    file_name: string
    source: string
    date_of_upload: string
    file_category: string
    file_status: string
}

export const DEFAULT_PART_SETTING_FORM_DATA: PartSettingFormData = {
    part_item_detail_id: NUMBERMAP.ZERO,
    product_id: null,
    product_name: '',
    assembly_part: '',
    part_code: '',
    configuration_settings: [
    ],
    status: NUMBERMAP.ONE,
}

export interface PartDetailsFormErrors {
    unit_batch?: string
    aql?: string
    part_type?: string
    equipment_type?: string
    files_upload?: string
    inspection_procedure?: string
    [key: string]: string | undefined
}

export const DEFAULT_PART_DETAILS_FORM_DATA: PartDetailsFormData = {
    assembly_part_name: '',
    part_code: '',
    description: '',
    product_name: '',
    safety_critical_appearance: '',
    unit_batch: 'unit',
    visual: '',
    aql: '',
    part_type: 'manufacturing',
    manufacturer: '',
    hardware_software_both: '',
    classification_samd: '',
    equipment_type: '',
    drawing_numbers: [],
    supplier_details: [],
    files_upload: [],
    inspection_procedure: '',
    status: 1,
}