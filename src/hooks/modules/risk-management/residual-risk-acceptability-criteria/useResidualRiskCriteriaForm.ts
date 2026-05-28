/**
 *Classification : Confidential
 **/
import { useEffect } from 'react'
import { NUMBERMAP } from '@/constants/common'
import { initialFormData, getSectionKeyByTypeName } from '@/lib/utils/modules/risk-management/residualRiskCriteriaUtils'
import { 
  ApiResponse,
  UseResidualRiskCriteriaFormProps
} from '@/types/modules/risk-management/residualRiskCriteria'

export const useResidualRiskCriteriaForm = ({
  criteriaData,
  setFormData,
}: UseResidualRiskCriteriaFormProps): void => {
  // Load initial data from API
  useEffect(() => {
    if (!criteriaData?.data) return

    // Handle both response formats:
    // 1. Direct array: { data: [...] }
    // 2. Nested object: { data: { project_id: 229, criteria_data: [...] } } draft response
    let apiData: ApiResponse[] = []
    
    if (Array.isArray(criteriaData.data)) {
      // Format 1: Direct array
      apiData = criteriaData.data
    } else if (criteriaData.data.criteria_data && Array.isArray(criteriaData.data.criteria_data)) {
      // Format 2: Nested object with criteria_data
      apiData = criteriaData.data.criteria_data
    }

    if (apiData.length > NUMBERMAP.ZERO) {
      const updatedFormData = { ...initialFormData }

      apiData.forEach((item: ApiResponse) => {
        const sectionKey = getSectionKeyByTypeName(item.risk_acceptability_type)
        if (sectionKey && updatedFormData[sectionKey]) {
          updatedFormData[sectionKey] = {
            ...updatedFormData[sectionKey],
            criteriaId: item.criteria_id,
            description: item.acceptance_criteria_description ?? '',
            severityLevel: item.severity_level_id?.toString() ?? '',
            operator: item.operator_id?.toString() ?? '',
            maxAllowed : item.max_allowed?.toString() ?? '',
            probabilityLevel: item.probability_level_id?.toString() ?? '',
            riskAcceptabilityTypeId: item.risk_acceptability_type_id,
          }
        }
      })

      setFormData(updatedFormData)
    }
  }, [criteriaData, setFormData])
}
