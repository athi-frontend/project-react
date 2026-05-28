/**
 * Classification: Confidential
 * Inventory Detail Hooks
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  upsertInventoryDetail,
  fetchInventoryDetailList,
  InventoryDetailPayload,
  InventoryDetailResponse,
} from '@/services/modules/production/commonProductionService'
import { QUERY_KEYS } from '@/constants/modules/production/common'
import { showActionAlert } from '@/components/ui'
import { STATUS, NUMBERMAP } from '@/constants/common'

/**
 * Hook to fetch inventory detail list by assembly part item ID
 * @param assemblyPartItemId - Assembly part item ID
 * @param enabled - Whether the query should be enabled (default: true)
 * @returns React Query hook for inventory detail list
 */
export const useInventoryDetailList = (
  assemblyPartItemId: number,
  enabled: boolean = true
) => {
  return useQuery<InventoryDetailResponse, Error>({
    queryKey: [QUERY_KEYS.INVENTORY_DETAIL_LIST, assemblyPartItemId],
    queryFn: () => fetchInventoryDetailList(assemblyPartItemId),
    enabled: enabled && !!assemblyPartItemId,
    staleTime: NUMBERMAP.ZERO,
    gcTime: NUMBERMAP.ZERO,
    placeholderData: undefined,
    refetchOnWindowFocus: false,
    refetchOnMount: 'always',
  })
}

/**
 * Hook to upsert inventory detail
 * @returns React Query mutation hook for upserting inventory detail
 */
export const useUpsertInventoryDetail = () => {
  const queryClient = useQueryClient()

  return useMutation<any, Error, InventoryDetailPayload>({
    mutationKey: [QUERY_KEYS.INVENTORY_DETAIL_UPSERT],
    mutationFn: upsertInventoryDetail,
    onSuccess: (_, variables) => {
      // Invalidate the list query to refetch data
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.INVENTORY_DETAIL_LIST, variables.assembly_part_item_id],
      })
      showActionAlert(STATUS.SUCCESS)
    },
    onError: () => {
      showActionAlert(STATUS.FAILED)
    },
  })
}

