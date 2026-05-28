import React, { useEffect, useState } from 'react'
import {
  SaveButton,
} from '@/styles/components/modules/procurement'
import { HRReviewerFormProps } from '@/types/modules/hr/reviewer'

import { Description, InputField } from '@/components/ui'
import { BUTTON_LABEL, NUMBERMAP, REVIEWER_FORM } from '@/constants/common'
import { COMMON_CONSTANTS } from '@/lib/utils/common'
import { Grid2 } from '@mui/material'
import { reviewerModalStyles } from '@/styles/modules/common/reviewerModal'

/**
    Classification : Confidential
**/

const { EMPTY_ARRAY_LENGTH } = COMMON_CONSTANTS

const CommonReviewerForm: React.FC<HRReviewerFormProps> = ({
  mode,
  onSave,
  commentshistory,
  reviewerlist,
  hideReviewer = false,
  isSaving = false
}) => {
  const [selectedReviewer, setSelectedReviewer] = useState<number | null>(null)
  const [commentProvided, setCommentProvided] = useState<string>('')
  const [errors, setErrors] = useState<{ reviewer?: string; comment?: string }>(
    {}
  )
  const [reviewersData, setReviewersData] = useState([])

  const validateForm = (): boolean => {
    const newErrors: { reviewer?: string; comment?: string } = {}

    if (mode === BUTTON_LABEL.SUBMIT_FOR_REVIEW && !hideReviewer && !selectedReviewer) {
      newErrors.reviewer = REVIEWER_FORM.REVIEWER_REQUIRED
    }

    if (mode === BUTTON_LABEL.REJECT && !commentProvided?.trim()) {
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
    // Call the onSave prop if provided with form data
    if (onSave) {
      onSave(commentProvided, selectedReviewer ?? undefined)
    }
  }

const handleCommentChange = (event: React.ChangeEvent<HTMLTextAreaElement> | string) => {
    setCommentProvided(event ?? '')
    setErrors(prev => ({ ...prev, comment: '' }))
  }

  const handleReviewerChange = (selectedValue: number | null) => {
    setSelectedReviewer(selectedValue)
    setErrors({ reviewer: '' })
  }

  useEffect(()=>{
    if(reviewerlist && reviewerlist?.length>0){
       const reviewer= reviewerlist.map((rev)=>({
        ...rev,
        'id':rev?.user_id,
          full_name: `${rev?.first_name} ${rev?.last_name}`,
       }))
       setReviewersData(reviewer)
    }
  },[reviewerlist])

  return (
    <Grid2 container spacing={NUMBERMAP.ONE} >
      <Grid2 size={NUMBERMAP.TWELVE} >
      {mode === BUTTON_LABEL.SUBMIT_FOR_REVIEW && !hideReviewer && (
     
          <InputField
            label={REVIEWER_FORM.REVIEW_LABEL}
            placeholder={REVIEWER_FORM.REVIEW_PLACEHOLDER}
            options={reviewersData}
            keyField={REVIEWER_FORM.REVIEW_ID}
            valueField={REVIEWER_FORM.REVIEW_VALUE}
            isDropdown
            onChange={handleReviewerChange}
            value={selectedReviewer}
            error={errors.reviewer}
          />
        
      )}
      </Grid2>
      <Grid2 size={NUMBERMAP.TWELVE}>
        <Description
          placeholder={REVIEWER_FORM.COMMENTS_PLACEHOLDER}
          label={mode === BUTTON_LABEL.REJECT ? REVIEWER_FORM.COMMENTS_REQUIRED : REVIEWER_FORM.COMMENTS}
          value={commentProvided}
          onChange={handleCommentChange}
          error={errors.comment}
        />
      </Grid2>
      <Grid2 size={NUMBERMAP.TWELVE} sx={reviewerModalStyles.buttonContainer}>
      <SaveButton sx={reviewerModalStyles.saveButton} onClick={handleSave} disabled={isSaving}>
        {REVIEWER_FORM.SUBMIT_BUTTON}
      </SaveButton>
      </Grid2>
    </Grid2>
  )
}

export default CommonReviewerForm 