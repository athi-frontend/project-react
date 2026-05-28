export interface ReviewItem {
  id: string
  item: string
  requirement: string
  comment: string
  reviewed: number
}

export interface ReviewStatus {
  id: string
  role: string
  status: string
  date: string
}

export interface PndReviewProps {
  reviewItems?: ReviewItem[]
  reviewStatuses?: ReviewStatus[]
  onSave?: (items: ReviewItem[]) => void
  onSubmitReview?: () => void
  onSubmitApproval?: () => void
  onApprove?: () => void
  onInitiateApproval?: () => void
  onReject?: () => void
  onRequestModification?: () => void
  onCancel?: () => void
  onGenerateReport?: () => void
  onStartDesign?: () => void
}

export interface ApiReviewItem {
  item_id: number
  item_name: string
  value: string | null | string[]
  comments: string | null
  reviewed: number
}

export interface ApiPndReviewData {
  pnd_id: number
  pnd_review_report_id: number
  review_records: ApiReviewItem[]
}

export interface ApiResponse {
  code: number
  status: string
  message: string
  response_timestamp: string
  data: ApiPndReviewData[]
}

export interface PndReviewRecord {
  item_id: number
  comments: string
}

export interface PndReviewData {
  pnd_id: number
  pnd_review_report_id: number | null
  review_records: PndReviewRecord[]
}

export interface PndReviewStatusRow {
  id?: string | number
  role_id?: string | number
  role_name?: string
  status_id?: string | number
  transition_date?: string
  transition_name?: string
}
