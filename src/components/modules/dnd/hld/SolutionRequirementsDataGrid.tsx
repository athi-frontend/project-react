import React from 'react'
import { GridColDef } from '@mui/x-data-grid'

import DataGridTable, {
  renderEditDeleteCell,
} from '@/components/ui/data-grid-table/DataGridTable'
import { SolutionRequirementsRow } from '@/types/modules/dnd/hld'

interface SolutionRequirementsDataGridProps {
  rows: SolutionRequirementsRow[]
  onAddRow: () => void
  onEditRow: (row: SolutionRequirementsRow) => void
  onDeleteRow: (id: string) => void
}

const SolutionRequirementsDataGrid: React.FC<
  SolutionRequirementsDataGridProps
> = ({ rows, onAddRow, onEditRow, onDeleteRow }) => {
  const columns: GridColDef[] = [
    {
      field: 'must_have',
      headerName: 'Must Have Requirements',
      flex: 1,
    },
    {
      field: 'nice_to_have',
      headerName: 'Nice To Have Requirements',
      flex: 1,
    },
    {
      field: 'wont_have',
      headerName: "Won't Have Requirements",
      flex: 1,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 0.5,
      sortable: false,
      filterable: false,
      renderCell: (params) =>
        renderEditDeleteCell(params, onEditRow, onDeleteRow),
    },
  ]

  return (
    <DataGridTable
      title="Solution Requirements + Valued Product Requirements + Value Usability Requirements"
      columns={columns}
      rows={rows}
      onAddRow={onAddRow}
      onEditRow={onEditRow}
      onDeleteRow={onDeleteRow}
      showAddButton={true}
      hideFooter={true}
    />
  )
}

export default SolutionRequirementsDataGrid
