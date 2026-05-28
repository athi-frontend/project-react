import { apiClient } from '@/shared/apiClient';
import { UAT_VALIDATION_SERVICES } from '@/constants/modules/dnd/uatValidation';

export const fetchUATValidationData = async (projectId: number) => {
  const response = await apiClient.get(`${UAT_VALIDATION_SERVICES.ENDPOINTS.FETCH_UAT}${projectId}`);
  return response.data;
};

export const postUATValidationData = async (formData: FormData) => {
  const response = await apiClient.post(`${UAT_VALIDATION_SERVICES.ENDPOINTS.POST_UAT}`, formData);
  return response.data;
};