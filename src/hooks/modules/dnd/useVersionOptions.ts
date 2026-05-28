import { useQuery } from "@tanstack/react-query";
import { fetchVersionsByProjectId } from "@/services/modules/dnd/billOfMaterial";
import { QUERY_KEYS } from '@/constants/queryKeys';

export const useVersionOptions = (projectId: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: [QUERY_KEYS.BOM.BOM_VERSIONS, projectId],
    queryFn: () => fetchVersionsByProjectId(projectId),
    enabled: !!projectId && enabled,
  });
};

