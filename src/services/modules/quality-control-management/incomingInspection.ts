import { apiClient } from '@/shared/apiClient'
import { INCOMING_INSPECTION_ENDPOINTS } from '@/constants/modules/quality-control-management/incomingInspection'
import {
  IncomingInspectionResponse,
  InitiateInspectionResponse,
  IncomingInspectionListResponse,
} from '@/types/modules/quality-control-management/incomingInspection'

/**
 * Classification : Confidential
 **/

export const fetchAllIncomingInspection = async (
  status?: number,
  workflowStatus?: string
): Promise<IncomingInspectionListResponse> => {
  const response = await apiClient.get(INCOMING_INSPECTION_ENDPOINTS.FETCH_ALL, {
    params: { 
      status: status,
      workflow_status: workflowStatus,
    },
  })
  return response.data
}

export const getIncomingInspectionDetail = async (
  purchaseOrderId: number
): Promise<IncomingInspectionResponse> => {
  const response = await apiClient.get(
    INCOMING_INSPECTION_ENDPOINTS.DETAIL(purchaseOrderId)
  )
  return response.data
}

export const getInitiateInspectionView = async (
  goodsInwardDetailId: number,
  slug: 'unit' | 'batch' = 'unit'
): Promise<InitiateInspectionResponse> => {
  const response = await apiClient.get(
    INCOMING_INSPECTION_ENDPOINTS.INITIATE_VIEW(goodsInwardDetailId),
    { params: { part_quantity_type: slug } }
  )
  return response.data
}

export const saveInitiateInspection = async (
  payload: any
) => {
  const response = await apiClient.post(
    INCOMING_INSPECTION_ENDPOINTS.INITIATE_SAVE,
    payload
  )
  return response.data
}

