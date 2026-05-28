export interface Option {
  design_input_requirement_id: number | null
  dir_name: string
}

export interface InputFieldProps {
  label: string
  placeholder: string
  isDropdown?: boolean
  isMultiSelect?: boolean
  value: string | string[]
  onChange: (value: string | string[]) => void
  error?: string
  options?: Option[]
}
