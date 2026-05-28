import {
  styled,
  Box,
  TextField,
  Button,
  Typography,
  Checkbox,
  SxProps, 
  Theme,
} from '@mui/material'
import Image from 'next/image'
import { ForgotPasswordStyles } from './auth'

// Inline styles moved to the top
export const InlineStyles = {
  sectionContainer: {
    height: ForgotPasswordStyles.HEIGHT_FULL,
    padding: ForgotPasswordStyles.PADDING_20PX,
  },
  subtitleSpan: {
    fontWeight: ForgotPasswordStyles.FONT_WEIGHT_600,
    color: ForgotPasswordStyles.COLOR_WHITE_OPAQUE,
  },
  subtitleSpanBold: {
    fontWeight: ForgotPasswordStyles.FONT_WEIGHT_600,
  },
}
export const LoginContainer = styled(Box)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 1)',

  height: '100vh',
  overflow: 'auto',
  '@media (max-width: 991px)': {
    paddingRight: '20px',
  },
}))

export const WelcomeSectionContainer = styled(Box)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 1)',
  display: 'flex',
  flexGrow: 1,
  paddingLeft: '80px',
  paddingRight: '80px',
  flexDirection: 'column',
  overflow: 'hidden',
  alignItems: 'stretch',
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
  color: 'rgba(0, 0, 0, 1)',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
  backgroundImage:
    'url(/images/image.png)',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
    marginTop: '40px',
    paddingLeft: '20px',
    paddingRight: '20px',
    paddingTop: '100px',
    paddingBottom: '100px',
  },
}))

export const WelcomeContentBox = styled(Box)(({ theme }) => ({
  borderRadius: '10px',
  backgroundColor: 'rgba(255, 255, 255, 0.15)',

  paddingLeft: '60px',
  paddingRight: '60px',
  paddingTop: '62px',
  paddingBottom: '62px',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
    paddingLeft: '20px',
    paddingRight: '20px',
  },
}))

export const WelcomeTitle = styled(Typography)(({ theme }) => ({
  fontSize: '40px',
  fontWeight: '300',
}))

export const WelcomeSubtitle = styled(Typography)(({ theme }) => ({
  fontSize: '50px',
  fontFamily:
    'Noto Traditional Nushu, -apple-system, Roboto, Helvetica, sans-serif',
  fontWeight: '700',
  lineHeight: '1.3',
  marginTop: '40px',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
    fontSize: '40px',
  },
}))

export const WelcomeDescription = styled(Typography)(({ theme }) => ({
  color: 'rgba(255, 255, 255, 1)',
  fontSize: '20px',
  fontWeight: '400',
  marginTop: '40px',
}))

export const LoginFormContainer = styled(Box)(({ theme }) => ({
  display: 'flex',

  flexDirection: 'column',

  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
  justifyContent: 'center',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
    marginTop: '40px',
  },
}))

export const LogoImage = styled(Image)(({ theme }) => ({
  // aspectRatio: '3.33',
  objectFit: 'contain',
  objectPosition: 'center',
  alignSelf: 'center',
  maxWidth: '100%',
  marginTop: '10px',
}))

export const FormContainer = styled(Box)(({ theme }) => ({
  borderRadius: '10px',
  display: 'flex',

  width: '100%',

  paddingTop: '40px',
  paddingBottom: '40px',
  flexDirection: 'column',
  alignItems: 'stretch',
  justifyContent: 'start',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
    paddingLeft: '20px',
    paddingRight: '20px',
    marginTop: '40px',
  },
}))

export const LoginTitle = styled(Typography)(({ theme }) => ({
  color: 'rgba(17, 17, 17, 1)',
  fontSize: '50px',
  fontWeight: '600',
  textAlign: 'center',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
    fontSize: '40px',
  },
}))

export const FormWrapper = styled(Box)(({ theme }) => ({
  alignSelf: 'center',
  marginTop: '40px',
  width: '100%',
  maxWidth: '450px',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
  },
}))

export const InputContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
  },
}))

export const InputLabel = styled(Typography)(({ theme }) => ({
  color: 'rgba(17, 17, 17, 1)',
  fontSize: '18px',
  fontWeight: '500',
}))

export const StyledTextField = styled(TextField)(({ theme }) => ({
  width: '100%',
  marginTop: '10px',
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px',
    '& fieldset': {
      borderColor: 'rgba(181, 181, 181, 1)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(181, 181, 181, 1)',
    },
  },
  '& .MuiInputBase-input': {
    padding: '15px 20px',
    fontSize: '16px',
    color: 'rgba(160, 160, 160, 1)',
    fontWeight: '300',
  },
  '@media (max-width: 991px)': {
    maxWidth: '100%',
  },
}))

export const PasswordContainer = styled(Box)(({ theme }) => ({
  marginTop: '20px',
  width: '100%',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
  },
}))

export const PasswordInputContainer = styled(Box)(({ theme }) => ({
  marginTop: '10px',
  width: '100%',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
  },
}))

export const PasswordInputWrapper = styled(Box)(({ theme }) => ({
  borderRadius: '10px',
  borderColor: 'rgba(160, 160, 160, 1)',
  borderStyle: 'solid',
  borderWidth: '1px',
  display: 'flex',
  width: '100%',
  padding: '15px 20px',
  alignItems: 'center',
  gap: '40px 100px',
  fontSize: '16px',
  color: 'rgba(160, 160, 160, 1)',
  fontWeight: '300',
  justifyContent: 'space-between',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
  },
}))

export const PasswordPlaceholder = styled(Typography)(({ theme }) => ({
  alignSelf: 'stretch',
  marginTop: 'auto',
  marginBottom: 'auto',
  color: 'rgba(160, 160, 160, 1)',
  fontSize: '16px',
  fontWeight: '300',
}))

export const PasswordVisibilityIcon = styled(Box)(({ theme }) => ({
  alignSelf: 'stretch',
  display: 'flex',
  marginTop: 'auto',
  marginBottom: 'auto',
  width: '18px',
  flexShrink: '0',
  height: '18px',
}))

export const RememberForgotContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  marginTop: '10px',
  width: '100%',
  paddingLeft: '10px',
  paddingRight: '10px',
  alignItems: 'center',
  gap: '40px 100px',
  fontSize: '12px',
  justifyContent: 'space-between',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
  },
}))

export const RememberMeContainer = styled(Box)(({ theme }) => ({
  alignSelf: 'stretch',
  display: 'flex',
  marginTop: 'auto',
  marginBottom: 'auto',
  alignItems: 'center',
  gap: '5px',
  color: 'rgba(85, 85, 85, 1)',
  fontWeight: '400',
  justifyContent: 'start',
}))

export const RememberMeCheckbox = styled(Checkbox)(({ theme }) => ({
  padding: 0,
  marginRight: '5px',
  '& .MuiSvgIcon-root': {
    fontSize: '15px',
  },
}))

export const RememberMeText = styled(Typography)(({ theme }) => ({
  alignSelf: 'stretch',
  marginTop: 'auto',
  marginBottom: 'auto',
  fontSize: '12px',
}))

export const ForgotPasswordText = styled(Typography)(({ theme }) => ({
  color: 'rgba(240, 0, 36, 1)',
  fontWeight: '300',
  alignSelf: 'stretch',
  marginTop: 'auto',
  marginBottom: 'auto',
  fontSize: '12px',
  cursor: 'pointer',
}))

export const LoginButton = styled(Button)(({ theme }) => ({
  alignSelf: 'stretch',
  borderRadius: '10px',
  marginTop: '60px',
  width: '100%',
  padding: '10px',
  gap: '10px',
  fontSize: '20px',
  fontWeight: '500',
}))

export const ErrorMessage = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.main,
  fontSize: '12px',
  marginTop: '5px',
  fontWeight: '400',
}))

export const fromLayer: SxProps<Theme> = {
  '@media (max-width: 991px)': {
  margin: '0 auto',
  },
};

export const H100 ={ height: '100%' }