import { QUALITY_ASSURANCE_QUERY_KEY } from '@/constants/modules/regulation/qualityAssurance';
import { fetchQualityAssurance, saveQualityAssurance } from '@/services/modules/regulation/qualityAssurance';
import { useQuery, useMutation, useQueryClient, UseMutationResult } from '@tanstack/react-query';

export const useQualityAssurance = (id: number, enabled: boolean = false) => {
  return useQuery({
    queryKey: [QUALITY_ASSURANCE_QUERY_KEY, id],
    queryFn: () => fetchQualityAssurance(id),
    enabled: enabled && !!id,
  });
};

export interface QualityAssurancePayload {
  organization_site_id: number;
  quality_assurance: string;
}

export const useSaveQualityAssurance = (
  id: number
): UseMutationResult<any, Error, QualityAssurancePayload> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveQualityAssurance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUALITY_ASSURANCE_QUERY_KEY, id] });
    },
  });
}; 