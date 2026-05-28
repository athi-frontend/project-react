/**
 * Classification : Confidential
 **/
import { apiClient } from '../../../shared/apiClient'
import {
  RAISE_COMPLAINT_API_ENDPOINTS,
  INFRASTRUCTURE_CATEGORY_API_ENDPOINTS,
  INFRASTRUCTURE_TYPE_API_ENDPOINTS,
  SERIAL_NUMBER_API_ENDPOINTS,
  QUERY_PARAMS,
} from '@/constants/modules/infrastructure-management/raiseComplaint'
import { NUMBERMAP } from '@/constants/common'

export const getAllComplaints = async () => {
  const response = await apiClient.get(RAISE_COMPLAINT_API_ENDPOINTS.GET_ALL)
  return response.data
}

export const getComplaintById = async (complaintId: number) => {
  const url = RAISE_COMPLAINT_API_ENDPOINTS.GET_BY_ID(complaintId)
  const response = await apiClient.get(url)
  return response.data
}

export const upsertComplaint = async (data: FormData) => {
  const response = await apiClient.post(RAISE_COMPLAINT_API_ENDPOINTS.UPSERT, data)
  return response.data
}

export const deleteComplaint = async (complaintId: number) => {
  const url = RAISE_COMPLAINT_API_ENDPOINTS.DELETE(complaintId)
  const response = await apiClient.delete(url)
  return response.data
}

export const getAllInfrastructureCategories = async () => {
  const response = await apiClient.get(INFRASTRUCTURE_CATEGORY_API_ENDPOINTS.GET_ALL, {
    params: { status: NUMBERMAP.ONE },
  })
  return response.data
}

export const getAllInfrastructureTypes = async (infrastructureCategoryId: number) => {
  const response = await apiClient.get(INFRASTRUCTURE_TYPE_API_ENDPOINTS.GET_ALL, {
    params: {
      [QUERY_PARAMS.INFRASTRUCTURE_CATEGORY_ID]: infrastructureCategoryId,
    },
  })
  return response.data
}

export const getAllSerialNumbers = async (infrastructureTypeId: number) => {
  const response = await apiClient.get(SERIAL_NUMBER_API_ENDPOINTS.GET_ALL, {
    params: {
      [QUERY_PARAMS.INFRASTRUCTURE_TYPE_ID]: infrastructureTypeId,
    },
  })
  return response.data
}

