import React from 'react'
import { GridColDef } from '@mui/x-data-grid'
import { Checkbox } from '@mui/material'

import DataGridTable from '@/components/ui/data-grid-table/DataGridTable'
import { RegionRow } from '@/types/modules/dnd/hld'

interface RegionDataGridProps {
  rows: RegionRow[]
  onRowChange: (rowId: string, selected: boolean) => void
}

const RegionDataGrid: React.FC<RegionDataGridProps> = ({
  rows,
  onRowChange,
}) => {
  const columns: GridColDef[] = [
    {
      field: 'region',
      headerName: 'Region',
      flex: 3,
    },
    {
      field: 'selected',
      headerName: '',
      flex: 1,
      renderCell: (params) => (
        <Checkbox
          checked={params.value}
          onChange={(e) => onRowChange(params.row.id, e.target.checked)}
        />
      ),
    },
  ]

  return <DataGridTable columns={columns} rows={rows} hideFooter={true} />
}

export default RegionDataGrid
