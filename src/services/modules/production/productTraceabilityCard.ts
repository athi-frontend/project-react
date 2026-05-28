/**
 * Classification: Confidential
 */

import { API_ENDPOINTS } from '@/constants/modules/production/productTraceabilityCard'
import { apiClient } from '@/shared/apiClient'

// API for fetching product traceability card by project ID
export const getProductTraceabilityCardByProject = async (project_id: number) => {
  const response = await apiClient.get(API_ENDPOINTS.FETCH_BY_PROJECT(project_id))
  return response.data
}

// API for upserting (create/update) product traceability card
export const upsertProductTraceabilityCard = async (payload: any) => {
  const response = await apiClient.post(API_ENDPOINTS.UPSERT, payload)
  return response.data
}

// API for fetching process checklist groups
export const getProcessChecklistGroups = async (status?: number) => {
  const response = await apiClient.get(API_ENDPOINTS.PROCESS_CHECKLIST_GROUP_ALL, {
    params: status !== undefined ? { status } : {},
  })
  return response.data
}

// API for fetching process checklists
export const getProcessChecklists = async (status?: number) => {
  const response = await apiClient.get(API_ENDPOINTS.PROCESS_CHECKLIST_ALL, {
    params: status !== undefined ? { status } : {},
  })
  return response.data
}

