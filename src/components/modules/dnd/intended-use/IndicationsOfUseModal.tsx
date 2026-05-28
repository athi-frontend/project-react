'use client'

import React from 'react'
import { Grid2 } from '@mui/material'
import { MultiSelect } from '@/components/ui'
import BaseIntendedUseModal from './BaseIntendedUseModal'
import { useFetchModels } from '@/hooks/modules/dnd/useIntendedUse'
import { NUMBERMAP } from '@/constants/common'
import {
  MODAL_LABELS,
  MODAL_PLACEHOLDERS,
  MODAL_ERROR_MESSAGES,
} from '@/constants/modules/dnd/intendedUse'
import { IndicationsOfUseItem } from '@/types/modules/dnd/intendedUse'

interface IndicationsOfUseModalProps {
  open: boolean
  onClose: () => void
  onSave: (data: IndicationsOfUseItem) => void
  initialData?: IndicationsOfUseItem | null
  projectId: number
}

const IndicationsOfUseModal: React.FC<IndicationsOfUseModalProps> = ({
  open,
  onClose,
  onSave,
  initialData,
  projectId,
}) => {
  const { data: modelsData } = useFetchModels(projectId)

  const renderAdditionalFields = (
    formData: IndicationsOfUseItem,
    handleCustomFieldChange: (field: string, value: any) => void,
    errors: { [key: string]: string | undefined }
  ) => {
    return (
      <Grid2 size={NUMBERMAP.TWELVE}>
        <MultiSelect
          label={MODAL_LABELS.MODELS}
          placeholder={MODAL_PLACEHOLDERS.MODELS}
          value={formData.model_ids ?? []}
          onChange={(value) => {
            handleCustomFieldChange('model_ids', value)
          }}
          error={errors.model_ids ?? ''}
          options={modelsData?.data ?? []}
          idField="model_id"
          valueField="model_name"
        />
      </Grid2>
    )
  }

  const additionalValidation = (formData: IndicationsOfUseItem) => {
    const newErrors: { [key: string]: string } = {}
    if (!formData.model_ids || formData.model_ids.length === NUMBERMAP.ZERO) {
      newErrors.model_ids = MODAL_ERROR_MESSAGES.MODELS_REQUIRED
    }
    return newErrors
  }

  const onBeforeSave = (data: IndicationsOfUseItem) => {
    const modelNames = modelsData?.data
      ?.filter((model: any) => data.model_ids?.includes(model.model_id))
      .map((model: any) => model.model_name) ?? []
    
    return {
      ...data,
      model_names: modelNames,
    }
  }

  return (
    <BaseIntendedUseModal<IndicationsOfUseItem>
      open={open}
      onClose={onClose}
      onSave={onSave}
      initialData={initialData}
      title={MODAL_LABELS.ADD_INDICATIONS_TITLE}
      editTitle={MODAL_LABELS.EDIT_INDICATIONS_TITLE}
      label={MODAL_LABELS.INDICATIONS_OF_USE}
      placeholder={MODAL_PLACEHOLDERS.INDICATIONS_OF_USE}
      valueErrorKey="INDICATIONS_OF_USE_REQUIRED"
      additionalFields={renderAdditionalFields}
      additionalValidation={additionalValidation}
      onBeforeSave={onBeforeSave}
    />
  )
}

export default IndicationsOfUseModal

