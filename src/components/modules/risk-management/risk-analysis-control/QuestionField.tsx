'use client'
import React, { useState, useEffect, useRef } from 'react'
import { Checkbox, Grid2 } from '@mui/material'
import { QuestionFieldProps } from '@/types/modules/risk-management/riskAnalysisControl'
import { RISK_CATEGORY_CONSTANTS } from '@/constants/modules/risk-management/riskAnalysisControl'
import {
  QuestionFieldContainer,
  QuestionFieldContent,
  QuestionFieldDescriptionContainer,
} from '@/styles/modules/risk-management/riskAnalysisControl'
import HazardLinkComponent from './HazardLink'
import { Description, showActionAlert } from '@/components/ui'
import { NUMBERMAP } from '@/constants/common'

/**
 * QuestionField Component
 * Renders individual question field with hazard link
 * Classification: Confidential
 */
const QuestionField: React.FC<QuestionFieldProps> = ({
  question,
  value,
  isChecked: propIsChecked,
  onChange,
  onHazardClick,
  onAddHazard,
  onSave,
  readOnly = false,
  hazardLinkText,
  enableAddHazardFromLink = true,
  showApplicabilityCheckbox = true,
}) => {
  const [descriptionValue, setDescriptionValue] = useState('')
  const initializedRef = useRef<string>('')

  // Use prop value for checkbox state (controlled component)
  const isChecked =
    propIsChecked !== undefined
      ? propIsChecked
      : Boolean(value && value.trim() !== '')

    const showCheckbox = showApplicabilityCheckbox ?? true
    const effectiveIsChecked = showCheckbox ? isChecked : true

  // Initialize description value when component mounts or when question changes
  useEffect(() => {
    const questionKey = question.id

    if (initializedRef.current !== questionKey) {
      // New question, initialize with the value
      if (isChecked && value) {
        setDescriptionValue(value)
      } else {
        setDescriptionValue('')
      }
      initializedRef.current = questionKey
    } else if (value !== descriptionValue) {
      // Same question but value changed, update description
      setDescriptionValue(value)
    }
  }, [question.id, value, isChecked]) // Depend on question.id, value, and isChecked

  // Clear description when checkbox is unchecked
  useEffect(() => {
    if (showCheckbox && !isChecked) {
      setDescriptionValue('')
    }
  }, [isChecked, showCheckbox])

  const handleCheckboxUncheck = async () => {
    // Check if this sub-category has risk_applicability_id and show warning
    if (question.riskApplicabilityId) {
      const result = await showActionAlert('customAlert', {
        title:
          RISK_CATEGORY_CONSTANTS.WARNING_MESSAGES.UNCHECK_SUBCATEGORY_TITLE,
        text: RISK_CATEGORY_CONSTANTS.WARNING_MESSAGES
          .UNCHECK_SUBCATEGORY_MESSAGE,
        icon: 'warning',
        confirmButton: true,
        cancelButton: true,
      })

      // If user cancels, don't proceed with unchecking
      if (!result.isConfirmed) {
        return
      }
    }

    // Clear description when unchecked
    setDescriptionValue('')
    onChange('', false)
  }

  const handleCheckboxCheck = () => {
    onChange(descriptionValue, true)
  }

  const handleCheckboxChecked = () => {
    handleCheckboxCheck()
  }

  const handleCheckboxUnchecked = async () => {
    await handleCheckboxUncheck()
  }

  const handleDescriptionChange = (newValue: string) => {
    setDescriptionValue(newValue)
    onChange(newValue, showCheckbox ? isChecked : true)
  }

  const handleHazardClick = () => {
    onHazardClick()
    if (onSave) {
      onSave(false) // Don't show alerts when saving from hazard click
    }
  }

  const handleAddHazard = () => {
    onAddHazard(question.id) // Pass the question ID
    if (onSave) {
      onSave(false) // Don't show alerts when saving from add hazard click
    }
  }

  // Determine if hazard link should be enabled
  const isHazardLinkEnabled =
    effectiveIsChecked &&
    descriptionValue.trim() !== '' &&
    question.riskApplicabilityId

  const hazardLinkLabel =
    hazardLinkText ?? RISK_CATEGORY_CONSTANTS.HAZARDS_LINK_TEXT

  return (
    <Grid2 container size={NUMBERMAP.TWELVE} key={question.id}>
      <Grid2 size={NUMBERMAP.TWELVE}>
        <QuestionFieldContainer>
          {showCheckbox && (
            <Checkbox
              checked={isChecked}
              onChange={(e) =>
                e.target.checked
                  ? handleCheckboxChecked()
                  : handleCheckboxUnchecked()
              }
              color="primary"
              disabled={readOnly}
            />
          )}
          <QuestionFieldContent>{question.label}</QuestionFieldContent>
          {question.hazardLink && (
            <HazardLinkComponent
              onClick={isHazardLinkEnabled ? handleHazardClick : undefined}
              onAddHazard={
                isHazardLinkEnabled && enableAddHazardFromLink
                  ? handleAddHazard
                  : undefined
              }
              disabled={!isHazardLinkEnabled}
              label={hazardLinkLabel}
              showAddIcon={enableAddHazardFromLink}
            />
          )}
        </QuestionFieldContainer>
      </Grid2>

      <Grid2 size={NUMBERMAP.TWELVE}>
        <QuestionFieldDescriptionContainer hasCheckbox={showCheckbox}>
          <Description
            label=""
            placeholder={RISK_CATEGORY_CONSTANTS.INPUT_PLACEHOLDER}
            value={descriptionValue}
            onChange={handleDescriptionChange}
            disabled={readOnly || (showCheckbox ? !isChecked : false)}
            maxLength={NUMBERMAP.THREETHOUSANDFIVEHUNDRED}
          />
        </QuestionFieldDescriptionContainer>
      </Grid2>
    </Grid2>
  )
}

export default QuestionField
