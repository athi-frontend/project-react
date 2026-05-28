import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { postFormTeam, getFormTeamByProject } from '@/services/modules/production/formTeam'
import { QUERY_KEYS } from '@/constants/modules/production/formTeam'
import { NUMBERMAP } from '@/constants/common'
/**
 * Classification: Confidential
 */

export const usePostFormTeam = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [QUERY_KEYS.POST_FORM_TEAM],
    mutationFn: postFormTeam,
    onSuccess: (_, variables) => {
      // Invalidate the GET query for the project
      queryClient.invalidateQueries({ 
        queryKey: [QUERY_KEYS.GET_FORM_TEAM_BY_PROJECT, variables.project_id] 
      })
    },
  })
}

export const useGetFormTeamByProject = (projectId: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_FORM_TEAM_BY_PROJECT, projectId],
    queryFn: () => getFormTeamByProject(projectId),
    enabled: !!projectId && projectId > NUMBERMAP.ZERO,
  })
}

