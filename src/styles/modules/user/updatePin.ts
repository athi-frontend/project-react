import { Box, Typography, styled } from '@mui/material'

export const Logo = styled('img')({
  width: '300px',
  height: '90px',
  marginBottom: '42px',
})

export const FormContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',

  width: '100%',
  maxWidth: '576px',
  padding: '40px 60px',
  borderRadius: '10px',
  backgroundColor: theme.palette.background.paper,
  position: 'relative',
}))

export const LoadingOverlay = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',

  zIndex: 10,
  borderRadius: '10px',
})

export const Title = styled(Typography)({
  fontFamily: "'Poppins',sans-serif",
  fontWeight: '700',
  fontSize: '40px',

  textAlign: 'center',
  marginBottom: '10px',
  '@media (max-width: 640px)': {
    fontSize: '40px',
  },
})

export const Subtitle = styled(Typography)({
  fontFamily: "'Poppins',sans-serif",
  fontWeight: '400',
  fontSize: '16px',

  textAlign: 'center',
  marginBottom: '40px',
  '@media (max-width: 640px)': {
    fontSize: '14px',
  },
})

export const ErrorMessage = styled(Typography)({
  fontFamily: "'Poppins',sans-serif",
  fontWeight: '400',
  fontSize: '14px',
  color: '#d32f2f',
  marginTop: '-10px',
  marginBottom: '10px',
  width: '100%',
})
