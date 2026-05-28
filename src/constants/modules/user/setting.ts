import { API_URLS } from "@/constants/common"
import { buildWorkflowActionUrl } from "@/utils/modules/user/profileUtils"

export const UI = {
  DEFAULT_IMAGE:'',
  TITLE_VARIANT: 'h5' as const,
  PROFILE_ALT_TEXT: 'Profile picture',
  INPUT_TYPE: 'file',
  INPUT_ID: 'profile-picture-upload',
  BUTTON_AS_SPAN: 'span' as const,
  TITLE_UPDATE_PROFILE_PICTURE: 'Update Profile Picture',
  TITLE_USER_PROFILE_REVIEW: (id: string | string[] | undefined) => `User Profile Review - ID: ${id}`,
}

export const ValueFields = {
  DOCUMENTS_TO_CREATE: 'documents_to_create',
  PROFILE_API_BASE_PATH: '/organization/user-profile/',
  PROFILE_PICTURE_QUERY: 'profilePicture',
}

export const FETCH_PROFILE_API_BASE_PATH = 'api/v1/organization/users/'
export const UPLOAD_PROFILE_API_BASE_PATH =
  'api/v1/organization/users/user-profile/'
export const DELETE_PROFILE_API_BASE_PATH =
  'api/v1/organization/users/user-profile/'

// ABAC Workflow API endpoints
export const USER_PROFILE_API_BASE_PATH = 'api/v1/organization/users/user-profile/'

export const COLORTYPE = {
  ERROR_COLOR: 'error',
  SUCCESS_COLOR: 'success.main',
}
export const FILE = {
  MAX_FILE_SIZE: 2 * 1024 * 1024,
  ALLOWED_FORMATS: ['image/jpeg', 'image/jpg', 'image/png'],
  ACCEPTED_IMAGE_TYPES: 'image/jpeg,image/jpg,image/png',
}

export const API = {
  STRING_TYPE: 'string',
  REFETCH_INTERVAL: 3600000,
}

export const ERROR_MESSAGES = {
  FILE_SIZE_ERROR: 'File size must be less than 2MB',
  FILE_FORMAT_ERROR: 'Only JPG, JPEG, and PNG formats are allowed',
  NO_FILE_SELECTED_ERROR: 'No file selected to save',
  UPLOAD_FAILED_ERROR: 'Upload failed',
  REMOVE_FAILED_ERROR: 'Failed to remove profile picture',
  FETCH_PROFILE_PICTURE_ERROR: 'Failed to fetch profile picture',
  REMOVAL_FAILED_ERROR: 'Removal failed',
  REMOVE_CURRENT_ERROR:
    'Please remove the current image before uploading a new one.',
  INVALID_PROFILE_URL: 'Failed to retrieve profile picture URL',
}

export const ALERT_TYPES = {
  SUCCESS: 'success',
  FAILED: 'failed',
  CUSTOM_ALERT: 'customAlert',
} as const

export const ALET_MESSAGES = {
  ACCESS_DENIED_TITLE: 'Successfully Removed',
  USER_EXISTS_TEXT: 'User Profile Removed.',
  ERROR_ICON: 'success' as const,
  ERROR: 'error' as const,

  PROFILE_NOT_EXIST: 'User Profile Not Exist',
  SUCCESS_TITLE: 'Success',
  SUCCESS_TEXT: 'User Profile Successfully Updated.',
}

export const LOADING_STATES = {
  PROCESSING_TEXT: 'Processing...',
  UPLOAD_TEXT: 'Upload',
}

export const ALERT_MESSAGES = {
  ACCESS_DENIED_TITLE: 'Profile Removed',
  USER_EXISTS_TEXT: 'Profile picture removed successfully',
  ERROR_ICON: 'error',
  SUCCESS_ICON: 'success' as const,
  PROFILE_NOT_EXIST: 'Profile Not Found',
  SUCCESS_TITLE: 'Success',
  SUCCESS_TEXT: 'Profile picture updated successfully',
}

// ABAC Workflow API URLs
export const USER_API_URLS = {
  USER_PROFILE: {
    BASE: USER_PROFILE_API_BASE_PATH,
    FETCH: (userId: number) => `${USER_PROFILE_API_BASE_PATH}${userId}`,
    ACTION: (userId: number, action: 'approve' | 'reject') => `${USER_PROFILE_API_BASE_PATH}${userId}?action=${action}`,
    WORKFLOW_ACTION: API_URLS.WORKFLOW_ACTION,
    WORKFLOW_ACTION_WITH_PARAMS: (userId?: number, contextType?: string, menuId?: number) => 
      buildWorkflowActionUrl(API_URLS.WORKFLOW_ACTION, userId, contextType, menuId),
  },
  USER_ACCESS: {
    BASE: API_URLS.USER_ACCESS,
    FOR_MENU: API_URLS.USER_ACCESS_FOR_MENU,
  },
}

// Response keys for ABAC workflow
export const RESPONSE_KEYS = {
  USER_PROFILE: 'userProfile',
}

// Context types for workflow
export const CONTEXT_TYPES = {
  USER_ONBOARDING: 'user_onboarding',
}

// Note: Menu IDs are now dynamically fetched from API using getUserProfilePictureMenuId utility function
// This ensures menu IDs are always up-to-date and consistent with the backend configuration

// Profile URL property keys for extracting URLs from objects
export const PROFILE_URL_KEYS = [
  'url', 'image_url', 'profile_image_url', 'profile_url', 
  'src', 'path', 'link', 'image', 'photo', 'avatar'
] as const
