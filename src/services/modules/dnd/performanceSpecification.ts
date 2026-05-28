import { apiClient } from '@/shared/apiClient'
import {
  ApiResponse,
  FetchModelsResponse,
  Option,
} from '@/types/components/modules/dirSpecifications'
import { API_URLS } from '@/constants/modules/dnd/dirSpecificataion'
import { NUMBERMAP } from '@/constants/common'

/**
 Classification : Confidential
**/

export const fetchPerformanceSpecificationByDesignInputId = async (
  designInputId: string
): Promise<ApiResponse> => {
  const response = await apiClient.get(
    API_URLS.PERFORMANCE_SPECIFICATION.FETCH(designInputId)
  )
  return response.data
}

export const patchPerformanceSpecification = async (
  designInputId: string,
  payload: FormData
): Promise<ApiResponse> => {
  const response = await apiClient.put(
    API_URLS.PERFORMANCE_SPECIFICATION.UPDATE(designInputId),
    payload
  )
  return response.data
}

export const postPerformanceSpecification = async (
  payload: FormData
): Promise<ApiResponse> => {
  const response = await apiClient.post(
    API_URLS.PERFORMANCE_SPECIFICATION.CREATE,
    payload
  )
  return response.data
}

export const fetchModels = async (
  project_Id: string,
  status: number = 1
): Promise<FetchModelsResponse> => {
  const response = await apiClient.get(
    API_URLS.PERFORMANCE_SPECIFICATION.MODELS,
    {
      params: { status: String(status), project_id: project_Id },
    }
  )
  return response.data
}

export const fetchFunctionalBlocks = async (
  projectId: string
): Promise<Option[]> => {
  const response = await apiClient.get(
    API_URLS.FUNCTIONAL_BLOCK.FETCH(projectId)
  )
  const blocks = response.data.data[0].blocks
  if (!Array.isArray(blocks)) {
    throw new Error('Expected an array of blocks in response.data.data[0].blocks')
  }
  return blocks.map((block: any) => ({
    key: block.functional_block_id.toString(),
    value: block.title,
  }))
}

export const getPerformanceSpecification = async (projectId: number) => {
  const response = await apiClient.get(
    `${API_URLS.PERFORMANCE_SPECIFICATION.LIST}${projectId}?status=${NUMBERMAP.ONE}`
  )
  return response.data
}

export const fetchFunctionalSpecificationByDesignInputId = async (
  designInputId: string
) => {
  const response = await apiClient.get(
    `${API_URLS.FUNCTIONAL_SPECIFICATION.FETCH}/${designInputId}`
  )
  return response.data
}

export const saveMarketRegulations = async (payload: { project_id: string | number, regulations: (string | number)[], market: (string | number)[] }) => {
  const response = await apiClient.post(API_URLS.REGULATIONS_SAVE.SAVE, payload)
  return response.data
}
