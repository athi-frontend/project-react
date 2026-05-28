/**
 * Classification: Confidential
 */

"use client"
import { apiClient } from '@/shared/apiClient'
import { WorkflowActionData } from '@/types/common'
import { getWorkflowActionEndpoints } from '@/constants/workflowCommonConstant'

/**
 * Generic workflow action service
 * @param data - Workflow action data
 * @param module - Module name (e.g., 'sales', 'risk', 'hr')
 * @param method - HTTP method ('POST' or 'PUT')
 * @returns Response data
 */
export const workflowAction = async (
  data: WorkflowActionData, 
  module: string = 'sales',
  method: 'POST' | 'PUT' = 'POST'
) => {
  const endpoints = getWorkflowActionEndpoints(module)
  const endpoint = method === 'POST' ? endpoints.POST : endpoints.PUT
    
  const response = method === 'POST'
    ? await apiClient.post(endpoint, data)
    : await apiClient.put(endpoint, data)
  return response.data
}

 
