import { useQuery } from '@tanstack/react-query'
import {
  getProjectTypeModuleAll,
  getTaskTransitionTasksAll,
} from '@/services/modules/task-mangement/taskManagement'
import { getCombinedTaskData } from '@/utils/task-management/taskManagementUtils'
import { TM_QUERY_KEYS } from '@/constants/modules/task-management/taskManagement'
import { TaskTransitionRequestPayload } from '@/types/modules/task-management/taskManagement'

export const useProjectTypeModuleAll = () => {
  return useQuery({
    queryKey: [TM_QUERY_KEYS.PROJECT_TYPE_MODULE],
    queryFn: () => getProjectTypeModuleAll(),
    enabled: true,
  })
}

export const useTaskTransitionTasksAll = (payload: TaskTransitionRequestPayload) => {
  return useQuery({
    queryKey: [TM_QUERY_KEYS.TASK_TRANSITION, payload],
    queryFn: () => getTaskTransitionTasksAll(payload),
    enabled: !!payload.project_type_id.length && !!payload.user_id,
  })
}

export const useCombinedTaskData = (payload: TaskTransitionRequestPayload) => {
  return useQuery({
    queryKey: [TM_QUERY_KEYS.COMBINED_TASK_DATA, payload],
    queryFn: () => getCombinedTaskData(payload),
    enabled: !!payload.project_type_id.length && !!payload.user_id,
    refetchOnWindowFocus: false,
  })
}
