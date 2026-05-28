'use client'
import { Box, Typography, styled } from '@mui/material'
/**
 * Classification: Confidential
 */
const HeaderContainer = styled(Box)(({ theme }) => ({
  borderRadius: '10px',
  display: 'flex',
  minHeight: '80px',
  width: '100%',
  flexDirection: 'column',

  justifyContent: 'center',
  padding: '20px 0',
}))

const HeaderTitle = styled(Typography)(({ theme }) => ({
  padding: '15px 40px',
  font: '600 24px/1 Poppins, sans-serif',
}))

const HeaderTitle2 = styled(Typography)(({ theme }) => ({
  font: '600 24px/1 Poppins, sans-serif',
  padding: '20px 0',
}))

export { HeaderContainer, HeaderTitle ,HeaderTitle2}
