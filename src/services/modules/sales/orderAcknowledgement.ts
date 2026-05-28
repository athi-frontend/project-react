import { apiClient } from "@/shared/apiClient";
import { API_ENDPOINTS, ORDER_APPROVAL_MODE_API, QUOTATION_API } from "@/constants/modules/sales/orderAcknowledgement";
import { 
  OrderAcknowledgementRequest, 
  OrderAcknowledgementResponse, 
  OrderApprovalModeResponse,
} from "@/types/modules/sales/orderAcknowledgement";
import { 
  QuotationResponse
} from "@/types/modules/sales/quotation";

/**
 * Classification : Confidential
 **/

/**
 * Fetch all order acknowledgements with optional filters
 * @param filters - Optional filters for the query
 * @returns Promise<OrderAcknowledgementResponse>
 */
export const fetchAllOrderAcknowledgements = async (): Promise<OrderAcknowledgementResponse> => {
 const response = await apiClient.get(API_ENDPOINTS.FETCH_ALL);
  return response.data;
};

/**
 * Fetch order acknowledgement by ID
 * @param orderAcknowledgementId - The ID of the order acknowledgement
 * @returns Promise<OrderAcknowledgementResponse>
 */
export const fetchOrderAcknowledgementById = async (orderAcknowledgementId: string): Promise<OrderAcknowledgementResponse> => {
  const response = await apiClient.get(API_ENDPOINTS.FETCH_BY_ID(orderAcknowledgementId));
  return response.data;
};

/**
 * Insert or update order acknowledgement
 * @param formData - The order acknowledgement data (FormData for file uploads or OrderAcknowledgementRequest for JSON)
 * @returns Promise<OrderAcknowledgementResponse>
 */
export const upsertOrderAcknowledgement = async (formData: OrderAcknowledgementRequest | FormData): Promise<OrderAcknowledgementResponse> => {
  const isFormData = formData instanceof FormData;
  const response = await apiClient.post(
    API_ENDPOINTS.UPSERT, 
    formData,
    isFormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {}
  );
  return response.data;
};

/**
 * Delete order acknowledgement
 * @param id - The ID of the order acknowledgement to delete
 * @returns Promise<OrderAcknowledgementResponse>
 */
export const deleteOrderAcknowledgement = async (id: string): Promise<OrderAcknowledgementResponse> => {
  const response = await apiClient.delete(API_ENDPOINTS.DELETE(id));
  return response.data;
};

/**
 * Fetch all order approval modes
 * @param status - Optional status filter (1 for active, 0 for inactive)
 * @returns Promise<OrderApprovalModeResponse>
 */
export const fetchAllOrderApprovalModes = async (status?: number): Promise<OrderApprovalModeResponse> => {
  const params = status !== undefined ? { status } : {};
  const response = await apiClient.get(ORDER_APPROVAL_MODE_API.FETCH_ALL, { params });
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
