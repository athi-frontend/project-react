import { apiClient } from '@/shared/apiClient';
import { CONTRACT_ACTIVITIES_API } from '@/constants/modules/regulation/contractActivities';

export const fetchContractActivities = async (id: number) => {
  const response = await apiClient.get(CONTRACT_ACTIVITIES_API.FETCH(id));
  return response.data;
};

export const saveContractActivities = async (payload: { organization_site_id: number; contract_activities: string }) => {
  const response = await apiClient.post(CONTRACT_ACTIVITIES_API.SAVE, payload);
  return response.data;
}; 