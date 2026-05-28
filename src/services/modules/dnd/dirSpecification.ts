import { API_ENDPOINTS } from '@/constants/modules/dnd/digSpecificaton'
import { apiClient } from '../../../shared/apiClient'
import { ApiResponse } from '@/types/components/modules/dirSpecifications'
import { NUMBERMAP } from '@/constants/common'
import { API_URLS } from '@/constants/modules/dnd/dirSpecificataion'
import {RegulationMarketPrefillResponse } from '@/types/modules/dnd/digSpecification'

/**
 Classification : Confidential
**/

export const getPhysicalCharacteristics = async (
  specification_applicability_id: number
): Promise<ApiResponse> => {
  const response = await apiClient.get(
    `${API_ENDPOINTS.DIG_SPECIFICATION_ALL(specification_applicability_id)}`,
    {
      params: {
        page: NUMBERMAP.ONE,
        page_size: NUMBERMAP.FOURHUNDRED,
      },
    }
  )
  return response.data
}

export const getSpecifications = async (
  projectId: number
): Promise<ApiResponse> => {
  const response = await apiClient.get(
    `${API_ENDPOINTS.FETCH_SPECIFICATIONS(projectId)}&status=` + NUMBERMAP.ONE
  )
  return response.data
}

export const deletePhysicalCharacteristic = async (
  designInputRequirementId: number
): Promise<ApiResponse> => {
  const response = await apiClient.delete(
    API_ENDPOINTS.DIG_SPECIFICATION_DELETE(designInputRequirementId)
  )
  return response.data
}

export const createSpecification = async (
  project_id: number,
  eqms_dig_specification_id: number,
) => {
  if (!project_id || !eqms_dig_specification_id) {
    return
  }
  const response = await apiClient.post(
    API_URLS.MAGIC_SAVE_DIR.CREATE,
    {
      project_id,
      dig_specification_id: eqms_dig_specification_id,
    }
  )
  return response.data
}

  /** Author: Harsithiga B
  Date: 13-08-2025
  Modified: 21-08-2025
  Description: Service to fetch Regulation and Market for a Project Id **/
export const fetchRegulationMarket = async (projectId: number): Promise<RegulationMarketPrefillResponse> => {
  const response = await apiClient.get(API_URLS.REGULATION_MARKET.FETCH(projectId))
  return response.data
}

  /** Author: Harsithiga B
  Date: 23-08-2025
  Description: Service to fetch Accessories by Usability Type for Shelf Life specification **/
export const fetchAccessoriesByUsabilityType = async (specId: number, usabilityTypeId: number) => {
  const response = await apiClient.get(API_URLS.ACCESSORIES.FETCH_BY_USABILITY_TYPE(specId, usabilityTypeId))
  return response.data
}

  /** Author: Harsithiga B
  Date: 25-08-2025
  Description: Service to delete device **/
export const deleteDevice = async (deviceId: number) => {
  const response = await apiClient.delete(API_ENDPOINTS.DEVICE_DELETE(deviceId))
  return response.data
}