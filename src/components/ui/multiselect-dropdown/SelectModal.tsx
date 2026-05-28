import React from 'react'
import { Modal } from '@mui/material'
import { SelectedListModalProps } from '@/types/components/ui/dropDown'
import {
  ModalContainer,
  ListContainer,
  ListItem,
  ListItemsWrapper,
  ListTitle,
} from '@/styles/components/ui/dropdown'
import { CloseButton, CloseButtonWrapper } from '@/styles/components/ui/button'
import { MODAL_CONSTANTS } from '@/constants/common'

const SelectedListModal: React.FC<SelectedListModalProps> = ({
  open,
  onClose,
  listData,
  idField,
  valueField,
}) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby={MODAL_CONSTANTS.SELECTED_LIST_MODAL_TITLE}
      aria-describedby={MODAL_CONSTANTS.SELECTED_LIST_MODAL_DESCRIPTION}
    >
      <ModalContainer>
        <ListContainer>
          <ListTitle id={MODAL_CONSTANTS.SELECTED_LIST_MODAL_TITLE}>Selected List</ListTitle>
          <ListItemsWrapper id={MODAL_CONSTANTS.SELECTED_LIST_MODAL_DESCRIPTION}>
            {listData.map((item, index) => (
              <ListItem
                key={item[valueField]}
              >
                {item[valueField]}
              </ListItem>
            ))}
          </ListItemsWrapper>
        </ListContainer>
        <CloseButtonWrapper>
          <CloseButton variant={MODAL_CONSTANTS.OUTLINED_VARIANT} onClick={onClose}>
            Close
          </CloseButton>
        </CloseButtonWrapper>
      </ModalContainer>
    </Modal>
  )
}

export default SelectedListModal
