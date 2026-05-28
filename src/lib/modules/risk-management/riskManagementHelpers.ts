import {
  RiskApiResponse,
  RCMApiResponse,
  HazardApiResponse,
  SubcategoryWithHazardsApiResponse,
} from '@/types/modules/risk-management/riskAnalysisControl'

/**
 * Classification: Confidential
 */

/**
 * Helper function to find RCM in a single risk's control measures
 */
export const findRCMInRisk = (rcmId: number, risk: RiskApiResponse) => {
  if (
    !risk.risk_control_measures ||
    !Array.isArray(risk.risk_control_measures)
  ) {
    return null
  }

  const matchingRCM = risk.risk_control_measures.find(
    (rcm: RCMApiResponse) => rcm.rcm_id === rcmId
  )
  return matchingRCM
    ? { hazardId: null, riskId: risk.risk_id, found: true }
    : null
}

/**
 * Helper function to find RCM in a single hazard's risks
 */
export const findRCMInHazard = (rcmId: number, hazard: HazardApiResponse) => {
  if (!hazard.risks || !Array.isArray(hazard.risks)) {
    return null
  }

  for (const risk of hazard.risks) {
    const result = findRCMInRisk(rcmId, risk)
    if (result) {
      return { ...result, hazardId: hazard.hazard_id }
    }
  }
  return null
}

/**
 * Helper function to find RCM in a single subcategory's hazards
 */
export const findRCMInSubcategory = (
  rcmId: number,
  subcategory: SubcategoryWithHazardsApiResponse
) => {
  if (!subcategory.hazards || !Array.isArray(subcategory.hazards)) {
    return null
  }

  for (const hazard of subcategory.hazards) {
    const result = findRCMInHazard(rcmId, hazard)
    if (result) {
      return result
    }
  }
  return null
}

/**
 * Function to extract risk and hazard IDs from RCM ID
 */
export const extractIdsFromRCMId = (
  rcmId: number,
  data: SubcategoryWithHazardsApiResponse[]
) => {
  for (const subcategory of data) {
    const result = findRCMInSubcategory(rcmId, subcategory)
    if (result) {
      return result
    }
  }
  return { hazardId: null, riskId: null, found: false }
}
