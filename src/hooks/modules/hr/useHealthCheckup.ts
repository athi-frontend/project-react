import { useQuery } from '@tanstack/react-query';
import { healthCheckupService, departmentService } from '@/services/modules/hr/healthCheckup';
import { DEPARTMENTS, RESPONSE_KEYS } from '@/constants/modules/hr/healthCheckup';
import { DepartmentResponse } from '@/types/modules/hr/healthTypes';

const { HEALTH_CHECKUP } = RESPONSE_KEYS;

export const useHealthCheckupData = () => {
  return useQuery({
    queryKey: [HEALTH_CHECKUP],
    queryFn: () => healthCheckupService.getHealthCheckups(),
  });
};

export const useHealthCheckupDataById = (id?: string) => {
  return useQuery({
    queryKey: [HEALTH_CHECKUP, id],
    queryFn: () =>
      id
        ? healthCheckupService.getHealthCheckupById(id)
        : healthCheckupService.getHealthCheckups(),
    enabled: !!id, 
  });
};

export const useDepartmentData = () => {
  return useQuery<{ data: DepartmentResponse[] }, Error>({
    queryKey: [DEPARTMENTS],
    queryFn: () => departmentService.getDepartments(),
  });
};