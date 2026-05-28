import { apiClient } from "@/shared/apiClient";
import { API_ENDPOINTS, QUOTATION_API } from "@/constants/modules/sales/deliveryDispatch";
import { 
  DeliveryDispatchRequest, 
  DeliveryDispatchResponse,
  DeliveryDispatchFilters
} from "@/types/modules/sales/deliveryDispatch";
import { 
  QuotationResponse
} from "@/types/modules/sales/quotation";

/**
 * Classification : Confidential
 **/

/**
 * Fetch all delivery/dispatch records with optional filters
 * @param filters - Optional filters for the query
 * @returns Promise<DeliveryDispatchResponse>
 */
export const fetchAllDeliveryDispatches = async (filters?: DeliveryDispatchFilters): Promise<DeliveryDispatchResponse> => {
  const params = filters ? { ...filters } : {};
  const response = await apiClient.get(API_ENDPOINTS.FETCH_ALL, { params });
  return response.data;
};

/**
 * Fetch delivery/dispatch by ID
 * @param deliveryDispatchId - The ID of the delivery/dispatch record
 * @returns Promise<DeliveryDispatchResponse>
 */
export const fetchDeliveryDispatchById = async (deliveryDispatchId: string): Promise<DeliveryDispatchResponse> => {
  const response = await apiClient.get(API_ENDPOINTS.FETCH_BY_ID(deliveryDispatchId));
  return response.data;
};

/**
 * Insert or update delivery/dispatch
 * @param formData - The delivery/dispatch data
 * @returns Promise<DeliveryDispatchResponse>
 */
export const upsertDeliveryDispatch = async (formData: DeliveryDispatchRequest | FormData): Promise<DeliveryDispatchResponse> => {
  const response = await apiClient.post(API_ENDPOINTS.UPSERT, formData);
  return response.data;
};

/**
 * Delete delivery/dispatch
 * @param id - The ID of the delivery/dispatch record to delete
 * @returns Promise<DeliveryDispatchResponse>
 */
export const deleteDeliveryDispatch = async (id: number | string): Promise<DeliveryDispatchResponse> => {
  const response = await apiClient.delete(API_ENDPOINTS.DELETE(id.toString()));
  return response.data;
};

/**
 * Fetch all quotations (active status only)
 * @returns Promise<QuotationResponse>
 */
export const fetchAllQuotations = async (): Promise<QuotationResponse> => {
  // Status is already included in the API endpoint URL, so we don't need to pass it as params
  const response = await apiClient.get(QUOTATION_API.FETCH_ALL);
  return response.data;
};

/**
 * Fetch quotation by ID
 * @param quotationId - The ID of the quotation
 * @returns Promise<QuotationResponse>
 */
export const fetchQuotationById = async (quotationId: string): Promise<QuotationResponse> => {
  const response = await apiClient.get(QUOTATION_API.FETCH_BY_ID(quotationId));
  return response.data;
};

