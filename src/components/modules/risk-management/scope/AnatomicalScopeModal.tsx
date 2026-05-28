'use client'
import ButtonGroup from '@/components/ui/button-group/ButtonGroup'
import React, { useState } from 'react'
import Grid2 from '@mui/material/Grid2'
import { InputField } from '@/components/ui'
import { NUMBERMAP } from '@/constants/common'
import CommonModal from '@/components/ui/common-modal/CommonModal'
import {
  ANATOMICAL_SCOPE_MODAL,
  FORM_FIELD_NAMES,
  VALIDATION_FIELD_NAMES,
} from '@/constants/modules/risk-management/scope'
import { BUTTONLABELS } from '@/lib/utils/common'

/**
 *Classification : Confidential
 **/
interface AnatomicalScopeData {
  bodyPart: string
  typeOfTissue: string
}

interface AnatomicalScopeFormErrors {
  bodyPart: string
  typeOfTissue: string
}

interface AnatomicalScopeModalProps {
  onSave?: (data: AnatomicalScopeData) => void
  onCancel?: () => void
  onClose?: () => void
  open: boolean
  initialData?: AnatomicalScopeData
  readOnly?: boolean;
}

const INITIAL_FORM_DATA: AnatomicalScopeData = {
  bodyPart: '',
  typeOfTissue: '',
}

const INITIAL_ERRORS: AnatomicalScopeFormErrors = {
  bodyPart: '',
  typeOfTissue: '',
}

const AnatomicalScopeModal: React.FC<AnatomicalScopeModalProps> = ({
  onSave,
  onCancel,
  onClose,
  open,
  initialData,
  readOnly = false,
}) => {
  const [anatomicalData, setAnatomicalData] =
    useState<AnatomicalScopeData>(INITIAL_FORM_DATA)
  const [formErrors, setFormErrors] =
    useState<AnatomicalScopeFormErrors>(INITIAL_ERRORS)

  // Update form data when initialData changes (for editing)
  React.useEffect(() => {
    if (initialData) {
      setAnatomicalData(initialData)
    } else {
      setAnatomicalData(INITIAL_FORM_DATA)
    }
  }, [initialData])

  const handleChange =
    (field: keyof AnatomicalScopeData) => (value: string) => {
      setAnatomicalData((prev) => ({
        ...prev,
        [field]: value,
      }))

      if (formErrors[field]) {
        setFormErrors((prev) => ({ ...prev, [field]: '' }))
      }
    }

  /**
   * Function Name: validateForm
   * Params: None
   * Description: Validates the anatomical scope form data and returns validation status
   * Author: Madhumitha
   * Created: 01-09-2025
   * Modified:
   * Classification: Confidential
   */
  const validateForm = (): boolean => {
    const errors = { ...INITIAL_ERRORS }
    let valid = true

    // Common validation for required string fields
    const requiredFields = [
      {
        field: VALIDATION_FIELD_NAMES.BODY_PART,
        error: ANATOMICAL_SCOPE_MODAL.BODY_PART_REQUIRED,
      },
      {
        field: VALIDATION_FIELD_NAMES.TYPE_OF_TISSUE,
        error: ANATOMICAL_SCOPE_MODAL.TYPE_OF_TISSUE_REQUIRED,
      },
    ]

    requiredFields.forEach(({ field, error }) => {
      if (!anatomicalData[field as keyof AnatomicalScopeData]?.trim()) {
        errors[field as keyof AnatomicalScopeFormErrors] = error
        valid = false
      }
    })

    setFormErrors(errors)
    return valid
  }

  const resetForm = () => {
    setAnatomicalData(INITIAL_FORM_DATA)
    setFormErrors(INITIAL_ERRORS)
  }

  const handleModalSave = () => {
    if (!validateForm()) return
    onSave?.(anatomicalData)
    resetForm()
    onClose?.()
  }

  const handleModalClose = () => {
    resetForm()
    onCancel?.()
    onClose?.()
  }

  return (
    <CommonModal
      open={open}
      onClose={handleModalClose}
      title={ANATOMICAL_SCOPE_MODAL.TITLE}
    >
      <Grid2 container spacing={NUMBERMAP.TWO}>
        <Grid2 size={NUMBERMAP.TWELVE}>
          <InputField
            label={ANATOMICAL_SCOPE_MODAL.BODY_PART_LABEL}
            placeholder={ANATOMICAL_SCOPE_MODAL.BODY_PART_PLACEHOLDER}
            value={anatomicalData.bodyPart}
            onChange={handleChange(
              FORM_FIELD_NAMES.BODY_PART as keyof AnatomicalScopeData
            )}
            error={formErrors.bodyPart}
            disabled={readOnly}
          />
        </Grid2>

        <Grid2 size={NUMBERMAP.TWELVE}>
          <InputField
            label={ANATOMICAL_SCOPE_MODAL.TYPE_OF_TISSUE_LABEL}
            placeholder={ANATOMICAL_SCOPE_MODAL.TYPE_OF_TISSUE_PLACEHOLDER}
            value={anatomicalData.typeOfTissue}
            onChange={handleChange(
              FORM_FIELD_NAMES.TYPE_OF_TISSUE as keyof AnatomicalScopeData
            )}
            error={formErrors.typeOfTissue}
            disabled={readOnly}
          />
        </Grid2>
      </Grid2>
      <ButtonGroup
        buttons={[
          { label: BUTTONLABELS.BUTTON_LABEL_CANCEL, onClick: handleModalClose },
          { label: BUTTONLABELS.BUTTON_LABEL_SAVE, onClick: handleModalSave, disabled: readOnly }
        ]}
      />
    </CommonModal>
  )
}

export default AnatomicalScopeModal
