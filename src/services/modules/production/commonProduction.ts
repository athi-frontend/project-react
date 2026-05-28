/**
 * Classification: Confidential
 * Production Module Common Services
 */

import { apiClient } from '@/shared/apiClient'
import { API_ENDPOINTS } from '@/constants/modules/production/common'

export interface Unit {
  id: number
  unit_name: string
  status: number
  created_at?: string
  updated_at?: string
}

export interface UnitResponse {
  data: Unit[]
  total?: number
  page?: number
  limit?: number
}

/**
 * Fetch all units with optional status filter
 * @param status - Optional status filter (1 for active, 0 for inactive)
 * @returns Promise<UnitResponse>
 */
export const fetchAllUnits = async (status?: number): Promise<UnitResponse> => {
  const params = status !== undefined ? { status } : {}
  const response = await apiClient.get(API_ENDPOINTS.UNIT_ALL, { params })
  return response.data
}

