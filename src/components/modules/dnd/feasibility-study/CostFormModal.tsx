'use client'
import React, { useState, useEffect } from 'react'
import { Grid2 } from '@mui/material'
import { ButtonGroup, InputField } from '@/components/ui'
import { ContentWrapper } from '@/styles/modules/dnd/feasibilityStudy'
import {
  INITIAL_ERRORS,
  VALIDATION_MESSAGES,
  CLASS_NAMES,
  COMPONENT_TYPES,
} from '@/constants/modules/dnd/feasibilityStudy'
import {
  FormErrors,
  StringFormField,
  CostFormData,
  CostFormFieldConfig,
} from '@/types/modules/dnd/feasibilityStudy'
import { numberValidation } from '@/lib/utils/common'
import { COST_FORM_FIELDS } from '@/lib/modules/dnd/feasibilityStudy'
import { NUMBERMAP } from '@/constants/common'

const CostFeasibilityStudy: React.FC<{
  INITIAL_COST_FORM_DATA: CostFormData
  handleSave: (data: CostFormData) => void
  handleCancel: () => void
}> = ({ INITIAL_COST_FORM_DATA, handleSave, handleCancel }) => {
  const [formData, setFormData] = useState<CostFormData>({
    productCost: INITIAL_COST_FORM_DATA.productCost ?? '',
    equipmentCost: INITIAL_COST_FORM_DATA.equipmentCost ?? '',
    developmentalCost: INITIAL_COST_FORM_DATA.developmentalCost ?? '',
    manufacturingCost: INITIAL_COST_FORM_DATA.manufacturingCost ?? '',
    otherCost: INITIAL_COST_FORM_DATA.otherCost ?? '',
  })
  const [errors, setErrors] = useState<FormErrors>(INITIAL_ERRORS)

  useEffect(() => {
    setFormData({
      productCost: INITIAL_COST_FORM_DATA.productCost ?? '',
      equipmentCost: INITIAL_COST_FORM_DATA.equipmentCost ?? '',
      developmentalCost: INITIAL_COST_FORM_DATA.developmentalCost ?? '',
      manufacturingCost: INITIAL_COST_FORM_DATA.manufacturingCost ?? '',
      otherCost: INITIAL_COST_FORM_DATA.otherCost ?? '',
    })
  }, [INITIAL_COST_FORM_DATA])

  const handleStringChange = (field: StringFormField, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value ?? '',
    }))

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }))
    }
  }

  const validateField = (
    field: keyof CostFormData,
    fieldName: string
  ): boolean => {
    const value = formData[field]
    const fieldConfig = COST_FORM_FIELDS.find(
      (f: CostFormFieldConfig) => f.field === field
    )

    if (
      fieldConfig?.label.includes('*') &&
      (!value || (typeof value === 'string' && !value.trim()))
    ) {
      setErrors((prev) => ({
        ...prev,
        [field]: VALIDATION_MESSAGES.FIELD_REQUIRED(fieldName.replace('*', '')),
      }))
      return false
    }

    if (
      fieldConfig?.numeric &&
      value &&
      !numberValidation.test(value as string)
    ) {
      setErrors((prev) => ({
        ...prev,
        [field]: VALIDATION_MESSAGES.INVALID_NUMBER,
      }))
      return false
    }

    return true
  }

  const handleSubmit = async () => {
    let isValid = true

    COST_FORM_FIELDS.forEach(({ field, label }) => {
      if (!validateField(field, label)) {
        isValid = false
      }
    })

    if (isValid) {
      handleSave({
        productCost: formData.productCost ?? '',
        equipmentCost: formData.equipmentCost ?? '',
        developmentalCost: formData.developmentalCost ?? '',
        manufacturingCost: formData.manufacturingCost ?? '',
        otherCost: formData.otherCost ?? '',
      })
    }
  }

  return (
    <ContentWrapper
      sx={{
        height: '500px',
        overflow: 'hidden',
        overflowY: 'scroll',
        scrollbarWidth: 'none',
      }}
      className={CLASS_NAMES.CONTENT_WRAPPER}
    >
      <Grid2 container spacing={NUMBERMAP.ONE}>
        {COST_FORM_FIELDS.map((fieldConfig: CostFormFieldConfig) => (
          <Grid2 size={{ md: NUMBERMAP.TWELVE }} key={fieldConfig.label}>
            {fieldConfig.type === COMPONENT_TYPES.INPUT_FIELD && (
              <InputField
                label={fieldConfig.label}
                placeholder={fieldConfig.placeholder}
                value={formData[fieldConfig.field] as string}
                onChange={(value) => {
                  const selectedValue = value as string
                  if (
                    fieldConfig.numeric &&
                    selectedValue &&
                    !numberValidation.test(selectedValue)
                  ) {
                    return
                  }
                  handleStringChange(
                    fieldConfig.field as StringFormField,
                    selectedValue
                  )
                }}
                error={errors[fieldConfig.field]}
                maxLength={fieldConfig.maxLength}
              />
            )}
          </Grid2>
        ))}
      </Grid2>
      <ButtonGroup
        buttons={[
          { label: 'Cancel', onClick: handleCancel },
          { label: 'Save', onClick: handleSubmit },
        ]}
      />
    </ContentWrapper>
  )
}

export default CostFeasibilityStudy
