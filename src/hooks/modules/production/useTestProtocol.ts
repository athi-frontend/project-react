import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchTestProtocol,
  upsertTestProtocol,
  TestProtocolUpsertPayload,
  TestProtocolViewResponse,
  UpsertTestResponse,
} from '@/services/modules/production/finalOQC';
import { NUMBERMAP } from '@/constants/common';
/**
 * Get Test Protocol by id
 * @param id model_mapper_id or burn_in_test_protocol_id
 * @param options when burnin is true, fetches with ?burn_in=true (for burn_in_test_protocol_id)
 * @returns React Query result
 */
/**
    Classification : Confidential
**/
export const useGetTestProtocol = (id: string | number, options?: { burnin?: boolean }) => {
  return useQuery<TestProtocolViewResponse, Error>({
    queryKey: ['testProtocol', id, options?.burnin],
    queryFn: () => fetchTestProtocol(id, options),
    enabled: !!id,
    refetchOnWindowFocus: false,
    staleTime: NUMBERMAP.ZERO,
    gcTime: NUMBERMAP.ZERO,
    placeholderData: undefined,
  });
};
/**
 * Upsert Test Protocol
 * @returns React Query mutation result
 */
export const useUpsertTestProtocol = () => {
  const queryClient = useQueryClient();
  return useMutation<UpsertTestResponse, Error, TestProtocolUpsertPayload>({
    mutationFn: upsertTestProtocol,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['testProtocol'] }),
  });
};
