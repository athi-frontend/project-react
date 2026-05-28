import { useQuery, useMutation, useQueryClient, UseMutationResult } from '@tanstack/react-query';
import { fetchPremisesFacilities, upsertPremisesFacilities } from '@/services/modules/regulation/premisesFacilities';
import { PREMISES_FACILITIES_QUERY_KEYS } from '@/constants/modules/regulation/premisesFacilities';
import { PremisesFacilitiesData, PremisesFacilitiesApiResponse } from '@/types/modules/regulation/premisesFacilities';

export const usePremisesFacilities = (id: number, enabled: boolean = false) => {
  return useQuery<PremisesFacilitiesApiResponse, Error>({
    queryKey: PREMISES_FACILITIES_QUERY_KEYS.FETCH(id),
    queryFn: () => fetchPremisesFacilities(id),
    enabled: enabled && !!id,
  });
};

export const useUpsertPremisesFacilities = (
  organizationSiteId: number
): UseMutationResult<any, Error, PremisesFacilitiesData> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: upsertPremisesFacilities,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: PREMISES_FACILITIES_QUERY_KEYS.FETCH(organizationSiteId),
      });
    },
  });
}; 