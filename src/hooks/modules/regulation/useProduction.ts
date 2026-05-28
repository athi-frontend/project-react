import { PRODUCTION_QUERY_KEY } from '@/constants/modules/regulation/production';
import { fetchProduction, saveProduction } from '@/services/modules/regulation/production';
import { useQuery, useMutation, useQueryClient, UseMutationResult } from '@tanstack/react-query';


export const useProduction = (id: number, enabled: boolean = false) => {
  return useQuery({
    queryKey: [PRODUCTION_QUERY_KEY, id],
    queryFn: () => fetchProduction(id),
    enabled: enabled && !!id,
  });
};

export interface ProductionPayload {
  organization_site_id: number;
  production_operations_description: string; 
  meterial_handling_arrangement: string; 
  reprocessing_rework_arrangement:string; 
  rejected_materials_handling: string; 
  process_validation_policy: string; 
  sterilization_facility_description: string
}

export const useSaveProduction = (
  id: number
): UseMutationResult<any, Error, ProductionPayload> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveProduction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRODUCTION_QUERY_KEY, id] });
    },
  });
}; 