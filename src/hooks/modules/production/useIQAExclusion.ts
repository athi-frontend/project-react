/**
 * Classification: Confidential
 * IQA Exclusion Hooks
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  upsertIQAExclusion,
  fetchIQAExclusionList,
  IQAExclusionPayload,
  IQAExclusionResponse,
} from '@/services/modules/production/commonProductionService'
import { QUERY_KEYS } from '@/constants/modules/production/common'
import { showActionAlert } from '@/components/ui'
import { STATUS, NUMBERMAP } from '@/constants/common'

/**
 * Hook to fetch IQA exclusion list by assembly part item detail ID
 * @param assemblyPartItemDetailId - Assembly part item detail ID
 * @param enabled - Whether the query should be enabled (default: true)
 * @returns React Query hook for IQA exclusion list
 */
export const useIQAExclusionList = (
  assemblyPartItemDetailId: number,
  enabled: boolean = true
) => {
  return useQuery<IQAExclusionResponse, Error>({
    queryKey: [QUERY_KEYS.IQA_EXCLUSION_LIST, assemblyPartItemDetailId],
    queryFn: () => fetchIQAExclusionList(assemblyPartItemDetailId),
    enabled: enabled && !!assemblyPartItemDetailId,
    staleTime: NUMBERMAP.ZERO,
    gcTime: NUMBERMAP.ZERO,
    placeholderData: undefined,
    refetchOnWindowFocus: false,
    refetchOnMount: 'always',
  })
}

/**
 * Hook to upsert IQA exclusion
 * @returns React Query mutation hook for upserting IQA exclusion
 */
export const useUpsertIQAExclusion = () => {
  const queryClient = useQueryClient()

  return useMutation<any, Error, IQAExclusionPayload>({
    mutationKey: [QUERY_KEYS.IQA_EXCLUSION_UPSERT],
    mutationFn: upsertIQAExclusion,
    onSuccess: (_, variables) => {
      // Invalidate the list query to refetch data
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.IQA_EXCLUSION_LIST, variables.applicable_settings_id],
      })
      showActionAlert(STATUS.SUCCESS)
    },
    onError: () => {
      showActionAlert(STATUS.FAILED)
    },
  })
}

