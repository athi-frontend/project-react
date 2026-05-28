/**
  *Classification : Confidential
**/

'use client'
import React from 'react'
import {
  ButtonContainer,
  SaveButton,
  StyledButton,
} from '@/styles/components/ui/button'
import { ButtonWrapper } from '@/styles/common'
import { ButtonGroupProps } from '@/types/components/ui/button'

const ButtonGroup: React.FC<ButtonGroupProps> = ({ buttons }) => {

  return (
    <ButtonContainer>
      <ButtonWrapper>
        {buttons.map((button, index) =>
          button.label === 'Save' ? (
            <SaveButton
              variant="contained"
              key={button.label}
              onClick={button.onClick}
              className={button.className}
              disabled={button.disabled}
              startIcon={button.startIcon}
              endIcon={button.endIcon}
            >
              {button.label}
            </SaveButton>
          ) : (
            <StyledButton
              key={button.label}
              onClick={button.onClick}
              className={button.className}
              disabled={button.disabled}
              startIcon={button.startIcon}
              endIcon={button.endIcon}
              variant={button.variant}
            >
              {button.label}
            </StyledButton>
          )
        )}
      </ButtonWrapper>
    </ButtonContainer>
  )
}

export default ButtonGroup
