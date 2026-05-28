import { styled, Box, Typography, CSSObject } from '@mui/material'

const fullWidthColumn: CSSObject = {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
}

export const STYLES = {
  BOX: { padding: '10px 40px', width: '100%' },
  CONTAINER: { padding: '20px 0px' },
  GRID: {
    SIZE: 6,
    SPACING: 1,
  },
}

export const REVIEWTABLESTYLES = { width: '100%' }
export const INPUTCONST = {
  TEXTSTYLE: {
    paddingTop: '5px',
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#ccc',
      },
    },
  },
  VARIANT: 'outlined',
  SIZE: 'small',
}

// New inline styles extracted from PndForm component
export const PND_FORM_STYLES = {
  MAIN_CONTAINER: { padding: '20px 20px' },
  SPECIFICATIONS_SECTION: { 
    margin: 'auto', 
    paddingLeft: '20px' 
  },
  SPECIFICATIONS_ACTIONS: { 
    marginBottom: '20px' 
  },
  SPECIFICATIONS_TABLE: { 
    padding: '0px 20px' 
  },
  MODEL_SECTION: { 
    paddingTop: '40px', 
    paddingLeft: '20px' 
  },
  MODEL_ACTIONS: { 
    padding: '0px 20px' 
  },
  MODEL_TABLE: { 
    padding: '0px 20px' 
  },
  FILE_UPLOAD_SECTION: { 
    padding: '0 20px' 
  },
  BUTTON_SECTION: { 
    padding: '0px 20px' 
  },
  SPECIFICATIONS_CONTAINER: { 
    padding: '20px 0px' 
  },
  UPLOAD_ERROR: { 
    marginBottom: '20px' 
  },
  MODEL_CONTAINER: { 
    padding: '0px 0px' 
  },
}

export const GRID_SIZES = {
  SIX: 6,
  TWELVE: 12,
}

const responsiveFullWidth = (theme: any) => ({
  [theme.breakpoints.down('md')]: {
    maxWidth: '100%',
  },
})

const Container = styled(Box)(({ theme }) => ({
  ...fullWidthColumn,
  justifyContent: 'start',
}))

const Header = styled(Box)(({ theme }) => ({
  ...fullWidthColumn,
  borderRadius: '10px',

  whiteSpace: 'nowrap',
  justifyContent: 'center',
  padding: '20px 0',
  font: '600 24px/1 Poppins, sans-serif',
  ...responsiveFullWidth(theme),
  [theme.breakpoints.down('md')]: {
    whiteSpace: 'initial',
  },
}))

const HeaderText = styled(Typography)(({ theme }) => ({
  width: '100%',
  padding: '20px 40px',
  ...responsiveFullWidth(theme),
  [theme.breakpoints.down('md')]: {
    whiteSpace: 'initial',
    padding: '0 20px',
  },
}))

const FormContainer = styled(Box)(({ theme }) => ({
  ...fullWidthColumn,
  borderRadius: '0px 0px 10px 10px',

  paddingBottom: '20px',
  justifyContent: 'start',
  ...responsiveFullWidth(theme),
}))

const SpecificationsSection = styled(Box)(({ theme }) => ({
  ...fullWidthColumn,
  marginTop: '20px',
  minHeight: '104px',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '7px 0',
  ...responsiveFullWidth(theme),
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
  ...responsiveFullWidth(theme),
  [theme.breakpoints.down('md')]: {
    padding: '0 20px',
  },
}))

const SpecificationsTitle = styled(Typography)(() => ({
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '1',
  alignSelf: 'stretch',
  margin: 'auto 0',
  paddingTop: '16px'
}))

const SpecificationsActions = styled(Box)(({ theme }) => ({
  alignSelf: 'stretch',
  display: 'flex',
  minWidth: '240px',
  height: '50px',
  alignItems: 'center',
  gap: '20px',
  fontSize: '20px',

  fontWeight: '500',
  textAlign: 'center',
  justifyContent: 'center',
  flexWrap: 'wrap',
  width: '644px',
  margin: 'auto 0',
  ...responsiveFullWidth(theme),
}))

const sharedFlexColumn: CSSObject = {
  display: 'flex',
  flexDirection: 'column',
}

export const ModalContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[24],
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  ...sharedFlexColumn,
  justifyContent: 'center',
}))

export const Title = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}))

export const Form = styled('form')(({ theme }) => ({
  ...sharedFlexColumn,
  gap: theme.spacing(1),
}))

export const ButtonContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: theme.spacing(2),
  marginTop: theme.spacing(2),
}))

export {
  Container,
  Header,
  HeaderText,
  FormContainer,
  SpecificationsSection,
  SpecificationsHeader,
  SpecificationsTitle,
  SpecificationsActions,
}
