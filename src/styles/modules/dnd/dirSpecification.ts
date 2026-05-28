import { styled } from '@mui/material/styles'
import { Box, Typography, IconButton } from '@mui/material'

/**
 Classification : Confidential
**/

export const DIRContainer = styled(Box)(({ theme }) => ({
  alignItems: 'center',
  borderRadius: '10px',
  border: '1px solid #D8D8D8',
  backgroundColor: theme.palette.background.paper,
  display: 'flex',
  padding: '14px 20px',
  gap: '10px',
  fontFamily: 'Poppins, sans-serif',
  fontSize: '14px',
  color: theme.palette.primary.main,
  fontWeight: '500',
  lineHeight: '20px',
  justifyContent: 'space-between',
  width: '410px',
}))
export const TextStep = styled(Typography)(({ theme }) => ({
  fontFamily: 'Poppins, sans-serif',
  fontSize: '14px',
  color: theme.palette.primary.main,
}))
export const PaginationContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flex: 1,
})
export const StepContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  cursor: 'pointer',
  marginLeft: '15px',
  marginRight: 'auto',
})
export const ArrowButton = styled(IconButton)({
  color: 'rgba(101, 45, 144, 1)',
  backgroundColor: '#dcafff',
  borderRadius: '5px',
  padding: '5px',
  '&:hover': {
    backgroundColor: '#dcafff',
  },
  '&.Mui-disabled': {
    color: 'rgba(0, 0, 0, 0.26)',
    backgroundColor: 'rgba(0, 0, 0, 0.12)',
  },
})
export const ModalOverFlow = {
  height: '450px',
  overflow: 'auto',
  scrollbarWidth: 'none',
}

export const ModalWrapper = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '100%',
  maxWidth: '960px',
  maxHeight: '90vh',
  backgroundColor: theme.palette.background.paper,
  borderRadius: '10px',
  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
  padding: '0',
  overflow: 'auto',
  outline: 'none',
}))

export const PerformanceSpecificationContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  justifyContent: 'start',
  width: '100%',
}))

export const PerformanceSpecificationTitle = styled(Typography)(
  ({ theme }) => ({
    width: '100%',
    marginLeft: '40px',
    Right: '40px',
    paddingTop: '20px',
    paddingBottom: '20px',
    fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
    fontSize: '24px',
    color: '#111827',
    fontWeight: '600',
    lineHeight: '1',
    borderBottom: '1px solid #f0f0f0',
    '@media (max-width: 991px)': {
      maxWidth: '100%',
      paddingLeft: '20px',
      paddingRight: '20px',
    },
  })
)

export const FormContainer = styled(Box)({
  alignSelf: 'center',
  display: 'flex',
  width: '800px',
  maxWidth: '100%',
  flexDirection: 'column',
  alignItems: 'end',
  justifyContent: 'end',
})

export const FormContent = styled(Box)({
  display: 'flex',
  width: '100%',
  maxWidth: '800px',
  flexDirection: 'column',
  alignItems: 'stretch',
  justifyContent: 'center',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
  },
})

export const RichTextToolbar = styled(Box)(({ theme }) => ({
  position: 'absolute',
  zIndex: '0',
  width: '100%',
  right: '1px',
  top: '38px',
}))

export const RichTextToolbarImage = styled('img')(({ theme }) => ({
  aspectRatio: '10',
  objectFit: 'contain',
  objectPosition: 'center',
  width: '100%',
  minHeight: '80px',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
  },
}))

export const CloseCircle = styled('img')({
  aspectRatio: '1',
  objectFit: 'contain',
  objectPosition: 'center',
  width: '24px',
  alignSelf: 'start',
  position: 'absolute',
  zIndex: '0',
  right: '20px',
  top: '20px',
  height: '24px',
  cursor: 'pointer',
})

export const CloseIconWrapper = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '20px',
  right: '15px',
  cursor: 'pointer',
  zIndex: 1,
}))

export const contentBoxStyle = {
  marginTop: '10px',
  width: '800px',
}

export const buttonSectionStyles = {
  display: 'flex',
  justifyContent: 'flex-end',
  width: '100%',
  paddingRight: '40px',
}

export const titleSectionStyles = {
  marginRight: '40px',
}

export const grid2SectionStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'end',
  paddingRight: '40px',
  paddingBottom: '20px',
}
export const gridMarginStyles = {
  margin: 'auto',
}

export const COLUMN_WIDTHS = {
  SNO: 120,
  PARAMETER: 300,
  UNIT: 250,
  VALUE: 200,
  ACTIONS: 180,
}
export const pageLayerStyles = {
  width: '100%',
}
export const regulationStyles = {
  paddingLeft: '40px',
  paddingRight: '40px',
  width: '100%',
}

export const gridSectionStyles = {
  paddingLeft: '40px',
  paddingTop: '20px',
}

