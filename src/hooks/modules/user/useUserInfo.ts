import { useQuery, useMutation } from '@tanstack/react-query'
import { getUserInfo, putUserStatus } from '@/services/modules/user/userInfo'
import { RESPONSE_KEYS } from '@/constants/modules/user/userInfo'
import { UserStatusProps } from '@/types/modules/user/userInfo'
const { USER_INFO } = RESPONSE_KEYS

export const useUserInfo = (userId: number) => {
  return useQuery({
    queryKey: [USER_INFO, userId],
    queryFn: () => getUserInfo(userId),
    enabled: !!userId,
  })
}

export const usePutUserStatus = () => {
  return useMutation({
    mutationFn: ({ userId, body }: { userId: number; body: UserStatusProps }) =>
      putUserStatus(userId, body),
  })
}
