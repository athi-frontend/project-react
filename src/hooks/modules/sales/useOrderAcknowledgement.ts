import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  fetchAllOrderAcknowledgements, 
  fetchOrderAcknowledgementById, 
  upsertOrderAcknowledgement,
  deleteOrderAcknowledgement,
  fetchAllOrderApprovalModes,
  fetchAllQuotations,
  fetchQuotationById
} from "@/services/modules/sales/orderAcknowledgement";
import { 
  OrderAcknowledgementRequest, 
  OrderAcknowledgementResponse, 
  OrderApprovalModeResponse,
} from "@/types/modules/sales/orderAcknowledgement";
import { 
  QuotationResponse
} from "@/types/modules/sales/quotation";
import { QUERY_KEYS } from "@/constants/queryKeys";

/**
 * Classification : Confidential
 **/

/**
 * Hook to fetch all order acknowledgements with optional filters
 */
export const useAllOrderAcknowledgements = (enabled?: boolean) => {
  return useQuery<OrderAcknowledgementResponse, Error>({
    queryKey: [QUERY_KEYS.ORDER_ACKNOWLEDGEMENT.FETCH_ALL],
    queryFn: () => fetchAllOrderAcknowledgements(),
    enabled: enabled ?? true,
  });
};

/**
 * Hook to fetch order acknowledgement by ID
 */
export const useOrderAcknowledgementById = (orderAcknowledgementId: string, enabled?: boolean) => {
  return useQuery<OrderAcknowledgementResponse, Error>({
    queryKey: [QUERY_KEYS.ORDER_ACKNOWLEDGEMENT.FETCH_BY_ID, orderAcknowledgementId],
    queryFn: () => fetchOrderAcknowledgementById(orderAcknowledgementId),
    enabled: enabled ?? !!orderAcknowledgementId,
  });
};

/**
 * Hook to insert or update order acknowledgement
 */
export const useUpsertOrderAcknowledgement = () => {
  const queryClient = useQueryClient();
  
  return useMutation<OrderAcknowledgementResponse, Error, OrderAcknowledgementRequest | FormData>({
    mutationFn: upsertOrderAcknowledgement,
    onSuccess: (data, variables) => {
      // Invalidate and refetch order acknowledgement queries
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ORDER_ACKNOWLEDGEMENT.FETCH_ALL] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ORDER_ACKNOWLEDGEMENT.FETCH_BY_ID] });
      
      // Optionally set the new data in cache
      if (variables instanceof FormData) {
        const orderAcknowledgementId = variables.get('order_acknowledgement_id');
        if (orderAcknowledgementId) {
          queryClient.setQueryData(
            [QUERY_KEYS.ORDER_ACKNOWLEDGEMENT.FETCH_BY_ID, orderAcknowledgementId],
            data
          );
        }
      } else if (variables.order_acknowledgement_id) {
        queryClient.setQueryData(
          [QUERY_KEYS.ORDER_ACKNOWLEDGEMENT.FETCH_BY_ID, variables.order_acknowledgement_id],
          data
        );
      }
    },
  });
};

/**
 * Hook to delete order acknowledgement
 */
export const useDeleteOrderAcknowledgement = () => {
  const queryClient = useQueryClient();
  
  return useMutation<OrderAcknowledgementResponse, Error, string>({
    mutationFn: deleteOrderAcknowledgement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ORDER_ACKNOWLEDGEMENT.FETCH_ALL] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ORDER_ACKNOWLEDGEMENT.FETCH_BY_ID] });
    },
  });
};

/**
 * Hook to fetch all order approval modes
 */
export const useAllOrderApprovalModes = (status?: number, enabled: boolean = true) => {
  return useQuery<OrderApprovalModeResponse, Error>({
    queryKey: [QUERY_KEYS.ORDER_APPROVAL_MODE.FETCH_ALL, status],
    queryFn: () => fetchAllOrderApprovalModes(status),
    enabled,
  });
};

/**
 * Hook to fetch all quotations (active status only)
 */
export const useAllQuotations = (enabled: boolean = true) => {
  return useQuery<QuotationResponse, Error>({
    queryKey: [QUERY_KEYS.QUOTATION.FETCH_ALL],
    queryFn: () => fetchAllQuotations(),
    enabled,
  });
};

/**
 * Hook to fetch quotation by ID
 */
export const useQuotationById = (quotationId: string, enabled?: boolean) => {
  return useQuery<QuotationResponse, Error>({
    queryKey: [QUERY_KEYS.QUOTATION.FETCH_BY_ID, quotationId],
    queryFn: () => fetchQuotationById(quotationId),
    enabled: enabled ?? !!quotationId,
  });
};

