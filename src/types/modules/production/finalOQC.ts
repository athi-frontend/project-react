/**
    Classification : Confidential
**/
export type ApiEnvelope<T> = {
    code: number
    status: string
    message: string
    response_timestamp?: string
    description?: string
    data: T
}

export type TestProtocolUpsertPayload = {}

export type TestProtocolToolRequiredItem = {
    protocol_tool_type_id?: number
    tool_type_id?: number
    tool_type?: string
    status_id?: number
    status?: string
    status_slug?: string
}

export type TestProtocolJigsRequiredItem = {
    protocol_jigs_id?: number
    jigs_type_id?: number
    jigs_type?: string
    status_id?: number
    status?: string
    status_slug?: string
}

export type TestProtocolEquipmentRequiredItem = {
    protocol_equipment_id?: number
    equipment_type_id?: number
    equipment_type?: string
    status_id?: number
    status?: string
    status_slug?: string
}

export type TestProtocolWorkInstructionItem = {
    protocol_work_instruction_id?: number
    step_number?: string
    work_instruction_step_visuals?: string
    description?: string
    setting_usage?: string
    acceptance_criteria?: string
    safety_precautions?: string
    status_id?: number
    status?: string
    status_slug?: string
}

export type TestProtocolViewItem = {
    test_protocol_id?: number
    model_mapper_id?: number
    process_work_instruction?: string
    product_name?: string
    model_number?: string
    process_name?: string
    tools_required?: TestProtocolToolRequiredItem[]
    jigs_required?: TestProtocolJigsRequiredItem[]
    equipment_required?: TestProtocolEquipmentRequiredItem[]
    work_instruction?: TestProtocolWorkInstructionItem[]
}

export type TestProtocolViewResponse = ApiEnvelope<TestProtocolViewItem[]>

export type PackagingProtocol = {};
export type InspectionProtocol = {};
export type UpsertTestResponse = {};
export type UpsertPackagingResponse = {};
export type UpsertInspectionResponse = {};
export type JigsDropdownResponse = [];
export type EquipmentDropdownResponse = [];
export type ProductFeatureListResponse = {};
export type ProductFeatureUpsertPayload = {
    product_feature_id?: number
    project_id: number
    feature_name: string
    feature_description: string
    model: number[]
    status: number
}

export interface TestProtocolFormData {
    feature_name: string
    description: string
    model_id: number[]
    status_id: number | ''
}

export interface TestProtocolFormError {
    feature_name: string
    description: string
    model_id: string
    status_id: string
}