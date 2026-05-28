'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getRoles,
  getGroup,
  getDesignation,
  getDepartment,
  getResponsibility,
} from '@/services/common'
import {
  insertUser,
  getProjectUsers,
  getUserById,
  updateUser,
  deleteUser,
  userOnboardWorkflowAction
} from '@/services/modules/user/userOnboard'
import { QUERYCONSTANTS, QUERYCONSTANTS as USER_ONBOARD_CONSTANTS } from '@/constants/modules/user/userOnboard'
import { showActionAlert } from '@/components/ui'
import { RawUser, WorkflowActionData } from '@/types/modules/user/userOnBoard'
import { STATUS } from '@/constants/common'

export const useRoles = () => {
  return useQuery({
    queryKey: [QUERYCONSTANTS.QUERY_KEYS.ROLES],
    queryFn: getRoles,
    initialData: [{ data: [] }],
    staleTime: 0,
  })
}

export const useGroup = () => {
  return useQuery({
    queryKey: [QUERYCONSTANTS.QUERY_KEYS.GROUP],
    queryFn: getGroup,
  })
}

export const useDesignation = () => {
  return useQuery({
    queryKey: [QUERYCONSTANTS.QUERY_KEYS.DESIGNATION],
    queryFn: getDesignation,
  })
}

export const useDepartment = () => {
  return useQuery({
    queryKey: [QUERYCONSTANTS.QUERY_KEYS.DEPARTMENT],
    queryFn: getDepartment,
  })
}

export const useResponsibility = () => {
  return useQuery({
    queryKey: [QUERYCONSTANTS.QUERY_KEYS.RESPONSIBILITY],
    queryFn: getResponsibility,
  })
}

export const useUserById = (userId: string, enabled: boolean) => {
  return useQuery({
    queryKey: [QUERYCONSTANTS.QUERY_KEYS.USER, userId],
    queryFn: () => getUserById(userId),
    enabled: enabled && !!userId && userId !== 'new',
    staleTime: 0,
    select: (res) => {
      // Normalize response so that `res.data` is always an array for consumers
      if (res?.data && !Array.isArray(res.data)) {
        // Handle both 'draft' and 'project' responses where data is an object
        return { ...res, data: [res.data] }
      }
      return res
    },
  })
}

export const useUpsertUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpsertUserPayload) => {
      if ('id' in data) {
        return updateUser(data.id, data.data)
      }
      return insertUser(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries([QUERYCONSTANTS.QUERY_KEYS.PROJECT_USERS])
      showActionAlert(QUERYCONSTANTS.ALERT_TYPES.SUCCESS)
    },
    onError: () => {
      showActionAlert(STATUS.FAILED)
    },
  })
}

export const useProjectUsers = () => {
  return useQuery({
    queryKey: [QUERYCONSTANTS.QUERY_KEYS.PROJECT_USERS],
    queryFn: getProjectUsers,
    initialData: [],
    staleTime: 0,
  })
}

export const useDeleteUser = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (userId: string) => deleteUser(userId),
    onMutate: async (userId) => {
      await queryClient.cancelQueries({
        queryKey: [QUERYCONSTANTS.QUERY_KEYS.USERS],
      })
      const previousUsers = queryClient.getQueryData<UserListQueryResponse>([
        QUERYCONSTANTS.QUERY_KEYS.USERS,
      ])
      queryClient.setQueryData<UserListQueryResponse>(
        [QUERYCONSTANTS.QUERY_KEYS.USERS],
        (old) => {
          if (!old?.data) return old
          return {
            ...old,
            data: old.data.map((user: RawUser) =>
              user.id === userId ? { ...user, status: 0 } : user
            ),
          }
        }
      )
      return { previousUsers }
    },
    onError: (err, userId, context) => {
      queryClient.setQueryData(
        [QUERYCONSTANTS.QUERY_KEYS.USERS],
        context?.previousUsers
      )
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERYCONSTANTS.QUERY_KEYS.USERS],
      })
    },
  })
}

/**
 * User onboarding workflow action hook
 */
export const useUserOnboardWorkflowAction = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: WorkflowActionData) => userOnboardWorkflowAction(data),
    onSuccess: () => {
      // Invalidate both user onboard and user queries to refresh data
      queryClient.invalidateQueries({ queryKey: [USER_ONBOARD_CONSTANTS.QUERY_KEYS.USER_ONBOARD] })
      queryClient.invalidateQueries({ queryKey: [USER_ONBOARD_CONSTANTS.QUERY_KEYS.USER] })
      showActionAlert(STATUS.SUCCESS)
    },
    onError: () => {
      showActionAlert(STATUS.FAILED)
    },
  })
}

