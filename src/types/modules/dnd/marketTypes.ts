export interface MarketResearchProps {
  initialFeedbacks: Feedback[]
}

export interface Feedback {
  id: string
  createdBy: string
  user_first_name?: string
  user_last_name?: string
  created_date: string
  market_feedback: string
}

export interface SourceOption {
  [key: string]: string
}

export interface PageProps {
  params: { id: string }
  searchParams?: Record<string, string | string[]>
}
