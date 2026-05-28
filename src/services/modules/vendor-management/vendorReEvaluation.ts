import { VENDOR_RE_EVALUATION_CONSTANTS } from "@/constants/modules/vendor-management/vendorReEvaluation"
import { apiClient } from "@/shared/apiClient"
import { VendorReEvaluationResponse } from "@/types/modules/vendor-management/vendorReEvaluation"

/**
 * Classification : Confidential
**/

export const fetchVendorRevaluationList = async () =>{
    const response = await apiClient.get(VENDOR_RE_EVALUATION_CONSTANTS.API_ENDPOINTS.vendor_re_evaluation_list)
    
    return response.data
}

/**
 * Fetch vendor re-evaluation by ID
 * @param reEvaluationId - The ID of the vendor re-evaluation
 * @returns Promise<VendorReEvaluationResponse>
 */
export const fetchVendorReEvaluationById = async (reEvaluationId: string): Promise<VendorReEvaluationResponse> => {
  const response = await apiClient.get(VENDOR_RE_EVALUATION_CONSTANTS.API_ENDPOINTS.FETCH_BY_ID(reEvaluationId));
  return response.data;
};

/**
 * Insert or update vendor re-evaluation
 * @param formData - The vendor re-evaluation data as FormData
 * @returns Promise<VendorReEvaluationResponse>
 */
export const upsertVendorReEvaluation = async (formData: FormData): Promise<VendorReEvaluationResponse> => {
  const response = await apiClient.post(VENDOR_RE_EVALUATION_CONSTANTS.API_ENDPOINTS.UPSERT, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Fetch vendor re-evaluation criteria details by criteria ID
 * @param criteriaId - The criteria ID (part category ID)
 * @returns Promise with criteria details
 */
export const fetchVendorReEvaluationCriteriaDetails = async (criteriaId: number | null) => {
  const response = await apiClient.get(VENDOR_RE_EVALUATION_CONSTANTS.API_ENDPOINTS.FETCH_CRITERIA_DETAILS(criteriaId));
  return response.data;
};

/**
 * Delete vendor re-evaluation
 * @param id - The ID of the vendor re-evaluation to delete
 * @returns Promise<VendorReEvaluationResponse>
 */
export const deleteVendorReEvaluation = async (id: number): Promise<VendorReEvaluationResponse> => {
  const response = await apiClient.delete(VENDOR_RE_EVALUATION_CONSTANTS.API_ENDPOINTS.DELETE(id));
  return response.data;
};


