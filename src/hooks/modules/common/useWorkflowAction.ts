/**
 * Classification: Confidential
 */

import { showActionAlert } from '@/components/ui'
import { STATUS } from '@/constants/common'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { workflowAction } from '@/services/modules/common-workflow'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { WorkflowActionData } from '@/types/common'

/**
 * Generic workflow action hook factory
 * @param module - Module name (e.g., 'sales', 'risk', 'hr')
 * @param method - HTTP method ('POST' or 'PUT')
 * @returns Hook function that accepts optional menuName
 */
export const createWorkflowActionHook = (module: string, method: 'POST' | 'PUT') => (menuName?: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: WorkflowActionData) => workflowAction(data, module, method),
    onSuccess: () => {
      if (menuName && QUERY_KEYS[menuName]?.FETCH_BY_ID) {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS[menuName].FETCH_BY_ID] })
      }
      if (menuName && QUERY_KEYS[menuName]?.FETCH_LIST) {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS[menuName].FETCH_LIST] })
      }
      showActionAlert(STATUS.SUCCESS)
    },
    onError: () => {
      showActionAlert(STATUS.FAILED)
    },
  })
}

 
