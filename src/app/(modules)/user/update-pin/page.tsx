'use client'
import React, { useState, useEffect } from 'react'
import { CircularProgress, Grid2 } from '@mui/material'
import PinInputGroup from '@/components/modules/user/UpdatePin'
import { ButtonGroup, showActionAlert } from '@/components/ui'
import { useResetPin } from '@/hooks/modules/user/useUpdatePasswordPin'
import {
  FormContainer,
  LoadingOverlay,
  Title,
  Subtitle,
  ErrorMessage,
} from '@/styles/modules/user/updatePin'
import { useRouter } from 'next/navigation'

const PinUpdateForm: React.FC = () => {
  const [currentPin, setCurrentPin] = useState<string[]>(Array(4).fill(''))
  const [newPin, setNewPin] = useState<string[]>(Array(4).fill(''))
  const [confirmPin, setConfirmPin] = useState<string[]>(Array(4).fill(''))
  const router = useRouter()
  const [errors, setErrors] = useState<{
    currentPin?: string
    newPin?: string
    confirmPin?: string
  }>({})
  const { resetPin, loading, error, success, reset } = useResetPin()

  useEffect(() => {
    if (success) {
      showActionAlert('success')
      router.push('/')
      setCurrentPin(Array(4).fill(''))
      setNewPin(Array(4).fill(''))
      setConfirmPin(Array(4).fill(''))
      setErrors({})
    }
  }, [success])

  useEffect(() => {
    if (error) {
      showActionAlert('failed')
    }
  }, [error])

  const validatePins = (): boolean => {
    const newErrors: {
      currentPin?: string
      newPin?: string
      confirmPin?: string
    } = {}

    if (currentPin.some((digit) => digit === '')) {
      newErrors.currentPin = 'Please enter your current PIN'
    }

    if (newPin.some((digit) => digit === '')) {
      newErrors.newPin = 'Please enter a new PIN'
    } else if (newPin.every((digit, index) => digit === currentPin[index])) {
      newErrors.newPin = 'New PIN must be different from current PIN'
    } else if (newPin.every((digit) => digit === newPin[0])) {
      newErrors.newPin = 'PIN cannot contain all the same digits'
    } else {
      const isSequential = newPin.every((digit, index) => {
        if (index === 0) return true
        return parseInt(digit) === parseInt(newPin[index - 1]) + 1
      })

      if (isSequential) {
        newErrors.newPin = 'PIN cannot be sequential numbers'
      }
    }

    if (confirmPin.some((digit) => digit === '')) {
      newErrors.confirmPin = 'Please confirm your new PIN'
    } else if (!confirmPin.every((digit, index) => digit === newPin[index])) {
      newErrors.confirmPin = 'PINs do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (validatePins()) {
      const oldPin = currentPin.join('')
      const newPinValue = newPin.join('')

      try {
        await resetPin({
          old_pin: oldPin,
          new_pin: newPinValue,
        })
      } catch (error) {
        showActionAlert('customAlert', {
          title: 'Error',
          text: 'Failed to update PIN' + error,
          icon: 'error',
          cancelButton: false,
          confirmButton: false,
        })
      }
    }
  }

  const handleCancel = () => {
    router.push('/')
    setCurrentPin(Array(4).fill(''))
    setNewPin(Array(4).fill(''))
    setConfirmPin(Array(4).fill(''))
    setErrors({})
    reset()
  }

  const buttons = [
    { label: 'Cancel', onClick: handleCancel },
    { label: 'Save', onClick: handleSave },
  ]

  return (
    <Grid2 container spacing={0} sx={{ justifyContent: 'center' }}>
      <Grid2 size={6}>
        <FormContainer>
          {loading && (
            <LoadingOverlay>
              <CircularProgress color="primary" />
            </LoadingOverlay>
          )}

          <Title>Update PIN</Title>
          <Subtitle>
            Secure your account by updating your PIN regularly
          </Subtitle>

          <PinInputGroup
            label="Current PIN"
            value={currentPin}
            onChange={setCurrentPin}
            error={errors.currentPin}
          />
          {errors.currentPin && (
            <ErrorMessage>{errors.currentPin}</ErrorMessage>
          )}

          <PinInputGroup
            label="New PIN"
            value={newPin}
            onChange={setNewPin}
            error={errors.newPin}
          />
          {errors.newPin && <ErrorMessage>{errors.newPin}</ErrorMessage>}

          <PinInputGroup
            label="Confirm PIN"
            value={confirmPin}
            onChange={setConfirmPin}
            error={errors.confirmPin}
          />
          {errors.confirmPin && (
            <ErrorMessage>{errors.confirmPin}</ErrorMessage>
          )}
          <ButtonGroup buttons={buttons} />
        </FormContainer>
      </Grid2>
    </Grid2>
  )
}

export default PinUpdateForm
