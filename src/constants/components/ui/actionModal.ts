export const validIcons = ['warning', 'error', 'success', 'info'] as const

export const actionMessages = {
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
    cancelButton: true,
    confirmButton: false,
  },
  delete: {
    title: 'Delete',
    text: 'Are you sure you want to delete this?',
    icon: 'warning',
    cancelButton: true,
    confirmButton: true,
  },
  success: {
    title: 'Success!',
    text: 'Your form has been submitted successfully.',
    icon: 'success',
    cancelButton: false,
    confirmButton: false,
  },
  customAlert: {
    title: 'Access Denied!',
    text: '',
    icon: 'error',
    cancelButton: false,
    confirmButton: false,
  },
} as const
