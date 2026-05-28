/**
 * Classification: Confidential
 * Hooks for Infrastructure Request module
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchAllInfrastructureRequest,
  fetchInfrastructureRequestById,
  upsertInfrastructureRequest,
  deleteInfrastructureRequest,
  fetchInfrastructureCategories,
  fetchInfrastructureTypes,
} from '@/services/modules/infrastructure-management/infrastructureRequest'
import { QUERY_KEYS } from '@/constants/modules/infrastructure-management/infrastructureRequest'
import { NUMBERMAP } from '@/constants/common'

export const useAllInfrastructureRequest = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.ALL_INFRASTRUCTURE_REQUEST],
    queryFn: () => fetchAllInfrastructureRequest(),
  })
}

export const useInfrastructureRequestById = (
  infrastructureRequestId: number,
  excludeDraftData: boolean = false
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.INFRASTRUCTURE_REQUEST_BY_ID, infrastructureRequestId, excludeDraftData],
    queryFn: () => fetchInfrastructureRequestById(infrastructureRequestId, excludeDraftData),
    enabled: !!infrastructureRequestId,
    refetchOnMount: 'always',
    placeholderData: undefined,
        // stops structural sharing (also prevents reusing nested old data)
    staleTime: NUMBERMAP.ZERO,
    gcTime: NUMBERMAP.ZERO,
  })
}

export const useUpsertInfrastructureRequest = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ payload, infrastructureRequestId }: { payload; infrastructureRequestId?: number | null }) => 
      upsertInfrastructureRequest(payload),
    onSuccess: (data, variables) => {
      // Invalidate list query to refresh the grid
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ALL_INFRASTRUCTURE_REQUEST],
      })
      // Invalidate the specific infrastructure request by ID query if provided
      // This ensures that when user refreshes on fetch by id page, the changes show immediately
      if (variables.infrastructureRequestId) {
        queryClient.invalidateQueries({
          queryKey: [
            QUERY_KEYS.INFRASTRUCTURE_REQUEST_BY_ID,
            variables.infrastructureRequestId,
          ],
        })
      }
    },
  })
}

export const useDeleteInfrastructureRequest = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (infrastructureRequestId: number) =>
      deleteInfrastructureRequest(infrastructureRequestId),
    onSuccess: (data, infrastructureRequestId) => {
      // Invalidate list query to refresh the grid
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.ALL_INFRASTRUCTURE_REQUEST],
      })
      // Invalidate the specific infrastructure request by ID query
      // This ensures that when user refreshes on fetch by id page, the changes show immediately
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.INFRASTRUCTURE_REQUEST_BY_ID, infrastructureRequestId],
      })
    },
  })
}

// Dropdown hooks
export const useInfrastructureCategories = (status?: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.INFRASTRUCTURE_CATEGORIES, status],
    queryFn: () => fetchInfrastructureCategories(status),
  })
}

export const useInfrastructureTypes = (
  infrastructureCategoryId?: number,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.INFRASTRUCTURE_TYPES, infrastructureCategoryId],
    queryFn: () => fetchInfrastructureTypes(infrastructureCategoryId),
    enabled: enabled && !!infrastructureCategoryId,
  })
}
