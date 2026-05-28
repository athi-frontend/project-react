import { apiClient } from '@/shared/apiClient'
import { RISK_REVIEW_REPORT_SUMMARY_API_ENDPOINTS } from '@/constants/modules/risk-management/riskReviewReportSummary'

/**
 * Classification: Confidential
 */

// GET by project_id
export const fetchRiskReviewReportSummary = async (project_id: number) => {
  const response = await apiClient.get(
    RISK_REVIEW_REPORT_SUMMARY_API_ENDPOINTS.FETCH_ALL,
    { params: { project_id } }
  )
  return response.data
}

// POST/Upsert
export const upsertRiskReviewReportSummary = async (payload: FormData) => {
  const response = await apiClient.post(
    RISK_REVIEW_REPORT_SUMMARY_API_ENDPOINTS.UPSERT,
    payload
  )
  return response.data
}
