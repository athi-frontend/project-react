/**
 * Risk Review Types
 * Classification: Confidential
 */

export interface UpsertRiskReviewSummaryItem {
  summary_id: number
  is_reviewed: number
}

export interface UpsertRiskReviewRequest {
  review_requirement_id: number
  description: string
  acknowledge: number
  summary: UpsertRiskReviewSummaryItem[]
}

export interface RiskReviewSummaryItem {
  id: number
  risk_review_summary: string
  slug: string
  status: number
}

export interface RiskReviewCategory {
  id: number
  risk_review_category: string
  slug: string
  status: number
  summaries: RiskReviewSummaryItem[]
}

export interface RiskReviewSummaryResponse {
  data: RiskReviewCategory[]
}
