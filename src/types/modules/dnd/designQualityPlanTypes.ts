/**
    Classification : Confidential
**/
export interface DQPStageRow {
  id: string
  stage_id: string
  quality_objective: string
  item_for_test: string
  parameters_for_inspection: string
  test_methods: string
  status: string
}

export interface ColumnDefinition {
  field: string
  headerName: string
  width?: number
  sortable?: boolean
  renderCell?: (params: any) => React.ReactNode
}

export interface DQPResponse {
  data: DQPStageRow[]
  rowsAffected: {
    total_count: number
  }
}

export interface PaginationProps {
  page: number
  pageSize: number
}

export interface PageUpdateParams {
  page: number
  pageSize: number
}

export interface DesignQualityFormData {
  stage_name: string
  quality_objective: string
  itemForTest: string
  parametersForInspection: string[]
  testMethodsAndCriteria: string
}
