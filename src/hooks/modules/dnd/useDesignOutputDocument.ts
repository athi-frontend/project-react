import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getDesignOutputDocuments,
  submitDesignOutputDocument,
  getDesignTransferPlanById
} from '@/services/modules/dnd/designOutputDocument'
import { DESIGN_OUTPUT_DOCUMENT_QUERY_KEYS } from '@/constants/modules/dnd/design-output-document'
import { showActionAlert } from '@/components/ui'
import { COMMON_CONSTANTS } from '@/lib/utils/common'

const { FETCH_DESIGN_OUTPUT_DOCUMENT_KEY, FETCH_DESIGN_TRANSFTER_PLAN_KEY } = DESIGN_OUTPUT_DOCUMENT_QUERY_KEYS

export const useGetDesignOutputDocuments = (projectId: number) => {
  return useQuery({
    queryKey: [FETCH_DESIGN_OUTPUT_DOCUMENT_KEY],
    queryFn: () => getDesignOutputDocuments(projectId),
  })
}

export const useSaveDesignDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ formData }: { projectId?: number; formData: FormData }) =>
      submitDesignOutputDocument(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [FETCH_DESIGN_OUTPUT_DOCUMENT_KEY],
      });
    },
    onError: () => {
      showActionAlert(COMMON_CONSTANTS.FAILED_ALERT)
    },
  })
}

export const useGetDesignTransferPlanById = (designTransferPlanId: number) => {
  return useQuery({
    queryKey: [FETCH_DESIGN_TRANSFTER_PLAN_KEY],
    queryFn: () => getDesignTransferPlanById(designTransferPlanId),
    enabled: false,
  })
}