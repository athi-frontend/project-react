'use client'
import React from 'react'
import { Grid2 } from '@mui/material'
import dynamic from 'next/dynamic'
const UpdatePasswordForm = dynamic(
  () => import('@/components/modules/user/UpdatePassword'),
  { ssr: false }
)
const Login: React.FC = () => {
  return (
    <Grid2 container spacing={0} sx={{ justifyContent: 'center' }}>
      <Grid2 size={{ md: 6 }}>
        <UpdatePasswordForm />
      </Grid2>
    </Grid2>
  )
}

export default Login
