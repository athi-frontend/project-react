import { apiClient } from '@/shared/apiClient'
import { API_ENDPOINTS } from '@/constants/modules/quality-control-management/nonConformanceDetails'
import {
  NonConformanceDetailsResponse,
  NonConformanceDetailByIdResponse,
  NonConformanceDetailsUpsertRequest,
  NonConformanceDetailsUpsertResponse,
} from '@/types/modules/quality-control-management/nonConformanceDetails'

/**
 * Classification : Confidential
 **/

/**
 * Fetch all non-conformance details with optional filters
 * @param filters - Optional filters for the query
 * @returns Promise<NonConformanceDetailsResponse>
 */
export const fetchAllNonConformanceDetails = async (
  status?: number
): Promise<NonConformanceDetailsResponse> => {
  const response = await apiClient.get(API_ENDPOINTS.FETCH_ALL)
  return response.data
}

/**
 * Fetch non-conformance detail by ID
 * @param inspectionResultId - The inspection result ID
 * @param nonConformanceDetailsId - The non-conformance details ID
 * @returns Promise<NonConformanceDetailByIdResponse>
 */
export const fetchNonConformanceDetailById = async (
  inspectionResultId: number
): Promise<NonConformanceDetailByIdResponse> => {
  const response = await apiClient.get(
    API_ENDPOINTS.FETCH_BY_ID(inspectionResultId)
  )
  return response.data
}

/**
 * Create or update non-conformance detail
 * @param payload - The non-conformance detail data (FormData for file uploads)
 * @returns Promise<NonConformanceDetailsUpsertResponse>
 */
export const upsertNonConformanceDetail = async (
  payload: FormData | NonConformanceDetailsUpsertRequest
): Promise<NonConformanceDetailsUpsertResponse> => {
  const response = await apiClient.post(API_ENDPOINTS.UPSERT, payload)
  return response.data
}
