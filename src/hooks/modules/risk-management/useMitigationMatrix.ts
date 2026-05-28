/**
 * Mitigation Matrix Hooks
 * Classification: Confidential
 */

import { useQuery } from '@tanstack/react-query'
import {
  getBeforeMitigationMatrix,
  getRiskDetailsById,
} from '@/services/modules/risk-management/beforeMitigationMatrix'
import {
  getAfterMitigationMatrix,
  getAfterMitigationRiskDetailsById,
} from '@/services/modules/risk-management/afterMitigationMatrix'
import { RISK_MANAGEMENT_QUERY_KEYS } from '@/constants/queryKeys'
import { MatrixCell, MATRIX_TYPES, MatrixType } from '@/types/modules/risk-management/mitigationMatrix'


/**
 * Unified hook for fetching risk details by probability and severity level IDs
 * @param projectId - The project ID to fetch data for
 * @param probabilityLevelId - The probability level ID from selected cell
 * @param severityLevelId - The severity level ID from selected cell
 * @param matrixType - The type of matrix (MatrixType)
 * @param enabled - Whether the query should be enabled
 * @returns Query result containing risk details data
 */
export const useRiskDetailsById = (
  projectId: number,
  probabilityLevelId: number,
  severityLevelId: number,
  matrixType: MatrixType,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: [
      RISK_MANAGEMENT_QUERY_KEYS.MITIGATION_MATRIX[
        matrixType === MATRIX_TYPES.AFTER ? 'AFTER_MITIGATION_RISK_DETAILS' : 'RISK_DETAILS'
      ],
      projectId,
      probabilityLevelId,
      severityLevelId,
    ],
    queryFn: () =>
      matrixType === MATRIX_TYPES.AFTER
        ? getAfterMitigationRiskDetailsById(projectId, probabilityLevelId, severityLevelId)
        : getRiskDetailsById(projectId, probabilityLevelId, severityLevelId),
    enabled: !!projectId && !!probabilityLevelId && !!severityLevelId && enabled,
  })
}


/**
 * Unified hook for fetching mitigation matrix data (before or after)
 * @param projectId - The project ID to fetch data for
 * @param matrixType - The type of matrix (MatrixType)
 * @param enabled - Whether the query should be enabled
 * @returns Query result containing matrix data
 */
export const useMitigationMatrix = (
  projectId: number,
  matrixType: MatrixType,
  enabled: boolean = true
) => {
  return useQuery<{ data: MatrixCell[] }>({
    queryKey: [
      RISK_MANAGEMENT_QUERY_KEYS.MITIGATION_MATRIX[
        matrixType === MATRIX_TYPES.AFTER ? 'AFTER_MITIGATION' : 'BEFORE_MITIGATION'
      ],
      projectId,
    ],
    queryFn: () =>
      matrixType === MATRIX_TYPES.AFTER
        ? getAfterMitigationMatrix(projectId)
        : getBeforeMitigationMatrix(projectId),
    enabled: !!projectId && enabled,
  })
}