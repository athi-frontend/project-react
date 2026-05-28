/**
 * Classification: Confidential
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getProductTraceabilityCardByProject,
  upsertProductTraceabilityCard,
} from '@/services/modules/production/productTraceabilityCard'
import { PRODUCT_TRACEABILITY_CARD_QUERY_KEYS } from '@/constants/modules/production/productTraceabilityCard'
import { showActionAlert } from '@/components/ui'
import { STATUS } from '@/constants/common'

/**
 * Hook to fetch product traceability card by project ID
 */
export const useProductTraceabilityCardByProject = (
  project_id: number,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: PRODUCT_TRACEABILITY_CARD_QUERY_KEYS.FETCH_BY_PROJECT(project_id),
    queryFn: () => getProductTraceabilityCardByProject(project_id),
    enabled: enabled && !!project_id,
    refetchOnMount: 'always',
  })
}

/**
 * Hook to upsert (create/update) product traceability card
 */
export const useUpsertProductTraceabilityCard = (project_id: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: upsertProductTraceabilityCard,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: PRODUCT_TRACEABILITY_CARD_QUERY_KEYS.FETCH_BY_PROJECT(project_id),
      })
      showActionAlert(STATUS.SUCCESS)
    },
    onError: () => {
      showActionAlert(STATUS.FAILED)
    },
  })
}

