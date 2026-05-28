import { apiClient } from "@/shared/apiClient";
import { API_ENDPOINTS } from "@/constants/modules/vendor-management/sampleInspection";
import { 
  SampleOrderPartsResponse, 
  SampleInspectionResponse 
} from "@/types/modules/vendor-management/sampleInspection";

/**
    Classification : Confidential
**/

/**
 * Fetch sample order parts by sample order ID
 * @param sample_order_id - The ID of the sample order
 * @returns Promise<SampleOrderPartsResponse>
 */
export const fetchSampleOrderParts = async (
  sample_order_id: number
): Promise<SampleOrderPartsResponse> => {
  const response = await apiClient.get(API_ENDPOINTS.FETCH_SAMPLE_ORDER_PARTS(sample_order_id));
  return response.data;
};

/**
 * Fetch sample inspection data by sample order ID and part number
 * @param sample_order_id - The ID of the sample order
 * @param part_number - Optional part number filter
 * @returns Promise<SampleInspectionResponse>
 */
export const fetchSampleInspection = async (
  sample_order_id: number,
  part_number?: number
): Promise<SampleInspectionResponse> => {
  const response = await apiClient.get(API_ENDPOINTS.FETCH_SAMPLE_INSPECTION(sample_order_id, part_number));
  return response.data;
};

/**
 * Create or update sample inspection
 * @param formData - FormData containing all inspection fields
 * @returns Promise<any>
 */
export const postSampleInspection = async (
  formData: FormData
): Promise<any> => {
  const response = await apiClient.post(API_ENDPOINTS.POST_SAMPLE_INSPECTION(), formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

