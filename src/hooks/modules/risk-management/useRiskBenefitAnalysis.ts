/**
*Classification : Confidential
*/
import { RISK_BENEFIT_CONSTANTS } from "@/constants/modules/risk-management/riskBenefitAnalysis"
import { fetchAllRiskBenefit, submitBenefitRiskAnalysis } from "@/services/modules/risk-management/riskBenefitAnalysis"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { showActionAlert } from "@/components/ui"
import { STATUS } from "@/constants/common"

export const useGetRiskBenefit  = (projectId : number | null) =>{
    return useQuery({
        queryKey: [RISK_BENEFIT_CONSTANTS.QUERY_KEYS.RISK_BENEFIT],
        queryFn: () => fetchAllRiskBenefit(projectId),
        enabled: !!projectId  && !isNaN(projectId),
    })
}

export const useSubmitBenefitRiskAnalysis = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: submitBenefitRiskAnalysis,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [RISK_BENEFIT_CONSTANTS.QUERY_KEYS.RISK_BENEFIT],
            })
            showActionAlert(STATUS.SUCCESS)
        },
        onError: () => {
            showActionAlert(STATUS.FAILED)
        },
    })
}
