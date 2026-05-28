import { API_URLS,TEAM_FETCH_QUERY } from '@/constants/modules/dnd/formTeam'
import { apiClient } from '../../../shared/apiClient'
import {
  TeamData,
  FetchTeamsParams,
  UpdateTeamData,
} from '@/types/modules/dnd/formTeam'


export const saveTeam = async (teamData: TeamData) => {
  const response = await apiClient.post(API_URLS.TEAM.BASE, teamData)
  return response.data
}

export const fetchTeams = async ({ queryKey }: FetchTeamsParams) => {
  const [, projectId] = queryKey
  const response = await apiClient.get(
    TEAM_FETCH_QUERY(projectId)
  )
  return response.data
}

export const deleteTeam = async (teamId: number | string) => {
  const response = await apiClient.delete(`${API_URLS.TEAM.BASE}/${teamId}`)
  return response.data
}

export const updateTeam = async (updatedData: UpdateTeamData) => {
  const { design_team_id, ...rest } = updatedData
  const response = await apiClient.put(`${API_URLS.TEAM.BASE}/${design_team_id}`, rest)
  return response.data
}
