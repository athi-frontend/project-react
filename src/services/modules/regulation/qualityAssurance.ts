import { QUALITY_ASSURANCE_API } from '@/constants/modules/regulation/qualityAssurance';
import { apiClient } from '@/shared/apiClient';

export const fetchQualityAssurance = async (id: number) => {
  const response = await apiClient.get(QUALITY_ASSURANCE_API.FETCH(id));
  return response.data;
};

export const saveQualityAssurance = async (payload: { organization_site_id: number; quality_assurance: string }) => {
  const response = await apiClient.post(QUALITY_ASSURANCE_API.SAVE, payload);
  return response.data;
}; 