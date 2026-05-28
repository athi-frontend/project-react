import { useQuery, useMutation, useQueryClient, UseMutationResult } from '@tanstack/react-query';
import { SANITATION_QUERY_KEY } from '@/constants/modules/regulation/sanitation';
import { fetchSanitation, saveSanitation } from '@/services/modules/regulation/sanitation';

export const useSanitation = (id: number, enabled: boolean = false) => {
  return useQuery({
    queryKey: [SANITATION_QUERY_KEY, id],
    queryFn: () => fetchSanitation(id),
    enabled: enabled && !!id,
  });
};

export interface SanitationPayload {
  organization_site_id: number;
  sanitation: string;
}

export const useSaveSanitation = (
  id: number
): UseMutationResult<any, Error, SanitationPayload> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveSanitation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SANITATION_QUERY_KEY, id] });
    },
  });
}; 