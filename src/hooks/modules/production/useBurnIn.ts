/**
 * Classification: Confidential
 * Burn In Hooks
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchBurnInByProjectId,
  createOrUpdateBurnIn,
  fetchProductFeatures,
} from '@/services/modules/production/burnIn'
import { BURN_IN_QUERY_KEYS } from '@/constants/modules/production/burnIn'
import {
  BurnInApiResponse,
  BurnInPayload,
  ProductFeatureApiResponse,
} from '@/types/modules/production/burnIn'
import { InputFieldCommonType } from '@/types/common'

/**
 * Hook to fetch burn-in data by project ID
 */
export const useBurnInByProjectId = (
  project_id: InputFieldCommonType,
  product_variants_id?: number | string
) => {
  return useQuery<BurnInApiResponse, Error>({
    queryKey: [BURN_IN_QUERY_KEYS.FETCH_BURN_IN, project_id, product_variants_id],
    queryFn: () => fetchBurnInByProjectId(project_id, product_variants_id),
    enabled: !!project_id,
  })
}

/**
 * Hook to create or update burn-in record
 */
export const useCreateOrUpdateBurnIn = () => {
  const queryClient = useQueryClient()
  
  return useMutation<BurnInApiResponse, Error, BurnInPayload>({
    mutationFn: (payload) => createOrUpdateBurnIn(payload),
    onSuccess: (_, variables) => {
      // Invalidate and refetch burn-in data for the project
      queryClient.invalidateQueries({
        queryKey: [BURN_IN_QUERY_KEYS.FETCH_BURN_IN, variables.project_id],
      })
    },
  })
}

/**
 * Hook to fetch product features by project ID and model ID
 */
export const useProductFeatures = (
  project_id: string | number | undefined,
  model_id: string | number | undefined,
  enabled: boolean = false
) => {
  return useQuery<ProductFeatureApiResponse, Error>({
    queryKey: [BURN_IN_QUERY_KEYS.FETCH_PRODUCT_FEATURES, project_id, model_id],
    queryFn: () => fetchProductFeatures(project_id, model_id),
    enabled: enabled && !!project_id && !!model_id,
  })
}

