import { apiClient } from '@/shared/apiClient'
import { HAZARD_IDENTIFICATION_USED_API_ENDPOINTS } from '@/constants/modules/risk-management/hazardIdentificationUsed'

/**
 * Classification: Confidential
 */

// GET List (by project_id & status)
export const fetchHazardIdentificationUsedList = async (
  project_id: number,
  status: number
) => {
  const res = await apiClient.get(
    `${HAZARD_IDENTIFICATION_USED_API_ENDPOINTS.HAZARD_IDENTIFCATION_USED_API_PATH}all`,
    { params: { project_id, status } }
  )
  return res.data
}

// GET by ToolMapperId
export const fetchHazardIdentificationUsed = async (tool_mapper_id: number) => {
  const response = await apiClient.get(
    `${HAZARD_IDENTIFICATION_USED_API_ENDPOINTS.HAZARD_IDENTIFCATION_USED_API_PATH}${tool_mapper_id}`
  )
  return response.data
}

// POST/Upsert
export const upsertHazardIdentificationUsed = async (payload) => {
  const response = await apiClient.post(
    HAZARD_IDENTIFICATION_USED_API_ENDPOINTS.HAZARD_IDENTIFCATION_USED_API_PATH,
    payload
  )
  return response.data
}
