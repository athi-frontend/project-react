import { styled, Box } from '@mui/material'

export const GridStyle = {
  height: '420px',
  overflow: 'auto',
  scrollbarWidth: 'none',
}

export const FullWidthGridStyle = {
  width: '100%',
}
export const ModalContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '900px',
  maxWidth: '95%',
  maxHeight: '90vh',
  backgroundColor: 'white',
  borderRadius: '10px',
  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
}))

export const ModalHeader = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  borderBottom: '1px solid #E5E7EB',
}))

export const ModalContent = styled(Box)(({ theme }) => ({
  padding: '20px',
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  justifyContent: 'start',
}))

export const TitleSection = styled(Box)(({ theme }) => ({
  width: '100%',
  paddingLeft: '40px',
  paddingRight: '40px',
  paddingTop: '20px',
  paddingBottom: '20px',
  fontSize: '24px',
  color: '#111827',
  fontWeight: '600',
  lineHeight: '1',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
    paddingLeft: '20px',
    paddingRight: '20px',
  },
}))

export const FormContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  maxWidth: '800px',
  margin: '0 auto',
  paddingBottom: '20px',
  flexDirection: 'column',
  alignItems: 'end',
  justifyContent: 'end',
}))

export const FormFields = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  flexDirection: 'column',
  alignItems: 'center',
  fontWeight: '400',
  justifyContent: 'start',
}))

export const TypeOfStageContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  marginTop: '20px',
  width: '100%',
  paddingRight: '80px',
  paddingTop: '2px',
  paddingBottom: '2px',
  flexDirection: 'column',
  alignItems: 'start',
  '@media (max-width: 991px)': {
    paddingRight: '20px',
  },
}))

export const StageTypeLabel = styled(Box)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontSize: '18px',
}))

export const StageTypePlaceholder = styled(Box)(({ theme }) => ({
  color: '#999',
  fontSize: '16px',
  marginTop: '10px',
  marginBottom:"10px"
}))

export const IconButtonStyle = styled(Box)(({ theme }) => ({
  position: 'absolute',
  right: '20px',
  top: '20px',
  width: '30px',
  height: '30px',
}))
export const InputTypeStyle = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '15px',
  marginBottom: '20px',
  width: '100%',
}))
export const ProjectIcon = styled(Box)(({ theme }) => ({
  position: 'absolute',
  right: '20px',
  top: '20px',
  color: '#111827',
}))
export const InputStyle = styled(Box)(({ theme }) => ({
  marginTop: '20px',
  width: '100%',
}))

export const FormContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
  justifyContent: 'start',
}))

export const ButtonContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  marginTop: '253px',
  minHeight: '50px',
  alignItems: 'center',
  gap: '20px',
  fontSize: '20px',
  fontWeight: '500',
  whiteSpace: 'nowrap',
  textAlign: 'center',
  justifyContent: 'start',
  '@media (max-width: 991px)': {
    marginTop: '40px',
    whiteSpace: 'initial',
  },
}))
