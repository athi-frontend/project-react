import {
  getAllFormTeam,
  getFormTeamById,
  postFormTeam,
  deleteFormTeam,
  getPurchaseOrders,
  getPartCategories,
} from '@/services/modules/quality-control-management/formTeam'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants/modules/quality-control-management/formTeam'

/**
 * Classification: Confidential
 */

/**
 * Function Name: useGetAllFormTeam
 * Description: Hook for fetching all form team data
 */
export const useGetAllFormTeam = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.FORM_TEAM_LIST],
    queryFn: getAllFormTeam,
  })
}

/**
 * Function Name: useGetFormTeamById
 * Params: purchase_order_id
 * Description: Hook for fetching form team data by purchase order ID
 */
export const useGetFormTeamById = (purchase_order_id: number | null) => {
  return useQuery({
    queryKey: [QUERY_KEYS.FORM_TEAM_DETAIL, purchase_order_id],
    queryFn: () => getFormTeamById(purchase_order_id),
    enabled: !!purchase_order_id,
  })
}

/**
 * Function Name: usePostFormTeam
 * Description: Hook for creating/updating form team data with cache invalidation
 */
export const usePostFormTeam = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: postFormTeam,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.FORM_TEAM_LIST],
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.FORM_TEAM_DETAIL],
      })
    },
  })
}

/**
 * Function Name: useDeleteFormTeam
 * Description: Hook for deleting form team data with cache invalidation
 */
export const useDeleteFormTeam = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteFormTeam,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.FORM_TEAM_LIST],
      })
    },
  })
}

/**
 * Function Name: useGetPurchaseOrders
 * Params: status (optional)
 * Description: Hook for fetching purchase orders with status filter
 */
export const useGetPurchaseOrders = (status?: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PURCHASE_ORDERS, status],
    queryFn: () => getPurchaseOrders(status),
  })
}

/**
 * Function Name: useGetPartCategories
 * Params: purchase_order_id
 * Description: Hook for fetching part categories by purchase order ID
 */
export const useGetPartCategories = (purchase_order_id: number | null) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PART_CATEGORIES, purchase_order_id],
    queryFn: () => getPartCategories(purchase_order_id),
    enabled: !!purchase_order_id,
  })
}


