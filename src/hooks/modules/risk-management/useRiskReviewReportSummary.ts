import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchRiskReviewReportSummary,
  upsertRiskReviewReportSummary,
} from '@/services/modules/risk-management/riskReviewReportSummaryService'
import { showActionAlert } from '@/components/ui/alert-modal/ActionAlert'
import { NUMBERMAP, STATUS } from '@/constants/common'
import { RISK_MANAGEMENT_QUERY_KEYS } from '@/constants/queryKeys'

/**
 * Classification: Confidential
 */

// Fetch API - GET by project_id
export const useRiskReviewReportSummary = (project_id: number) =>
  useQuery({
    queryKey: [
      RISK_MANAGEMENT_QUERY_KEYS.RISK_REVIEW_REPORT_SUMMARY.FETCH_BY_PROJECT_ID,
      project_id,
    ],
    queryFn: () => fetchRiskReviewReportSummary(project_id),
    enabled: !!project_id,
    refetchOnWindowFocus: false,
    placeholderData: undefined,
    // stops structural sharing (also prevents reusing nested old data)
    staleTime: NUMBERMAP.ZERO,
    gcTime: NUMBERMAP.ZERO,
  })

// Upsert API - POST
export const useUpsertRiskReviewReportSummary = (project_id: number) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: FormData) => upsertRiskReviewReportSummary(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          RISK_MANAGEMENT_QUERY_KEYS.RISK_REVIEW_REPORT_SUMMARY
            .FETCH_BY_PROJECT_ID,
          project_id,
        ],
      })
      showActionAlert(STATUS.SUCCESS)
    },
    onError: () => {
      showActionAlert(STATUS.FAILED)
    },
  })
}
