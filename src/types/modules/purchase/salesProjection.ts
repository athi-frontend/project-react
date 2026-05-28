/**
 * Classification : Confidential
 **/

export interface SalesProjectionMonth {
  september: any[]
  october: any[]
  november: any[]
}

export interface SalesProjectionDetail {
  purchase_requisition_id: number | null
  status_on_date: string
  sales_projections: SalesProjectionMonth[]
  model_view: any[]
  part_view: any[]
}

export interface SalesProjectionDetailResponse {
  code?: number
  status?: string
  message?: string
  response_timestamp?: string
  description?: string
  data?: SalesProjectionDetail
}

// Component Props
export interface SalesProjectionMonthsProps {
  salesProjections: SalesProjectionMonth[]
  isLoading: boolean
  formatItem: (item: any) => string
}

export interface SalesProjectionTabsProps {
  tabValue: number
  setTabValue: (value: number) => void
  modelView: any[]
  partView: any[]
  isLoading: boolean
  error: Error | null
  formatItem: (item: any) => string
  purchase_requisition_id?: number | null
  status_on_date?: string | null
  setPurchaseRequisitionId?: (id: number | null) => void
}

export interface SalesProjectionTabsRef {
  handleSubmit: () => Promise<void>
}

