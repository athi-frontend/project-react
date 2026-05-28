"use client"
import { apiClient } from '@/shared/apiClient'
import { API_URLS } from '@/constants/common'
import { WorkflowActionData } from '@/types/common'
import { CONTEXT_TYPES, API_ENDPOINTS } from '@/constants/modules/user/userOnboard'

// Workflow action service
export const workflowAction = async (data: WorkflowActionData, method: 'POST' | 'PUT' = 'POST') => {
  // Use organization endpoint for user onboarding, HR endpoint for others
  const endpoint = data.context_type === CONTEXT_TYPES.USER_ONBOARDING 
    ? API_ENDPOINTS.WORKFLOW_ACTION
    : API_URLS.HR_ACTIONS.WORKFLOW_ACTION
    
  const response = method === 'POST' 
    ? await apiClient.post(endpoint, data)
    : await apiClient.put(endpoint, data)
  return response.data
}