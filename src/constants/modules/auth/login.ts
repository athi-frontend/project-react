export const LOGIN_CONSTANTS = {
  LOGIN_TITLE: 'Login',
  EMAIL_LABEL: 'Email Address',
  PASSWORD_LABEL: 'Password',
  REMEMBER_ME_TEXT: 'Remember me',
  FORGOT_PASSWORD_TEXT: 'Forgot Password?',
  LOGIN_BUTTON_TEXT: 'Login',
  LOGIN_BUTTON_LOADING_TEXT: 'Logging In...',
  TITLE_VARIANT: 'h1',
  ADD_BUTTON_TITLE: 'Add Team',
  IMG: "/images/logo.png",

  OBJECT: 'object',
  MESSAGE: 'message',
  STRING: 'string',
  USERNAME: 'username',
  HOME: '/',

  ACCESS_TOKEN: 'access_token',
  ID_TOKEN: 'id_token',
  RBAC_TOKEN: 'rbac_token',
  REFRESH_TOKEN: 'refresh_token',

  EMAIL_PLACEHOLDER: 'Enter your Email Address',
  PASSWORD_PLACEHOLDER: 'Enter your Password',

  EMAIL_REQUIRED_ERROR: 'Email is required',
  EMAIL_INVALID_ERROR: 'Please enter a valid email address',
  PASSWORD_REQUIRED_ERROR: 'Password is required',
  PASSWORD_LENGTH_ERROR: 'Password must be at least 8 characters',
  LOGIN_FAILED_ERROR: 'Login failed. Please try again.',
  INVALID_TOKEN_ERROR: 'Invalid server response: No token provided.',

  REMEMBERED_EMAIL_KEY: 'rememberedEmail',
  AUTH_TOKEN_KEY: 'authToken',

  EMAIL_TYPE: 'email',
  PASSWORD_TYPE: 'password',
  TEXT_TYPE: 'text',

  FORGOT_PASSWORD_PATH: '/forgot-password',

  TOGGLE_PASSWORD_VISIBILITY_LABEL: 'toggle password visibility',
  END_POSITION: 'end',
  SMALL_SIZE: 'small',
  TEXT_ALIGN_CENTER: 'center',
  MARGIN_BOTTOM_10PX: '10px',

  PATHS: {
    LOGIN_PATH: '/login',
    FORGOT_PASSWORD_PATH: '/forgot-password',
    HOME_PATH: '/',
    NOT_FOUND_PATH: '/not-found',
  },
  PUBLIC_PATHS: [
    '/login',
    '/forgot-password',
    '/forgot-pin',
    '/not-found',
    '/user/set-password',
    '/user/reset-forgot-password',
  ] as string[],
  PROTECTED_PATHS: ['/'] as string[],
} as const

export const AUTH_SERVICE_CONSTANTS = {
  LOGIN_ENDPOINT: '/api/v1/auth/login',

  LOGIN_FAILED_DEFAULT_MESSAGE: 'Login failed',
  INVALID_EMAIL_MESSAGE: 'Invalid email',
  INVALID_PASSWORD_MESSAGE: 'Invalid password',
  INVALID_CREDENTIALS_MESSAGE: 'Invalid credentials',
  BAD_REQUEST_MESSAGE: 'Bad request',
  USER_NOT_FOUND_MESSAGE: 'User not found',
  LOGIN_FAILED_RETRY_MESSAGE: 'Login failed. Please try again.',
  NETWORK_ERROR_MESSAGE: 'Network error occurred',
  UNEXPECTED_ERROR_MESSAGE: 'An unexpected error occurred',

  USER_TYPE: 'username',
  PASSWORD_TYPE: 'password',
} as const

export const ERROR_MESSAGES: Record<number, string> = {
  400: 'Bad request',
  404: 'User not found',
} as const
