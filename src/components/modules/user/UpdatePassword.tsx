'use client'
import React, { useState } from 'react'
import { InputField, ButtonGroup } from '@/components/ui'
import PasswordVisibilityToggle from '../auth/PasswordVisibilityToggle'
import { FormContainer, FormWrapper } from '@/styles/modules/auth/forgotpin'
import { CreatePasswordContainer } from '@/styles/modules/user/settingPassword'

import FormHeader from '../auth/FormHeader'
import { useUpdatePasswordMutation } from '@/hooks/modules/user/useUpdatePasswordPin'
import { Title } from '@/styles/common'
import {
  PasswordVisibility,
  Errors,
  FormData,
  HandleInputChange,
} from '@/types/modules/user/updatePassword'
import {
  UPDATE_PASSWORD,
  PASSWORD_MIN_LENGTH,
  ERROR_MESSAGES,
  PASSWORD_REGEX,
} from '@/constants/modules/user/updatePassword'
import { logout } from '@/services/common'
import { useRouter } from 'next/navigation'
import { NUMBERMAP, LOGIN_URL } from '@/constants/common'
import { handleClearLocalStorage } from '@/lib/utils/common'

const InitialFormData: FormData = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
}

const validateForm = (
  formData: FormData,
  errors: Errors
): { isValid: boolean; newErrors: Errors } => {
  const newErrors: Errors = { ...errors }

  if (!formData.currentPassword)
    newErrors.currentPassword = ERROR_MESSAGES.CURRENT_PASSWORD_REQUIRED
  else if (formData.currentPassword.length < PASSWORD_MIN_LENGTH)
    newErrors.currentPassword = ERROR_MESSAGES.CURRENT_PASSWORD_MIN_LENGTH

  if (!formData.newPassword)
    newErrors.newPassword = ERROR_MESSAGES.NEW_PASSWORD_REQUIRED
  else if (formData.newPassword.length < PASSWORD_MIN_LENGTH)
    newErrors.newPassword = ERROR_MESSAGES.NEW_PASSWORD_MIN_LENGTH
  else if (!PASSWORD_REGEX.test(formData.newPassword)) {
    newErrors.newPassword = ERROR_MESSAGES.NEW_PASSWORD_COMPLEXITY
  }

  if (!formData.confirmPassword)
    newErrors.confirmPassword = ERROR_MESSAGES.CONFIRM_PASSWORD_REQUIRED
  else if (formData.newPassword !== formData.confirmPassword) {
    newErrors.confirmPassword = ERROR_MESSAGES.PASSWORDS_DO_NOT_MATCH
  }

  return {
    isValid: Object.values(newErrors).every((error) => !error),
    newErrors,
  }
}

const UpdatePasswordForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(InitialFormData)
  const [errors, setErrors] = useState<Errors>({})
  const router = useRouter()
  const [passwordVisibility, setPasswordVisibility] =
    useState<PasswordVisibility>({
      [UPDATE_PASSWORD.CURRENT_PASSWORD_KEY]: false,
      [UPDATE_PASSWORD.NEW_PASSWORD_KEY]: false,
      [UPDATE_PASSWORD.CONFIRM_PASSWORD_KEY]: false,
    })

  const Logout = async () => {
    await logout().then((res) => {
      if (res.code === NUMBERMAP.TWOHUNDRED) {
        handleClearLocalStorage()
        window.location.href = LOGIN_URL
      }
    })
  }
  const { mutate: updatePassword, isPending: loading } =
    useUpdatePasswordMutation()

  const handleInputChange = ({ field, value }: HandleInputChange) => {
    setFormData((prev) => {
      const updatedFormData = { ...prev, [field]: value }
      if (
        field !== UPDATE_PASSWORD.NEW_PASSWORD_KEY &&
        field !== UPDATE_PASSWORD.CONFIRM_PASSWORD_KEY
      ) {
        updatedFormData['newPassword'] = prev['newPassword']
      }
      if (field !== UPDATE_PASSWORD.CONFIRM_PASSWORD_KEY) {
        updatedFormData['confirmPassword'] = prev['confirmPassword']
      }
      if (field !== UPDATE_PASSWORD.CURRENT_PASSWORD_KEY) {
        updatedFormData['currentPassword'] = prev['currentPassword']
      }
      return updatedFormData
    })
    setErrors((prev) => ({ ...prev, [field]: '' }))
    if (errors[UPDATE_PASSWORD.API_ERROR_KEY]) {
      setErrors((prev) => ({ ...prev, [UPDATE_PASSWORD.API_ERROR_KEY]: '' }))
    }
  }

  const togglePasswordVisibility = (field: keyof FormData) => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))
  }

  const handleSubmit = () => {
    const { isValid, newErrors } = validateForm(formData, errors)
    setErrors(newErrors)
    if (!isValid) return

    const payload = {
      old_password: formData.currentPassword,
      new_password: formData.newPassword,
    }

    updatePassword(payload, {
      onSuccess: () => {
        setFormData(InitialFormData)
        Logout()
      },
      onError: (error: any) => {
        setErrors((prev) => ({
          ...prev,
          [UPDATE_PASSWORD.API_ERROR_KEY]: UPDATE_PASSWORD.DEFAULT_API_ERROR,
        }))
      },
    })
  }
  const handleCancel = () => {
    setFormData(InitialFormData)
    setErrors({})
    setPasswordVisibility({
      [UPDATE_PASSWORD.CURRENT_PASSWORD_KEY]: false,
      [UPDATE_PASSWORD.NEW_PASSWORD_KEY]: false,
      [UPDATE_PASSWORD.CONFIRM_PASSWORD_KEY]: false,
    })
    router.push('/')
  }

  return (
    <CreatePasswordContainer>
      <Title sx={{ fontSize: '30px', padding: '20px 0px' }}>
        Update Password
      </Title>
      <FormHeader title="" subtitle={UPDATE_PASSWORD.FORM_SUBTITLE} />
      <FormContainer>
        <FormWrapper>
          <InputField
            label="Current Password"
            value={formData.currentPassword}
            placeholder={UPDATE_PASSWORD.CURRENT_PASSWORD_PLACEHOLDER}
            onChange={(value: string) =>
              handleInputChange({
                field: UPDATE_PASSWORD.CURRENT_PASSWORD_KEY,
                value,
              })
            }
            error={errors.currentPassword}
            type={
              passwordVisibility[UPDATE_PASSWORD.CURRENT_PASSWORD_KEY]
                ? UPDATE_PASSWORD.TEXT_TYPE
                : UPDATE_PASSWORD.PASSWORD_TYPE
            }
            endAdornment={
              <PasswordVisibilityToggle
                showPassword={
                  passwordVisibility[UPDATE_PASSWORD.CURRENT_PASSWORD_KEY]
                }
                togglePasswordVisibility={() =>
                  togglePasswordVisibility('currentPassword')
                }
              />
            }
            disabled={loading}
          />
          <InputField
            label={UPDATE_PASSWORD.NEW_PASSWORD_LABEL}
            placeholder={UPDATE_PASSWORD.NEW_PASSWORD_PLACEHOLDER}
            value={formData.newPassword}
            onChange={(value: string) =>
              handleInputChange({
                field: UPDATE_PASSWORD.NEW_PASSWORD_KEY,
                value,
              })
            }
            error={errors.newPassword}
            type={
              passwordVisibility[UPDATE_PASSWORD.NEW_PASSWORD_KEY]
                ? UPDATE_PASSWORD.TEXT_TYPE
                : UPDATE_PASSWORD.PASSWORD_TYPE
            }
            endAdornment={
              <PasswordVisibilityToggle
                showPassword={
                  passwordVisibility[UPDATE_PASSWORD.NEW_PASSWORD_KEY]
                }
                togglePasswordVisibility={() =>
                  togglePasswordVisibility('newPassword')
                }
              />
            }
            disabled={loading}
          />
          <InputField
            label={UPDATE_PASSWORD.CONFIRM_PASSWORD_LABEL}
            placeholder={UPDATE_PASSWORD.CONFIRM_PASSWORD_PLACEHOLDER}
            value={formData.confirmPassword}
            onChange={(value: string) =>
              handleInputChange({
                field: UPDATE_PASSWORD.CONFIRM_PASSWORD_KEY,
                value,
              })
            }
            error={errors.confirmPassword}
            type={
              passwordVisibility[UPDATE_PASSWORD.CONFIRM_PASSWORD_KEY]
                ? UPDATE_PASSWORD.TEXT_TYPE
                : UPDATE_PASSWORD.PASSWORD_TYPE
            }
            endAdornment={
              <PasswordVisibilityToggle
                showPassword={
                  passwordVisibility[UPDATE_PASSWORD.CONFIRM_PASSWORD_KEY]
                }
                togglePasswordVisibility={() =>
                  togglePasswordVisibility('confirmPassword')
                }
              />
            }
            disabled={loading}
          />
          <ButtonGroup
            buttons={[
              {
                label: 'Cancel',
                onClick: handleCancel,
                disabled: loading,
              },
              {
                label: loading
                  ? UPDATE_PASSWORD.SAVING_BUTTON_LABEL
                  : UPDATE_PASSWORD.SAVE_BUTTON_LABEL,
                onClick: handleSubmit,
                disabled: loading,
              },
            ]}
          />
        </FormWrapper>
      </FormContainer>
    </CreatePasswordContainer>
  )
}

export default UpdatePasswordForm
