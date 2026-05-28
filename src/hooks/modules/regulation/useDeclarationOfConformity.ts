import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getRegulationConformity, upsertRegulationConformity } from '@/services/modules/regulation/declarationOfConformity';
import { REGULATION_CONFORMITY_QUERY_KEY } from '@/constants/modules/regulation/declarationOfConformity';

export const useRegulationConformity = (id: number | string, enabled: boolean = false) => {
  return useQuery({
    queryKey: [REGULATION_CONFORMITY_QUERY_KEY, id],
    queryFn: () => getRegulationConformity(id),
    enabled: enabled && !!id,
  });
};

export const useUpsertRegulationConformity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: upsertRegulationConformity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [REGULATION_CONFORMITY_QUERY_KEY] });
    },
  });
}; 