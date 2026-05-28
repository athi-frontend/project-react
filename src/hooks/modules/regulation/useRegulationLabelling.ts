import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getRegulationLabelling, upsertRegulationLabelling } from '@/services/modules/regulation/labelling';
import { REGULATION_LABELLING_QUERY_KEY } from '@/constants/modules/regulation/labelling';

export const useRegulationLabelling = (id: number | string, enabled: boolean = false) => {
  return useQuery({
    queryKey: [REGULATION_LABELLING_QUERY_KEY, id],
    queryFn: () => getRegulationLabelling(id),
    enabled: enabled && !!id,
  });
};

export const useUpsertRegulationLabelling = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: upsertRegulationLabelling,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [REGULATION_LABELLING_QUERY_KEY] });
    },
  });
}; 