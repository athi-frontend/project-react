/**
 * Common types for Risk Management module
 * Classification: Confidential
 */

export interface ActionControl {
  permissions: Array<{
    action: string
    trigger_status_id?: number
  }>
}

export interface MetaInfo {
  action_control?: ActionControl
  [key: string]: unknown
}

