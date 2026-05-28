'use client'
import React, { useEffect, useState } from 'react'
import GenericTable from './GenericTable'
import {
  TRAINING_NEEDS_TABLE_COLUMNS,
  EMPLOYEE_UI_CONSTANTS,
  CREATE_MODE,
} from '@/constants/modules/hr/employeeList'
import { CommonInlineStyles } from '@/styles/common'
import { useSourceDropDown } from '@/hooks/modules/hr/useEmployeeList'
import { ActionButton } from '@/components/ui'
import { NUMBERMAP } from '@/constants/common'
import { formatDate } from '@/lib/utils/common'

export interface TrainingNeed {
  id?: number
  skill: string
  skill_name?: string
  skill_id?: number
  fk_eqms_hr_skill_master_id?: number
  dateOfJoining: string
  target_date?: string
  status: string
  source?: string
  source_id?: number
  fk_eqms_hr_employee_source_lk_id?: number
  employee_training_needs_id?: string
  training_supporting_files?: any[]
}

interface TrainingNeedsTableProps {
  data: TrainingNeed[]
  onEdit?: (items: TrainingNeed) => void
  onDelete?: (item: TrainingNeed) => void
  mode: string
}

const TrainingNeedsTable: React.FC<TrainingNeedsTableProps> = ({
  data,
  onEdit,
  onDelete,
  mode,
}) => {
  const [sourceOptions, setSourceOptions] = useState<
    { source_id: number; source: string }[]
  >([])
  const { data: sourceData } = useSourceDropDown()

  useEffect(() => {
    if (sourceData?.data && sourceData?.data.length>NUMBERMAP.ZERO) {
      setSourceOptions(sourceData.data)
    }
  }, [sourceData])

  const handleEdit = (item: TrainingNeed) => {
    if (onEdit) {
      onEdit(item)
    }
  }

  const handleDelete = (item: TrainingNeed) => {
    if (onDelete) {
      onDelete(item)
    }
  }
  const columns = [
    {
      ...TRAINING_NEEDS_TABLE_COLUMNS.ID,
    },
    {
      ...TRAINING_NEEDS_TABLE_COLUMNS.SKILL_NAME,
      renderCell: (params: any) => (
        <div>
          {params.row.skill_name ?? EMPLOYEE_UI_CONSTANTS.UNKNOWN_SKILL}
        </div>
      ),
    },
    {
      ...TRAINING_NEEDS_TABLE_COLUMNS.TARGET_DATE,
      renderCell: (params: any) => (
        <div>
          {(formatDate(params.row.dateOfJoining) ?? params.row.target_date)}
        </div>
      ),
    },
    {
      ...TRAINING_NEEDS_TABLE_COLUMNS.SOURCE,
      renderCell: (params: any) => {
        const sourceId = params.row.source_id ?? params.row.source
        const sourceMatch = sourceOptions.find(
          (s) => s.source_id === Number(sourceId)
        )
        const displaySourceName = sourceMatch
          ? sourceMatch.source
          : (params.row.source_name ?? EMPLOYEE_UI_CONSTANTS.UNKNOWN_SOURCE)

        return (
          <div>
            {mode === CREATE_MODE && (
              <input
                style={CommonInlineStyles.displayNone}
                readOnly
                data-sourcename={
                  TRAINING_NEEDS_TABLE_COLUMNS.SOURCE.dataSourceName
                }
                data-fieldname={
                  TRAINING_NEEDS_TABLE_COLUMNS.SOURCE.dataFieldName
                }
                data-is-grid="true"
                value={sourceId}
              />
            )}
            {displaySourceName}
          </div>
        )
      },
    },
    {
      field: 'actions',
      headerName: 'Action',
      width: 170,
      renderCell: (params: any) => (
        <ActionButton
          onEdit={() => onEdit?.(params.row)}
          onDelete={() => {
            onDelete?.(params.row)
          }}
          disabled={params.row.is_editable === NUMBERMAP.ZERO}
        />
      ),
    },
  ]
  return (
    <GenericTable
      idField="employee_training_needs_id"
      columns={columns}
      rows={data?.filter(item => item !== undefined)}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  )
}

export default TrainingNeedsTable
