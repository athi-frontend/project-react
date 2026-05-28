import { GridColDef, GridPaginationModel } from '@mui/x-data-grid'
export interface Rows {
  [key: string]: any
}

export interface DataTableProps {
  IdField: string
  pagination: { page: number; pageSize: number }
  totalPage: number
  rows: Rows[]
  columns: GridColDef[]
  checkbox: boolean
  handlePageupdate: ({ page, pageSize }: GridPaginationModel) => void
}
