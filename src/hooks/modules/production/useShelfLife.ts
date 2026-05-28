/**
 * Classification: Confidential
 * Shelf Life Hooks
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  upsertShelfLife,
  fetchShelfLifeList,
  fetchAllNonConformedLocations,
  ShelfLifePayload,
  ShelfLifeResponse,
  NonConformedLocationResponse,
} from '@/services/modules/production/commonProductionService'
import { QUERY_KEYS } from '@/constants/modules/production/common'
import { showActionAlert } from '@/components/ui'
import { NUMBERMAP,STATUS } from '@/constants/common'

/**
 * Hook to fetch shelf life list by assembly part item detail ID
 * @param assemblyPartItemDetailId - Assembly part item detail ID
 * @param enabled - Whether the query should be enabled (default: true)
 * @returns React Query hook for shelf life list
 */
export const useShelfLifeList = (
  assemblyPartItemDetailId: number,
  enabled: boolean = true
) => {
  return useQuery<ShelfLifeResponse, Error>({
    queryKey: [QUERY_KEYS.SHELF_LIFE_LIST, assemblyPartItemDetailId],
    queryFn: () => fetchShelfLifeList(assemblyPartItemDetailId),
    enabled: enabled && !!assemblyPartItemDetailId,
    staleTime: NUMBERMAP.ZERO,
    gcTime: NUMBERMAP.ZERO,
    placeholderData: undefined,
    refetchOnWindowFocus: false,
    refetchOnMount: 'always',
  })
}

/**
 * Hook to fetch all non-conformed locations
 * @param status - Optional status filter (1 for active)
 * @param enabled - Whether the query should be enabled (default: true)
 * @returns React Query hook for non-conformed locations
 */
export const useAllNonConformedLocations = (
  status: number = NUMBERMAP.ONE,
  enabled: boolean = true
) => {
  return useQuery<NonConformedLocationResponse, Error>({
    queryKey: [QUERY_KEYS.NON_CONFORMED_LOCATION_ALL, status],
    queryFn: () => fetchAllNonConformedLocations(status),
    enabled,
  })
}

/**
 * Hook to upsert shelf life
 * @returns React Query mutation hook for upserting shelf life
 */
export const useUpsertShelfLife = () => {
  const queryClient = useQueryClient()

  return useMutation<any, Error, ShelfLifePayload>({
    mutationKey: [QUERY_KEYS.SHELF_LIFE_UPSERT],
    mutationFn: upsertShelfLife,
    onSuccess: (_, variables) => {
      // Invalidate the list query to refetch data
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.SHELF_LIFE_LIST, variables.applicable_settings_id],
      })
      showActionAlert(STATUS.SUCCESS)
    },
    onError: () => {
      showActionAlert(STATUS.FAILED)
    },
  })
}

