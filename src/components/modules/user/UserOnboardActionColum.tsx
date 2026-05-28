'use client'
import React from 'react'
import { TABLESTRINGCONSTANTS } from '@/constants/modules/user/userOnboard'
import { StatusSpan } from '@/styles/modules/user/userOnboard'
import {
  StatusCellProps,
  ActionCellProps,
} from '@/types/modules/user/userOnBoard'
import { ActionButton } from '@/components/ui'

export const StatusCell: React.FC<StatusCellProps> = ({ status }) => {
  return (
    <StatusSpan status={status}>{status ? 'Active' : 'InActive'}</StatusSpan>
  )
}

export const ActionCell: React.FC<ActionCellProps> = ({
  params,
  onDelete,
  onEdit,
}) => {
  return (
    <div key={params.id}>
      <ActionButton
        onEdit={() => {
          params.row && onEdit?.(params.row)
        }}
        onDelete={() => params.row && onDelete(params.row)}
        disabled={
          params.row?.status === TABLESTRINGCONSTANTS.STATUS_FIELD.INACTIVE
        }
      />

    </div>
  )
}
