import { apiClient } from '@/shared/apiClient'
import { API_ENDPOINTS_TM } from '@/constants/modules/task-management/taskManagement'
import {
  ProjectTypeModuleResponse,
  TaskTransitionResponse,
  TaskTransitionRequestPayload,
} from '@/types/modules/task-management/taskManagement'

export const getProjectTypeModuleAll = async () => {
  const response = await apiClient.get<ProjectTypeModuleResponse>(
    API_ENDPOINTS_TM.GET_PROJECT_TYPE_MODULE_ALL
  )
  return response.data
}

export const getTaskTransitionTasksAll = async (payload: TaskTransitionRequestPayload) => {
  const response = await apiClient.post<TaskTransitionResponse>(
    API_ENDPOINTS_TM.GET_TASK_TRANSITION_TASKS_ALL,
    payload
  )
  return response.data
}


