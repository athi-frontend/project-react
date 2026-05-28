export const MENU_SERVICE_CONSTANTS = {
  MENU_ENDPOINT: '/api/api/v1/organization/menu/sub-level-menu/all',

  AUTH_TOKEN_KEY: 'authToken',
  BEARER_PREFIX: 'Bearer ',

  FETCH_MENU_FAILED_DEFAULT_MESSAGE: 'Failed to fetch menu data',
  UNEXPECTED_ERROR_MESSAGE: 'Unexpected error occurred',

  UNEXPECTED_ERROR_LOG_PREFIX: 'Unexpected Error:',
  AXIOS_ERROR_LOG_PREFIX: 'Axios Error Details:',

  MENU_URL: '/api/api/v1/organization/menu/sub-level-menu/all?is_active=',
  ROLE_ID: '&role_id=',
  MENU_DATA: 'menuData',
} as const
