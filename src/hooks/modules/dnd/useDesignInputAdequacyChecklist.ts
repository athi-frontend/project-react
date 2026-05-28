import { showActionAlert } from "@/components/ui";
import { STATUS } from "@/constants/common";
import { QUERY_KEY } from "@/constants/modules/dnd/designInputAdequacyChecklist";
import { fetchAdequacy, postAdequacy } from "@/services/modules/dnd/designInputAdequacyChecklist";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useFetchAllAdequacy = (project_id: number) => {
    return useQuery({
        queryKey: [QUERY_KEY, project_id],
        queryFn: () => fetchAdequacy(project_id),
        enabled:!!project_id
    })
}

export const useSaveAdequacy = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: any) => postAdequacy(data),
         onSuccess: () => {
                    queryClient.invalidateQueries({queryKey: [QUERY_KEY]})
                },
                onError: () => {
                      showActionAlert(STATUS.FAILED)
                    },
    })
}


