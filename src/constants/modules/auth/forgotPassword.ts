export const EMAIL_REQUIRED_ERROR = 'Email is required'
export const INVALID_EMAIL_ERROR = 'Please enter a valid email address'
export const SUCCESS_MESSAGE =
  'Password recovery link has been sent to your email.'
export const FAILED_MESSAGE =
  'Failed to send recovery link. Please try again later.'
export const GENERAL_ERROR_MESSAGE = 'User not exist. Please try again.'

export const FORGOT_PASSWORD_TITLE = 'Forgot Password'
export const FORGOT_PASSWORD_SUBTITLE =
  "Enter your email and we'll send you a link to reset your Password"
export const EMAIL_PLACEHOLDER = 'Enter your Email Address'
export const RECOVER_PASSWORD_BUTTON_TEXT = 'Recover Password'
export const SENDING_BUTTON_TEXT = 'Sending...'

export const INPUT_TYPE = 'email'
export const INPUT_ARIA_LABEL = 'Email Address'
export const BUTTON_VARIANT = 'contained'
export const SUCCESS_STATUS = 'success'
export const FORM_COMPONENT = 'form'
export const SUBMIT_TYPE = 'submit'

export const ApiEndpoints = {
  FORGOT_PASSWORD: 'api/v1/auth/forgot-password-pin',
  FORGOT_PIN: 'api/v1/auth/forgot-password-pin',
  RESET_PASSWORD_URL :'/api/v1/auth/reset-password',
  RESET_PIN_URL : '/api/v1/auth/reset-pin'

}
