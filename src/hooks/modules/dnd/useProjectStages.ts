import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { projectStagesService } from '@/services/modules/dnd/projectStages'
import {
  CreateVerificationPlanData,
  PrototypeDataResponse,
  StageDropdownResponse,
  UpdateProjectStageData,
  UpdatePrototypeData,
  UpdateVerificationPlanData,
  VerificationPlanByIdResponse,
} from '@/types/modules/dnd/stageTypes'
import { PROJECT_STAGES_QUERIES } from '@/constants/modules/dnd/stageService'
import { fetchAllDirList, fetchExecutionStageMapper, fetchDirListByCategory } from '@/services/modules/dnd/dir'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { PROTOCOL_MODAL_FORM } from '@/constants/components/ui/prototypeForm'

/**
    Classification : Confidential
**/
export const useProjectStagesData = (projectId: number) => {
  return useQuery({
    queryKey: PROJECT_STAGES_QUERIES.QUERY_KEYS.PROJECT_STAGES(projectId),
    queryFn: () => projectStagesService.getProjectStages(projectId),
  })
}

export const useStagesDropdown = () => {
  return useQuery<StageDropdownResponse>({
    queryKey: PROJECT_STAGES_QUERIES.QUERY_KEYS.STAGES_DROPDOWN,
    queryFn: () => projectStagesService.getStagesDropdown(),
  })
}

export const useCreateProjectStage = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: projectStagesService.createProjectStage,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: PROJECT_STAGES_QUERIES.INVALIDATION_KEYS.PROJECT_STAGES,
      })
    },
  })
}

export const useEditProjectStage = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      projectStageOrderId,
      data,
    }: {
      projectStageOrderId: number
      data: UpdateProjectStageData
    }) => projectStagesService.updateProjectStage(projectStageOrderId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: PROJECT_STAGES_QUERIES.QUERY_KEYS.PROTOTYPE_DATA(
          variables.projectStageOrderId
        ),
      })
    },
  })
}

export const useDeleteStage = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (projectStageOrderId: number) => projectStagesService.deleteProjectStage(projectStageOrderId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: PROJECT_STAGES_QUERIES.INVALIDATION_KEYS.PROJECT_STAGES,
      })
    },
  })
}

export const usePrototypeData = (projectStageOrderId: number) => {
  return useQuery<PrototypeDataResponse>({
    queryKey:
      PROJECT_STAGES_QUERIES.QUERY_KEYS.PROTOTYPE_DATA(projectStageOrderId),
    queryFn: () => projectStagesService.getPrototypeData(projectStageOrderId),
    enabled: !!projectStageOrderId && !isNaN(projectStageOrderId),
  })
}

export const useUpdatePrototypeData = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      projectStageOrderId,
      data,
    }: {
      projectStageOrderId: number
      data: UpdatePrototypeData
    }) => projectStagesService.updatePrototypeData(projectStageOrderId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: PROJECT_STAGES_QUERIES.QUERY_KEYS.PROTOTYPE_DATA(
          variables.projectStageOrderId
        ),
      })
    },
  })
}

export const useDirList = (project_id: number) => {
  /**
     * Function Name: useDirList
     * Params: project_id, project_stage_order_id
     * Description: Custom hook to fetch the list of DIRs (Design Input Requirements) for a given project ID and project stage order ID.
     * Author: Prithiviraj,
     * modified: 05-09-2025,
     * Classification : Confidential
    **/
  return useQuery({
    queryKey: [QUERY_KEYS.DIR_LIST, project_id],
    queryFn: () => fetchAllDirList(project_id),
    enabled: !!project_id ,
  });
};

export const useExecutionStageMapper = (project_stage_order_id: number, project_id: number, mode: string) => {
  /**
     * Function Name: useExecutionStageMapper
     * Params: project_stage_order_id, project_id, mode
     * Description: Custom hook to fetch execution stage mapper data for a given project stage order ID with mapped_status parameter
     * Author: Prithiviraj,
     * modified: 16-10-2025,
     * Classification : Confidential
    **/
  return useQuery({
    queryKey: [
      mode === PROTOCOL_MODAL_FORM.EDIT ? QUERY_KEYS.DIR_LIST : QUERY_KEYS.EXECUTION_STAGE_MAPPER ,
      project_stage_order_id,
      project_id,
      mode,
    ],
    queryFn: () =>
      mode === PROTOCOL_MODAL_FORM.EDIT
        ? fetchAllDirList(project_id) :
        fetchExecutionStageMapper(project_stage_order_id),
    enabled: !!project_stage_order_id && !!project_id,
  });
};

export const useDirListByCategory = (project_id: number, dir_category: string[]) => {
  /**
   * Function Name: useDirListByCategory
   * Params: project_id, dir_category (array of category IDs)
   * Description: Custom hook to fetch DIR list filtered by dir_category values
   * Query parameters are handled by the service class
   * If no category is selected, fetches all DIRs for the project
   * Author: Prithiviraj,
   * modified: 30-12-2025,
   * Classification : Confidential
  **/
  return useQuery({
    queryKey: [QUERY_KEYS.DIR_LIST, project_id, 'category', dir_category.join(',')],
    queryFn: () => fetchDirListByCategory(project_id, dir_category),
    enabled: !!project_id,
  });
};

export const useCreateVerificationPlan = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateVerificationPlanData | FormData) =>
      projectStagesService.createVerificationPlan(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: PROJECT_STAGES_QUERIES.INVALIDATION_KEYS.VERIFICATION_PLANS,
      })
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.EXECUTION_STAGE_MAPPER],
      })
    },
  })
}

export const useVerificationPlans = (projectStageOrderId: number) => {
  return useQuery({
    queryKey:
      PROJECT_STAGES_QUERIES.QUERY_KEYS.VERIFICATION_PLANS(projectStageOrderId),
    queryFn: () =>
      projectStagesService.getVerificationPlans(projectStageOrderId),
    enabled: !!projectStageOrderId && !isNaN(projectStageOrderId),
  })
}

export const useDeleteVerificationPlan = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: projectStagesService.deleteVerificationPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: PROJECT_STAGES_QUERIES.INVALIDATION_KEYS.VERIFICATION_PLANS,
      })
    },
  })
}

export const useVerificationPlanById = (
  projectStageOrderId: number,
  verificationPlanId: number | null,
  p0: { enabled: boolean }
) => {
  return useQuery<VerificationPlanByIdResponse>({
    queryKey: PROJECT_STAGES_QUERIES.QUERY_KEYS.VERIFICATION_PLAN_BY_ID(
      projectStageOrderId,
      verificationPlanId ?? 0
    ),
    queryFn: () => {
      if (!verificationPlanId)
        throw new Error('Verification Plan ID is required')
      return projectStagesService.getVerificationPlanById(
        projectStageOrderId,
        verificationPlanId
      )
    },
    enabled:
      !!projectStageOrderId &&
      !!verificationPlanId &&
      !isNaN(projectStageOrderId) &&
      !isNaN(verificationPlanId),
  })
}

export const useUpdateVerificationPlan = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      verificationPlanId,
      data,
    }: {
      verificationPlanId: number
      data: UpdateVerificationPlanData | FormData
      projectStageOrderId: number
    }) => projectStagesService.updateVerificationPlan(verificationPlanId, data),
    onSuccess: (_, { verificationPlanId, projectStageOrderId }) => {
      queryClient.invalidateQueries({
        queryKey: PROJECT_STAGES_QUERIES.INVALIDATION_KEYS.VERIFICATION_PLANS,
      })
      if (projectStageOrderId) {
        queryClient.invalidateQueries({
          queryKey: PROJECT_STAGES_QUERIES.QUERY_KEYS.VERIFICATION_PLAN_BY_ID(
            projectStageOrderId,
            verificationPlanId
          ),
        })
      }
    },
  })
}

export const useProjectStagesByID = (projectId: number, enabled = false) => {
  return useQuery({
    queryKey: PROJECT_STAGES_QUERIES.QUERY_KEYS.PROJECT_STAGES(projectId),
    queryFn: () => projectStagesService.getProjectStageById(projectId),
    enabled,
  })
}

export const useProjectStageByOrderId = (projectStageOrderId: number, enabled = true) => {
  /**
     * Function Name: useProjectStageByOrderId
     * Params: projectStageOrderId, enabled
     * Description: Custom hook to fetch project stage data by project stage order ID.
     * Author: Mayuri,
     * modified: 09-09-2025,
     * Classification : Confidential
    **/
  return useQuery({
    queryKey: ['PROJECT_STAGE_BY_ORDER_ID', projectStageOrderId],
    queryFn: () => projectStagesService.getProjectStageById(projectStageOrderId),
    enabled: enabled && !!projectStageOrderId && !isNaN(projectStageOrderId),
  })
}