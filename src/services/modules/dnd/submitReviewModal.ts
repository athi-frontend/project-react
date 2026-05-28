import { apiClient } from '@/shared/apiClient'
import { API_URLS } from '@/constants/common'
export const submitReview = async(data: any) => {
  const response = await apiClient.put(API_URLS.ACTIONS.SUBMIT_FOR_REVIEW, data)
  return response.data
}

export const getReviewers = async (project_id: number) => {
  const response = await apiClient.get(API_URLS.REVIEWERS_ALL(project_id))
  return response.data
}