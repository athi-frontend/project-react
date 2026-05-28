/**
 * Classification : Confidential
 * 
 * Consolidated services for Infrastructure Onboarding
 * This file contains all services for:
 * - Grid: Infrastructure Onboarding List Page
 * - Tab 1: Infrastructure Onboarding (Infrastructure Request Form)
 * - Tab 2: Installation Report
 * - Tab 3: Infrastructure Qualification Checklist
 * - Tab 4: Maintenance Plan
 **/

import { apiClient } from '@/shared/apiClient'
import { NUMBERMAP } from '@/constants/common'
import { PurchaseOrderListResponse } from "@/types/modules/quality-control-management/sanityCheckInspection"
import {
  PowerSupplyResponse,
  InfrastructureOnboardingResponse,
  InfrastructurePurchaseOrderDetailsResponse,
  QualificationChecklistResponse,
  UpsertQualificationChecklistPayload,
  InstallationReportResponse,
  ServiceType,
  InstallationReportUpsertPayload,
} from '@/types/modules/infrastructure-management/infrastructureOnboardingTabs'
import { MaintenancePlanPostPayload } from '@/types/modules/infrastructure-management/maintenancePlan'
import {
  INSTALLATION_REPORT_API_ENDPOINTS,
  QUALIFICATION_CHECKLIST_API_ENDPOINTS,
  MAINTENANCE_PLAN_API_ENDPOINTS,
  INFRASTRUCTURE_ONBOARDING_MAINTENANCE_PLAN_API_ENDPOINTS,
  API_ENDPOINTS,
  INFRASTRUCTURE_ONBOARDING_API_ENDPOINTS,
} from '@/constants/modules/infrastructure-management/infrastructureOnboardingTabs'

// ============================================================================
// GRID: INFRASTRUCTURE ONBOARDING LIST PAGE SERVICES
// ============================================================================

/**
 * Get all infrastructure onboarding records for the grid/list page
 * @returns Promise with all infrastructure onboarding data
 */
export const getAllInfrastructureOnboarding = async () => {
  const response = await apiClient.get(INFRASTRUCTURE_ONBOARDING_API_ENDPOINTS.GET_ALL)
  return response.data
}

/**
 * Get infrastructure onboarding by ID for the grid/list page
 * @param infrastructureId - The infrastructure ID
 * @returns Promise with infrastructure onboarding data
 */
export const getInfrastructureOnboardingById = async (infrastructureId: number) => {
  const url = INFRASTRUCTURE_ONBOARDING_API_ENDPOINTS.GET_BY_ID(infrastructureId)
  const response = await apiClient.get(url)
  return response.data
}

/**
 * Delete infrastructure onboarding record
 * @param infrastructureId - The infrastructure ID to delete
 * @returns Promise with response data
 */
export const deleteInfrastructureOnboarding = async (infrastructureId: number) => {
  const url = INFRASTRUCTURE_ONBOARDING_API_ENDPOINTS.DELETE(infrastructureId)
  const response = await apiClient.delete(url)
  return response.data
}

// ============================================================================
// TAB 1: INFRASTRUCTURE ONBOARDING (INFRASTRUCTURE REQUEST FORM) SERVICES
// ============================================================================

/**
 * Fetch power supply options for Tab 1
 * @param status - Optional status filter
 * @returns Promise<PowerSupplyResponse>
 */
export const fetchPowerSupply = async (status?: number): Promise<PowerSupplyResponse> => {
  const response = await apiClient.get(API_ENDPOINTS.FETCH_POWER_SUPPLY(status))
  return response.data
}

/**
 * Fetch infrastructure onboarding by ID for Tab 1
 * @param infrastructureId - The infrastructure ID
 * @returns Promise<InfrastructureOnboardingResponse>
 */
export const fetchInfrastructureOnboardingById = async (
  infrastructureId: number
): Promise<InfrastructureOnboardingResponse> => {
  const response = await apiClient.get(API_ENDPOINTS.FETCH_INFRASTRUCTURE_ONBOARDING_BY_ID(infrastructureId))
  return response.data
}

/**
 * Save infrastructure onboarding for Tab 1
 * @param formData - FormData containing infrastructure onboarding data
 * @returns Promise with response data
 */
export const saveInfrastructureOnboarding = async (formData: FormData) => {
  const response = await apiClient.post(API_ENDPOINTS.SAVE_INFRASTRUCTURE_ONBOARDING(), formData)
  return response.data
}

/**
 * Fetch purchase order details for Tab 1
 * @param purchaseOrderId - The purchase order ID
 * @returns Promise<InfrastructurePurchaseOrderDetailsResponse>
 */
export const fetchPurchaseOrderDetails = async (purchaseOrderId: string | number): Promise<InfrastructurePurchaseOrderDetailsResponse> => {
  const url = API_ENDPOINTS.FETCH_PURCHASE_ORDER_DETAILS(purchaseOrderId);
  const response = await apiClient.get(url);
  return response.data
}

/**
 * Fetch purchase orders list for Tab 1
 * @returns Promise<PurchaseOrderListResponse>
 */
export const fetchPurchaseOrders = async (): Promise<PurchaseOrderListResponse> => {
  const response = await apiClient.get(API_ENDPOINTS.FETCH_PURCHASE_ORDERS(), {
    params: {
      status: NUMBERMAP.ONE,
    },
  })
  return response.data
}

// ============================================================================
// TAB 2: INSTALLATION REPORT SERVICES
// ============================================================================

/**
 * Get installation report by infrastructure ID
 * @param infrastructureId - The infrastructure ID
 * @returns Promise with installation report data
 */
export const getInstallationReportById = async (
  infrastructureId: number
): Promise<{ data: InstallationReportResponse[] }> => {
  const response = await apiClient.get(
    INSTALLATION_REPORT_API_ENDPOINTS.FETCH_BY_ID(infrastructureId)
  )
  return response.data
}

/**
 * Get service types for installation report
 * @returns Promise with service types data
 */
export const getServiceTypes = async (): Promise<{ data: ServiceType[] }> => {
  const response = await apiClient.get(
    INSTALLATION_REPORT_API_ENDPOINTS.GET_SERVICE_TYPES
  )
  return response.data
}

/**
 * Upsert (create or update) installation report
 * @param payload - The installation report payload with FormData
 * @returns Promise with response data
 */
export const upsertInstallationReport = async (
  payload: InstallationReportUpsertPayload
): Promise<{ data: any }> => {
  const response = await apiClient.post(
    INSTALLATION_REPORT_API_ENDPOINTS.UPSERT,
    payload.formData
  )
  return response.data
}

// ============================================================================
// TAB 3: INFRASTRUCTURE QUALIFICATION CHECKLIST SERVICES
// ============================================================================

/**
 * Fetch qualification checklist by infrastructure ID
 * @param infrastructureId - The infrastructure ID
 * @returns Promise<QualificationChecklistResponse>
 */
export const fetchQualificationChecklistById = async (
  infrastructureId: number
): Promise<QualificationChecklistResponse> => {
  const response = await apiClient.get(
    QUALIFICATION_CHECKLIST_API_ENDPOINTS.FETCH_BY_ID(infrastructureId)
  )
  return response.data
}

/**
 * Upsert (create or update) qualification checklist
 * @param payload - The qualification checklist payload
 * @returns Promise<any>
 */
export const upsertQualificationChecklist = async (
  payload: UpsertQualificationChecklistPayload
): Promise<any> => {
  const response = await apiClient.post(
    QUALIFICATION_CHECKLIST_API_ENDPOINTS.UPSERT,
    payload
  )
  return response.data
}

// ============================================================================
// TAB 4: MAINTENANCE PLAN SERVICES
// ============================================================================

/**
 * Get maintenance plan list
 * @returns Promise with maintenance plan list data
 */
export const getMaintenancePlanList = async () => {
  const response = await apiClient.get(MAINTENANCE_PLAN_API_ENDPOINTS.FETCH_MAINTENANCE_PLAN_LIST)
  return response.data
}

/**
 * Get maintenance plan by ID
 * @param maintenance_id - The maintenance plan ID
 * @returns Promise with maintenance plan data
 */
export const getMaintenancePlanById = async (maintenance_id: number) => {
  const response = await apiClient.get(MAINTENANCE_PLAN_API_ENDPOINTS.FETCH_MAINTENANCE_PLAN_BY_ID(maintenance_id))
  return response.data
}

/**
 * Post (create or update) maintenance plan
 * @param payload - The maintenance plan payload
 * @returns Promise with response data
 */
export const postMaintenancePlan = async (payload: MaintenancePlanPostPayload) => {
  const response = await apiClient.post(MAINTENANCE_PLAN_API_ENDPOINTS.POST_MAINTENANCE_PLAN, payload)
  return response.data
}

/**
 * Fetch service types for maintenance plan
 * @param status - Status filter
 * @returns Promise with service types data
 */
export const fetchServiceTypes = async (status: number) => {
  const response = await apiClient.get(MAINTENANCE_PLAN_API_ENDPOINTS.FETCH_SERVICE_TYPES, { params: { status } })
  return response.data
}

/**
 * Fetch frequency options
 * @param status - Status filter
 * @returns Promise with frequency data
 */
export const fetchFrequency = async (status: number) => {
  const response = await apiClient.get(MAINTENANCE_PLAN_API_ENDPOINTS.FETCH_FREQUENCY, { params: { status } })
  return response.data
}

/**
 * Fetch infrastructure categories
 * @returns Promise with infrastructure categories data
 */
export const fetchInfrastructureCategory = async () => {
  const response = await apiClient.get(MAINTENANCE_PLAN_API_ENDPOINTS.FETCH_INFRASTRUCTURE_CATEGORY)
  return response.data
}

/**
 * Fetch infrastructure types
 * @returns Promise with infrastructure types data
 */
export const fetchInfrastructureType = async () => {
  const response = await apiClient.get(MAINTENANCE_PLAN_API_ENDPOINTS.FETCH_INFRASTRUCTURE_TYPE)
  return response.data
}

/**
 * Delete maintenance plan
 * @param maintenance_id - The maintenance plan ID to delete
 * @returns Promise<void>
 */
export const deleteMaintenancePlan = async (maintenance_id: number): Promise<void> => {
  await apiClient.delete(MAINTENANCE_PLAN_API_ENDPOINTS.DELETE_MAINTENANCE_PLAN(maintenance_id))
}

/**
 * Get infrastructure onboarding maintenance plan by infrastructure ID
 * @param infrastructure_id - The infrastructure ID
 * @returns Promise with maintenance plan data
 */
export const getInfrastructureOnboardingMaintenancePlanById = async (infrastructure_id: number) => {
  const response = await apiClient.get(INFRASTRUCTURE_ONBOARDING_MAINTENANCE_PLAN_API_ENDPOINTS.FETCH_MAINTENANCE_PLAN_BY_ID(infrastructure_id))
  return response.data
}

/**
 * Post infrastructure onboarding maintenance plan
 * @param infrastructure_id - The infrastructure ID
 * @param payload - The maintenance plan payload
 * @returns Promise with response data
 */
export const postInfrastructureOnboardingMaintenancePlan = async (infrastructure_id: number, payload: MaintenancePlanPostPayload) => {
  const response = await apiClient.post(INFRASTRUCTURE_ONBOARDING_MAINTENANCE_PLAN_API_ENDPOINTS.POST_MAINTENANCE_PLAN(), payload)
  return response.data
}



