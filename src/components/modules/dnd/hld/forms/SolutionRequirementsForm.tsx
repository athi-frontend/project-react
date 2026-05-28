'use client'
import React, { useState, forwardRef, useImperativeHandle } from 'react'
import { Box, Grid2 } from '@mui/material'
import { InputField } from '@/components/ui'
import { SolutionRequirementsRow } from '@/types/modules/dnd/hld'
import { InputDesignFormErrors } from './CompetitiveLandscapeForm'

interface SolutionRequirementsFormProps {
  initialData?: SolutionRequirementsRow
  onSubmit: (data: SolutionRequirementsRow) => void
  hasEditable:boolean
}

const SolutionRequirementsForm = forwardRef<
  { handleSubmit: () => void },
  SolutionRequirementsFormProps
>(({ initialData, onSubmit ,hasEditable}, ref) => {
  const [formData, setFormData] = useState<SolutionRequirementsRow>(
    initialData ?? {
      id: '',
      must_have: '',
      nice_to_have: '',
      wont_have: '',
    }
  )

  const [errors, setErrors] = useState<InputDesignFormErrors>({
    must_have: '',
    nice_to_have: '',
    wont_have: '',
  })

  const handleChange = (
    field: keyof SolutionRequirementsRow,
    value: string
  ) => {
    if(hasEditable) return
    setFormData((prev) => ({ ...prev, [field]: value }))

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {
      must_have: '',
      nice_to_have: '',
      wont_have: '',
    }

    let isValid = true

    if (!formData.must_have.trim()) {
      newErrors.must_have = 'Must Have Requirements is required'
      isValid = false
    }

    if (!formData.nice_to_have.trim()) {
      newErrors.nice_to_have = 'Nice to Have Requirements is required'
      isValid = false
    }

    if (!formData.wont_have.trim()) {
      newErrors.wont_have = `Won't Requirements is required`
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
        <Grid2 size={{ md: 12 }}>
          <InputField
            label="Must Have Requirements*"
            placeholder="Enter must have requirements"
            value={formData.must_have ?? ''}
            onChange={(value) => handleChange('must_have', value as string)}
            error={errors.must_have}
          />
        </Grid2>
        <Grid2 size={{ md: 12 }}>
          <InputField
            label="Nice To Have Requirements*"
            placeholder="Enter nice to have requirements"
            value={formData.nice_to_have ?? ''}
            onChange={(value) => handleChange('nice_to_have', value as string)}
            error={errors.nice_to_have}
          />
        </Grid2>
        <Grid2 size={{ md: 12 }}>
          <InputField
            label="Won't Have Requirements*"
            placeholder="Enter won't have requirements"
            value={formData.wont_have ?? ''}
            onChange={(value) => handleChange('wont_have', value as string)}
            error={errors.wont_have}
          />
        </Grid2>
      </Grid2>
    </Box>
  )
})

SolutionRequirementsForm.displayName = 'SolutionRequirementsForm'

export default SolutionRequirementsForm
