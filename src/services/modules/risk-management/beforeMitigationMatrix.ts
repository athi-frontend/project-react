/**
 * Before Mitigation Matrix Service
 * Classification: Confidential
 */

import { apiClient } from '@/shared/apiClient'
import { MITIGATION_MATRIX_API_ENDPOINTS } from '@/constants/modules/risk-management/mitigationMatrix'

/**
 * API for fetching before mitigation matrix data
 * @param projectId - The project ID to fetch data for
 * @returns Promise containing the before mitigation matrix data
 */
export const getBeforeMitigationMatrix = async (projectId: number) => {
  const response = await apiClient.get(
    MITIGATION_MATRIX_API_ENDPOINTS.BEFORE_MITIGATION.GET(projectId)
  )
  return response.data
}

/**
 * API for fetching risk details by probability and severity level IDs
 * @param projectId - The project ID to fetch data for
 * @param probabilityLevelId - The probability level ID from selected cell
 * @param severityLevelId - The severity level ID from selected cell
 * @returns Promise containing the risk details data
 */
export const getRiskDetailsById = async (
  projectId: number,
  probabilityLevelId: number,
  severityLevelId: number
) => {
  const response = await apiClient.get(
    MITIGATION_MATRIX_API_ENDPOINTS.RISK_DETAILS.GET(projectId),
    {
      params: {
        probability_level_id: probabilityLevelId,
        severity_level_id: severityLevelId,
      },
    }
  )
  return response.data
}
