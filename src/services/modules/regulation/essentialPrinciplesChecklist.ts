import { apiClient } from '@/shared/apiClient'
import { API_ENDPOINTS } from '@/constants/modules/regulation/essentialPrinciplesChecklist'
import {
  CreateEssentialPrinciplesChecklistPayload,
  UpdateEssentialPrinciplesChecklistPayload,
} from '@/types/modules/regulation/essentialPrinciplesChecklist'

export const getEssentialPrinciplesChecklistAll = async (projectId: number) => {
  const response = await apiClient.get(API_ENDPOINTS.FETCH_ALL(projectId))
  return response.data
}

export const getEssentialPrinciplesChecklistById = async (id: number) => {
  const response = await apiClient.get(API_ENDPOINTS.FETCH_BY_ID(id))
  return response.data
}

export const createEssentialPrinciplesChecklist = async (
  payload: CreateEssentialPrinciplesChecklistPayload
) => {
  const response = await apiClient.post(API_ENDPOINTS.CREATE, payload)
  return response.data
}

export const updateEssentialPrinciplesChecklist = async (
  id: number,
  payload: UpdateEssentialPrinciplesChecklistPayload
) => {
  const response = await apiClient.put(API_ENDPOINTS.UPDATE(id), payload)
  return response.data
}

export const deleteEssentialPrinciplesChecklist = async (id: number) => {
  const response = await apiClient.delete(API_ENDPOINTS.DELETE(id))
  return response.data
} 