/**
 * Classification : Confidential
 * 
 * Consolidated hooks for Infrastructure Onboarding
 * This file contains all hooks for:
 * - Grid: Infrastructure Onboarding List Page
 * - Tab 1: Infrastructure Onboarding (Infrastructure Request Form)
 * - Tab 2: Installation Report
 * - Tab 3: Infrastructure Qualification Checklist
 * - Tab 4: Maintenance Plan
 **/

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { showActionAlert } from '@/components/ui/alert-modal/ActionAlert'
import { STATUS, NUMBERMAP } from '@/constants/common'
import { COMMON_CONSTANTS } from '@/lib/utils/common'
import {
  getAllInfrastructureOnboarding,
  getInfrastructureOnboardingById,
  deleteInfrastructureOnboarding,
  fetchPowerSupply,
  fetchInfrastructureOnboardingById,
  saveInfrastructureOnboarding,
  fetchPurchaseOrders,
  fetchPurchaseOrderDetails,
  getInstallationReportById,
  getServiceTypes,
  upsertInstallationReport,
  fetchQualificationChecklistById,
  upsertQualificationChecklist,
  getMaintenancePlanList,
  getMaintenancePlanById,
  postMaintenancePlan,
  deleteMaintenancePlan,
  fetchServiceTypes,
  fetchFrequency,
  fetchInfrastructureCategory,
  fetchInfrastructureType,
  getInfrastructureOnboardingMaintenancePlanById,
  postInfrastructureOnboardingMaintenancePlan,
} from '@/services/modules/infrastructure-management/infrastructureOnboardingTabs'
import {
  PowerSupplyResponse,
  InfrastructureOnboardingResponse,
  InfrastructurePurchaseOrderDetailsResponse,
  InstallationReportUpsertPayload,
  QualificationChecklistResponse,
  UpsertQualificationChecklistPayload,
} from '@/types/modules/infrastructure-management/infrastructureOnboardingTabs'
import { PurchaseOrderListResponse } from '@/types/modules/quality-control-management/sanityCheckInspection'
import { MaintenancePlanPostPayload } from '@/types/modules/infrastructure-management/maintenancePlan'
import {
  INFRASTRUCTURE_ONBOARDING_QUERY_KEYS,
  FETCH_POWER_SUPPLY,
  FETCH_INFRASTRUCTURE_ONBOARDING_BY_ID,
  FETCH_PURCHASE_ORDERS,
  FETCH_PURCHASE_ORDER_DETAILS,
  INSTALLATION_REPORT_QUERY_KEYS,
  QUALIFICATION_CHECKLIST_QUERY_KEYS,
  MAINTENANCE_PLAN_QUERY_KEYS,
} from '@/constants/modules/infrastructure-management/infrastructureOnboardingTabs'

const { SUCCESS_ALERT, FAILED_ALERT } = COMMON_CONSTANTS

// ============================================================================
// GRID: INFRASTRUCTURE ONBOARDING LIST PAGE HOOKS
// ============================================================================

/**
 * Hook to get all infrastructure onboarding records for the grid/list page
 * @returns Query result with all infrastructure onboarding data
 */
export const useGetAllInfrastructureOnboarding = () => {
  return useQuery({
    queryKey: [INFRASTRUCTURE_ONBOARDING_QUERY_KEYS.LIST],
    queryFn: () => getAllInfrastructureOnboarding(),
  })
}

/**
 * Hook to get infrastructure onboarding by ID for the grid/list page
 * @param infrastructureId - The infrastructure ID
 * @param enabled - Whether the query should be enabled (default: true)
 * @returns Query result with infrastructure onboarding data
 */
export const useGetInfrastructureOnboardingById = (
  infrastructureId: number | null,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: [INFRASTRUCTURE_ONBOARDING_QUERY_KEYS.FETCH_BY_ID, infrastructureId],
    queryFn: () => getInfrastructureOnboardingById(infrastructureId),
    enabled: enabled && !!infrastructureId,
  })
}

/**
 * Hook to delete infrastructure onboarding record
 * @returns Mutation hook for infrastructure onboarding deletion
 */
export const useDeleteInfrastructureOnboarding = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (infrastructureId: number) => deleteInfrastructureOnboarding(infrastructureId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [INFRASTRUCTURE_ONBOARDING_QUERY_KEYS.LIST],
      })
      showActionAlert(STATUS.SUCCESS)
    },
    onError: () => {
      showActionAlert(STATUS.FAILED)
    },
  })
}

// ============================================================================
// TAB 1: INFRASTRUCTURE ONBOARDING (INFRASTRUCTURE REQUEST FORM) HOOKS
// ============================================================================

/**
 * Hook to fetch purchase orders for Tab 1
 * @returns Query result with purchase orders data
 */
export const usePurchaseOrders = () => {
  return useQuery<PurchaseOrderListResponse, Error>({
    queryKey: [FETCH_PURCHASE_ORDERS],
    queryFn: () => fetchPurchaseOrders(),
  })
}

/**
 * Hook to fetch power supply options for Tab 1
 * @param status - Optional status filter
 * @returns Query result with power supply data
 */
export const usePowerSupply = (status?: number) => {
  return useQuery<PowerSupplyResponse, Error>({
    queryKey: [FETCH_POWER_SUPPLY, status],
    queryFn: () => fetchPowerSupply(status),
  })
}

/**
 * Hook to fetch infrastructure onboarding by ID for Tab 1
 * @param infrastructureId - The infrastructure ID
 * @returns Query result with infrastructure onboarding data
 */
export const useInfrastructureOnboardingById = (infrastructureId: number | null) => {
  return useQuery<InfrastructureOnboardingResponse, Error>({
    queryKey: [FETCH_INFRASTRUCTURE_ONBOARDING_BY_ID, infrastructureId],
    queryFn: () => fetchInfrastructureOnboardingById(infrastructureId),
    enabled: !!infrastructureId && infrastructureId > NUMBERMAP.ZERO,
    placeholderData: undefined,
    // stops structural sharing (also prevents reusing nested old data)
    staleTime: NUMBERMAP.ZERO,
    gcTime: NUMBERMAP.ZERO,
  })
}

/**
 * Hook to save infrastructure onboarding for Tab 1
 * @returns Mutation hook for infrastructure onboarding save
 */
export const useSaveInfrastructureOnboarding = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (formData: FormData) => saveInfrastructureOnboarding(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FETCH_INFRASTRUCTURE_ONBOARDING_BY_ID] })
      queryClient.invalidateQueries({ queryKey: [INFRASTRUCTURE_ONBOARDING_QUERY_KEYS.LIST] })

      showActionAlert(STATUS.SUCCESS)
    },
    onError: () => {
      showActionAlert(STATUS.FAILED)
    },
  })
}

/**
 * Hook to fetch purchase order details for Tab 1
 * @param purchaseOrderId - The purchase order ID
 * @returns Query result with purchase order details data
 */
export const usePurchaseOrderDetails = (purchaseOrderId?: string | number) => {
  return useQuery<InfrastructurePurchaseOrderDetailsResponse, Error>({
    queryKey: [FETCH_PURCHASE_ORDER_DETAILS, purchaseOrderId],
    queryFn: () => {
      if (!purchaseOrderId) {
        throw new Error('Purchase Order ID is required')
      }
      return fetchPurchaseOrderDetails(purchaseOrderId)
    },
    enabled: !!purchaseOrderId
  })
}

// ============================================================================
// TAB 2: INSTALLATION REPORT HOOKS
// ============================================================================

/**
 * Hook to fetch installation report by infrastructure ID
 * @param infrastructureId - The infrastructure ID
 * @returns Query result with installation report data
 */
export const useGetInstallationReport = (infrastructureId: number | null) => {
  return useQuery({
    queryKey: [
      INSTALLATION_REPORT_QUERY_KEYS.INSTALLATION_REPORT_FETCH,
      infrastructureId,
    ],
    queryFn: () => getInstallationReportById(infrastructureId),
    enabled: !!infrastructureId,
  })
}

/**
 * Hook to fetch service types for installation report
 * @returns Query result with service types data
 */
export const useGetServiceTypes = () => {
  return useQuery({
    queryKey: [INSTALLATION_REPORT_QUERY_KEYS.SERVICE_TYPES],
    queryFn: getServiceTypes,
  })
}

/**
 * Hook to upsert (create or update) installation report
 * @returns Mutation hook for installation report upsert
 */
export const useUpsertInstallationReport = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: InstallationReportUpsertPayload) =>
      upsertInstallationReport(payload),
    onSuccess: (_, variables) => {
      const formData = variables.formData
      const infrastructureId = formData.get('infrastructure_id')
      if (infrastructureId) {
        queryClient.invalidateQueries({
          queryKey: [
            INSTALLATION_REPORT_QUERY_KEYS.INSTALLATION_REPORT_FETCH,
            Number(infrastructureId),
          ],
        })
      }
      showActionAlert(STATUS.SUCCESS)
    },
    onError: () => {
      showActionAlert(STATUS.FAILED)
    },
  })
}

// ============================================================================
// TAB 3: INFRASTRUCTURE QUALIFICATION CHECKLIST HOOKS
// ============================================================================

/**
 * Hook to fetch qualification checklist by infrastructure ID
 * @param infrastructureId - The infrastructure ID
 * @param enabled - Whether the query should be enabled (default: true)
 * @returns Query result with qualification checklist data
 */
export const useQualificationChecklistById = (
  infrastructureId: number | undefined,
  enabled: boolean = true
) => {
  return useQuery<QualificationChecklistResponse, Error>({
    queryKey: infrastructureId
      ? QUALIFICATION_CHECKLIST_QUERY_KEYS.QUALIFICATION_CHECKLIST_BY_ID(infrastructureId)
      : [QUALIFICATION_CHECKLIST_QUERY_KEYS.QUALIFICATION_CHECKLIST],
    queryFn: () => fetchQualificationChecklistById(infrastructureId),
    enabled: enabled && !!infrastructureId,
  })
}

/**
 * Hook to upsert (create or update) qualification checklist
 * @returns Mutation hook for qualification checklist upsert
 */
export const useUpsertQualificationChecklist = () => {
  const queryClient = useQueryClient()

  return useMutation<any, Error, UpsertQualificationChecklistPayload>({
    mutationFn: upsertQualificationChecklist,
    onSuccess: ( variables) => {
      // Invalidate and refetch qualification checklist queries
      queryClient.invalidateQueries({
        queryKey: QUALIFICATION_CHECKLIST_QUERY_KEYS.QUALIFICATION_CHECKLIST_BY_ID(
          variables.infrastructure_id
        ),
      })
      showActionAlert(SUCCESS_ALERT)  
    },
    onError: () => {
      showActionAlert(FAILED_ALERT)
    },
  })
}

// ============================================================================
// TAB 4: MAINTENANCE PLAN HOOKS
// ============================================================================

/**
 * Hook to fetch maintenance plan list
 * @returns Query result with maintenance plan list data
 */
export const useGetMaintenancePlanList = () => {
  return useQuery({
    queryKey: [MAINTENANCE_PLAN_QUERY_KEYS.FETCH_MAINTENANCE_PLAN_LIST_KEY],
    queryFn: () => getMaintenancePlanList(),
  })
}

/**
 * Hook to fetch maintenance plan by ID
 * @param maintenance_id - The maintenance plan ID
 * @returns Query result with maintenance plan data
 */
export const useGetMaintenancePlanById = (maintenance_id: number) => {
  return useQuery({
    queryKey: [MAINTENANCE_PLAN_QUERY_KEYS.FETCH_MAINTENANCE_PLAN_BY_ID_KEY, maintenance_id],
    queryFn: () => getMaintenancePlanById(maintenance_id),
    enabled: !!maintenance_id,
  })
}

/**
 * Hook to post (create or update) maintenance plan
 * @returns Mutation hook for maintenance plan post
 */
export const usePostMaintenancePlan = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [MAINTENANCE_PLAN_QUERY_KEYS.POST_MAINTENANCE_PLAN_KEY],
    mutationFn: postMaintenancePlan,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: [MAINTENANCE_PLAN_QUERY_KEYS.FETCH_MAINTENANCE_PLAN_LIST_KEY] })
      // Invalidate by ID if maintenance_id is present (for edit mode)
      if (variables?.maintenance_id) {
        queryClient.invalidateQueries({ queryKey: [MAINTENANCE_PLAN_QUERY_KEYS.FETCH_MAINTENANCE_PLAN_BY_ID_KEY, variables.maintenance_id] })
      }
    },
  })
}

/**
 * Hook to fetch service types for maintenance plan
 * @param status - Status filter (default: 1)
 * @returns Query result with service types data
 */
export const useServiceTypes = (status: number = NUMBERMAP.ONE) => {
  return useQuery({
    queryKey: [MAINTENANCE_PLAN_QUERY_KEYS.FETCH_SERVICE_TYPES_KEY, status],
    queryFn: () => fetchServiceTypes(status),
  })
}

/**
 * Hook to fetch frequency options
 * @param status - Status filter (default: 1)
 * @returns Query result with frequency data
 */
export const useFrequency = (status: number = NUMBERMAP.ONE) => {
  return useQuery({
    queryKey: [MAINTENANCE_PLAN_QUERY_KEYS.FETCH_FREQUENCY_KEY, status],
    queryFn: () => fetchFrequency(status),
  })
}

/**
 * Hook to fetch infrastructure categories
 * @returns Query result with infrastructure categories data
 */
export const useInfrastructureCategory = () => {
  return useQuery({
    queryKey: [MAINTENANCE_PLAN_QUERY_KEYS.FETCH_INFRASTRUCTURE_CATEGORY_KEY],
    queryFn: fetchInfrastructureCategory,
  })
}

/**
 * Hook to fetch infrastructure types
 * @returns Query result with infrastructure types data
 */
export const useInfrastructureType = () => {
  return useQuery({
    queryKey: [MAINTENANCE_PLAN_QUERY_KEYS.FETCH_INFRASTRUCTURE_TYPE_KEY],
    queryFn: fetchInfrastructureType,
  })
}

/**
 * Hook to delete maintenance plan
 * @returns Mutation hook for maintenance plan deletion
 */
export const useDeleteMaintenancePlan = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteMaintenancePlan,
    onSuccess: (data, maintenance_id) => {
      queryClient.invalidateQueries({
        queryKey: [MAINTENANCE_PLAN_QUERY_KEYS.FETCH_MAINTENANCE_PLAN_LIST_KEY],
      })
      // Invalidate the specific item query to ensure edit page shows updated data
      queryClient.invalidateQueries({
        queryKey: [MAINTENANCE_PLAN_QUERY_KEYS.FETCH_MAINTENANCE_PLAN_BY_ID_KEY, maintenance_id],
      })
    },
  })
}

/**
 * Hook to fetch infrastructure onboarding maintenance plan by infrastructure ID
 * @param infrastructure_id - The infrastructure ID
 * @param enabled - Whether the query should be enabled (default: true)
 * @returns Query result with maintenance plan data
 */
export const useGetInfrastructureOnboardingMaintenancePlanById = (
  infrastructure_id: number,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: [MAINTENANCE_PLAN_QUERY_KEYS.FETCH_INFRASTRUCTURE_ONBOARDING_MAINTENANCE_PLAN_BY_ID_KEY, infrastructure_id],
    queryFn: () => getInfrastructureOnboardingMaintenancePlanById(infrastructure_id),
    enabled: enabled && !!infrastructure_id,
  })
}

/**
 * Hook to post infrastructure onboarding maintenance plan
 * @returns Mutation hook for infrastructure onboarding maintenance plan post
 */
export const usePostInfrastructureOnboardingMaintenancePlan = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [MAINTENANCE_PLAN_QUERY_KEYS.POST_INFRASTRUCTURE_ONBOARDING_MAINTENANCE_PLAN_KEY],
    mutationFn: ({ infrastructure_id, payload }: { infrastructure_id: number; payload: MaintenancePlanPostPayload }) =>
      postInfrastructureOnboardingMaintenancePlan(infrastructure_id, payload),
    onSuccess: (data, variables) => {
      // Invalidate the maintenance plan by ID query
      queryClient.invalidateQueries({ 
        queryKey: [MAINTENANCE_PLAN_QUERY_KEYS.FETCH_INFRASTRUCTURE_ONBOARDING_MAINTENANCE_PLAN_BY_ID_KEY, variables.infrastructure_id] 
      })
      // Invalidate the grid list query to ensure latest data is shown
      queryClient.invalidateQueries({
        queryKey: [INFRASTRUCTURE_ONBOARDING_QUERY_KEYS.LIST],
      })
    },
  })
}

