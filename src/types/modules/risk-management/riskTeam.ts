/**
 * Risk Team Types
 * Classification: Confidential
 */

export interface RiskTeamData {
  risk_team_id: number
  risk_management_plan_id: number
  responsibility_id: number
  responsibility_name: string
  status: number
  status_id: number
  status_name: string
  stage_applicable_id: number
  stage_name: string
  employee_id: number
  skill_master_ids: number[]
  employee_name: string
}

import { MetaInfo } from './common'

export interface RiskTeamResponse {
  data: RiskTeamData[]
  success: boolean
  message?: string
  meta_info?: MetaInfo
}

export interface RiskTeamRequest {
  project_id: number
  risk_team_id?: number
  stage_applicable_id: number
  responsibility_id: number
  employee_id: number
  status_id: number
  skill_master_ids: number[]
}

export interface Stage {
  stage_id: number
  stage_name: string
  stage_applicable_id: number
  [key: string]: any
}

export interface Responsibility {
  responsibility_id: number
  responsibility_name: string
  status: number
  [key: string]: any
}

export interface Employee {
  id: number
  role_name: string
  department_name: string
  status: number
  employee_name: string
  [key: string]: any
}

export interface Skill {
  skill_id: number
  skill_name: string
  status: number
  [key: string]: any
}

export interface Status {
  status_id: number
  status_name: string
  status: number
  [key: string]: any
}

export interface ApiResponse<T> {
  data: T[]
  success: boolean
  message?: string
}

// Risk Team Modal Types
export interface RiskControlMeasureData {
  stage: number | null
  responsibility: number | null
  skillRequired: number[]
  resource: number | null
  status: number | null
}

export interface RiskControlMeasureFormErrors {
  stage: string
  responsibility: string
  skillRequired: string
  resource: string
  status: string
}

export interface RiskTeamModalProps {
  onSave?: (data: RiskControlMeasureData) => void
  onCancel?: () => void
  onClose?: () => void
  open: boolean
  isEditMode?: boolean
  projectId: number
  riskTeamId?: number
  permissions?: Array<{
    action: string
    trigger_status_id?: number
  }>
}
