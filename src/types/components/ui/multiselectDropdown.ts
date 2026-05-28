export interface Member {
  [key: string]: string | number
}

export interface MultiSelectionProps {
  options: Member[]
  idField: string
  valueField: string
  label: string
  placeholder: string
  disabled?: boolean
  value: Array<number | string>
  onChange: (value: Array<number | string>) => void
  error?: string
  dataIsAutocomplete?: string[] | number[]
  dataSourceName?: string
  dataFieldName?: string
  dataIsMultiSelect?: boolean
  customOption?: boolean
  customOptionLabel?: string
  customOptionPlaceholder?: string
}
