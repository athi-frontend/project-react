import { apiClient } from '@/shared/apiClient';
import { EQUIPMENT_API_ENDPOINTS } from '@/constants/modules/regulation/equipment';

export const fetchEquipment = async (organizationSiteId: number) => {
    const endpoint = EQUIPMENT_API_ENDPOINTS.FETCH(organizationSiteId);
    const response = await apiClient.get(endpoint);
    return response.data;
};

export const createEquipment = async (data: any) => {
    const response = await apiClient.post(EQUIPMENT_API_ENDPOINTS.CREATE, data);
    return response.data;
}; 