import React from 'react'
import { Modal } from '@mui/material'
import ReviewerForm from './ReviewerForm'
import { ModalContainer } from '@/styles/components/modules/procurement'
import { ReviewerModalProps } from '@/types/components/modules/procurement'
import { INDEX } from '@/styles/components/ui/modal'

/**
    Classification : Confidential
**/
const ReviewerModal: React.FC<ReviewerModalProps> = ({
  open,
  onClose,
  project_id,
  button_id,
  mode,
  menu_id,
  menu_name,
  task_id,
  reviewerList,
}) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        zIndex: INDEX.zIndex,
      }}
    >
      <ModalContainer>
        <ReviewerForm
          onClose={onClose}
          department_id={project_id}
          button_id={button_id}
          mode={mode}
          menu_id={menu_id}
          menu_name={menu_name}
          task_id={task_id}
          reviewerList={reviewerList}
        />
      </ModalContainer>
    </Modal>
  )
}

export default ReviewerModal
