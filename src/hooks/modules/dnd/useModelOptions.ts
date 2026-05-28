import { useQuery } from "@tanstack/react-query";
import { fetchModelsByProjectId } from "@/services/modules/dnd/billOfMaterial";
import { QUERY_KEYS } from '@/constants/queryKeys';

export const useModelOptions = (projectId: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: [QUERY_KEYS.BOM.MODELS, projectId],
    queryFn: () => fetchModelsByProjectId(projectId),
    enabled: !!projectId && enabled,
  });
};


