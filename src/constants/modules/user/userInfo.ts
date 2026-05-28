export const SUMMARY_LABELS = {
  FIRST_NAME: 'First Name',
  LAST_NAME: 'Last Name',
  EMAIL_ID: 'Email ID',
  CONTACT_NUMBER: 'Contact Number',
  DEPARTMENT: 'Department',
  ROLES: 'Roles',
  GROUP_NAME: 'Group Name',
  DESIGNATION: 'Designation',
  LOCK: 'Lock',
  UNLOCK: 'Unlock',
  CONTACT_EMAIL: 'email',
  MOBILE: 'mobile number',
  DELETE: 'Delete',
  EDIT: 'Edit',
  CANCEL : 'Cancel',
} as const
export const LOCKED = 'LOCK'
export const RESPONSE_KEYS = {
  USER_INFO: 'userInfo',
} as const

export const API_URLS = {
  FETCH_USER_INFO: (userID: number) => `api/v1/organization/users/${userID}`,
  CHANGE_USER_STATUS: (userID: number) =>
    `api/v1/organization/users/status/${userID}`,
}

export const URL = {
  USER_ONBOARDING_URL: (userID: number) => `/user/registration/${userID}`,
  USER_LIST: '/user/list',
}

export const MESSAGES = {
  REASON: 'Reason is required',
  NA: 'N/A',
}

export const USER_INFO_FAILED_ALERT = {
  title: 'Something went wrong!',
  text: 'User Does Not Exist',
  icon: 'error' as const,
  confirmButton: true,
  cancelButton: false,
};

export const CUSTOMALERT ='customAlert'
export const USER_ALERT = {
    DELETE : {
    TITLE : 'Success!',
    TEXT: 'User Deleted Successfully',
    ICON_SUCCESS : 'success' as const,
  }, 
  LOCK :{
    TITLE :'Success!',
    TEXT: 'User Locked Successfully',
    ICON_SUCCESS : 'success' as const,
  },
  UNLOCK :{
    TITLE :'Success!',
    TEXT: 'User Unlocked Successfully',
    ICON_SUCCESS : 'success' as const,
  }
}
