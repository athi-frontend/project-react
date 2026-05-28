import React from 'react'
import { SwitchProps } from '@mui/material/Switch'
import { StyledToggleSwitch } from '@/styles/components/ui/toggleSwitch'

export interface ToggleSwitchProps extends Omit<SwitchProps, 'onChange'> {
  checked?: boolean
  onChange?: (checked: boolean) => void
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked = false,
  onChange,
  ...props
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(event.target.checked)
  }

  return (
    <StyledToggleSwitch
      checked={checked}
      onChange={handleChange}
      slotProps={{ input: { 'aria-label': 'toggle switch' } }}
      size="small"
      {...props}
    />
  )
}

export default ToggleSwitch
