import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchDesignManufacturing, upsertDesignManufacturing } from '@/services/modules/regulation/designManufacturing';
import { DESIGN_MANUFACTURING_QUERY_KEYS } from '@/constants/modules/regulation/designManufacturing';

export const useDesignManufacturing = (id: number | string, enabled: boolean = false) => {
  return useQuery({
    queryKey: DESIGN_MANUFACTURING_QUERY_KEYS.FETCH(id),
    queryFn: () => fetchDesignManufacturing(id),
    enabled: enabled && !!id,
  });
};

export const useUpsertDesignManufacturing = (projectId: number | string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: upsertDesignManufacturing,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: DESIGN_MANUFACTURING_QUERY_KEYS.FETCH(projectId),
      });
    },
  });
}; 