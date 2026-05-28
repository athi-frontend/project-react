/**
 * Classification: Confidential
 * Storage Environment Hooks
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  upsertStorageEnvironment,
  fetchStorageEnvironmentList,
  StorageEnvironmentPayload,
  StorageEnvironmentResponse,
} from '@/services/modules/production/commonProductionService'
import { QUERY_KEYS } from '@/constants/modules/production/common'
import { showActionAlert } from '@/components/ui'
import { STATUS, NUMBERMAP } from '@/constants/common'

/**
 * Hook to fetch storage environment list by assembly part item detail ID
 * @param assemblyPartItemDetailId - Assembly part item detail ID
 * @param enabled - Whether the query should be enabled (default: true)
 * @returns React Query hook for storage environment list
 */
export const useStorageEnvironmentList = (
  assemblyPartItemDetailId: number,
  enabled: boolean = true
) => {
  return useQuery<StorageEnvironmentResponse, Error>({
    queryKey: [QUERY_KEYS.STORAGE_ENVIRONMENT_LIST, assemblyPartItemDetailId],
    queryFn: () => fetchStorageEnvironmentList(assemblyPartItemDetailId),
    enabled: enabled && !!assemblyPartItemDetailId,
    staleTime: NUMBERMAP.ZERO,
    gcTime: NUMBERMAP.ZERO,
    placeholderData: undefined,
    refetchOnWindowFocus: false,
    refetchOnMount: 'always',
  })
}

/**
 * Hook to upsert storage environment details
 * @returns React Query mutation hook for upserting storage environment
 */
export const useUpsertStorageEnvironment = () => {
  const queryClient = useQueryClient()

  return useMutation<any, Error, StorageEnvironmentPayload>({
    mutationKey: [QUERY_KEYS.STORAGE_ENVIRONMENT_UPSERT],
    mutationFn: upsertStorageEnvironment,
    onSuccess: (_, variables) => {
      // Invalidate the list query to refetch data
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.STORAGE_ENVIRONMENT_LIST, variables.applicable_settings_id],
      })
      showActionAlert(STATUS.SUCCESS)
    },
    onError: () => {
      showActionAlert(STATUS.FAILED)
    },
  })
}

