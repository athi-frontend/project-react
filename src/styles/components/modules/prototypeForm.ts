import { styled } from '@mui/material/styles'
import { Box, Typography, Grid2 } from '@mui/material'

export const FormContainer = styled(Box)(({ theme }) => ({
  alignItems: 'center',
  borderRadius: '10px',
  backgroundColor: theme.palette.background.paper,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  justifyContent: 'start',
}))

export const FormSection = styled(Box)(({ theme }) => ({
  width: '100%',
}))

export const FormTitle = styled(Typography)(({ theme }) => ({
  minHeight: '104px',
  width: '100%',
  paddingLeft: '40px',
  paddingRight: '40px',
  paddingTop: '40px',
  paddingBottom: '40px',
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
  fontSize: '24px',
  color: theme.palette.primary.light,
  fontWeight: '600',
  whiteSpace: 'nowrap',
  lineHeight: '1',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
    paddingLeft: '20px',
    paddingRight: '20px',
    whiteSpace: 'initial',
  },
}))

export const FormContent = styled(Box)(({ theme }) => ({
  width: '100%',
  paddingBottom: '20px',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
  },
}))

export const FormRow = styled(Grid2)(({ theme }) => ({
  width: '100%',
  flexDirection: 'row',
  paddingLeft: '40px',
  paddingRight: '40px',
  alignItems: 'start',
  gap: '40px',
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
  fontWeight: '400',
  justifyContent: 'start',
  flexWrap: 'wrap',
  marginTop: '20px',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
    paddingLeft: '20px',
    paddingRight: '20px',
  },
}))

export const LabelContainer = styled(Grid2)(({ theme }) => ({
  display: 'flex',
  minWidth: '240px',
  paddingRight: '80px',
  flex: 1,
  paddingTop: '2px',
  paddingBottom: '2px',
  flexDirection: 'column',
  alignItems: 'start',
  flexGrow: 1,
  flexShrink: 1,
  width: '575px',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
    whiteSpace: 'initial',
  },
}))

export const LabelText = styled(Typography)(({ theme }) => ({
  fontSize: '18px',
}))

export const LabelValue = styled(Typography)(({ theme }) => ({
  color: '#999',
  fontSize: '16px',
  marginTop: '28px',
}))

export const ButtonContainer = styled(Box)(({ theme }) => ({
  overflowX: 'auto',
  display: 'flex',
  marginTop: '40px',
  width: '100%',
  paddingLeft: '40px',
  paddingRight: '40px',
  alignItems: 'center',
  gap: '20px',
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
  fontSize: '20px',
  color: '#652D90',
  fontWeight: '500',
  textAlign: 'center',
  justifyContent: 'end',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
    paddingLeft: '20px',
    paddingRight: '20px',
  },
}))
