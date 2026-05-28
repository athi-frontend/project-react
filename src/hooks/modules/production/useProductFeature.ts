import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchProductFeatures, fetchProductFeatureById, upsertProductFeature, ProductFeatureUpsertPayload, ProductFeatureListResponse } from '@/services/modules/production/finalOQC';
import { NUMBERMAP } from '@/constants/common';
/**
 * Get Product Features by project_id (for Test Protocol table)
 */
/**
    Classification : Confidential
**/
export const useGetProductFeatures = (project_id: string | number, status: string | number = 1) => {
  return useQuery<ProductFeatureListResponse, Error>({
    queryKey: ['productFeatures', project_id, status],
    queryFn: () => fetchProductFeatures(project_id, status),
    enabled: !!project_id,
  })
}

/**
 * Get Product Feature by ID
 */
export const useGetProductFeatureById = (productFeatureId?: number) => {
  return useQuery< Error>({
    queryKey: ['productFeature', productFeatureId],
    queryFn: () => fetchProductFeatureById(productFeatureId),
    enabled: !!productFeatureId,
    staleTime:NUMBERMAP.ZERO,
    gcTime:NUMBERMAP.ZERO,
    placeholderData: undefined,
    refetchOnWindowFocus: false,
  });
};

/**
 * Upsert Product Feature (create/update)
 */
export const useUpsertProductFeature = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, ProductFeatureUpsertPayload>({
    mutationFn: upsertProductFeature,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productFeatures'] })
    },
  });
};
