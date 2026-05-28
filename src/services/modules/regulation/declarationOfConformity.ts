import { apiClient } from '@/shared/apiClient';
import { CONFORMITY_API_ENDPOINTS, DeclarationConformityPayload } from '@/constants/modules/regulation/declarationOfConformity';

export const getRegulationConformity = async (id: number | string) => {
  const response = await apiClient.get(CONFORMITY_API_ENDPOINTS.GET_CONFORMITY(id));
  return response.data;
};

export const upsertRegulationConformity = async (payload: DeclarationConformityPayload) => {
  const response = await apiClient.post(CONFORMITY_API_ENDPOINTS.UPSERT_CONFORMITY, payload);
  return response.data;
}; 