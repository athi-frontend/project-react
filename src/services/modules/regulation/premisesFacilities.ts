import { apiClient } from '@/shared/apiClient';
import { PremisesFacilitiesData, PremisesFacilitiesApiResponse } from '@/types/modules/regulation/premisesFacilities';
import { PREMISES_FACILITIES_API_ENDPOINTS } from '@/constants/modules/regulation/premisesFacilities';

export const fetchPremisesFacilities = async (id: number | string): Promise<PremisesFacilitiesApiResponse> => {
  const response = await apiClient.get(PREMISES_FACILITIES_API_ENDPOINTS.FETCH(id));
  return response.data;
};

export const upsertPremisesFacilities = async (payload: PremisesFacilitiesData): Promise<any> => {
  const response = await apiClient.post(PREMISES_FACILITIES_API_ENDPOINTS.UPSERT, payload);
  return response.data;
}; 