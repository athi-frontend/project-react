import {
  FEASIBILITY_STUDY_ENDPOINTS,
  ERROR_MESSAGES,
  DENIED_ALERT,
  SUCCESS_ALERT,
} from '@/constants/modules/dnd/feasibilityStudy'
import { apiClient } from '@/shared/apiClient'
import { FeasibilityStudyFormData, CurrencyResponse } from '@/types/modules/dnd/feasibilityStudy'
import { showActionAlert } from '@/components/ui/alert-modal/ActionAlert'

export const fetchFeasibilityStudy = async (projectId: number) => {
  const response = await apiClient.get(FEASIBILITY_STUDY_ENDPOINTS.FETCH(projectId))
  return response.data
}

export const saveFeasibilityStudy = async (
  formData: FeasibilityStudyFormData,
  hasData: boolean
) => {
  try {
    const response = await apiClient.post(
      FEASIBILITY_STUDY_ENDPOINTS.SAVE,
      formData
    )
    showActionAlert(SUCCESS_ALERT)
    return response.data
  } catch (error) {
    console.error('Error saving feasibility study:', error)
    throw showActionAlert(DENIED_ALERT)
  }
}

export const fetchDecision = async (projectId: number) => {
  try {
    const response = await apiClient.get(
      FEASIBILITY_STUDY_ENDPOINTS.FETCH_DECISION(projectId)
    )
    return response.data.data
  } catch (error) {
    console.error('Error fetching decision:', error)
    throw new Error(ERROR_MESSAGES.FETCH_DECISION_FAILED)
  }
}

export const saveDecision = async (
  payload: SaveDecisionPayload
): Promise<void> => {
  try {
    await apiClient.post(FEASIBILITY_STUDY_ENDPOINTS.SAVE_DECISION, payload)
    showActionAlert(SUCCESS_ALERT)
  } catch (error) {
    console.error('Error saving decision:', error)
    throw showActionAlert(DENIED_ALERT)
  }
}
/**
     * Function Name: fetchCurrencies
     * Description: This function fetches currencies data from API endpoint using apiClient
     * Author: Athinarayanan
     * Created: 11-09-2025
     * Classification : Confidential
**/
export const fetchCurrencies = async (): Promise<CurrencyResponse> => {
  const response = await apiClient.get(FEASIBILITY_STUDY_ENDPOINTS.FETCH_CURRENCIES)
  return response.data
}
