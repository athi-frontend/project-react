import { apiClient } from '@/shared/apiClient'
import {
  INTENDED_USE_URL,
  MODEL_URL,
  USE_ENVIRONMENT_URL,
} from '@/constants/modules/dnd/intendedUse'
export const useSaveService = async (data: any) => {
  const response = await apiClient.post(INTENDED_USE_URL, data)
  return response.data
}

export const fetchIntendedUse = async (projectId: number) => {
  const response = await apiClient.get(`${INTENDED_USE_URL}${projectId}`)
  const data = response.data
  return data
}

export const fetchModels = async (projectId: number) => {
  const response = await apiClient.get(MODEL_URL, {
    params: { status: 1, project_id: projectId },
  })
  const data = response.data
  return data
}

export const fetchUseEnvironments = async () => {
  const response = await apiClient.get(USE_ENVIRONMENT_URL)
  const data = response.data
  return data
}
