import React from 'react'
import { GridColDef } from '@mui/x-data-grid'

import DataGridTable, {
  renderEditDeleteCell,
} from '@/components/ui/data-grid-table/DataGridTable'
import { ConversionRateRow } from '@/types/modules/dnd/hld'

interface ConversionRateDataGridProps {
  rows: ConversionRateRow[]
  onAddRow: () => void
  onEditRow: (row: ConversionRateRow) => void
  onDeleteRow: (id: string) => void
}

const ConversionRateDataGrid: React.FC<ConversionRateDataGridProps> = ({
  rows,
  onAddRow,
  onEditRow,
  onDeleteRow,
}) => {
  const columns: GridColDef[] = [
    {
      field: 'target_geography',
      headerName: 'Target Geography',
      flex: 1,
    },
    {
      field: 'target_segment',
      headerName: 'Target Segment',
      flex: 1,
    },
    {
      field: 'target_customer_segment',
      headerName: 'No.of Target Customer Per Each Segment',
      flex: 2,
    },
    {
      field: 'conversion_1',
      headerName: 'Conversion Year 1',
      flex: 1,
    },
    {
      field: 'conversion_2',
      headerName: 'Conversion Year 2',
      flex: 1,
    },
    {
      field: 'conversion_3',
      headerName: 'Conversion Year 3',
      flex: 1,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      sortable: false,
      filterable: false,
      renderCell: (params) =>
        renderEditDeleteCell(params, onEditRow, onDeleteRow),
    },
  ]

  return (
    <DataGridTable
      title="Potential Expected Conversion Rate"
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

export default ConversionRateDataGrid
