/**
 * Classification: Confidential
 * Production Module Common Service
 * Consolidated service for all production module APIs
 */

import { apiClient } from '@/shared/apiClient'
import { API_ENDPOINTS } from '@/constants/modules/production/common'
import { InventoryDetailsFormData, LocationDetail } from '@/components/modules/production/assembly-settings/InventoryDetailsForm'
import { ItemExcludedIQAFormData } from '@/components/modules/production/assembly-settings/ItemExcludedIQAForm'
import { SerialBatchNumberFormData } from '@/components/modules/production/assembly-settings/SerialBatchNumberForm'
import { StorageEnvironmentDetailsFormData } from '@/components/modules/production/assembly-settings/StorageEnvironmentDetailsForm'


// ==================== Inventory Detail Types and Services ====================

export interface InventoryDetailPayload {
  assembly_part_item_id: number
  part_number: string
  part_type: string
  part_name: string
  batch_unit: string
  location_details: LocationDetail[]
}

export interface InventoryDetailResponse {
  /** API may return [{}] initially or {} after draft; normalize when consuming */
  data: InventoryDetailsFormData[] | InventoryDetailsFormData
  total?: number
  page?: number
  limit?: number
}

/**
 * Upsert inventory detail
 * @param payload - Inventory detail payload
 * @returns Promise<any>
 */
export const upsertInventoryDetail = async (
  payload: InventoryDetailPayload
): Promise<any> => {
  const response = await apiClient.post(API_ENDPOINTS.INVENTORY_DETAIL_UPSERT, payload)
  return response.data
}

/**
 * Fetch inventory detail list by assembly part item ID
 * @param assemblyPartItemId - Assembly part item ID
 * @returns Promise<InventoryDetailResponse>
 */
export const fetchInventoryDetailList = async (
  assemblyPartItemId: number
): Promise<InventoryDetailResponse> => {
  const response = await apiClient.get(API_ENDPOINTS.INVENTORY_DETAIL_LIST(assemblyPartItemId))
  return response.data
}

// ==================== IQA Exclusion Types and Services ====================

export interface IQAExclusionPayload {
  applicable_settings_id: number
  is_excluded_from_iqa: number // 0 or 1
  justification: string
}

export interface IQAExclusionResponse {
  data: ItemExcludedIQAFormData[]
  total?: number
  page?: number
  limit?: number
}

/**
 * Upsert IQA exclusion
 * @param payload - IQA exclusion payload
 * @returns Promise<any>
 */
export const upsertIQAExclusion = async (
  payload: IQAExclusionPayload
): Promise<any> => {
  const response = await apiClient.post(API_ENDPOINTS.IQA_EXCLUSION_UPSERT, payload)
  return response.data
}

/**
 * Fetch IQA exclusion list by assembly part item detail ID
 * @param assemblyPartItemDetailId - Assembly part item detail ID
 * @returns Promise<IQAExclusionResponse>
 */
export const fetchIQAExclusionList = async (
  assemblyPartItemDetailId: number
): Promise<IQAExclusionResponse> => {
  const response = await apiClient.get(API_ENDPOINTS.IQA_EXCLUSION_LIST(assemblyPartItemDetailId))
  return response.data
}

// ==================== Serial Batch Number Types and Services ====================

export interface SerialBatchNumberPayload {
  assembly_part_item_id: number
  is_serial_batch_required: string | number
}

export interface SerialBatchNumberResponse {
  data: SerialBatchNumberFormData[]
  total?: number
  page?: number
  limit?: number
}

/**
 * Upsert serial batch number
 * @param payload - Serial batch number payload
 * @returns Promise<any>
 */
export const upsertSerialBatchNumber = async (
  payload: SerialBatchNumberPayload
): Promise<any> => {
  const response = await apiClient.post(API_ENDPOINTS.SERIAL_BATCH_UPSERT, payload)
  return response.data
}

/**
 * Fetch serial batch number list by part assembly detail ID
 * @param partAssemblyDetailId - Part assembly detail ID
 * @returns Promise<SerialBatchNumberResponse>
 */
export const fetchSerialBatchNumberList = async (
  partAssemblyDetailId: number
): Promise<SerialBatchNumberResponse> => {
  const response = await apiClient.get(API_ENDPOINTS.SERIAL_BATCH_LIST(partAssemblyDetailId))
  return response.data
}

// ==================== Storage Environment Types and Services ====================

export interface StorageEnvironmentPayload {
  applicable_settings_id: number
  storage_details: string
  environment_conditions: string
}

export interface StorageEnvironmentResponse {
  /** Initial fetch returns [{}]; after draft save returns {} */
  data: StorageEnvironmentDetailsFormData[] | StorageEnvironmentDetailsFormData
  total?: number
  page?: number
  limit?: number
}

/**
 * Upsert storage environment details
 * @param payload - Storage environment payload
 * @returns Promise<any>
 */
export const upsertStorageEnvironment = async (
  payload: StorageEnvironmentPayload
): Promise<any> => {
  const response = await apiClient.post(API_ENDPOINTS.STORAGE_ENVIRONMENT_UPSERT, payload)
  return response.data
}

/**
 * Fetch storage environment list by assembly part item detail ID
 * @param assemblyPartItemDetailId - Assembly part item detail ID
 * @returns Promise<StorageEnvironmentResponse>
 */
export const fetchStorageEnvironmentList = async (
  assemblyPartItemDetailId: number
): Promise<StorageEnvironmentResponse> => {
  const response = await apiClient.get(API_ENDPOINTS.STORAGE_ENVIRONMENT_LIST(assemblyPartItemDetailId))
  return response.data
}

// ==================== Electrical Drawing Types and Services ====================

export interface AssemblyDrawingDocument {
  file_id: number
  file_name: string
  file_description: string | null
  file_object_key: string
  purpose: string | null
  guid: string
  source: string | null
  file_size: number
  version: string
  updated_date: string | null
  updated_by: string | null
  status: number
  uploaded_date: string
  extension: string
  file_bucket: string
  file_tags: any[]
}

export interface AssemblyDrawingApiResponse {
  id: number
  drawing_number: string
  document: AssemblyDrawingDocument[]
  status: number
}

export interface ElectricalDrawingPayload {
  applicable_settings_id?: number
  drawing_id?: number
  drawing_number: string
  document?: any[]
}

export interface ElectricalDrawingResponse {
  data: AssemblyDrawingApiResponse[]
  total?: number
  page?: number
  limit?: number
}

/**
 * Fetch all electrical drawings by assembly part item detail ID
 * @param assemblyPartItemDetailId - Assembly part item detail ID
 * @returns Promise<ElectricalDrawingResponse>
 */
export const fetchAllElectricalDrawings = async (
  assemblyPartItemDetailId: number
): Promise<ElectricalDrawingResponse> => {
  const response = await apiClient.get(API_ENDPOINTS.ELECTRICAL_DRAWING_FETCH_ALL, {
    params: { applicable_settings_id: assemblyPartItemDetailId },
  })
  return response.data
}

/**
 * Fetch electrical drawing by ID
 * @param drawingId - Drawing ID
 * @returns Promise<any>
 */
export const fetchElectricalDrawingById = async (
  drawingId: number
): Promise<any> => {
  const response = await apiClient.get(API_ENDPOINTS.ELECTRICAL_DRAWING_FETCH_BY_ID(drawingId))
  return response.data
}

/**
 * Upsert electrical drawing
 * @param payload - Electrical drawing payload
 * @returns Promise<any>
 */
export const upsertElectricalDrawing = async (
  payload: ElectricalDrawingPayload
): Promise<any> => {
  const response = await apiClient.post(API_ENDPOINTS.ELECTRICAL_DRAWING_UPSERT, payload)
  return response.data
}

/**
 * Delete electrical drawing
 * @param drawingId - Drawing ID
 * @returns Promise<any>
 */
export const deleteElectricalDrawing = async (
  drawingId: number
): Promise<any> => {
  const response = await apiClient.delete(API_ENDPOINTS.ELECTRICAL_DRAWING_DELETE(drawingId))
  return response.data
}

// ==================== Shelf Life Types and Services ====================

export interface ShelfLifePayload {
  applicable_settings_id: number
  shelf_life: string
  non_conformed_location_id: number
  environment_specs: string
  disposition_method: string // Note: API has typo "menthod" instead of "method"
}

export interface ShelfLifeApiResponse {
  part_number?: string
  part_description?: string
  part_item_detail_id?: number
  shelf_life?: string | null
  non_conformed_location_id?: number | null
  disposition_method?: string | null
  storage_environment_id?: number
  storage_details?: string
  environment_conditions?: string
  inventory_id?: number
  floor?: string
  room?: string
  shelf_details?: string
  bin_number?: string
  address?: string
  unit?: string
}

export interface ShelfLifeResponse {
  /** API may return [{}] initially or {} after draft; normalize when consuming */
  data: ShelfLifeApiResponse[] | ShelfLifeApiResponse
  total?: number
  page?: number
  limit?: number
}

export interface NonConformedLocation {
  id: number
  non_conformed_location: string
  status: number
  created_at?: string
  updated_at?: string
}

export interface NonConformedLocationResponse {
  data: NonConformedLocation[]
  total?: number
  page?: number
  limit?: number
}

/**
 * Upsert shelf life
 * @param payload - Shelf life payload
 * @returns Promise<any>
 */
export const upsertShelfLife = async (
  payload: ShelfLifePayload
): Promise<any> => {
  const response = await apiClient.post(API_ENDPOINTS.SHELF_LIFE_UPSERT, payload)
  return response.data
}

/**
 * Fetch shelf life list by assembly part item detail ID
 * @param assemblyPartItemDetailId - Assembly part item detail ID
 * @returns Promise<ShelfLifeResponse>
 */
export const fetchShelfLifeList = async (
  assemblyPartItemDetailId: number
): Promise<ShelfLifeResponse> => {
  const response = await apiClient.get(API_ENDPOINTS.SHELF_LIFE_LIST(assemblyPartItemDetailId))
  return response.data
}

/**
 * Fetch all non-conformed locations
 * @param status - Optional status filter (1 for active)
 * @returns Promise<NonConformedLocationResponse>
 */
export const fetchAllNonConformedLocations = async (
  status?: number
): Promise<NonConformedLocationResponse> => {
  const params = status !== undefined ? { status } : {}
  const response = await apiClient.get(API_ENDPOINTS.NON_CONFORMED_LOCATION_ALL, { params })
  return response.data
}

// ==================== Jigs Type Types and Services ====================

export interface JigType {
  jigs_type_id: number
  jigs_type_name: string
  status: number
  created_at?: string
  updated_at?: string
  [key: string]: string | number | undefined
}

// Type assertion helper for MultiSelect compatibility
export type JigTypeForMultiSelect = {
  jigs_type_id: number
  jigs_type_name: string
  status: number
  [key: string]: string | number
}

export interface JigTypeResponse {
  data: JigType[]
  total?: number
  page?: number
  limit?: number
}

/**
 * Fetch all jigs types with optional status filter
 * @param status - Optional status filter (1 for active)
 * @returns Promise<JigTypeResponse>
 */
export const fetchAllJigsTypes = async (
  status?: number
): Promise<JigTypeResponse> => {
  const params = status !== undefined ? { status } : {}
  const response = await apiClient.get(API_ENDPOINTS.JIGS_TYPE_ALL, { params })
  return response.data
}

// ==================== Assembly Work Instruction Types and Services ====================

export interface AssemblyWorkInstructionStep {
  step_id?: string
  step_no: string
  assembly_step_visuals: string
  assembly_instruction: string
  safety_precautions: string
}

export interface AssemblyWorkInstructionPayload {
  applicable_settings_id: number
  description_of_assembly: string
  part_legend: string
  jigs_and_settings: string
  estimated_hours?: string
  tool_type: string // JSON string array like "[3]"
  jig_type: string // JSON string array like "[2]"
  equipment_type: string // JSON string array like "[1]"
  skills_required: string // JSON string array like "[4]"
  add_steps: string // JSON string array of AssemblyWorkInstructionStep
  documents_to_create?: File[]
  create_meta_data?: string // JSON string
}

export interface AssemblyPartDetail {
  part_code?: string
  part_name?: string
  [key: string]: any
}

export interface AssemblyWorkInstructionApiResponse {
  assembly_work_instruction_id: number | null
  applicable_settings_id: number | null
  assembly_part_name: string | null
  assembly_part_code: string | null
  assembly_part_details: AssemblyPartDetail[]
  product_name: string | null
  description_of_assembly: string | null
  part_legend: string | null
  jigs_and_settings: string | null
  estimated_hours: string | null
  tool_type: number[]
  jig_type: number[]
  equipment_type: number[]
  skills_required: number[]
  add_steps: AssemblyWorkInstructionStep[]
  supporting_file_documents: any[]
}

export interface AssemblyWorkInstructionResponse {
  /** Initial fetch returns [{}]; after draft save returns {} */
  data: AssemblyWorkInstructionApiResponse[] | AssemblyWorkInstructionApiResponse
}

/**
 * Upsert assembly work instruction
 * @param payload - Assembly work instruction payload (FormData)
 * @returns Promise<any>
 */
export const upsertAssemblyWorkInstruction = async (
  payload: FormData
): Promise<any> => {
  const response = await apiClient.post(API_ENDPOINTS.ASSEMBLY_WORK_INSTRUCTION_UPSERT, payload, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

/**
 * Fetch assembly work instruction by assembly part item detail ID
 * @param assemblyPartItemDetailId - Assembly part item detail ID
 * @returns Promise<AssemblyWorkInstructionResponse>
 */
export const fetchAssemblyWorkInstructionById = async (
  assemblyPartItemDetailId: number
): Promise<AssemblyWorkInstructionResponse> => {
  const response = await apiClient.get(API_ENDPOINTS.ASSEMBLY_WORK_INSTRUCTION_FETCH_BY_ID(assemblyPartItemDetailId))
  return response.data
}

// ==================== Jigs Fixture Validation Types and Services ====================
export interface JigFixtureValidationType {
  jig_fixture_validation_id: number;
  jig_type_id: number;
  jig_type_name: string;
}

export interface JigFixtureValidationTypeResponse {
  data: JigFixtureValidationType[];
  total?: number;
  page?: number;
  limit?: number;
}

/**
 * Fetch all jig fixture validation types for a project
 * @param projectId - Project ID
 * @returns Promise<JigFixtureValidationTypeResponse>
 */
export const fetchJigFixtureValidations = async (
  projectId: number
): Promise<JigFixtureValidationTypeResponse> => {
  const response = await apiClient.get(`/api/v1/production/jig-fixture-validation/all`, {
    params: { project_id: projectId },
  });
  return response.data;
};

export interface JigNumber {
  jig_item_id: number;
  jig_type_id: number;
  jig_item: string;
  jig_number: string;
  status: number;
}

export interface JigNumberResponse {
  code: number;
  status: string;
  message: string;
  response_timestamp: string;
  description: string;
  data: JigNumber[];
}

/**
 * Fetch all jig numbers for a given jig type id
 * @param jig_type_id - Jig type ID
 * @param status - Status filter (default: 1 for active)
 * @returns Promise<JigNumberResponse>
 */
export const fetchJigNumbersByType = async (
  jig_type_id: number,
  status: number = 1
): Promise<JigNumberResponse> => {
  const response = await apiClient.get(`/api/v1/production/jig-item/all`, {
    params: { jig_type_id, status },
  });
  return response.data;
};

/**
 * Fetch jig number details (last validation etc) by jig item id
 * @param jig_item_id - Jig item ID
 * @returns Promise<any>
 */
export const fetchJigNumberDetail = async (
  jig_item_id: number
): Promise<any> => {
  const response = await apiClient.get(`/api/v1/production/jig-item/${jig_item_id}`);
  return response.data;
};

export interface JigFixtureValidationDetail {
  // Define this as per API response structure. Example fields:
  id: number|string;
  acceptance_criteria: string;
  expected_result: string;
  test_observation: string;
  result: string;
  [key: string]: any;
}

export interface JigFixtureValidationDetailResponse {
  data: JigFixtureValidationDetail[];
  total?: number;
  page?: number;
  limit?: number;
}

/**
 * Fetch Jig Fixture Validation List by jig_fixture_validation_id
 */
export const fetchJigFixtureValidationList = async (
  jig_fixture_validation_id: number | string
): Promise<JigFixtureValidationDetailResponse> => {
  const response = await apiClient.get(`/api/v1/production/jig-fixture-validation/${jig_fixture_validation_id}`);
  return response.data;
};

export interface BillOfMaterialRow {
  id: number | string;
  [key: string]: any;
}

export interface BillOfMaterialResponse {
  data: BillOfMaterialRow[];
  total?: number;
  page?: number;
  limit?: number;
}

export const fetchBillOfMaterialList = async (
  projectId: number
): Promise<BillOfMaterialResponse> => {
  const response = await apiClient.get(API_ENDPOINTS.BILL_OF_MATERIAL_ALL(projectId));
  return response.data;
};

export interface BillOfMaterialSettingsRow {
  id: number | string;
  [key: string]: any;
}

export interface BillOfMaterialSettingsResponse {
  data: BillOfMaterialSettingsRow[];
  total?: number;
  page?: number;
  limit?: number;
}

export const fetchBillOfMaterialSettings = async (
  partItemDetailId: number
): Promise<BillOfMaterialSettingsResponse> => {
  const response = await apiClient.get(API_ENDPOINTS.BILL_OF_MATERIAL_SETTINGS(partItemDetailId));
  return response.data;
};

// ==================== Jig Fixtures Validation Report Types and Services ====================

export interface JigFixturesValidationReportPayload {
  jigs_fixtures_validation_report_id?: number | string;
  assembly_part_item_detail_id: number | string;
  jig_item_id: number | string;
  procedure_of_validation: string;
  scope_of_application: string;
  date_of_validation: string; // ISO 8601 format: "2025-12-09T10:30:00Z"
}

export interface JigFixturesValidationReportItem {
  jig_fixture_validation_report_id: number;
  jig_type: string;
  jig_number: string;
  jig_name: string;
  validation_date: string;
  [key: string]: any;
}

export interface JigFixturesValidationReportResponse {
  code: number;
  status: string;
  message: string;
  response_timestamp: string;
  description: string;
  data: JigFixturesValidationReportItem[];
}

export interface JigFixturesValidationReportUpsertResponse {
  code?: number;
  status?: string;
  message?: string;
  response_timestamp?: string;
  description?: string;
  data?: JigFixturesValidationReportItem;
}

/**
 * Fetch all jig fixtures validation reports
 * @param status - Status filter (default: 1 for active)
 * @returns Promise<JigFixturesValidationReportResponse>
 */
export const fetchJigFixturesValidationReports = async (
  status: number = 1
): Promise<JigFixturesValidationReportResponse> => {
  const response = await apiClient.get(`${API_ENDPOINTS.JIGS_FIXTURE_REPORT}/all`);
  return response.data;
};

/**
 * Fetch jig fixtures validation report by ID
 * @param reportId - Jig fixtures validation report ID
 * @returns Promise<any>
 */
export const fetchJigFixturesValidationReportById = async (
  reportId: number
): Promise<any> => {
  const response = await apiClient.get(`${API_ENDPOINTS.JIGS_FIXTURE_REPORT}/${reportId}`);
  return response.data;
};

/**
 * Upsert jig fixtures validation report
 * @param payload - Jig fixtures validation report payload (can be FormData or object)
 * @returns Promise<JigFixturesValidationReportUpsertResponse>
 */
export const upsertJigFixturesValidationReport = async (
  payload: JigFixturesValidationReportPayload | FormData
): Promise<JigFixturesValidationReportUpsertResponse> => {
  const response = await apiClient.post(API_ENDPOINTS.JIGS_FIXTURE_REPORT, payload, {
    headers: payload instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
  });
  return response.data;
};

/**
 * Delete jig fixtures validation report
 * @param reportId - Jig fixtures validation report ID
 * @returns Promise<void>
 */
export const deleteJigFixturesValidationReport = async (
  reportId: number
): Promise<void> => {
 const response = await apiClient.delete(`${API_ENDPOINTS.JIGS_FIXTURE_REPORT}/${reportId}`);
  return response.data;
};

