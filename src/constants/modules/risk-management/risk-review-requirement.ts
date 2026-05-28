/**
 * Risk Review Requirement Constants
 * Classification: Confidential
 */

export const RISK_REVIEW_REQUIREMENT_CONSTANTS = {
  HEADER_TITLE: 'Risk Review Requirement',
  BASE_RISK_MANAGEMENT_API: 'api/v1/risk',
  RISK_REVIEW_REQUIREMENT_PATH: 'risk-review-requirement',
}

export const RISK_REVIEW_REQUIREMENT_TABLE_CONSTANTS = {
  COLUMNS: {
    SNO: 'sno',
    STAGE_NAME: 'stage_name',
    REQUIRES_REVIEW: 'is_review_required',
  },
  HEADERS: {
    SNO: 'S.No.',
    STAGE_NAME: 'Stage Name',
    REQUIRES_REVIEW: 'Requires Review',
  },
  FIELDS: {
    STAGE_APPLICABLE_ID: 'stage_applicable_id',
    REVIEW_REQUIREMENT_ID: 'review_requirement_id',
  },
}

export const API_ENDPOINTS = {
  FETCH_ALL: `/${RISK_REVIEW_REQUIREMENT_CONSTANTS.BASE_RISK_MANAGEMENT_API}/${RISK_REVIEW_REQUIREMENT_CONSTANTS.RISK_REVIEW_REQUIREMENT_PATH}/all`,
  UPSERT: `/${RISK_REVIEW_REQUIREMENT_CONSTANTS.BASE_RISK_MANAGEMENT_API}/${RISK_REVIEW_REQUIREMENT_CONSTANTS.RISK_REVIEW_REQUIREMENT_PATH}`,
}
