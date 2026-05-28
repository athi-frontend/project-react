import { useMutation, UseMutationResult } from '@tanstack/react-query'
import { loginUser } from '@/services/modules/auth/auth'
import { LoginPayload, LoginResponse } from '@/types/modules/auth/login'
import { LOGIN_CONSTANTS } from '@/constants/modules/auth/login'
import { recoverPin } from '@/services/modules/auth/recoverPin'

export const useLoginUser = (): UseMutationResult<
  LoginResponse,
  unknown,
  LoginPayload
> => {
  return useMutation({
    mutationFn: ({ email, password }: LoginPayload) =>
      loginUser(email, password),
    onSuccess: (response) => {
      const { access_token, id_token, rbac_token, refresh_token } =
        response.data
      localStorage.setItem(LOGIN_CONSTANTS.ACCESS_TOKEN, access_token ?? '')
      localStorage.setItem(LOGIN_CONSTANTS.ID_TOKEN, id_token ?? '')
      localStorage.setItem(LOGIN_CONSTANTS.RBAC_TOKEN, rbac_token ?? '')
      localStorage.setItem(LOGIN_CONSTANTS.REFRESH_TOKEN, refresh_token ?? '')
    },
    onError: (error: any) => {
      throw error
    },
  })
}

export const useRecoverPin = () => {
  return useMutation({
    mutationFn: recoverPin,
  })
}
