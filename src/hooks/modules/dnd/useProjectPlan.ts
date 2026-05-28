import {
  useQuery,
  useMutation,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query'
import {
  getDesignTools,
  getDesignTransfer,
  getDocRef,
  projectPlanApi,
  fetchDesignTeamData,
  upsertProjectPlan,
  getDesignEquipments,
  getDesignInputGatheringDropdown,
  submitDesignInputGathering,
  getStageWiseListById,
  submitStageWiseVariable,
  submitDocumentReference,
  submitDesignTransfer,
} from '@/services/modules/dnd/projectPlan'
import { showActionAlert } from '@/components/ui'
import { QUERY_KEYS } from '@/constants/modules/dnd/projectPlan'
import {
  ToolOption,
  DesignInputGatheringFormData,
  DesignTransferChecklist,
  DocRef,
} from '@/types/modules/dnd/projectPlan'
import { COMMON_CONSTANTS } from '@/lib/utils/common'
const { FAILED_ALERT, SUCCESS_ALERT } = COMMON_CONSTANTS

export const useDesignTools = () => {
  return useQuery<ToolOption[], Error>({
    queryKey: QUERY_KEYS.DESIGN_TOOLS,
    queryFn: getDesignTools,
  })
}

export const useDesignEquipments = () => {
  return useQuery<ToolOption[], Error>({
    queryKey: QUERY_KEYS.DESIGN_EQUIPMENTS,
    queryFn: getDesignEquipments,
  })
}

export const useDesignTransfer = (projectId: number) => {
  return useQuery<ToolOption[], Error>({
    queryKey: QUERY_KEYS.DESIGN_TRANSFER(projectId),
    queryFn: () => getDesignTransfer(projectId),
    enabled: false,
  })
}

export const useDocRef = (projectId: number) => {
  return useQuery<ToolOption[], Error>({
    queryKey: QUERY_KEYS.DOC_REF(projectId),
    queryFn: getDocRef,
    enabled: false,
  })
}

export const useProjectPlan = (projectId: number) => {
  return useQuery({
    queryKey: QUERY_KEYS.PROJECT_PLAN(projectId),
    queryFn: () => projectPlanApi.getProjectPlan(projectId),
    enabled: !!projectId,
  })
}

export const useDesignTeamData = (projectId: string) => {
  return useQuery<any, Error>({
    queryKey: QUERY_KEYS.DESIGN_TEAM(projectId),
    queryFn: () => fetchDesignTeamData(projectId),
    enabled: !!projectId,
  })
}

export const useUpsertProjectPlan = (
  projectId: number
): UseMutationResult<any, Error, FormData> => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: upsertProjectPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.PROJECT_PLAN(projectId),
      })
    },
  })
}

export const useGetDesignInputGathering = (projectId: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.DESIGN_INPUT_GATHERING, projectId],
    queryFn: () => getDesignInputGatheringDropdown(projectId),
    enabled: !!projectId,
  })
}

export const useDesignInputGatheringSubmit = () => {
  return useMutation({
    mutationFn: (digBody: DesignInputGatheringFormData) =>
      submitDesignInputGathering(digBody),
    onError: () => {
      showActionAlert(FAILED_ALERT)
    },
  })
}

export const useStageWiseSubmit = () => {
  return useMutation({
    mutationFn: (digBody: any) => submitStageWiseVariable(digBody),
    onError: () => {
      showActionAlert(FAILED_ALERT)
    },
  })
}
export const useStageWiseListById = (project_build_stage_order_id: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.DESIGN_INPUT_GATHERING, project_build_stage_order_id],
    queryFn: () => getStageWiseListById(project_build_stage_order_id),
    enabled: !!project_build_stage_order_id,
  })
}

/**
 * Description: Hook to submit Document Reference
 * Author: Harsithiga B
 * Data: 09-06-2025
 */
export const useSubmitDesignTransfer = (projectId: number) => {
  return useMutation({
    mutationFn: (designTransfer: DesignTransferChecklist) =>
      submitDesignTransfer(designTransfer, projectId),
    onSuccess: () => {
      showActionAlert(SUCCESS_ALERT)
    },
    onError: () => {
      showActionAlert(FAILED_ALERT)
    },
  })
}

/**
 * Description: Hook to submit Document Reference
 * Author: Harsithiga B
 * Data: 09-06-2025
 */
export const useSubmitDocRef = () => {
  return useMutation({
    mutationFn: (docRef: DocRef) => submitDocumentReference(docRef),
    onSuccess: () => {
      showActionAlert(SUCCESS_ALERT)
    },
    onError: () => {
      showActionAlert(FAILED_ALERT)
    },
  })
}
