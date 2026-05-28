'use client'

import React, { useEffect, useState } from 'react'
import CommonModal from '@/components/ui/common-modal/CommonModal'
import { ButtonGroup, InputField } from '@/components/ui'
import { Form } from '@/styles/modules/dnd/pnd'
import { PND_REVIEW_STATUS_MODAL_TEXTS } from '@/constants/modules/dnd/pnd-review'
import { NUMBERMAP } from '@/constants/common'
import { useHeadRoles, useOrganizationStatus } from '@/hooks/useCommonDropdown'

type StatusModalForm = {
  role: string
  status: string
}

type Props = {
  open: boolean
  onClose: () => void
  onSave: (data: Record<string, any>) => void
  currentStatus?: Record<string, any> | null
  hasEditable?: boolean
}

const PndReviewStatusModal: React.FC<Props> = ({
  open,
  onClose,
  onSave,
  currentStatus,
  hasEditable = false,
}) => {
  const [formState, setFormState] = useState<StatusModalForm>({
    role: '',
    status: '',
  })
  const [errors, setErrors] = useState<Partial<StatusModalForm>>({})

  const { data: roleResponse } = useHeadRoles()

  const {
    data: statusResponse,
  } = useOrganizationStatus(NUMBERMAP.ONE)

  useEffect(() => {
    setErrors({})
    if (currentStatus) {
      setFormState({
        role: currentStatus.role_id?.toString() ?? '',
        status: currentStatus.status_id?.toString() ?? '',
      })
    } else {
      setFormState({
        role: '',
        status: '',
      })
    }
  }, [currentStatus, open])

  const handleChange = (field: keyof StatusModalForm, value: string) => {
    if (hasEditable) return
    setFormState((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const handleSubmit = () => {
    if (hasEditable) return
    const trimmedRole = formState.role?.toString().trim()
    const trimmedStatus = formState.status?.toString().trim()

    const newErrors: Partial<StatusModalForm> = {}
    if (!trimmedRole) newErrors.role = PND_REVIEW_STATUS_MODAL_TEXTS.ROLE_REQUIRED
    if (!trimmedStatus)
      newErrors.status = PND_REVIEW_STATUS_MODAL_TEXTS.STATUS_REQUIRED
    if (Object.keys(newErrors).length) {
      setErrors(newErrors)
      return
    }

    const selectedRole = roleResponse?.data?.find(
      (item: any) => String(item.role_id) === trimmedRole
    )

    const payload = {
      id: currentStatus?.id ?? currentStatus?.transition_id,
      role_id: formState.role,
      status_id: Number(formState.status),
      role_name: selectedRole?.role_name ?? currentStatus?.role_name,
    }

    onSave(payload)
    
    // Reset form to initial state after saving
    setFormState({
      role: '',
      status: '',
    })
    setErrors({})
  }

  return (
    <CommonModal
      open={open}
      onClose={onClose}
      title={
        currentStatus
          ? PND_REVIEW_STATUS_MODAL_TEXTS.EDIT_TITLE
          : PND_REVIEW_STATUS_MODAL_TEXTS.ADD_TITLE
      }
    >
      <Form>
        <InputField
          label={PND_REVIEW_STATUS_MODAL_TEXTS.ROLE_LABEL}
          placeholder={PND_REVIEW_STATUS_MODAL_TEXTS.ROLE_PLACEHOLDER}
          isDropdown
          options={roleResponse?.data ?? []}
          keyField="role_id"
          valueField="role_name"
          value={formState.role}
          onChange={(value: string) => handleChange('role', value)}
          error={errors.role}
          disabled={hasEditable}
        />
        <InputField
          label={PND_REVIEW_STATUS_MODAL_TEXTS.STATUS_LABEL}
          placeholder={PND_REVIEW_STATUS_MODAL_TEXTS.STATUS_PLACEHOLDER}
          isDropdown
          options={statusResponse?.data ?? []}
          keyField="status_id"
          valueField="status_name"
          value={formState.status}
          onChange={(value: string) => handleChange('status', value)}
          error={errors.status}
          disabled={hasEditable}
        />

        <ButtonGroup
          buttons={[
            {
              label: PND_REVIEW_STATUS_MODAL_TEXTS.CANCEL_BUTTON,
              onClick: onClose,
            },
            {
              label: PND_REVIEW_STATUS_MODAL_TEXTS.SAVE_BUTTON,
              onClick: handleSubmit,
            },
          ]}
        />
      </Form>
    </CommonModal>
  )
}

export default PndReviewStatusModal

