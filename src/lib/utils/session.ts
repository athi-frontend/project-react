import { showActionAlert } from '@/components/ui'
import { API_CLIENT_ERROR, LOGIN_URL } from '@/constants/common'
import { handleClearLocalStorage } from './common'
import { RefreshSessionResponse } from '@/types/common'
import { refreshSessionToken } from '@/services/common'

let refreshPromise: Promise<RefreshSessionResponse> | null = null
let refreshFailed = false

export const handleSessionTimeout = async () => {
  return await showActionAlert('customAlert', {
    title: API_CLIENT_ERROR.SESSION_TIMEOUT_TITLE,
    text: API_CLIENT_ERROR.SESSION_TIMEOUT_MESSAGE,
    icon: 'warning',
    cancelButton: false,
    confirmButton: true,
    confirmButtonText: API_CLIENT_ERROR.SESSION_TIMEOUT_BUTTON,
  }).then((result) => {
    if (result.isConfirmed) {
      // Clear local storage
      handleClearLocalStorage()
      window.location.href = LOGIN_URL
    }
  })
}

export function refreshSessionOnce(): Promise<RefreshSessionResponse> {
  refreshPromise ??= refreshSessionToken()
    .then((res) => {
      if (!res.success) {
        refreshFailed = true
      }
      return res
    })
    .catch((err) => {
      refreshFailed = true
      throw err
    })
    .finally(() => {
      refreshPromise = null
    })
  return refreshPromise
}

export function isRefreshBlocked() {
  return refreshFailed
}

export function setRefreshBlocked(data: boolean) {
  refreshFailed = data
}
