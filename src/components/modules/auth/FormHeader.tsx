'use client'
import React from 'react'
import { Box } from '@mui/material'
import {
  ForgotPinTitle,
  ForgotPinSubtitle,
} from '@/styles/modules/auth/forgotpin'

const FormHeader: React.FC<{ title: string; subtitle: string }> = ({
  title,
  subtitle,
}) => {
  return (
    <Box component="header">
      <ForgotPinTitle variant="h1">{title}</ForgotPinTitle>
      <ForgotPinSubtitle variant="subtitle1">{subtitle}</ForgotPinSubtitle>
    </Box>
  )
}

export default FormHeader
