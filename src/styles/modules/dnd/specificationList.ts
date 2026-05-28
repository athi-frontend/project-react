import { styled, SxProps } from '@mui/system'
import { Box, Typography, Button } from '@mui/material'

/**
 Classification : Confidential
**/

const FormTeamContainer = styled(Box)(({ theme }) => ({
  borderRadius: '10px',
  padding: '0px 20px',
  backgroundColor: theme.palette.background.paper,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'start',
}))

export const CommentsHistoryContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-start',
  width: '100%',
  paddingLeft: '20px',
  paddingTop: '20px',
}))

const HeaderContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  minHeight: '85px',
  width: '100%',
  alignItems: 'center',
  gap: '40px 100px',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  padding: '20px',
  [theme.breakpoints.down('lg')]: {
    maxWidth: '100%',
  },
}))

const Title = styled(Typography)(({ theme }) => ({
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '1',
  alignSelf: 'stretch',
  margin: 'auto 0',
}))

const ContentContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  width: '100%',
  flexDirection: 'column',
  justifyContent: 'start',
  padding: '0 20px',
  [theme.breakpoints.down('lg')]: {
    maxWidth: '100%',
  },
}))

const ButtonWrapper = styled(Box)(({ theme }) => ({
  position: 'absolute',
  zIndex: '0',
  display: 'flex',
  maxWidth: '100%',
  width: '1515px',
  alignItems: 'center',
  gap: '20px',
  justifyContent: 'flex-end',
  right: '20px',
  bottom: '17px',
}))

const InitiateButton = styled(Button)(({ theme }) => ({
  alignSelf: 'stretch',
  borderRadius: '10px',
  backgroundColor: 'var(--Primary-Color, #652D90)',
  minWidth: '240px',
  gap: '10px',
  overflow: 'hidden',
  padding: '10px 20px',
  color: 'white',
  fontWeight: 500,
  fontSize: '20px',
  textTransform: 'none',
}))

const FormContainer = styled(Box)(({ theme }) => ({
  borderRadius: '10px',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'start',
  padding: '10px 0 0 20px',
}))

const FormTitle = styled(Typography)(({ theme }) => ({
  width: '100%',
  color: 'var(--gray-900, #111827)',
  padding: '20px 40px',
  font: '600 24px/1 Poppins, sans-serif',
}))

const FormContent = styled(Box)(({ theme }) => ({
  alignSelf: 'center',
  zIndex: '0',
  marginTop: '20px',
  width: '800px',
  maxWidth: '100%',
  paddingBottom: '20px',
  flexDirection: 'column',
  alignItems: 'end',
  justifyContent: 'start',
}))

const ErrorText = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.main,
  fontSize: '0.875rem',
  marginTop: '0.25rem',
  paddingLeft: '10px',
}))

export {
  InitiateButton,
  ButtonWrapper,
  ContentContainer,
  Title,
  HeaderContainer,
  FormTeamContainer,
  FormContainer,
  FormTitle,
  FormContent,
  ErrorText,
}

export const CHECKBOX_SX: SxProps = {
  '& .MuiSvgIcon-root': {
    fontSize: 32,
  },
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  margin: '0 auto',
}

export const ERROR_MESSAGE_SX: SxProps = {
  color: 'red',
}
