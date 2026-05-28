import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  fetchAllQuotations, 
  fetchQuotationById, 
  upsertQuotation,
  deleteQuotation,
  fetchAllCustomers,
  fetchModelsByProductId,
} from "@/services/modules/sales/quotation";
import { 
  QuotationResponse,
  QuotationByIdResponse,
  CustomerResponse,
  QuotationFilters,
} from "@/types/modules/sales/quotation";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { NUMBERMAP } from "@/constants/common";

/**
 * Classification : Confidential
 **/

/**
 * Hook to fetch all quotations with optional filters
 */
export const useAllQuotations = (enabled?: boolean) => {

  return useQuery<QuotationResponse, Error>({
    queryKey: [QUERY_KEYS.QUOTATION.FETCH_ALL],
    queryFn: () => fetchAllQuotations(),
    enabled: enabled ?? true,
  });
};

/**
 * Hook to fetch quotation by ID
 */
export const useQuotationById = (quotationId: number, enabled?: boolean) => {
  return useQuery<QuotationByIdResponse, Error>({
    queryKey: [QUERY_KEYS.QUOTATION.FETCH_BY_ID, quotationId],
    queryFn: () => fetchQuotationById(quotationId),
    enabled: enabled ?? !!quotationId,
    placeholderData: undefined,
    // stops structural sharing (also prevents reusing nested old data)
    staleTime: NUMBERMAP.ZERO,
    gcTime: NUMBERMAP.ZERO,
  });
};

/**
 * Hook to insert or update quotation
 */
export const useUpsertQuotation = () => {
  const queryClient = useQueryClient();
  
  return useMutation<QuotationResponse, Error, FormData>({
    mutationFn: upsertQuotation,
    onSuccess: () => {
      // Invalidate and refetch quotation queries
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.QUOTATION.FETCH_ALL] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.QUOTATION.FETCH_BY_ID] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.QUOTATION.CUSTOMERS] });
      // Invalidate order acknowledgement queries to reflect updated quotation data
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ORDER_ACKNOWLEDGEMENT.FETCH_ALL] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ORDER_ACKNOWLEDGEMENT.FETCH_BY_ID] });
    },
  });
};

/**
 * Hook to fetch all customers
 */
export const useAllCustomers = (enabled?: boolean) => {
  return useQuery<CustomerResponse, Error>({
    queryKey: [QUERY_KEYS.QUOTATION.CUSTOMERS],
    queryFn: () => fetchAllCustomers(),
    enabled: enabled ?? true,
  });
};

/**
 * Hook to delete quotation by ID
 */
export const useDeleteQuotation = () => {
  const queryClient = useQueryClient();

  return useMutation<QuotationResponse, Error, number | string>({
    mutationFn: deleteQuotation,
    onSuccess: (data, quotationId) => {
      // Invalidate list query to refresh the grid
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.QUOTATION.FETCH_ALL] });
      // Invalidate the specific quotation query to ensure edit page shows updated status
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.QUOTATION.FETCH_BY_ID, quotationId] });
    },
  });
};

/**
 * Hook to fetch quotation list with filters
 */
export const useQuotationList = (filters?: QuotationFilters, enabled?: boolean) => {
  return useQuery<QuotationResponse, Error>({
    queryKey: [QUERY_KEYS.QUOTATION.FETCH_ALL, 'list', filters],
    queryFn: () => fetchAllQuotations(),
    enabled: enabled ?? true,
  });
};

/**
 * Hook to fetch models by product ID
 */
export const useProductModels = (productId: number | null) => {
  return useQuery<any, Error>({
    queryKey: [QUERY_KEYS.QUOTATION.MODELS, productId],
    queryFn: () => fetchModelsByProductId(productId),
    enabled: !!productId,
  });
};
