import { styled } from '@mui/material/styles'
import { Box } from '@mui/material'

export const DialogContainer = styled(Box)(({ theme }) => ({
  borderRadius: '10px',
  backgroundColor: theme.palette.background.paper,
  position: 'relative',
  paddingTop: '20px',
  paddingBottom: '20px',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  maxWidth: '800px',
  margin: '0 auto',
}))

export const TitleContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  paddingLeft: '40px',
  paddingRight: '40px',
  paddingTop: '20px',
  paddingBottom: '20px',
  position: 'relative',
  '& .modal-close': {
    position: 'absolute',
    right: '20px',
    top: '20px',
  },
  '@media (max-width: 991px)': {
    paddingLeft: '20px',
    paddingRight: '20px',
  },
}))

export const TitleSection = styled(Box)(({ theme }) => ({
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
  fontSize: '24px',
  color: theme.palette.text.primary,
  fontWeight: '600',
  lineHeight: '1',
}))

export const ContentWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  flexDirection: 'column',
  alignItems: 'stretch',
  justifyContent: 'start',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
  },
}))

export const FormContainer = styled(Box)(({ theme }) => ({
  alignSelf: 'center',
  display: 'flex',
  marginTop: '40px',
  width: '800px',
  maxWidth: '100%',
  paddingBottom: '20px',
  flexDirection: 'column',
  alignItems: 'end',
  justifyContent: 'end',
}))

export const FormSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'start',
}))

export const RadioGroupContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: '800px',
  marginTop: '20px',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
  },
}))

export const RadioOptionsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  marginTop: '10px',
  width: '100%',
  paddingLeft: '20px',
  paddingRight: '20px',
  alignItems: 'start',
  gap: '40px',
  justifyContent: 'start',
  flexWrap: 'wrap',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
  },
}))

export const RadioOption = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '20px',
  justifyContent: 'start',
}))

export const RadioButton = styled(Box)(({ theme }) => ({
  alignSelf: 'stretch',
  marginTop: 'auto',
  marginBottom: 'auto',
  width: '40px',
  '& > div': {
    strokeWidth: '2px',
    borderColor: 'rgba(153, 153, 153, 1)',
    borderStyle: 'solid',
    borderWidth: '2px',
    borderRadius: '50%',
    display: 'flex',
    flexShrink: '0',
    height: '40px',
  },
}))

export const RadioLabel = styled(Box)(({ theme }) => ({
  color: '#999',
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
  fontSize: '18px',
  fontWeight: '400',
  alignSelf: 'stretch',
  marginTop: 'auto',
  marginBottom: 'auto',
}))

export const ButtonContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  marginTop: '40px',
  minHeight: '50px',
  alignItems: 'center',
  gap: '20px',
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
  fontSize: '20px',
  fontWeight: '500',
  whiteSpace: 'nowrap',
  textAlign: 'center',
  justifyContent: 'start',
  '@media (max-width: 991px)': {
    whiteSpace: 'initial',
  },
}))

export const SecondaryButton = styled(Box)(({ theme }) => ({
  alignSelf: 'stretch',
  display: 'flex',
  marginTop: 'auto',
  marginBottom: 'auto',
  minHeight: '50px',
  alignItems: 'start',
  color: '#652D90',
  justifyContent: 'start',
  width: '120px',
  '& > div': {
    alignSelf: 'stretch',
    width: '120px',
    borderRadius: '10px',
    border: '1px solid var(--Primary-Color, #652D90)',
    paddingLeft: '20px',
    paddingRight: '20px',
    paddingTop: '10px',
    paddingBottom: '10px',
    gap: '10px',
    overflow: 'hidden',
  },
  '@media (max-width: 991px)': {
    whiteSpace: 'initial',
  },
}))

export const PrimaryButton = styled(Box)(({ theme }) => ({
  alignSelf: 'stretch',
  width: '120px',
  borderRadius: '10px',
  backgroundColor: '#652D90',
  marginTop: 'auto',
  marginBottom: 'auto',
  minHeight: '50px',
  paddingLeft: '20px',
  paddingRight: '20px',
  paddingTop: '10px',
  paddingBottom: '10px',
  gap: '10px',
  overflow: 'hidden',
  color: 'rgba(255, 255, 255, 1)',
  '@media (max-width: 991px)': {
    whiteSpace: 'initial',
  },
}))
