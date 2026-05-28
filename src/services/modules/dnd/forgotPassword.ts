import { apiClient } from '../../../shared/apiClient'
import { ApiEndpoints } from '@/constants/modules/auth/forgotPassword'

export const recoverPassword = async (email: string) => {
  const response = await apiClient.put(ApiEndpoints.FORGOT_PASSWORD, {
    username: email,
  })
  return response.data
}
