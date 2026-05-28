import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getDesignQualityPlan,
  upsertDesignQualityPlan,
  getDesignStageItems,
  getSpecificationApplicability, fetchDesignQualityPlanByStageOrderId
} from '@/services/modules/dnd/designQualityPlan'
import { DESIGN_QUALITY_PLAN } from '@/constants/modules/dnd/designQualityPlan'
import { DesignQualityFormData } from '@/types/modules/dnd/designQualityPlan'

/**
    Classification : Confidential
**/
const {
  DESIGN_QUALITY_PLAN_API_KEYS: {
    FETCH_DESIGN_QUALITY_PLAN_KEY,
    UPSERT_DESIGN_QUALITY_PLAN_KEY,
    FETCH_DESIGN_STAGE_ITEMS_KEY,
    FETCH_SPECIFICATION_APPLICABILITY_KEY,
    FETCH_DESIGN_QUALITY_PLAN_BY_ID_KEY,
  },
} = DESIGN_QUALITY_PLAN

export const INITIAL_FORM_DATA: DesignQualityFormData = {
  stage_name: '',
  quality_objective: '',
  itemForTest: '',
  parametersForInspection: [],
  testMethodsAndCriteria: '',
  design_quality_plan_id: '',
}

export const useGetProjectDesignQualityPlan = (projectId: number) => {
  return useQuery({
    queryKey: [FETCH_DESIGN_QUALITY_PLAN_KEY, projectId],
    queryFn: () => getDesignQualityPlan(projectId),
    enabled: !!projectId,
  })
}

export const useUpsertDesignQualityPlan = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: [UPSERT_DESIGN_QUALITY_PLAN_KEY],
    mutationFn: ({ projectId, data }: { projectId: number; data: any }) =>
      upsertDesignQualityPlan(projectId, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: [FETCH_DESIGN_QUALITY_PLAN_KEY, variables.projectId],
      })
    },
  })
}

export const useGetDesignStageItems = () => {
  return useQuery({
    queryKey: [FETCH_DESIGN_STAGE_ITEMS_KEY],
    queryFn: () => getDesignStageItems(),
  })
}

export const useGetSpecificationApplicability = (projectId: number) => {
  return useQuery({
    queryKey: [FETCH_SPECIFICATION_APPLICABILITY_KEY, projectId],
    queryFn: () => getSpecificationApplicability(projectId),
    enabled: !!projectId,
  })
}

export const useGetDesignQualityPlan = (projectId: number, stageOrderId: number) => {
  return useQuery<any, Error>({
    queryKey: [FETCH_DESIGN_QUALITY_PLAN_BY_ID_KEY, projectId, stageOrderId],
    queryFn: () => fetchDesignQualityPlanByStageOrderId(projectId, stageOrderId),
    enabled: !!projectId && !!stageOrderId,
  });
};