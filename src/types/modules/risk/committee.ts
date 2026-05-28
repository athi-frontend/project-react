/**
 * Classification : Confidential
 **/

export interface CommitteeMember {
  id: number
  role: string
  role_id: number
  description: string
  assignedEmployee: string
  employee_id: number
  project_id: number
  status: number
  status_name?: string
}

export interface CommitteeFormData {
  project_id: number
  committee_id?: number | null
  role_id: number | null
  employee_id: number | null
  description: string
  status: number | null
}

export interface CommitteeFormErrors {
  role_id?: string
  employee_id?: string
  description?: string
  status?: string
}

export interface Role {
  id: number
  name: string
  status: number
}

export interface Employee {
  id: number
  employee_name: string
  role_name: string
  department_name: string
  status: number
}

export interface CommitteeApiResponse {
  committee_id: number
  risk_management_plan_id: number
  description: string
  status: number
  role_id: number
  role_name: string
  employee_id: number
  status_id: number
  status_name: string
  employee_name: string
}

import { ActionControl, MetaInfo } from '../risk-management/common'

export interface CommitteeMetaInfo {
  action_control?: ActionControl
  pagination?: {
    page: number
    pageSize: number
    total: number
    totalPages: number
  }
  [key: string]: unknown
}

export interface CommitteeListResponse {
  data: CommitteeApiResponse[]
  meta_info?: MetaInfo
}

export interface CommitteeFetchResponse {
  data: CommitteeApiResponse[]
  meta_info?: MetaInfo
}

export interface RoleListResponse {
  data: Role[]
}

export interface EmployeeListResponse {
  data: Employee[]
}

// StatusListResponse interface moved to common types

export interface CommitteeListQueryKey {
  queryKey: [string, number]
}

export interface CommitteeModalProps {
  open: boolean
  onClose: () => void
  onSave: (data: CommitteeFormData) => void
  projectId: number
  committeeData?: CommitteeFormData | null
  isLoading?: boolean
  isEditMode?: boolean
  permissions?: { action: string; trigger_status_id?: number }[]
}
