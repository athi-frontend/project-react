/**
 *Classification : Confidential
 **/

import { NUMBERMAP } from "@/constants/common"

export const RISK_MATRIX_CONSTANTS = {
  HEADER_TITLE: 'Risk Assessment Matrix',
  PROBABILITY_FIELD: 'probabilityLevel',
  PROBABILITY_HEADER_NAME: 'Probability×Severity',
  ACCEPTABLE_STATUS: 'Acceptable',
  NOT_ACCEPTABLE_STATUS: 'Not Acceptable',
}

export const INITIAL_HEADERS = [
  { id: NUMBERMAP.ONE, name: 'Loading...', column: NUMBERMAP.ONE },
  { id: NUMBERMAP.TWO, name: 'Loading...', column: NUMBERMAP.TWO },
  { id: NUMBERMAP.THREE, name: 'Loading...', column: NUMBERMAP.THREE },
  { id: NUMBERMAP.FOUR, name: 'Loading...', column: NUMBERMAP.FOUR },
  { id: NUMBERMAP.FIVE, name: 'Loading...', column: NUMBERMAP.FIVE },
]

export const RISK_ASSESSMENT_MATRIX_BASE_API_PATH =
  '/api/v1/risk/assessment-matrix'

export const API_ENDPOINTS = {
  GET_RISK_MATRIX: `${RISK_ASSESSMENT_MATRIX_BASE_API_PATH}/all`,
  POST_RISK_MATRIX: `${RISK_ASSESSMENT_MATRIX_BASE_API_PATH}`,
}
