import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  saveTeam,
  fetchTeams,
  deleteTeam,
  updateTeam,
} from '@/services/modules/dnd/teamService'
import { getRoles, getUsers } from '@/services/common'
import { UpdateTeamData } from '@/types/modules/dnd/formTeam'

export const useRoles = () => {
  return useQuery({
    queryKey: ['roles'],
    queryFn: getRoles,
  })
}

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  })
}

export const useSaveTeam = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: saveTeam,
    onSuccess: (data) => queryClient.invalidateQueries({ queryKey: ['teams'] }),
  })
}

export const useTeams = (projectId: number) => {
  return useQuery({
    queryKey: ['teams', projectId],
    queryFn: fetchTeams,
  })
}

export const useDeleteTeam = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteTeam,
    onSuccess: () => queryClient.invalidateQueries(['teams']),
  })
}

export const useUpdateTeam = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (updatedData: UpdateTeamData) => updateTeam(updatedData),
    onSuccess: () => queryClient.invalidateQueries(['teams']),
  })
}
