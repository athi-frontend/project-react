'use client'
import React, { useEffect, useState } from 'react'
import { Box, Menu, MenuItem } from '@mui/material'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import PendingIcon from '@mui/icons-material/Pending'
import {
  DIRContainer,
  PaginationContainer,
  ArrowButton,
  StepContainer,
  TextStep,
} from '@/styles/modules/dnd/dirSpecification'
import { NUMBERMAP } from '@/constants/common'
const Completed = <CheckCircleIcon />
const NotStarted = <ErrorIcon />
const CurrentStep = <PendingIcon />

interface Step {
  id: number
  title: string
}

interface DIRComponentProps {
  getCurrentStep: (e: number) => void
  steps: Step[]
  currentSteps?: number
}

const DIRComponent: React.FC<DIRComponentProps> = ({
  getCurrentStep,
  steps = [],
  currentSteps,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(
    currentSteps ?? NUMBERMAP.ZERO
  )
  /*
      Description: Commented out the Stepper icon state variable,
      Author: Harsithiga B,
      Created: 20-08-2025,
      Modified:
      Classification : Confidential

        const [stepStatus, setStepStatus] = useState<{ [key: number]: string }>(
    steps.length
      ? steps.reduce((acc, step) => ({ ...acc, [step.id]: NotStarted }), {})
      : {}
  )
    */

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const updateCurrentStep = (nextId: number | null) => {
    if (nextId !== null) {
      setCurrentStep(nextId)
    }
  }

  const handlePrevious = () => {
    if (currentStep > NUMBERMAP.ONE) {
      const currentIndex = steps.findIndex((item) => item.id === currentStep)

      const nextId =
        currentIndex !== -1 && currentIndex < steps.length
          ? steps[currentIndex - NUMBERMAP.ONE].id
          : null
      /*
      Description: Commented out the Stepper icon state variable,
      Author: Harsithiga B,
      Created: 20-08-2025,
      Modified:
      Classification : Confidential

      setStepStatus((prevStatus) => ({
        ...prevStatus,
        [currentStep]: NotStarted,
        [currentStep - 1]: CurrentStep,
      }))
    */

      updateCurrentStep(nextId)
    }
  }

  const handleNext = () => {
    const currentIndex = steps.findIndex((item) => item.id === currentStep)
    if (currentIndex < steps.length) {
      const nextId =
        currentIndex !== -1 && currentIndex < steps.length
          ? steps[currentIndex + NUMBERMAP.ONE].id
          : null

      /*
      Description: Commented out the Stepper icon state variable,
      Author: Harsithiga B,
      Created: 20-08-2025,
      Modified:
      Classification : Confidential

      setStepStatus((prevStatus) => ({
        ...prevStatus,
        [currentStep]: Completed,
        [currentStep]: CurrentStep,
      }))
    */
      updateCurrentStep(nextId)
    }
  }

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleStepSelect = (stepId: number) => {
    // setStepStatus((prevStatus) => {
    //   const updatedStatus = { ...prevStatus }

    //   steps.forEach((step) => {
    //     if (step.id < stepId) {
    //       updatedStatus[step.id] = Completed
    //     } else if (step.id === stepId) {
    //       updatedStatus[step.id] = CurrentStep
    //     } else {
    //       updatedStatus[step.id] = NotStarted
    //     }
    //   })

    //   return updatedStatus
    // })

    setCurrentStep(stepId)
    handleClose()
  }

  useEffect(() => {
    if (steps.length > NUMBERMAP.ZERO && currentStep === NUMBERMAP.ZERO) {
      setCurrentStep(steps[NUMBERMAP.ZERO].id)
    }
  }, [steps, currentStep])

  useEffect(() => {
    getCurrentStep(currentStep)
  }, [currentStep])

  return (
    <DIRContainer>
      <PaginationContainer>
        {}
        <ArrowButton
          onClick={handlePrevious}
          disabled={currentStep === NUMBERMAP.ONE}
        >
          <KeyboardArrowLeftIcon />
        </ArrowButton>

        {}
        <StepContainer onClick={handleClick}>
          {/*
      Description: Commented out the Stepper icon,
      Author: Harsithiga B,
      Created: 20-08-2025,
      Modified:
      Classification : Confidential

      {stepStatus[currentStep] ?? NotStarted}
    */}
          {/* <StepIcon
            src={stepStatus[currentStep] ?? NotStarted}
            alt="Step Icon"
          /> */}
          <Box>
            Step {steps.findIndex((item) => item.id === currentStep) + NUMBERMAP.ONE}
            : {steps[steps.findIndex((item) => item.id === currentStep)]?.title}
          </Box>
        </StepContainer>

        {}
        <ArrowButton
          onClick={handleNext}
          disabled={
            steps.findIndex((item) => item.id === currentStep) ==
            steps.length - NUMBERMAP.ONE
          }
        >
          <KeyboardArrowRightIcon />
        </ArrowButton>

        {}
        <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
          {steps.map((step, index) => (
            <MenuItem key={step.id} onClick={() => handleStepSelect(step.id)}>
              {/*
      Description: Commented out the Stepper icon,
      Author: Harsithiga B,
      Created: 20-08-2025,
      Modified:
      Classification : Confidential

      {stepStatus[step.id] ?? NotStarted}
    */}
              <TextStep>
                Step {index + NUMBERMAP.ONE}: {step.title}
              </TextStep>
            </MenuItem>
          ))}
        </Menu>
      </PaginationContainer>
    </DIRContainer>
  )
}

export default DIRComponent
