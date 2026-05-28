'use client'
import React, { useEffect, useState } from 'react'
import { GridColDef, GridRowsProp } from '@mui/x-data-grid'
import { renderEditDeleteCell } from '@/components/ui/data-grid-table/DataGridTable'
import { MARKET_RESEARCH_COLUMNS } from '@/lib/modules/dnd/marketStudy'
import {
  MarketResearchItem,
  MarketResearchTableProps,
} from '@/types/modules/dnd/marketStudy'
import { DataTable } from '@/components/ui'
import { TABLE_FIELD_KEYS } from '@/constants/modules/dnd/marketStudy'

const MarketResearchTable: React.FC<MarketResearchTableProps> = ({
  data,
  onEditRow,
  onDelete,
}) => {
  const [rows, setRows] = useState<GridRowsProp>([])

  const columns: GridColDef[] = MARKET_RESEARCH_COLUMNS.map((col) =>
    col.field === 'actions'
      ? {
          ...col,
          renderCell: (params) =>
            renderEditDeleteCell(params, handleEditRow, handleDeleteRow),
        }
      : col
  )
  const handleEditRow = (row: MarketResearchItem) => {
    const matchedItem = data.find(
      (item) =>
        item.market_research_study_id.toString() ===
        row.market_research_study_id.toString()
    )
    if (matchedItem) {
      onEditRow({
        id: matchedItem.market_research_study_id,
        description: matchedItem.description,
        sourceList: [matchedItem.source],
      })
    } else {
      throw Error
    }
  }

  const handleDeleteRow = (id: string) => {
    onDelete(id)
  }

  const handleRowChange = (newRow: any) => {
    setRows(rows.map((row) => (row.id === newRow.id ? newRow : row)))
    return newRow
  }

  useEffect(() => {
    if (Array.isArray(data)) {
      setRows(data)
    }
  }, [data])
  return (
    <DataTable
      IdField={TABLE_FIELD_KEYS.MARKET_RESEARCH_STUDY_ID}
      columns={columns}
      rows={rows}
      onEditRow={handleEditRow}
      onDeleteRow={handleDeleteRow}
      onRowChange={handleRowChange}
      hideFooter={true}
      disableColumnMenu={true}
      disableColumnFilter={true}
      disableColumnSelector={true}
      disableDensitySelector={true}
      disableSelectionOnClick={true}
    />
  )
}

export default MarketResearchTable
