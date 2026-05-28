/**
 * Classification: Confidential
 * Stubbed service for Sanity Specification Checklist list
 */

import { NUMBERMAP } from '@/constants/common'
import { API_ENDPOINTS } from '@/constants/modules/quality-control-management/sanitySpecificationChecklist'
import { apiClient } from '@/shared/apiClient'
import { SanitySpecCreateRequest } from '@/types/modules/quality-control-management/sanitySpecificationChecklist'

// Fetch all Sanity Specification Checklists
export const fetchSanitySpecificationChecklistAll = async () => {
  const response = await apiClient.get(API_ENDPOINTS.FETCH_ALL)
  return response.data
}

// Fetch Sanity Specification Checklist by purchase order ID
export const fetchSanitySpecificationByPurchaseOrderId = async (
  purchaseOrderId: number | string
) => {
  const response = await apiClient.get(
    API_ENDPOINTS.FETCH_BY_PURCHASE_ORDER_ID(purchaseOrderId)
  )
  return response.data
}

// Fetch all groups for Sanity Specification Checklist
export const fetchSanitySpecificationGroupsAll = async () => {
  const response = await apiClient.get(API_ENDPOINTS.FETCH_ALL_GROUPS, {
    params: { status: NUMBERMAP.ONE },
  })
  return response.data
}

// Stubbed POST for creating Sanity Specification Checklist
// Request types (match API expectation: id fields as strings, is_new_group as 'true' | 'false')
// Types are now imported from @/types/modules/qc/sanitySpecificationChecklist

export const postSanitySpecificationChecklist = async (
  payload: SanitySpecCreateRequest
) => {
  const response = await apiClient.post(API_ENDPOINTS.CREATE, payload)
  return response.data
}

// Fetch single Sanity Specification Checklist by id
export const getSanitySpecificationChecklistById = async (
  id: number | null
) => {
  const response = await apiClient.get(API_ENDPOINTS.FETCH_BY_ID(id))
  return response.data.data
}

export const deleteSanitySpecificationChecklist = async (id: number | null) => {
  const response = await apiClient.delete(API_ENDPOINTS.DELETE(id))
  return response.data
}
