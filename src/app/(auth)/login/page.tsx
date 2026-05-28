'use client'
import React from 'react'
import { Grid2 } from '@mui/material'
import { fromLayer, H100, LoginContainer } from '@/styles/modules/auth/login'
import LoginForm from '@/components/modules/auth/login/LoginForm'
import WelcomeSection from '@/components/ui/welcome-section/WelcomeSection'
import { NUMBERMAP } from '@/constants/common'

const Login: React.FC = () => {
  return (
    <LoginContainer>
      <Grid2 container spacing={NUMBERMAP.ZERO} sx={H100}>
        <Grid2 size={{ md: NUMBERMAP.SIX }}>
          <WelcomeSection />
        </Grid2>
        <Grid2 size={{ md: NUMBERMAP.SIX }} sx={fromLayer}>
          <LoginForm />
        </Grid2>
      </Grid2>
    </LoginContainer>
  )
}

export default Login
