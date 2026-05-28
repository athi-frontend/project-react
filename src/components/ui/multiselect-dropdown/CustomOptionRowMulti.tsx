import React from 'react'
import CustomInputForm from '../input-field/CustomInputForm'

 /**
      *Classification : Confidential
  **/

interface CustomOptionRowMultiProps {
  idField: string
  valueField: string
  placeholder: string
  label: string
  customInputValue: string
  setCustomInputValue: (v: string) => void
  setIsAddingCustom: (v: boolean) => void
  onSave: (value: string) => void
  onCancel: () => void
}

const CustomOptionRowMulti: React.FC<CustomOptionRowMultiProps> = ({
  idField,
  valueField,
  placeholder,
  label,
  customInputValue,
  setCustomInputValue,
  setIsAddingCustom,
  onSave,
  onCancel,
}) => {
  return (
    <CustomInputForm
      placeholder={placeholder}
      customInputValue={customInputValue}
      setCustomInputValue={setCustomInputValue}
      onSave={onSave}
      onCancel={onCancel}
      keyValue="custom-option-multi-input"
    />
  )
}

export default CustomOptionRowMulti


