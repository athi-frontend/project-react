import { SANITATION_API } from '@/constants/modules/regulation/sanitation';
import { apiClient } from '@/shared/apiClient';

export const fetchSanitation = async (id: number) => {
  const response = await apiClient.get(SANITATION_API.FETCH(id));
  return response.data;
};

export const saveSanitation = async (payload: { organization_site_id: number; sanitation: string }) => {
  const response = await apiClient.post(SANITATION_API.SAVE, payload);
  return response.data;
}; 