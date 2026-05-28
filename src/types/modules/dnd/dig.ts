export interface DesignInputRow {
  id: string
  role: string
  user: string
  responsibility: string
  stage: string
}

export interface ColumnConfig {
  field: string
  headerName: string
  width: number
  flex?: number
}
