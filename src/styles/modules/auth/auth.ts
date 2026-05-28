import { styled } from '@mui/material/styles'
import { Box, Typography, Button, Grid2 } from '@mui/material'
import {
  Container as CommonContainer,
  Title as CommonTitle,
} from '../../common'

export const ForgotPasswordStyles = {
    PASSWORD_TYPE_TEXT: 'text',
    PASSWORD_TYPE_PASSWORD: 'password',
    CURSOR_POINTER: 'pointer',
    DISPLAY_FLEX: 'flex',
    ALIGN_ITEMS_CENTER: 'center',
    JUSTIFY_CONTENT_CENTER: 'center',
    WIDTH_18PX: '18px',
    HEIGHT_18PX: '18px',
    COLOR_RED: 'red',
    TEXT_ALIGN_CENTER: 'center',
    MT_1: 1,
    FONT_SIZE_SMALL: 'small',
    HEIGHT_FULL: '100%',
    PADDING_20PX: '20px',
    FONT_WEIGHT_600: 600,
    COLOR_WHITE_OPAQUE: 'rgba(255,255,255,1)',
  }

const PageContainer = styled('div')(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 1)',
  overflow: 'hidden',
  [theme.breakpoints.down('md')]: {
    paddingRight: '20px',
  },
  [theme.breakpoints.down('sm')]: {
    display: 'none',
  },
}))

const ContentWrapper = styled(Grid2)(({ theme }) => ({}))

const RightSection = styled(Grid2)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  lineHeight: 'normal',
  [theme.breakpoints.down('md')]: {
    width: '100%',
  },
}))

const FormContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  marginTop: '40px',
  flexDirection: 'column',
  justifyContent: 'start',
  [theme.breakpoints.down('md')]: {
    maxWidth: '100%',
    marginTop: '40px',
  },
}))

const LogoImage = styled('img')({
  aspectRatio: '3.33',
  objectFit: 'contain',
  objectPosition: 'center',
  width: '300px',
  alignSelf: 'center',
  maxWidth: '100%',
})

const WelcomeContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  lineHeight: 'normal',
  width: '100%',
  [theme.breakpoints.down('md')]: {
    marginLeft: 0,
  },
}))

const WelcomeContent = styled('div')(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 1)',
  display: 'flex',
  flexGrow: '1',
  flexDirection: 'column',
  overflow: 'hidden',
  color: 'rgba(0, 0, 0, 1)',
  justifyContent: 'center',
  width: '100%',
  padding: '232px 80px',
  [theme.breakpoints.down('md')]: {
    maxWidth: '100%',
    marginTop: '40px',
    padding: '100px 20px',
  },
}))

const WelcomeBox = styled('div')(({ theme }) => ({
  borderRadius: '10px',
  backgroundColor: 'rgba(255, 255, 255, 0.15)',
  display: 'flex',
  minHeight: '560px',
  flexDirection: 'column',
  justifyContent: 'start',
  padding: '62px 60px',
  [theme.breakpoints.down('md')]: {
    maxWidth: '100%',
    padding: '0 20px',
  },
}))

const WelcomeTitle = styled(Typography)({
  fontSize: '40px',
  fontWeight: '300',
})

const WelcomeHeadline = styled(Typography)(({ theme }) => ({
  marginTop: '40px',
  font: '700 50px Noto Traditional Nushu, sans-serif',
  [theme.breakpoints.down('md')]: {
    maxWidth: '100%',
    fontSize: '40px',
  },
}))

const WelcomeSubtitle = styled(Typography)({
  color: 'rgba(255, 255, 255, 1)',
  fontSize: '20px',
  fontWeight: '400',
  marginTop: '40px',
})

const FormContent = styled('div')(({ theme }) => ({
  borderRadius: '10px',
  display: 'flex',
  marginTop: '140px',
  width: '100%',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'start',
  padding: '40px 34px',
  [theme.breakpoints.down('md')]: {
    maxWidth: '100%',
    marginTop: '40px',
    padding: '0 20px',
  },
}))

const FormTitle = styled(Typography)(({ theme }) => ({
  color: 'rgba(17, 17, 17, 1)',
  fontSize: '60px',
  fontWeight: '600',
  lineHeight: '147px',
  textAlign: 'center',
  [theme.breakpoints.down('md')]: {
    maxWidth: '100%',
    fontSize: '40px',
    lineHeight: '109px',
  },
}))

const FormSubtitle = styled(Typography)({
  fontWeight: 300,
  fontSize: '16px',
  lineHeight: '39px',
  letterSpacing: '-0.16px',
  color: 'rgba(17,17,17,1)',
})

const FormFields = styled('form')({
  display: 'flex',
  marginTop: '40px',
  width: '450px',
  maxWidth: '100%',
  flexDirection: 'column',
  justifyContent: 'start',
})

const SubmitButton = styled(Button)(({ theme }) => ({
  borderRadius: '10px',
  backgroundColor: 'rgba(101, 45, 144, 1)',
  marginTop: '60px',
  width: '100%',
  fontSize: '20px',
  color: 'rgba(255, 255, 255, 1)',
  fontWeight: '500',
  padding: '10px',
  [theme.breakpoints.down('md')]: {
    marginTop: '40px',
  },
}))

const ForgotContainer = styled(CommonContainer)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}))

const ForgotHeader = styled(Box)(({ theme }) => ({
  borderRadius: '10px',
  display: 'flex',
  width: '100%',
  flexDirection: 'column',
  whiteSpace: 'nowrap',
  justifyContent: 'center',
  paddingTop: '35px',
  paddingLeft: '32px',
  [theme.breakpoints.down('md')]: {
    maxWidth: '100%',
    whiteSpace: 'initial',
  },
}))

const HeaderText = styled(Typography)(({ theme }) => ({
  width: '100%',
  padding: '20px 40px',
  [theme.breakpoints.down('md')]: {
    maxWidth: '100%',
    whiteSpace: 'initial',
    padding: '0 20px',
  },
}))

const SpecificationsSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  marginTop: '20px',
  minHeight: '104px',
  width: '100%',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '7px 0',
  [theme.breakpoints.down('md')]: {
    maxWidth: '100%',
  },
}))

const SpecificationsHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  minHeight: '90px',
  width: '100%',
  alignItems: 'center',
  gap: '40px 100px',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  padding: '20px 40px',
  [theme.breakpoints.down('md')]: {
    maxWidth: '100%',
    padding: '0 20px',
  },
}))

const SpecificationsTitle = styled(CommonTitle)(({ theme }) => ({
  color: '#000000',
  alignSelf: 'stretch',
  margin: 'auto 0',
}))

const SpecificationsActions = styled(Box)(({ theme }) => ({
  alignSelf: 'stretch',
  display: 'flex',
  minWidth: '240px',
  height: '50px',
  alignItems: 'center',
  gap: '20px',
  fontSize: '20px',
  color: '#000001',
  fontWeight: '500',
  textAlign: 'center',
  justifyContent: 'center',
  flexWrap: 'wrap',
  width: '644px',
  margin: 'auto 0',
  [theme.breakpoints.down('md')]: {
    maxWidth: '100%',
  },
}))

export {
  PageContainer,
  ContentWrapper,
  RightSection,
  FormContainer,
  LogoImage,
  WelcomeContainer,
  WelcomeContent,
  WelcomeBox,
  WelcomeTitle,
  WelcomeHeadline,
  WelcomeSubtitle,
  FormContent,
  FormTitle,
  FormSubtitle,
  FormFields,
  SubmitButton,
  ForgotContainer,
  ForgotHeader,
  HeaderText,
  SpecificationsSection,
  SpecificationsHeader,
  SpecificationsTitle,
  SpecificationsActions,
}
