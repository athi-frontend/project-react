import { useQuery, useMutation, useQueryClient, UseMutationResult } from '@tanstack/react-query';
import { fetchRiskAnalysis, saveRiskAnalysis } from '@/services/modules/regulation/riskAnalysis';
import { RISK_ANALYSIS_QUERY_KEY } from '@/constants/modules/regulation/riskAnalysis';

export const useRiskAnalysis = (projectId: number, enabled: boolean = false) => {
  return useQuery({
    queryKey: [RISK_ANALYSIS_QUERY_KEY, projectId],
    queryFn: () => fetchRiskAnalysis(projectId),
    enabled: enabled && !!projectId,
  });
};

export interface RiskAnalysisPayload {
  project_id: number;
  risk_analysis: string;
}

export const useSaveRiskAnalysis = (
  projectId: number
): UseMutationResult<any, Error, RiskAnalysisPayload> => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: saveRiskAnalysis,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [RISK_ANALYSIS_QUERY_KEY, projectId]
      })
    },
  })
}