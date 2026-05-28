import { ApiEndpoints } from '@/constants/modules/auth/forgotPassword'
import { apiClient } from '../../../shared/apiClient'

export const recoverPin = async (email: string) => {
  const response = await apiClient.put(ApiEndpoints.FORGOT_PIN, {
    username: email,
  })
  return response.data
}
