import { apiClient } from '@/shared/apiClient';
import { DOCUMENTATION_API } from '@/constants/modules/regulation/documentation';

export const fetchDocumentation = async (id: number) => {
  const response = await apiClient.get(DOCUMENTATION_API.FETCH(id));
  return response.data;
};

export const saveDocumentation = async (payload: { organization_site_id: number; documentation: string }) => {
  const response = await apiClient.post(DOCUMENTATION_API.SAVE, payload);
  return response.data;
}; 