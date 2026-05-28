import { NUMBERMAP } from '@/constants/common'
import { apiClient } from '../../../shared/apiClient'
import { PND_API_ENDPOINTS } from '@/constants/modules/dnd/pnd'
import { transformPNDResponse } from '@/lib/modules/dnd/pnd'

export const getProductCategory = async () => {
  const response = await apiClient.get(PND_API_ENDPOINTS.GET_PRODUCT_CATEGORY, {
    params : { status : NUMBERMAP.ONE}
  })
  return response.data
}

export const getEndUser = async () => {
  const response = await apiClient.get(PND_API_ENDPOINTS.GET_END_USER, {
    params : { status : NUMBERMAP.ONE}
  })
  return response.data
}

export const getBuyer = async () => {
  const response = await apiClient.get(PND_API_ENDPOINTS.GET_BUYER, {
    params : { status : NUMBERMAP.ONE}
  })
  return response.data
}

export const fetchPNDByProjectId = async (projectId: number) => {
  const url = PND_API_ENDPOINTS.FETCH_PND(projectId)
  const response = await apiClient.get(url)
  const pnd_itemsList = response.data?.data ?? [];
  const pndData = pnd_itemsList[NUMBERMAP.ZERO]?.pndData;
   return { data: transformPNDResponse(response.data.data),default_pnd_specification_template_id:response?.data?.data[NUMBERMAP.ZERO]?.default_pnd_specification_template_id, pnd_data: pndData, permissions: response.data.meta_info?.action_control, meta_info: response.data.meta_info }
}

export const submitProjectPND = async (projectPNDData: FormData) => {
  const response = await apiClient.post(
    PND_API_ENDPOINTS.SUBMIT_PND,
    projectPNDData
  )
  return response.data
}

export const fetchPNDSpecification = async (projectId: number) => {
  const url = PND_API_ENDPOINTS.FETCH_PND_SPECIFICATION(projectId)
  const response = await apiClient.get(url)
  return response.data
}

export const createPNDSpecification = async (
  pndSpecificationData: FormData
) => {
  const response = await apiClient.post(
    PND_API_ENDPOINTS.CREATE_PND_SPECIFICATION,
    pndSpecificationData
  )
  return response.data
}

export const updatePNDSpecification = async (
  id: number,
  data: { parameter: string; specification: string }
) => {
  const url = PND_API_ENDPOINTS.UPDATE_DELETE_PND_SPECIFICATION(id)
  const response = await apiClient.put(url, data, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
  return response.data
}

export const deletePNDSpecification = async (pnd_specification_id: number) => {
  const url =
    PND_API_ENDPOINTS.UPDATE_DELETE_PND_SPECIFICATION(pnd_specification_id)
  const response = await apiClient.delete(url)
  return response.data
}

export const downloadTemplate = async (templateId:number): Promise<void> => {
  const apiResponse = await apiClient.get(PND_API_ENDPOINTS.TEMPLATE_DOWNLOAD(templateId))
  const assetUrl = apiResponse.data?.data?.[NUMBERMAP.ZERO]?.assetUrl
  if (!assetUrl) {
    throw new Error('Asset URL not found in the API response')
  }

  const fileResponse = await fetch(assetUrl, {
    method: 'GET',
  })

  if (!fileResponse.ok) {
    throw new Error(
      `Failed to fetch file from asset URL: ${fileResponse.statusText}`
    )
  }

  const blob = await fileResponse.blob()
  let filename = 'template.xlsx'
  const disposition = fileResponse.headers.get('content-disposition')

  if (disposition?.includes('attachment')) {
    const filenameRegex = /filename="([^"]+)"/
    const matches = filenameRegex.exec(disposition)
    filename = matches?.[1] ?? filename
  }

  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}
