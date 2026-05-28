'use client'
import React from 'react'
import { Grid2 } from '@mui/material'
import { InputField } from '@/components/ui'
import { NUMBERMAP } from '@/constants/common'
import { ContentWrapper } from '@/styles/modules/dnd/feasibilityStudy'
import { UI_STRINGS } from '@/constants/modules/regulation/verificationValidation';

interface MaterialModalProps {
  formData: { partName: string; material: string }
  errors: Record<string, string>
  onChange: (field: string, value: string) => void
}

const MaterialModal: React.FC<MaterialModalProps> = ({
  formData,
  errors,
  onChange
}) => {
  return (
    <ContentWrapper>
      <Grid2 container spacing={NUMBERMAP.TWO}>
        <Grid2 size={NUMBERMAP.TWELVE}>
          <InputField
            label={UI_STRINGS.PART_NAME_LABEL}
            placeholder={UI_STRINGS.PART_NAME_PLACEHOLDER}
            value={formData.partName}
            onChange={(value: string) => onChange('partName', value)}
            error={errors.partName}
          />
        </Grid2>
        <Grid2 size={NUMBERMAP.TWELVE}>
          <InputField
            label={UI_STRINGS.MATERIAL_LABEL}
            placeholder={UI_STRINGS.MATERIAL_PLACEHOLDER}
            value={formData.material}
            onChange={(value: string) => onChange('material', value)}
            error={errors.material}
          />
        </Grid2>
      </Grid2>
    </ContentWrapper>
  )
}

export default MaterialModal 