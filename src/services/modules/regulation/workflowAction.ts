import { apiClient } from '@/shared/apiClient';
import { WORKFLOW_ACTION_API_ENDPOINTS } from '@/constants/modules/regulation/workflowAction';

export const postRegulationWorkflowAction = async (data: any) => {
  const response = await apiClient.post(WORKFLOW_ACTION_API_ENDPOINTS.POST, data);
  return response.data;
};

export const putRegulationWorkflowAction = async (data: any) => {
  const response = await apiClient.put(WORKFLOW_ACTION_API_ENDPOINTS.PUT, data);
  return response.data;
};
