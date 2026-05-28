/**
 * Classification: Confidential
 */
import { useMemo } from 'react'
import { transformHazardsApiToUI } from '@/lib/modules/risk-management/hazardTransformer'
import {
  UseHazardListProps,
  UseHazardListReturn,
} from '@/types/modules/risk-management/riskAnalysisControl'

/**
 * Custom hook to transform hazards API data to UI format with expansion state
 * Handles the common logic for processing hazards data with expanded states
 *
 * @param hazardsApiData - API response data containing hazards
 * @param expandedHazards - Set of expanded hazard IDs
 * @param expandedRisks - Set of expanded risk IDs
 * @returns Transformed hazards with expansion state
 */
export const useHazardList = ({
  hazardsApiData,
  expandedHazards,
  expandedRisks,
}: UseHazardListProps): UseHazardListReturn => {
  const hazards = useMemo(() => {
    if (hazardsApiData?.data) {
      return transformHazardsApiToUI(hazardsApiData.data).map((hazard) => ({
        ...hazard,
        expanded: expandedHazards.has(hazard.hazard_id.toString()),
        risks: hazard.risks.map((risk) => ({
          ...risk,
          expanded: expandedRisks.has(risk.risk_id.toString()),
        })),
      }))
    }
    return []
  }, [hazardsApiData, expandedHazards, expandedRisks])

  return { hazards }
}
