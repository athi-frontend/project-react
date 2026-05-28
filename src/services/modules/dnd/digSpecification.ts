import { apiClient } from '@/shared/apiClient'
import { API_ENDPOINTS } from '@/constants/modules/dnd/digSpecificaton'

export const fetchSpecifications = async (projectId: number) => {
  const response = await apiClient.get(
    API_ENDPOINTS.FETCH_SPECIFICATIONS(projectId)
  )
  return response.data
}

export const saveSpecifications = async (payload: {
  project_id: number
  specification: { specification_id: string; is_applicable: number }[]
}) => {
  const response = await apiClient.post(
    API_ENDPOINTS.SAVE_SPECIFICATIONS,
    payload
  )
  return response.data
}

/**
 * Fetches lifetime of device specification data from the API
 * @param specificationApplicabilityId - The ID of the specification applicability
 * @author Harsithiga B
 * @created 23-08-2025
 * @classification Confidential
 */
export const fetchLifetimeOfDevice = async (specificationApplicabilityId: number) => {
  const response = await apiClient.get(
    API_ENDPOINTS.LIFETIME_OF_DEVICE(specificationApplicabilityId)
  )
  return response.data
}
