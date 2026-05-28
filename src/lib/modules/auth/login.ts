import { ChangeEvent } from 'react'
import { LOGIN_CONSTANTS } from '@/constants/modules/auth/login'
import { emailRegex } from '../../utils/common'
import { NUMBERMAP } from '@/constants/common'

export const validateEmail = (
  email: string,
  setEmailError: (error: string) => void
): boolean => {
  const isValid = emailRegex.test(email)
  if (!email) {
    setEmailError(LOGIN_CONSTANTS.EMAIL_REQUIRED_ERROR)
    return false
  } else if (!isValid) {
    setEmailError(LOGIN_CONSTANTS.EMAIL_INVALID_ERROR)
    return false
  } else {
    setEmailError('')
    return true
  }
}

export const validatePassword = (
  password: string,
  setPasswordError: (error: string) => void
): boolean => {
  if (!password) {
    setPasswordError(LOGIN_CONSTANTS.PASSWORD_REQUIRED_ERROR)
    return false
  } else if (password.length < NUMBERMAP.EIGHT) {
    setPasswordError(LOGIN_CONSTANTS.PASSWORD_LENGTH_ERROR)
    return false
  } else {
    setPasswordError('')
    return true
  }
}

export const handleEmailChange = (
  e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  setEmail: (email: string) => void,
  setLoginError: (error: string) => void,
  setEmailError: (error: string) => void
) => {
  const newEmail = e.target.value
  setEmail(newEmail)
  setLoginError('')
  if (newEmail) validateEmail(newEmail, setEmailError)
  else setEmailError('')
}

export const handlePasswordChange = (
  e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  setPassword: (password: string) => void,
  setLoginError: (error: string) => void,
  setPasswordError: (error: string) => void
) => {
  const newPassword = e.target.value
  setPassword(newPassword)
  setLoginError('')
  if (newPassword) validatePassword(newPassword, setPasswordError)
  else setPasswordError('')
}

export const togglePasswordVisibility = (
  showPassword: boolean,
  setShowPassword: (show: boolean) => void
) => {
  setShowPassword(!showPassword)
}

export const handleRememberMeChange = (
  e: ChangeEvent<HTMLInputElement>,
  setRememberMe: (remember: boolean) => void
) => {
  setRememberMe(e.target.checked)
}

export const handleForgotPassword = (router: {
  push: (path: string) => void
}) => {
  router.push(LOGIN_CONSTANTS.FORGOT_PASSWORD_PATH)
}

export const handleEmailBlur = (
  email: string,
  setEmailError: (error: string) => void
) => {
  if (email) validateEmail(email, setEmailError)
}

export const handlePasswordBlur = (
  password: string,
  setPasswordError: (error: string) => void
) => {
  if (password) validatePassword(password, setPasswordError)
}

export const validateFormEffect = (
  email: string,
  password: string,
  setIsFormValid: (valid: boolean) => void,
  setEmailError: (error: string) => void,
  setPasswordError: (error: string) => void
) => {
  const isEmailValid = email ? validateEmail(email, setEmailError) : false
  const isPasswordValid = password
    ? validatePassword(password, setPasswordError)
    : false
  setIsFormValid(isEmailValid && isPasswordValid)
}
