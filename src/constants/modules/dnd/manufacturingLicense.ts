export const LICENSE_MESSAGES = {
  SUCCESS_ALERT: 'success',
  PIN_ERROR_TITLE: 'Incorrect PIN',
  PIN_ERROR_TEXT: 'Please try again',
  VALIDATION_ERROR: 'Please enter a valid 4-digit pin',
  CUSTOM_ALERT: 'customAlert',
  ALERT_ICON_ERROR: 'error',
  PIN_INPUT_LABEL: 'Validate by Pin*',
  BASE_API_PATH: 'api/v1/dnd/',
  OUTLINED: 'outlined',
  CONTAINED: 'contained',
  TEST_LICENSE: 'test_license',
  MANUFACTURING_LICENSE: 'manufacturing_license',
} as const;
export const DT_API_ENDPOINTS = {
  INITIATE_LICENSE: `${LICENSE_MESSAGES.BASE_API_PATH}initiate-license`,
};

export const BUTTONS = {
  CANCEL : 'Cancel',
  SAVE : 'Save'
}


export const TEST_LICENSE = {
  TEST_LICENSE_TITLE : 'Apply for Test License',
  INITIATE_TEST_LICENSE : 'Initiate Test License'
}
