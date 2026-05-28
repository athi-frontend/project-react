import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  fetchAllVendorEvaluations, 
  fetchVendorEvaluationById, 
  upsertVendorEvaluation,
  deleteVendorEvaluation
} from "@/services/modules/vendor-management/vendorEvaluation";
import { 
  VENDOR_EVALUATION_HOOK, 
  VENDOR_EVALUATION_BY_ID_HOOK
} from "@/constants/modules/vendor-management/vendorEvaluation";
import { 
  VendorEvaluationRequest, 
  VendorEvaluationResponse, 
  VendorEvaluationListApiResponse
} from "@/types/modules/vendor-management/vendorEvaluation";
import { NUMBERMAP } from "@/constants/common";

/**
 * Classification : Confidential
**/

export const useAllVendorEvaluations = (status?: number, enabled: boolean = true) => {
  return useQuery<VendorEvaluationListApiResponse, Error>({
    queryKey: [VENDOR_EVALUATION_HOOK],
    queryFn: () => fetchAllVendorEvaluations(status),
    enabled,
  });
};

export const useVendorEvaluationById = (evaluationId: string, enabled?: boolean) => {
  return useQuery<VendorEvaluationResponse, Error>({
    queryKey: [VENDOR_EVALUATION_BY_ID_HOOK, evaluationId],
    queryFn: () => fetchVendorEvaluationById(evaluationId),
    enabled: enabled ?? !!evaluationId,
  });
};

/**
 * Hook to insert or update vendor evaluation
 */
export const useUpsertVendorEvaluation = () => {
  const queryClient = useQueryClient();
  
  return useMutation<VendorEvaluationResponse, Error, VendorEvaluationRequest>({
    mutationFn: upsertVendorEvaluation,
    onSuccess: (data, variables) => {
      // Invalidate and refetch vendor evaluation queries
      queryClient.invalidateQueries({ queryKey: [VENDOR_EVALUATION_HOOK] });
      queryClient.invalidateQueries({ queryKey: [VENDOR_EVALUATION_BY_ID_HOOK] });
      
      // Optionally set the new data in cache
     const firstItem = Array.isArray(data?.data) ? data?.data[NUMBERMAP.ZERO] : null;
      const vendorEvalId = firstItem?.vendor_evaluation_id;

      if (vendorEvalId) {
        queryClient.setQueryData(
          [VENDOR_EVALUATION_BY_ID_HOOK, vendorEvalId.toString()],
          data
        );
      }


    },
  });
};

export const useDeleteVendorEvaluation = () => {
  const queryClient = useQueryClient();
  
  return useMutation<VendorEvaluationResponse, Error, number>({
    mutationFn: deleteVendorEvaluation,
    onSuccess: () => {
      // Invalidate and refetch vendor evaluation queries
      queryClient.invalidateQueries({ queryKey: [VENDOR_EVALUATION_HOOK] });
      queryClient.invalidateQueries({ queryKey: [VENDOR_EVALUATION_BY_ID_HOOK] });
    },
  });
};
