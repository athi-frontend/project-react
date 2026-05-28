import { useQuery, useMutation, useQueryClient, UseMutationResult } from '@tanstack/react-query';
import { fetchContractActivities, saveContractActivities } from '@/services/modules/regulation/contractActivities';
import { CONTRACT_ACTIVITIES_QUERY_KEY } from '@/constants/modules/regulation/contractActivities';
import { ContractActivitiesApiResponse } from '@/types/modules/regulation/contractActivities';

export const useContractActivities = (id: number, enabled: boolean = false) => {
  return useQuery<ContractActivitiesApiResponse, Error>({
    queryKey: [CONTRACT_ACTIVITIES_QUERY_KEY, id],
    queryFn: () => fetchContractActivities(id),
    enabled: enabled && !!id,
  });
};

export interface ContractActivitiesPayload {
  organization_site_id: number;
  contract_activities: string;
}

export const useSaveContractActivities = (
  id: number
): UseMutationResult<any, Error, ContractActivitiesPayload> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveContractActivities,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CONTRACT_ACTIVITIES_QUERY_KEY, id] });
    },
  });
}; 