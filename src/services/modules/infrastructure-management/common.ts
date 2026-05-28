/**
 * Infrastructure Management Common Services
 * Classification: Confidential
 */

import { apiClient } from '@/shared/apiClient'
import { API_ENDPOINTS } from '@/constants/modules/infrastructure-management/common'
import type {
  InfrastructureCategoryResponse,
  InfrastructureTypeResponse,
  InfrastructureSerialNumberResponse,
  MaintenancePlanResponse,
  InfrastructureTypeQueryParams,
  InfrastructureSerialNumberQueryParams,
} from '@/types/modules/infrastructure-management/common'
import { NUMBERMAP } from '@/constants/common'

/**
 * Fetch all infrastructure categories
 * @returns Promise<InfrastructureCategoryResponse>
 */
export const fetchAllInfrastructureCategories = async (
): Promise<InfrastructureCategoryResponse> => {
  const params = { status: NUMBERMAP.ONE }
  const response = await apiClient.get(API_ENDPOINTS.CATEGORY_ALL, { params })
  return response.data
}

/**
 * Fetch all infrastructure types
 * @param infrastructureCategoryId - Infrastructure category ID filter
 * @returns Promise<InfrastructureTypeResponse>
 */
export const fetchAllInfrastructureTypes = async (
  infrastructureCategoryId?: number
): Promise<InfrastructureTypeResponse> => {
  const params: InfrastructureTypeQueryParams = { status: NUMBERMAP.ONE }
  if (infrastructureCategoryId) {
    params.infrastructure_category_id = infrastructureCategoryId
  }
  const response = await apiClient.get(API_ENDPOINTS.TYPE_ALL, { params })
  return response.data
}

/**
 * Fetch all infrastructure serial numbers
 * @param infrastructureTypeId - Infrastructure type ID filter
 * @returns Promise<InfrastructureSerialNumberResponse>
 */
export const fetchAllInfrastructureSerialNumbers = async (
  infrastructureTypeId?: number,
): Promise<InfrastructureSerialNumberResponse> => {
  const params: InfrastructureSerialNumberQueryParams = { status: NUMBERMAP.ONE }
  if (infrastructureTypeId) {
    params.infrastructure_type_id = infrastructureTypeId
  }
  const response = await apiClient.get(API_ENDPOINTS.SERIAL_NUMBER_ALL, { params })
  return response.data
}

/**
 * Fetch all maintenance plans
 * @returns Promise<MaintenancePlanResponse>
 */
export const fetchAllMaintenancePlans = async (
): Promise<MaintenancePlanResponse> => {
  const params = { status: NUMBERMAP.ONE }
  const response = await apiClient.get(API_ENDPOINTS.MAINTENANCE_PLAN_ALL, { params })
  return response.data
}

