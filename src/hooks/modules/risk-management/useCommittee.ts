/**
 * Classification : Confidential
 **/
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getCommitteeList,
  getCommitteeById,
  upsertCommittee,
  deleteCommittee,
  getEmployees,
} from '@/services/modules/risk-management/committee'
import { getRoles } from '@/services/common'
import { RISK_MANAGEMENT_QUERY_KEYS } from '@/constants/queryKeys'
import { CommitteeFormData } from '@/types/modules/risk/committee'
import { showActionAlert } from '@/components/ui'
import { SUCCESS, FAILED } from '@/constants/modules/dnd/pnd'

export const useGetCommitteeList = (projectId: number) => {
  return useQuery({
    queryKey: [RISK_MANAGEMENT_QUERY_KEYS.COMMITTEE.LIST, projectId],
    queryFn: () => getCommitteeList(projectId),
    enabled: !!projectId,
  })
}

export const useGetCommitteeById = (committeeId: number, projectId: number) => {
  return useQuery({
    queryKey: [RISK_MANAGEMENT_QUERY_KEYS.COMMITTEE.FETCH_BY_ID, committeeId],
    queryFn: () => getCommitteeById(committeeId, projectId),
    enabled: !!committeeId && !isNaN(committeeId),
  })
}

export const useGetRoles = () => {
  return useQuery({
    queryKey: ['roles'],
    queryFn: getRoles,
  })
}

export const useGetEmployees = (roleId?: number) => {
  return useQuery({
    queryKey: [RISK_MANAGEMENT_QUERY_KEYS.COMMITTEE.EMPLOYEES, roleId],
    queryFn: () => getEmployees(roleId),
    enabled: !!roleId,
  })
}

export const useUpsertCommittee = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (committeeData: CommitteeFormData) =>
      upsertCommittee(committeeData),
    onSuccess: (_, variables) => {
      // Invalidate all committee-related queries
      queryClient.invalidateQueries({
        queryKey: [RISK_MANAGEMENT_QUERY_KEYS.COMMITTEE.LIST],
      })
      queryClient.invalidateQueries({
        queryKey: [RISK_MANAGEMENT_QUERY_KEYS.COMMITTEE.FETCH_BY_ID],
      })
      showActionAlert(SUCCESS)
    },
    onError: (error: Error) => {
      showActionAlert(FAILED)
    },
  })
}

export const useDeleteCommittee = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (committeeId: number) => deleteCommittee(committeeId),
    onSuccess: () => {
      // Invalidate all committee-related queries
      queryClient.invalidateQueries({
        queryKey: [RISK_MANAGEMENT_QUERY_KEYS.COMMITTEE.LIST],
      })
      showActionAlert(SUCCESS)
    },
    onError: (error: Error) => {
      showActionAlert(FAILED)
    },
  })
}
