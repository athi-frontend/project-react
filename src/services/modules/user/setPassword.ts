import { useMutation } from '@tanstack/react-query'
import { apiClient } from '@/shared/apiClient'
import { CREATE_PASSWORD_CONSTANTS } from '@/constants/modules/user/settingPassword'
import {
  SetPasswordPayload,
  ApiResponse,
} from '@/types/modules/user/settingPassword'

const handlePasswordError = (error: any): never => {
  const {
    ERRORS,
    api: {
      ECONNABORTED_ERROR_CODE,
      ERR_NETWORK_ERROR_CODE,
      UNKNOWN_ERROR_CODE,
    },
  } = CREATE_PASSWORD_CONSTANTS

  const errorMap: Record<string, string> = {
    [ECONNABORTED_ERROR_CODE]: ERRORS.TIMEOUT,
    [ERR_NETWORK_ERROR_CODE]: ERRORS.NETWORK,
  }

  const errorCode = error.code ?? UNKNOWN_ERROR_CODE
  const errorMessage =
    errorMap[errorCode] ?? error.response?.data?.message ?? ERRORS.DEFAULT

  throw new Error(errorMessage)
}

const handlePasswordUpdate = async (
  endpoint: string,
  payload: SetPasswordPayload,
  method: 'put' | 'post'
): Promise<{ message: string }> => {
  try {
    const { token, ...rest } = payload
    const url = `${endpoint}/${token}`

    const { data } =
      method === 'post'
        ? await apiClient.post<ApiResponse>(url, rest)
        : await apiClient.put<ApiResponse>(url, rest)

    const { code, status, message } = data

    if (
      code === 200 &&
      status === CREATE_PASSWORD_CONSTANTS.api.SUCCESS_STATUS
    ) {
      return {
        message: CREATE_PASSWORD_CONSTANTS.api.PASSWORD_SET_SUCCESS_MESSAGE,
      }
    }

    throw new Error(message ?? CREATE_PASSWORD_CONSTANTS.ERRORS.API_DEFAULT)
  } catch (error: any) {
    handlePasswordError(error)
  }
}

export const setPassword = (payload: SetPasswordPayload) =>
  handlePasswordUpdate(
    CREATE_PASSWORD_CONSTANTS.api.SET_PASSWORD_ENDPOINT,
    payload,
    'post'
  )

export const resetPassword = (payload: SetPasswordPayload) =>
  handlePasswordUpdate(
    CREATE_PASSWORD_CONSTANTS.api.RESET_PASSWORD_ENDPOINT,
    payload,
    'put'
  )

export const useSetPasswordMutation = () =>
  useMutation({ mutationFn: setPassword })

export const useResetPasswordMutation = () =>
  useMutation({ mutationFn: resetPassword })
