import { apiClient } from '@/shared/apiClient'
import { UserInsertData, WorkflowActionData } from '@/types/modules/user/userOnBoard'
import { API_ENDPOINTS } from '@/constants/modules/user/userOnboard'

export const insertUser = async (userData: UserInsertData) => {
  const response = await apiClient.post(API_ENDPOINTS.INSERT_USER, userData)
  return response.data
}

export const getProjectUsers = async () => {
  const response = await apiClient.get(API_ENDPOINTS.FETCH_USER)
  return response.data
}

export const getUserById = async (id: string) => {
  const response = await apiClient.get(API_ENDPOINTS.GET_USER_BY_ID(id))
  return response.data
}

export const updateUser = async (id: string, userData: UserInsertData) => {
  const response = await apiClient.put(
    `${API_ENDPOINTS.UPDATE_USER}/${id}`,
    userData
  )
  return response.data
}

export const deleteUser = async (userId: string) => {
  const response = await apiClient.delete(
    `${API_ENDPOINTS.DELETE_USER}/${userId}`
  )
  return response.data
}

// User onboarding workflow action service
export const userOnboardWorkflowAction = async (data: WorkflowActionData) => {
  const response = await apiClient.put(API_ENDPOINTS.WORKFLOW_ACTION, data)
  return response.data
}

