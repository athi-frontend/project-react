import {
  getPhysicalCharacteristics,
  getSpecifications,
  deletePhysicalCharacteristic,
  createSpecification,
  fetchRegulationMarket,
  fetchAccessoriesByUsabilityType,
  deleteDevice,
} from '@/services/modules/dnd/dirSpecification'
import {
  useQuery,
  useMutation,
  useQueryClient,
  UseMutationResult,
  UseQueryOptions,
} from '@tanstack/react-query'
import {
  fetchModels,
  fetchPerformanceSpecificationByDesignInputId,
  postPerformanceSpecification,
  fetchFunctionalBlocks,
  getPerformanceSpecification,
  fetchFunctionalSpecificationByDesignInputId,
  saveMarketRegulations
} from '@/services/modules/dnd/performanceSpecification'
import {
  ApiResponse,
  FetchModelsResponse,
  PerformanceFormData,
  Option,
} from '@/types/components/modules/dirSpecifications'
import { RegulationMarketPrefillResponse } from '@/types/modules/dnd/digSpecification'

export const fetchPhysicalCharacteristics = (projectId: number) => {
  return useQuery({
    queryKey: ['physicalcharacteristics', projectId],
    queryFn: () => getPhysicalCharacteristics(projectId),
    enabled: false,
  })
}

export const fetchSpecifications = (project: number) => {
  return useQuery({
    queryKey: ['specifications', project],
    queryFn: () => getSpecifications(project),
    enabled: !!project,
  })
}

export const useDeletePhysicalCharacteristic = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (designInputRequirementId: number) =>
      deletePhysicalCharacteristic(designInputRequirementId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['physicalcharacteristics'] })
    },
  })
}

export const useFetchModels = (project_Id: string, status: number = 1) => {
  return useQuery<FetchModelsResponse, Error>({
    queryKey: ['models', project_Id, status],
    queryFn: () => fetchModels(project_Id, status),
    enabled: !!project_Id,
  })
}

export const usePostPerformanceSpecification = (): UseMutationResult<
  ApiResponse,
  Error,
  PerformanceFormData & {
    project_id: string
    description: string
    specification_applicability_id: number
    tolerance_percentage: string
  }
> => {
  return useMutation({
    mutationFn: (formData) => postPerformanceSpecification(formData),
  })
}

export const useFetchPerformanceSpecification = (
  designInputId: string,
  options?: UseQueryOptions<any, Error>
) => {
  return useQuery({
    queryKey: ['performanceSpecification', designInputId],
    queryFn: () => fetchPerformanceSpecificationByDesignInputId(designInputId),
    enabled: !!designInputId,
    ...options,
  })
}

export const useFetchFunctionalBlocks = (projectId: string) => {
  return useQuery<Option[], Error>({
    queryKey: ['functionalBlocks', projectId],
    queryFn: () => fetchFunctionalBlocks(projectId),
    enabled: !!projectId,
  })
}

export const useDeleteDevice = () => {
  return useMutation({
    mutationFn: (deviceId: number) => deleteDevice(deviceId)
  })
}

export const useFetchPerformanceSpecificationByProjectID = (
  projectId: number
) => {
  return useQuery({
    queryKey: ['performanceSpecifications', projectId],
    queryFn: () => getPerformanceSpecification(projectId),
    enabled: !!projectId,
  })
}

export const useFetchFunctionalSpecification = (designInputId: string) => {
  return useQuery({
    queryKey: ['functionalSpecification', designInputId],
    queryFn: () => fetchFunctionalSpecificationByDesignInputId(designInputId),
    enabled: false,
  })
}

export const useCreateSpecification = () => { 
  return useMutation({
    mutationFn: (params: { project_id: number; eqms_dig_specification_id: number }) =>
      createSpecification(params.project_id, params.eqms_dig_specification_id),
  })
}

export const useSaveRegulations = (): UseMutationResult<
  any,
  Error,
  { project_id: string | number; regulations: (string | number)[]; market: (string | number)[] }
> => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, { project_id: string | number; regulations: (string | number)[]; market: (string | number)[] }>({
    mutationFn: (payload) => saveMarketRegulations(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['regulationMarket', variables.project_id] });
    }
  })
}

  /** Author: Harsithiga B
  Date: 13-08-2025
  Description: Hook to fetch Regulation and Market for a Project Id **/
export const useRegulationMarket = (projectId: number) => {
  return useQuery<RegulationMarketPrefillResponse>({
    queryKey: ['regulationMarket', projectId],
    queryFn: () => fetchRegulationMarket(projectId),
    enabled: !!projectId,
  })
}

  /** Author: Harsithiga B
  Date: 21-08-2025
  Description: Hook to fetch Accessories by Usability Type for Shelf Life specification **/
export const useFetchAccessoriesByUsabilityType = (specId: number, usabilityTypeId: number) => {
  return useQuery({
    queryKey: ['accessoriesByUsabilityType', specId, usabilityTypeId],
    queryFn: () => fetchAccessoriesByUsabilityType(specId, usabilityTypeId),
    enabled: !!specId && !!usabilityTypeId,
  })
}