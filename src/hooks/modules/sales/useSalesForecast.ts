import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  fetchAllSalesForecasts, 
  fetchSalesForecastById, 
  upsertSalesForecast,
  fetchAllPriorities,
  fetchModelsByProduct
} from "@/services/modules/sales/salesForecast";
import { 
  SALES_FORECAST_HOOK, 
  SALES_FORECAST_BY_ID_HOOK,
  PRIORITY_HOOK,
  PRODUCT_MODEL_HOOK
} from "@/constants/modules/sales/salesForecast";
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

/**
    Classification : Confidential
**/

/**
 * Hook to fetch all sales forecasts with optional filtering
 */
export const useAllSalesForecasts = (params?: SalesForecastFilterParams, enabled: boolean = true) => {
  return useQuery<SalesForecastAllResponse, Error>({
    queryKey: [SALES_FORECAST_HOOK, params],
    queryFn: () => fetchAllSalesForecasts(params),
    enabled,
  });
};

/**
 * Hook to fetch sales forecast by ID
 */
export const useSalesForecastById = (salesForecastId: string, enabled?: boolean) => {
  return useQuery<SalesForecastByIdResponse, Error>({
    queryKey: [SALES_FORECAST_BY_ID_HOOK, salesForecastId],
    queryFn: () => fetchSalesForecastById(salesForecastId),
    enabled: enabled ?? !!salesForecastId,
  });
};

/**
 * Hook to create or update sales forecast
 */
export const useUpsertSalesForecast = () => {
  const queryClient = useQueryClient();
  
  return useMutation<SalesForecastUpsertResponse, Error, SalesForecastRequest>({
    mutationFn: upsertSalesForecast,
    onSuccess: (data, variables) => {
      // Invalidate and refetch sales forecast queries
      queryClient.invalidateQueries({ queryKey: [SALES_FORECAST_HOOK] });
      queryClient.invalidateQueries({ queryKey: [SALES_FORECAST_BY_ID_HOOK] });
      
      // Optionally set the new data in cache
      if (variables.sales_forecast_id) {
        queryClient.setQueryData(
          [SALES_FORECAST_BY_ID_HOOK, variables.sales_forecast_id],
          data
        );
      }
    },
  });
};

/**
 * Hook to fetch all priorities with optional filtering
 */
export const useAllPriorities = (params?: PriorityFilterParams, enabled: boolean = true) => {
  return useQuery<PriorityAllResponse, Error>({
    queryKey: [PRIORITY_HOOK, params],
    queryFn: () => fetchAllPriorities(params),
    enabled,
  });
};

export const useProductModels = (productId: string | null, enabled: boolean = true) => {
  return useQuery<ProductModelResponse, Error>({
    queryKey: [PRODUCT_MODEL_HOOK, productId],
    queryFn: () => fetchModelsByProduct(productId ?? ""),
    enabled: enabled && !!productId,
  });
};
