import {
  getAllRiskTeam,
  getRiskTeamById,
  postRiskTeam,
  deleteRiskTeam,
  getStages,
  getResponsibilities,
  getEmployeesBySkills,
} from '@/services/modules/risk-management/riskTeam'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { RISK_MANAGEMENT_QUERY_KEYS } from '@/constants/queryKeys'
import { NUMBERMAP } from '@/constants/common'

/**
 * Classification: Confidential
 */

/**
 * Function Name: useGetAllRiskTeam
 * Params: projectId
 * Description: Hook for fetching all risk team data by project ID
 * Author: Harsithiga B,
 * Created: 21-09-2025,
 * Classification: Confidential
 */
export const useGetAllRiskTeam = (projectId: number) => {
  return useQuery({
    queryKey: [RISK_MANAGEMENT_QUERY_KEYS.RISK_TEAM.LIST],
    queryFn: () => getAllRiskTeam(projectId),
  })
}

/**
 * Function Name: usePostRiskTeam
 * Params: None
 * Description: Hook for creating/updating risk team data with cache invalidation
 * Author: Harsithiga B,
 * Created: 21-09-2025,
 * Classification: Confidential
 */
export const usePostRiskTeam = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: postRiskTeam,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [RISK_MANAGEMENT_QUERY_KEYS.RISK_TEAM.LIST],
      })
    },
  })
}

/**
 * Function Name: useGetRiskTeamById
 * Params: risk_team_id
 * Description: Hook for fetching risk team data by ID
 * Author: Harsithiga B,
 * Created: 21-09-2025,
 * Classification: Confidential
 */
export const useGetRiskTeamById = (risk_team_id: number, projectId: number) => {
  return useQuery({
    queryKey: [RISK_MANAGEMENT_QUERY_KEYS.RISK_TEAM.LIST, risk_team_id],
    queryFn: () => getRiskTeamById(risk_team_id, projectId),
    enabled: !!risk_team_id,
  })
}

/**
 * Function Name: useGetStages
 * Params: project_id, status (optional)
 * Description: Hook for fetching risk applicability stages by project ID. Status is only included in query params when explicitly provided.
 * Author: Harsithiga B,
 * Created: 21-09-2025,
 * Classification: Confidential
 */
export const useGetStages = (project_id: number, status?: number) => {
  return useQuery({
    queryKey: [RISK_MANAGEMENT_QUERY_KEYS.APPLICABILITY_STAGES.LIST, project_id],
    queryFn: () => getStages(project_id, status),
    enabled: !!project_id,
  })
}

/**
 * Function Name: useGetResponsibilities
 * Params: None
 * Description: Hook for fetching all risk responsibilities
 * Author: Harsithiga B,
 * Created: 21-09-2025,
 * Classification: Confidential
 */
export const useGetResponsibilities = (stage_id?: number) => {
  return useQuery({
    queryKey: ['responsibilities', stage_id],
    queryFn: () => getResponsibilities(stage_id),
    enabled: stage_id !== undefined && stage_id !== null,
  })
}

/**
 * Function Name: useGetEmployeesBySkills
 * Params: skill_ids, status
 * Description: Hook for fetching employees by skills with status filter
 * Author: Harsithiga B,
 * Created: 21-09-2025,
 * Classification: Confidential
 */
export const useGetEmployeesBySkills = (skill_ids: number[], status: number) => {
  return useQuery({
    queryKey: ['employees', skill_ids, status],
    queryFn: () => getEmployeesBySkills(skill_ids, status),
    enabled: skill_ids.length > NUMBERMAP.ZERO,
  })
}

/**
 * Function Name: useDeleteRiskTeam
 * Params: None
 * Description: Hook for deleting risk team data with cache invalidation
 * Author: Harsithiga B,
 * Created: 21-09-2025,
 * Classification: Confidential
 */
export const useDeleteRiskTeam = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteRiskTeam,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [RISK_MANAGEMENT_QUERY_KEYS.RISK_TEAM.LIST],
      })
    },
  })
}
