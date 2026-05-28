import { 
    FETCH_MAINTENANCE_PLAN_LIST_KEY,
    FETCH_MAINTENANCE_PLAN_BY_ID_KEY,
    POST_MAINTENANCE_PLAN_KEY,
    FETCH_SERVICE_TYPES_KEY,
    FETCH_FREQUENCY_KEY,
    FETCH_INFRASTRUCTURE_CATEGORY_KEY,
    FETCH_INFRASTRUCTURE_TYPE_KEY,
  } from "@/constants/modules/infrastructure-management/maintenancePlan"
  import { 
    getMaintenancePlanList,
    getMaintenancePlanById,
    postMaintenancePlan,
    deleteMaintenancePlan,
    fetchServiceTypes,
    fetchFrequency,
    fetchInfrastructureCategory,
    fetchInfrastructureType,
  } from "@/services/modules/infrastructure-management/maintenancePlan"
  import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
  import { NUMBERMAP } from '@/constants/common'
  /**
   * Classification : Confidential
   **/
  
  export const useGetMaintenancePlanList = () => {
    return useQuery({
      queryKey: [FETCH_MAINTENANCE_PLAN_LIST_KEY],
      queryFn: () => getMaintenancePlanList(),
    })
  }
  
  export const useGetMaintenancePlanById = (maintenance_id: number) => {
    return useQuery({
      queryKey: [FETCH_MAINTENANCE_PLAN_BY_ID_KEY, maintenance_id],
      queryFn: () => getMaintenancePlanById(maintenance_id),
      enabled: !!maintenance_id,
      placeholderData: undefined,
    // stops structural sharing (also prevents reusing nested old data)
      staleTime: NUMBERMAP.ZERO,
      gcTime: NUMBERMAP.ZERO,
    })
  }
  
  export const usePostMaintenancePlan = () => {
    const queryClient = useQueryClient()
  
    return useMutation({
      mutationKey: [POST_MAINTENANCE_PLAN_KEY],
      mutationFn: postMaintenancePlan,
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries({ queryKey: [FETCH_MAINTENANCE_PLAN_LIST_KEY] })
        // Invalidate by ID if maintenance_id is present (for edit mode)
        if (variables?.maintenance_id) {
          queryClient.invalidateQueries({ queryKey: [FETCH_MAINTENANCE_PLAN_BY_ID_KEY, variables.maintenance_id] })
        }
      },
    })
  }
  
  export const useServiceTypes = (status: number = NUMBERMAP.ONE) => {
    return useQuery({
      queryKey: [FETCH_SERVICE_TYPES_KEY, status],
      queryFn: () => fetchServiceTypes(status),
    })
  }
  
  export const useFrequency = (status: number = NUMBERMAP.ONE) => {
    return useQuery({
      queryKey: [FETCH_FREQUENCY_KEY, status],
      queryFn: () => fetchFrequency(status),
    })
  }
  
  export const useInfrastructureCategory = () => {
    return useQuery({
      queryKey: [FETCH_INFRASTRUCTURE_CATEGORY_KEY],
      queryFn: fetchInfrastructureCategory,
    })
  }
  
  export const useInfrastructureType = () => {
    return useQuery({
      queryKey: [FETCH_INFRASTRUCTURE_TYPE_KEY],
      queryFn: fetchInfrastructureType,
    })
  }
  
  export const useDeleteMaintenancePlan = () => {
    const queryClient = useQueryClient()
  
    return useMutation({
      mutationFn: deleteMaintenancePlan,
      onSuccess: (data, maintenance_id) => {
        queryClient.invalidateQueries({
          queryKey: [FETCH_MAINTENANCE_PLAN_LIST_KEY],
        })
        // Invalidate the specific item query to ensure edit page shows updated data
        queryClient.invalidateQueries({
          queryKey: [FETCH_MAINTENANCE_PLAN_BY_ID_KEY, maintenance_id],
        })
      },
    })
  }
  