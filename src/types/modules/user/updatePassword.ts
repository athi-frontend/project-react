export interface PasswordVisibility {
  [key: string]: boolean
}

export interface Errors {
  [key: string]: string
}

export interface FormData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface HandleInputChange {
  field: keyof FormData
  value: string
}

export interface PinInputGroupProps {
  label: string
  value: string[]
  onChange: (value: string[]) => void
}
