// Shared types for user modules to avoid duplication

export interface UserContact {
  contact_id: number
  contact_type: string
  contact: string
}

export interface UserRole {
  role_Id: number
  role_name: string
}

export interface UserOrganizationInfo {
  department_id: number
  department_name: string
  designation_id: number
  designation_name: string
  service_group_id: number
  service_group_name: string
  responsibility_id: number
  responsibility: string
  organization_timezone_name: string
  organization_timezone_code: string
  organization_utc_offset_in_minutes: number
  organization_has_dst: string
  organization_dst_start: string | null
  organization_dst_end: string | null
  organization_date_format: string
  organization_time_format: string
  profile_url: Record<string, any>
}

export interface ActionControl {
  formId: number
  menuId: number
  formName: string
  formType: string
  permissions: Array<{
    action: string
    trigger_status_id?: number
  }>
}

export interface TaskInfo {
  task_id: number
  task_comments: any[]
  reviewer_list?: Array<{
    user_id: number
    first_name: string
    last_name: string
  }>
}

export interface MetaInfo {
  action_control: ActionControl
  task_info: TaskInfo
}

export interface RowsAffected {
  action_control: ActionControl
  task_info: TaskInfo
}

// Common API response structure
export interface BaseUserResponse {
  code: number
  status: string
  message: string
  response_timestamp: string
  description: string
}

// Error types for user modules
export interface CustomError {
  response?: {
    data?: {
      message?: string
    }
  }
  message?: string
}

// User Workflow Manager Types
export type WorkflowType = 'profile-picture' | 'onboarding'

export interface UserWorkflowManagerProps {
  workflowType: WorkflowType
  isLoading: boolean
  permissions: { action: string; trigger_status_id: number }[]
  userId: string | number
  menuId?: number
  menuName?: string
  taskId?: number
  onSuccess?: () => void
  onError?: () => void
  customHandlers?: {
    handleCancel?: () => void
    handleSave?: () => void
    isDisabled?: boolean
  }
  onPermissionChange?: (hasEditPermission: boolean) => void
  reviewerList?: Array<{
    user_id: number
    first_name: string
    last_name: string
  }>
  hideSaveButton?: boolean
}