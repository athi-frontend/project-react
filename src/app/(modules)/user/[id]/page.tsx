'use client'
import React from 'react'
import { Grid2 } from '@mui/material'
import WelcomeSection from '@/components/ui/welcome-section/WelcomeSection'
import dynamic from 'next/dynamic'
import { URL_PATHS_TO_ALLOWED } from '@/constants/modules/user/settingPassword'
import { FullScreenNotFoundContainer } from '@/styles/modules/user/settingPassword'
import { useParams } from 'next/navigation'
import { NotFound } from '@/components/ui'
const SettingPasswordForm = dynamic(
  () => import('@/components/modules/user/SettingPasswordPinForm'),
  { ssr: false }
)
const Login: React.FC = () => {
  const params = useParams()
  const { id } = params
  /**
* Function Name: 
* Params: id
* Description:if the id is not set-password or reset-forgot-password, show a not found page,
* Author: Madhumitha,
* Created: 18-08-2025,
* Modified:
* Classification : Confidential
**/
  return (!(id== URL_PATHS_TO_ALLOWED.SET_PASSWORD || id== URL_PATHS_TO_ALLOWED.RESET_PASSWORD))?
  <FullScreenNotFoundContainer>
  <NotFound />
</FullScreenNotFoundContainer>:
(
    <Grid2 container spacing={0}>
      <Grid2 size={{ md: 6 }}>
        <WelcomeSection />
      </Grid2>
      <Grid2 size={{ md: 6 }}>
        <SettingPasswordForm />
      </Grid2>
    </Grid2>
  )
}

export default Login
