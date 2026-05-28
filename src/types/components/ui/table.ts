export interface DeliverableRow {
  id: number
  dirCategory: string
  dirNumber: string
  status: string
}

export interface VerificationRow {
  id: string
  dirNumber: string
  units: string
  verification: string
}

export interface TableProps {
  onAddRow?: () => void
}
