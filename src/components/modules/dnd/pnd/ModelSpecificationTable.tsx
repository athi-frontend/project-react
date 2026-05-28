import React from 'react'
import { Box, IconButton } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'
import DataGridTable from '@/components/ui/data-grid-table/DataGridTable'
import { ModelSpecificationTableProps } from '@/types/modules/dnd/pnd'
import { PND_MODEL_SPECIFICATION_COLUMNS } from '@/constants/modules/dnd/pnd'
import StatusTypography from '@/components/ui/status/ToggleStatus'
import { NUMBERMAP } from '@/constants/common'
import { Edit, Trash } from 'iconsax-react'
import { EDIT_DELETE_CELL_STYLES } from '@/styles/components/ui/datatable'
import { DATA_GRID_CONSTANTS } from '@/constants/components/ui/dataGrid'

const ModelSpecificationTable: React.FC<ModelSpecificationTableProps> = ({
  modelSpecifications,
  onEdit,
  onDelete,
}) => {
  const columns: GridColDef[] = [
    PND_MODEL_SPECIFICATION_COLUMNS.SNO,
    PND_MODEL_SPECIFICATION_COLUMNS.MODEL_NAME,
    PND_MODEL_SPECIFICATION_COLUMNS.MODEL_NUMBER,
    PND_MODEL_SPECIFICATION_COLUMNS.BASE_MODEL,
    {
      ...PND_MODEL_SPECIFICATION_COLUMNS.STATUS,
      renderCell: (params) => (
        <StatusTypography value={Number(params.value) || NUMBERMAP.ONE} />
      ),
    },
    {
      ...PND_MODEL_SPECIFICATION_COLUMNS.ACTIONS,
      renderCell: (params) => {
        const isInactive = Number(params.row?.status) === NUMBERMAP.TWO
        return (
          <Box sx={EDIT_DELETE_CELL_STYLES}>
            <IconButton onClick={() => onEdit(params.row)}>
              <Edit
                size={NUMBERMAP.EIGHTEEN}
                color={DATA_GRID_CONSTANTS.EDIT_ICON_COLOR}
              />
            </IconButton>
            <IconButton
              onClick={() => !isInactive && onDelete(params.id.toString())}
              disabled={isInactive}
            >
              <Trash
                size={NUMBERMAP.EIGHTEEN}
                color={isInactive ? 'gray' : DATA_GRID_CONSTANTS.DELETE_ICON_COLOR}
              />
            </IconButton>
          </Box>
        )
      },
    },
  ]

  return (
    <DataGridTable
      columns={columns}
      rows={modelSpecifications}
      idField="id"
      onEditRow={onEdit}
      onDeleteRow={(id) => onDelete(Number(id))}
      hideFooter
    />
  )
}

export default ModelSpecificationTable
