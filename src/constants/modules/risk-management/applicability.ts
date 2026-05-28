/**
 * Applicability Constants
 * Classification: Confidential
 */

export const APPLICABILITY_CONSTANTS = {
  HEADER_TITLE: 'Applicability',
  BASE_RISK_MANAGEMENT_API: 'api/v1/risk',
  APPLICABILITY_PATH: 'applicability',
}

export const APPLICABILITY_ROUTES = {
  RISK_MANAGEMENT: '/risk-management',
}

export const APPLICABILITY_TABLE_CONSTANTS = {
  COLUMNS: {
    SNO: 'sno',
    CATEGORY: 'category_name',
    APPLICABLE: 'is_applicable',
  },
  HEADERS: {
    SNO: 'S.No.',
    CATEGORY: 'Category',
    APPLICABLE: 'Applicable',
  },
  FIELDS: {
    CATEGORY_ID: 'category_id',
  },
}

export const API_ENDPOINTS = {
  FETCH_ALL: `/${APPLICABILITY_CONSTANTS.BASE_RISK_MANAGEMENT_API}/${APPLICABILITY_CONSTANTS.APPLICABILITY_PATH}/all`,
  UPSERT: `/${APPLICABILITY_CONSTANTS.BASE_RISK_MANAGEMENT_API}/${APPLICABILITY_CONSTANTS.APPLICABILITY_PATH}`,
}
