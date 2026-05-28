'use client'
import React from 'react'
import { Grid2 } from '@mui/material'
import { Label, Value } from '@/styles/components/modules/projectInfo'
import { InfoFieldProps } from '@/types/modules/dnd/project'

const InfoField: React.FC<InfoFieldProps> = ({ label, value }) => {
  return (
    <Grid2 size={{ md: 6 }}>
      <Label variant="subtitle1">{label}</Label>
      <Value variant="body1">{value}</Value>
    </Grid2>
  )
}

export default InfoField
