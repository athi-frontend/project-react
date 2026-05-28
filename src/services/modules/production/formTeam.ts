import { API_ENDPOINTS } from '@/constants/modules/production/formTeam'
import { apiClient } from '@/shared/apiClient'
import { FormTeamPostPayload } from '@/types/modules/production/formTeam'

/**
 * Classification: Confidential
 */

export const postFormTeam = async (payload: FormTeamPostPayload) => {
  const response = await apiClient.post(API_ENDPOINTS.POST_FORM_TEAM, payload)
  return response.data
}

export const getFormTeamByProject = async (projectId: number) => {
  const response = await apiClient.get(API_ENDPOINTS.GET_FORM_TEAM_BY_PROJECT(projectId))
  return response.data
}

