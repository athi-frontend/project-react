import { PasswordPolicy } from '@/types/modules/user/settingPassword'

export const PAYLOAD_KEYS = {
  NEW_PASSWORD: 'new_password',
  CONFIRM_PASSWORD: 'confirm_password',
  NEW_PIN: 'new_pin',
  CONFIRM_PIN: 'confirm_pin',
}

const PASSWORD_MIN_LENGTH = 8
const PASSWORD_MAX_LENGTH = 20
const PIN_LENGTH = 4

export const CREATE_PASSWORD_CONSTANTS = {
  TITLES: {
    CREATE_PASSWORD: 'Create Password',
    PASSWORD_POLICIES: 'Password Policies',
    WELCOME: 'Welcome to eQMS!',
    WELCOME_SUBTITLE_DIGITAL: 'Digital',
    WELCOME_SUBTITLE_QMS: 'Quality Management System',
    WELCOME_SUBTITLE_FOR: 'for',
    WELCOME_SUBTITLE_MEDICAL: 'Medical',
    WELCOME_SUBTITLE_DEVICES: 'Devices',
  },

  LABELS: {
    NEW_PASSWORD: 'New Password',
    CONFIRM_PASSWORD: 'Confirm Password',
    NEW_PIN: 'New PIN',
    CONFIRM_PIN: 'Confirm PIN',
    SAVE_BUTTON: 'Save',
    SAVING_BUTTON: 'Saving...',
  },

  PLACEHOLDERS: {
    NEW_PASSWORD: 'New password',
    CONFIRM_PASSWORD: 'Confirm Password',
    NEW_PIN: 'New PIN',
    CONFIRM_PIN: 'Confirm PIN',
  },

  ERRORS: {
    PASSWORD_REQUIRED: 'Password is required',
    PASSWORD_LENGTH: `Password must be between ${PASSWORD_MIN_LENGTH} and ${PASSWORD_MAX_LENGTH} characters`,
    PASSWORD_UPPERCASE: 'Password must contain at least 1 uppercase letter',
    PASSWORD_NUMBERS: 'Password must contain at least 1 number',
    PASSWORD_SPECIAL: 'Password must contain at least 1 special character',
    CONFIRM_PASSWORD_REQUIRED: 'Please confirm your password',
    PASSWORDS_DO_NOT_MATCH: 'Passwords do not match',
    PIN_REQUIRED: 'PIN is required',
    PIN_NUMBERS_ONLY: 'PIN must contain only numbers',
    PIN_LENGTH: `PIN must be exactly ${PIN_LENGTH} digits`,
    PINS_DO_NOT_MATCH: 'PINs do not match',
    API_DEFAULT: 'Failed to set password',
    TIMEOUT:
      'Request timed out. Please check your network or server availability.',
    NETWORK: 'Network error. Unable to reach the server at localhost:9095.',
    DEFAULT: 'An error occurred while setting the password.',
    SET_PASSWORD_MUTATION_FAILED: 'Set password mutation failed:',
  },

  FIELDKEYS: {
    PASSWORD_FIELDS: {
      NEW_PASSWORD: 'newPassword',
      CONFIRM_PASSWORD: 'confirmPassword',
    },
    PASSWORD: 'password',
    CONFIRM_PASSWORD: 'confirmPassword',
    NEW_PASSWORD: 'newPassword',
    CONFIRM_PASSWORD_FORM: 'confirmPassword',
    NEW_PIN: 'newPin',
    CONFIRM_PIN: 'confirmPin',
    API_ERROR: 'apiError',
    BOOLEAN_STATES: {
      TRUE: 'true',
      FALSE: 'false',
    },
  },

  PAYLOADKEYS: {
    NEW_PASSWORD: 'new_password',
    CONFIRM_PASSWORD: 'confirm_password',
    NEW_PIN: 'new_pin',
    CONFIRM_PIN: 'confirm_pin',
  },

  REGEX: {
    UPPERCASE: /[A-Z]/,
    NUMBER: /\d/,
    SPECIAL_CHAR: /[!@#$%^&*(),.?":{}|<>]/,
    DIGITS_ONLY: /^\d+$/,
  },

  PASSWORD_POLICIES: {
    IDS: {
      LENGTH: 'length',
      UPPERCASE: 'uppercase',
      NUMBERS: 'numbers',
      SPECIAL: 'special',
    },
    TEXTS: {
      LENGTH: `Between ${PASSWORD_MIN_LENGTH} and ${PASSWORD_MAX_LENGTH} characters`,
      UPPERCASE: '1 upper case letter',
      NUMBERS: '1 or more numbers',
      SPECIAL: '1 or more special characters',
    },
    DEFAULT_POLICIES: [
      {
        id: 'length',
        text: `Between ${PASSWORD_MIN_LENGTH} and ${PASSWORD_MAX_LENGTH} characters`,
        isValid: false,
      },
      { id: 'uppercase', text: '1 upper case letter', isValid: false },
      { id: 'numbers', text: '1 or more numbers', isValid: false },
      { id: 'special', text: '1 or more special characters', isValid: false },
    ] as PasswordPolicy[],
  },

  assets: {
    LOGO_ALT: 'Logo',
    POLICY_VALID_ALT: 'Valid',
    POLICY_INVALID_ALT: 'Invalid',
  },


  api: {
    SET_PASSWORD_ENDPOINT: '/api/v1/auth/set-password-pin',
    RESET_PASSWORD_ENDPOINT: '/api/v1/auth/reset-forgot-password-pin',
    PASSWORD_SET_SUCCESS_MESSAGE: 'Password set successfully',
    ECONNABORTED_ERROR_CODE: 'ECONNABORTED',
    ERR_NETWORK_ERROR_CODE: 'ERR_NETWORK',
    UNKNOWN_ERROR_CODE: 'UNKNOWN',
    SUCCESS_STATUS: 'success',
  },

  WELCOME: {
    DESCRIPTION: 'Enhance Compliance and Quality with Our Medical Device QMS',
  },
} as const

export const SETTING_PASSWORD_CONSTANTS = {
  LOGO_SRC: '/images/logo.png',
  LOGO_ALT: 'Logo',

  FORM_TITLE: 'Create Password',

  NEW_PASSWORD_LABEL: 'New Password',
  CURRENT_PASSWORD_PLACEHOLDER: 'Enter your current password',
  NEW_PASSWORD_PLACEHOLDER: 'Enter new password',
  CONFIRM_PASSWORD_LABEL: 'Confirm Password',
  CONFIRM_PASSWORD_PLACEHOLDER: 'Confirm new password',
  NEW_PIN_LABEL: 'New PIN',
  NEW_PIN_PLACEHOLDER: 'Enter new PIN',
  CONFIRM_PIN_LABEL: 'Confirm PIN',
  CONFIRM_PIN_PLACEHOLDER: 'Confirm PIN',

  SAVE_BUTTON_LABEL: 'Save',
  SAVING_BUTTON_LABEL: 'Saving...',

  PASSWORD_POLICIES_TITLE: 'Password must contain:',

  LENGTH_POLICY_TEXT: 'At least 8 characters',
  UPPERCASE_POLICY_TEXT: 'At least one uppercase letter',
  NUMBERS_POLICY_TEXT: 'At least one number',
  SPECIAL_POLICY_TEXT: 'At least one special character',

  TEXT_TYPE: 'text',
  PASSWORD_TYPE: 'password',

  DEFAULT_API_ERROR: 'An error occurred. Please try again.',

  LENGTH_KEY: 'length',
  SPECIAL_KEY: 'special',
  NUMBERS_KEY: 'numbers',
  UPPERCASE_KEY: 'uppercase',
  API_ERROR_KEY: 'apiError',
  NEW_PASSWORD_KEY: 'newPassword',
  CONFIRM_PASSWORD_KEY: 'confirmPassword',
  NEW_PIN_KEY: 'newPin',
  CONFIRM_PIN_KEY: 'confirmPin',
  VALID_POLICY_ALT: 'Valid',
  INVALID_POLICY_ALT: 'Invalid',
} as const

export const FIELDS = [
  { key: 'newPassword', value: 'new_password' },
  { key: 'confirmPassword', value: 'confirm_password' },
  { key: 'newPin', value: 'new_pin' },
  { key: 'confirmPin', value: 'confirm_pin' },
] as const
export const URL_PATHS_TO_ALLOWED ={
  SET_PASSWORD: 'set-password',
  RESET_PASSWORD: 'reset-forgot-password'
}
