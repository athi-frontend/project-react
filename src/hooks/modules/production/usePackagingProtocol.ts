import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchPackagingProtocol, upsertPackagingProtocol, PackagingProtocol, UpsertPackagingResponse } from '@/services/modules/production/finalOQC';
import { NUMBERMAP } from '@/constants/common';
/**
 * Get Packaging Protocol by project_id & model_id
 */
/**
    Classification : Confidential
**/
export const useGetPackagingProtocol = (project_id: string|number, model_id?: string|number) => {
  return useQuery<PackagingProtocol, Error>({
    queryKey: ['packagingProtocol', project_id, model_id ?? null],
    queryFn: () => fetchPackagingProtocol(project_id, model_id),
    enabled: !!project_id,
    refetchOnWindowFocus: false,
    staleTime: NUMBERMAP.ZERO,
    gcTime: NUMBERMAP.ZERO,
    placeholderData: undefined,
  });
};
/**
 * Upsert Packaging Protocol
 */
export const useUpsertPackagingProtocol = () => {
  const queryClient = useQueryClient();
  return useMutation<UpsertPackagingResponse, Error, PackagingProtocol>({
    mutationFn: upsertPackagingProtocol,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['packagingProtocol'] }),
  });
};
