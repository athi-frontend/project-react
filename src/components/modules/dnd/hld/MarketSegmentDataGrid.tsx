import React from 'react'
import { GridColDef } from '@mui/x-data-grid'

import DataGridTable, {
  renderCheckboxCell,
  renderTextFieldCell,
} from '@/components/ui/data-grid-table/DataGridTable'
import { MarketSegmentRow } from '@/types/modules/dnd/hld'
import { NUMBERMAP } from '@/constants/common'

interface MarketSegmentDataGridProps {
  rows: MarketSegmentRow[]
  onRowChange: (row: MarketSegmentRow) => void
}

const MarketSegmentDataGrid: React.FC<MarketSegmentDataGridProps> = ({
  rows,
  onRowChange,
}) => {
  const columns: GridColDef[] = [
    {
      field: 'segment',
      headerName: 'Segments',
      flex: NUMBERMAP.ONE,
    },
    {
      field: 'percentage_of_use',
      headerName: 'Percentage of Use',
      flex: NUMBERMAP.ONE_HALF,
      renderCell: (params) => renderTextFieldCell(params, onRowChange),
    },
    {
      field: 'is_applicable',
      headerName: 'Applicable',
      editable: false,
      flex: NUMBERMAP.HALF,
      renderCell: (params) => renderCheckboxCell(params, onRowChange),
      valueFormatter: (params: any) => params.value === 1,
    },
  ]

  return (
    <DataGridTable
      columns={columns}
      rows={rows}
      onRowChange={onRowChange}
      hideFooter={true}
      disableSelectionOnClick={true}
    />
  )
}

export default MarketSegmentDataGrid
