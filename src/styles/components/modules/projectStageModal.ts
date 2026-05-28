import { Box, styled } from '@mui/material'

export const DialogContainer = styled(Box)(({ theme }) => ({
  padding: 0,
  overflow: 'hidden',
}))

export const TitleContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '20px 40px',
  borderBottom: '1px solid #E5E7EB',
  '@media (max-width: 991px)': {
    padding: '20px',
  },
}))

export const TitleSection = styled('h1')(({ theme }) => ({
  fontSize: '24px',
  fontWeight: 600,
  color: '#111827',
  margin: 0,
  lineHeight: 1,
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
}))

export const ContentWrapper = styled(Box)(({ theme }) => ({}))

export const FormContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  margin: '0 auto',
}))

export const FormSection = styled(Box)(({ theme }) => ({
  width: '100%',
  overflow: 'auto',
  height: '400px',
  scrollbarWidth: 'none',
}))

export const LabelContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',

  paddingRight: '80px',
  '@media (max-width: 991px)': {
    paddingRight: '20px',
  },
}))

export const StageLabel = styled('label')(({ theme }) => ({
  color: theme.palette.text.primary,
  fontSize: '18px',
  fontWeight: 400,
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
}))

export const StageValue = styled('p')(({ theme }) => ({
  color: theme.palette.text.disabled,
  fontSize: '16px',
  marginTop: '28px',
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
}))
