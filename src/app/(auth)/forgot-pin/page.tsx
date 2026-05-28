'use client'
import React from 'react'
import { Grid2 } from '@mui/material'
import WelcomeSection from '@/components/ui/welcome-section/WelcomeSection'

import {
  PageContainer,
  LeftSection,
  RightSection,
} from '@/styles/modules/auth/forgotpin'
import ForgotPinForm from '@/components/modules/auth/login/ForgotPinForm'

const ForgotPinPage: React.FC = () => {
  return (
    <PageContainer>
      <Grid2 container>
        <LeftSection size={{ md: 6 }}>
          <WelcomeSection />
        </LeftSection>
        <RightSection size={{ md: 6 }}>
          <ForgotPinForm />
        </RightSection>
      </Grid2>
    </PageContainer>
  )
}

export default ForgotPinPage
