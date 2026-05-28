import { apiClient } from '@/shared/apiClient';
import { PERSONNEL_ENDPOINTS } from '@/constants/modules/regulation/personnel';
import { PersonnelPayload } from '@/types/modules/regulation/personnel';

export const fetchPersonnel = async (organizationSiteId: number) => {
    const url = PERSONNEL_ENDPOINTS.FETCH(organizationSiteId);
    const response = await apiClient.get(url);
    return response.data;
};

export const postPersonnel = async (data: PersonnelPayload) => {
    const response = await apiClient.post(PERSONNEL_ENDPOINTS.POST, data);
    return response.data;
}; 