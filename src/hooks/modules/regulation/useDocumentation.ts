import { useQuery, useMutation, useQueryClient, UseMutationResult } from '@tanstack/react-query';
import { fetchDocumentation, saveDocumentation } from '@/services/modules/regulation/documentation';
import { DOCUMENTATION_QUERY_KEY } from '@/constants/modules/regulation/documentation';

export const useDocumentation = (id: number, enabled: boolean = false) => {
  return useQuery({
    queryKey: [DOCUMENTATION_QUERY_KEY, id],
    queryFn: () => fetchDocumentation(id),
    enabled: enabled && !!id,
  });
};

export interface DocumentationPayload {
  organization_site_id: number;
  documentation: string;
}

export const useSaveDocumentation = (
  id: number
): UseMutationResult<any, Error, DocumentationPayload> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveDocumentation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [DOCUMENTATION_QUERY_KEY, id] });
    },
  });
}; 