'use client'

import React, { useState, useEffect, ReactNode } from 'react'
import { Grid2 } from '@mui/material'
import CommonModal from '@/components/ui/common-modal/CommonModal'
import { ButtonGroup, InputField } from '@/components/ui'
import RichTextEditor from '@/components/ui/rich-text-editor/RichTextEditor'
import { useOrganizationStatus } from '@/hooks/useCommonDropdown'
import { NUMBERMAP } from '@/constants/common'
import { CommonModalScroll } from '@/styles/common'
import {
  MODAL_LABELS,
  MODAL_PLACEHOLDERS,
  MODAL_ERROR_MESSAGES,
  MODAL_FIELD_KEYS,
} from '@/constants/modules/dnd/intendedUse'

interface BaseIntendedUseItem {
  value: string
  status: number
}

interface BaseIntendedUseModalProps<T extends BaseIntendedUseItem> {
  open: boolean
  onClose: () => void
  onSave: (data: T) => void
  initialData?: T | null
  title: string
  editTitle: string
  label: string
  placeholder: string
  valueErrorKey: keyof typeof MODAL_ERROR_MESSAGES
  additionalFields?: (formData: T, handleCustomFieldChange: (field: string, value: any) => void, errors: { [key: string]: string | undefined }) => ReactNode
  additionalValidation?: (formData: T) => { [key: string]: string }
  onBeforeSave?: (data: T) => T
}

const BaseIntendedUseModal = <T extends BaseIntendedUseItem>({
  open,
  onClose,
  onSave,
  initialData,
  title,
  editTitle,
  label,
  placeholder,
  valueErrorKey,
  additionalFields,
  additionalValidation,
  onBeforeSave,
}: BaseIntendedUseModalProps<T>) => {
  const [formData, setFormData] = useState<T>({
    value: '',
    status: NUMBERMAP.ZERO,
  })
  const [errors, setErrors] = useState<{
    value?: string
    status?: string
    [key: string]: string | undefined
  }>({})

  const { data: statusData } = useOrganizationStatus()

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    } else {
      setFormData({
        value: '',
        status: NUMBERMAP.ZERO,
      })
    }
    setErrors({})
  }, [initialData, open])

  const handleFieldChange = (field: keyof BaseIntendedUseItem, value: string | number | number[]) => {
    setFormData((prev) => ({ ...prev, [field]: value } as T))
    if (field === 'value' && errors.value) {
      setErrors((prev) => ({ ...prev, value: '' }))
    } else if (field === 'status' && errors.status) {
      setErrors((prev) => ({ ...prev, status: '' }))
    }
  }

  const handleCustomFieldChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value } as T))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {}
    
    if (!formData.value || formData.value.trim() === '') {
      newErrors.value = MODAL_ERROR_MESSAGES[valueErrorKey]
    }
    
    if (!formData.status || formData.status === NUMBERMAP.ZERO) {
      newErrors.status = MODAL_ERROR_MESSAGES.STATUS_REQUIRED
    }

    if (additionalValidation) {
      const additionalErrors = additionalValidation(formData)
      Object.assign(newErrors, additionalErrors)
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === NUMBERMAP.ZERO
  }

  const handleSave = () => {
    if (validateForm()) {
      const dataToSave = onBeforeSave ? onBeforeSave(formData) : formData
      onSave(dataToSave)
      handleClose()
    }
  }

  const handleClose = () => {
    setFormData({
      value: '',
      status: NUMBERMAP.ZERO,
    })
    setErrors({})
    onClose()
  }

  const buttonConfig = [
    { label: MODAL_LABELS.BACK, onClick: handleClose },
    { label: MODAL_LABELS.SAVE, onClick: handleSave },
  ]

  return (
    <CommonModal
      open={open}
      onClose={handleClose}
      title={initialData ? editTitle : title}
    >
      <CommonModalScroll>
        <Grid2 container spacing={NUMBERMAP.ONE}>
          <Grid2 size={NUMBERMAP.TWELVE}>
            <RichTextEditor
              label={label}
              value={formData.value}
              onChange={(value) => handleFieldChange('value', value)}
              error={errors.value}
              placeholder={placeholder}
            />
          </Grid2>
          {additionalFields?.(formData, handleCustomFieldChange, errors)}
          <Grid2 size={NUMBERMAP.TWELVE}>
            <InputField
              label={MODAL_LABELS.STATUS}
              placeholder={MODAL_PLACEHOLDERS.STATUS}
              isDropdown
              value={formData.status?.toString() ?? ''}
              onChange={(value: string) => handleFieldChange('status', Number(value))}
              options={statusData?.data ?? []}
              keyField={MODAL_FIELD_KEYS.STATUS_ID_FIELD}
              valueField={MODAL_FIELD_KEYS.STATUS_NAME_FIELD}
              error={errors.status}
            />
          </Grid2>
          <Grid2 size={NUMBERMAP.TWELVE}>
            <ButtonGroup buttons={buttonConfig} />
          </Grid2>
        </Grid2>
      </CommonModalScroll>
    </CommonModal>
  )
}

export default BaseIntendedUseModal

