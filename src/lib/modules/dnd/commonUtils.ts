import { NUMBERMAP } from "@/constants/common";

export const theme = {
  '--primary-color': '',
  '--secondary-color': '',
  '--text-color': '',
  '--text-dark-color': '',
  '--background-color': '',
  '--white-color': '',
  '--dropdown-hover-color': '',
  '--primary-hover-color': '',
  '--grey-color': '',
  '--btnHover-bg-color': '',
  '--gridtable-bg-color': '',
  '--gridtable-text-color': '',
  '--header-title': '',
  '--header-stroke': '',
  '--black-color': '',
  '--menuHover-color': '',
}
export const COMMON_CONSTANTS = {
  IN_ACTIVE_STATUS: 0,
  ACTIVE_STATUS: 1,
  VALUE_YES: 'Yes',
  VALUE_NO: 'No',
  CONDITIONS: {
    EMPTY_ARRAY_LENGTH: 0,
  },
  INDEXES: {
    INDEX_ZERO: 0,
    INDEX_ONE: 1,
  },
  ALERT_STATUS: {
    SUCCESS_ALERT: 'success',
    FAILED_ALERT: 'failed',
    DENIED_ALERT: 'denied',
    DELETE_ALERT: 'delete',
  },
  STATUS_CODES: {
    SUCCESS_CODE: NUMBERMAP.TWOHUNDRED,
    CREATED_CODE: NUMBERMAP.TWOHUNDRED+ NUMBERMAP.ONE,
  },
} as const

export const PAGINATION: { PAGE_NUMBER: number; PAGE_SIZE: number } = {
  PAGE_NUMBER: NUMBERMAP.ONE,
  PAGE_SIZE: NUMBERMAP.TEN,
}
