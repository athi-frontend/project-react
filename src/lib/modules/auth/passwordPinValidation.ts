import { NUMBERMAP } from '@/constants/common'
import {
  CREATE_PASSWORD_CONSTANTS,
  SETTING_PASSWORD_CONSTANTS,
} from '@/constants/modules/user/settingPassword'
import {
  CreatePasswordFormData,
  Errors,
  PasswordVisibility,
  PasswordPolicy,
} from '@/types/modules/user/settingPassword'

const { REGEX, PASSWORD_POLICIES, ERRORS } = CREATE_PASSWORD_CONSTANTS

export const validatePasswordPolicy = (
  password: string,
  policyId: string
): boolean => {
  switch (policyId) {
    case PASSWORD_POLICIES.IDS.LENGTH:
      return password.length >= NUMBERMAP.EIGHT && password.length <= NUMBERMAP.TWENTY
    case PASSWORD_POLICIES.IDS.UPPERCASE:
      return REGEX.UPPERCASE.test(password)
    case PASSWORD_POLICIES.IDS.NUMBERS:
      return REGEX.NUMBER.test(password)
    case PASSWORD_POLICIES.IDS.SPECIAL:
      return REGEX.SPECIAL_CHAR.test(password)
    default:
      return false
  }
}

export const validatePassword = (
  password: string
): { isValid: boolean; error?: string } => {
  if (!password) return { isValid: false, error: ERRORS.PASSWORD_REQUIRED }

  const policies = PASSWORD_POLICIES.DEFAULT_POLICIES
  const failedPolicies = []

  for (const policy of policies) {
    if (!validatePasswordPolicy(password, policy.id)) {
      failedPolicies.push(policy.id)
    }
  }
  
  if (failedPolicies.length > NUMBERMAP.ZERO) {
    const errorMessages = failedPolicies.map(policyId => {
      const errorKey = `PASSWORD_${policyId.toUpperCase()}`
      const errorMessage = ERRORS[errorKey as keyof typeof ERRORS]
      return errorMessage
    }).filter(Boolean)
    
    const finalError = errorMessages.join(', ')    
    return {
      isValid: false,
      error: finalError
    }
  }
  return { isValid: true }
}

export const validatePin = (
  pin: string
): { isValid: boolean; error?: string } => {
  if (!pin) return { isValid: false, error: ERRORS.PIN_REQUIRED }
  if (!REGEX.DIGITS_ONLY.test(pin))
    return { isValid: false, error: ERRORS.PIN_NUMBERS_ONLY }
  if (pin.length !== 4) return { isValid: false, error: ERRORS.PIN_LENGTH }
  return { isValid: true }
}

const validateConfirmation = (
  original: string,
  confirm: string,
  errorEmpty: string,
  errorMismatch: string
): { isValid: boolean; error?: string } => {
  if (!confirm) return { isValid: false, error: errorEmpty }
  if (confirm !== original) return { isValid: false, error: errorMismatch }
  return { isValid: true }
}

export const validateForm = (
  formData: CreatePasswordFormData,
  currentErrors: Errors
): { isValid: boolean; newErrors: Errors } => {
  const newErrors: Errors = { ...currentErrors, apiError: '' }
  let isValid = true

  const passwordValidation = validatePassword(formData.newPassword)
  if (!passwordValidation.isValid) {
    newErrors.newPassword = passwordValidation.error
    isValid = false
  }

  const confirmPasswordValidation = validateConfirmation(
    formData.newPassword,
    formData.confirmPassword,
    ERRORS.CONFIRM_PASSWORD_REQUIRED,
    ERRORS.PASSWORDS_DO_NOT_MATCH
  )
  if (!confirmPasswordValidation.isValid) {
    newErrors.confirmPassword = confirmPasswordValidation.error
    isValid = false
  }

  const newPinValidation = validatePin(formData.newPin)
  if (!newPinValidation.isValid) {
    newErrors.newPin = newPinValidation.error
    isValid = false
  }

  const confirmPinValidation = validatePin(formData.confirmPin)
  if (!confirmPinValidation.isValid) {
    newErrors.confirmPin = confirmPinValidation.error
    isValid = false
  } else {
    const matchPinValidation = validateConfirmation(
      formData.newPin,
      formData.confirmPin,
      '',
      ERRORS.PINS_DO_NOT_MATCH
    )
    if (!matchPinValidation.isValid) {
      newErrors.confirmPin = matchPinValidation.error
      isValid = false
    }
  }

  return { isValid, newErrors }
}

export const InitialFormData: CreatePasswordFormData = {
  newPassword: '',
  confirmPassword: '',
  newPin: '',
  confirmPin: '',
}

export const initialPasswordPolicies: PasswordPolicy[] = [
  { id: 'length', text: 'At least 8 characters', isValid: false },
  { id: 'uppercase', text: 'At least one uppercase letter', isValid: false },
  { id: 'numbers', text: 'At least one number', isValid: false },
  { id: 'special', text: 'At least one special character', isValid: false },
]

export const initialPasswordVisibility: PasswordVisibility = {
  newPassword: false,
  confirmPassword: false,
  newPin: false,
  confirmPin: false,
}

export const policyFeedbackMap = {
  true: {
    icon: SETTING_PASSWORD_CONSTANTS.VALID_POLICY_ICON,
    alt: SETTING_PASSWORD_CONSTANTS.VALID_POLICY_ALT,
  },
  false: {
    icon: SETTING_PASSWORD_CONSTANTS.INVALID_POLICY_ICON,
    alt: SETTING_PASSWORD_CONSTANTS.INVALID_POLICY_ALT,
  },
}

export const policyIconMap: Record<'true' | 'false', string> = {
  true: SETTING_PASSWORD_CONSTANTS.VALID_POLICY_ICON,
  false: SETTING_PASSWORD_CONSTANTS.INVALID_POLICY_ICON,
}

export const policyAltMap: Record<'true' | 'false', string> = {
  true: SETTING_PASSWORD_CONSTANTS.VALID_POLICY_ALT,
  false: SETTING_PASSWORD_CONSTANTS.INVALID_POLICY_ALT,
}
