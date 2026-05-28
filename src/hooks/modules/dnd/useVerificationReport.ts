import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEY } from "@/constants/modules/dnd/verificationReport";
import { fetchReport, saveReport, getJigs, getEquipments, fetchAllReports, getItemsToTest, getVerificationResult, fetchUsers } from "@/services/modules/dnd/verificationReport";
import { showActionAlert } from "@/components/ui/alert-modal/ActionAlert";
import { STATUS } from "@/constants/common";


export const useFetchReport = (verification_plan_id: number) => {
    return useQuery({
        queryKey: [QUERY_KEY.REPORT, verification_plan_id],
        queryFn: () => fetchReport(verification_plan_id),
        enabled: !!verification_plan_id
    })
}

export const useFetchJigs = () => {
    return useQuery({
        queryKey: [QUERY_KEY.JIGS],
        queryFn: () => getJigs(),
    })
}


export const useFetchItemsToTest = () => {
    return useQuery({
        queryKey: [QUERY_KEY.ITEM_TO_TEST],
        queryFn: () => getItemsToTest(),
    })
}

export const useUsers = (roleId: number) => {
  return useQuery({
    queryKey: [QUERY_KEY.USERS],
    queryFn: () =>fetchUsers(roleId),
  })
}

export const useFetchVerificationResult = () => {
    return useQuery({
        queryKey: [QUERY_KEY.VERIFICATION_RESULT],
        queryFn: () => getVerificationResult(),
    })
}

export const useFetchEquipment = () => {
    return useQuery({
        queryKey: [QUERY_KEY.EQUIPMENTS],
        queryFn: () => getEquipments(),
    })
}


export const useSaveReport = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ data, design_input_requirement_id }: { data: FormData, design_input_requirement_id: number }) => saveReport(data, design_input_requirement_id),
         onSuccess: () => {
              queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
              showActionAlert(STATUS.SUCCESS)
            },
            onError: (error) => {
              showActionAlert(STATUS.FAILED)
            },
    })
}

export const useFetchAllReport = (project_id: number) => {
    return useQuery({
        queryKey: [QUERY_KEY.REPORT_ALL, project_id],
        queryFn: () => fetchAllReports(project_id),
        enabled: !!project_id
    })
}


