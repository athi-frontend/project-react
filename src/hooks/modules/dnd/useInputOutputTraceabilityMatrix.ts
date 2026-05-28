import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchAllTraceability, fetchDocumentsById, saveTraceabilityForm } from "@/services/modules/dnd/inputOutputTraceabilityMatrix";
import { QUERY_KEY } from "@/constants/modules/dnd/inputOutputTraceabilityMatrix";
import { TraceabilityMatrixForm } from "@/types/modules/dnd/inputOutputTraceabilityMatrix";
import { showActionAlert } from "@/components/ui/alert-modal/ActionAlert";
import { STATUS } from "@/constants/common";

export const useFetchTraceabilityList = (project_id: number) => {
    return useQuery({
        queryKey: [QUERY_KEY.FETCH, project_id],
        queryFn: () => fetchAllTraceability(project_id),
        enabled:!!project_id
    })
}

export const useFetchDocumentsRow= (project_id: number, dir: number) => {
    return useQuery({
        queryKey: [QUERY_KEY.FETCH, dir,project_id],
        queryFn: () => fetchDocumentsById(dir,project_id),
        enabled: !!project_id && !!dir
    })
}

export const useSaveMatrix = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: TraceabilityMatrixForm) => saveTraceabilityForm(data),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: [QUERY_KEY.FETCH]})
        },
        onError: () => {
              showActionAlert(STATUS.FAILED)
            },
    })
}
