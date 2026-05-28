'use client'
import React, { useState, useEffect } from 'react'
import { Grid2 } from '@mui/material'
import {
  PROJECT_BUTTONS,
  STAGE_FORM,
  DESIGN_REVIEW_ERROR_MESSAGES,
  DESIGN_REVIEW_MODAL_TITLES,
  DESIGN_REVIEW_FIELDS,
  DESIGN_REVIEW_MODES,
} from '@/constants/modules/dnd/projectPlan'
import {
  GridStyle,
  FullWidthGridStyle,
} from '@/styles/components/modalStyles'
import {
  InputField,
  ButtonGroup,
  Description,
} from '@/components/ui'
import { useRoles, useUsers } from '@/hooks/modules/dnd/useFormTeam'
import CommonModal from '@/components/ui/common-modal/CommonModal'
import { NUMBERMAP } from '@/constants/common'
import { DesignReviewFormModalProps, DesignReviewData } from '@/types/modules/dnd/projectPlan'
/**
 * Classification : Confidential
 **/

const INITIAL_FORM_DATA: DesignReviewData = {
  user: '',
  role: '',
  responsibility: '',
}
const INITIAL_ERRORS = {
  user: '',
  role: '',
  responsibility: '',
}

const DesignReviewFormModal: React.FC<DesignReviewFormModalProps> = ({
  open,
  onClose,
  onSave,
  editingData,
  mode,
  hasEditPermission = true,
}) => {
  const { data: roles } = useRoles()
  const { data: users } = useUsers()
  
  const [formData, setFormData] = useState<DesignReviewData>(INITIAL_FORM_DATA)
  
  const [errors, setErrors] = useState(INITIAL_ERRORS)

  useEffect(() => {
    if (open) {
      if (mode === DESIGN_REVIEW_MODES.EDIT && editingData) {
        setFormData({
          ...editingData,
        })
      } else {
        setFormData(INITIAL_FORM_DATA)
      }
      setErrors(INITIAL_ERRORS)
    }
  }, [open, mode, editingData])

  const validateForm = (): boolean => {
    const newErrors = { ...INITIAL_ERRORS }
    let isValid = true

    if (!formData.user) {
      newErrors.user = DESIGN_REVIEW_ERROR_MESSAGES.USER
      isValid = false
    }

    if (!formData.role) {
      newErrors.role = DESIGN_REVIEW_ERROR_MESSAGES.ROLE
      isValid = false
    }

    if (!formData.responsibility.trim()) {
      newErrors.responsibility = DESIGN_REVIEW_ERROR_MESSAGES.RESPONSIBILITY
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSave = () => {
    if (!validateForm()) return
    
    onSave(formData)
    onClose()
  }

  const handleClose = () => {
    setFormData(INITIAL_FORM_DATA)
    setErrors(INITIAL_ERRORS)
    onClose()
  }

  const handleFieldChange = (field: keyof DesignReviewData, value: string) => {
    if(!hasEditPermission) return
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
    
    // Clear error when user starts typing
    if (field in errors) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }))
    }
  }

  return (
    <CommonModal
      title={mode === DESIGN_REVIEW_MODES.ADD ? DESIGN_REVIEW_MODAL_TITLES.ADD : DESIGN_REVIEW_MODAL_TITLES.EDIT}
      open={open}
      onClose={handleClose}
    >
            <Grid2 container sx={{ ...GridStyle, ...FullWidthGridStyle }}>
            <Grid2 size={NUMBERMAP.TWELVE}>
              <InputField
                label={STAGE_FORM.RESOURCE}
                placeholder={STAGE_FORM.RESOURCE_PLACEHOLDER}
                isDropdown={true}
                value={formData.user}
                onChange={(value: string) => handleFieldChange(DESIGN_REVIEW_FIELDS.USER as keyof DesignReviewData, value)}
                options={users?.data ?? []}
                keyField={STAGE_FORM.USER_KEY}
                valueField={STAGE_FORM.USER_VALUE}
                error={errors.user}
              />
            </Grid2>
            <Grid2 size={NUMBERMAP.TWELVE}>
              <InputField
                label={STAGE_FORM.ROLE_LABEL}
                placeholder={STAGE_FORM.ROLE_PLACEHOLDER}
                isDropdown={true}
                value={formData.role}
                onChange={(value: string) => handleFieldChange(DESIGN_REVIEW_FIELDS.ROLE as keyof DesignReviewData, value)}
                options={roles?.data ?? []}
                keyField={STAGE_FORM.ROLE_KEY}
                valueField={STAGE_FORM.ROLE_VALUE}
                error={errors.role}
              />
            </Grid2>
            <Grid2 size={NUMBERMAP.TWELVE}>
              <Description
                label={STAGE_FORM.RESPONSIBILITY_LABEL}
                placeholder={STAGE_FORM.RESPONSIBILITY_PLACEHOLDER}
                value={formData.responsibility}
                onChange={(value: string) => handleFieldChange(DESIGN_REVIEW_FIELDS.RESPONSIBILITY as keyof DesignReviewData, value)}
                error={errors.responsibility}
              />
            </Grid2>
          </Grid2>
      <Grid2 container spacing={NUMBERMAP.ONE}>
        <Grid2 size={NUMBERMAP.TWELVE}>
          <ButtonGroup
            buttons={[
              { label: PROJECT_BUTTONS.CANCEL, onClick: handleClose },
              { label: PROJECT_BUTTONS.SAVE, onClick: handleSave, disabled: !hasEditPermission },
            ]}
          />
        </Grid2>
      </Grid2>
    </CommonModal>
  )
}

export default DesignReviewFormModal
