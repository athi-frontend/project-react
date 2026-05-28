import { apiClient } from '@/shared/apiClient'
import {
  ValueFields,
  ERROR_MESSAGES,
  FETCH_PROFILE_API_BASE_PATH,
  UPLOAD_PROFILE_API_BASE_PATH,
  DELETE_PROFILE_API_BASE_PATH,
  USER_API_URLS,
} from '@/constants/modules/user/setting'
import { NUMBERMAP } from '@/constants/common'
import { UserProfileResponse } from '@/types/modules/user/userProfile'
import { CustomError } from '@/types/modules/user/shared'
import { extractProfileUrl } from '@/utils/modules/user/profileUtils'

/**Classification : Confidential */
export const fetchProfilePicture = async (userId: number) => {
  try {
    const response = await apiClient.get(
      `${FETCH_PROFILE_API_BASE_PATH}${userId}`
    )
    const userData = response.data.data[NUMBERMAP.ZERO]
    const extractedUrl = extractProfileUrl(userData)
    return {
      first_name: userData?.firstName,
      ...userData,
      profile_url: extractedUrl,

    }
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ??
        ERROR_MESSAGES.FETCH_PROFILE_PICTURE_ERROR
    )
  }
}

export const uploadProfilePicture = async (userId: number, file: File) => {
  const formData = new FormData()
  formData.append(ValueFields.DOCUMENTS_TO_CREATE, file)

  try {
    const response = await apiClient.post(
      `${UPLOAD_PROFILE_API_BASE_PATH}${userId}`,
      formData
    )
    const profileUrl = response.data.data?.profile_url
    const extractedUrl = extractProfileUrl(profileUrl)
    
    return {
      profile_url: extractedUrl,
    }
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ?? ERROR_MESSAGES.UPLOAD_FAILED_ERROR
    )
  }
}

export const removeProfilePicture = async (userId: number) => {
  try {
    const response = await apiClient.delete(
      `${DELETE_PROFILE_API_BASE_PATH}${userId}`
    )
    const profileUrl = response.data.data?.profile_url
    const extractedUrl = extractProfileUrl(profileUrl)
    
    return {
      profile_url: extractedUrl,
    }
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ?? ERROR_MESSAGES.REMOVE_FAILED_ERROR
    )
  }
}

// ABAC Workflow - Get User Profile
export const getUserProfile = async ({
  queryKey,
}: {
  queryKey: [string, number]
}): Promise<UserProfileResponse> => {
  const [, userId] = queryKey
  try {
    const response = await apiClient.get(USER_API_URLS.USER_PROFILE.FETCH(userId))
    return response.data
  } catch (error: any) {
    const errorResponse = error as CustomError
    const errorMessage = errorResponse.response?.data?.message ?? 
      'Failed to fetch user profile'
    throw new Error(errorMessage)
  }
}


// ABAC Workflow - Approve User Profile
export const approveUserProfile = async (userId: number, comment: string) => {
  try {
    const response = await apiClient.put(
      USER_API_URLS.USER_PROFILE.ACTION(userId, 'approve'),
      { comment }
    )
    return response.data
  } catch (error: any) {
    const errorResponse = error as CustomError
    const errorMessage = errorResponse.response?.data?.message ?? 
      'Failed to approve user profile'
    throw new Error(errorMessage)
  }
}

// ABAC Workflow - User Profile Picture Workflow Action
export const userProfilePictureWorkflowAction = async (data: any) => {
  try {
    const response = await apiClient.put(
      USER_API_URLS.USER_PROFILE.WORKFLOW_ACTION,
      data
    )
    return response.data
  } catch (error: any) {
    const errorResponse = error as CustomError
    const errorMessage = errorResponse.response?.data?.message ?? 
      'Failed to perform workflow action'
    throw new Error(errorMessage)
  }
}

// ABAC Workflow - Reject User Profile
export const rejectUserProfile = async (userId: number, comment: string) => {
  try {
    const response = await apiClient.put(
      USER_API_URLS.USER_PROFILE.ACTION(userId, 'reject'),
      { comment }
    )
    return response.data
  } catch (error: any) {
    const errorResponse = error as CustomError
    const errorMessage = errorResponse.response?.data?.message ?? 
      'Failed to reject user profile'
    throw new Error(errorMessage)
  }
}


// Get menu data from user-access endpoint
export const getUserAccessMenuData = async (menuId: number) => {
  try {
    const response = await apiClient.get(USER_API_URLS.USER_ACCESS.FOR_MENU(menuId))
    return response.data
  } catch (error: any) {
    const errorResponse = error as CustomError
    const errorMessage = errorResponse.response?.data?.message ?? 
      'Failed to fetch menu data'
    throw new Error(errorMessage)
  }
}
