'use client'
import React, { useState } from 'react'
import { Grid2 } from '@mui/material'
import { ButtonGroup, InputField, Description } from '@/components/ui'
import FileUploadManager from '@/components/ui/file-upload-v3/FileUploadManager'
import { ContentWrapper } from '@/styles/modules/hr/addEmployee'
import DatePicker from '@/components/ui/data-picker/DataPicker'
import dayjs from 'dayjs'
import { FileData } from '@/types/components/ui/fileUploadV3'
import {
  GENERIC_MODAL_CONSTANTS,
  FIELD_TYPES,
} from '@/constants/modules/hr/employeeList'
import { GENERIC_MODAL_STYLES } from '@/styles/modules/hr/employeeList'

interface Option {
  id: string
  name: string
  source?: string
}

interface FieldConfig {
  label: string
  placeholder: string
  type?: 'text' | 'date' | 'dropdown' | 'description'
  options?: Option[]
  keyField?: string
  valueField?: string
  fieldKey: string
  required?: boolean
  dataSourceName?: string
  dataFieldName?: string
}

interface GenericModalProps {
  hasEditPermission?:boolean,
  onClose: () => void
  onSave?: (data: Record<string, string | string[]>) => void
  fields: FieldConfig[]
  initialFormData: Record<string, string | string[]>
  extraContent?: React.ReactNode
  title?: string
  documents?: any[]
  handleFileUpload?: (file: FileData) => void
  handleFileEdit?: (file: FileData) => void
  handleFileSubmit?: (data: any) => void
  showFileUploader?: boolean
  ref?: any
  id?: string
}

const handleSkillFieldChange = (
  field: string,
  value: string | string[],
  fields: FieldConfig[],
  setFormData: React.Dispatch<
    React.SetStateAction<Record<string, string | string[]>>
  >
) => {
  const skillField = fields.find((item) => item.fieldKey === field)
  const skill = skillField?.options?.find((skills) => skills.skill_id == value)
  setFormData((prev) => ({
    ...prev,
    [field]: value,
    skill_id: skill?.skill_id?.toString() ?? '',
    skill_name: skill?.name ?? '',
  }))
}

const GenericModal: React.FC<GenericModalProps> = ({
  hasEditPermission=true,
  onClose,
  onSave,
  fields,
  initialFormData,
  documents,
  handleFileUpload,
  handleFileEdit,
  handleFileSubmit,
  extraContent,
  title,
  showFileUploader = true,
  ref,
  id,
}) => {
  const [formData, setFormData] = useState(initialFormData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const handleChange = (field: string) => (value: string | string[]) => {
    if(!hasEditPermission) return;
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
    if (field === 'skill') {
      handleSkillFieldChange(field, value, fields, setFormData)
      return
    }

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

   
  }

  const handleSubmit = () => {
    if(!hasEditPermission) return;
    const newErrors: Record<string, string> = {}
    fields.forEach((field) => {
      if (field.required && !formData[field.fieldKey]) {
        newErrors[field.fieldKey] =
          GENERIC_MODAL_CONSTANTS.FIELD_REQUIRED_ERROR(field.label)
      }
    })

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    if (onSave) {
      onSave(formData)
    }
    onClose()
  }

  const parseDate = (date?: string | null) =>
    date && dayjs(date).isValid() ? dayjs(date) : null
  return (
    <ContentWrapper ref={ref} id={id}>
      {title && <h2>{title}</h2>}
       <Grid2 sx={GENERIC_MODAL_STYLES.GRID_CONTAINER}>
      <Grid2 container spacing={1}>
        {fields?.map((field) => {
          let fieldComponent

          if (field.type === FIELD_TYPES.DESCRIPTION) {
            fieldComponent = (
              <Description
                label={field.label}
                placeholder={field.placeholder}
                value={formData[field.fieldKey] as string}
                onChange={handleChange(field.fieldKey)}
                error={errors[field.fieldKey]}
                dataSourceName={field.dataSourceName}
                dataFieldName={field.dataFieldName}
              />
            )
          } else if (field.type === FIELD_TYPES.DATE) {
            const datePickerValue = parseDate(
              formData[field.fieldKey] as string
            )
            fieldComponent = (
              <DatePicker
                label={field.label}
                value={datePickerValue}
                onChange={(date) =>
                  handleChange(field.fieldKey)(date ? date.toISOString() : '')
                }
                error={errors[field.fieldKey] ?? ''}
                dataIsAutocomplete={formData[field.fieldKey] ? new Date(formData[field.fieldKey]).toISOString() : ''}
                dataSourceName={field.dataSourceName}
                dataFieldName={field.dataFieldName}
              />
            )
          } else {
            fieldComponent = (
              <InputField
                label={field.label}
                hasEditable={!hasEditPermission}
                placeholder={field.placeholder}
                isDropdown={field.type === FIELD_TYPES.DROPDOWN}
                value={formData[field.fieldKey]}
                onChange={handleChange(field.fieldKey)}
                options={field?.options??[]}
                keyField={field.keyField}
                valueField={field.valueField}
                error={errors[field.fieldKey]}
                dataSourceName={field.dataSourceName}
                dataFieldName={field.dataFieldName}
                dataIsAutocomplete={formData[field.fieldKey]}
              />
            )
          }

          return (
            <Grid2 size={{ md: 12 }} key={field.fieldKey}>
              {fieldComponent}
            </Grid2>
          )
        })}
        {showFileUploader && (
          <Grid2 size={12}>
            <FileUploadManager
              hasEditable={!hasEditPermission}
              initialFiles={documents}
              onFileUpload={handleFileUpload}
              onFileEdit={handleFileEdit}
              onSubmit={handleFileSubmit}
            />
          </Grid2>
        )}
      </Grid2>
      </Grid2>
      <ButtonGroup
        buttons={[
          { label: GENERIC_MODAL_CONSTANTS.BUTTONS.CANCEL, onClick: onClose },
          {
            label: GENERIC_MODAL_CONSTANTS.BUTTONS.SAVE,
            onClick: handleSubmit,
          },
        ]}
      />
    </ContentWrapper>
  )
}

export default GenericModal
