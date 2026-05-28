import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/modules/dnd/clauseApplicability";
import { fetchClauseApplocability, submitApplicability } from "@/services/modules/dnd/clauseApplicability";
import { showActionAlert } from "@/components/ui";
import { STATUS } from "@/constants/common";

export const useFetchApplicability = (project_id: number) => {
    return useQuery({
        queryKey: [QUERY_KEYS, project_id],
        queryFn: () => fetchClauseApplocability(project_id),
        enabled:!!project_id
    })
}

export const useSaveApplicability = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: any) => submitApplicability(data),
         onSuccess: () => {
            queryClient.invalidateQueries({queryKey: [QUERY_KEYS]})
        },
        onError: () => {
              showActionAlert(STATUS.FAILED)
            },
    })
}