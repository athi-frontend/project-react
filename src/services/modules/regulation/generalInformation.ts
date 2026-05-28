import { apiClient } from '@/shared/apiClient'
import { API_ENDPOINTS } from '@/constants/modules/regulation/generalInformation'
import {
  GeneralInformationData,
  GeneralInformationResponse,
} from '@/types/modules/regulation/generalInformation'

export const getGeneralInformation = async (
  organizationSiteId: number
) => {
  const response = await apiClient.get<GeneralInformationResponse>(
    `${API_ENDPOINTS.GET_PLANT_MASTER}/${organizationSiteId}`
  )

  // Return the first item from the data array as per the API response structure
  return response.data
}

export const updateGeneralInformation = async (
  formData: Partial<GeneralInformationData>
) => {
  const response = await apiClient.post<GeneralInformationResponse>(
    `${API_ENDPOINTS.GET_PLANT_MASTER}`,
    formData
  )

  return response.data
}
