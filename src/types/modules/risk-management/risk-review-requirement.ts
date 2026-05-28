/**
 * Risk Review Requirement Types
 * Classification: Confidential
 */

import { MetaInfo } from './common'

export interface RiskReviewRequirementItem {
  review_requirement_id: number | null
  stage_applicable_id: number
  stage_name: string
  is_review_required: number | null
  status: number | null
}

export interface RiskReviewRequirementApiResponse {
  data:
    | RiskReviewRequirementItem[]
    | {
        review_requirement_mappings: RiskReviewRequirementItem[]
      }
  meta_info?: MetaInfo
}

export interface ReviewRequirementMapping {
  review_requirement_id?: number
  stage_applicable_id: number
  is_review_required: number
}

export interface CreateRiskReviewRequirementRequest {
  project_id: number
  review_requirement_mappings: ReviewRequirementMapping[]
}
