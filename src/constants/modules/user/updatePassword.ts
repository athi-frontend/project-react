export const UPDATE_PASSWORD = {
  CURRENT_PASSWORD_KEY: 'currentPassword',
  NEW_PASSWORD_KEY: 'newPassword',
  CONFIRM_PASSWORD_KEY: 'confirmPassword',
  TEXT_TYPE: 'text',
  PASSWORD_TYPE: 'password',
  SAVE_BUTTON_LABEL: 'Save',
  SAVING_BUTTON_LABEL: 'Saving...',
  DEFAULT_API_ERROR: 'An error occurred. Please try again.',
  NEW_PASSWORD_LABEL: 'New Password',
  NEW_PASSWORD_PLACEHOLDER: 'Enter new password',
  CURRENT_PASSWORD_PLACEHOLDER: 'Enter current password',
  CONFIRM_PASSWORD_LABEL: 'Confirm Password',
  CONFIRM_PASSWORD_PLACEHOLDER: 'Confirm new password',
  LOGO_ALT: 'Logo',
  API_ERROR_KEY: 'apiError',
  CURRENT_PASSWORD_REQUIRED: 'Current Password is required',
  NEW_PASSWORD_REQUIRED: 'New Password is required',
  CONFIRM_PASSWORD_REQUIRED: 'Confirm Password is required',
  PASSWORDS_DO_NOT_MATCH: 'Passwords do not match',
  FORM_SUBTITLE: 'Secure your account by updating your password regularly',
  CURRENT_PASSWORD_LABEL: 'Current Password',
  HANDLE_SUBMIT_LOG: 'handleSubmit called',
  VALIDATION_FAILED_LOG: 'Form validation failed',
  SENDING_PAYLOAD_LOG: 'Sending payload to API:',
  API_SUCCESS_LOG: 'API call successful',
  API_FAILED_LOG: 'failed',
  API_ERROR_LOG: 'API call failed',
  FORM_TITLE: 'Update Password',
  CANCEL: 'Cancel',
  UPDATE: 'Update',
}

export const PASSWORD_MIN_LENGTH = 8

export const ERROR_MESSAGES = {
  CURRENT_PASSWORD_REQUIRED: 'Current Password is required',
  CURRENT_PASSWORD_MIN_LENGTH: 'Current Password must be at least 8 characters',
  NEW_PASSWORD_REQUIRED: 'New Password is required',
  NEW_PASSWORD_MIN_LENGTH: 'New Password must be at least 8 characters',
  NEW_PASSWORD_COMPLEXITY:
    'New Password must contain at least one uppercase letter, one number, and one special character',
  CONFIRM_PASSWORD_REQUIRED: 'Confirm Password is required',
  PASSWORDS_DO_NOT_MATCH: 'Passwords do not match',
}

export const PASSWORD_REGEX =
  /^(?=[^A-Z\n]*[A-Z])(?=[^\d\n]*\d)(?=[^!@#$%^&*\n]*[!@#$%^&*]).+$/
