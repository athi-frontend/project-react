'use client'
import React, { useState, forwardRef, useImperativeHandle } from 'react'
import { Box, Grid2 } from '@mui/material'
import { InputField } from '@/components/ui'
import { ConversionRateRow } from '@/types/modules/dnd/hld'
import { numberValidation } from '@/lib/utils/common'

import { InputDesignFormErrors } from './CompetitiveLandscapeForm'
import { NUMBERMAP } from '@/constants/common'
import { FIELD_NAME, VALID_TEXT, VALIDATION } from '@/constants/modules/dnd/hld'

interface ConversionRateFormProps {
  initialData?: ConversionRateRow
  onSubmit: (data: ConversionRateRow) => void
  hasEditable:boolean
}

const ConversionRateForm = forwardRef<
  { handleSubmit: () => void },
  ConversionRateFormProps
>(({ initialData, onSubmit ,hasEditable}, ref) => {
  const [formData, setFormData] = useState<ConversionRateRow>(
    initialData ?? {
      id: '',
      target_geography: '',
      target_segment: '',
      target_customer_segment: '',
      conversion_1: '',
      conversion_2: '',
      conversion_3: '',
    }
  )

  const [errors, setErrors] = useState<InputDesignFormErrors>({
    target_geography: '',
    target_segment: '',
    target_customer_segment: '',
    conversion_1: '',
    conversion_2: '',
    conversion_3: '',
  })

  const handleChange = (field: keyof ConversionRateRow, value: string) => {
    // Apply number validation for numeric fields
    if(hasEditable) return
    if (
      (field === FIELD_NAME.TARGET || 
       field === FIELD_NAME.CONVO_1 || 
       field === FIELD_NAME.CONVO_2 || 
       field === FIELD_NAME.CONVO_3 ) && 
      value && 
      !numberValidation.test(value)
    ) {
      return // Don't update if not a valid number
    }

    setFormData((prev) => ({ ...prev, [field]: value }))

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {
      target_geography: '',
      target_segment: '',
      target_customer_segment: '',
      conversion_1: '',
      conversion_2: '',
      conversion_3: '',
    }

    let isValid = true

    if (!formData.target_geography.trim()) {
      newErrors.target_geography = 'Target Geography is required'
      isValid = false
    }

    if (!formData.target_segment.trim()) {
      newErrors.target_segment = 'Target Segment is required'
      isValid = false
    }

    if (!String(formData.target_customer_segment).trim()) {
      newErrors.target_customer_segment =
        VALIDATION.TARGET
      isValid = false
    } else if (!numberValidation.test(String(formData.target_customer_segment))) {
      newErrors.target_customer_segment = VALID_TEXT
      isValid = false
    }

    if (!String(formData.conversion_1).trim()) {
      newErrors.conversion_1 = VALIDATION.CONVO_1
      isValid = false
    } else if (!numberValidation.test(String(formData.conversion_1))) {
      newErrors.conversion_1 = VALID_TEXT
      isValid = false
    }

    if (!String(formData.conversion_2).trim()) {
      newErrors.conversion_2 = VALIDATION.CONVO_2
      isValid = false
    } else if (!numberValidation.test(String(formData.conversion_2))) {
      newErrors.conversion_2 = VALID_TEXT
      isValid = false
    }

    if (!String(formData.conversion_3).trim()) {
      newErrors.conversion_3 = VALIDATION.CONVO_3
      isValid = false
    } else if (!numberValidation.test(String(formData.conversion_3))) {
      newErrors.conversion_3 = VALID_TEXT
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = () => {
    if (validateForm() && !hasEditable) {
      onSubmit(formData)
    }
  }

  useImperativeHandle(ref, () => ({
    handleSubmit,
  }))

  return (
    <Box sx={{ height: '400px', overflow: 'auto', scrollbarWidth: 'none' }}>
      <Grid2 container spacing={1}>
        <Grid2 size={{ md: NUMBERMAP.TWELVE }}>
          <InputField
            label="Target Geography*"
            placeholder="Enter Target Geography"
            value={formData.target_geography ?? ''}
            onChange={(value) =>
              handleChange('target_geography', value as string)
            }
            error={errors.target_geography}
          />
        </Grid2>
        <Grid2 size={{ md: NUMBERMAP.TWELVE }}>
          <InputField
            label="Target Segment*"
            placeholder="Enter Target Segment"
            value={formData.target_segment ?? ''}
            onChange={(value) =>
              handleChange('target_segment', value as string)
            }
            error={errors.target_segment}
          />
        </Grid2>
        <Grid2 size={{ md: NUMBERMAP.TWELVE }}>
          <InputField
            label="No. of Target Customer per Each Segment*"
            placeholder="Enter No. of target customer per each segment"
            value={formData.target_customer_segment ?? ''}
            onChange={(value) =>
              handleChange('target_customer_segment', value as string)
            }
            error={errors.target_customer_segment}
          />
        </Grid2>
        <Grid2 size={{ md: NUMBERMAP.TWELVE }}>
          <InputField
            label="Conversion Year 1*"
            placeholder="Enter conversion year 1"
            value={formData.conversion_1 ?? ''}
            onChange={(value) => handleChange('conversion_1', value as string)}
            error={errors.conversion_1}
          />
        </Grid2>
        <Grid2 size={{ md: NUMBERMAP.TWELVE }}>
          <InputField
            label="Conversion Year 2*"
            placeholder="Enter conversion year 2"
            value={formData.conversion_2 ?? ''}
            onChange={(value) => handleChange('conversion_2', value as string)}
            error={errors.conversion_2}
          />
        </Grid2>
        <Grid2 size={{ md: NUMBERMAP.TWELVE }}>
          <InputField
            label="Conversion Year 3*"
            placeholder="Enter conversion year 3"
            value={formData.conversion_3 ?? ''}
            onChange={(value) => handleChange('conversion_3', value as string)}
            error={errors.conversion_3}
          />
        </Grid2>
      </Grid2>
    </Box>
  )
})

export default ConversionRateForm
