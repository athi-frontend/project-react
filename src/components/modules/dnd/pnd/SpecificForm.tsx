import React from 'react'
import { GridColDef } from '@mui/x-data-grid'
import DataGridTable, {
  renderEditDeleteCell,
} from '@/components/ui/data-grid-table/DataGridTable'
import { SpecificationTableProps } from '@/types/modules/dnd/pnd'
import { PND_SPECIFICATION_COLUMNS } from '@/constants/modules/dnd/pnd'

const SpecificationTable: React.FC<SpecificationTableProps> = ({
  specifications,
  onEdit,
  onDelete,
}) => {
  const columns: GridColDef[] = [
    PND_SPECIFICATION_COLUMNS.SNO,
    PND_SPECIFICATION_COLUMNS.PARAMETER,
    PND_SPECIFICATION_COLUMNS.SPECIFICATION,
    {
      ...PND_SPECIFICATION_COLUMNS.ACTIONS,
      renderCell: (params) => renderEditDeleteCell(params, onEdit, onDelete),
    },
  ]

  return (
    <DataGridTable
      title=""
      columns={columns}
      rows={specifications}
      idField="id"
      onEditRow={onEdit}
      onDeleteRow={(id) => onDelete(Number(id))}
      hideFooter
    />
  )
}

export default SpecificationTable
