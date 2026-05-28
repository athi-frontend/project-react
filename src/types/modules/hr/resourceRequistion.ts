export interface RecruitmentFormData {
  resourceRequired: string
  product: string
  reportsTo: string
  estimatedCTC: string
  onboardBy: string
  openings: string
  role: string
  department: string
  recruitmentType: string
  description: string
}

export interface FormErrors {
  [key: string]: string | undefined
}

export enum RecruitmentStatus {
  DRAFT = 'draft',
  REVIEW = 'review',
  APPROVAL = 'approval',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export type FormFieldKey = keyof RecruitmentFormData

export interface ButtonAction {
  label: string
  onClick: () => void
  variant?: 'text' | 'outlined' | 'contained'
}

export interface RecruitmentItem {
  resource_requisition_id: string
  description: string
  number_of_openings: string
  role: string | null
  status: string
}

export type FormFieldValue = string | number | null