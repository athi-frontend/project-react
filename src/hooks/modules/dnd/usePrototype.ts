import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { POSTPROTOTYPE } from "@/constants/modules/dnd/prototype";
import { getPrototypeList, postPrototype } from "@/services/modules/dnd/prototype";
import { QUERY_KEYS } from "@/constants/queryKeys";

export const usePrototypeList = (projectId: number,stage_type?:string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PROTOTYPE_LIST, projectId],
    queryFn: () => getPrototypeList(projectId,stage_type),
    enabled: !!projectId, 
  });
};

export const usePostPrototype = (projectId: number) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationKey: [POSTPROTOTYPE, projectId],
    mutationFn: (payload: FormData) => postPrototype(payload, projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.prototype.FETCH_BY_ID],
      });
    },
  });
};
