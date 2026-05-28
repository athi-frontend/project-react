/**
 * Classification: Confidential
 * API service functions for Infrastructure Request module
 */

import { apiClient } from '@/shared/apiClient'
import { API_ENDPOINTS } from '@/constants/modules/infrastructure-management/infrastructureRequest'
import type {
  InfrastructureRequestDetailResponse,
  InfrastructureRequestListResponse,
  InfrastructureCategory,
  InfrastructureType,
  DropdownResponse,
} from '@/types/modules/infrastructure-management/infrastructureRequest'

export const fetchAllInfrastructureRequest = async (
): Promise<InfrastructureRequestListResponse> => {
  const response = await apiClient.get(API_ENDPOINTS.FETCH_ALL_INFRASTRUCTURE_REQUEST)
  return response.data
}

export const fetchInfrastructureRequestById = async (
  infrastructureRequestId: number,
  excludeDraftData: boolean = false
): Promise<InfrastructureRequestDetailResponse> => {
  const params: Record<string, any> = {
    draft_data: excludeDraftData
  }
  const response = await apiClient.get(
    API_ENDPOINTS.FETCH_BY_ID(infrastructureRequestId),
    { params }
  )
  return response.data
}

export const upsertInfrastructureRequest = async (payload: any) => {
  const response = await apiClient.post(
    API_ENDPOINTS.UPSERT_INFRASTRUCTURE_REQUEST,
    payload
  )
  return response.data
}

export const deleteInfrastructureRequest = async (infrastructureRequestId: number) => {
  const response = await apiClient.delete(
    API_ENDPOINTS.DELETE_INFRASTRUCTURE_REQUEST(infrastructureRequestId)
  )
  return response.data
}

// Dropdown service functions
export const fetchInfrastructureCategories = async (
  status?: number
): Promise<DropdownResponse<InfrastructureCategory>> => {
  const params: Record<string, number> = {}
  if (status !== undefined) {
    params.status = status
  }
  const response = await apiClient.get(API_ENDPOINTS.FETCH_INFRASTRUCTURE_CATEGORIES, {
    params,
  })
  return response.data
}

export const fetchInfrastructureTypes = async (
  infrastructureCategoryId?: number
): Promise<DropdownResponse<InfrastructureType>> => {
  const params: Record<string, number> = {}
  if (infrastructureCategoryId !== undefined) {
    params.infrastructure_category_id = infrastructureCategoryId
  }
  const response = await apiClient.get(API_ENDPOINTS.FETCH_INFRASTRUCTURE_TYPES, {
    params,
  })
  return response.data
}
