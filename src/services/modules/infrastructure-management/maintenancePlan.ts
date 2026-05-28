import { API_ENDPOINTS } from "@/constants/modules/infrastructure-management/maintenancePlan"
import { apiClient } from "@/shared/apiClient"
import { MaintenancePlanPostPayload } from "@/types/modules/infrastructure-management/maintenancePlan"
/**
 * Classification : Confidential
 **/

export const getMaintenancePlanList = async () => {
  const response = await apiClient.get(API_ENDPOINTS.FETCH_MAINTENANCE_PLAN_LIST)
  return response.data
}

export const getMaintenancePlanById = async (maintenance_id: number) => {
  const response = await apiClient.get(API_ENDPOINTS.FETCH_MAINTENANCE_PLAN_BY_ID(maintenance_id))
  return response.data
}

export const postMaintenancePlan = async (payload: MaintenancePlanPostPayload) => {
  const response = await apiClient.post(API_ENDPOINTS.POST_MAINTENANCE_PLAN, payload)
  return response.data
}

export const fetchServiceTypes = async (status: number) => {
  const response = await apiClient.get(API_ENDPOINTS.FETCH_SERVICE_TYPES, { params: { status } })
  return response.data
}

export const fetchFrequency = async (status: number) => {
  const response = await apiClient.get(API_ENDPOINTS.FETCH_FREQUENCY, { params: { status } })
  return response.data
}

export const fetchInfrastructureCategory = async () => {
  const response = await apiClient.get(API_ENDPOINTS.FETCH_INFRASTRUCTURE_CATEGORY)
  return response.data
}

export const fetchInfrastructureType = async () => {
  const response = await apiClient.get(API_ENDPOINTS.FETCH_INFRASTRUCTURE_TYPE)
  return response.data
}

export const deleteMaintenancePlan = async (maintenance_id: number): Promise<void> => {
  await apiClient.delete(API_ENDPOINTS.DELETE_MAINTENANCE_PLAN(maintenance_id))
}
