import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  fetchSanitySpecificationChecklistAll,
  getSanitySpecificationChecklistById,
  fetchSanitySpecificationByPurchaseOrderId,
  fetchSanitySpecificationGroupsAll,
  postSanitySpecificationChecklist,
  deleteSanitySpecificationChecklist,
} from '@/services/modules/quality-control-management/sanitySpecificationChecklist'
import { SanitySpecCreateRequest } from '@/types/modules/quality-control-management/sanitySpecificationChecklist'
import { QUERY_KEYS } from '@/constants/modules/quality-control-management/sanitySpecificationChecklist'

/**
 * Classification: Confidential
 */

// Fetch all Sanity Specification Checklists
export const useSanitySpecificationChecklistList = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.LIST],
    queryFn: () => fetchSanitySpecificationChecklistAll(),
  })
}

// Fetch Sanity Specification Checklist by ID
export const useSanitySpecificationById = (rawId: number | null) => {
  return useQuery({
    queryKey: [QUERY_KEYS.FETCH_BY_ID, rawId],
    queryFn: () => getSanitySpecificationChecklistById(rawId),
    enabled: !!rawId && !isNaN(rawId),
  })
}

// Fetch Sanity Specification Checklist by Purchase Order ID
export const useSanitySpecificationByPurchaseOrderId = (
  purchaseOrderId: number | null
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.FETCH_BY_PURCHASE_ORDER_ID, purchaseOrderId],
    queryFn: () => fetchSanitySpecificationByPurchaseOrderId(purchaseOrderId),
    enabled: !!purchaseOrderId,
  })
}

// Fetch all groups for Sanity Specification Checklist
export const useSanitySpecificationGroupsAll = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.FETCH_ALL_GROUPS],
    queryFn: () => fetchSanitySpecificationGroupsAll(),
  })
}

// Mutation hook for creating/updating Sanity Specification Checklist
export const useUpsertSanitySpecificationChecklist = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: SanitySpecCreateRequest) =>
      postSanitySpecificationChecklist(payload),
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LIST] })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.FETCH_BY_PURCHASE_ORDER_ID],
      })
      queryClient.invalidateQueries({queryKey : [QUERY_KEYS.FETCH_ALL_GROUPS]})
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FETCH_BY_ID] })
    },
  })
}

// Mutation hook for deleting Sanity Specification Checklist
export const useDeleteSanitySpecificationChecklist = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number | null) => deleteSanitySpecificationChecklist(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LIST] })
    },
  })
}
