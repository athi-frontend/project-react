'use client'
import React from 'react'
import GenericTable from './GenericTable'
import { NUMBERMAP } from '@/constants/common'

interface SkillSet {
  id: number
  skillRequired: string
  levelRequired: string
  levelPossess: string | number
  levelPossessId: number
}

interface SkillSetTableProps {
  data: SkillSet[]
  onEdit?: (skillSet: SkillSet) => void
  onDelete?: (skillSet: SkillSet) => void
  mode?: string
}

const SkillSetTable: React.FC<SkillSetTableProps> = ({
  data,
  onEdit,
  onDelete,
  mode,
}) => {
  const columns = [
    { field: 'sno', headerName: 'S.No.'},
    {
      field: 'skill_name',
      headerName: 'Skill Required as per JD',
      flex: NUMBERMAP.ONE,
    },
    {
      field: 'skill_level',
      headerName: 'Level of Skill Required as per JD',
      flex: NUMBERMAP.ONE,
    },
    {
      field: 'level_possess',
      headerName: 'Level of Skill Possess',
      flex: NUMBERMAP.ONE,
      align:"center"
    },
  ]
  const handleEdit = (item: SkillSet) => {
    if (onEdit) {
      onEdit(item)
    }
  }

  const handleDelete = (item: SkillSet) => {
    if (onDelete) {
      onDelete(item)
    }
  }
  // Map your actual data into expected row format
  const rows = data?.map((item, index) => ({
    id: index + 1,
    ...item,
    levelPossess: item.levelPossess ?? item.level_process,
  }))
  return (
    <GenericTable
      columns={columns}
      rows={rows}
      idField="id"
      onEdit={handleEdit}
      onDelete={handleDelete}
      showActions={false}
    />
  )
}

export default SkillSetTable
