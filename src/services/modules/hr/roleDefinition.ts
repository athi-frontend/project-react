import { apiClient } from '@/shared/apiClient'
import {
  API_ENDPOINTS,
  COMPETENCY_LIST,
} from '@/constants/modules/hr/roleDefinition'

const {
  COMPETENCY_LIST_API_ENDPOINTS: { FETCH_COMPETETENCY_LIST },
} = COMPETENCY_LIST

export const getCompetencySkills = async () => {
  const response = await apiClient.get(FETCH_COMPETETENCY_LIST)
  return response.data
}

export const getCompetencySkillByRoleId = async (roleId: string) => {
  const response = await apiClient.get(
    `${COMPETENCY_LIST.COMPETENCY_LIST_API_ENDPOINTS.FETCH_COMPETENCY_SKILL_BY_ROLE_ID}/${roleId}`
  )
  return response.data
}

export const getSkills = async () => {
  const response = await apiClient.get(API_ENDPOINTS.SKILL_ALL)
  return response.data
}

export const getSkillLevels = async () => {
  const response = await apiClient.get(API_ENDPOINTS.SKILL_LEVEL_ALL)
  return response.data.data ?? []
}
