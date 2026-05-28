/**
 * Mitigation Matrix Constants
 * Classification: Confidential
 */

import { NUMBERMAP } from "@/constants/common"

// UI Constants
export const MITIGATION_MATRIX_CONSTANTS = {
  // Modal titles
  RISK_DETAILS_TITLE: 'Risk Details',

  // Button text
  CLOSE_BUTTON: 'Close',

  // Field names
  PROBABILITY_SEVERITY_FIELD: 'probabilitySeverity',
  RISK_CODE_FIELD: 'risk_code',
  RISK_TITLE_FIELD: 'risk_title',
  HAZARD_CODE_FIELD: 'hazard_code',

  // Header names
  PROBABILITY_SEVERITY_HEADER: 'Probability×Severity',
  RISK_CODE_HEADER: 'Risk Code',
  RISK_TITLE_HEADER: 'Risk Title',
  HAZARD_CODE_HEADER: 'Hazard Code',

  // ID fields
  MATRIX_ID_FIELD: 'id',
  MODAL_ID_FIELD: 'risk_id',

  // Column prefixes
  COLUMN_PREFIX: 'col_',

  // Button variants
  CONTAINED_VARIANT: 'contained',

  // Scroll behavior
  SMOOTH_SCROLL: 'smooth',

  // Error messages
  ERROR_MESSAGES: {
    PROBABILITY_SEVERITY_NOT_FOUND: {
      heading: 'Probability / Severity Levels Not Found',
      description:
        'Probability levels / Severity levels are missing. Please configure the risk assessment matrix data first.',
    },
  },

  // Acceptability values
  ACCEPTABILITY: {
    ACCEPTABLE: 'acceptable' as const,
    NOT_ACCEPTABLE: 'not_acceptable' as const,
  },
} as const

// Page-specific constants
export const BEFORE_MITIGATION_MATRIX_PAGE_CONSTANTS = {
  TITLE: 'Risk Chart Before',
  MATRIX_TYPE: 'before' as const,
} as const

export const AFTER_MITIGATION_MATRIX_PAGE_CONSTANTS = {
  TITLE: 'Risk Chart After',
  MATRIX_TYPE: 'after' as const,
} as const

// Common API base path for mitigation matrix
export const MITIGATION_MATRIX_BASE_API_PATH = '/api/v1/risk'
export const BEFORE_MITIGATION_MATRIX_API_PATH = 'before-mitigation-matrix'
export const AFTER_MITIGATION_MATRIX_API_PATH = 'after-mitigation-matrix'

export const MITIGATION_MATRIX_API_ENDPOINTS = {
  BEFORE_MITIGATION: {
    GET: (projectId: number) =>
      `${MITIGATION_MATRIX_BASE_API_PATH}/${BEFORE_MITIGATION_MATRIX_API_PATH}/${projectId}`,
  },
  AFTER_MITIGATION: {
    GET: (projectId: number) =>
      `${MITIGATION_MATRIX_BASE_API_PATH}/${AFTER_MITIGATION_MATRIX_API_PATH}/${projectId}`,
  },
  RISK_DETAILS: {
    GET: (projectId: number) =>
      `${MITIGATION_MATRIX_BASE_API_PATH}/${BEFORE_MITIGATION_MATRIX_API_PATH}/risk-details/${projectId}`,
  },
  AFTER_MITIGATION_RISK_DETAILS: {
    GET: (projectId: number) =>
      `${MITIGATION_MATRIX_BASE_API_PATH}/${AFTER_MITIGATION_MATRIX_API_PATH}/risk-details/${projectId}`,
  },
} as const

export const PROBABILITY_LEVELS = [
  { id: NUMBERMAP.ONE, key: "Improbable-P1", row: NUMBERMAP.ONE, order: NUMBERMAP.FIVE },
  { id: NUMBERMAP.TWO, key: "Remote-P2", row: NUMBERMAP.TWO, order: NUMBERMAP.FOUR },
  { id: NUMBERMAP.THREE, key: "Occasional-P3", row: NUMBERMAP.THREE, order: NUMBERMAP.THREE },
  { id: NUMBERMAP.FOUR, key: "Probable-P4", row: NUMBERMAP.FOUR, order: NUMBERMAP.TWO },
  { id: NUMBERMAP.FIVE, key: "Frequent-P5", row: NUMBERMAP.FIVE, order: NUMBERMAP.ONE }
] as const;

export const SEVERITY_LEVELS = [
  { id: NUMBERMAP.ONE, key: "Negligible-S1", column: NUMBERMAP.ONE, order: NUMBERMAP.ONE },
  { id: NUMBERMAP.TWO, key: "Minor-S2", column: NUMBERMAP.TWO, order: NUMBERMAP.TWO },
  { id: NUMBERMAP.THREE, key: "Serious-S3", column: NUMBERMAP.THREE, order: NUMBERMAP.THREE },
  { id: NUMBERMAP.FOUR, key: "Critical-S4", column: NUMBERMAP.FOUR, order: NUMBERMAP.FOUR  },
  { id: NUMBERMAP.FIVE, key: "Catastrophic-S5", column: NUMBERMAP.FIVE, order: NUMBERMAP.FIVE }
] as const;