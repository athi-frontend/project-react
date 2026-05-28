import { useQuery, useMutation, useQueryClient, UseMutationResult } from '@tanstack/react-query';
import { fetchInternalAuditSelfInspection, saveInternalAuditSelfInspection } from '@/services/modules/regulation/internalAudit';
import { INTERNAL_AUDIT_SELF_INSPECTION_QUERY_KEY } from '@/constants/modules/regulation/internalAudit';
import { InternalAuditSelfInspectionPayload } from '@/types/modules/regulation/internalAudit';

export const useInternalAuditSelfInspection = (id: number, enabled: boolean = false) => {
  return useQuery({
    queryKey: [INTERNAL_AUDIT_SELF_INSPECTION_QUERY_KEY, id],
    queryFn: () => fetchInternalAuditSelfInspection(id),
    enabled: enabled && !!id,
  });
};

export const useSaveInternalAuditSelfInspection = (
  id: number
): UseMutationResult<any, Error, InternalAuditSelfInspectionPayload> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveInternalAuditSelfInspection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [INTERNAL_AUDIT_SELF_INSPECTION_QUERY_KEY, id] });
    },
  });
}; 