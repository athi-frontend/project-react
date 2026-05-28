'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchFeasibilityStudy,
  saveFeasibilityStudy,
  fetchDecision,
  saveDecision,
  fetchCurrencies,
} from '@/services/modules/dnd/feasibilityStudy'
import {
  FEASIBILITY_STUDY_KEY,
  FETCH_DECISION,
  FETCH_CURRENCIES,
} from '@/constants/modules/dnd/feasibilityStudy'
import { FeasibilityStudyFormData } from '@/types/modules/dnd/feasibilityStudy'

/**
  Classification : Confidential
**/
export const listById = (projectId: number) => {
  return useQuery({
    queryKey: [FEASIBILITY_STUDY_KEY, projectId],
    queryFn: () => fetchFeasibilityStudy(projectId),
  })
}

export const useSaveFeasibilityStudy = () => {
  /**
     * Function Name: useSaveFeasibilityStudy
     * Description: added invalidation for feasibility study query after mutation success,
     * Author: Prithiviraj,
     * modified: 23-08-2025,
     * Classification : Confidential
    **/

  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: [FEASIBILITY_STUDY_KEY],
    mutationFn: ({
      formData,
      hasData,
    }: {
      formData: FeasibilityStudyFormData
      hasData: boolean
    }) => {
      return saveFeasibilityStudy(formData, hasData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries([FEASIBILITY_STUDY_KEY])
    },
  })
}

export const useFeasibilityStudyDecision = (projectId: number) => {
  return useQuery({
    queryKey: [FETCH_DECISION, projectId],
    queryFn: () => fetchDecision(projectId),
    enabled: !!projectId,
  })
}

export const useSaveFeasibilityStudyDecision = () => {
  const queryClient = useQueryClient()
  return useMutation<void, Error, SaveDecisionPayload>({
    mutationFn: saveDecision,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [FEASIBILITY_STUDY_KEY, variables.project_id],
      })
    },
  })
}

/**
 * Function Name: useCurrencies
 * Description: This hook fetches currencies data from API endpoint using useQuery
 * Author: Athinarayanan
 * Created: 11-09-2025
 * Classification : Confidential
**/
export const useCurrencies = () => {
  return useQuery({
    queryKey: [FETCH_CURRENCIES],
    queryFn: fetchCurrencies,
  })
}
