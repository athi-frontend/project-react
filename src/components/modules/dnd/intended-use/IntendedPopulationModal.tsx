'use client'

import React from 'react'
import BaseIntendedUseModal from './BaseIntendedUseModal'
import {
  MODAL_LABELS,
  MODAL_PLACEHOLDERS,
} from '@/constants/modules/dnd/intendedUse'
import { IntendedPopulationItem } from '@/types/modules/dnd/intendedUse'

interface IntendedPopulationModalProps {
  open: boolean
  onClose: () => void
  onSave: (data: IntendedPopulationItem) => void
  initialData?: IntendedPopulationItem | null
}

const IntendedPopulationModal: React.FC<IntendedPopulationModalProps> = ({
  open,
  onClose,
  onSave,
  initialData,
}) => {
  return (
    <BaseIntendedUseModal<IntendedPopulationItem>
      open={open}
      onClose={onClose}
      onSave={onSave}
      initialData={initialData}
      title={MODAL_LABELS.ADD_TITLE}
      editTitle={MODAL_LABELS.EDIT_TITLE}
      label={MODAL_LABELS.INTENDED_POPULATION}
      placeholder={MODAL_PLACEHOLDERS.INTENDED_POPULATION}
      valueErrorKey="INTENDED_POPULATION_REQUIRED"
    />
  )
}

export default IntendedPopulationModal

