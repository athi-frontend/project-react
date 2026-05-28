import { STORAGE_API } from '@/constants/modules/regulation/storage';
import { apiClient } from '@/shared/apiClient';

export const fetchStorage = async (id: number) => {
  const response = await apiClient.get(STORAGE_API.FETCH(id));
  return response.data;
};

export const saveStorage = async (payload: { organization_site_id: number; storage: string }) => {
  const response = await apiClient.post(STORAGE_API.SAVE, payload);
  return response.data;
}; 