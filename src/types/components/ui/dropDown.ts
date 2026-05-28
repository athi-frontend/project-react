export interface Member {
  [key: string]: string | number
}

export interface SelectedListModalProps {
  open: boolean
  onClose: () => void
  listData: Member[]
  idField: string | number
  valueField: string
}

export interface MultiSelectionProps {
  options: Member[]
  idField: keyof Member
  placeholder: string
  label: string
  valueField: keyof Member
}

export interface Option {
  [key: string]: string | number
}
export interface SelectedListModalProps {
  open: boolean
  onClose: () => void
  listData: Member[]
  idField: string | number
  valueField: string
}

export interface InputFieldProps {
  label: string
  placeholder?: string
  isDropdown?: boolean
  isMultiSelect?: boolean
  value: string | string[] | null
  onChange: ((value: string) => void) | ((value: string[]) => void)
  error?: string
  options?: any[]
  keyField?: string
  valueField?: string
  type?: string
  endAdornment?: React.ReactNode
  disabled?: boolean
  dataIsAutocomplete?: string | number
  dataSourceName?: string
  dataFieldName?: string
  infoText?: string
   icon?: React.ReactNode
   maxLength ?: number | null
   hasEditable?:boolean
   customOption?: boolean
   customOptionLabel?: string
   customOptionPlaceholder?: string
   isCompleted?: boolean
}

export interface InputFieldWithEditProps extends InputFieldProps {
  showEditIcon?: boolean
  keyFieldForEdit?: string
  valueFieldForEdit?: string
  onEditSave?: (newValue: string) => void
  editModalTitle?: string
  editPlaceholder?: string
  onEditValidate?: (newValue: string) => string | null // Returns error message if validation fails, null if valid
}
