/**
    Classification : Confidential
**/
export interface CloseIconProps {
  onClick: () => void
}

export interface ProcessStepProps {
  label: string
  value: string
  selectedValue: string
  onChange: (value: string) => void
}

export interface ProcurementProcessProps {
  modalToggle: () => void
  open: boolean
}
export interface CommentSectionProps {
  value: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}
export interface ReviewerFormProps {
  onClose: () => void
  department_id: number
  button_id: number
  mode: string
  menu_id: number
  menu_name: string
  task_id?: number
  reviewerList?: Array<{
    user_id: number
    first_name: string
    last_name: string
  }>
  saveReview?: (data: any, callbacks?: { onSuccess?: () => void; onError?: () => void }) => void
}

export interface ReviewerModalProps {
  open: boolean
  onClose: () => void
  project_id: number
  button_id: number
  mode: string
  menu_id: number
  menu_name: string
  task_id?: number
  reviewerList?: Array<{
    user_id: number
    first_name: string
    last_name: string
  }>
  saveReview?: (data: any, callbacks?: { onSuccess?: () => void; onError?: () => void }) => void
}


export interface SelectReviewerProps {
  value: string | null
  onChange: (event: any, newValue: string | null) => void
  error: boolean
  helperText: string | null
}
