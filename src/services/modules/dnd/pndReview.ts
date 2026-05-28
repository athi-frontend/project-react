import { apiClient } from '@/shared/apiClient'
import { API_ENDPOINTS } from '@/constants/modules/dnd/pnd-review'
import { PndReviewData } from '@/types/modules/dnd/pndReview'

export const fetchPNDReview = async (projectId: number) => {
  const url = API_ENDPOINTS.FETCH_PND_REVIEW(projectId)
  const response = await apiClient.get(url)
  return response.data
}

export const upsertPNDReview = async (pndReviewData: PndReviewData) => {
  const response = await apiClient.post(
    API_ENDPOINTS.UPSERT_PND_REVIEW,
    pndReviewData
  )
  return response.data
}
