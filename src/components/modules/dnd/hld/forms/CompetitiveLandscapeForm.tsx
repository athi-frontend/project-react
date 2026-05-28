'use client'
import React, { useState, forwardRef, useImperativeHandle } from 'react'
import { Box, Grid2 } from '@mui/material'
import { InputField } from '@/components/ui'
import { CompetitiveLandscapeRow } from '@/types/modules/dnd/hld'
import { NUMBERMAP } from '@/constants/common'
import { numberValidation } from '@/lib/utils/common'
import {
  VALID_TEXT,
  FIELD_LABELS,
  FIELD_PLACEHOLDERS,
  ERROR_MESSAGES,
} from '@/constants/modules/dnd/hld'

export type InputDesignFormErrors = {
  [key: string]: string
}

interface CompetitiveLandscapeFormProps {
  initialData?: CompetitiveLandscapeRow
  onSubmit: (data: CompetitiveLandscapeRow) => void
  hasEditable :boolean
}

const CompetitiveLandscapeForm = forwardRef<
  { handleSubmit: () => void },
  CompetitiveLandscapeFormProps
>(({ initialData, onSubmit,hasEditable }, ref) => {
  const [formData, setFormData] = useState<CompetitiveLandscapeRow>(
    initialData ?? {
      id: '',
      market_segment: '',
      major_competitor: '',
      segment_share: '',
      price_range: '',
    }
  )

  const [errors, setErrors] = useState<InputDesignFormErrors>({
    market_segment: '',
    major_competitor: '',
    segment_share: '',
    price_range: '',
  })

  const handleChange = (
    field: keyof CompetitiveLandscapeRow,
    value: string
  ) => {
    if(hasEditable) return

    const isNumericField =
      field === 'segment_share' || field === 'price_range'

    if (isNumericField && value && !numberValidation.test(value)) {
      return
    }

    setFormData((prev) => ({ ...prev, [field]: value }))

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {
      market_segment: '',
      major_competitor: '',
      segment_share: '',
      price_range: '',
    }

    let isValid = true

    if (!formData.market_segment.trim()) {
      newErrors.market_segment = ERROR_MESSAGES.SEGMENT
      isValid = false
    }

    if (!formData.major_competitor.trim()) {
      newErrors.major_competitor = ERROR_MESSAGES.MAJOR_COMPETITOR
      isValid = false
    }

    if (!String(formData.segment_share).trim()) {
      newErrors.segment_share = ERROR_MESSAGES.SEGMENT_SHARE
      isValid = false
    } else if (!numberValidation.test(String(formData.segment_share))) {
      newErrors.segment_share = VALID_TEXT
      isValid = false
    }

    if (!String(formData.price_range).trim()) {
      newErrors.price_range = ERROR_MESSAGES.PRICE_RANGE
      isValid = false
    } else if (!numberValidation.test(String(formData.price_range))) {
      newErrors.price_range = VALID_TEXT
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
    <Box>
      <Grid2 container spacing={1}>
        <Grid2 size={{ md: NUMBERMAP.TWELVE }}>
          <InputField
            label={FIELD_LABELS.SEGMENT}
            placeholder={FIELD_PLACEHOLDERS.SEGMENT}
            value={formData.market_segment ?? ''}
            onChange={(value) =>
              handleChange('market_segment', value as string)
            }
            error={errors.market_segment}
          />
        </Grid2>
        <Grid2 size={{ md: NUMBERMAP.TWELVE }}>
          <InputField
            label={FIELD_LABELS.MAJOR_COMPETITOR}
            placeholder={FIELD_PLACEHOLDERS.MAJOR_COMPETITOR}
            value={formData.major_competitor ?? ''}
            onChange={(value) =>
              handleChange('major_competitor', value as string)
            }
            error={errors.major_competitor}
          />
        </Grid2>
        <Grid2 size={{ md: NUMBERMAP.TWELVE }}>
          <InputField
            label={FIELD_LABELS.SEGMENT_SHARE}
            placeholder={FIELD_PLACEHOLDERS.SEGMENT_SHARE}
            value={formData.segment_share ?? ''}
            onChange={(value) => handleChange('segment_share', value as string)}
            error={errors.segment_share}
          />
        </Grid2>
        <Grid2 size={{ md: NUMBERMAP.TWELVE }}>
          <InputField
            label={FIELD_LABELS.PRICE_RANGE}
            placeholder={FIELD_PLACEHOLDERS.PRICE_RANGE}
            value={formData.price_range ?? ''}
            onChange={(value) => handleChange('price_range', value as string)}
            error={errors.price_range}
          />
        </Grid2>
      </Grid2>
    </Box>
  )
})

CompetitiveLandscapeForm.displayName = 'CompetitiveLandscapeForm'

export default CompetitiveLandscapeForm
