/**
 * Classification: Confidential
 */

// Sales Reviewer specific types
export interface SalesReviewerModalManagerProps {
  isLoading: boolean
  permissions: { action: string; trigger_status_id?: number }[]
  taskInfo: { task_comments: any[]; reviewer_list: any[]; task_id?: number }
  menuId?: number
  menuName?: string
  contextType: string
  contextId: number
  customHandlers?: {
    handleCancel?: () => void
    handleSave?: () => void
    isDisabled?: boolean
  }
  onPermissionChange?: (hasEditPermission: boolean) => void
  refetch?: () => void
  hideSaveButton?: boolean
}

