import React, { useState, useEffect } from 'react'
import { AddModelModalProps } from '@/types/modules/dnd/pnd'
import { PND_MODEL_MODAL_TEXTS } from '@/constants/modules/dnd/pnd'
import { pndModelModalFieldKeys } from '@/lib/modules/dnd/pnd'
import { ButtonGroup, Description, InputField } from '@/components/ui'
import RadioButtonGroup from '@/components/ui/radiobutton-group/RadioButtonGroup'
import { ContentWrapper } from '@/styles/modules/dnd/feasibilityStudy'
import { Grid2 } from '@mui/material'
import { NUMBERMAP, radioOptions } from '@/constants/common'
import { CommonModalScroll } from '@/styles/common'

type ModelFormState = {
  modelName: string
  modelNumber: string
  description: string
  baseModel: '' | 'Yes' | 'No'
  status: string
}

const PNDModelPopupForm: React.FC<AddModelModalProps> = ({
  onClose,
  onSave,
  model,
  hasEditable,
  statusOptions = []
}) => {
  const [formData, setFormData] = useState<ModelFormState>({
    modelName: '',
    modelNumber: '',
    description: '',
    baseModel: '',
    status: '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof ModelFormState, string>>>({})

  useEffect(() => {
    setErrors({})
    if (model) {
      setFormData({
        modelName: model.modelName,
        modelNumber: model.modelNumber,
        description: model.description,
        baseModel: model.baseModel.toLowerCase() ?? '',
        status: model.status ? model.status.toString() : '',
      })
    } else {
      setFormData({
        modelName: '',
        modelNumber: '',
        description: '',
        baseModel: '',
        status: '',
      })
    }
  }, [model])

  const handleChange = (value: string, name: keyof ModelFormState) => {
    if (hasEditable) return
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleStatusChange = (value: string) => {
    if (hasEditable) return
    setFormData((prev) => ({
      ...prev,
      status: value,
    }))
    setErrors((prev) => ({ ...prev, status: '' }))
  }

  const handleSubmit = () => {
    if(hasEditable) return
    const trimmedData = {
      modelName: formData.modelName.trim(),
      modelNumber: formData.modelNumber.trim(),
      description: formData.description.trim(),
      baseModel: formData.baseModel,
      status: formData.status,
    }

    const newErrors: Partial<Record<keyof ModelFormState, string>> = {}

    if (!trimmedData.modelName) {
      newErrors.modelName = PND_MODEL_MODAL_TEXTS.MODEL_NAME_REQUIRED
    }
    if (!trimmedData.modelNumber) {
      newErrors.modelNumber = PND_MODEL_MODAL_TEXTS.MODEL_NUMBER_REQUIRED
    }
    if (!trimmedData.baseModel) {
      newErrors.baseModel = PND_MODEL_MODAL_TEXTS.BASE_MODEL_REQUIRED
    }
    if (!trimmedData.status) {
      newErrors.status = PND_MODEL_MODAL_TEXTS.STATUS_REQUIRED
    }
    if (Object.keys(newErrors).length > NUMBERMAP.ZERO) {
      setErrors(newErrors)
      return
    }

    const dataToSave = model?.id
      ? { id: model.id, ...trimmedData }
      : { ...trimmedData }

    onSave(dataToSave)
  }

  return (
    <CommonModalScroll>
      <ContentWrapper>
      <Grid2 container spacing={NUMBERMAP.ONE}>
        <Grid2 size={{ md: NUMBERMAP.TWELVE }}>
          <InputField
            label={PND_MODEL_MODAL_TEXTS.MODEL_NAME_LABEL}
            placeholder={PND_MODEL_MODAL_TEXTS.MODEL_NAME_PLACEHOLDER}
            value={formData.modelName}
            onChange={(e: string) => {
              handleChange(e, 'modelName')
            }}
            error={errors.modelName}
          />
          </Grid2>
          <Grid2 size={{ md: NUMBERMAP.TWELVE }}>
          <InputField
            label={PND_MODEL_MODAL_TEXTS.MODEL_NUMBER_LABEL}
            placeholder={PND_MODEL_MODAL_TEXTS.MODEL_NUMBER_PLACEHOLDER}
            value={formData.modelNumber}
            onChange={(e: string) => {
              handleChange(e, 'modelNumber')
            }}
            error={errors.modelNumber}
          />
          </Grid2>
          <Grid2 size={{ md: NUMBERMAP.TWELVE }}>
          <Description
            label={PND_MODEL_MODAL_TEXTS.DESCRIPTION_LABEL}
            placeholder={PND_MODEL_MODAL_TEXTS.DESCRIPTION_PLACEHOLDER}
            value={formData.description}
            onChange={(e: string) => {
              handleChange(e, 'description')
            }}
            error={errors.description}
          />   
          </Grid2>       
        <Grid2 size={{ md: NUMBERMAP.TWELVE }}>
          <RadioButtonGroup
            label={PND_MODEL_MODAL_TEXTS.BASE_MODEL_LABEL}
            name={pndModelModalFieldKeys.baseModel}
            options={radioOptions}
            value={formData.baseModel}
            onChange={(value) => handleChange(value.toString(), 'baseModel')}
            error={errors.baseModel}
            disabled={hasEditable}
          />
        </Grid2>
        <Grid2 size={{ md: NUMBERMAP.TWELVE }}>
          <InputField
            label={PND_MODEL_MODAL_TEXTS.STATUS_LABEL}
            placeholder={PND_MODEL_MODAL_TEXTS.STATUS_PLACEHOLDER}
            isDropdown
            options={statusOptions}
            value={formData.status}
            onChange={(value: string) => {
              handleStatusChange(value)
            }}
            error={errors.status}
            keyField="status_id"
            valueField="status_name"
            disabled={hasEditable}
          />
        </Grid2>
      </Grid2>
      <ButtonGroup
        buttons={[
          { label: PND_MODEL_MODAL_TEXTS.CANCEL_BUTTON, onClick: onClose },
          {
            label: PND_MODEL_MODAL_TEXTS.SAVE_BUTTON,
            onClick: () => {
              handleSubmit()
            },
          },
        ]}
      />
      </ContentWrapper>
    </CommonModalScroll>
  )
}

export default PNDModelPopupForm
