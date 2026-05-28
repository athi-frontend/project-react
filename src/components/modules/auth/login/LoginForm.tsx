'use client'
import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  LoginFormContainer,
  FormContainer,
  LoginTitle,
  FormWrapper,
  InputContainer,
  InputLabel,
  StyledTextField,
  PasswordContainer,
  PasswordInputContainer,
  RememberForgotContainer,
  RememberMeContainer,
  RememberMeCheckbox,
  RememberMeText,
  ForgotPasswordText,
  LoginButton,
  ErrorMessage,
} from '@/styles/modules/auth/login'
import Logo from '../Logo'
import PasswordVisibilityToggle from '../PasswordVisibilityToggle'
import { LOGIN_CONSTANTS } from '@/constants/modules/auth/login'
import { useDispatch } from 'react-redux'
import { setTokens } from '@/store/slices/authSlice'
import {
  validateFormEffect,
  handleEmailChange,
  handlePasswordChange,
  togglePasswordVisibility,
  handleRememberMeChange,
  handleForgotPassword,
  handleEmailBlur,
  handlePasswordBlur,
} from '@/lib/modules/auth/login'

import { LoginError } from '@/types/modules/auth/login'
import { useLoginUser } from '@/hooks/modules/auth/useLogin'

const LoginForm: React.FC = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [isFormValid, setIsFormValid] = useState(false)

  const { mutate, isPending } = useLoginUser()
  const searchParams = useSearchParams()

  useEffect(() => {
    validateFormEffect(
      email,
      password,
      setIsFormValid,
      setEmailError,
      setPasswordError
    )
  }, [email, password])

  const handleLogin = () => {
    mutate(
      { email, password },
      {
        onSuccess: (response) => {
          const { access_token, id_token, rbac_token } = response?.data ?? {}
          if (!access_token) {
            setLoginError(LOGIN_CONSTANTS.INVALID_TOKEN_ERROR)
            return
          }

          const newTokens = {
            accessToken: access_token,
            idToken: id_token ?? null,
            rbacToken: rbac_token ?? null,
          }
          dispatch(setTokens(newTokens))
          /**
             * Function Name: Redirect url implementation
             * Params: searchParams
             * Description: Redirect logic that decides where to send the user after login,
             * Author: Athinarayanan,
             * Created: 14-08-2025,
              *Classification : Confidential
        **/
          const next = searchParams.get('next')
          if (next) {
            router.push(next)
          } else {
            router.push(LOGIN_CONSTANTS.HOME)
          }
        },
        onError: (error: unknown) => {
          const isLoginError = (err: unknown): err is LoginError => {
            if (
              typeof err !== LOGIN_CONSTANTS.OBJECT ||
              err === null ||
              !LOGIN_CONSTANTS.MESSAGE
            ) {
              return false
            }
            const message = (err as { message: unknown }).message
            return typeof message === LOGIN_CONSTANTS.STRING
          }

          let errorMessage: string
          if (isLoginError(error)) {
            errorMessage = error.message ?? LOGIN_CONSTANTS.LOGIN_FAILED_ERROR
          } else {
            errorMessage = LOGIN_CONSTANTS.LOGIN_FAILED_ERROR
          }

          const lowerCaseError = errorMessage.toLowerCase()
          const emailKeywords = [
            LOGIN_CONSTANTS.EMAIL_TYPE,
          ]
          const passwordKeywords = [LOGIN_CONSTANTS.PASSWORD_TYPE]

          if (
            emailKeywords.some((keyword) => lowerCaseError.includes(keyword))
          ) {
            setEmailError(errorMessage)
          } else if (
            passwordKeywords.some((keyword) => lowerCaseError.includes(keyword))
          ) {
            setPasswordError(errorMessage)
          } else {
            setLoginError(errorMessage)
          }
        },
      }
    )
  }

  return (
    <LoginFormContainer>
      <Logo  />
      <FormContainer>
        <LoginTitle>{LOGIN_CONSTANTS.LOGIN_TITLE}</LoginTitle>
        <FormWrapper>
          <InputContainer>
            <InputLabel>{LOGIN_CONSTANTS.EMAIL_LABEL}</InputLabel>
            <StyledTextField
              fullWidth
              placeholder={LOGIN_CONSTANTS.EMAIL_PLACEHOLDER}
              value={email}
              onChange={(e) =>
                handleEmailChange(e, setEmail, setLoginError, setEmailError)
              }
              onBlur={() => handleEmailBlur(email, setEmailError)}
              type={LOGIN_CONSTANTS.EMAIL_TYPE}
              error={!!emailError}
            />
            {emailError && <ErrorMessage>{emailError}</ErrorMessage>}
          </InputContainer>

          <PasswordContainer>
            <InputLabel>{LOGIN_CONSTANTS.PASSWORD_LABEL}</InputLabel>
            <PasswordInputContainer>
              <StyledTextField
                fullWidth
                placeholder={LOGIN_CONSTANTS.PASSWORD_PLACEHOLDER}
                value={password}
                onChange={(e) =>
                  handlePasswordChange(
                    e,
                    setPassword,
                    setLoginError,
                    setPasswordError
                  )
                }
                onBlur={() => handlePasswordBlur(password, setPasswordError)}
                type={
                  showPassword
                    ? LOGIN_CONSTANTS.TEXT_TYPE
                    : LOGIN_CONSTANTS.PASSWORD_TYPE
                }
                error={!!passwordError}
                slotProps={{
                  input: {
                    endAdornment: (
                      <PasswordVisibilityToggle
                        showPassword={showPassword}
                        togglePasswordVisibility={() =>
                          togglePasswordVisibility(
                            showPassword,
                            setShowPassword
                          )
                        }
                      />
                    ),
                  },
                }}
              />
              {passwordError && <ErrorMessage>{passwordError}</ErrorMessage>}

              <RememberForgotContainer>
                <RememberMeContainer>
                  <RememberMeCheckbox
                    checked={rememberMe}
                    onChange={(e) => handleRememberMeChange(e, setRememberMe)}
                    size={LOGIN_CONSTANTS.SMALL_SIZE}
                  />
                  <RememberMeText>
                    {LOGIN_CONSTANTS.REMEMBER_ME_TEXT}
                  </RememberMeText>
                </RememberMeContainer>
                <ForgotPasswordText
                  onClick={() => handleForgotPassword(router)}
                >
                  {LOGIN_CONSTANTS.FORGOT_PASSWORD_TEXT}
                </ForgotPasswordText>
              </RememberForgotContainer>
            </PasswordInputContainer>
          </PasswordContainer>

          {loginError && <ErrorMessage>{loginError}</ErrorMessage>}

          <LoginButton
            variant="contained"
            onClick={handleLogin}
            disabled={!isFormValid || isPending}
          >
            {isPending
              ? LOGIN_CONSTANTS.LOGIN_BUTTON_LOADING_TEXT
              : LOGIN_CONSTANTS.LOGIN_BUTTON_TEXT}
          </LoginButton>
        </FormWrapper>
      </FormContainer>
    </LoginFormContainer>
  )
}

export default LoginForm
