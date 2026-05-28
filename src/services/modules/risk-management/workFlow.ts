"use client"
import { apiClient } from '@/shared/apiClient'
import { API_URLS } from '@/constants/common'
import { WorkflowActionData } from '@/types/common'

/**
 * Classification: Confidential
 */

// Risk Management workflow action service
export const riskManagementWorkflowAction = async (data: WorkflowActionData, method: 'POST' | 'PUT' = 'POST') => {
  const response = method === 'POST' 
    ? await apiClient.post(API_URLS.RISK_MANAGEMENT_ACTIONS.WORKFLOW_ACTION, data)
    : await apiClient.put(API_URLS.RISK_MANAGEMENT_ACTIONS.WORKFLOW_ACTION, data)
  return response.data
}
