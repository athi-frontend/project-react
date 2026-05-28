'use client'
import React, { useState, useEffect } from 'react'
import { Modal, IconButton, Grid2 } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import {
  ModalContainer,
  ModalContent,
  TitleSection,
  FormContent,
  FormFields,
  TypeOfStageContainer,
  StageTypeLabel,
  StageTypePlaceholder,
  ModalHeader,
  ProjectIcon,
} from '@/styles/components/modalStyles'
import { InputField, ButtonGroup } from '@/components/ui'
import {
  PROJECT_BUTTONS,
  STAGE_FORM,
  StageOptions,
} from '@/constants/modules/dnd/projectPlan'
import { NUMBERMAP } from '@/constants/common'

interface ProjectStagesModalProps {
  open: boolean
  onClose: () => void
  initialStage: string
  initialStagesRequired: string
  onSave: (data: { stage: string; stagesRequired: string }) => void
  stageOptions?: Array<{ key: string; value: string }>
}

const ProjectStagesModal: React.FC<ProjectStagesModalProps> = ({
  open,
  onClose,
  initialStage,
  initialStagesRequired,
  onSave,
  stageOptions = StageOptions,
}) => {
  const [stage, setStage] = useState<string>(initialStage)
  const [stagesRequired, setStagesRequired] = useState<string>(
    initialStagesRequired
  )

  useEffect(() => {
    if (open) {
      setStage(initialStage)
      setStagesRequired(initialStagesRequired)
    }
  }, [open, initialStage, initialStagesRequired])

  const handleSave = () => {
    onSave({ stage, stagesRequired })
    onClose()
  }

  const buttons = [
    { label: PROJECT_BUTTONS.CANCEL, onClick: onClose },
    { label: PROJECT_BUTTONS.SAVE, onClick: handleSave },
  ]

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby={STAGE_FORM.PROJECT_ARIA_LABEL}
      aria-describedby={STAGE_FORM.PROJECT_ARIA_DESCRIBE}
    >
      <ModalContainer>
        <ModalHeader>
          <TitleSection
            component={STAGE_FORM.COMPONENT}
            id={STAGE_FORM.PROJECT_ID}
          >
            Project Stages
          </TitleSection>
          <IconButton
            onClick={onClose}
            aria-label={PROJECT_BUTTONS.CLOSE}
            sx={ProjectIcon}
          >
            <CloseIcon />
          </IconButton>
        </ModalHeader>

        <ModalContent>
          <FormContent>
            <FormFields>
              <Grid2 container spacing={NUMBERMAP.TWO} width="100%">
                <Grid2 size={NUMBERMAP.TWELVE}>
                  <InputField
                    label={STAGE_FORM.STAGE}
                    placeholder={STAGE_FORM.STAGE_PLACEHOLDER}
                    isDropdown={true}
                    value={stage}
                    onChange={(value) => setStage(value as string)}
                    options={stageOptions}
                  />
                </Grid2>
              </Grid2>

              <TypeOfStageContainer>
                <StageTypeLabel component={STAGE_FORM.COMPONENT_LABEL}>
                  {STAGE_FORM.STAGE_LABEL}
                </StageTypeLabel>
                <StageTypePlaceholder>Type of Stage</StageTypePlaceholder>
              </TypeOfStageContainer>

              <Grid2 container spacing={NUMBERMAP.TWO} width="100%" marginTop="20px">
                <Grid2 size={NUMBERMAP.TWELVE}>
                  <InputField
                    label={STAGE_FORM.STAGE_INPUT}
                    placeholder={STAGE_FORM.STAGE_INPUT_PLACEHOLDER}
                    value={stagesRequired}
                    onChange={(value) => setStagesRequired(value as string)}
                  />
                </Grid2>
              </Grid2>
            </FormFields>

            <ButtonGroup buttons={buttons} />
          </FormContent>
        </ModalContent>
      </ModalContainer>
    </Modal>
  )
}

export default ProjectStagesModal
