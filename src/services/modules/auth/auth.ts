import { apiClient } from '../../../shared/apiClient'
import {
  AUTH_SERVICE_CONSTANTS,
  ERROR_MESSAGES,
} from '@/constants/modules/auth/login'

const {
  LOGIN_ENDPOINT,
  NETWORK_ERROR_MESSAGE,
  INVALID_CREDENTIALS_MESSAGE,
  LOGIN_FAILED_RETRY_MESSAGE,
} = AUTH_SERVICE_CONSTANTS

export const loginUser = async (username: string, password: string) => {
  try {
    const response = await apiClient.post(LOGIN_ENDPOINT, {
      username,
      password,
    })
    return response.data
  } catch (error) {
    const apiError = error as {
      response?: { status: number; data?: { message?: string; description?:string } }
    }

    if (!apiError.response) {
      throw new Error(NETWORK_ERROR_MESSAGE)
    }

    const { status } = apiError.response

    const errorMessage =
      status === 401
        ? INVALID_CREDENTIALS_MESSAGE
        : (ERROR_MESSAGES[status] ?? apiError.response?.data?.description)

    throw new Error(errorMessage)
  }
}
