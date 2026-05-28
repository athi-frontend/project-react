/**
 * Classification : Confidential
 **/

/**
 * Sales context types for workflow integration
 * These constants identify the module/entity type for workflow actions
 */
export const SALES_CONTEXT_TYPE = {
  CUSTOMER_FEEDBACK: 'customer_feedback',
  QUOTATION: 'quotation',
  SALES_FORECAST: 'sales_forecast',
  ORDER_ACKNOWLEDGEMENT: 'order_acknowledgement',
} as const

/**
 * Quality Control context types for workflow integration
 * These constants identify the module/entity type for workflow actions
 */
export const QC_CONTEXT_TYPE = {
  SANITY_CHECK_INSPECTION: 'sanity_check_inspection',
} as const

/**
 * Infrastructure Management context types for workflow integration
 * These constants identify the module/entity type for workflow actions
 */
export const INFRASTRUCTURE_CONTEXT_TYPE = {
  INFRASTRUCTURE_REQUEST: 'infrastructure_request',
  INFRASTRUCTURE_QUALIFICATION: 'infrastructure_qualification',
  MAINTENANCE_REPORT: 'maintenance_report',
} as const

 
