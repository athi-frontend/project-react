export interface CreatePasswordFormProps {
  onSubmit?: (formData: CreatePasswordFormData) => void
}

export interface CreatePasswordFormData {
  newPassword: string
  confirmPassword: string
  newPin: string
  confirmPin: string
}

export interface Errors {
  newPassword?: string
  confirmPassword?: string
  newPin?: string
  confirmPin?: string
  apiError?: string
}

export interface PasswordPolicy {
  id: string
  text: string
  isValid: boolean
}

export interface SetPasswordPayload {
  new_password: string
  confirm_password: string
  new_pin: string
  confirm_pin: string
}

export interface ApiResponse {
  code: number
  status: string
  message?: string
}

export interface CreatePasswordFormProps {
  onSubmit?: (formData: CreatePasswordFormData) => void
}

export interface CreatePasswordFormData {
  newPassword: string
  confirmPassword: string
  newPin: string
  confirmPin: string
}

export interface Errors {
  newPassword?: string
  confirmPassword?: string
  newPin?: string
  confirmPin?: string
  apiError?: string
  [key: string]: string | undefined
}

export interface PasswordPolicy {
  id: string
  text: string
  isValid: boolean
}

export interface PasswordVisibility {
  newPassword: boolean
  confirmPassword: boolean
  newPin: boolean
  confirmPin: boolean
}

export interface HandleInputChange {
  field: keyof CreatePasswordFormData
  value: string
}
