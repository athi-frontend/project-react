'use client'
import React, { useState, useEffect } from 'react'
import { Grid2 } from '@mui/material'
import { ButtonGroup, InputField } from '@/components/ui'
import {
  Container,
  ContentWrapper,
} from '@/styles/modules/dnd/feasibilityStudy'
import {
  CLASS_NAMES,
  VALIDATION_MESSAGES,
} from '@/constants/modules/dnd/feasibilityStudy'
import { DesignTeamRoleData } from '@/types/modules/dnd/feasibilityStudy'
import { NUMBERMAP } from '@/constants/common'

const DesignTeamRole: React.FC<{
  designTeamRole: DesignTeamRoleData
  designTeamRows: DesignTeamRoleData[]
  handleSave: (data: DesignTeamRoleData) => void
  handleCancel: () => void
  hasEditable:boolean
}> = ({ designTeamRole, designTeamRows, handleSave, handleCancel ,hasEditable}) => {
  const [formData, setFormData] = useState<DesignTeamRoleData>(designTeamRole)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    setFormData(designTeamRole)
  }, [designTeamRole])

  const validateField = (): boolean => {
    const trimmedRole = formData.role.trim()

    if (!trimmedRole) {
      setError(VALIDATION_MESSAGES.FIELD_REQUIRED('Design Team Role*'))
      return false
    }

    const isDuplicate = designTeamRows.some(
      (row) =>
        row.role.toLowerCase() === trimmedRole.toLowerCase() &&
        (!designTeamRole.id || row.id !== designTeamRole.id)
    )

    if (isDuplicate) {
      setError('This role already exists')
      return false
    }

    setError('')
    return true
  }

  const handleSubmit = () => {
    if (hasEditable) return

    if (validateField()) {
      handleSave({ ...formData, role: formData.role.trim() })
    }
  }

  return (
    <Container className={CLASS_NAMES.CONTAINER}>
      <ContentWrapper className={CLASS_NAMES.CONTENT_WRAPPER}>
        <Grid2 container spacing={NUMBERMAP.ONE}>
          <Grid2 size={{ md: NUMBERMAP.TWELVE }}>
            <InputField
              label="Design Team Role*"
              placeholder="Enter Design Team Role"
              value={formData.role}
              onChange={(value: string | number) => {
                if(hasEditable) return
                const selectedValue = value as string
                setFormData((prev) => ({ ...prev, role: selectedValue }))
                if (error) {
                  setError('')
                }
              }}
              error={error}
            />
          </Grid2>
        </Grid2>
        <ButtonGroup
          buttons={[
            { label: 'Cancel', onClick: handleCancel },
            { label: 'Save', onClick: handleSubmit },
          ]}
        />
      </ContentWrapper>
    </Container>
  )
}

export default DesignTeamRole
