export const MENU_CONSTANTS = {
  ICON_DESIGN: 'design',
  ICON_PROJECT: 'project',
  ICON_PLAN: 'plan',
  ICON_VARIANT: 'Outline',
  ICON_SIZE: '24',
  ICON_COLOR: 'currentColor',
  TOGGLE_ICON_SIZE: '16',

  HIERARCHY_SEPARATOR: '.',
  URL_SPACE: ' ',
  URL_DASH: '-',
  REGEX: /\s+/g,
  DATA: 'data',
  MENUS: 'menus',
  OUTLINE: 'Outline',
  MOUSEDOWN: 'mousedown',
  RELATIVE: 'relative',

  ERROR_INVALID_HIERARCHY: 'Invalid hierarchy format: ',
  ERROR_PROCESSING_MENU: 'Error processing menu ',
  ERROR_ASSIGNING_SUBMENU: 'Error assigning submenu for menu ',

  BOX_POSITION: 'relative',
  BOX_CLASS: 'sidebar',
  DRAWER_VARIANT: 'permanent',
  DRAWER_ANCHOR: 'left',
  DRAWER_CLASS: 'custom-sidebar',
  LIST_ITEM_BUTTON_CLASS: 'custom-list-item',
  LIST_ITEM_ICON_CLASS: 'custom-list-item-icon',
  LIST_ITEM_ACTIVE_ICON_CLASS: 'active-icon',
  ICON_BUTTON_BGCOLOR: 'primary.main',
  ICON_BUTTON_COLOR: 'primary.contrastText',
  ICON_BUTTON_HOVER_BGCOLOR: 'primary.dark',
  ICON_BUTTON_CLASS: 'toggle-button',
}

export const MENUDATA = 'menuData'
export const OUTLINE = 'Outline'
export const MOUSEDOWN = 'mousedown'
export const RELATIVE = 'relative'
export const LEFT = 'left'
export const PERMANENT = 'permanent'
export const DIV = 'div'
export const HOVER = '&:hover'

export const USER_ACCESS_ENDPOINT = '/api/v1/auth/user-access';

export const MENU_SERVICE_CONSTANTS = {
  MENU_ENDPOINT: '/api/v1/auth/user-access',

  AUTH_TOKEN_KEY: 'authToken',
  BEARER_PREFIX: 'Bearer ',

  FETCH_MENU_FAILED_DEFAULT_MESSAGE: 'Failed to fetch menu data',
  UNEXPECTED_ERROR_MESSAGE: 'Unexpected error occurred',

  UNEXPECTED_ERROR_LOG_PREFIX: 'Unexpected Error:',
  AXIOS_ERROR_LOG_PREFIX: 'Axios Error Details:',

  MENU_URL: '/api/v1/organization/menu/sub-level-menu/all?is_active=',
  ROLE_ID: '&role_id=',
  MENU_DATA: 'menuData',
} as const

export const LABELPATH: Record<string, string> = {
  'Project Details': '/dnd/project',
 'User Onboarding': '/user/list',
  'Design & Development': '/dnd/project/list',
  'HR Competency & Skills': '/hr/recruitment',
}

export const CUSTOM_MENU_PANEL_CLASS = 'custom-menu-panel'
export const MENU_RIGHT_PANEL_CLASS = 'menuRight-panel'
export const MENU_PANEL_CLASS = 'menupanel'
export const TEXT_SECONDARY_COLOR = 'text.secondary'
export const DEFAULT_LINK = '#'
export const CURRENT_COLOR = 'currentColor'
export const DIV_ELEMENT = 'div'
