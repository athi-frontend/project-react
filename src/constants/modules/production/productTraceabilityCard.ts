/**
 * Classification: Confidential
 */

// Base API path
const BASE_API_PATH = 'api/v1/production/product-traceability-card'

// API Endpoints
export const API_ENDPOINTS = {
  FETCH_BY_PROJECT: (project_id: number) => `${BASE_API_PATH}/project/${project_id}`,
  UPSERT: BASE_API_PATH,
  PROCESS_CHECKLIST_GROUP_ALL: 'api/v1/production/process-checklist/group/all',
  PROCESS_CHECKLIST_ALL: 'api/v1/production/process-checklist/all',
}

// Query Keys
export const PRODUCT_TRACEABILITY_CARD_QUERY_KEYS = {
  FETCH_BY_PROJECT: (project_id: number) => ['productTraceabilityCard', 'fetchByProject', project_id],
  PROCESS_CHECKLIST_GROUP: 'processChecklistGroup',
  PROCESS_CHECKLIST: 'processChecklist',
}

