/**
 * Risk Review Constants
 * Classification: Confidential
 */

import { NUMBERMAP } from '@/constants/common'

export const RISK_REVIEW_PAGE = {
  TITLE: 'Risk Review',
} as const

export const RISK_REVIEW_FIELDS = {
  SNO: 'sno',
  STAGE_NAME: 'applicable_stage',
  RISK_REVIEW_DATE: 'review_date',
  ACTIONS: 'actions',
  APPLICABLE_STAGE_ID: 'applicable_stage_id',
} as const

export const RISK_REVIEW_COLUMNS = {
  SNO: {
    headerName: 'S.No.',
    flex: NUMBERMAP.HALF,
  },
  STAGE_NAME: {
    headerName: 'Stage Name',
    flex: NUMBERMAP.ONE,
  },
  RISK_REVIEW_DATE: {
    headerName: 'Risk Review Date',
    flex: NUMBERMAP.ONE,
  },
  ACTIONS: {
    headerName: 'Actions',
  },
} as const

export const RISK_REVIEW_ACTIONS = {
  REVIEW: 'Review',
} as const

export const RISK_REVIEW_DETAIL_ROUTE = (
  projectId: string | number,
  riskReviewRequirementId: string | number
) => `/risk-management/risk-review/${projectId}/${riskReviewRequirementId}`

export const RISK_REVIEW_LIST_ROUTE = (projectId: string | number) =>
  `/risk-management/risk-review/${projectId}`

const BASE_API_PATH = 'api/v1/risk/review'

export const RISK_REVIEW_API_ENDPOINTS = {
  FETCH_ALL: `${BASE_API_PATH}/all`,
  FETCH_BY_ID: (reviewRequirementId: number) =>
    `${BASE_API_PATH}/${reviewRequirementId}`,
  FETCH_SUMMARY: `${BASE_API_PATH}/summary`,
  UPSERT: BASE_API_PATH,
}

export const RISK_REVIEW_CONSTANTS = {
  DESCRIPTION: {
    LABEL: 'Description',
    PLACEHOLDER: 'Input Text',
  },
  ACKNOWLEDGE: {
    LABEL:
      'I Acknowledge that the Project Risk Assessment has been Reviewed in Accordance with Organizational Risk Management Practices and that the Identified Risks and Mitigation Actions are Accepted.*',
    ERROR_MESSAGE:
      'Please acknowledge that the Project Risk Assessment has been Reviewed in Accordance with Organizational Risk Management Practices.',
  },
  CONTEXT_TYPE: 'review_requirement_id',
  ERROR_MESSAGES: {
    NO_DATA_FOUND: {
      heading: 'Something went wrong',
      description: 'No data found.',
    },
  },
} as const

export const CONTEXT_TYPE = {
  RISK_REVIEW: 'risk_review',
} as const