import { RISK_DEFINITION_LEVEL_CONSTANTS } from '@/constants/modules/risk-management/riskLevelDefinition'
import { ActionControl, MetaInfo } from './common'
/**
 *Classification : Confidential
 **/
export interface RiskLevel {
  id: string
  title: string
  value: string
  description: string
  type:
    | typeof RISK_DEFINITION_LEVEL_CONSTANTS.LEVEL_TYPES.PROBABILITY
    | typeof RISK_DEFINITION_LEVEL_CONSTANTS.LEVEL_TYPES.SEVERITY
  apiData?: ProbabilityLevelAPI | SeverityLevelAPI
}

export interface ProbabilityLevel extends RiskLevel {
  probability: number
}

export interface SeverityLevel extends RiskLevel {
  severity: number
}

// Modal Component Interfaces
export interface ProbabilityLevelData {
  template_id: number
  level_name: string
  numerator: number
  denominator: number
  level_value: string
  description: string
}

export interface SeverityLevelData {
  template_id: number
  level_name: string
  level_value: string | null
  description: string
}

export interface ProbabilityLevelFormErrors {
  level_name: string
  numerator: string
  denominator: string
  level_value: string
  description: string
}

export interface SeverityLevelFormErrors {
  level_name: string
  level_value: string
  description: string
}

export interface ProbabilityLevelModalProps {
  onSave?: (data: ProbabilityLevelData) => void
  onCancel?: () => void
  onClose?: () => void
  open: boolean
  initialData?: RiskLevel
  projectId: number
  permissions?: ActionControl['permissions']
}

export interface SeverityLevelModalProps {
  onSave?: (data: SeverityLevelData) => void
  onCancel?: () => void
  onClose?: () => void
  open: boolean
  initialData?: RiskLevel
  projectId: number
  permissions?: ActionControl['permissions']
}

// API Response Types
export interface ProbabilityLevelAPI {
  template_id: number
  level_name: string
  level_value: string
  numerator: number
  denominator: number
  description: string
  statusId: number
  statusName: string
}

export interface SeverityLevelAPI {
  template_id: number
  level_name: string
  level_value: string
  description: string
  status_id: number
  status_name: string
}

export interface ProbabilityLevelUpsertPayload {
  template_id: number
  project_id: number
  level_name: string
  numerator: number
  denominator: number
  description: string
}

export interface SeverityLevelUpsertPayload {
  template_id: number
  project_id: number
  level_name: string
  level_value: number
  description: string
}

export interface APIResponse<T> {
  code: number
  status: string
  message: string
  response_timestamp: string
  description: string
  data: T
  meta_info?: MetaInfo
}

// Tab Panel Interface
export interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

// Risk Level Card Interface
export interface RiskLevelCardProps {
  level: RiskLevel
  onEdit: (level: RiskLevel) => void
  disabled?: boolean
}
