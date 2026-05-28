import { showActionAlert } from '@/components/ui'
import { STATUS } from '@/constants/common'
import { riskManagementWorkflowAction } from '@/services/modules/risk-management/workFlow'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { WorkflowActionData } from '@/types/common'

/**
 * Classification: Confidential
 */
const createRiskManagementWorkflowActionHook =
  (method: 'POST' | 'PUT') => (queryKey?: string | string[]) => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: (data: WorkflowActionData) =>
        riskManagementWorkflowAction(data, method),
      onSuccess: () => {
        if (queryKey) {
          const queryKeys = Array.isArray(queryKey) ? queryKey : [queryKey]
          queryKeys.forEach((key) => {
            queryClient.invalidateQueries({ queryKey: [key] })
          })
        }
        showActionAlert(STATUS.SUCCESS)
      },
      onError: () => {
        showActionAlert(STATUS.FAILED)
      },
    })
  }
export const useSaveRiskManagementWorkflowAction =
  createRiskManagementWorkflowActionHook('POST')
export const useSubmitRiskManagementWorkflowAction =
  createRiskManagementWorkflowActionHook('PUT')
