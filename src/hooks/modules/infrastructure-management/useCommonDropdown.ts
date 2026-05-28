/**
 * Infrastructure Management Common Hooks
 * Classification: Confidential
 */

import { useQuery } from '@tanstack/react-query'
import {
  fetchAllInfrastructureCategories,
  fetchAllInfrastructureTypes,
  fetchAllInfrastructureSerialNumbers,
  fetchAllMaintenancePlans,
} from '@/services/modules/infrastructure-management/common'
import { QUERY_KEYS } from '@/constants/modules/infrastructure-management/common'
import type {
  InfrastructureCategoryResponse,
  InfrastructureTypeResponse,
  InfrastructureSerialNumberResponse,
  MaintenancePlanResponse,
} from '@/types/modules/infrastructure-management/common'

/**
 * Hook to fetch all infrastructure categories
 * @param enabled - Whether the query should be enabled (default: true)
 * @returns React Query hook for infrastructure categories
 */
export const useInfrastructureCategories = (
  enabled: boolean = true
) => {
  return useQuery<InfrastructureCategoryResponse, Error>({
    queryKey: [QUERY_KEYS.INFRASTRUCTURE_CATEGORY],
    queryFn: () => fetchAllInfrastructureCategories(),
    enabled,
  })
}

/**
 * Hook to fetch all infrastructure types
 * @param infrastructureCategoryId - Infrastructure category ID filter
 * @param enabled - Whether the query should be enabled (default: true)
 * @returns React Query hook for infrastructure types
 */
export const useInfrastructureTypes = (
  infrastructureCategoryId?: number,
  enabled: boolean = true
) => {
  return useQuery<InfrastructureTypeResponse, Error>({
    queryKey: [
      QUERY_KEYS.INFRASTRUCTURE_TYPE,
      infrastructureCategoryId,
    ],
    queryFn: () => fetchAllInfrastructureTypes(infrastructureCategoryId),
    enabled: enabled && !!infrastructureCategoryId,
  })
}

/**
 * Hook to fetch all infrastructure serial numbers
 * @param infrastructureTypeId - Infrastructure type ID filter
 * @param enabled - Whether the query should be enabled (default: true)
 * @returns React Query hook for infrastructure serial numbers
 */
export const useInfrastructureSerialNumbers = (
  infrastructureTypeId?: number,
  enabled: boolean = true
) => {
  return useQuery<InfrastructureSerialNumberResponse, Error>({
    queryKey: [
      QUERY_KEYS.INFRASTRUCTURE_SERIAL_NUMBER,
      infrastructureTypeId,
    ],
    queryFn: () =>
      fetchAllInfrastructureSerialNumbers(infrastructureTypeId),
    enabled: enabled && !!infrastructureTypeId,
  })
}

/**
 * Hook to fetch all maintenance plans
 * @param enabled - Whether the query should be enabled (default: true)
 * @returns React Query hook for maintenance plans
 */
export const useMaintenancePlans = (
  enabled: boolean = true
) => {
  return useQuery<MaintenancePlanResponse, Error>({
    queryKey: [QUERY_KEYS.MAINTENANCE_PLAN ],
    queryFn: () => fetchAllMaintenancePlans(),
    enabled,
  })
}

