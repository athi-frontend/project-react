import { apiClient } from "@/shared/apiClient";
import { API_ENDPOINTS } from "@/constants/modules/vendor-management/vendorList";
import { VendorListResponse, VendorCreateUpdateResponse } from "@/types/modules/vendor-management/vendorList";
import { NUMBERMAP } from "@/constants/modules/hr/skill";

/**
    Classification : Confidential
**/

/**
 * Fetch all vendors
 * @returns Promise<VendorListResponse>
 */
export const fetchAllVendors = async (status?:number): Promise<VendorListResponse> => {
  const response = await apiClient.get(API_ENDPOINTS.VENDOR_LIST, {params: {...(status?{}:{status : NUMBERMAP.ONE})}});
  return response.data;
};

/**
 * Fetch vendor by ID
 * @param vendorId - The ID of the vendor
 * @returns Promise<VendorListResponse>
 */
export const fetchVendorById = async (vendorId: string): Promise<VendorListResponse> => {
  const response = await apiClient.get(API_ENDPOINTS.FETCH_BY_ID(vendorId));
  return response.data;
};

/**
 * Delete vendor by ID
 * @param vendorId - The ID of the vendor to delete
 * @returns Promise<VendorListResponse>
 */
export const deleteVendor = async (vendorId: number): Promise<VendorListResponse> => {
  const response = await apiClient.delete(API_ENDPOINTS.DELETE(vendorId.toString()));
  return response.data;
};

/**
 * Create or update vendor
 * @param formData - The vendor form data
 * @returns Promise<VendorCreateUpdateResponse>
 */
export const createUpdateVendor = async (formData: FormData): Promise<VendorCreateUpdateResponse> => {
  const response = await apiClient.post(API_ENDPOINTS.CREATE_UPDATE, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
