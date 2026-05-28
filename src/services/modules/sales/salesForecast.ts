import { apiClient } from "@/shared/apiClient";
import { API_ENDPOINTS, FILE_UPLOAD_LIMITS } from "@/constants/modules/sales/salesForecast";
import { 
  SalesForecastAllResponse, 
  SalesForecastByIdResponse, 
  SalesForecastUpsertResponse,
  SalesForecastRequest,
  SalesForecastFilterParams,
  PriorityAllResponse,
  PriorityFilterParams,
  ProductModelResponse
} from "@/types/modules/sales/salesForecast";
import { NUMBERMAP } from "@/constants/common";

/**
    Classification : Confidential
**/

/**
 * Helper function to safely extract error message from unknown error type
 * @param error - Unknown error object
 * @returns Error message string or null if not extractable
 */
const getErrorMessage = (error: unknown): string | null => {
  if (error && typeof error === 'object' && 'response' in error) {
    const responseError = error as { response?: { data?: { message?: string } } };
    return responseError.response?.data?.message ?? null;
  }
  return null;
};

/**
 * Fetch all sales forecasts with optional filtering
 * @param params - Optional filter parameters (type, start_date, end_date)
 * @returns Promise<SalesForecastAllResponse>
 */
export const fetchAllSalesForecasts = async (params?: SalesForecastFilterParams): Promise<SalesForecastAllResponse> => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.SALES_FORECAST_ALL, { params });
    return response.data;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error 
      ? error.message 
      : getErrorMessage(error) ?? "Failed to fetch sales forecasts.";
    throw new Error(errorMessage);
  }
};

/**
 * Fetch sales forecast by ID
 * @param salesForecastId - Sales forecast identifier
 * @returns Promise<SalesForecastByIdResponse>
 */
export const fetchSalesForecastById = async (salesForecastId: string): Promise<SalesForecastByIdResponse> => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.SALES_FORECAST_BY_ID(salesForecastId));
    return response.data;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error 
      ? error.message 
      : getErrorMessage(error) ?? "Failed to fetch sales forecast.";
    throw new Error(errorMessage);
  }
};

/**
 * Create or update sales forecast
 * @param data - Sales forecast data
 * @returns Promise<SalesForecastUpsertResponse>
 */
export const upsertSalesForecast = async (data: SalesForecastRequest): Promise<SalesForecastUpsertResponse> => {
  try {
    // Create FormData for multipart/form-data request
    const formData = new FormData();
    
    // Add all fields to FormData
    if (data.sales_forecast_id) {
      formData.append('sales_forecast_id', data.sales_forecast_id);
    }
    formData.append('product_id', data.product_id.toString());
    formData.append('model_id', data.model_id.toString());
    formData.append('month_selection', data.month_selection);
    formData.append('priority_id', data.priority_id.toString());
    formData.append('units', data.units.toString());
    formData.append('remarks', data.remarks);
    formData.append('status', NUMBERMAP.ONE);
    
    // Add documents if provided with validation
    if (data.documents_to_create && data.documents_to_create.length > NUMBERMAP.ZERO) {
      data.documents_to_create.forEach((file) => {
        // Only append actual File instances; ignore metadata objects from API
        if (file instanceof File) {
          const sizeOk = file.size > NUMBERMAP.ZERO && file.size <= FILE_UPLOAD_LIMITS.MAX_FILE_SIZE_BYTES;
          if (sizeOk) {
            formData.append('documents_to_create', file);
          }
        }
      });
    }
    
    // Add metadata if provided
    if (data.create_meta_data) {
      formData.append('create_meta_data', data.create_meta_data);
    }

    if (data.update_meta_data) {
      formData.append('update_meta_data', JSON.stringify(data.update_meta_data));
    }

    if (data.documents_to_delete) {
      formData.append('documents_to_delete', JSON.stringify(data.documents_to_delete));
    }

    const response = await apiClient.post(API_ENDPOINTS.SALES_FORECAST_UPSERT, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error 
      ? error.message 
      : getErrorMessage(error) ?? "Failed to save sales forecast.";
    throw new Error(errorMessage);
  }
};

/**
 * Fetch all priorities with optional filtering
 * @param params - Optional filter parameters (status)
 * @returns Promise<PriorityAllResponse>
 */
export const fetchAllPriorities = async (params?: PriorityFilterParams): Promise<PriorityAllResponse> => {
  try {
    const response = await apiClient.get(API_ENDPOINTS.PRIORITY_ALL, { params });
    return response.data;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error 
      ? error.message 
      : getErrorMessage(error) ?? "Failed to fetch priorities.";
    throw new Error(errorMessage);
  }
};

export const fetchModelsByProduct = async (productId: string): Promise<ProductModelResponse> => {
  const response = await apiClient.get(API_ENDPOINTS.MODEL_BY_PRODUCT(productId));
  return response.data;
};