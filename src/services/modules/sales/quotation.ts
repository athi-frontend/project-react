import { apiClient } from "@/shared/apiClient";
import { API_ENDPOINTS } from "@/constants/modules/sales/quotation";
import {
  QuotationResponse,
  CustomerResponse,
  QuotationByIdResponse,
} from "@/types/modules/sales/quotation";

/**
 * Classification : Confidential
 **/

/**
 * Fetch all quotations with optional filters
 * @param filters - Optional filters for the query
 * @returns Promise<QuotationResponse>
 */
export const fetchAllQuotations = async (): Promise<QuotationResponse> => {
  // Status is already included in the API endpoint URL, so we don't need to pass it as params
  const response = await apiClient.get(API_ENDPOINTS.FETCH_ALL);
  return response.data;
};

/**
 * Fetch quotation by ID
 * @param quotationId - The ID of the quotation
 * @returns Promise<QuotationByIdResponse>
 */
export const fetchQuotationById = async (quotationId: number): Promise<QuotationByIdResponse> => {
  const response = await apiClient.get(API_ENDPOINTS.FETCH_BY_ID(quotationId));
  return response.data;
};

/**
 * Insert or update quotation
 * @param formData - The quotation data as FormData
 * @returns Promise<QuotationResponse>
 */
export const upsertQuotation = async (formData: FormData): Promise<QuotationResponse> => {
  const response = await apiClient.post(API_ENDPOINTS.UPSERT, formData);
  return response.data;
};

/**
 * Fetch all customers
 * @returns Promise<CustomerResponse>
 */
export const fetchAllCustomers = async (): Promise<CustomerResponse> => {
  const response = await apiClient.get(API_ENDPOINTS.FETCH_CUSTOMERS);
  return response.data;
};

/**
 * Delete quotation by ID
 * @param quotationId - The ID of the quotation to delete
 * @returns Promise<QuotationResponse>
 */
export const deleteQuotation = async (quotationId: number | string): Promise<QuotationResponse> => {
  const response = await apiClient.delete(API_ENDPOINTS.DELETE(quotationId));
  return response.data;
};

/**
 * Fetch models by product ID
 * @param productId - The ID of the product
 * @returns Promise<any>
 */
export const fetchModelsByProductId = async (productId: number): Promise<any> => {
  const response = await apiClient.get(API_ENDPOINTS.FETCH_MODELS_BY_PRODUCT(productId));
  return response.data;
};
