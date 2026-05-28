'use client'
import React from 'react'
import {
  WelcomeSectionContainer,
  WelcomeContentBox,
  WelcomeTitle,
  WelcomeSubtitle,
  WelcomeDescription,
  InlineStyles
} from '@/styles/modules/auth/login'
import { CREATE_PASSWORD_CONSTANTS } from '@/constants/modules/user/settingPassword'


const WelcomeSection: React.FC = () => {
  return (
    <WelcomeSectionContainer sx={InlineStyles.sectionContainer}>
      <WelcomeContentBox>
        <WelcomeTitle>{CREATE_PASSWORD_CONSTANTS.TITLES.WELCOME}</WelcomeTitle>
        <WelcomeSubtitle>
          <span style={InlineStyles.subtitleSpan}>
            {CREATE_PASSWORD_CONSTANTS.TITLES.WELCOME_SUBTITLE_DIGITAL}
          </span>{' '}
          <span style={InlineStyles.subtitleSpan}>
            {CREATE_PASSWORD_CONSTANTS.TITLES.WELCOME_SUBTITLE_QMS}
          </span>{' '}
          <span style={InlineStyles.subtitleSpan}>
            {CREATE_PASSWORD_CONSTANTS.TITLES.WELCOME_SUBTITLE_FOR}
          </span>{' '}
          <span style={InlineStyles.subtitleSpanBold}>
            {CREATE_PASSWORD_CONSTANTS.TITLES.WELCOME_SUBTITLE_MEDICAL}
          </span>{' '}
          <span style={InlineStyles.subtitleSpanBold}>
            {CREATE_PASSWORD_CONSTANTS.TITLES.WELCOME_SUBTITLE_DEVICES}
          </span>
        </WelcomeSubtitle>
        <WelcomeDescription>
          {CREATE_PASSWORD_CONSTANTS.WELCOME.DESCRIPTION}
        </WelcomeDescription>
      </WelcomeContentBox>
    </WelcomeSectionContainer>
  )
}

export default WelcomeSection
