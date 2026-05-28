'use client'
import React, { useState, useEffect } from 'react'
import { Grid2, TextField, IconButton } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { Trash, Add } from 'iconsax-react'
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'

import DataGridTable from '@/components/ui/data-grid-table/DataGridTable'
import InputField from '@/components/ui/input-field/InputField'
import { TableWrapper } from '@/styles/components/modules/table'
import { NUMBERMAP } from '@/constants/common'
import { UNITS_VERIFICATION } from '@/constants/components/ui/prototypeForm'

interface UnitRow {
  id: number
  batch_no: string
  unit_name: string
}

interface UnitsVerificationTableProps {
  onUnitsChange?: (units: number) => void
  onRowChange?: (rows: UnitRow[]) => void
  initialRows?: UnitRow[]
  disabled?: boolean
}

const UnitsVerificationTable: React.FC<UnitsVerificationTableProps> = ({
  onUnitsChange,
  onRowChange,
  initialRows = [],
  disabled = false,
}) => {
  const theme = useTheme()
  const [rows, setRows] = useState<UnitRow[]>([])

  useEffect(() => {
    if (initialRows.length) {
      setRows(initialRows)
      onUnitsChange?.(initialRows.length)
    }
  }, [initialRows])

  const handleAddUnit = () => {
    const newRow: UnitRow = {
      id: rows.length + NUMBERMAP.ONE,
      batch_no: '',
      unit_name: '',
    }

    const updatedRows = [...rows, newRow]
    setRows(updatedRows)

    onUnitsChange?.(updatedRows.length)
    onRowChange?.(updatedRows)
  }

  const handleDeleteRow = (id: number) => {
    const updatedRows = rows
      .filter((row) => row.id !== id)
      .map((row, index) => ({
        ...row,
        id: index + NUMBERMAP.ONE, // re-index S.No
      }))

    setRows(updatedRows)
    onUnitsChange?.(updatedRows.length)
    onRowChange?.(updatedRows)
  }

  const handleBatchNoChange =
    (id: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const updatedRows = rows.map((row) =>
        row.id === id ? { ...row, batch_no: e.target.value } : row
      )
      setRows(updatedRows)
      onRowChange?.(updatedRows)
    }

  const handleUnitNameChange =
    (id: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const updatedRows = rows.map((row) =>
        row.id === id ? { ...row, unit_name: e.target.value } : row
      )
      setRows(updatedRows)
      onRowChange?.(updatedRows)
    }

  const columns: GridColDef[] = [
    {
      field: UNITS_VERIFICATION.S_NO_FIELD,
      headerName: UNITS_VERIFICATION.S_NO_HEADER,
      flex: NUMBERMAP.ONE,
    },
    {
      field: UNITS_VERIFICATION.BATCH_NO_FIELD,
      headerName: UNITS_VERIFICATION.BATCH_NO_HEADER,
      flex: NUMBERMAP.ONE,
      renderCell: (params: GridRenderCellParams) => (
        <TextField
          fullWidth
          multiline
          value={params.row.batch_no}
          onChange={handleBatchNoChange(params.row.id)}
          onKeyDown={(e) => {
            if (e.key === ' ') {
              e.stopPropagation()
            }
          }}
          placeholder={UNITS_VERIFICATION.BATCH_NO_PLACEHOLDER}
          disabled={disabled}
        />
      ),
    },
    {
      field: UNITS_VERIFICATION.UNIT_NAME_FIELD,
      headerName: UNITS_VERIFICATION.UNIT_NAME_HEADER,
      flex: NUMBERMAP.ONE,
      renderCell: (params: GridRenderCellParams) => (
        <TextField
          fullWidth
          multiline
          value={params.row.unit_name}
          onChange={handleUnitNameChange(params.row.id)}
          onKeyDown={(e) => {
            if (e.key === ' ') {
              e.stopPropagation()
            }
          }}
          placeholder={UNITS_VERIFICATION.UNIT_NAME_PLACEHOLDER}
          disabled={disabled}
        />
      ),
    },
    {
      field: UNITS_VERIFICATION.ACTIONS_FIELD,
      headerName: UNITS_VERIFICATION.ACTIONS_HEADER,
      flex: NUMBERMAP.HALF,
      sortable: false,
      renderCell: (params) => (
        <IconButton
          onClick={() => handleDeleteRow(params.row.id)}
          disabled={disabled}
          aria-label={UNITS_VERIFICATION.DELETE_ARIA_LABEL}
        >
          <Trash
            size={NUMBERMAP.EIGHTEEN}
            color={theme.palette.error.main}
          />
        </IconButton>
      ),
    },
  ]

  return (
    <TableWrapper>
      <Grid2 container spacing={NUMBERMAP.TWO} sx={{ mb: NUMBERMAP.TWO }}>
        <Grid2 size={NUMBERMAP.SIX}>
          <InputField
            label={UNITS_VERIFICATION.LABEL}
            value={rows.length.toString()}
            disabled
            endAdornment={
              <IconButton onClick={handleAddUnit} disabled={disabled}>
                <Add size={NUMBERMAP.EIGHTEEN}
                    color={theme.palette.grey[NUMBERMAP.FIVEHUNDRED]}/>
              </IconButton>
            }
          />
        </Grid2>
      </Grid2>

      <DataGridTable
        rows={rows}
        columns={columns}
        hideFooter
        disableColumnMenu
        disableColumnFilter
        disableColumnSelector
        disableDensitySelector
        disableSelectionOnClick
        idField="id"
      />
    </TableWrapper>
  )
}

export default UnitsVerificationTable
