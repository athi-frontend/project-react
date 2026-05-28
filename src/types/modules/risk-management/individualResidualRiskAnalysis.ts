/**
 * Classification: Confidential
 */

export interface RiskRowType {
  risk_id: number
  justification: string
  selection?: string
  hazard_code?: string
  risk_title?: string
  risk_description?: string
  event_description?: string
  probability_level_name?: string
  severity_level_name?: string
}
