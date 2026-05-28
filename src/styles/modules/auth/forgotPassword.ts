import { styled } from '@mui/system'
import { Grid2, Typography, Button } from '@mui/material'

export const PageContainer = styled('div')(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 1)',

  overflow: 'hidden',
  [theme.breakpoints.down('md')]: {
    paddingRight: '20px',
  },
  [theme.breakpoints.down('sm')]: {
    display: 'none',
  },
}))

export const ContentWrapper = styled(Grid2)(({ theme }) => ({}))

export const RightSection = styled(Grid2)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  lineHeight: 'normal',
  [theme.breakpoints.down('md')]: {
    width: '100%',
  },
}))

export const FormContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  marginTop: '80px',
  flexDirection: 'column',
  fontFamily: 'Poppins, sans-serif',
  justifyContent: 'start',
  [theme.breakpoints.down('md')]: {
    maxWidth: '100%',
    marginTop: '40px',
  },
}))

export const LogoImage = styled('img')({
  aspectRatio: '3.33',
  objectFit: 'contain',
  objectPosition: 'center',
  width: '300px',
  alignSelf: 'center',
  maxWidth: '100%',
})

export const WelcomeContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  lineHeight: 'normal',
  width: '100%',
  [theme.breakpoints.down('md')]: {
    marginLeft: 0,
  },
}))

export const WelcomeContent = styled('div')(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 1)',
  display: 'flex',
  flexGrow: '1',
  flexDirection: 'column',
  overflow: 'hidden',
  fontFamily: 'Poppins, sans-serif',
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

export const WelcomeBox = styled('div')(({ theme }) => ({
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

export const WelcomeTitle = styled(Typography)({
  fontSize: '40px',
  fontWeight: '300',
})

export const WelcomeHeadline = styled(Typography)(({ theme }) => ({
  marginTop: '40px',
  font: '700 50px Noto Traditional Nushu, sans-serif',
  [theme.breakpoints.down('md')]: {
    maxWidth: '100%',
    fontSize: '40px',
  },
}))

export const WelcomeSubtitle = styled(Typography)({
  color: 'rgba(255, 255, 255, 1)',
  fontSize: '20px',
  fontWeight: '400',
  marginTop: '40px',
})

export const FormContent = styled('div')(({ theme }) => ({
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

export const FormTitle = styled(Typography)(({ theme }) => ({
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

export const FormSubtitle = styled(Typography)({
  fontWeight: 300,
  fontSize: '16px',
  lineHeight: '39px',
  letterSpacing: '-0.16px',
  color: 'rgba(17,17,17,1)',
})

export const FormFields = styled('form')({
  display: 'flex',
  marginTop: '40px',
  width: '450px',
  maxWidth: '100%',
  flexDirection: 'column',
  justifyContent: 'start',
})

export const SubmitButton = styled(Button)(({ theme }) => ({
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
