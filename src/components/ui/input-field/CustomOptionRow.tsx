import React from 'react'
import { Button } from '@mui/material'
import CustomInputForm from './CustomInputForm'

 /**
      *Classification : Confidential
  **/

interface CustomOptionRowProps {
  placeholder: string
  customInputValue: string
  setCustomInputValue: (v: string) => void
  isAddingCustom: boolean
  setIsAddingCustom: (v: boolean) => void
  customOptionLabel: string
  onSave: (trimmed: string) => void
  onCancel: () => void
  error?: string | null
}


  

const CustomOptionRow: React.FC<CustomOptionRowProps> = ({
  placeholder,
  customInputValue,
  setCustomInputValue,
  isAddingCustom,
  setIsAddingCustom,
  customOptionLabel,
  onSave,
  onCancel,
  error,
}) => {
  if (!isAddingCustom) {
    return (
      <li key="custom-option-add-button">
        <Button
          fullWidth
          onClick={(e) => {
            e.preventDefault(); e.stopPropagation()
            setIsAddingCustom(true)
          }}
        >
          {customOptionLabel}
        </Button>
      </li>
    )
  }

  return (
    <CustomInputForm
      placeholder={placeholder}
      customInputValue={customInputValue}
      setCustomInputValue={setCustomInputValue}
      onSave={onSave}
      onCancel={onCancel}
      keyValue="custom-option-input"
      error={error}
    />
  )
}

export default CustomOptionRow


