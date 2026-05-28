'use client'
import React, { useEffect, useState } from 'react'
import { Box, Grid2 } from '@mui/material'

import { InputField, ButtonGroup, Description } from '@/components/ui'

import {
  EditContainer,
  EditContent,
  EditHeader,
  EditTitle,
  FormContainer,
  LabelContainer,
  LabelText,
  LabelValue,
} from '../../../styles/components/ui/fileUploadStyles'
import { useGetTagsList } from '@/hooks/modules/dnd/useProject'
import { NUMBERMAP } from '@/constants/common'

interface FileData {
  id: string
  name: string
  source: string
  uploadDate: string
  category: string
  status: string
  purpose?: string
  description?: string
  tags?: string[]
}

interface FileEditFormProps {
  file: FileData
  onSave: (updatedFile: FileData) => void
  onCancel: () => void
}

const FileEditForm: React.FC<FileEditFormProps> = ({
  file,
  onSave,
  onCancel,
}) => {
  const { data: tagsList } = useGetTagsList()
  const [listedTags, setListedTags] = useState<string[]>([])
  const [formData, setFormData] = useState<FileData>({
    ...file,
    source: file.source ?? '',
    category: file.category ?? '',
    purpose: file.purpose ?? '',
    description: file.description ?? '',
    tags: file.tags ?? [],
    uploadDate: file.uploadDate ?? '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (field: keyof FileData, value: any) => {
    setFormData({
      ...formData,
      [field]: value,
    })

    if (field === 'tags') {
      const unmatchedTags = value.filter(
        (tag: any) => !listedTags.some((listed: any) => listed.value === tag)
      )
      if (unmatchedTags.length > 0) {
        setListedTags([
          ...listedTags,
          { key: unmatchedTags[0], value: unmatchedTags[0] },
        ])
      }
    }

    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: '',
      })
    }
  }

  useEffect(() => {
    setListedTags(tagsList?.data ?? [])
  }, [tagsList])
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.purpose) {
      newErrors.purpose = 'Purpose is required'
    }

    if (!formData.source) {
      newErrors.source = 'Source is required'
    }

    if (!formData.tags || formData.tags.length === 0) {
      newErrors.tags = 'At least one tag is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData)
    }
  }

  return (
    <EditContainer>
      <EditContent>
        <EditHeader>
          <EditTitle>Edit Files</EditTitle>
        </EditHeader>

        <FormContainer sx={{ padding: '30px 80px' }}>
          <Grid2 container spacing={1}>
            <Grid2 size={NUMBERMAP.SIX}>
              <LabelContainer>
                <LabelText>File Name</LabelText>
                <LabelValue>{formData.name}</LabelValue>
              </LabelContainer>
            </Grid2>
            <Grid2 size={NUMBERMAP.SIX}>
              <LabelContainer sx={{ marginTop: '20px' }}>
                <LabelText>File Status</LabelText>
                <LabelValue>{formData.status}</LabelValue>
              </LabelContainer>
            </Grid2>

            <Grid2 size={NUMBERMAP.SIX}>
              <InputField
                label="Purpose*"
                placeholder="Enter purpose"
                value={formData.purpose ?? ''}
                onChange={(value) => handleInputChange('purpose', value)}
                error={errors.purpose}
                isDropdown={false}
                options={[
                  { key: 'documentation', value: 'Documentation' },
                  { key: 'reference', value: 'Reference' },
                  { key: 'evidence', value: 'Evidence' },
                  { key: 'report', value: 'Report' },
                ]}
              />
            </Grid2>

            <Grid2 size={NUMBERMAP.SIX}>
              <LabelContainer sx={{ marginTop: '20px' }}>
                <LabelText>File Category</LabelText>
                <LabelValue>{formData.category}</LabelValue>
              </LabelContainer>
            </Grid2>

            <Grid2 size={NUMBERMAP.SIX}>
              <InputField
                label="Source*"
                placeholder="Enter source"
                value={formData.source}
                onChange={(value) => handleInputChange('source', value)}
                error={errors.source}
                isDropdown={false}
              />
            </Grid2>

            <Grid2 size={NUMBERMAP.SIX}>
              <Description
                label="Description"
                placeholder="Enter description"
                value={formData.description ?? ''}
                onChange={(value) => handleInputChange('description', value)}
                error={errors.description}
              />
            </Grid2>
            <Grid2 size={NUMBERMAP.SIX}>{}</Grid2>
            <Grid2 size={NUMBERMAP.TWELVE}>
              <ButtonGroup
                buttons={[
                  {
                    label: 'Cancel',
                    onClick: onCancel,
                  },
                  {
                    label: 'Save',
                    onClick: handleSave,
                  },
                ]}
              />
            </Grid2>
          </Grid2>

          <Grid2 container spacing={NUMBERMAP.TWO}>
            <Grid2 size={{ md: NUMBERMAP.SIX }}>
              <Box
                sx={{
                  display: 'flex',
                  minWidth: '240px',
                  flexDirection: 'column',
                  alignItems: 'stretch',
                  justifyContent: 'center',
                  width: '719px',
                  '@media (max-width: 991px)': {
                    maxWidth: '100%',
                  },
                }}
              >
                <Box
                  sx={{
                    width: '100%',
                    '@media (max-width: 991px)': {
                      maxWidth: '100%',
                    },
                  }}
                ></Box>
              </Box>
            </Grid2>
          </Grid2>
        </FormContainer>
      </EditContent>
    </EditContainer>
  )
}

export default FileEditForm
