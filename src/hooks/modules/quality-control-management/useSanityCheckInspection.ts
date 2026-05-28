/**
 * Classification : Confidential
 **/
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getSanityCheckInspectionList,
  getSanityCheckInspectionById,
  upsertSanityCheckInspection,
  deleteSanityCheckInspection,
  getSpecificationChecklist,
} from '@/services/modules/quality-control-management/sanityCheckInspection'
import { PURCHASE_QUERY_KEYS } from '@/constants/queryKeys'
import { SanityCheckInspectionFormData } from '@/types/modules/quality-control-management/sanityCheckInspection'
import { showActionAlert } from '@/components/ui'
import { SUCCESS, FAILED } from '@/constants/modules/dnd/pnd'

export const useGetSanityCheckInspectionList = () => {
  return useQuery({
    queryKey: [PURCHASE_QUERY_KEYS.SANITY_CHECK_INSPECTION.LIST],
    queryFn: getSanityCheckInspectionList,
  })
}

export const useGetSanityCheckInspectionById = (
  sanityCheckInspectionId: number | null
) => {
  return useQuery({
    queryKey: [
      PURCHASE_QUERY_KEYS.SANITY_CHECK_INSPECTION.FETCH_BY_ID,
      sanityCheckInspectionId,
    ],
    queryFn: () => getSanityCheckInspectionById(sanityCheckInspectionId),
    enabled: !!sanityCheckInspectionId,
  })
}

export const useGetSpecificationChecklist = (
  purchaseOrderId: number | null,
  enabled: boolean = false
) => {
  return useQuery({
    queryKey: [
      PURCHASE_QUERY_KEYS.SANITY_CHECK_INSPECTION.SPECIFICATION_CHECKLIST,
      purchaseOrderId,
    ],
    queryFn: () => getSpecificationChecklist(purchaseOrderId),
    enabled: enabled && !!purchaseOrderId,
  })
}

export const useUpsertSanityCheckInspection = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: SanityCheckInspectionFormData) =>
      upsertSanityCheckInspection(data),
    onSuccess: () => {
      // Invalidate list query
      queryClient.invalidateQueries({
        queryKey: [PURCHASE_QUERY_KEYS.SANITY_CHECK_INSPECTION.LIST],
      })
      // Invalidate fetch by id query
      queryClient.invalidateQueries({
        queryKey: [PURCHASE_QUERY_KEYS.SANITY_CHECK_INSPECTION.FETCH_BY_ID],
      })
      // Invalidate part details (used when part number is selected)
      queryClient.invalidateQueries({
        queryKey: [PURCHASE_QUERY_KEYS.SANITY_CHECK_INSPECTION.PART_DETAILS],
      })
      showActionAlert(SUCCESS)
    },
    onError: (error: Error) => {
      showActionAlert(FAILED)
    },
  })
}

export const useDeleteSanityCheckInspection = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (sanityCheckInspectionId: number) =>
      deleteSanityCheckInspection(sanityCheckInspectionId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [PURCHASE_QUERY_KEYS.SANITY_CHECK_INSPECTION.LIST],
      })
      showActionAlert(SUCCESS)
    },
    onError: (error: Error) => {
      showActionAlert(FAILED)
    },
  })
}
