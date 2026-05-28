/**
 * Classification : Confidential
 **/
import { apiClient } from '../../../shared/apiClient'
import { OTHER_HAZARD_API_ENDPOINTS } from '@/constants/modules/risk-management/otherHazards'
import { 
  OtherHazardUpsertPayload
} from '@/types/modules/risk-management/otherHazards'

export const getAllOtherHazards = async (projectId: number | null) => {
  const response = await apiClient.get(OTHER_HAZARD_API_ENDPOINTS.GET_ALL, {
    params: { project_id: projectId },
  })
  return response.data
}

export const getOtherHazardById = async (
  subCategoryId: number,
  projectId: number
) => {
  const url = OTHER_HAZARD_API_ENDPOINTS.GET_BY_ID(subCategoryId)
  const response = await apiClient.get(url, {
    params: { project_id: projectId },
  })
  return response.data
}

export const upsertOtherHazard = async (data: OtherHazardUpsertPayload) => {
  const response = await apiClient.post(OTHER_HAZARD_API_ENDPOINTS.UPSERT, data)
  return response.data
}

export const deleteOtherHazard = async (subCategoryId: number) => {
  const url = OTHER_HAZARD_API_ENDPOINTS.DELETE(subCategoryId)
  const response = await apiClient.delete(url)
  return response.data
}
