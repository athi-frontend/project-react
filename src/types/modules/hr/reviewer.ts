/**
 * Classification: Confidential
 */

// HR Reviewer specific types
export interface HRReviewerFormProps {
  onClose: () => void
  mode: string
  onSave: (comment: string, reviewer?: number) => void
   commentshistory?: any[]
  reviewerlist?: Array<{
    user_id: number
    first_name: string
    last_name: string
  }>
  hideReviewer?: boolean
  isSaving?: boolean
}

export interface HRReviewerModalProps {
  open: boolean
  onClose: () => void
  mode: string
  onSave: (comment: string, reviewer?: number) => void,
  commentshistory?: any[]
  reviewerlist?: Array<{
    user_id: number
    first_name: string
    last_name: string
  }>
  hideReviewer?: boolean
  taskId?:number
  isSaving?: boolean
};