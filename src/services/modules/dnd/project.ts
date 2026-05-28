import { apiClient } from '../../../shared/apiClient'
import { CustomError, ProjectListQueryKey } from '@/types/modules/dnd/project'
import { API_URLS } from '@/constants/modules/dnd/project'
import { USER_ACCESS_ENDPOINT } from '@/constants/components/menu'

export const getProductAll = async () => {
    const response = await apiClient.get(API_URLS.PRODUCT.ALL)
    return response.data
}

export const getProjectList = async ({
  queryKey,
}: {
  queryKey: ProjectListQueryKey
}) => {
  const [, page, pageSize] = queryKey
  try {
    const response = await apiClient.get(
      `${API_URLS.PROJECT.FETCH}?page=${page}&page_size=${pageSize}`
    )
    return response.data
  } catch (error) {
    const errorResponse = error as CustomError
    const errorMessage = errorResponse.response?.data?.message
    throw new Error(errorMessage)
  }
}

export const submitProject = async (projectData: FormData) => {
  try {
    const response = await apiClient.post(API_URLS.PROJECT.CREATE, projectData)
    return response.data
  } catch (error) {
    const errorResponse = error as CustomError
    const errorMessage = errorResponse.response?.data?.message
    throw new Error(errorMessage)
  }
}

export const updateProject = async (
  projectId: number,
  projectData: FormData
) => {
  try {
    const response = await apiClient.put(
      `${API_URLS.PROJECT.UPDATE}/${projectId}`,
      projectData
    )
    return response.data
  } catch (error) {
    const errorResponse = error as CustomError
    const errorMessage = errorResponse.response?.data?.message
    throw new Error(errorMessage)
  }
}

export const getProjectInfo = async (projectId: number) => {
  try {
    const response = await apiClient.get(
      `${API_URLS.PROJECT.BASE}/${projectId}`
    )
    return response.data
  } catch (error) {
    const errorResponse = error as CustomError
    const errorMessage = errorResponse.response?.data?.message
    throw new Error(errorMessage)
  }
}

export const deleteProject = async (projectId: number) => {
  try {
    const response = await apiClient.delete(
      `${API_URLS.PROJECT.DELETE}/${projectId}`
    )
    return response.data
  } catch (error) {
    const errorResponse = error as CustomError
    const errorMessage = errorResponse.response?.data?.message
    throw new Error(errorMessage)
  }
}

export const fetchFileUrl = async ({
  queryKey,
}: {
  queryKey: [string, string | number]
}) => {
  const [documentId] = queryKey
  try {
    const response = await apiClient.get(
      `${API_URLS.FILE.DOWNLOAD}/${documentId}`
    )
    return response.data
  } catch (error) {
    const errorResponse = error as CustomError
    const errorMessage = errorResponse.response?.data?.message
    throw new Error(errorMessage)
  }
}

export const fetchFileUrlInfo = async ({
  queryKey,
}: {
  queryKey: [string, string | number]
}) => {
  const [, documentId] = queryKey
  if (!documentId || documentId === '') {
    throw new Error('Invalid document ID')
  }
  if (String(documentId).startsWith('temp-')) {
    throw new Error('Temporary asset_id is not valid for download')
  }
  try {
    const url = `${API_URLS.FILE.DOWNLOAD}/${documentId}`.replace(/\/\/+/g, '/')
    const response = await apiClient.get(url, {
      responseType: 'blob',
    })
    if (response.headers['content-type'] === 'application/json') {
      const text = await response.data.text()
      const json = JSON.parse(text)
      throw new Error(`Server error: ${json.message ?? 'Invalid response'}`)
    }
    return response.data
  } catch (error: any) {
    let errorMessage = 'Failed to fetch file'
    let errorDetails = ''
    if (
      error.response?.data instanceof Blob &&
      error.response.data.type === 'application/json'
    ) {
      const text = await error.response.data.text()
      const json = JSON.parse(text)
      errorMessage = json.message ?? errorMessage
      errorDetails = json.error_code
        ? JSON.stringify(json.error_code)
        : JSON.stringify(json)
    } else if (error.message) {
      errorMessage = error.message
    }
    throw new Error(`${errorMessage}: ${errorDetails}`)
  }
}

export const getProductGroup = async () => {
  try {
    const response = await apiClient.get(API_URLS.PRODUCT.GROUP)
    return response.data
  } catch (error) {
    const errorResponse = error as CustomError
    const errorMessage = errorResponse.response?.data?.message
    throw new Error(errorMessage)
  }
}

export const getProductCategory = async () => {
  try {
    const response = await apiClient.get(API_URLS.PRODUCT.CATEGORY)
    return response.data
  } catch (error) {
    const errorResponse = error as CustomError
    const errorMessage = errorResponse.response?.data?.message
    throw new Error(errorMessage)
  }
}

export const getProductType = async () => {
  try {
    const response = await apiClient.get(API_URLS.PRODUCT.TYPE)
    return response.data
  } catch (error) {
    const errorResponse = error as CustomError
    const errorMessage = errorResponse.response?.data?.message
    throw new Error(errorMessage)
  }
}

export const getProductSubType = async (
  productTypeIds: (string | number)[] = []
) => {
  try {
    const query =
      productTypeIds.length > 0
        ? `?product_type_id=${productTypeIds.join(',')}`
        : ''
    const response = await apiClient.get(`${API_URLS.PRODUCT.SUB_TYPE}${query}`)
    return response.data
  } catch (error) {
    const errorResponse = error as CustomError
    const errorMessage =
      errorResponse.response?.data?.message ??
      'Failed to fetch product sub-types'
    throw new Error(errorMessage)
  }
}

export const getMarketList = async () => {
  try {
    const response = await apiClient.get(API_URLS.MARKET.LIST)
    return response.data
  } catch (error) {
    const errorResponse = error as CustomError
    const errorMessage = errorResponse.response?.data?.message
    throw new Error(errorMessage)
  }
}

export const getRegulationList = async ({
  queryKey,
}: {
  queryKey: [string, number | string]
}) => {
  const [, fetchedIDs] = queryKey
  try {
    const response = await apiClient.get(
      `${API_URLS.REGULATION.BASE}${fetchedIDs}`
    )
    return response.data
  } catch (error) {
    const errorResponse = error as CustomError
    const errorMessage = errorResponse.response?.data?.message
    throw new Error(errorMessage)
  }
}

export const getTagsList = async () => {
  try {
    const response = await apiClient.get('api/v1/dms/tags/all')
    return response.data
  } catch (error) {
    const errorResponse = error as CustomError
    const errorMessage =
      errorResponse.response?.data?.message ?? 'Failed to fetch tags'
    throw new Error(errorMessage)
  }
}

export const getUserAccess = async (menuInstanceType: string, menuInstanceTypeId: number) => {
  try {
    const response = await apiClient.get(
      `${USER_ACCESS_ENDPOINT}?menu_instance_type=${menuInstanceType}&menu_instance_type_id=${menuInstanceTypeId}`
    )
    return response.data
  } catch (error) {
    const errorResponse = error as CustomError
    const errorMessage = errorResponse.response?.data?.message
    throw new Error(errorMessage)
  }
}
