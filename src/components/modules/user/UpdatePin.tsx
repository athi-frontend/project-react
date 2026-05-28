'use client'
import React, { useRef, useEffect } from 'react'
import { PinInputGroupProps } from '@/types/modules/user/updatePassword'
import { Label ,Container,PinContainer,PinInput} from '@/styles/components/modules/updatePinPassword'
import { numberValidation } from '@/lib/utils/common'
import { NUMBERMAP } from '@/constants/common'


const PinInputGroup: React.FC<PinInputGroupProps> = ({
  label,
  value,
  onChange,
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const handleChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const inputValue = e.target.value.slice(NUMBERMAP.NEGATIVE_ONE)
    if (inputValue === '' || numberValidation.test(inputValue)) {
      const newValue = [...value]
      newValue[index] = inputValue
      onChange(newValue)

      if (inputValue && index < NUMBERMAP.THREE) {
        inputRefs.current[index + NUMBERMAP.ONE]?.focus()
      }
    }
  }

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 4)
  }, [])

  return (
    <Container>
      <Label>{label}</Label>
      <PinContainer>
        {[0, 1, 2, 3].map((index) => (
          <PinInput
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="password"
            value={value[index] ?? ''}
            onChange={(e) => handleChange(index, e)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            maxLength={1}
            aria-label={`${label} digit ${index + 1}`}
          />
        ))}
      </PinContainer>
    </Container>
  )
}

export default PinInputGroup
