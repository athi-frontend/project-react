import { apiClient } from "@/shared/apiClient";
import { API_ENDPOINTS } from "@/constants/modules/vendor-management/vendorEvaluation";
import { 
  VendorEvaluationRequest, 
  VendorEvaluationResponse, 
  VendorEvaluationListApiResponse
} from "@/types/modules/vendor-management/vendorEvaluation";

/**
 * Classification : Confidential
**/

/**
 * Fetch all vendor evaluations with optional status filter
 * @param status - Optional status filter (1 for active, 0 for inactive)
 * @returns Promise<VendorEvaluationListApiResponse>
 */
export const fetchAllVendorEvaluations = async (status?: number): Promise<VendorEvaluationListApiResponse> => {
  const params = status !== undefined ? { status } : {};
  const response = await apiClient.get(API_ENDPOINTS.FETCH_ALL, { params });
  return response.data;
};

/**
 * Fetch vendor evaluation by ID
 * @param evaluationId - The ID of the vendor evaluation
 * @returns Promise<VendorEvaluationResponse>
 */
export const fetchVendorEvaluationById = async (evaluationId: string): Promise<VendorEvaluationResponse> => {
  const response = await apiClient.get(API_ENDPOINTS.FETCH_BY_ID(evaluationId));
  return response.data;
};

/**
 * Insert or update vendor evaluation
 * @param formData - The vendor evaluation data
 * @returns Promise<VendorEvaluationResponse>
 */
export const upsertVendorEvaluation = async (formData: VendorEvaluationRequest): Promise<VendorEvaluationResponse> => {
  const response = await apiClient.post(API_ENDPOINTS.UPSERT, formData);
  return response.data;
};

/**
 * Delete vendor evaluation
 * @param id - The ID of the vendor evaluation to delete
 * @returns Promise<VendorEvaluationResponse>
 */
export const deleteVendorEvaluation = async (id: number): Promise<VendorEvaluationResponse> => {
  const response = await apiClient.delete(API_ENDPOINTS.FETCH_BY_ID(id.toString()));
  return response.data;
};
