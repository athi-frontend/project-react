/**
 * Classification : Confidential
 **/
import { apiClient } from '@/shared/apiClient'
import { SANITY_CHECK_API_ENDPOINTS } from '@/constants/modules/quality-control-management/sanityCheckInspection'
import {
  SanityCheckInspectionFormData,
  SanityCheckInspectionListResponse,
  SanityCheckInspectionFetchResponse,
  SpecificationChecklistListResponse,
} from '@/types/modules/quality-control-management/sanityCheckInspection'

export const getSanityCheckInspectionList = async (): Promise<SanityCheckInspectionListResponse> => {
  const response = await apiClient.get(SANITY_CHECK_API_ENDPOINTS.GET_ALL)
  return response.data
}

export const getSanityCheckInspectionById = async (
  sanityCheckInspectionId: number
): Promise<SanityCheckInspectionFetchResponse> => {
  const url = SANITY_CHECK_API_ENDPOINTS.GET_BY_ID(sanityCheckInspectionId)
  const response = await apiClient.get(url)
  return response.data
}

export const upsertSanityCheckInspection = async (
  data: SanityCheckInspectionFormData
) => {
  const response = await apiClient.post(SANITY_CHECK_API_ENDPOINTS.UPSERT, data)
  return response.data
}

export const deleteSanityCheckInspection = async (
  sanityCheckInspectionId: number
) => {
  const url = SANITY_CHECK_API_ENDPOINTS.DELETE(sanityCheckInspectionId)
  const response = await apiClient.delete(url)
  return response.data
}

export const getSpecificationChecklist = async (
  purchaseOrderId: number
): Promise<SpecificationChecklistListResponse> => {
  const url = SANITY_CHECK_API_ENDPOINTS.GET_SPECIFICATION_CHECKLIST(purchaseOrderId)
  const response = await apiClient.get(url)
  return response.data
}
