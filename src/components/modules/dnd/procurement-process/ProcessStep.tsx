import React from 'react'
import {
  StepContainer,
  CustomRadio,
  StepLabel,
} from '@/styles/modules/dnd/procurementProcess'
interface ProcessStepProps {
  label: string
  value: string
  selectedValue: string
  onChange: (value: string) => void
}

const ProcessStep: React.FC<ProcessStepProps> = ({
  label,
  value,
  selectedValue,
  onChange,
}) => {
  return (
    <StepContainer>
      <CustomRadio
        checked={selectedValue === value}
        onChange={() => onChange(value)}
        value={value}
        name="process-step"
        disableRipple
      />
      <StepLabel>{label}</StepLabel>
    </StepContainer>
  )
}

export default ProcessStep
