/**
 * Production Common Services
 * Classification: Confidential
 */

import { apiClient } from '@/shared/apiClient'
import { API_ENDPOINTS } from '@/constants/modules/production/common'
import type { JigsTypeResponse } from '@/types/modules/production/common'

/**
 * Fetch all jigs types
 * @returns Promise<JigsTypeResponse>
 */
export const fetchAllJigsTypes = async (status: number): Promise<JigsTypeResponse> => { 
  const response = await apiClient.get(API_ENDPOINTS.JIGS_TYPE_ALL, { params: { status } })
  return response.data
}

