import { apiClient } from '@/shared/apiClient'
import { CustomError } from '@/types/modules/dnd/project'
import { API_URLS } from '@/constants/modules/dnd/marketStudy'

export const addMarket = async (marketStudy: any) => {
  try {
    const response = await apiClient.post(API_URLS.TEAM.CREATE, marketStudy)
    return response.data
  } catch (error) {
    const errorResponse = error as CustomError
    const errorMessage = errorResponse.response?.data?.message
    throw new Error(errorMessage)
  }
}

export const getMarketResearchList = async (projectId: string | number) => {
  try {
    const response = await apiClient.get(`${API_URLS.TEAM.FETCH}${projectId}`)
    return response.data
  } catch (error) {
    throw new Error('Failed to fetch market research list', error)
  }
}
export const fetchMarketResearchStudyById = async (
  market_research_study_id: number
) => {
  const response = await apiClient.get(
    `${API_URLS.TEAM.FETCH_ID}${market_research_study_id}`
  )
  return response.data
}

export const deleteMarketResearch = async (
  market_research_study_id: number
) => {
  try {
    const response = await apiClient.delete(
      `${API_URLS.TEAM.DELETE}/${market_research_study_id}`
    )
    return response.data
  } catch (error) {
    const errorResponse = error as CustomError
    const errorMessage = errorResponse.response?.data?.message
    throw new Error(errorMessage)
  }
}

export const updateMarketResearch = (id: number, data: any) => {
  return apiClient.put(`${API_URLS.TEAM.UPDATE}/${id}`, data)
}
