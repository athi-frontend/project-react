import { apiClient } from '../../../shared/apiClient'
import { API_URLS } from '@/constants/modules/user/userInfo'
import { UserStatusProps } from '@/types/modules/user/userInfo'

export const getUserInfo = async (userId: number) => {
  const apiUrl = API_URLS.FETCH_USER_INFO(userId)
  const response = await apiClient.get(apiUrl)
  return response.data
}

export const putUserStatus = async (userId: number, body: UserStatusProps) => {
  const apiUrl = API_URLS.CHANGE_USER_STATUS(userId)
  const response = await apiClient.put(apiUrl, body)
  return response.data
}
