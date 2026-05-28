import { POSTSCOPE, GETSCOPE } from '@/constants/modules/risk-management/scope'
import {
  getScopeById,
  postScope,
  getRiskStages,
} from '@/services/modules/risk-management/scope'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { RISK_MANAGEMENT_QUERY_KEYS } from '@/constants/queryKeys'
/**
 * Classification: Confidential
 */
export const usePostScope = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: [POSTSCOPE],
    mutationFn: postScope,
    onSuccess: (data: any, variables: any) => {
      // Invalidate scope queries for the specific project
      const projectId = variables?.project_id ?? data?.project_id ?? data?.data?.project_id
      if (projectId) {
        queryClient.invalidateQueries({ queryKey: [GETSCOPE, projectId] })
      } else {
        // Fallback: invalidate all scope queries if project_id is not available
        queryClient.invalidateQueries({ queryKey: [GETSCOPE] })
      }
      // Invalidate risk review requirement queries after scope is saved
      queryClient.invalidateQueries({ 
        queryKey: [RISK_MANAGEMENT_QUERY_KEYS.RISK_REVIEW_REQUIREMENT.LIST] 
      })
      // Invalidate stages queries after scope is saved
      queryClient.invalidateQueries({ 
        queryKey: [RISK_MANAGEMENT_QUERY_KEYS.APPLICABILITY_STAGES.LIST] 
      })
      // Invalidate Risk Team Fetch ALL
      queryClient.invalidateQueries({ 
        queryKey: [RISK_MANAGEMENT_QUERY_KEYS.RISK_TEAM.LIST] 
      })
      // Invalidate Risk Review Fetch ALL after scope is saved
      queryClient.invalidateQueries({ 
        queryKey: [RISK_MANAGEMENT_QUERY_KEYS.RISK_REVIEW.FETCH_ALL] 
      })
    },
  })
}

export const useGetScopeById = (project_id: number) => {
  return useQuery({
    queryKey: [GETSCOPE, project_id],
    queryFn: () => getScopeById(project_id),
    enabled: !!project_id,
    refetchOnMount: 'always', // Always refetch when navigating to the screen
  })
}

export const useGetRiskStages = (status?: number) => {
  return useQuery({
    queryKey: ['riskStages'],
    queryFn: () => getRiskStages(status),
  })
}
