import { styled } from '@mui/material/styles'
import { Box, Typography, Link } from '@mui/material'
import { ArrowRight } from 'iconsax-react'

export const PageNotFoundContainer = styled(Box)(({ theme }) => ({
  backgroundColor: 'rgba(247, 242, 251, 1)',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  padding: '20px',
  boxSizing: 'border-box',
  '@media (max-width: 991px)': {
    padding: '10px',
  },
}))

export const AccessDeniedContainer = styled(Box)(({ theme }) => ({
  height: '100vh',
  display: 'flex',
  backgroundColor: theme.palette.background.paper,
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  padding: '20px',
  boxSizing: 'border-box',
  '@media (max-width: 991px)': {
    padding: '10px',
  },
}))

export const ContentWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  maxWidth: '600px',
  height: 'auto',
}))

export const ContentContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
  color: 'rgba(0, 0, 0, 1)',
  textAlign: 'center',
}))

export const LogoImage = styled('img')(({ theme }) => ({
  aspectRatio: '1',
  objectFit: 'contain',
  objectPosition: 'center',
  width: '100px',
  maxWidth: '100%',
  marginBottom: '20px',
  '@media (max-width: 991px)': {
    width: '80px',
  },
}))

export const TextContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginTop: '40px',
  color: theme.palette.text.primary,
  '@media (max-width: 991px)': {
    marginBottom: '15px',
  },
}))

export const ErrorHeading = styled(Typography)(({ theme }) => ({
  fontSize: '36px',
  fontWeight: '500',
  '@media (max-width: 991px)': {
    fontSize: '28px',
  },
}))

export const ErrorDescription = styled(Typography)(({ theme }) => ({
  fontSize: '18px',
  fontWeight: '400',
  marginTop: '10px',
  paddingBottom: '80px',
  '@media (max-width: 991px)': {
    fontSize: '16px',
  },
}))

export const HomeButton = styled(Link)(({ theme }) => ({
  alignItems: 'center',
  borderRadius: '8px',
  backgroundColor: '#652D90',
  display: 'flex',
  minHeight: '40px',
  padding: '8px 20px',
  gap: '10px',
  '@media (max-width: 991px)': {
    padding: '6px 15px',
    minHeight: '36px',
  },
}))

export const ButtonText = styled(Typography)(({ theme }) => ({
  color: 'rgba(255, 255, 255, 1)',
  fontSize: '16px',
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
  fontWeight: '500',
  '@media (max-width: 991px)': {
    fontSize: '14px',
  },
}))

export const ButtonIconContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  width: '20px',
  '@media (max-width: 991px)': {
    width: '16px',
  },
}))

export const StyledArrowIcon = styled(ArrowRight)(({ theme }) => ({
  width: '20px',
  height: '20px',
  color: 'white',
  '@media (max-width: 991px)': {
    width: '16px',
    height: '16px',
  },
}))
