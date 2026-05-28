import { apiClient } from '@/shared/apiClient';
import { DepartmentResponse, HealthCheckupResponse, Sites } from '@/types/modules/hr/healthTypes';
import { GET_DEPARTMENTS, HEALTH_CHECKUP_SERVICE, HEALTH_CHECKUP_SERVICE_BY_ID } from '@/constants/modules/hr/healthCheckup';

export const healthCheckupService = {
  getHealthCheckups: async (): Promise<{ data: HealthCheckupResponse[] }> => {
      const response = await apiClient.get(
        HEALTH_CHECKUP_SERVICE.ENDPOINTS.GET_HEALTH_CHECKUPS
      );
      return response.data;
  },

  getHealthCheckupById: async (id: string): Promise<{ data: HealthCheckupResponse[] }> => {
      const response = await apiClient.get(
        `${HEALTH_CHECKUP_SERVICE_BY_ID.ENDPOINTS.GET_HEALTH_CHECKUPS}/${id}`
      );
      return response.data;
  },
};



export const departmentService = {
  getDepartments: async (): Promise<{ data: DepartmentResponse[] }> => {
      const response = await apiClient.get(GET_DEPARTMENTS);
      return response.data;
  },
};

export const stiteSerive = {
   getSites: async (): Promise<{ data: Sites[] }> => {
      const response = await apiClient.get(HEALTH_CHECKUP_SERVICE.ENDPOINTS.GET_SITES); 
      return response.data;
  },
}