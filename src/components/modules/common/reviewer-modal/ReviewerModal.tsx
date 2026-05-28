import React from 'react'
import ReviewerForm from './CommonReviewerForm'
import { HRReviewerModalProps } from '@/types/modules/hr/reviewer'
import CommonModal from '@/components/ui/common-modal/CommonModal'
/**
    Classification : Confidential
**/

const ReviewerModal: React.FC<HRReviewerModalProps> = ({
  open,
  onClose,
  mode,
  onSave,
  reviewerlist,
  hideReviewer = false,
  isSaving = false
}) => {
  return (
    <CommonModal
      title=''
      open={open}
      onClose={onClose}
      modalMaxWidth='600px'
    >
  
        <ReviewerForm
          onClose={onClose}
          reviewerlist={reviewerlist??[]}
          mode={mode}
          onSave={onSave}
          hideReviewer={hideReviewer}
          isSaving={isSaving}
        />
    </CommonModal>
  )
}

export default ReviewerModal 