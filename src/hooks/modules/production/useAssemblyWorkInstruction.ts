/**
 * Classification: Confidential
 * Assembly Work Instruction Hooks
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  upsertAssemblyWorkInstruction,
  fetchAssemblyWorkInstructionById,
  AssemblyWorkInstructionResponse,
} from '@/services/modules/production/commonProductionService'
import { QUERY_KEYS } from '@/constants/modules/production/common'
import { showActionAlert } from '@/components/ui'

/**
 * Hook to fetch assembly work instruction by assembly part item detail ID
 * @param assemblyPartItemDetailId - Assembly part item detail ID
 * @param enabled - Whether the query should be enabled (default: true)
 * @returns React Query hook for assembly work instruction
 */
export const useAssemblyWorkInstructionById = (
  assemblyPartItemDetailId: number,
  enabled: boolean = true
) => {
  return useQuery<AssemblyWorkInstructionResponse, Error>({
    queryKey: [QUERY_KEYS.ASSEMBLY_WORK_INSTRUCTION_FETCH_BY_ID, assemblyPartItemDetailId],
    queryFn: () => fetchAssemblyWorkInstructionById(assemblyPartItemDetailId),
    enabled: enabled && !!assemblyPartItemDetailId,
  })
}

/**
 * Hook to upsert assembly work instruction
 * @returns React Query mutation hook for upserting assembly work instruction
 */
export const useUpsertAssemblyWorkInstruction = () => {
  const queryClient = useQueryClient()

  return useMutation<any, Error, FormData>({
    mutationKey: [QUERY_KEYS.ASSEMBLY_WORK_INSTRUCTION_UPSERT],
    mutationFn: upsertAssemblyWorkInstruction,
    onSuccess: (data, variables) => {
      showActionAlert("success")
      // Invalidate the query to refetch data
      const formData = variables
      const assemblyPartItemDetailId = formData.get('applicable_settings_id')
      if (assemblyPartItemDetailId) {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.ASSEMBLY_WORK_INSTRUCTION_FETCH_BY_ID, Number(assemblyPartItemDetailId)],
        })
      }
    },
    onError: (error: Error) => {
        showActionAlert("failed")
    },
  })
}

