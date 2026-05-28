'use client'
import React, { useState } from 'react'
import { Box, Checkbox, Grid2 } from '@mui/material'
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import {
  AcknowledgementSection,
  AcknowledgementLabel,
  AcknowledgementCheckbox,
  CheckboxLabel,
  ButtonContainer,
  InlineStyles,
} from '@/styles/components/modules/acknowledgementFormStyles'
import { ButtonGroup, DataGridTable } from '@/components/ui'

interface ChecklistItem {
  id: number
  serialNo: string
  label: string
  checked: boolean
}

const AcknowledgementForm: React.FC = () => {
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([
    { id: 1, serialNo: '01', label: 'Label', checked: false },
    { id: 2, serialNo: '02', label: 'Label', checked: false },
    { id: 3, serialNo: '03', label: 'Label', checked: false },
    { id: 4, serialNo: '04', label: 'Label', checked: false },
    { id: 5, serialNo: '05', label: 'Label', checked: false },
    { id: 6, serialNo: '06', label: 'Label', checked: false },
  ])

  const [acknowledgementChecked, setAcknowledgementChecked] = useState(false)

  const handleRowChange = (newRow: any) => {
    setChecklistItems((prevItems) =>
      prevItems.map((item) =>
        item.id === newRow.id ? { ...item, checked: newRow.checked } : item
      )
    )
    return newRow
  }

  const handleAcknowledgementChange = () => {
    setAcknowledgementChecked(!acknowledgementChecked)
  }

  const handleHandoverDesign = () => {}

  const renderCheckboxCell = (params: GridRenderCellParams) => {
    return (
      <Checkbox
        checked={params.value}
        onChange={(e) => {
          const newRow = {
            ...params.row,
            checked: e.target.checked,
          }
          handleRowChange(newRow)
        }}
        sx={InlineStyles.checkbox}
      />
    )
  }

  const columns: GridColDef[] = [
    {
      field: 'serialNo',
      headerName: 'S.No.',
      width: 80,
      headerClassName: 'table-header',
    },
    {
      field: 'label',
      headerName: 'Check List',
      width: 200,
      headerClassName: 'table-header',
    },
    {
      field: 'checked',
      headerName: 'Documents',
      width: 150,
      headerClassName: 'table-header',
      renderCell: renderCheckboxCell,
    },
  ]

  return (
    <Box >
      <Box display="flex" flexDirection="column" >
        <Box
          sx={InlineStyles.tableContainer}
        >
          <DataGridTable
            title="Design Transfer Acknowledgement"
            columns={columns}
            rows={checklistItems}
            onRowChange={handleRowChange}
            hideFooter={true}
            autoHeight={true}
            disableColumnMenu={true}
            disableColumnFilter={true}
            disableColumnSelector={true}
            disableDensitySelector={true}
            disableSelectionOnClick={true}
          />
        </Box>

        <AcknowledgementSection>
          <AcknowledgementLabel>
            Acknowledgement Statement*
          </AcknowledgementLabel>
          <Box display="flex" alignItems="center" gap="20px" mt="20px">
            <AcknowledgementCheckbox>
              <Checkbox
                checked={acknowledgementChecked}
                onChange={handleAcknowledgementChange}
                sx={InlineStyles.acknowledgementBox}
              />
            </AcknowledgementCheckbox>
            <CheckboxLabel>Label</CheckboxLabel>
          </Box>
        </AcknowledgementSection>

        <ButtonContainer>
          <Grid2 container justifyContent="flex-end">
            <ButtonGroup
              buttons={[
                {
                  label: 'Handover Design',
                  onClick: handleHandoverDesign,
                },
              ]}
            />
          </Grid2>
        </ButtonContainer>
      </Box>
    </Box>
  )
}

export default AcknowledgementForm
