import { apiClient } from '@/shared/apiClient';
import { WORKFLOW_ACTION_API_ENDPOINTS } from '@/constants/modules/vendor-management/workflowAction';

export const postVendorWorkflowAction = async (data: any) => {
  const response = await apiClient.post(WORKFLOW_ACTION_API_ENDPOINTS.POST, data);
  return response.data;
};

export const putVendorWorkflowAction = async (data: any) => {
  const response = await apiClient.put(WORKFLOW_ACTION_API_ENDPOINTS.PUT, data);
  return response.data;
};

