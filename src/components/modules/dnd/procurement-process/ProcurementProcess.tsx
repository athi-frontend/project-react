import React, { useState, useEffect } from 'react'
import {
  Box,
  Modal,
  Typography,
  FormControlLabel,
  Checkbox,
} from '@mui/material'
import ProcessStep from './ProcessStep'
import CloseIcon from './CloseIcon'
import {
  Container,
  ContentWrapper,
  StepsContainer,
  StepsWrapper,
  CommentSection,
  CommentLabel,
  CommentInput,
  SaveButton,
  ModalStyle,
  TitleSection,
  CheckboxesContainer,
  CheckboxGroup,
  reviewTextStyle,
  reviewLabelStyle,
  largeCheckboxStyle,
} from '@/styles/components/modules/procurement'
import { ProcurementProcessProps } from '@/types/components/modules/procurement'
import {
  useFeasibilityStudyDecision,
  useSaveFeasibilityStudyDecision,
} from '@/hooks/modules/dnd/useFeasibilityStudy'
import { useParams } from 'next/navigation'
import {
  FEASIBILITY_TYPES,
  STEPS,
  PLACEHOLDER_TEXT,
  ERROR_MESSAGES,
  SAVING_BUTTON_TEXT,
} from '@/constants/modules/dnd/feasibilityStudy'
import { useDispatch } from 'react-redux'
import { setDecision } from '@/store/slices/decisionSlice'

const ProcurementProcess: React.FC<ProcurementProcessProps> = ({
  open,
  buttonId,
  modalToggle,
}) => {
  const [comment, setComment] = useState('')
  const [error, setError] = useState('')
  const [selectedValue, setSelectedValue] = useState('')
  const [financialFeasibility, setFinancialFeasibility] = useState(false)
  const [marketingStrategy, setMarketingStrategy] = useState(false)
  const [technicalFeasibility, setTechnicalFeasibility] = useState(false)

  const params = useParams()
  const projectId = Number(params.id)
  const {
    data,
    isLoading,
    error: queryError,
  } = useFeasibilityStudyDecision(projectId)
  const {
    mutate: saveFeasibilityStudy,
    isPending: isSaving,
    error: saveError,
  } = useSaveFeasibilityStudyDecision()
  const dispatch = useDispatch()
  useEffect(() => {
    if (data && Array.isArray(data.feasibility_types)) {
      data.feasibility_types.forEach((type) => {
        if (type.type === FEASIBILITY_TYPES.FINANCIAL) {
          setFinancialFeasibility(type.selected === 1)
        }
        if (type.type === FEASIBILITY_TYPES.MARKETING) {
          setMarketingStrategy(type.selected === 1)
        }
        if (type.type === FEASIBILITY_TYPES.TECHNICAL) {
          setTechnicalFeasibility(type.selected === 1)
        }
      })
    }

    if (data && Array.isArray(data.decisions)) {
      const selectedDecision = data.decisions.find((d) => d.selected === 1)
      if (selectedDecision) {
        setSelectedValue(selectedDecision.decision.toLowerCase())
      }
      setComment(data.comments ?? '')
    }
  }, [data])

  const steps = Array.isArray(data?.decisions)
    ? data.decisions.map((decision) => ({
        label: decision.decision,
        value: decision.decision.toLowerCase(),
        decision_id: decision.decision_id,
      }))
    : [
        { label: STEPS.PROCURE, value: STEPS.PROCURE_VALUE, decision_id: 1 },
        { label: STEPS.PROCEED, value: STEPS.PROCEED_VALUE, decision_id: 2 },
        { label: STEPS.DROP, value: STEPS.DROP_VALUE, decision_id: 3 },
      ]

  const handleSave = () => {
    if (!selectedValue) {
      setError(ERROR_MESSAGES.DECISION_REQUIRED)
      return
    }

    setError('')

    const types = []
    if (financialFeasibility) types.push(1)
    if (marketingStrategy) types.push(2)
    if (technicalFeasibility) types.push(3)

    const selectedDecision = steps.find((step) => step.value === selectedValue)
    const decisionId = selectedDecision ? selectedDecision.decision_id : 0
    if (selectedDecision) {
      dispatch(
        setDecision({
          decision_id: selectedDecision.decision_id,
          decision_name: selectedDecision.label,
        })
      )
    }
    const payload = {
      project_id: projectId,
      trigger_status_id: buttonId,
      types,
      decision: decisionId,
      comments: comment ?? '',
    }

    saveFeasibilityStudy(payload, {
      onSuccess: () => {
        modalToggle()
      },
      onError: (error) => {
        setError(error.message ?? ERROR_MESSAGES.SAVE_ERROR)
      },
    })
  }

  const handleRadioChange = (value: string) => {
    setSelectedValue(value)
    setError('')
  }

  if (isLoading) {
    return <Typography>Loading feasibility study data...</Typography>
  }

  if (queryError) {
    return (
      <Typography>
        Error: {(queryError as Error).message ?? 'Failed to load data'}
      </Typography>
    )
  }

  return (
    <Modal open={open} onClose={modalToggle}>
      <Box sx={ModalStyle}>
        <Container>
          <ContentWrapper>
            <TitleSection>
              <Typography sx={reviewTextStyle}>
                I have reviewed the financial feasibility, marketing strategy
                management, and technical feasibility, and confirm that the
                project is viable for product development
              </Typography>
            </TitleSection>

            <CheckboxesContainer>
              <CheckboxGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={financialFeasibility}
                      onChange={(e) =>
                        setFinancialFeasibility(e.target.checked)
                      }
                      sx={largeCheckboxStyle}
                    />
                  }
                  label={
                    <Typography sx={reviewLabelStyle}>
                      Financial
                      <br />
                      Feasibility
                    </Typography>
                  }
                />
              </CheckboxGroup>

              <CheckboxGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={marketingStrategy}
                      onChange={(e) => setMarketingStrategy(e.target.checked)}
                      sx={largeCheckboxStyle}
                    />
                  }
                  label={
                    <Typography sx={reviewLabelStyle}>
                      Marketing Strategy
                      <br />
                      Alignment
                    </Typography>
                  }
                />
              </CheckboxGroup>

              <CheckboxGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={technicalFeasibility}
                      onChange={(e) =>
                        setTechnicalFeasibility(e.target.checked)
                      }
                      sx={largeCheckboxStyle}
                    />
                  }
                  label={
                    <Typography sx={reviewLabelStyle}>
                      Technical
                      <br />
                      Feasibility
                    </Typography>
                  }
                />
              </CheckboxGroup>
            </CheckboxesContainer>
            <StepsContainer>
              <CommentLabel>Decision*</CommentLabel>
              <StepsWrapper>
                {steps.map((step) => (
                  <ProcessStep
                    key={step.value}
                    label={step.label}
                    value={step.value}
                    selectedValue={selectedValue}
                    onChange={handleRadioChange}
                  />
                ))}
              </StepsWrapper>
              <Typography color="error.main">
                {error ?? (saveError && (saveError as Error).message)}
              </Typography>
            </StepsContainer>
            <CommentSection>
              <CommentLabel>Comments</CommentLabel>
              <CommentInput
                placeholder={PLACEHOLDER_TEXT}
                value={comment}
                multiline
                rows={4}
                onChange={(e) => setComment(e.target.value)}
              />
            </CommentSection>
          </ContentWrapper>
          <SaveButton onClick={handleSave} disabled={isSaving}>
            {isSaving ? SAVING_BUTTON_TEXT.SAVING : SAVING_BUTTON_TEXT.DEFAULT}
          </SaveButton>
          <CloseIcon onClick={modalToggle} />
        </Container>
      </Box>
    </Modal>
  )
}

export default ProcurementProcess
