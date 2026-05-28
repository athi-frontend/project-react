import React from 'react'
import { styled, Box, Typography } from '@mui/material'
import { StyledTextField } from '@/styles/components/ui/input'
import { labelToId } from '@/lib/utils/formUtils'
const DescriptionContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
}))

const DescriptionLabel = styled(Typography)(({ theme }) => ({
  fontSize: '18px',
  marginBottom: '10px',
}))

const ErrorText = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.main,
  fontSize: '14px',
  marginTop: '5px',
}))

interface DescriptionProps {
  label?: string
  value: string
  disabled?: boolean
  placeholder: string
  onChange: (value: string) => void
  error?: string
  dataSourceName?: string
  dataFieldName?: string
  maxLength?: number | null
}

const Description: React.FC<DescriptionProps> = ({
  label = 'Description*',
  value,
  disabled,
  onChange,
  error,
  placeholder = 'Enter the input',
  dataSourceName,
  dataFieldName,
  maxLength = null
}) => {
  return (
    <DescriptionContainer>
      <DescriptionLabel>{label}</DescriptionLabel>
      <StyledTextField
        multiline
        variant="outlined"
        rows={4}
        onKeyDown={(e) => {
          e.stopPropagation();
        }}
        disabled={disabled}
        placeholder={placeholder}
        fullWidth
        value={value}
        onChange={(e) => onChange(e.target.value)}
        error={!!error}
        id={labelToId(label)}
        slotProps={{
          htmlInput: {
            'data-sourcename': dataSourceName,
            'data-fieldname': dataFieldName,
            'maxLength' : maxLength,
          },
        }}
      />
      {error && <ErrorText>{error}</ErrorText>}
    </DescriptionContainer>
  )
}

export default Description
