/**
 * Classification: Confidential
 */

// Risk Management Reviewer specific types
export interface RiskManagementReviewerFormProps {
  onClose: () => void
  mode: string
  onSave: (comment: string, reviewer?: number) => void
  commentshistory?: any[]
  reviewerlist?: any[]
}

export interface RiskManagementReviewerModalProps {
  open: boolean
  onClose: () => void
  mode: string
  onSave: (comment: string, reviewer?: number) => void
  commentshistory?: any[]
  reviewerlist?: any[]
}

export interface RiskManagementReviewerModalManagerProps {
  isLoading: boolean
  permissions: { action: string; trigger_status_id?: number }[]
  taskInfo: { task_comments: any[]; reviewer_list: any[] }
  menuId?: number
  menuName?: string
  taskId?: number
  customHandlers?: {
    handleCancel?: () => void
    handleSave?: () => void
    isDisabled?: boolean
    handleBack?: () => void
  }
  onPermissionChange?: (hasEditPermission: boolean) => void
  contextType: string
  contextId: number
  projectId?: number
  onRefetch?: () => void
  queryKey?: string | string[]
  hideSaveButton?: boolean
}
