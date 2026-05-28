import { STORAGE_QUERY_KEY } from '@/constants/modules/regulation/storage';
import { fetchStorage, saveStorage } from '@/services/modules/regulation/storage';
import { useQuery, useMutation, useQueryClient, UseMutationResult } from '@tanstack/react-query';

export const useStorage = (id: number, enabled: boolean = false) => {
  return useQuery({
    queryKey: [STORAGE_QUERY_KEY, id],
    queryFn: () => fetchStorage(id),
    enabled: enabled && !!id,
  });
};

export interface StoragePayload {
  organization_site_id: number;
  storage: string;
}

export const useSaveStorage = (
  id: number
): UseMutationResult<any, Error, StoragePayload> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveStorage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [STORAGE_QUERY_KEY, id] });
    },
  });
}; 