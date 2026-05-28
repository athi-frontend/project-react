import React from 'react'
import { GridColDef } from '@mui/x-data-grid'

import DataGridTable, {
  renderEditDeleteCell,
} from '@/components/ui/data-grid-table/DataGridTable'
import { CompetitiveLandscapeRow } from '@/types/modules/dnd/hld'

interface CompetitiveLandscapeDataGridProps {
  rows: CompetitiveLandscapeRow[]
  onAddRow: () => void
  onEditRow: (row: CompetitiveLandscapeRow) => void
  onDeleteRow: (id: string) => void
}

const CompetitiveLandscapeDataGrid: React.FC<
  CompetitiveLandscapeDataGridProps
> = ({ rows, onAddRow, onEditRow, onDeleteRow }) => {
  const columns: GridColDef[] = [
    {
      field: 'market_segment',
      headerName: 'Segment',
      flex: 1,
    
    },
    {
      field: 'major_competitor',
      headerName: 'Major Competitor',
      flex: 1,
      
    },
    {
      field: 'segment_share',
      headerName: 'Segment Share',
      flex: 1,
     
    },
    {
      field: 'price_range',
      headerName: 'Price Range',
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
      title="Competitive Landscape"
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

export default CompetitiveLandscapeDataGrid
