import { NUMBERMAP } from '@/constants/common'
import { API_ENDPOINTS } from '@/constants/modules/dnd/recordGeneration'
import { apiClient } from '@/shared/apiClient'


export const getDocumentsList = async (project_id: string,form_id:string) => {
  const response = await apiClient.get(`${API_ENDPOINTS.LIST}${project_id}`,{params:{form_id:form_id}})
  return response.data
}

export const getStepperList = async () => {
  const response = await apiClient.get(API_ENDPOINTS.GETSTEPPER,{
    params:{
      status:NUMBERMAP.ONE
    }
  })
  return response.data
}
