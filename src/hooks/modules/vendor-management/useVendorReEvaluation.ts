import { VENDOR_RE_EVALUATION_CONSTANTS  } from "@/constants/modules/vendor-management/vendorReEvaluation"
import { fetchVendorRevaluationList, fetchVendorReEvaluationById, upsertVendorReEvaluation, fetchVendorReEvaluationCriteriaDetails, deleteVendorReEvaluation } from "@/services/modules/vendor-management/vendorReEvaluation"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { VendorReEvaluationResponse } from "@/types/modules/vendor-management/vendorReEvaluation"
import { NUMBERMAP } from "@/constants/common"

/**
 * Classification : Confidential
**/

export const useFetchVendorReEvaluationList = () =>{
    return useQuery({
        queryKey : [VENDOR_RE_EVALUATION_CONSTANTS.QUERY_KEY.REEVALUATION_LIST],
        queryFn : () => fetchVendorRevaluationList()
    })
}

export const useVendorReEvaluationById = (reEvaluationId: string, enabled?: boolean) => {
  return useQuery<VendorReEvaluationResponse, Error>({
    queryKey: [VENDOR_RE_EVALUATION_CONSTANTS.QUERY_KEY.REEVALUATION_BY_ID, reEvaluationId],
    queryFn: () => fetchVendorReEvaluationById(reEvaluationId),
    enabled: enabled ?? !!reEvaluationId,
    placeholderData: undefined,
    staleTime: NUMBERMAP.ZERO,
    gcTime: NUMBERMAP.ZERO,
  });
};

/**
 * Hook to insert or update vendor re-evaluation
 */
export const useUpsertVendorReEvaluation = () => {
  const queryClient = useQueryClient();
  
  return useMutation<VendorReEvaluationResponse, Error, FormData>({
    mutationFn: upsertVendorReEvaluation,
    onSuccess: (data) => {
      // Invalidate and refetch vendor re-evaluation queries
      queryClient.invalidateQueries({ queryKey: [VENDOR_RE_EVALUATION_CONSTANTS.QUERY_KEY.REEVALUATION_LIST] });
      queryClient.invalidateQueries({ queryKey: [VENDOR_RE_EVALUATION_CONSTANTS.QUERY_KEY.REEVALUATION_BY_ID] });
      
      // Optionally set the new data in cache
      const firstItem = Array.isArray(data?.data) ? data?.data[0] : null;
      const vendorReEvalId = firstItem?.vendor_reevaluation_id;

      if (vendorReEvalId) {
        queryClient.setQueryData(
          [VENDOR_RE_EVALUATION_CONSTANTS.QUERY_KEY.REEVALUATION_BY_ID, vendorReEvalId.toString()],
          data
        );
      }
    },
  });
};

/**
 * Hook to fetch vendor re-evaluation criteria details by criteria ID
 * @param criteriaId - The criteria ID (part category ID)
 * @param enabled - Whether the query should be enabled
 */
export const useVendorReEvaluationCriteriaDetails = (criteriaId: number | null, enabled?: boolean) => {
  return useQuery({
    queryKey: [VENDOR_RE_EVALUATION_CONSTANTS.QUERY_KEY.REEVALUATION_CRITERIA, criteriaId],
    queryFn: () => fetchVendorReEvaluationCriteriaDetails(criteriaId),
    enabled: (enabled ?? !!criteriaId) && criteriaId !== null && criteriaId > 0,
  });
};

/**
 * Hook to delete vendor re-evaluation
 */
export const useDeleteVendorReEvaluation = () => {
  const queryClient = useQueryClient();
  
  return useMutation<VendorReEvaluationResponse, Error, number>({
    mutationFn: deleteVendorReEvaluation,
    onSuccess: () => {
      // Invalidate and refetch vendor re-evaluation queries
      queryClient.invalidateQueries({ queryKey: [VENDOR_RE_EVALUATION_CONSTANTS.QUERY_KEY.REEVALUATION_LIST] });
    },
  });
};