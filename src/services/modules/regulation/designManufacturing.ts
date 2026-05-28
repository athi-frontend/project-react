import { apiClient } from '@/shared/apiClient';
import { DESIGN_MANUFACTURING_API } from '@/constants/modules/regulation/designManufacturing';

export const fetchDesignManufacturing = async (id: number | string) => {
  const response = await apiClient.get(DESIGN_MANUFACTURING_API.FETCH(id));
  return response.data;
};

export const upsertDesignManufacturing = async (payload: any) => {
  const response = await apiClient.post(DESIGN_MANUFACTURING_API.UPSERT, payload);
  return response.data;
}; 