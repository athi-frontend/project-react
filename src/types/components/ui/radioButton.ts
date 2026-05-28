export interface RadioButtonGroupProps {
  label: string | number
  name: string
  options: { value: string | number; label: string }[]
  value: string | number
  onChange: (value: string | number) => void
  error?: string
  disabled?: boolean
}
