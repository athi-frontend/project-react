"use Client"
import React from 'react'
import { Radio } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import {
  GroupContainer,
  ErrorText,
  GroupLabel,
  StyledRadioGroup,
  StyledFormControlLabel,
} from '@/styles/components/ui/radioButton'
import { labelToId } from '@/lib/utils/formUtils'

interface RadioButtonGroupProps {
  label: string | number
  name: string
  options: { value: string | number; label: string }[]
  value: string | number
  onChange: (value: string | number) => void
  error?: string
  disabled?: boolean
}

const RadioButtonGroup: React.FC<RadioButtonGroupProps> = ({
  label,
  name,
  options,
  value,
  onChange,
  error,
  disabled,
}) => {
  const theme = useTheme()

  return (
    <GroupContainer>
      <GroupLabel>{label}</GroupLabel>
      <StyledRadioGroup
        value={value}
        onChange={(e) => onChange(e.target.value)}
        name={name}
        id={labelToId(String(label))}
      >
        {options.map((option) => (
          <StyledFormControlLabel
            key={option.value}
            value={option.value}
            control={
              <Radio
                sx={{
                  color: theme.palette.text.primary,
                  '&.Mui-checked': {
                    color: theme.palette.text.primary,
                  },
                }}
              />
            }
            label={option.label}
            disabled={disabled}
          />
        ))}
      </StyledRadioGroup>
      {error && <ErrorText>{error}</ErrorText>}
    </GroupContainer>
  )
}

export default RadioButtonGroup
