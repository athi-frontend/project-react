'use client'
import React from 'react'
import { Grid2 } from '@mui/material'
import { InputField, Description } from '@/components/ui'
import { NUMBERMAP } from '@/constants/common'
import { ContentWrapper } from '@/styles/modules/dnd/feasibilityStudy'
import { UI_STRINGS } from '@/constants/modules/regulation/verificationValidation';

interface BiocompatibilityTestModalProps {
  formData: { stdRef: string; scopeOfStudy: string; result: string }
  errors: Record<string, string>
  onChange: (field: string, value: string) => void
}

const BiocompatibilityTestModal: React.FC<BiocompatibilityTestModalProps> = ({
  formData,
  errors,
  onChange
}) => {
  return (
    <ContentWrapper>
      <Grid2 container spacing={NUMBERMAP.TWO}>
        <Grid2 size={NUMBERMAP.TWELVE}>
          <InputField
            label={UI_STRINGS.STD_REF_LABEL}
            placeholder={UI_STRINGS.STD_REF_PLACEHOLDER}
            value={formData.stdRef}
            onChange={(value: string) => onChange('stdRef', value)}
            error={errors.stdRef}
          />
        </Grid2>
        <Grid2 size={NUMBERMAP.TWELVE}>
          <Description
            label={UI_STRINGS.SCOPE_OF_STUDY_LABEL}
            placeholder={UI_STRINGS.SCOPE_OF_STUDY_PLACEHOLDER}
            value={formData.scopeOfStudy}
            onChange={(value: string) => onChange('scopeOfStudy', value)}
            error={errors.scopeOfStudy}
          />
        </Grid2>
        <Grid2 size={NUMBERMAP.TWELVE}>
          <InputField
            label={UI_STRINGS.RESULT_LABEL}
            placeholder={UI_STRINGS.RESULT_PLACEHOLDER}
            value={formData.result}
            onChange={(value: string) => onChange('result', value)}
            error={errors.result}
          />
        </Grid2>
      </Grid2>
    </ContentWrapper>
  )
}

export default BiocompatibilityTestModal 