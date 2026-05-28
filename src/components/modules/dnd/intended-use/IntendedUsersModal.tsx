'use client'

import React from 'react'
import BaseIntendedUseModal from './BaseIntendedUseModal'
import {
  MODAL_LABELS,
  MODAL_PLACEHOLDERS,
} from '@/constants/modules/dnd/intendedUse'
import { IntendedUsersItem } from '@/types/modules/dnd/intendedUse'

interface IntendedUsersModalProps {
  open: boolean
  onClose: () => void
  onSave: (data: IntendedUsersItem) => void
  initialData?: IntendedUsersItem | null
}

const IntendedUsersModal: React.FC<IntendedUsersModalProps> = ({
  open,
  onClose,
  onSave,
  initialData,
}) => {
  return (
    <BaseIntendedUseModal<IntendedUsersItem>
      open={open}
      onClose={onClose}
      onSave={onSave}
      initialData={initialData}
      title={MODAL_LABELS.ADD_INTENDED_USERS_TITLE}
      editTitle={MODAL_LABELS.EDIT_INTENDED_USERS_TITLE}
      label={MODAL_LABELS.INTENDED_USERS}
      placeholder={MODAL_PLACEHOLDERS.INTENDED_USERS}
      valueErrorKey="INTENDED_USERS_REQUIRED"
    />
  )
}

export default IntendedUsersModal

