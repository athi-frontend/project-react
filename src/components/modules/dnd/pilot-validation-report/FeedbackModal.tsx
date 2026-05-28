'use client'
import React, { useState, useEffect } from 'react'
import { InputField, Description, MultiSelect, RichTextEditor, RadioButtonGroup } from '@/components/ui'
import { Grid2 } from '@mui/material'
import CommonModal from '@/components/ui/common-modal/CommonModal'
import { NUMBERMAP } from '@/constants/common'
import { popup_style } from '@/styles/common'
import { useFetchDIR, useFetchDecisionOptions, useFetchFunctionalBlock } from '@/hooks/modules/dnd/usePilotValidationReport'
import { useParams } from 'next/navigation'
import { FeedbackModalProps } from '@/types/modules/dnd/pilotValidationReport'
import { validateAndFocusFirstEmptyField } from '@/lib/utils/formUtils'
import { FEEDBACK_MODAL, FEEDBACK_FIELD_ORDER, FEEDBACK_FIELD_LABEL_MAP } from '@/constants/modules/dnd/pilotValidationReport'
const { TITLE_ADD, TITLE_EDIT, LABELS, PLACEHOLDERS, ERRORS, FIELDS, DROPDOWN_KEYS, MISC, RADIO_OPTIONS } = FEEDBACK_MODAL
/**
    Classification : Confidential
**/
const FeedbackModal: React.FC<FeedbackModalProps> = ({
  open,
  onClose,
  onSave,
  feedbackForm,
  handleFeedbackChange,
  editFeedbackId,
  projectStageOrderId,
  hasEditPermission = true,
}) => {
  const params = useParams()
  const projectId = Number(params.id)
  const dirOptionsQuery = useFetchDIR(projectId, projectStageOrderId)
  const decisionQuery = useFetchDecisionOptions()
  const functionalBlockQuery = useFetchFunctionalBlock(projectId)
  
  const [touched, setTouched] = useState({
    feedback: false,
    functional_block: false,
    dir: false,
    decision: false,
    measured_value: false,
  })

  useEffect(() => {
    if (open) {
      setTouched({
        feedback: false,
        functional_block: false,
        dir: false,
        decision: false,
        measured_value: false,
      })
    }
  }, [open])

  const handleSave = () => {
    if(!hasEditPermission) return;
    
    // If "Yes" is selected, just close the modal
    if (feedbackForm[FIELDS.INTENDED_USE_MET] === RADIO_OPTIONS.YES) {
      onClose()
      return
    }
    
    // If "No" is selected, validate all fields
    setTouched({
      feedback: true,
      functional_block: true,
      dir: true,
      decision: true,
      measured_value: true,
    })
    
    // Check if all required fields are filled
    const hasErrors = !feedbackForm[FIELDS.FEEDBACK]?.trim() || 
                     !feedbackForm[FIELDS.FUNCTIONAL_BLOCK] || 
                     feedbackForm[FIELDS.DIR]?.length === 0 || 
                     !feedbackForm[FIELDS.DECISION] || 
                     !feedbackForm[FIELDS.MEASURED_VALUE]?.trim()
    
    if (hasErrors) {
      validateAndFocusFirstEmptyField(feedbackForm, Array.from(FEEDBACK_FIELD_ORDER), FEEDBACK_FIELD_LABEL_MAP);
      return
    }
    
    onSave()
  }

  const handleFieldChange = (field: string, value: any) => {
    if(!hasEditPermission) return;
    handleFeedbackChange(field, value)
  }

  return (
  <CommonModal
      title={editFeedbackId ? TITLE_EDIT : TITLE_ADD}
      open={open}
      buttonRequired
      onClose={onClose}
      onSave={handleSave}
    >
      <Grid2 container spacing={NUMBERMAP.ONE} sx={popup_style}>
        <Grid2 size={NUMBERMAP.TWELVE}>
          <RadioButtonGroup
            label={LABELS.INTENDED_USE_MET}
            name={FIELDS.INTENDED_USE_MET}
            options={[
              { value: RADIO_OPTIONS.YES, label: RADIO_OPTIONS.YES },
              { value: RADIO_OPTIONS.NO, label: RADIO_OPTIONS.NO },
            ]}
            value={feedbackForm[FIELDS.INTENDED_USE_MET] ?? ''}
            onChange={(value) => handleFieldChange(FIELDS.INTENDED_USE_MET, value)}
            disabled={!hasEditPermission}
          />
        </Grid2>
        {feedbackForm[FIELDS.INTENDED_USE_MET] === RADIO_OPTIONS.NO && (
          <>
          <Grid2 size={NUMBERMAP.TWELVE}>
          <RichTextEditor
            label={LABELS.FEEDBACK}
            placeholder={PLACEHOLDERS.FEEDBACK}
            value={feedbackForm[FIELDS.FEEDBACK]}
            onChange={(value) => handleFieldChange(FIELDS.FEEDBACK, value)}
            error={touched[FIELDS.FEEDBACK] && !feedbackForm[FIELDS.FEEDBACK].trim() ? ERRORS.FEEDBACK : ''}
            disabled={!hasEditPermission}
          />
        </Grid2>
        <Grid2 size={NUMBERMAP.TWELVE}>
          <InputField
            label={LABELS.FUNCTIONAL_BLOCK}
            placeholder={PLACEHOLDERS.FUNCTIONAL_BLOCK}
            isDropdown
            keyField={DROPDOWN_KEYS.FUNCTIONAL_BLOCK_ID}
            valueField={DROPDOWN_KEYS.TITLE}
            value={String(feedbackForm[FIELDS.FUNCTIONAL_BLOCK] ?? MISC.EMPTY_STRING)}
            onChange={(value) => handleFieldChange(FIELDS.FUNCTIONAL_BLOCK, value)}
            options={functionalBlockQuery.data?.data?.flatMap((item: { blocks?: any[] }) => item.blocks ?? []) ?? []}
            error={
              touched[FIELDS.FUNCTIONAL_BLOCK] && !feedbackForm[FIELDS.FUNCTIONAL_BLOCK]
                ? ERRORS.FUNCTIONAL_BLOCK
                : ''
            }
            hasEditable={!hasEditPermission}
          />
        </Grid2>
        <Grid2 size={NUMBERMAP.TWELVE}>
          <MultiSelect
            options={dirOptionsQuery.data?.data ?? []}
            idField={DROPDOWN_KEYS.DESIGN_INPUT_REQUIREMENT_ID}
            valueField={DROPDOWN_KEYS.DIR_ID}
            label={LABELS.DIR}
            placeholder={PLACEHOLDERS.DIR}
            value={feedbackForm[FIELDS.DIR]}
            onChange={(value) => handleFieldChange(FIELDS.DIR, value)}
            error={
              touched[FIELDS.DIR] && feedbackForm[FIELDS.DIR].length === NUMBERMAP.ZERO ? ERRORS.DIR : ''
            }
            disabled={!hasEditPermission}
          />
        </Grid2>
        <Grid2 size={NUMBERMAP.TWELVE}>
          <InputField
            label={LABELS.DECISION}
            placeholder={PLACEHOLDERS.DECISION}
            isDropdown
            keyField={DROPDOWN_KEYS.DECISION_ID}
            valueField={DROPDOWN_KEYS.DECISION}
            value={feedbackForm[FIELDS.DECISION]}
            onChange={(value) => handleFieldChange(FIELDS.DECISION, value)}
            options={decisionQuery.data?.data ?? []}
            error={
              touched[FIELDS.DECISION] && !feedbackForm[FIELDS.DECISION]
                ? ERRORS.DECISION
                : ''
            }
            hasEditable={!hasEditPermission}
          />
        </Grid2>
        <Grid2 size={NUMBERMAP.TWELVE}>
          <InputField
            label={LABELS.MEASURED_VALUES}
            placeholder={PLACEHOLDERS.MEASURED_VALUES}
            value={feedbackForm[FIELDS.MEASURED_VALUE]}
            onChange={(value) => handleFieldChange(FIELDS.MEASURED_VALUE, value)}
            error={
              touched[FIELDS.MEASURED_VALUE] && !feedbackForm[FIELDS.MEASURED_VALUE].trim()
                ? ERRORS.MEASURED_VALUES
                : ''
            }
            hasEditable={!hasEditPermission}
          />
        </Grid2>
        <Grid2 size={NUMBERMAP.TWELVE}>
          <Description
            label={LABELS.COMMENTS}
            placeholder={PLACEHOLDERS.COMMENTS}
            value={feedbackForm[FIELDS.COMMENTS]}
            onChange={(value) => handleFieldChange(FIELDS.COMMENTS, value)}
            disabled={!hasEditPermission}
          />
        </Grid2>
          </>
        )}
      </Grid2>
    </CommonModal>
  )
}

export default FeedbackModal