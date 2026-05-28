import { FETCH_ALL_SKILL, FETCH_SKILL_ID } from '@/constants/modules/hr/skill'
import { apiClient } from '@/shared/apiClient'
import {
  FetchAllSkillsResponse,
  FetchSkillByIdResponse,
  Skillresponse,
} from '@/types/modules/hr/skill'

export const fetchAllSkills = async (): Promise<Skillresponse> => {
  const response = await apiClient.get<FetchAllSkillsResponse>(FETCH_ALL_SKILL)
  return response.data
}

export const fetchSkillById = async (skillId: number): Promise<Skillresponse> => {
  const response = await apiClient.get<FetchSkillByIdResponse>(
    `${FETCH_SKILL_ID}${skillId}`
  )
  return response.data
}
