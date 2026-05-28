import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  saveTeam,
  fetchTeams,
  deleteTeam,
  updateTeam,
  fetchTeamById
} from '@/services/modules/dnd/formTeam'
import {
  getRoles,
  getUsers,
  getEmployeesByRole,
  getResponsibilities,
  getStages,
} from '@/services/common'
import { UpdateTeamData } from '@/types/modules/dnd/formTeam'
import { QUERY_KEYS } from '@/constants/modules/dnd/formTeam'

export const useRoles = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.ROLES],
    queryFn: getRoles,
  })
}

export const useUsers = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.USERS],
    queryFn: getUsers,
  })
}

export const useEmployeesByRole = (roleId: number | null) => {
  return useQuery({
    queryKey: [QUERY_KEYS.USERS, 'by-role', roleId],
    queryFn: () => getEmployeesByRole(roleId),
    enabled: !!roleId,
  })
}

export const useResponsibilities = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.RESPONSIBILITIES],
    queryFn: getResponsibilities,
  })
}

export const useStages = (projectId: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.STAGES, projectId],
    queryFn: getStages,
  })
}

export const useSaveTeam = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: saveTeam,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TEAMS] }),
  })
}

export const useTeams = (projectId: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.TEAMS, projectId],
    queryFn: fetchTeams,
  })
}

export const useDeleteTeam = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteTeam,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TEAMS] }),
  })
}

export const useUpdateTeam = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (updatedData: UpdateTeamData) => updateTeam(updatedData),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TEAMS] }),
  })
}

export const useTeamsById = (teamId: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.TEAMS, teamId],
    queryFn: () => fetchTeamById(teamId),
    enabled: false
  })
}
