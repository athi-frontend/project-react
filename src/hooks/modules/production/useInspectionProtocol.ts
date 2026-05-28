import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchInspectionProtocol, upsertInspectionProtocol, InspectionProtocol, UpsertInspectionResponse } from '@/services/modules/production/finalOQC';
import { NUMBERMAP } from '@/constants/common';
/**
 * Get Inspection Protocol by project_id & model_id
 */
/**
    Classification : Confidential
**/
export const useGetInspectionProtocol = (project_id: string|number, model_id?: string|number) => {
  return useQuery<InspectionProtocol, Error>({
    queryKey: ['inspectionProtocol', project_id, model_id ?? null],
    queryFn: () => fetchInspectionProtocol(project_id, model_id),
    enabled: !!project_id,
    refetchOnWindowFocus: false,
    staleTime: NUMBERMAP.ZERO,
    gcTime: NUMBERMAP.ZERO,
    placeholderData: undefined,
  });
};
/**
 * Upsert Inspection Protocol
 */
export const useUpsertInspectionProtocol = () => {
  const queryClient = useQueryClient();
  return useMutation<UpsertInspectionResponse, Error, InspectionProtocol>({
    mutationFn: upsertInspectionProtocol,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['inspectionProtocol'] }),
  });
};
