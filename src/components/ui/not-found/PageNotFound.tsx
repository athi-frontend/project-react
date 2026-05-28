import React from 'react'
import {
  PageNotFoundContainer,
  ContentWrapper,
  ContentContainer,
  TextContainer,
  ErrorHeading,
  ErrorDescription,
  HomeButton,
  ButtonText,
  ButtonIconContainer,
  StyledArrowIcon,
} from '@/styles/components/ui/notfound'
import { EmojiSad } from 'iconsax-react'
import { NOT_FOUND_CONSTANTS } from '@/constants/components/ui/notFound'
import { useTheme } from '@mui/material'

const PageNotFound: React.FC<{ home?: boolean }> = ({ home=true }) => {
  const theme = useTheme()
  return (
    <PageNotFoundContainer>
      <ContentWrapper>
        <ContentContainer>
          <EmojiSad
            size={NOT_FOUND_CONSTANTS.EMOJI_SIZE}
            color={theme.palette.text.secondary}
          />
          <TextContainer>
            <ErrorHeading as={NOT_FOUND_CONSTANTS.HEADING_ELEMENT}>
              {NOT_FOUND_CONSTANTS.ERROR_404_HEADING}
            </ErrorHeading>
            <ErrorDescription as={NOT_FOUND_CONSTANTS.PARAGRAPH_ELEMENT}>
              {NOT_FOUND_CONSTANTS.ERROR_404_DESCRIPTION}
            </ErrorDescription>
          </TextContainer>
        </ContentContainer>
        {home && (
        <HomeButton
          as={NOT_FOUND_CONSTANTS.ANCHOR_ELEMENT}
          href={NOT_FOUND_CONSTANTS.HOME_BUTTON_HREF}
        >
          <ButtonText>{NOT_FOUND_CONSTANTS.HOME_BUTTON_TEXT}</ButtonText>
          <ButtonIconContainer>
            <StyledArrowIcon variant={NOT_FOUND_CONSTANTS.ICON_VARIANT} />
          </ButtonIconContainer>
        </HomeButton>
        )}
      </ContentWrapper>
    </PageNotFoundContainer>
  )
}

export default PageNotFound
