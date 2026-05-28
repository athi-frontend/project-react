import { showActionAlert } from '@/components/ui'
import { STATUS } from '@/constants/common'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { workflowAction } from '@/services/modules/hr/workFlow'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { WorkflowActionData } from '@/types/common'

const createWorkflowActionHook = (method: 'POST' | 'PUT') => (menuName?: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: WorkflowActionData) => workflowAction(data, method),
    onSuccess: () => {
      if (menuName && QUERY_KEYS[menuName]?.FETCH_BY_ID) {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS[menuName].FETCH_BY_ID] })
      }
      if (menuName && QUERY_KEYS[menuName]?.FETCH_LIST) {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS[menuName].FETCH_LIST] })
      }
      showActionAlert(STATUS.SUCCESS)
    },
    onError:() => {
      showActionAlert(STATUS.FAILED)
    },
  })
}
export const useSaveWorkflowAction = createWorkflowActionHook('POST')
export const useSubmitWorkflowAction = createWorkflowActionHook('PUT')
