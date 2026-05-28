import React from 'react'
import { Box, Checkbox, Grid2 } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'

import DataGridTable from '@/components/ui/data-grid-table/DataGridTable'
import { DemographyRowData } from '@/types/modules/dnd/hld'
import { CheckBoxStyles, InlineStyles, OptionItem, OptionLabel, StyledTextField } from '@/styles/modules/dnd/hld'
import { NUMBERMAP } from '@/constants/common'


interface DemographyDataGridProps {
  rows: DemographyRowData[]
  onOptionChange: (rowId: string, optionId: string, checked: boolean) => void
  onSpecialCategoryChange: (value: string) => void
  specialCategory: string
}

const DemographyDataGrid: React.FC<DemographyDataGridProps> = ({
  rows,
  onOptionChange,
  onSpecialCategoryChange,
  specialCategory,
}) => {
  const columns: GridColDef[] = [
    {
      field: 'category',
      headerName: 'Demography',
      flex:NUMBERMAP.ONE
    },
    {
      field: 'options',
      headerName: '',
      flex:NUMBERMAP.ONE,
      renderCell: (params) => {
        const rowOptions = params.value
        if (params.row['category'] == 'Special Category') {
          return (
            <StyledTextField
              sx={InlineStyles.textFieldPadding}
              fullWidth
              onKeyDown={(event) => {
                if (event.key === ' ') {
                  event.stopPropagation()
                }
              }}
              value={specialCategory}
              onChange={(e) => onSpecialCategoryChange(e.target.value)}
              placeholder="Enter Special Category"
            />
          )
        }
        return (
          <Grid2 container>
            {rowOptions.map((option: any) => (
              <Grid2 size={NUMBERMAP.SIX} key={option.id}>
                <OptionItem>
                  <Checkbox
                    checked={option.checked}
                    onChange={(e) =>
                      onOptionChange(params.row.id, option.id, e.target.checked)
                    }
                    sx={CheckBoxStyles.checkboxPosition}
                  />
                  <OptionLabel>{option.label}</OptionLabel>
                </OptionItem>
              </Grid2>
            ))}
          </Grid2>
        )
      },
    },
  ]

  return (
    <Box sx={InlineStyles.gridContainer}>
      <DataGridTable columns={columns} rows={rows} hideFooter={true} />
    </Box>
  )
}

export default DemographyDataGrid
