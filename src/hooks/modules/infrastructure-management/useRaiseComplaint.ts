/**
 * Classification : Confidential
 **/
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getAllComplaints,
  getComplaintById,
  upsertComplaint,
  deleteComplaint,
  getAllInfrastructureCategories,
  getAllInfrastructureTypes,
  getAllSerialNumbers,
} from '@/services/modules/infrastructure-management/raiseComplaint'
import { showActionAlert } from '@/components/ui'
import { NUMBERMAP, STATUS } from '@/constants/common'
import { RAISE_COMPLAINT_QUERY_KEYS } from '@/constants/modules/infrastructure-management/raiseComplaint'

export const useGetAllComplaints = () => {
  return useQuery({
    queryKey: [RAISE_COMPLAINT_QUERY_KEYS.LIST],
    queryFn: () => getAllComplaints(),
  })
}

export const useGetComplaintById = (complaintId: number | null) => {
  return useQuery({
    queryKey: [RAISE_COMPLAINT_QUERY_KEYS.FETCH_BY_ID, complaintId],
    queryFn: () => getComplaintById(complaintId),
    enabled: !!complaintId,
    placeholderData: undefined,
    staleTime: NUMBERMAP.ZERO,
    gcTime: NUMBERMAP.ZERO,
  })
}

export const useUpsertComplaint = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: FormData) => upsertComplaint(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [RAISE_COMPLAINT_QUERY_KEYS.LIST],
      })
      queryClient.invalidateQueries({
        queryKey: [RAISE_COMPLAINT_QUERY_KEYS.FETCH_BY_ID],
      })
      // Refetch all queries to ensure fresh data
      queryClient.refetchQueries({
        queryKey: [RAISE_COMPLAINT_QUERY_KEYS.LIST],
      })
      showActionAlert(STATUS.SUCCESS)
    },
    onError: () => {
      showActionAlert(STATUS.FAILED)
    },
  })
}

export const useDeleteComplaint = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (complaintId: number) => deleteComplaint(complaintId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [RAISE_COMPLAINT_QUERY_KEYS.LIST],
      })
      queryClient.invalidateQueries({
        queryKey: [RAISE_COMPLAINT_QUERY_KEYS.FETCH_BY_ID],
      })
      showActionAlert(STATUS.SUCCESS)
    },
    onError: () => {
      showActionAlert(STATUS.FAILED)
    },
  })
}

export const useGetAllInfrastructureCategories = () => {
  return useQuery({
    queryKey: [RAISE_COMPLAINT_QUERY_KEYS.INFRASTRUCTURE_CATEGORY],
    queryFn: () => getAllInfrastructureCategories(),
  })
}

export const useGetAllInfrastructureTypes = (infrastructureCategoryId: number | null) => {
  return useQuery({
    queryKey: [RAISE_COMPLAINT_QUERY_KEYS.INFRASTRUCTURE_TYPE, infrastructureCategoryId],
    queryFn: () => getAllInfrastructureTypes(infrastructureCategoryId),
    enabled: !!infrastructureCategoryId,
  })
}

export const useGetAllSerialNumbers = (infrastructureTypeId: number | null) => {
  return useQuery({
    queryKey: [RAISE_COMPLAINT_QUERY_KEYS.SERIAL_NUMBER, infrastructureTypeId],
    queryFn: () => getAllSerialNumbers(infrastructureTypeId),
    enabled: !!infrastructureTypeId,
  })
}

