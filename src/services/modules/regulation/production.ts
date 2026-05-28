import { PRODUCTION_API } from '@/constants/modules/regulation/production';
import { apiClient } from '@/shared/apiClient';

export const fetchProduction = async (id: number) => {
  const response = await apiClient.get(PRODUCTION_API.FETCH(id));
  return response.data;
};

export const saveProduction = async (payload: { organization_site_id: number; production_operations_description: string; meterial_handling_arrangement: string; reprocessing_rework_arrangement:string; rejected_materials_handling: string; process_validation_policy: string; sterilization_facility_description: string }) => {
  const response = await apiClient.post(PRODUCTION_API.SAVE, payload);
  return response.data;
}; 