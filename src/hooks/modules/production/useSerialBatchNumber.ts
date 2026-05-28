/**
 * Classification: Confidential
 * Serial Batch Number Hooks
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  upsertSerialBatchNumber,
  fetchSerialBatchNumberList,
  SerialBatchNumberPayload,
  SerialBatchNumberResponse,
} from '@/services/modules/production/commonProductionService'
import { QUERY_KEYS } from '@/constants/modules/production/common'
import { showActionAlert } from '@/components/ui'
import { STATUS } from '@/constants/common'

/**
 * Hook to fetch serial batch number list by part assembly detail ID
 * @param partAssemblyDetailId - Part assembly detail ID
 * @param enabled - Whether the query should be enabled (default: true)
 * @returns React Query hook for serial batch number list
 */
export const useSerialBatchNumberList = (
  partAssemblyDetailId: number,
  enabled: boolean = true
) => {
  return useQuery<SerialBatchNumberResponse, Error>({
    queryKey: [QUERY_KEYS.SERIAL_BATCH_LIST],
    queryFn: () => fetchSerialBatchNumberList(partAssemblyDetailId),
    enabled: enabled && !!partAssemblyDetailId,
  })
}

/**
 * Hook to upsert serial batch number
 * @returns React Query mutation hook for upserting serial batch number
 */
export const useUpsertSerialBatchNumber = () => {
  const queryClient = useQueryClient()

  return useMutation<any, Error, SerialBatchNumberPayload>({
    mutationKey: [QUERY_KEYS.SERIAL_BATCH_UPSERT],
    mutationFn: upsertSerialBatchNumber,
    onSuccess: (_, variables) => {
      // Invalidate the list query to refetch data
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.SERIAL_BATCH_LIST],
      })
      showActionAlert(STATUS.SUCCESS)
    },
    onError: () => {
      showActionAlert(STATUS.FAILED)
    },
  })
}

