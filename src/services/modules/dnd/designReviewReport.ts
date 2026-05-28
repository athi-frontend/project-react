import { API_ENDPOINTS } from "@/constants/modules/dnd/designReviewReport"
import { apiClient } from "@/shared/apiClient"

export const fetchDesignReviewInfo = async (reviewId: number) => {
  const response = await apiClient.get(
    `${API_ENDPOINTS.DESIGN_REVIEW}/${reviewId}`
  )
  return response.data
}

export const saveDesignReview = async (formData: FormData) => {
  const response = await apiClient.post(
    API_ENDPOINTS.DESIGN_REVIEW,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  )
  return response.data
}

export const fetchDesignStages = async () => {
  const response = await apiClient.get(API_ENDPOINTS.DESIGN_STAGES)
  return response.data
}

export const fetchMembers = async () => {
  const response = await apiClient.post(API_ENDPOINTS.MEMBERS)
  return response.data
}