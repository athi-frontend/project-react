'use client'
import React, { useState } from 'react'
import { Box, Dialog, IconButton, Grid2 } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { ButtonGroup, RadioButtonGroup } from '@/components/ui'
import {
  PopupFormProps,
  DesignInputFormData,
} from '@/types/modules/dnd/designInput'
import {
  FormContainer,
  FormSection,
  TitleContainer,
  DialogContainer,
  ContentWrapper,
  TitleSection,
} from '@/styles/components/modules/designInput'
import { DESIGN_INPUT } from '@/constants/modules/dnd/designInput'
import { NUMBERMAP } from '@/constants/common'

const PopupForm: React.FC<PopupFormProps> = ({
  onSave,
  onClose,
  open,
  initialData,
}) => {
  const [formData, setFormData] = useState<DesignInputFormData>(
    initialData ?? {
      isSoftwareApplicable: '',
      isUsabilityRequirementsApplicable: '',
      isPOVApplicable: '',
      isFRSApplicable: '',
    }
  )

  const [errors, setErrors] = useState<Partial<DesignInputFormData>>({})

  const handleInputChange = (
    field: keyof DesignInputFormData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const validateForm = () => {
    const newErrors: Partial<DesignInputFormData> = {}
    const { VALIDATION } = DESIGN_INPUT

    if (!formData.isSoftwareApplicable)
      newErrors.isSoftwareApplicable = VALIDATION.SOFTWARE_APPLICABLE_REQUIRED

    if (!formData.isUsabilityRequirementsApplicable)
      newErrors.isUsabilityRequirementsApplicable =
        VALIDATION.USABILITY_REQUIREMENTS_APPLICABLE_REQUIRED

    if (!formData.isPOVApplicable)
      newErrors.isPOVApplicable = VALIDATION.POV_APPLICABLE_REQUIRED

    if (!formData.isFRSApplicable)
      newErrors.isFRSApplicable = VALIDATION.FRS_APPLICABLE_REQUIRED

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validateForm()) return
    onSave(formData)
  }

  const radioOptions = [
    { value: 1, label: 0 },
    { value: 'no', label: 'No' },
  ]

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogContainer>
        <TitleContainer>
          <TitleSection>{DESIGN_INPUT.TITLE}</TitleSection>
          <IconButton onClick={onClose} className="modal-close">
            <CloseIcon />
          </IconButton>
        </TitleContainer>
        <ContentWrapper>
          <FormContainer>
            <FormSection>
              <Grid2 container spacing={NUMBERMAP.TWO}>
                <Grid2 size={NUMBERMAP.TWELVE}>
                  <RadioButtonGroup
                    label={DESIGN_INPUT.SOFTWARE_APPLICABLE.LABEL}
                    options={radioOptions}
                    value={formData.isSoftwareApplicable}
                    onChange={(value) =>
                      handleInputChange('isSoftwareApplicable', value)
                    }
                    error={errors.isSoftwareApplicable}
                  />
                </Grid2>
                <Grid2 size={NUMBERMAP.TWELVE}>
                  <RadioButtonGroup
                    label={DESIGN_INPUT.USABILITY_REQUIREMENTS_APPLICABLE.LABEL}
                    options={radioOptions}
                    value={formData.isUsabilityRequirementsApplicable}
                    onChange={(value) =>
                      handleInputChange(
                        'isUsabilityRequirementsApplicable',
                        value
                      )
                    }
                    error={errors.isUsabilityRequirementsApplicable}
                  />
                </Grid2>
                <Grid2 size={NUMBERMAP.TWELVE}>
                  <RadioButtonGroup
                    label={DESIGN_INPUT.POV_APPLICABLE.LABEL}
                    options={radioOptions}
                    value={formData.isPOVApplicable}
                    onChange={(value) =>
                      handleInputChange('isPOVApplicable', value)
                    }
                    error={errors.isPOVApplicable}
                  />
                </Grid2>
                <Grid2 size={NUMBERMAP.TWELVE}>
                  <RadioButtonGroup
                    label={DESIGN_INPUT.FRS_APPLICABLE.LABEL}
                    options={radioOptions}
                    value={formData.isFRSApplicable}
                    onChange={(value) =>
                      handleInputChange('isFRSApplicable', value)
                    }
                    error={errors.isFRSApplicable}
                  />
                </Grid2>
              </Grid2>

              <Box sx={{ marginTop: '40px' }}>
                <ButtonGroup
                  buttons={[
                    {
                      label: DESIGN_INPUT.BUTTONS.CANCEL,
                      onClick: onClose,
                    },
                    {
                      label: DESIGN_INPUT.BUTTONS.SAVE,
                      onClick: handleSubmit,
                    },
                  ]}
                />
              </Box>
            </FormSection>
          </FormContainer>
        </ContentWrapper>
      </DialogContainer>
    </Dialog>
  )
}

export default PopupForm
