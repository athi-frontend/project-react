import { apiClient } from '../../../shared/apiClient'
import { ApiEndpoints } from '@/constants/modules/auth/forgotpin'

export const recoverPin = async (email: string) => {
  const response = await apiClient.put(ApiEndpoints.FORGOT_PIN, {
    username: email,
  })
  return response.data
}
