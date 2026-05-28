'use client'
import React, { useState, useEffect } from 'react'
import { Grid2, Box } from '@mui/material'
import { InputField, RichTextEditor, ButtonGroup } from '@/components/ui'
import DatePicker from '@/components/ui/data-picker/DataPicker'
import { NUMBERMAP } from '@/constants/common'
import { Dayjs } from 'dayjs'
import { ButtonContainer } from '@/styles/components/ui/button'
import {
  ActionsCarriedOutModalProps,
  ActionsCarriedOutData,
} from '@/types/modules/infrastructure-management/maintenanceReport'
import { useServiceTypes } from '@/hooks/modules/infrastructure-management/useMaintenancePlan'
import { FORM_BUTTON_LABELS, VALIDATION_MESSAGES, FORM_LABELS, FORM_PLACEHOLDERS, KEY_FIELDS, VALUE_FIELDS } from '@/constants/modules/infrastructure-management/maintenanceReport'

/**
 * Classification : Confidential
 **/

const ActionsCarriedOutModal: React.FC<ActionsCarriedOutModalProps> = ({
  onSave,
  onCancel,
  initialData,
  byWhomOptions = [],
}) => {
  const { data: serviceTypesData } = useServiceTypes()
  const [formData, setFormData] = useState<ActionsCarriedOutData>({
    actionCarriedOut: initialData?.actionCarriedOut ?? '',
    maintenanceDate: initialData?.maintenanceDate ?? null,
    byWhom: initialData?.byWhom ?? '',
  })

  const [errors, setErrors] = useState({
    actionCarriedOut: '',
    maintenanceDate: '',
    byWhom: '',
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        actionCarriedOut: initialData.actionCarriedOut ?? '',
        maintenanceDate: initialData.maintenanceDate ?? null,
        byWhom: initialData.byWhom ?? '',
      })
    }
  }, [initialData])

  const validateForm = (): boolean => {
    const newErrors = {
      actionCarriedOut: '',
      maintenanceDate: '',
      byWhom: '',
    }

    if (!formData.actionCarriedOut?.trim()) {
      newErrors.actionCarriedOut = VALIDATION_MESSAGES.ACTION_CARRIED_OUT_REQUIRED
    }

    if (!formData.maintenanceDate) {
      newErrors.maintenanceDate = VALIDATION_MESSAGES.MAINTENANCE_DATE_REQUIRED
    }

    if (!formData.byWhom || (typeof formData.byWhom === 'string' && !formData.byWhom.trim())) {
      newErrors.byWhom = VALIDATION_MESSAGES.BY_WHOM_REQUIRED
    }

    setErrors(newErrors)
    return !Object.values(newErrors).some((error) => error !== '')
  }

  const handleSave = () => {
    if (validateForm()) {
      onSave?.(formData)
    }
  }

  const handleBack = () => {
    onCancel?.()
  }

  const handleFieldChange = (field: keyof ActionsCarriedOutData, value: string | Dayjs | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const buttonConfig = [
    { label: FORM_BUTTON_LABELS.CANCEL, onClick: handleBack },
    { label: FORM_BUTTON_LABELS.SAVE, onClick: handleSave }
  ]

  return (
    <Box >
      <Grid2 container spacing={NUMBERMAP.ONE}>
        {/* Action Carried Out */}
        <Grid2 size={NUMBERMAP.TWELVE}>
          <RichTextEditor
            label={FORM_LABELS.ACTION_CARRIED_OUT}
            value={formData.actionCarriedOut}
            onChange={(value) => handleFieldChange('actionCarriedOut', value)}
            placeholder={FORM_PLACEHOLDERS.INPUT_TEXT}
            error={errors.actionCarriedOut}
          />
        </Grid2>

        {/* Maintenance Date */}
        <Grid2 size={NUMBERMAP.TWELVE}>
          <DatePicker
            label={FORM_LABELS.MAINTENANCE_DATE}
            value={formData.maintenanceDate}
            onChange={(newValue) => handleFieldChange('maintenanceDate', newValue)}
            error={errors.maintenanceDate}
          />
        </Grid2>

        {/* By Whom */}
        <Grid2 size={NUMBERMAP.TWELVE}>
          <InputField
            label={FORM_LABELS.BY_WHOM}
            placeholder={FORM_PLACEHOLDERS.SELECT_BY_WHOM}
            isDropdown
            value={formData.byWhom}
            onChange={(value: string) => handleFieldChange('byWhom', value)}
            options={serviceTypesData?.data ?? byWhomOptions}
            keyField={KEY_FIELDS.ID}
            valueField={VALUE_FIELDS.MAINTENANCE_SERVICE_TYPE}
            error={errors.byWhom}
          />
        </Grid2>

        {/* Action Buttons */}
        <Grid2 size={NUMBERMAP.TWELVE}>
          <ButtonContainer>
            <ButtonGroup buttons={buttonConfig} />
          </ButtonContainer>
        </Grid2>
      </Grid2>
    </Box>
  )
}

export default ActionsCarriedOutModal

