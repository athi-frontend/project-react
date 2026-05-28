import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getUserProfile, fetchProfilePicture, uploadProfilePicture, removeProfilePicture, rejectUserProfile, getUserAccessMenuData, userProfilePictureWorkflowAction, approveUserProfile } from '@/services/modules/user/settingProfile'
import { RESPONSE_KEYS, ValueFields, API } from '@/constants/modules/user/setting'
import { UserProfileQueryKey } from '@/types/modules/user/userProfile'

/**
 * ABAC Workflow - User Profile Hook
 * 
 * This hook fetches user profile data for the ABAC workflow.
 * The HR head will be notified directly via mail and has approve/reject buttons.
 * There is no submit for approval button in the user profile.
 * 
 * @param userId - The user ID to fetch profile for
 * @returns React Query hook for user profile data
 */
export const useUserProfile = (userId: number) => {
  const { USER_PROFILE } = RESPONSE_KEYS

  return useQuery({
    queryKey: [USER_PROFILE, userId] as UserProfileQueryKey,
    queryFn: getUserProfile,
    enabled: !!userId,
    refetchOnWindowFocus: false,
  })
}

/**
 * Profile Picture Fetch Hook
 * 
 * This hook fetches the user's profile picture URL.
 * 
 * @param userId - The user ID to fetch profile picture for
 * @returns React Query hook for profile picture data
 */
export const useProfilePictureFetch = (userId: number) => {
  return useQuery({
    queryKey: [ValueFields.PROFILE_PICTURE_QUERY, userId],
    queryFn: () => fetchProfilePicture(userId),
    enabled: !!userId,
    refetchInterval: API.REFETCH_INTERVAL,
    refetchIntervalInBackground: true,
  })
}

/**
 * Profile Picture Upload Hook
 * 
 * This hook handles uploading a new profile picture for a user.
 * 
 * @returns React Query mutation for profile picture upload
 */
export const useProfilePictureUpload = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, file }: { userId: number; file: File }) =>
      uploadProfilePicture(userId, file),
    onSuccess: (_, { userId }) => {
      // Invalidate and refetch profile picture data
      queryClient.invalidateQueries({
        queryKey: [ValueFields.PROFILE_PICTURE_QUERY, userId],
      })
    },
  })
}

/**
 * Profile Picture Remove Hook
 * 
 * This hook handles removing a user's profile picture.
 * 
 * @returns React Query mutation for profile picture removal
 */
export const useProfilePictureRemove = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userId: number) => removeProfilePicture(userId),
    onSuccess: (_, userId) => {
      // Invalidate and refetch profile picture data
      queryClient.invalidateQueries({
        queryKey: [ValueFields.PROFILE_PICTURE_QUERY, userId],
      })
    },
  })
}


/**
 * Approve User Profile Hook
 * 
 * This hook handles approving a user's profile in the ABAC workflow.
 * 
 * @returns React Query mutation for user profile approval
 */
export const useApproveUserProfile = () => {
  const queryClient = useQueryClient()
  const { USER_PROFILE } = RESPONSE_KEYS

  return useMutation({
    mutationFn: ({ userId, comment }: { userId: number; comment: string }) =>
      approveUserProfile(userId, comment),
    onSuccess: (_, { userId }) => {
      // Invalidate and refetch user profile data
      queryClient.invalidateQueries({
        queryKey: [USER_PROFILE, userId],
      })
    },
  })
}

/**
 * Reject User Profile Hook
 * 
 * This hook handles rejecting a user's profile in the ABAC workflow.
 * 
 * @returns React Query mutation for user profile rejection
 */
export const useRejectUserProfile = () => {
  const queryClient = useQueryClient()
  const { USER_PROFILE } = RESPONSE_KEYS

  return useMutation({
    mutationFn: ({ userId, comment }: { userId: number; comment: string }) =>
      rejectUserProfile(userId, comment),
    onSuccess: (_, { userId }) => {
      // Invalidate and refetch user profile data
      queryClient.invalidateQueries({
        queryKey: [USER_PROFILE, userId],
      })
    },
  })
}

/**
 * User Profile Picture Workflow Action Hook
 * 
 * This hook handles workflow actions for user profile pictures.
 * 
 * @returns React Query mutation for workflow actions
 */
export const useUserProfilePictureWorkflowAction = () => {
  const queryClient = useQueryClient()
  const { USER_PROFILE } = RESPONSE_KEYS

  return useMutation({
    mutationFn: (data: any) => userProfilePictureWorkflowAction(data),
    onSuccess: (_, data) => {
      // Invalidate and refetch user profile data
      queryClient.invalidateQueries({
        queryKey: [USER_PROFILE, data.context_id],
      })
    },
  })
}

/**
 * Hook to get menu data from user-access endpoint
 * 
 * @param menuId - The menu ID to fetch data for
 * @returns React Query hook for menu data
 */
export const useUserAccessMenuData = (menuId: number) => {
  return useQuery({
    queryKey: ['userAccessMenu', menuId],
    queryFn: () => getUserAccessMenuData(menuId),
    enabled: !!menuId,
  })
}