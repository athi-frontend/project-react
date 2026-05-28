'use client'
import React from 'react'
import { Grid2 } from '@mui/material'
import WelcomeSection from '@/components/ui/welcome-section/WelcomeSection'
import ForgotPassword from '@/components/modules/auth/login/ForgotPassword'

import {
  PageContainer,
  LeftSection,
  RightSection,
} from '@/styles/modules/auth/forgotpin'

const ForgotPinPage: React.FC = () => {
  return (
    <PageContainer>
      <Grid2 container spacing={0} sx={{ height: '100%' }}>
        <LeftSection size={{ md: 6 }}>
          <WelcomeSection />
        </LeftSection>
        <RightSection size={{ md: 6 }}>
          <ForgotPassword />
        </RightSection>
      </Grid2>
    </PageContainer>
  )
}

export default ForgotPinPage
