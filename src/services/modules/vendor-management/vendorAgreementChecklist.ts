import { apiClient } from "@/shared/apiClient";
import { API_ENDPOINTS } from "@/constants/modules/vendor-management/vendorAgreementChecklist";
import { 
  VendorAgreementChecklistRequest, 
  VendorAgreementChecklistResponse, 
  VendorAgreementChecklistListResponse 
} from "@/types/modules/vendor-management/vendorAgreementChecklist";

/**
    Classification : Confidential
**/
/**
 * Fetch all vendor agreement checklists with optional status filter
 * @param status - Optional status filter (1 for active, 0 for inactive)
 * @returns Promise<VendorAgreementChecklistListResponse>
 */
export const fetchAllVendorAgreementChecklists = async (status?: number, vendorTypeId?: number): Promise<VendorAgreementChecklistListResponse> => {
  const params = status !== undefined ? { status } : {};
  const response = await apiClient.get(API_ENDPOINTS.FETCH_ALL, { params });
  return response.data;
};

/**
 * Fetch vendor agreement checklist by ID
 * @param agreementChecklistId - The ID of the vendor agreement checklist
 * @returns Promise<VendorAgreementChecklistResponse>
 */
export const fetchVendorAgreementChecklistById = async (agreementChecklistId: string): Promise<VendorAgreementChecklistResponse> => {
  const response = await apiClient.get(API_ENDPOINTS.FETCH_BY_ID(agreementChecklistId));
  return response.data;
};

/**
 * Insert or update vendor agreement checklist
 * @param formData - The vendor agreement checklist data
 * @returns Promise<VendorAgreementChecklistResponse>
 */
export const upsertVendorAgreementChecklist = async (formData: VendorAgreementChecklistRequest): Promise<VendorAgreementChecklistResponse> => {
  const response = await apiClient.post(API_ENDPOINTS.UPSERT, formData);
  return response.data;
};

export const deleteVendorAgreementChecklist = async (id: number): Promise<VendorAgreementChecklistResponse> => {
  const response = await apiClient.delete(API_ENDPOINTS.UPSERT+id);
  return response.data;
};
