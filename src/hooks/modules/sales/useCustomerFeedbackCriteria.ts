import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  fetchAllCustomerFeedbackCriteria, 
  fetchCustomerFeedbackCriteriaById,
  upsertCustomerFeedbackCriteria,
  deleteCustomerFeedbackCriteria,
  fetchGroups,
  fetchCriteria,
  fetchSystemDefined,
  fetchProductAll,
} from "@/services/modules/sales/customerFeedbackCriteria";
import { 
  CustomerFeedbackCriteriaResponse,
  CustomerFeedbackCriteriaByIdResponse,
  CustomerFeedbackCriteriaRequest,
  GroupsResponse,
  CriteriaResponse,
  SystemDefinedResponse,
  ProductAllResponse,
} from "@/types/modules/sales/customerFeedbackCriteria";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { NUMBERMAP } from "@/constants/common";

/**
 * Classification : Confidential
 **/

/**
 * Hook to fetch all customer feedback criteria
 */
export const useAllCustomerFeedbackCriteria = (enabled?: boolean) => {
  return useQuery<CustomerFeedbackCriteriaResponse, Error>({
    queryKey: [QUERY_KEYS.CUSTOMER_FEEDBACK_CRITERIA.FETCH_ALL],
    queryFn: () => fetchAllCustomerFeedbackCriteria(),
    enabled: enabled ?? true,
  });
};

/**
 * Hook to fetch customer feedback criteria by ID
 */
export const useCustomerFeedbackCriteriaById = (id: number, enabled?: boolean) => {
  return useQuery<CustomerFeedbackCriteriaByIdResponse, Error>({
    queryKey: [QUERY_KEYS.CUSTOMER_FEEDBACK_CRITERIA.FETCH_BY_ID, id],
    queryFn: () => fetchCustomerFeedbackCriteriaById(id),
    enabled: enabled ?? (!!id && id > NUMBERMAP.ZERO),
    refetchOnMount: true,
    placeholderData: undefined,
    staleTime: NUMBERMAP.ZERO,
    gcTime: NUMBERMAP.ZERO,
  });
};

/**
 * Hook to insert or update customer feedback criteria
 */
export const useUpsertCustomerFeedbackCriteria = () => {
  const queryClient = useQueryClient();
  
  return useMutation<CustomerFeedbackCriteriaByIdResponse, Error, CustomerFeedbackCriteriaRequest>({
    mutationFn: upsertCustomerFeedbackCriteria,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CUSTOMER_FEEDBACK_CRITERIA.FETCH_ALL] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CUSTOMER_FEEDBACK_CRITERIA.FETCH_BY_ID] });
    },
  });
};

/**
 * Hook to delete customer feedback criteria
 */
export const useDeleteCustomerFeedbackCriteria = () => {
  const queryClient = useQueryClient();
  
  return useMutation<CustomerFeedbackCriteriaResponse, Error, number>({
    mutationFn: deleteCustomerFeedbackCriteria,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CUSTOMER_FEEDBACK_CRITERIA.FETCH_ALL] });
      // Invalidate all FETCH_BY_ID queries to ensure edit page shows updated data
      // (Edit page uses product_id while delete uses customer_feedback_criteria_id)
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CUSTOMER_FEEDBACK_CRITERIA.FETCH_BY_ID] });
    },
  });
};

/**
 * Hook to fetch all groups
 * @param includeInactive - Whether to include inactive groups (default: false)
 */
export const useGroups = (enabled?: boolean, includeInactive: boolean = false) => {
  return useQuery<GroupsResponse, Error>({
    queryKey: ['customer-feedback-criteria-groups', includeInactive],
    queryFn: () => fetchGroups(includeInactive),
    enabled: enabled ?? true,
  });
};

/**
 * Hook to fetch criteria by group ID
 * @param groupId - The group ID
 * @param enabled - Whether the query is enabled
 * @param includeInactive - Whether to include inactive criteria (default: false)
 */
export const useCriteria = (groupId: number, enabled?: boolean, includeInactive: boolean = false) => {
  return useQuery<CriteriaResponse, Error>({
    queryKey: ['customer-feedback-criteria-criteria', groupId, includeInactive],
    queryFn: () => fetchCriteria(groupId, includeInactive),
    enabled: enabled ?? (!!groupId && groupId > NUMBERMAP.ZERO),
  });
};

/**
 * Hook to fetch system defined criteria
 */
export const useSystemDefined = (enabled?: boolean) => {
  return useQuery<SystemDefinedResponse, Error>({
    queryKey: ['customer-feedback-criteria-system-defined'],
    queryFn: () => fetchSystemDefined(),
    enabled: enabled ?? true,
  });
};

export const useGetProductAll = (enabled: boolean = true, subtypeId?: number, typeId?: number) => {
  return useQuery<ProductAllResponse, Error>({
    queryKey: [QUERY_KEYS.CUSTOMER_FEEDBACK_CRITERIA.PRODUCT_ALL, subtypeId, typeId],
    queryFn: () => fetchProductAll(subtypeId, typeId),
    enabled,
  });
}

