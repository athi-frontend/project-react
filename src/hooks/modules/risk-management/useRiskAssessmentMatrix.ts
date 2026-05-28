import {
  getRiskMatrix,
  postRiskMatrix,
} from '@/services/modules/risk-management/riskAssessmentMatrix'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { RISK_MANAGEMENT_QUERY_KEYS } from '@/constants/queryKeys'
import { RiskAssessmentMatrixPayload } from '@/types/modules/risk-management/riskAssessmentMatrix'
import { showActionAlert } from '@/components/ui'
import { STATUS } from '@/constants/common'

/**
 * Classification: Confidential
 */

// Hook for fetching risk assessment matrix data
export const useGetRiskMatrix = (project_id: number) => {
  return useQuery({
    queryKey: [
      RISK_MANAGEMENT_QUERY_KEYS.RISK_ASSESSMENT_MATRIX.LIST,
      project_id,
    ],
    queryFn: () => getRiskMatrix(project_id),
    enabled: !!project_id,
  })
}

// Hook for upserting risk assessment matrix data
export const usePostRiskMatrix = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: [RISK_MANAGEMENT_QUERY_KEYS.RISK_ASSESSMENT_MATRIX.POST],
    mutationFn: (payload: RiskAssessmentMatrixPayload) =>
      postRiskMatrix(payload),
    onSuccess: (_, variables) => {
      // Invalidate and refetch the risk matrix data for the specific project
      queryClient.invalidateQueries({
        queryKey: [
          RISK_MANAGEMENT_QUERY_KEYS.RISK_ASSESSMENT_MATRIX.LIST,
          variables.project_id,
        ],
      })
      // Invalidate before mitigation matrix data when risk assessment matrix is updated
      queryClient.invalidateQueries({
        queryKey: [
          RISK_MANAGEMENT_QUERY_KEYS.MITIGATION_MATRIX.BEFORE_MITIGATION,
          variables.project_id,
        ],
      })
      // Invalidate after mitigation matrix data when risk assessment matrix is updated
      queryClient.invalidateQueries({
        queryKey: [
          RISK_MANAGEMENT_QUERY_KEYS.MITIGATION_MATRIX.AFTER_MITIGATION,
          variables.project_id,
        ],
      })
      showActionAlert(STATUS.SUCCESS)
    },
    onError: () => {
      showActionAlert(STATUS.FAILED)
    },
  })
}
