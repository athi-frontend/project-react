import {
fetchDir, fetchDirList,
  saveDirData,
  fetchExecutionStages, fetchFunctionalBlockTypes
} from '@/services/modules/dnd/dir'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/constants/modules/dnd/dir';

/**
    Classification : Confidential
**/
// Fetch a single DIR by dir_id
export const useDIRs = (dir_id: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.DIR, dir_id],
    queryFn: () => fetchDir(dir_id),
    enabled: !!dir_id,
  });
};

// Fetch list of DIRs by project_id
export const useDIRList = (project_id: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.DIR_LIST, project_id],
    queryFn: () => fetchDirList(project_id),
    enabled: !!project_id,
  });
};

export const useExecutionStages = (projectId: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.EXECUTION_STAGES, projectId],
    queryFn: () => fetchExecutionStages(projectId),
    enabled: !!projectId,
  })
}

export const useSaveDirData = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ dirId, formData }: { dirId: number; formData: any }) =>
      saveDirData(dirId, formData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DIR_LIST] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DIR, variables.dirId] })
    },
  })
}

export const useFunctionalBlockTypes = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.FUNCTIONAL_BLOCK_TYPES],
    queryFn: fetchFunctionalBlockTypes,
    select: (data) => data.data,
  });
};