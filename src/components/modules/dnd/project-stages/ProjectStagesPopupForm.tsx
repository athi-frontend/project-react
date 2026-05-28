'use client'
import React, { useState, useEffect } from 'react'
import { Box, Dialog, IconButton, Grid2 } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { InputField, ButtonGroup } from '@/components/ui'
import {
  ProjectStagesFormProps,
  ProjectStagesFormData,
} from '@/types/modules/dnd/projectStages'
import {
  DialogContainer,
  TitleContainer,
  ContentWrapper,
  FormContainer,
  FormSection,
} from '@/styles/components/modules/projectStagesStyles'
import { projectStageInitialData } from '@/lib/modules/dnd/designQualityPlan'
import { COMMON_CONSTANTS } from '@/lib/modules/dnd/commonUtils'
import { useParams } from 'next/navigation'
import { PROJECT_STAGES } from '@/constants/modules/dnd/projectStages'
import { useStagesDropdown } from '@/hooks/modules/dnd/useProjectStages'
import { NUMBERMAP } from '@/constants/common'

/**
    Classification : Confidential
**/
const { STAGE_ID_FIELD, STAGE_COUNT_FIELD, DESIGN_STAGE_FIELD } =
  PROJECT_STAGES.FIELD_VALUES

const {
  STATUS_CODES: { SUCCESS_CODE },
  CONDITIONS: { EMPTY_ARRAY_LENGTH },
} = COMMON_CONSTANTS

const ProjectStagesPopupForm: React.FC<ProjectStagesFormProps> = ({
  onSave,
  onClose,
  open,
}) => {
  const [projectStageData, setProjectStageData] =
    useState<ProjectStagesFormData>(projectStageInitialData)

  const params = useParams()
  const projectId = params.id
  const { refetch: projectStages } = useStagesDropdown()
  const [errors, setErrors] = useState<Partial<ProjectStagesFormData>>({})
  const [projectDesignStageOptions, setProjectDesignStageOptions] = useState([])
  const [isDisabled, setIsDisabled] = useState(false)

  useEffect(() => {
    const fetchProjectStages = async () => {
      if (open) {
        try {
          const response = await projectStages()
          if (response.data && response.data.code === SUCCESS_CODE) {
            setProjectDesignStageOptions(response.data.data)
          }
        } catch (error) {
          console.error('Error fetching project stages:', error)
          setProjectDesignStageOptions([])
        }
      }
    }
    fetchProjectStages()
  }, [open])

  const handleInputChange = (
    field: keyof ProjectStagesFormData,
    value: string | string[]
  ) => {
    setProjectStageData((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const validateForm = async () => {
    const newErrors: Partial<ProjectStagesFormData> = {}
    const { VALIDATION } = PROJECT_STAGES

    if (!projectStageData.stage_id)
      newErrors.stage_id = VALIDATION.STAGE_REQUIRED
    if (!projectStageData.stage_count.trim())
      newErrors.stage_count = VALIDATION.NUMBER_OF_STAGES_REQUIRED

    setErrors(newErrors)
    return Object.keys(newErrors).length === EMPTY_ARRAY_LENGTH
  }

  const handleSubmit = async () => {
    const isValid = await validateForm()
    if (!isValid) {
      return
    }

    try {
      setIsDisabled(true)
      const projectStageBody: ProjectStagesFormData = {
        ...projectStageData,
        project_id: Number(projectId),
        stage_count: projectStageData.stage_count.trim(),
      }

      onSave(projectStageBody)
    } catch (error) {
      console.error('Error saving project stage:', error)
      handleClose()
    } finally {
      setIsDisabled(false)
      handleClose()
    }
  }

  const handleClose = () => {
    setErrors({})
    setProjectStageData(projectStageInitialData)
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogContainer>
        <TitleContainer>
          <Box className="title">{PROJECT_STAGES.TITLE}</Box>
          <IconButton onClick={handleClose} className="close-button">
            <CloseIcon />
          </IconButton>
        </TitleContainer>
        <ContentWrapper>
          <FormContainer>
            <FormSection>
              <Grid2 container spacing={2}>
                <Grid2 size={NUMBERMAP.TWELVE}>
                  <InputField
                    label={PROJECT_STAGES.STAGE.LABEL}
                    placeholder={PROJECT_STAGES.STAGE.PLACEHOLDER}
                    isDropdown
                    value={projectStageData.stage_id}
                    onChange={(value) =>
                      handleInputChange(STAGE_ID_FIELD, value as string)
                    }
                    error={errors.stage_id}
                    options={projectDesignStageOptions}
                    keyField={STAGE_ID_FIELD}
                    valueField={DESIGN_STAGE_FIELD}
                  />
                </Grid2>
                <Grid2 size={NUMBERMAP.TWELVE} sx={{ marginTop: '20px' }}>
                  <Box className="label-container">
                    <Box className="label">
                      {PROJECT_STAGES.TYPE_OF_STAGE.LABEL}
                    </Box>
                    <Box className="value">
                      {PROJECT_STAGES.TYPE_OF_STAGE.VALUE}
                    </Box>
                  </Box>
                </Grid2>
                <Grid2 size={NUMBERMAP.TWELVE} sx={{ marginTop: '20px' }}>
                  <InputField
                    label={PROJECT_STAGES.NUMBER_OF_STAGES.LABEL}
                    placeholder={PROJECT_STAGES.NUMBER_OF_STAGES.PLACEHOLDER}
                    value={projectStageData.stage_count}
                    onChange={(value) =>
                      handleInputChange(STAGE_COUNT_FIELD, value as string)
                    }
                    error={errors.stage_count}
                  />
                </Grid2>
              </Grid2>

              <Box sx={{ marginTop: '40px', paddingRight: '40px' }}>
                <ButtonGroup
                  buttons={[
                    {
                      label: PROJECT_STAGES.BUTTONS.CANCEL,
                      onClick: handleClose,
                    },
                    {
                      label: PROJECT_STAGES.BUTTONS.SAVE,
                      onClick: handleSubmit,
                      disabled: isDisabled,
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

export default ProjectStagesPopupForm
