/**
    Classification : Confidential
**/
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchRiskCategories,
  fetchRiskSubcategories,
  upsertRiskCategory,
  upsertRisk,
  fetchRiskById,
  deleteRisk,
  fetchProbabilityLevels,
  fetchSeverityLevels,
  fetchRiskIdentificationMethods,
  fetchRCM,
  upsertRCM,
  deleteRCM,
  fetchRCMTypes,
  fetchRiskAcceptability,
  fetchAllHazards,
  fetchHazardById,
  upsertHazard,
  deleteHazard,
  fetchAllHarms,
  fetchReferenceRCM,
} from '@/services/modules/risk-management/riskAnalysisControl'
import { RISK_MANAGEMENT_QUERY_KEYS } from '@/constants/queryKeys'
import {
  CategoriesApiResponse,
  SubcategoriesApiResponse,
  UpsertCategoryRequest,
  UpsertRiskRequest,
  SingleRiskApiResponse,
  ProbabilityLevelsApiResponse,
  SeverityLevelsApiResponse,
  RiskIdentificationMethodsApiResponse,
  RCMApiResponseWrapper,
  UpsertRCMRequest,
  RCMTypesApiResponse,
  RiskAcceptabilityApiResponseWrapper,
  HazardsApiResponse,
  SingleHazardApiResponseWrapper,
  UpsertHazardRequest,
  HarmDropdownResponse,
  ReferenceRCMResponse,
} from '@/types/modules/risk-management/riskAnalysisControl'
import { RISK_BENEFIT_CONSTANTS } from '@/constants/modules/risk-management/riskBenefitAnalysis'

export const useRiskCategories = (projectId: number) => {
  return useQuery<CategoriesApiResponse>({
    queryKey: [
      RISK_MANAGEMENT_QUERY_KEYS.RISK_ANALYSIS_CONTROL.FETCH_CATEGORIES,
      projectId,
    ],
    queryFn: () => fetchRiskCategories(projectId),
    enabled: !!projectId,
  })
}

export const useRiskSubcategories = (
  categoryId: number,
  projectId: number,
  responseRequired?: boolean
) => {
  return useQuery<SubcategoriesApiResponse>({
    queryKey: [
      RISK_MANAGEMENT_QUERY_KEYS.RISK_ANALYSIS_CONTROL.FETCH_SUBCATEGORIES,
      categoryId,
      projectId,
    ],
    queryFn: () => fetchRiskSubcategories(categoryId, projectId, responseRequired),
    enabled: !!categoryId && !!projectId,
    placeholderData: undefined,
    staleTime: 0,
    gcTime: 0,
  })
}

export const useUpsertRiskCategory = (
  categoryId: number | undefined,
  projectId: number
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpsertCategoryRequest) => upsertRiskCategory(data),
    onSuccess: () => {
      // Invalidate and refetch subcategories after successful upsert
      queryClient.invalidateQueries({
        queryKey: [RISK_MANAGEMENT_QUERY_KEYS.HAZARD.FETCH_ALL],
      })
      queryClient.invalidateQueries({
        queryKey: [
          RISK_MANAGEMENT_QUERY_KEYS.MITIGATION_MATRIX.BEFORE_MITIGATION, projectId
        ],
      })
      queryClient.invalidateQueries({
        queryKey: [
          RISK_MANAGEMENT_QUERY_KEYS.MITIGATION_MATRIX.AFTER_MITIGATION, projectId
        ],
      })
      if (categoryId) {
        queryClient.invalidateQueries({
          queryKey: [
            RISK_MANAGEMENT_QUERY_KEYS.RISK_ANALYSIS_CONTROL
              .FETCH_SUBCATEGORIES,
            categoryId,
            projectId,
          ],
        })
      }
    },
  })
}

// Risk Management React Query Hooks
/**
 * Hook to create or update a risk
 */
export const useUpsertRisk = (hazardId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (riskData: UpsertRiskRequest) => upsertRisk(riskData),
    onSuccess: (data, variables) => {
      // Invalidate and refetch hazards list to update the risk list
      queryClient.invalidateQueries({
        queryKey: [
          RISK_MANAGEMENT_QUERY_KEYS.HAZARD.FETCH_ALL,
          variables.risk_applicability_id,
        ],
      })

      // If editing an existing risk, also invalidate the individual risk cache
      if (variables.risk_id) {
        queryClient.invalidateQueries({
          queryKey: [
            RISK_MANAGEMENT_QUERY_KEYS.RISK.FETCH_BY_ID,
            variables.risk_id,
          ],
        })
      }

      // Invalidate before mitigation matrix data when risk is created/updated
      queryClient.invalidateQueries({
        queryKey: [
          RISK_MANAGEMENT_QUERY_KEYS.MITIGATION_MATRIX.BEFORE_MITIGATION,
        ],
      })

      // Invalidate individual residual risk analysis list when risk is created/updated
      queryClient.invalidateQueries({
        queryKey: [
          RISK_MANAGEMENT_QUERY_KEYS.INDIVIDUAL_RISK_ANALYSIS.LIST,
        ],
      })
    },
  })
}

/**
 * Hook to fetch a specific risk by ID
 */
export const useRiskById = (riskId: number) => {
  return useQuery<SingleRiskApiResponse>({
    queryKey: [RISK_MANAGEMENT_QUERY_KEYS.RISK.FETCH_BY_ID, riskId],
    queryFn: () => fetchRiskById(riskId),
    enabled: !!riskId,
  })
}

/**
 * Hook to delete a risk
 */
export const useDeleteRisk = (riskApplicabilityId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (riskId: number) => deleteRisk(riskId),
    onSuccess: () => {
      // Invalidate and refetch hazards list to update the risk list
      queryClient.invalidateQueries({
        queryKey: [
          RISK_MANAGEMENT_QUERY_KEYS.HAZARD.FETCH_ALL,
          riskApplicabilityId,
        ],
      })

      // Invalidate before mitigation matrix data when risk is deleted
      queryClient.invalidateQueries({
        queryKey: [
          RISK_MANAGEMENT_QUERY_KEYS.MITIGATION_MATRIX.BEFORE_MITIGATION,
        ],
      })

      // Invalidate after mitigation matrix data when risk is deleted
      queryClient.invalidateQueries({
        queryKey: [
          RISK_MANAGEMENT_QUERY_KEYS.MITIGATION_MATRIX.AFTER_MITIGATION,
        ],
      })

      // Invalidate and refetch reference RCM dropdown list
      queryClient.invalidateQueries({
        queryKey: [
          RISK_MANAGEMENT_QUERY_KEYS.REFERENCE_RCM.FETCH_ALL,
        ],
      })

      // Invalidate individual residual risk analysis list when risk is deleted
      queryClient.invalidateQueries({
        queryKey: [
          RISK_MANAGEMENT_QUERY_KEYS.INDIVIDUAL_RISK_ANALYSIS.LIST,
        ],
      })
    },
  })
}

// Dropdown React Query Hooks
/**
 * Hook to fetch probability levels for dropdown
 */
export const useProbabilityLevels = (
  projectId: number,
  enabled: boolean = true
) => {
  return useQuery<ProbabilityLevelsApiResponse>({
    queryKey: [
      RISK_MANAGEMENT_QUERY_KEYS.DROPDOWN_OPTIONS.FETCH_PROBABILITY_LEVELS,
    ],
    queryFn: () => fetchProbabilityLevels(projectId),
    enabled: !!projectId && enabled,
  })
}

/**
 * Hook to fetch severity levels for dropdown
 */
export const useSeverityLevels = (
  projectId: number,
  enabled: boolean = true
) => {
  return useQuery<SeverityLevelsApiResponse>({
    queryKey: [
      RISK_MANAGEMENT_QUERY_KEYS.DROPDOWN_OPTIONS.FETCH_SEVERITY_LEVELS,
    ],
    queryFn: () => fetchSeverityLevels(projectId),
    enabled: !!projectId && enabled,
  })
}

/**
 * Hook to fetch risk identification methods for dropdown
 */
export const useRiskIdentificationMethods = (enabled: boolean = true) => {
  return useQuery<RiskIdentificationMethodsApiResponse>({
    queryKey: [
      RISK_MANAGEMENT_QUERY_KEYS.DROPDOWN_OPTIONS
        .FETCH_RISK_IDENTIFICATION_METHODS,
    ],
    queryFn: () => fetchRiskIdentificationMethods(),
    enabled,
  })
}

// RCM React Query Hooks
/**
 * Hook to fetch a specific RCM by ID
 */
export const useRCMById = (rcmId: number) => {
  return useQuery<RCMApiResponseWrapper>({
    queryKey: [RISK_MANAGEMENT_QUERY_KEYS.RCM.FETCH_BY_ID, rcmId],
    queryFn: () => fetchRCM(rcmId),
    enabled: !!rcmId,
  })
}

/**
 * Hook to create or update an RCM
 */
export const useUpsertRCM = (subcategoryApplicabilityId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (rcmData: UpsertRCMRequest) => upsertRCM(rcmData),
    onSuccess: (data, variables) => {
      // Invalidate and refetch hazards list to update the RCM list
      queryClient.invalidateQueries({
        queryKey: [
          RISK_MANAGEMENT_QUERY_KEYS.HAZARD.FETCH_ALL,
          subcategoryApplicabilityId,
        ],
      })

      // Invalidate and refetch reference RCM dropdown list
      queryClient.invalidateQueries({
        queryKey: [
          RISK_MANAGEMENT_QUERY_KEYS.REFERENCE_RCM.FETCH_ALL,
        ],
      })

      // If editing an existing RCM, also invalidate the individual RCM cache
      if (variables.rcm_id) {
        queryClient.invalidateQueries({
          queryKey: [
            RISK_MANAGEMENT_QUERY_KEYS.RCM.FETCH_BY_ID,
            variables.rcm_id,
          ],
        })
      }

      // Invalidate after mitigation matrix data when RCM is created/updated
      queryClient.invalidateQueries({
        queryKey: [
          RISK_MANAGEMENT_QUERY_KEYS.MITIGATION_MATRIX.AFTER_MITIGATION,
        ],
      })

      // Invalidate and refetch reference Benefit Risk Analysis dropdown list
      queryClient.invalidateQueries({
        queryKey: [
          RISK_BENEFIT_CONSTANTS.QUERY_KEYS.RISK_BENEFIT,
        ],
      })
    },
  })
}

/**
 * Hook to delete an RCM
 */
export const useDeleteRCM = (subcategoryApplicabilityId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (rcmId: number) => deleteRCM(rcmId),
    onSuccess: () => {
      // Invalidate and refetch hazards list to update the RCM list
      queryClient.invalidateQueries({
        queryKey: [
          RISK_MANAGEMENT_QUERY_KEYS.HAZARD.FETCH_ALL,
          subcategoryApplicabilityId,
        ],
      })

      // Invalidate after mitigation matrix data when RCM is deleted
      queryClient.invalidateQueries({
        queryKey: [
          RISK_MANAGEMENT_QUERY_KEYS.MITIGATION_MATRIX.AFTER_MITIGATION,
        ],
      })

      // Invalidate and refetch reference RCM dropdown list
      queryClient.invalidateQueries({
        queryKey: [
          RISK_MANAGEMENT_QUERY_KEYS.REFERENCE_RCM.FETCH_ALL,
        ],
      })

      // Invalidate and refetch reference Benefit Risk Analysis dropdown list
      queryClient.invalidateQueries({
        queryKey: [
          RISK_BENEFIT_CONSTANTS.QUERY_KEYS.RISK_BENEFIT,
        ],
      })
    },
  })
}

/**
 * Hook to fetch RCM types for dropdown
 */
export const useRCMTypes = (enabled: boolean = true) => {
  return useQuery<RCMTypesApiResponse>({
    queryKey: [RISK_MANAGEMENT_QUERY_KEYS.DROPDOWN_OPTIONS.FETCH_RCM_TYPES],
    queryFn: () => fetchRCMTypes(),
    enabled,
  })
}

/**
 * Hook to fetch risk acceptability based on probability and severity levels
 */
export const useRiskAcceptability = (
  probabilityLevelId: number,
  severityLevelId: number
) => {
  return useQuery<RiskAcceptabilityApiResponseWrapper>({
    queryKey: [
      RISK_MANAGEMENT_QUERY_KEYS.DROPDOWN_OPTIONS.FETCH_RISK_ACCEPTABILITY,
      probabilityLevelId,
      severityLevelId,
    ],
    queryFn: () => fetchRiskAcceptability(probabilityLevelId, severityLevelId),
    enabled: !!probabilityLevelId && !!severityLevelId,
  })
}

// Hazard Management React Query Hooks
/**
 * Hook to fetch all hazards for a subcategory applicability
 */
export const useHazards = (
  subcategoryApplicabilityId: number,
  enabled: boolean = true
) => {
  return useQuery<HazardsApiResponse>({
    queryKey: [
      RISK_MANAGEMENT_QUERY_KEYS.HAZARD.FETCH_ALL,
      subcategoryApplicabilityId,
    ],
    queryFn: () => fetchAllHazards(subcategoryApplicabilityId),
    enabled: !!subcategoryApplicabilityId && enabled,
  })
}

/**
 * Hook to fetch a specific hazard by ID
 */
export const useHazardById = (hazardId: number) => {
  return useQuery<SingleHazardApiResponseWrapper>({
    queryKey: [RISK_MANAGEMENT_QUERY_KEYS.HAZARD.FETCH_BY_ID, hazardId],
    queryFn: () => fetchHazardById(hazardId),
    enabled: !!hazardId,
  })
}

/**
 * Hook to create or update a hazard
 */
export const useUpsertHazard = (subcategoryApplicabilityId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (hazardData: UpsertHazardRequest) => upsertHazard(hazardData),
    onSuccess: (data, variables) => {
      // Invalidate and refetch hazards list
      queryClient.invalidateQueries({
        queryKey: [
          RISK_MANAGEMENT_QUERY_KEYS.HAZARD.FETCH_ALL,
          subcategoryApplicabilityId,
        ],
      })

      // If editing an existing hazard, also invalidate the individual hazard cache
      if (variables.hazard_id) {
        queryClient.invalidateQueries({
          queryKey: [
            RISK_MANAGEMENT_QUERY_KEYS.HAZARD.FETCH_BY_ID,
            variables.hazard_id,
          ],
        })
      }
    },
  })
}

/**
 * Hook to delete a hazard
 */
export const useDeleteHazard = (subcategoryApplicabilityId: number) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (hazardId: number) => deleteHazard(hazardId),
    onSuccess: () => {
      // Invalidate and refetch hazards list
      queryClient.invalidateQueries({
        queryKey: [
          RISK_MANAGEMENT_QUERY_KEYS.HAZARD.FETCH_ALL,
          subcategoryApplicabilityId,
        ],
      })

      // Invalidate before mitigation matrix data when hazard is deleted
      queryClient.invalidateQueries({
        queryKey: [
          RISK_MANAGEMENT_QUERY_KEYS.MITIGATION_MATRIX.BEFORE_MITIGATION,
        ],
      })

      // Invalidate after mitigation matrix data when hazard is deleted
      queryClient.invalidateQueries({
        queryKey: [
          RISK_MANAGEMENT_QUERY_KEYS.MITIGATION_MATRIX.AFTER_MITIGATION,
        ],
      })

      // Invalidate and refetch reference RCM dropdown list
      queryClient.invalidateQueries({
        queryKey: [
          RISK_MANAGEMENT_QUERY_KEYS.REFERENCE_RCM.FETCH_ALL,
        ],
      })

      // Invalidate individual residual risk analysis list when hazard is deleted
      queryClient.invalidateQueries({
        queryKey: [
          RISK_MANAGEMENT_QUERY_KEYS.INDIVIDUAL_RISK_ANALYSIS.LIST,
        ],
      })
    },
  })
}

/**
 * Hook to fetch all harm options for dropdown
 */
export const useHarms = (enabled: boolean = true) => {
  return useQuery<HarmDropdownResponse>({
    queryKey: [RISK_MANAGEMENT_QUERY_KEYS.HARMS.FETCH_ALL],
    queryFn: () => fetchAllHarms(),
    enabled,
  })
}

/**
 * Hook to fetch reference RCM options for dropdown
 */
export const useReferenceRCM = (
  projectId: number,
  enabled: boolean = true
) => {
  return useQuery<ReferenceRCMResponse>({
    queryKey: [
      RISK_MANAGEMENT_QUERY_KEYS.REFERENCE_RCM.FETCH_ALL
    ],
    queryFn: () => fetchReferenceRCM(projectId),
    enabled: !!projectId && enabled,
  })
}
