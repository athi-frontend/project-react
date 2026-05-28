import { API_URLS } from '@/constants/modules/dnd/formTeam'
import { apiClient } from '@/shared/apiClient'
import {
  TeamData,
  FetchTeamsParams,
  UpdateTeamData,
} from '@/types/modules/dnd/formTeam'
import {
  prepareSaveTeamPayload,
  prepareUpdateTeamPayload,
} from '@/lib/modules/dnd/formTeam'
export const saveTeam = async (teamData: TeamData) => {
  const payload = prepareSaveTeamPayload(teamData)
  const response = await apiClient.post(API_URLS.TEAM.CREATE, payload)
  return response.data
}

export const fetchTeams = async ({ queryKey }: FetchTeamsParams) => {
  const [, projectId] = queryKey
  const response = await apiClient.get(
    `${API_URLS.TEAM.FETCH}?project_id=${Number(projectId)}&status=1`,
    {}
  )
  return response.data
}

export const deleteTeam = async (teamId: number | string) => {
  const response = await apiClient.delete(`${API_URLS.TEAM.DELETE}/${teamId}`)
  return response.data
}

export const updateTeam = async (updatedData: UpdateTeamData) => {
  const { design_team_id } = updatedData
  const payload = prepareUpdateTeamPayload(updatedData)
  const response = await apiClient.put(
    `${API_URLS.TEAM.UPDATE}/${design_team_id}`,
    payload
  )
  return response.data
}

export const fetchTeamById = async (teamId: number) => {
  const response = await apiClient.get(`${API_URLS.TEAM.BASE}/${teamId}`)
  return response.data
}
