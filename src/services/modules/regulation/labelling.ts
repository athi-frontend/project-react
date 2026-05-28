import { apiClient } from '@/shared/apiClient';
import { LABELLING_API_ENDPOINTS } from '@/constants/modules/regulation/labelling';

export const getRegulationLabelling = async (id: number | string) => {
  const response = await apiClient.get(LABELLING_API_ENDPOINTS.GET_LABELLING(id));
  return response.data;
};

export const upsertRegulationLabelling = async (payload: any) => {
  const response = await apiClient.post(LABELLING_API_ENDPOINTS.UPSERT_LABELLING, payload);
  return response.data;
}; 