/**
 * Applicability Types
 * Classification: Confidential
 */
import { MetaInfo } from './common'

export interface ApplicabilityItem {
  applicability_id: number | null
  project_id: number
  category_id: number
  category_name: string
  is_applicable: number
  status: number
}

export interface ApplicabilityApiResponse {
  data: ApplicabilityItem[]
  meta_info?: MetaInfo
}

export interface ApplicableRisk {
  category_id: number
  is_applicable: number
}

export interface CreateApplicabilityRequest {
  project_id: number
  applicable_risks: ApplicableRisk[]
}
