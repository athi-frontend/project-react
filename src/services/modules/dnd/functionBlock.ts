import { apiClient } from '@/shared/apiClient'
import {
  MainBlock,
  SubBlock,
  UpsertMainBlockPayload,
  UpsertSubBlockPayload,
} from '@/types/modules/dnd/functionalBlock'
import { FUNCTIONAL_BLOCK_CONSTANTS } from '@/constants/modules/dnd/functionBlock'

const { GENERAL, API } = FUNCTIONAL_BLOCK_CONSTANTS

export const fetchAllFunctionalBlocks = async (projectId: number) => {
  const response = await apiClient.get(
    `${API.ENDPOINTS.API_BASE_PATH_FUNCTIONAL_BLOCK}/${projectId}`
  )
  if (response.data.code !== API.STATUSCODES.STATUS_CODE_SUCCESS) {
    throw new Error(
      response.data.message ?? API.ERRORS.ERROR_FETCH_FUNCTIONAL_BLOCKS
    )
  }
  return response.data
}

export const fetchMainBlock = async (blockId: string): Promise<MainBlock> => {
  const response = await apiClient.get(
    `${API.ENDPOINTS.API_BASE_PATH_FUNCTIONAL_BLOCK}${API.ENDPOINTS.API_SUB_PATH_MAIN_BLOCK}/${blockId}`
  )
  if (response.data.code !== API.STATUSCODES.STATUS_CODE_SUCCESS) {
    throw new Error(response.data.message ?? API.ERRORS.ERROR_FETCH_MAIN_BLOCK)
  }
  const blockData = Array.isArray(response.data.data)
    ? response.data.data[0]
    : response.data.data
  if (!blockData) {
    return {
      functional_block_id: parseInt(blockId),
      title: GENERAL.EMPTY_STRING,
      description: GENERAL.EMPTY_STRING,
    }
  }
  return {
    functional_block_id: blockData.functional_block_id,
    title: blockData.title,
    description: blockData.description ?? GENERAL.EMPTY_STRING,
  }
}

export const fetchSubBlock = async (subBlockId: string): Promise<SubBlock> => {
  const response = await apiClient.get(
    `${API.ENDPOINTS.API_BASE_PATH_FUNCTIONAL_BLOCK}${API.ENDPOINTS.API_SUB_PATH_SUB_BLOCK}/${subBlockId}`
  )
  if (response.data.code !== API.STATUSCODES.STATUS_CODE_SUCCESS) {
    throw new Error(response.data.message ?? API.ERRORS.ERROR_FETCH_SUB_BLOCK)
  }
  const subBlockData = Array.isArray(response.data.data)
    ? response.data.data[0]
    : response.data.data
  if (!subBlockData) {
    return {
      functional_sub_block_id: parseInt(subBlockId),
      title: GENERAL.EMPTY_STRING,
      description: GENERAL.EMPTY_STRING,
    }
  }
  return {
    functional_sub_block_id: subBlockData.functional_sub_block_id,
    title: subBlockData.title,
    description: subBlockData.description ?? GENERAL.EMPTY_STRING,
  }
}

export const upsertMainBlock = async (payload: UpsertMainBlockPayload) => {
  const { project_id, title, description, functional_block_id } = payload
  if (functional_block_id) {
    const response = await apiClient.post(
      `${API.ENDPOINTS.API_BASE_PATH_FUNCTIONAL_BLOCK}${API.ENDPOINTS.API_SUB_PATH_MAIN_BLOCK}`,
      { project_id, title, description, functional_block_id }
    )
    if (response.data.code !== API.STATUSCODES.STATUS_CODE_SUCCESS) {
      throw new Error(
        response.data.message ?? API.ERRORS.ERROR_UPSERT_MAIN_BLOCK
      )
    }
    return response.data
  } else {
    const response = await apiClient.post(
      API.ENDPOINTS.API_BASE_PATH_FUNCTIONAL_BLOCK +
        API.ENDPOINTS.API_SUB_PATH_MAIN_BLOCK,
      { project_id, title, description }
    )
    if (
      response.data.code !== API.STATUSCODES.STATUS_CODE_SUCCESS &&
      response.data.code !== API.STATUSCODES.STATUS_CODE_CREATED
    ) {
      throw new Error(
        response.data.message ?? API.ERRORS.ERROR_UPSERT_MAIN_BLOCK
      )
    }
    return response.data
  }
}

export const upsertSubBlock = async (payload: UpsertSubBlockPayload) => {
  const response = await apiClient.post(
    `${API.ENDPOINTS.API_BASE_PATH_FUNCTIONAL_BLOCK}${API.ENDPOINTS.API_SUB_PATH_SUB_BLOCK}`,
    payload
  )
  if (
    response.data.code !== API.STATUSCODES.STATUS_CODE_SUCCESS &&
    response.data.code !== API.STATUSCODES.STATUS_CODE_CREATED
  ) {
    throw new Error(response.data.message ?? API.ERRORS.ERROR_UPSERT_SUB_BLOCK)
  }
  return response.data
}

export const deleteMainBlock = async (blockId: string) => {
  const response = await apiClient.delete(
    `${API.ENDPOINTS.API_BASE_PATH_FUNCTIONAL_BLOCK}${API.ENDPOINTS.API_SUB_PATH_MAIN_BLOCK}/${blockId}`
  )
  if (response.data.code !== API.STATUSCODES.STATUS_CODE_SUCCESS) {
    throw new Error(response.data.message ?? API.ERRORS.ERROR_DELETE_MAIN_BLOCK)
  }
  return response.data
}

export const deleteSubBlock = async (subBlockId: string) => {
  const response = await apiClient.delete(
    `${API.ENDPOINTS.API_BASE_PATH_FUNCTIONAL_BLOCK}${API.ENDPOINTS.API_SUB_PATH_SUB_BLOCK}/${subBlockId}`
  )
  if (response.data.code !== API.STATUSCODES.STATUS_CODE_SUCCESS) {
    throw new Error(response.data.message ?? API.ERRORS.ERROR_DELETE_SUB_BLOCK)
  }
  return response.data
}
