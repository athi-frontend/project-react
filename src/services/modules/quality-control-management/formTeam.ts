import { API_ENDPOINTS } from '@/constants/modules/quality-control-management/formTeam'
import { apiClient } from '@/shared/apiClient'
import {
  FormTeamResponse,
  FormTeamDetailResponse,
  FormTeamRequest,
  PurchaseOrderResponse,
  PartCategoryResponse,
} from '@/types/modules/quality-control-management/formTeam'

/**
 * Classification: Confidential
 */

/**
 * Function Name: getAllFormTeam
 * Description: API for fetching all form team data
 */
export const getAllFormTeam = async (): Promise<FormTeamResponse> => {
  const response = await apiClient.get(API_ENDPOINTS.GET_FORM_TEAM_ALL)
  return response.data
}

/**
 * Function Name: getFormTeamById
 * Params: purchase_order_id
 * Description: API for fetching form team by purchase order ID
 */
export const getFormTeamById = async (
  purchase_order_id: number
): Promise<FormTeamDetailResponse> => {
  const response = await apiClient.get(API_ENDPOINTS.GET_FORM_TEAM_BY_ID(purchase_order_id))
  return response.data
}

/**
 * Function Name: postFormTeam
 * Params: data
 * Description: API for creating/updating form team data
 */
export const postFormTeam = async (
  data: FormTeamRequest
): Promise<void> => {
  await apiClient.post(API_ENDPOINTS.POST_FORM_TEAM, data)
}

/**
 * Function Name: deleteFormTeam
 * Params: team_id
 * Description: API for deleting form team data by ID
 */
export const deleteFormTeam = async (team_id: number): Promise<void> => {
  await apiClient.delete(API_ENDPOINTS.DELETE_FORM_TEAM(team_id))
}

/**
 * Function Name: getPurchaseOrders
 * Params: status (optional)
 * Description: API for fetching purchase orders with status filter
 */
export const getPurchaseOrders = async (
  status?: number
): Promise<PurchaseOrderResponse> => {
  const params: { status?: number } = {}
  if (status !== undefined) {
    params.status = status
  }
  const response = await apiClient.get(API_ENDPOINTS.GET_PURCHASE_ORDERS, {
    params,
  })
  return response.data
}

/**
 * Function Name: getPartCategories
 * Params: purchase_order_id
 * Description: API for fetching part categories by purchase order ID
 */
export const getPartCategories = async (
  purchase_order_id: number
): Promise<PartCategoryResponse> => {
  const response = await apiClient.get(
    API_ENDPOINTS.GET_PART_CATEGORIES(purchase_order_id)
  )
  return response.data
}


