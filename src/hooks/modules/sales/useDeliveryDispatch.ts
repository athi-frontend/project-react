import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  fetchAllDeliveryDispatches, 
  fetchDeliveryDispatchById, 
  upsertDeliveryDispatch,
  deleteDeliveryDispatch,
} from '@/services/modules/sales/deliveryDispatch';
import { 
  DeliveryDispatchRequest, 
  DeliveryDispatchResponse,
} from '@/types/modules/sales/deliveryDispatch';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { NUMBERMAP } from '@/constants/common';

/**
 * Classification : Confidential
 **/

/**
 * Hook to fetch delivery dispatch by ID
 */
export const useDeliveryDispatchById = (deliveryDispatchId: string, enabled?: boolean) => {
  return useQuery<DeliveryDispatchResponse, Error>({
    queryKey: [QUERY_KEYS.DELIVERY_DISPATCH.FETCH_BY_ID, deliveryDispatchId],
    queryFn: () => fetchDeliveryDispatchById(deliveryDispatchId),
    enabled: enabled ?? !!deliveryDispatchId,
    staleTime: NUMBERMAP.ZERO,
    gcTime: NUMBERMAP.ZERO,
    placeholderData: () => undefined,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook to insert or update delivery dispatch
 */
export const useSaveDeliveryDispatch = () => {
  const queryClient = useQueryClient();
  
  return useMutation<DeliveryDispatchResponse, Error, DeliveryDispatchRequest | FormData>({
    mutationFn: upsertDeliveryDispatch,
    onSuccess: (data, variables) => {
      // Invalidate and refetch delivery dispatch queries
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DELIVERY_DISPATCH.FETCH_ALL] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DELIVERY_DISPATCH.FETCH_BY_ID] });
      
      // Optionally set the new data in cache
      let deliveryDispatchId: number | undefined;
      if (variables instanceof FormData) {
        const idValue = variables.get('delivery_dispatch_id');
        // FormData.get() returns FormDataEntryValue | null, which can be string | File | null
        // Since we append it as a string, it should be a string
        if (idValue && typeof idValue === 'string') {
          const parsedId = Number(idValue);
          deliveryDispatchId = isNaN(parsedId) ? undefined : parsedId;
        }
      } else {
        deliveryDispatchId = variables.delivery_dispatch_id;
      }
      
      if (deliveryDispatchId) {
        queryClient.setQueryData(
          [QUERY_KEYS.DELIVERY_DISPATCH.FETCH_BY_ID, deliveryDispatchId.toString()],
          data
        );
      }
    },
  });
};

/**
 * Hook to fetch all delivery dispatches with optional filters
 */
export const useAllDeliveryDispatches = (enabled?: boolean) => {
  return useQuery<DeliveryDispatchResponse, Error>({
    queryKey: [QUERY_KEYS.DELIVERY_DISPATCH.FETCH_ALL],
    queryFn: () => fetchAllDeliveryDispatches(),
    enabled: enabled ?? true,
  });
};

/**
 * Hook to delete delivery dispatch
 */
export const useDeleteDeliveryDispatch = () => {
  const queryClient = useQueryClient();
  
  return useMutation<DeliveryDispatchResponse, Error, number | string>({
    mutationFn: deleteDeliveryDispatch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DELIVERY_DISPATCH.FETCH_ALL] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DELIVERY_DISPATCH.FETCH_BY_ID] });
    },
  });
};

