import { apiClient } from '@/shared/apiClient'
import { API_ENDPOINTS } from '@/constants/modules/dnd/hld'
export const getProjectDetailHLDInfo = async (projectId: number) => {
  const response = await apiClient.get(
    `${API_ENDPOINTS.PROJECT_DETAIL_HLD_INFO}${projectId}`
  )
  return response.data
}

export const getProjectDetailHLDMarket = async () => {
  const response = await apiClient.get(API_ENDPOINTS.PROJECT_DETAIL_HLD_MARKET)
  return response.data
}

export const getProjectDetailHLDMarketDemography = async () => {
  const response = await apiClient.get(
    API_ENDPOINTS.PROJECT_DETAIL_HLD_MARKET_DEMOGRAPHY
  )
  return response.data
}

export const submitProjectHLD = async (projectHLDData: FormData) => {
  const response = await apiClient.post(
    API_ENDPOINTS.SUBMIT_PROJECT_HLD,
    projectHLDData
  )

  return response.data
}

export const fetchFileUrl = async ({
  queryKey,
}: {
  queryKey: [string, string | number]
}) => {
  const [, documentMediaID] = queryKey
  const response = await apiClient.get(
    `${API_ENDPOINTS.FETCH_FILE_URL}${documentMediaID}`
  )
  return response.data
}
