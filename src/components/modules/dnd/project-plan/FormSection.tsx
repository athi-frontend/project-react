'use client'
import React from 'react'
import { Grid2 } from '@mui/material'
import { StyledFormSection } from '@/styles/modules/dnd/projectPlan'
import { FormSectionProps } from '@/types/modules/dnd/projectPlan'
import { NUMBERMAP } from '@/constants/common'

const FormSection: React.FC<FormSectionProps> = ({
  children,
  spacing = NUMBERMAP.TWO,
  marginTop = NUMBERMAP.ZERO,
}) => {
  return (
    <StyledFormSection>
      <Grid2 container spacing={spacing} sx={{ mt: marginTop }}>
        {children}
      </Grid2>
    </StyledFormSection>
  )
}

export default FormSection
