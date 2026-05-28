'use client'
import React, { ReactNode } from 'react'
import { Modal } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import {
  ModalContainer,
  ModalHeader,
  ModalTitle,
  CloseButton,
  ModalContent,
  ModalFooter,
  CancelButton,
  SaveButton,
  INDEX,
} from '@/styles/components/ui/modal'
import {
  MODAL_TITLE_ID,
  MODAL_DESCRIPTION_ID,
  CANCEL_BUTTON_TEXT,
  SAVE_BUTTON_TEXT,
} from '@/constants/components/ui/modal'

interface CommonModalProps {
  open: boolean
  onClose?: () => void
  title: string
  onSave?: () => void
  children: ReactNode
  buttonRequired?: boolean
  modalMaxWidth?: string
}

const CommonModal: React.FC<CommonModalProps> = ({
  open,
  buttonRequired = false,
  onClose,
  title,
  onSave,
  children,
  modalMaxWidth = '800px',
}) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby={MODAL_TITLE_ID}
      aria-describedby={MODAL_DESCRIPTION_ID}
      sx={{
        zIndex: INDEX.zIndex,
      }}
      disableEnforceFocus
    >
      <ModalContainer sx={{ maxWidth: modalMaxWidth }}>
        <ModalHeader>
          <ModalTitle id={MODAL_TITLE_ID}>{title}</ModalTitle>
          <CloseButton onClick={onClose}>
            <CloseIcon />
          </CloseButton>
        </ModalHeader>
        <ModalContent id={MODAL_DESCRIPTION_ID}>{children}</ModalContent>
        {buttonRequired ? (
          <ModalFooter>
           {onClose && <CancelButton variant="outlined" onClick={onClose}>
              {CANCEL_BUTTON_TEXT}
            </CancelButton>}
          { onSave && <SaveButton variant="contained" onClick={onSave}>
              {SAVE_BUTTON_TEXT}
            </SaveButton>}
          </ModalFooter>
        ) : null}
      </ModalContainer>
    </Modal>
  )
}

export default CommonModal
