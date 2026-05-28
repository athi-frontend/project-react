/**
 * Individual Risk Analysis Hooks
 * Classification: Confidential
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchAllIndividualRiskAnalysis,
  fetchIndividualRiskAnalysisById,
  upsertIndividualRiskAnalysis,
} from '@/services/modules/risk-management/individualResidualRiskAnalysis'
import { RISK_MANAGEMENT_QUERY_KEYS } from '@/constants/queryKeys'
import { showActionAlert } from '@/components/ui'
import { COMMON_CONSTANTS } from '@/lib/utils/common'

export const useFetchAllIndividualRiskAnalysis = (project_id: number, status: number) =>
  useQuery({
    queryKey: [
      RISK_MANAGEMENT_QUERY_KEYS.INDIVIDUAL_RISK_ANALYSIS.LIST,
    ],
    queryFn: () => fetchAllIndividualRiskAnalysis(project_id, status),
    enabled: !!project_id && !!status,
  })

export const useFetchIndividualRiskAnalysisById = (risk_id: number) =>
  useQuery({
    queryKey: [
      RISK_MANAGEMENT_QUERY_KEYS.INDIVIDUAL_RISK_ANALYSIS.FETCH_BY_ID,
      risk_id,
    ],
    queryFn: () => fetchIndividualRiskAnalysisById(risk_id),
    enabled: !!risk_id,
    refetchOnWindowFocus: false,
  })

export const useUpsertIndividualRiskAnalysis = (risk_id: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: upsertIndividualRiskAnalysis,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          RISK_MANAGEMENT_QUERY_KEYS.INDIVIDUAL_RISK_ANALYSIS.FETCH_BY_ID,
          risk_id,
        ],
      })
      showActionAlert(COMMON_CONSTANTS.SUCCESS_ALERT)
    },
    onError: () => {
      showActionAlert(COMMON_CONSTANTS.FAILED_ALERT)
    },
  })
}
