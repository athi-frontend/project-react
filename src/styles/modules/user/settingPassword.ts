import { styled, Box, Typography } from '@mui/material'

export const CreatePasswordContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.background.paper,
  alignItems: 'center',
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
  justifyContent: 'space-between',
  height: '100%',
  width: '100%',
  padding: '10px',
}))

export const LogoImage = styled('img')(({ theme }) => ({
  aspectRatio: '3.33',
  objectFit: 'contain',
  objectPosition: 'center',
  width: '150px',
  maxWidth: '100%',
}))

export const FormTitle = styled(Typography)(({ theme }) => ({
  color: 'rgba(17, 17, 17, 1)',
  fontSize: '30px',
  fontWeight: '600',
  textAlign: 'center',
  marginTop: '10px',
  marginBottom: '10px',
  width: '100%',
  '@media (max-width: 991px)': {
    fontSize: '24px',
  },
}))

export const FormContainer = styled(Box)(({ theme }) => ({
  borderRadius: '10px',
  display: 'flex',
  marginTop: '10px',
  width: '100%',
  padding: '10px',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  flexGrow: 1,
  maxHeight: '70vh',
  overflow: 'hidden',
  '@media (max-width: 991px)': {
    padding: '5px',
  },
}))

export const FormWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  maxWidth: '400px',
  flexDirection: 'column',
  alignItems: 'stretch',
  justifyContent: 'center',
  gap: '8px',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
  },
}))

export const PasswordPoliciesContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  marginTop: '8px',
  width: '289px',
  maxWidth: '100%',
  flexDirection: 'column',
  alignItems: 'stretch',
  color: 'rgba(51, 51, 51, 1)',
  justifyContent: 'center',
}))

export const PasswordPoliciesTitle = styled(Typography)(({ theme }) => ({
  alignSelf: 'stretch',
  width: '100%',
  fontSize: '14px',
  fontWeight: '500',
}))

export const PolicyItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  marginTop: '4px',
  alignItems: 'center',
  gap: '8px',
  justifyContent: 'start',
  '&:first-of-type': {
    marginTop: '8px',
  },
}))

export const PolicyIcon = styled('img')(({ theme }) => ({
  aspectRatio: '1',
  objectFit: 'contain',
  objectPosition: 'center',
  width: '12px',
  alignSelf: 'stretch',
  marginTop: 'auto',
  marginBottom: 'auto',
  flexShrink: '0',
}))

export const PolicyText = styled(Typography)(({ theme }) => ({
  alignSelf: 'stretch',
  marginTop: 'auto',
  marginBottom: 'auto',
  fontSize: '12px',
  fontWeight: '400',
}))

export const VisibilityIconContainer = styled(Box)({
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '18px',
  height: '18px',
})

export const ErrorMessage = styled(Box)(() => ({
  color: 'red',
  textAlign: 'center',
  marginTop: '8px',
}))

export const FullScreenNotFoundContainer = styled(Box)(() => ({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  zIndex: 9999,
}))
