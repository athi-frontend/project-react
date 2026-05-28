import React from 'react'
import {
  AccessDeniedContainer,
  ContentWrapper,
  ContentContainer,
  TextContainer,
  ErrorHeading,
  ErrorDescription,
} from '@/styles/components/ui/notfound'
import { EmojiSad } from 'iconsax-react'
import { NOT_FOUND_CONSTANTS } from '@/constants/components/ui/notFound'
import { useTheme } from '@mui/material'

interface AccessDeniedProps {
  customMessage: {
    heading: string
    description: string
  }
}

const AccessDenied: React.FC<AccessDeniedProps> = ({ customMessage }) => {
  const theme = useTheme()

  return (
    <AccessDeniedContainer>
      <ContentWrapper>
        <ContentContainer>
          <EmojiSad
            size={NOT_FOUND_CONSTANTS.EMOJI_SIZE}
            color={theme.palette.text.secondary}
          />
          <TextContainer>
            <ErrorHeading as={NOT_FOUND_CONSTANTS.HEADING_ELEMENT}>
              {customMessage.heading}
            </ErrorHeading>
            <ErrorDescription as={NOT_FOUND_CONSTANTS.PARAGRAPH_ELEMENT}>
              {customMessage.description}
            </ErrorDescription>
          </TextContainer>
        </ContentContainer>
      </ContentWrapper>
    </AccessDeniedContainer>
  )
}

export default AccessDenied
