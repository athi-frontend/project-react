import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  fetchSampleOrderParts, 
  fetchSampleInspection,
  postSampleInspection
} from "@/services/modules/vendor-management/sampleInspection";
import { 
  SAMPLE_ORDER_PARTS_HOOK, 
  SAMPLE_INSPECTION_HOOK,
  POST_SAMPLE_INSPECTION_HOOK
} from "@/constants/modules/vendor-management/sampleInspection";
import { 
  SampleOrderPartsResponse, 
  SampleInspectionResponse 
} from "@/types/modules/vendor-management/sampleInspection";

/**
    Classification : Confidential
**/

/**
 * Hook to fetch sample order parts by sample order ID
 * @param sample_order_id - The ID of the sample order
 * @param enabled - Whether the query should be enabled (default: true)
 */
export const useSampleOrderParts = (
  sample_order_id: number | null,
  enabled: boolean = true
) => {
  return useQuery<SampleOrderPartsResponse, Error>({
    queryKey: [SAMPLE_ORDER_PARTS_HOOK, sample_order_id],
    queryFn: () => fetchSampleOrderParts(sample_order_id),
    enabled: enabled && !!sample_order_id,
  });
};

/**
 * Hook to fetch sample inspection data by sample order ID and part number
 * @param sample_order_id - The ID of the sample order
 * @param part_number - Optional part number filter
 * @param enabled - Whether the query should be enabled (default: true)
 */
export const useSampleInspection = (
  sample_order_id: number | null,
  part_number?: number | null,
  enabled: boolean = true
) => {
  return useQuery<SampleInspectionResponse, Error>({
    queryKey: [SAMPLE_INSPECTION_HOOK, sample_order_id, part_number],
    queryFn: () => fetchSampleInspection(sample_order_id, part_number || undefined),
    enabled: enabled && !!sample_order_id && !!part_number,
  });
};

/**
 * Hook to create or update sample inspection
 */
export const usePostSampleInspection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [POST_SAMPLE_INSPECTION_HOOK],
    mutationFn: (formData: FormData) => postSampleInspection(formData),
    onSuccess: () => {
      // Invalidate relevant queries after successful submission
      queryClient.invalidateQueries({ queryKey: [SAMPLE_INSPECTION_HOOK] });
    },
  });
};

