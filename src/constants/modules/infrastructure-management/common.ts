/**
 * Infrastructure Management Common Constants
 * Classification: Confidential
 */

import { NUMBERMAP } from '@/constants/common'

const BASE_API_PATH = 'api/v1/infrastructure'

export const API_ENDPOINTS = {
  CATEGORY_ALL: `${BASE_API_PATH}/category/all`,
  TYPE_ALL: `${BASE_API_PATH}/type/all`,
  SERIAL_NUMBER_ALL: `${BASE_API_PATH}/serial-number/all`,
  MAINTENANCE_PLAN_ALL: `${BASE_API_PATH}/service-type/all`,
} as const

export const QUERY_KEYS = {
  INFRASTRUCTURE_CATEGORY: 'infrastructure-category',
  INFRASTRUCTURE_TYPE: 'infrastructure-type',
  INFRASTRUCTURE_SERIAL_NUMBER: 'infrastructure-serial-number',
  MAINTENANCE_PLAN: 'maintenance-plan',
} as const

export const DEFAULT_STATUS = NUMBERMAP.ONE

