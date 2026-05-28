import { apiClient } from '../../../shared/apiClient'

export const recoverPin = async (email: string) => {
  const response = await apiClient.put('/auth/forget-pin', { username: email })
  return response.data
}
