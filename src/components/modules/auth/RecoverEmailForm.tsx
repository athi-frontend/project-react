'use client'
import React, { useState } from 'react'
import {
  FormContainer,
  InputContainer,
  InputLabel,
  StyledTextField,
  ErrorMessage,
  FormWrapper,
} from '@/styles/modules/auth/login'
import {
  RecoverPinButton,
  successMessageStyle,
} from '@/styles/modules/auth/forgotpin'
import FormHeader from './FormHeader'
import Logo from './Logo'
import { emailRegex } from '@/lib/utils/common'
import { Box } from '@mui/material'

interface RecoverEmailFormProps {
  title: string
  subtitle: string
  placeholder: string
  buttonText: string
  sendingText: string
  onSubmit: (
    email: string,
    onSuccess: () => void,
    onFailure: () => void
  ) => void
  successMessageText: string
  failedMessageText: string
  generalErrorText: string
}

const RecoverEmailForm: React.FC<RecoverEmailFormProps> = ({
  title,
  subtitle,
  placeholder,
  buttonText,
  sendingText,
  onSubmit,
  successMessageText,
  failedMessageText,
  generalErrorText,
}) => {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    setError('')
    setSuccessMessage('')
  }

  const handleSubmit = () => {
    if (email === '') {
      setError('Email is required')
      return
    }

    if (!emailRegex.test(email)) {
      setError('Invalid email format')
      return
    }

    setIsLoading(true)

    onSubmit(
      email,
      () => {
        setSuccessMessage(successMessageText)
        setError('')
        setIsLoading(false)
      },
      () => {
        setError(failedMessageText ?? generalErrorText)
        setIsLoading(false)
      }
    )
  }

  return (
    <>
      <Box sx={{ textAlign: 'center', paddingTop: '40px' }}>
        <Logo />
      </Box>
      <FormContainer>
        <FormHeader title={title} subtitle={subtitle} />
        <FormWrapper>
          <InputContainer>
            <InputLabel>Email Address</InputLabel>
            <StyledTextField
              fullWidth
              type="email"
              placeholder={placeholder}
              value={email}
              onChange={handleEmailChange}
              error={!!error}
              aria-label="email-input"
            />
            {error && <ErrorMessage>{error}</ErrorMessage>}
            {successMessage && (
              <div style={successMessageStyle}>{successMessage}</div>
            )}
          </InputContainer>
          <RecoverPinButton
            onClick={() => handleSubmit()}
            fullWidth
            variant="outlined"
            disabled={isLoading}
          >
            {isLoading ? sendingText : buttonText}
          </RecoverPinButton>
        </FormWrapper>
      </FormContainer>
    </>
  )
}

export default RecoverEmailForm
