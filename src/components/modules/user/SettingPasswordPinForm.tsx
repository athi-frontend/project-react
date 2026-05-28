'use client'
import React, { useState, useEffect } from 'react'
import { InputField, ButtonGroup, showActionAlert } from '@/components/ui'
import PasswordVisibilityToggle from '../auth/PasswordVisibilityToggle'
import {
  LogoImage,
  FormContainer,
  FormWrapper,
} from '@/styles/modules/auth/forgotpin'
import {
  CreatePasswordContainer,
  FormTitle,
  PasswordPoliciesContainer,
  PasswordPoliciesTitle,
  PolicyItem,
  PolicyText,
  ErrorMessage
} from '@/styles/modules/user/settingPassword'
import {
  CreatePasswordFormProps,
  CreatePasswordFormData,
  Errors,
  SetPasswordPayload,
  PasswordVisibility,
  HandleInputChange,
  PasswordPolicy,
} from '@/types/modules/user/settingPassword'
import {
  SETTING_PASSWORD_CONSTANTS,
  FIELDS,
} from '@/constants/modules/user/settingPassword'
import {
  useSetPasswordMutation,
  useResetPasswordMutation,
} from '@/services/modules/user/setPassword'
import {
  validateForm,
  validatePasswordPolicy,
  InitialFormData,
  initialPasswordPolicies,
  initialPasswordVisibility,
} from '@/lib/modules/auth/passwordPinValidation'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
/**
Classification : Confidential
**/
const {
  API_ERROR_KEY,
  NEW_PASSWORD_KEY,
  CONFIRM_PASSWORD_KEY,
  NEW_PIN_KEY,
  CONFIRM_PIN_KEY,
  TEXT_TYPE,
  PASSWORD_TYPE,
  LOGO_SRC,
  LOGO_ALT,
  FORM_TITLE,
  PASSWORD_POLICIES_TITLE,
  NEW_PASSWORD_LABEL,
  NEW_PASSWORD_PLACEHOLDER,
  CONFIRM_PASSWORD_LABEL,
  CONFIRM_PASSWORD_PLACEHOLDER,
  NEW_PIN_LABEL,
  NEW_PIN_PLACEHOLDER,
  CONFIRM_PIN_LABEL,
  CONFIRM_PIN_PLACEHOLDER,
  SAVE_BUTTON_LABEL,
  SAVING_BUTTON_LABEL,
  DEFAULT_API_ERROR,
} = SETTING_PASSWORD_CONSTANTS

const SettingPasswordForm: React.FC<CreatePasswordFormProps> = ({
  onSubmit,
}) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const params = useParams()
  const { id } = params
  const token = searchParams.get('token')
  const [formData, setFormData] =
    useState<CreatePasswordFormData>(InitialFormData)
  const [errors, setErrors] = useState<Errors>({})
  const [passwordVisibility, setPasswordVisibility] =
    useState<PasswordVisibility>(initialPasswordVisibility)

  const [passwordPolicies, setPasswordPolicies] = useState<PasswordPolicy[]>(
    initialPasswordPolicies
  )

  const { mutate: setPasswordMutation, isPending: loading } =
    useSetPasswordMutation()

  const { mutate: resetPasswordMutation } = useResetPasswordMutation()

  useEffect(() => {
    const updatedPolicies = initialPasswordPolicies.map((policy) => ({
      ...policy,
      isValid: validatePasswordPolicy(formData[NEW_PASSWORD_KEY], policy.id),
    }))
    setPasswordPolicies(updatedPolicies)
  }, [formData[NEW_PASSWORD_KEY]])

  const handleInputChange = ({ field, value }: HandleInputChange) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
    if (errors[API_ERROR_KEY]) {
      setErrors((prev) => ({ ...prev, [API_ERROR_KEY]: '' }))
    }
  }

  const togglePasswordVisibility = (field: keyof PasswordVisibility) => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))
  }

  const handleSubmit = () => {
    const { isValid, newErrors } = validateForm(formData, errors)
    setErrors(newErrors)
    if (!isValid) return

    const payload: SetPasswordPayload = FIELDS.reduce((acc, { key, value }) => {
      acc[value as keyof SetPasswordPayload] =
        formData[key as keyof CreatePasswordFormData]
      return acc
    }, {} as SetPasswordPayload)
    if (id == 'reset-forgot-password') {
      resetPasswordMutation(
        { ...payload, token },
        {
          onSuccess: () => {
            onSubmit?.(formData)
            setFormData(InitialFormData)
            showActionAlert('success')
            router.push('/login')
          },
          onError: (error: Error) => {
            setErrors((prev) => ({
              ...prev,
              [API_ERROR_KEY]: error.message ?? DEFAULT_API_ERROR,
            }))
            showActionAlert('failed')
          },
        }
      )
    } else if (id == 'set-password') {
      setPasswordMutation(
        { ...payload, token },
        {
          onSuccess: () => {
            onSubmit?.(formData)
            setFormData(InitialFormData)
            showActionAlert('success')
          },
          onError: (error: Error) => {
            setErrors((prev) => ({
              ...prev,
              [API_ERROR_KEY]: error.message ?? DEFAULT_API_ERROR,
            }))
            showActionAlert('failed')
          },
        }
      )
    }
  }
  return (
    <CreatePasswordContainer>
      <LogoImage src={LOGO_SRC} alt={LOGO_ALT} />
      <FormTitle>{FORM_TITLE}</FormTitle>
      <FormContainer>
        <FormWrapper>
          <InputField
            label={NEW_PASSWORD_LABEL}
            placeholder={NEW_PASSWORD_PLACEHOLDER}
            value={formData[NEW_PASSWORD_KEY]}
            onChange={(value: string) =>
              handleInputChange({ field: NEW_PASSWORD_KEY, value })
            }
            error={errors[NEW_PASSWORD_KEY]}
            type={
              passwordVisibility[NEW_PASSWORD_KEY] ? TEXT_TYPE : PASSWORD_TYPE
            }
            endAdornment={
              <PasswordVisibilityToggle
                showPassword={passwordVisibility[NEW_PASSWORD_KEY]}
                togglePasswordVisibility={() =>
                  togglePasswordVisibility(NEW_PASSWORD_KEY)
                }
              />
            }
            disabled={loading}
          />
          <InputField
            label={CONFIRM_PASSWORD_LABEL}
            placeholder={CONFIRM_PASSWORD_PLACEHOLDER}
            value={formData[CONFIRM_PASSWORD_KEY]}
            onChange={(value: string) =>
              handleInputChange({ field: CONFIRM_PASSWORD_KEY, value })
            }
            error={errors[CONFIRM_PASSWORD_KEY]}
            type={
              passwordVisibility[CONFIRM_PASSWORD_KEY]
                ? TEXT_TYPE
                : PASSWORD_TYPE
            }
            endAdornment={
              <PasswordVisibilityToggle
                showPassword={passwordVisibility[CONFIRM_PASSWORD_KEY]}
                togglePasswordVisibility={() =>
                  togglePasswordVisibility(CONFIRM_PASSWORD_KEY)
                }
              />
            }
            disabled={loading}
          />
          <InputField
            label={NEW_PIN_LABEL}
            placeholder={NEW_PIN_PLACEHOLDER}
            value={formData[NEW_PIN_KEY]}
            onChange={(value: string) =>
              handleInputChange({ field: NEW_PIN_KEY, value })
            }
            type={passwordVisibility[NEW_PIN_KEY] ? TEXT_TYPE : PASSWORD_TYPE}
            endAdornment={
              <PasswordVisibilityToggle
                showPassword={passwordVisibility[NEW_PIN_KEY]}
                togglePasswordVisibility={() =>
                  togglePasswordVisibility(NEW_PIN_KEY)
                }
              />
            }
            error={errors[NEW_PIN_KEY]}
            disabled={loading}
          />
          <InputField
            label={CONFIRM_PIN_LABEL}
            placeholder={CONFIRM_PIN_PLACEHOLDER}
            value={formData[CONFIRM_PIN_KEY]}
            onChange={(value: string) =>
              handleInputChange({ field: CONFIRM_PIN_KEY, value })
            }
            type={
              passwordVisibility[CONFIRM_PIN_KEY] ? TEXT_TYPE : PASSWORD_TYPE
            }
            endAdornment={
              <PasswordVisibilityToggle
                showPassword={passwordVisibility[CONFIRM_PIN_KEY]}
                togglePasswordVisibility={() =>
                  togglePasswordVisibility(CONFIRM_PIN_KEY)
                }
              />
            }
            error={errors[CONFIRM_PIN_KEY]}
            disabled={loading}
          />
          {errors[API_ERROR_KEY] && (
            <ErrorMessage>{errors[API_ERROR_KEY]}</ErrorMessage>
          )}
          <ButtonGroup
            buttons={[
              {
                label: loading ? SAVING_BUTTON_LABEL : SAVE_BUTTON_LABEL,
                onClick: handleSubmit,
                disabled: loading,
              },
            ]}
          />
        </FormWrapper>
        <PasswordPoliciesContainer>
          <PasswordPoliciesTitle>
            {PASSWORD_POLICIES_TITLE}
          </PasswordPoliciesTitle>
          {passwordPolicies.map((policy) => (
            <PolicyItem key={policy.id}>
              {
                policy.isValid ? (
                  <CheckCircleIcon color='success' />
                ) : (
                  <CancelIcon color='error' />
                )
              }
              <PolicyText>{policy.text}</PolicyText>
            </PolicyItem>
          ))}
        </PasswordPoliciesContainer>
      </FormContainer>
    </CreatePasswordContainer>
  )
}

export default SettingPasswordForm
