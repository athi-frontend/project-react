import { useMutation, useQuery } from '@tanstack/react-query'
import {
  fetchAllIncomingInspection,
  getIncomingInspectionDetail,
  getInitiateInspectionView,
  saveInitiateInspection,
} from '@/services/modules/quality-control-management/incomingInspection'
import { INCOMING_INSPECTION_QUERY_KEYS } from '@/constants/modules/quality-control-management/incomingInspection'
import {
  IncomingInspectionResponse,
  InitiateInspectionResponse,
  IncomingInspectionListResponse,
} from '@/types/modules/quality-control-management/incomingInspection'
import { NUMBERMAP } from '@/constants/common'

/**
 * Classification : Confidential
 **/

export const useAllIncomingInspection = (status?: number, workflowStatus?: string) => {
  return useQuery<IncomingInspectionListResponse>({
    queryKey: [INCOMING_INSPECTION_QUERY_KEYS.FETCH_ALL, status, workflowStatus],
    queryFn: () => fetchAllIncomingInspection(status, workflowStatus),
  })
}

export const useIncomingInspectionDetail = (purchaseOrderId?: number) => {
  const isEnabled = purchaseOrderId !== undefined && purchaseOrderId !== null
  return useQuery<IncomingInspectionResponse>({
    queryKey: [INCOMING_INSPECTION_QUERY_KEYS.DETAIL, purchaseOrderId],
    queryFn: () => {
      return getIncomingInspectionDetail(purchaseOrderId)
    },
    enabled: isEnabled,
  })
}


export const useInitiateInspectionViewWithSlug = (
  goodsInwardDetailId?: number,
  slug: 'unit' | 'batch' = 'unit'
) => {
  const isEnabled = goodsInwardDetailId !== undefined && goodsInwardDetailId !== null
  return useQuery<InitiateInspectionResponse>({
    queryKey: [INCOMING_INSPECTION_QUERY_KEYS.INITIATE_VIEW, goodsInwardDetailId, slug],
    queryFn: () => getInitiateInspectionView(goodsInwardDetailId, slug),
    enabled: isEnabled,
    staleTime: NUMBERMAP.ZERO,
    gcTime: NUMBERMAP.ZERO,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    placeholderData: undefined,
  })
}

export const useInitiateInspectionSave = () => {
  return useMutation({
    mutationFn: (payload: any) => saveInitiateInspection(payload),
  })
}

