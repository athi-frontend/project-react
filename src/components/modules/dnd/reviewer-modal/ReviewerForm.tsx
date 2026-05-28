import React, { useState } from 'react'
import CloseIcon from './CloseIcon'
import {
  ContentWrapper,
  SaveButton,
  FormContainer
} from '@/styles/components/modules/procurement'
import { ReviewerFormProps } from '@/types/components/modules/procurement'
import { useSubmitReview } from '@/hooks/modules/dnd/useCommonReviewModal'
import { Description, InputField, showActionAlert } from '@/components/ui'
import { STATUS, BUTTON_LABEL, REVIEWER_FORM } from '@/constants/common'
import { WorkflowActionData } from '@/types/common'
import { COMMON_CONSTANTS } from '@/lib/utils/common'

/**
    Classification : Confidential
**/
const { EMPTY_ARRAY_LENGTH } = COMMON_CONSTANTS

const ReviewerForm: React.FC<ReviewerFormProps> = ({
  onClose,
  department_id,
  button_id,
  mode,
  menu_id,
  menu_name,
  task_id,
  reviewerList,
}) => {
  const [reviewer, setReviewer] = useState<string>('')
  const [comment, setComment] = useState<string>('')
  const [errors, setErrors] = useState<{ reviewer?: string; comment?: string }>(
    {}
  )
  const [disabled, setDisabled] = useState(false)
  const { mutate: saveReview } = useSubmitReview(menu_name)


  // Use props if available, otherwise fall back to all users
  const finalReviewerList = reviewerList ?? []
  
  const transformedReviewers = finalReviewerList.map((reviewer: any) => ({
    ...reviewer,
    id: reviewer.user_id,
    full_name: `${reviewer.first_name} ${reviewer.last_name}`,
  }))

  const validateForm = (): boolean => {
    const newErrors: { reviewer?: string; comment?: string } = {}

    //Validate reviewer selection only for SUBMIT_FOR_REVIEW mode
    if (mode === BUTTON_LABEL.SUBMIT_FOR_REVIEW && !reviewer) {
      newErrors.reviewer = 'Please select a reviewer'
    }

    if (mode === BUTTON_LABEL.REJECT && !comment?.trim()) {
      newErrors.comment = REVIEWER_FORM.COMMENT_REQUIRED_FOR_REJECTION
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === EMPTY_ARRAY_LENGTH
  }

  const handleSave = () => {
    // Validate form before submission
    if (!validateForm()) {
      return
    }
    setDisabled(true)
    let payload: WorkflowActionData = {
      menu_id: menu_id,
      project_id: Number(department_id),
      new_status_id: button_id,
      comment: comment,
      task_id: task_id,
    }

    if (mode === BUTTON_LABEL.SUBMIT_FOR_REVIEW) {
      payload = { ...payload, reviewer: Number(reviewer) }
    }

    saveReview(payload, {
      onSuccess: () => {
        showActionAlert(STATUS.SUCCESS)
        setDisabled(false)
        onClose()
      },
      onError: () => {
        showActionAlert(STATUS.FAILED)
        setDisabled(false)
        onClose()
      },
    })
}

  const handleCommentChange = (event: any) => {
    const value = event?.target?.value ?? event?.value ?? event ?? ''
    setComment(value)
    if (errors.comment && value?.trim()) {
      setErrors({ ...errors, comment: '' })
    }
  }

  const handleReviewerChange = (selectedValue: string) => {
    setReviewer(selectedValue)
    setErrors({ reviewer: '' })
  }

  return (
    <FormContainer>
      {mode === BUTTON_LABEL.SUBMIT_FOR_REVIEW && (
        <ContentWrapper>
          <InputField
            label={REVIEWER_FORM.REVIEW_LABEL}
            placeholder={REVIEWER_FORM.REVIEW_PLACEHOLDER}
            options={transformedReviewers}
            keyField={REVIEWER_FORM.REVIEW_ID}
            valueField={REVIEWER_FORM.REVIEW_VALUE}
            isDropdown
            onChange={handleReviewerChange}
            value={reviewer}
            error={errors.reviewer}
          />
        </ContentWrapper>
      )}
      <ContentWrapper>
        <Description
          placeholder="Enter Comments"
          label={REVIEWER_FORM.COMMENTS}
          value={comment}
          onChange={handleCommentChange}
          error={errors.comment}
        />
      </ContentWrapper>
      <CloseIcon onClick={onClose} />
      <SaveButton onClick={handleSave} disabled={disabled}>
        Submit
      </SaveButton>
    </FormContainer>
  )
}

export default ReviewerForm
