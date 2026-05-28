/**
 * Classification : Confidential
 **/

import { NUMBERMAP } from '@/constants/common'

export const OTHER_HAZARD_CONSTANTS = {
  TITLE: 'Other Hazards',
  DATATABLE_IDFIELD: 'sub_category_id',
  MODAL_TITLES: {
    ADD: 'Add Question',
    EDIT: 'Edit Question',
  },
  FIELD_LABELS: {
    QUESTION: 'Question*',
    SUB_CATEGORY: 'Sub-Category',
    STATUS : 'Status*',
  },
  FIELD_PLACEHOLDERS: {
    QUESTION: 'Enter Your Question',
    STATUS : 'Select Status'
  },
  ERROR_MESSAGES: {
    QUESTION_REQUIRED: 'Question is required',
    STATUS_REQUIRED: 'Status is required',
  },
  TABLE_COLUMNS: {
    SNO: {
      field: 'sno',
      headerName: 'S.No',
      flex: NUMBERMAP.TWO,
    },
    SUB_CATEGORY: {
      field: 'sub_category',
      headerName: 'Sub-Category',
      flex: NUMBERMAP.SEVEN,
    },
    ACTIONS: {
      field: 'action',
      headerName: 'Actions',
    },
  },
}

// API URL Constants
const RISK_API_BASE_URL = '/api/v1/risk/'
const OTHER_HAZARDS_END_URL = 'other-hazards/'

export const OTHER_HAZARD_API_ENDPOINTS = {
  GET_ALL: `${RISK_API_BASE_URL}${OTHER_HAZARDS_END_URL}all`,
  GET_BY_ID: (subCategoryId: number) =>
    `${RISK_API_BASE_URL}${OTHER_HAZARDS_END_URL}${subCategoryId}`,
  UPSERT: `${RISK_API_BASE_URL}${OTHER_HAZARDS_END_URL}`,
  DELETE: (subCategoryId: number) =>
    `${RISK_API_BASE_URL}${OTHER_HAZARDS_END_URL}${subCategoryId}`,
}

export const OTHER_HAZARD_QUERY_KEYS = {
  LIST: 'other-hazards-list',
  FETCH_BY_ID: 'other-hazard-by-id',
}
