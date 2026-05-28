'use client'
import Swal from 'sweetalert2'
import { getLastApiError, getApiErrorMessage } from '@/lib/utils/common'


const actionMessages = {
  warning: {
    title: 'Warning!',
    text: 'Are you sure you want to proceed?',
    icon: 'warning',
    cancelButton: true,
    confirmButton: true,
  },
  info: {
    title: 'Info',
    text: 'Are you sure you want to proceed?',
    icon: 'info',
    cancelButton: false,
    confirmButton: false,
  },
  denied: {
    title: 'Access Denied',
    text: 'You do not have permission to perform this action.',
    icon: 'error',
    confirmButtonText: 'Back to home',
    cancelButton: false,
    confirmButton: true,
  },
  delete: {
    title: 'Delete Confirmation',
    text: 'Are you sure you want to delete this?',
    icon: 'warning',
    reverseButtons: true,
    cancelButton: true,
    confirmButton: true,
  },
  success: {
    title: 'Success!',
    text: 'Operation completed successfully.',
    icon: 'success',
    cancelButton: false,
    confirmButton: false,
  },

  failed: {
    title: 'Something went Wrong!',
    text: 'Please Try Again',
    icon: 'error',
    cancelButton: false,
    confirmButton: false,
  },
  customAlert: {
    title: 'Something went Wrong!',
    text: '',
    icon: 'error',
    cancelButton: false,
    confirmButton: false,
  },
} as const

type StatusKey = Exclude<keyof typeof actionMessages, 'customAlert'>

interface CustomAlert {
  title: string
  text: string
  icon: 'warning' | 'error' | 'success' | 'info'
  cancelButton: boolean
  confirmButton: boolean
  confirmButtonText?: string
  cancelButtonText?: string
}


// Function to get current theme colors from Redux store
const getThemeColorsFromStore = () => {
    const { store } = require('@/store/store')
    const state = store.getState()
    const themeState = state.theme
    
    if (themeState?.theme?.[themeState.mode]) {
      const currentTheme = themeState.theme[themeState.mode]
      return currentTheme
    }
    return {}
}

  /**
     * Function Name: showActionAlert
     * Params: status , custom
     * Description: Main function - automatically uses theme colors from Redux store
     * Author: Velmurugan
     * Created: 05-09-2025
      *Classification : Confidential
    **/
// Main function - automatically uses theme colors from Redux store
export const showActionAlert = (
  status: StatusKey | 'customAlert',
  customAlert?: CustomAlert
) => {

  let alertConfig: (typeof actionMessages)[StatusKey] | CustomAlert

  if (status === 'customAlert') {
    if (!customAlert) {
      throw new Error(
        "customAlert configuration is required when status is 'customAlert'"
      )
    }
    alertConfig = customAlert;
  } else if (status === 'failed') {
    const apiError = getLastApiError();
    if (apiError) {
      alertConfig = {
        ...actionMessages.failed,
        text: getApiErrorMessage(apiError),
      };
    } else {
      alertConfig = { ...actionMessages.failed };
    }
  } else {
    alertConfig = { ...actionMessages[status] };
  }
  
  // Get theme colors from Redux store
  const themeColors = getThemeColorsFromStore()
  return Swal.fire({
    title: alertConfig.title,
    text: alertConfig.text,
    icon: alertConfig.icon,
    showCancelButton: alertConfig.cancelButton,
    showConfirmButton: alertConfig.confirmButton,
    background: themeColors['--background-color']?? '',
    confirmButtonColor: themeColors['--primary-color']?? '',
    showCloseButton: true,
    color: themeColors['--text-color']?? '',
    cancelButtonColor: themeColors['--text-dark-color']?? '',
    confirmButtonText: alertConfig.confirmButtonText ?? 'Confirm',
    cancelButtonText: alertConfig.cancelButtonText ?? 'Cancel',
  })
}
