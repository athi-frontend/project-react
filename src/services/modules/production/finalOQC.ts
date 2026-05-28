import { API_ENDPOINTS } from '@/constants/apiEndPoints';
import { apiClient } from '@/shared/apiClient';
import { JigsDropdownResponse, EquipmentDropdownResponse, TestProtocolViewResponse, PackagingProtocol, InspectionProtocol, ProductFeatureListResponse, TestProtocolUpsertPayload, UpsertTestResponse, UpsertPackagingResponse, UpsertInspectionResponse, ProductFeatureUpsertPayload } from '@/types/modules/production/finalOQC';
/**
    Classification : Confidential
**/
// ---- Types ----

export const fetchJigs = async (): Promise<JigsDropdownResponse> => {
  const response = await apiClient.get(API_ENDPOINTS.baseURL + API_ENDPOINTS.production.finalOQC.endPoints.dropdowns.jigs);
  return response.data;
};

/**
 * Fetch all Equipment types (for dropdown)
 * @returns Promise<EquipmentDropdownResponse>
 */
export const fetchEquipment = async (): Promise<EquipmentDropdownResponse> => {
  const response = await apiClient.get(API_ENDPOINTS.baseURL + API_ENDPOINTS.production.finalOQC.endPoints.dropdowns.equipment);
  return response.data;
};

// ---- FETCH BY ID ----

/**
 * Fetch Test Protocol by model_mapper_id or burn_in_test_protocol_id
 * @param id model_mapper_id or burn_in_test_protocol_id
 * @param options when burnin is true, fetches with ?burn_in=true (for burn_in_test_protocol_id)
 * @returns Promise<TestProtocolViewResponse>
 */
export const fetchTestProtocol = async (
  id: string | number,
  options?: { burnin?: boolean }
): Promise<TestProtocolViewResponse> => {
  const url = API_ENDPOINTS.baseURL + API_ENDPOINTS.production.finalOQC.endPoints.test.get(id);
  const response = await apiClient.get(url, {
    params: options?.burnin ? { burn_in: 'true' } : undefined,
  });
  return response.data;
};

/**
 * Fetch Packaging Protocol by project_id and model_id
 * @param project_id
 * @param model_id
 * @returns Promise<PackagingProtocol>
 */
export const fetchPackagingProtocol = async (
  project_id: string|number,
  model_id?: string|number
): Promise<PackagingProtocol> => {
  const response = await apiClient.get(API_ENDPOINTS.baseURL + API_ENDPOINTS.production.finalOQC.endPoints.packaging.get(project_id), {
    params: model_id ? { model_id } : undefined,
  });
  return response.data;
};

/**
 * Fetch Inspection Protocol by project_id and model_id
 * @param project_id
 * @param model_id
 * @returns Promise<InspectionProtocol>
 */
export const fetchInspectionProtocol = async (
  project_id: string|number,
  model_id?: string|number
): Promise<InspectionProtocol> => {
  const response = await apiClient.get(API_ENDPOINTS.baseURL + API_ENDPOINTS.production.finalOQC.endPoints.inspection.get(project_id), {
    params: model_id ? { model_id } : undefined,
  });
  return response.data;
};

/**
 * Fetch Product Features by project_id (for Test Protocol table)
 * @param project_id
 * @param status
 * @returns Promise<ProductFeatureListResponse>
 */
export const fetchProductFeatures = async (
  project_id: string | number,
  status: string | number = 1
): Promise<ProductFeatureListResponse> => {
  const response = await apiClient.get(API_ENDPOINTS.baseURL + API_ENDPOINTS.production.finalOQC.endPoints.productFeature.all(project_id, status));
  return response.data;
};

// ---- UPSERT ----

/**
 * Upsert Test Protocol
 * @param payload
 * @returns Promise<UpsertTestResponse>
 */
export const upsertTestProtocol = async (payload: TestProtocolUpsertPayload): Promise<UpsertTestResponse> => {
  const response = await apiClient.post(API_ENDPOINTS.baseURL + API_ENDPOINTS.production.finalOQC.endPoints.test.upsert, payload);
  return response.data;
};

/**
 * Upsert Packaging Protocol
 * @param payload
 * @returns Promise<UpsertPackagingResponse>
 */
export const upsertPackagingProtocol = async (payload: PackagingProtocol): Promise<UpsertPackagingResponse> => {
  const response = await apiClient.post(API_ENDPOINTS.baseURL + API_ENDPOINTS.production.finalOQC.endPoints.packaging.upsert, payload);
  return response.data;
};

/**
 * Upsert Inspection Protocol
 * @param payload
 * @returns Promise<UpsertInspectionResponse>
 */
export const upsertInspectionProtocol = async (payload: InspectionProtocol): Promise<UpsertInspectionResponse> => {
  const response = await apiClient.post(API_ENDPOINTS.baseURL + API_ENDPOINTS.production.finalOQC.endPoints.inspection.upsert, payload);
  return response.data;
};

// Deletion function can be added if API supports it.

export const fetchProductFeatureById = async (product_feature_id: number) => {
  const response = await apiClient.get(API_ENDPOINTS.baseURL + API_ENDPOINTS.production.finalOQC.endPoints.productFeature.get(product_feature_id));
  return response.data;
};

// ---- UPSERT ----
export const upsertProductFeature = async (payload: ProductFeatureUpsertPayload) => {
  const response = await apiClient.post(API_ENDPOINTS.baseURL + API_ENDPOINTS.production.finalOQC.endPoints.productFeature.upsert, payload);
  return response.data;
};