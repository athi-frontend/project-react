import { FileDocument } from '@/types/components/ui/fileUploadV3'

export interface MarketResearchProps {
  initialFeedbacks: Feedback[]
}
export interface InitialFormData {
  sources: string
  description: string
  uploadedFile: File[] | FileDocument[]
  documentIdToDelete: number[]
}

export interface Feedback {
  id: string
  createdBy: string
  user_first_name?: string
  user_last_name?: string
  created_date: string
  market_feedback: string
  item: string
  status: number
}
export interface Dataprops {
  id: number
}
export interface SourceOption {
  [key: string]: string
}

export interface MarketResearchItem {
  id: string | number
  serialNo: string
  source: string
  description: string
}
export interface Dataprops {
  id: number
  description: string
  market_research_study_id?: number
  sourceList: string | string[]
}
export interface MarketResearchTableProps {
  onEditRow: (data: Dataprops) => void
  onDelete: (data: string) => void
  data: Dataprops[]
}
