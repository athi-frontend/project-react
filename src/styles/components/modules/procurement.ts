import {
  Box,
  Radio,
  Typography,
  TextField,
  Button,
  TextareaAutosize,
  Autocomplete,
  IconButton,
} from '@mui/material'
import { styled, SxProps, Theme } from '@mui/material/styles'

const commonBoxResponsive = (theme: any) => ({
  [theme.breakpoints.down('md')]: {
    maxWidth: '100%',
  },
})

export const reviewTextStyle: SxProps<Theme> = {
  color: 'rgba(34, 34, 34, 1)',
  fontSize: '18px',
}
export const reviewLabelStyle: SxProps<Theme> = {
  color: '#999',
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
  fontSize: '17px',
  fontWeight: '400',
}
export const largeCheckboxStyle: SxProps<Theme> = {
  '& .MuiSvgIcon-root': { fontSize: 38 },
  padding: '8px',
}

const baseInputStyle = {
  borderRadius: '10px',
  border: '1px solid var(--Text-Disable, #999)',
  marginTop: '10px',
  width: '100%',
  fontSize: '16px',
  backgroundColor: '#fff',
  color: '#555',
  padding: '18px 20px',
  '&:focus': {
    outline: 'none',
  },
}

const IconWrapper = styled(IconButton)({
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

const StepContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  justifyContent: 'start',
  flexDirection: 'row',
})

const CustomRadio = styled(Radio)({
  '&.MuiRadio-root': {
    width: '40px',
    height: '50px',
    padding: '10px',
  },
  '& .MuiSvgIcon-root': {
    fontSize: '40px',
    color: 'rgba(153, 153, 153, 1)',
  },
  '&.Mui-checked .MuiSvgIcon-root': {
    color: 'rgb(75, 64, 161)',
  },
})

const StepLabel = styled(Typography)({
  color: '#999999',
  alignSelf: 'stretch',
  flexDirection: 'row',
  margin: 'auto 0',
  font: '400 18px Poppins, sans-serif',
})

const Container = styled(Box)(({ theme }) => ({
  borderRadius: '10px',
  backgroundColor: '#fff',
  position: 'relative',
  display: 'flex',
  maxWidth: '700px',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '30px 20px',
  [theme.breakpoints.down('md')]: {
    padding: '0 20px',
  },
}))

const ContentWrapper = styled(Box)({
  zIndex: 0,
  display: 'flex',
  width: '100%',
  flexDirection: 'column',
  justifyContent: 'start',
  marginTop: '40px' 
})

const StepsContainer = styled(Box)(({ theme }) => ({
  minHeight: '40px',
  width: '100%',
  flexDirection: 'row',
  justifyContent: 'start',
  paddingRight: '30px',
  fontSize: '17px',
  ...commonBoxResponsive(theme),
}))

const StepsWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  alignItems: 'start',
  gap: '20px',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  ...commonBoxResponsive(theme),
}))

const CommentSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  marginTop: '20px',
  width: '100%',

  flexDirection: 'column',
  justifyContent: 'start',
  ...commonBoxResponsive(theme),
}))

const CommentLabel = styled(Typography)(({ theme }) => ({
  color: '#000',
  ...commonBoxResponsive(theme),
}))

const CommentInput = styled(TextField)({
  ...baseInputStyle,
  '& .MuiOutlinedInput-root': {
    padding: 0,
    '& fieldset': {
      border: 'none',
    },
  },
  '& textarea::placeholder': {
    color: '#888',
    opacity: 1,
  },
  '& textarea': {
    color: '#555',
  },
})

const SaveButton = styled(Button)(({ theme }) => ({
  zIndex: 0,
  display: 'flex',
  marginTop: '20px',
  width: '120px',
  maxWidth: '100%',
  color: '#fff',
  textTransform: 'none',
  whiteSpace: 'nowrap',
  fontWeight: 500,
  fontSize: '20px',
  fontFamily: 'Poppins, sans-serif',
  borderRadius: '10px',
  backgroundColor: theme.palette.primary.main,
  padding: '10px 20px',
  '&:disabled': {
    backgroundColor: theme.palette.action.disabledBackground,
    color: theme.palette.action.disabled,
  },
  [theme.breakpoints.down('md')]: {
    whiteSpace: 'initial',
  },
}))

const FormContainer = styled(Box)(({ theme }) => ({
  borderRadius: '10px',
  backgroundColor: theme.palette.background.paper,
  position: 'relative',
  display: 'flex',
  maxWidth: '600px',
  flexDirection: 'column',
  alignItems: 'center',
  fontFamily: 'Poppins, sans-serif',
  fontWeight: '400',
  justifyContent: 'center',
  padding: '39px 40px',
  [theme.breakpoints.down('md')]: {
    padding: '20px 20px',
  },
}))

const ModalStyle = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  boxShadow: 24,
}

const CommentWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  flexDirection: 'column',
  justifyContent: 'start',
  ...commonBoxResponsive(theme),
}))

const StyledCommentBox = styled(TextareaAutosize)({
  ...baseInputStyle,
  minHeight: '231px',
  '& textarea::placeholder': {
    color: '#888',
    opacity: 1,
  },
  '& textarea': {
    color: '#555',
  },
})

const ModalContainer = styled(Box)(({ theme }) =>({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '100%',
  maxWidth: '600px',
  backgroundColor:theme.palette.background.paper ,
  borderRadius: '10px',
  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
  outline: 'none',
}))

const SelectWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  flexDirection: 'column',
  justifyContent: 'start',
  ...commonBoxResponsive(theme),
}))

const StyledAutocomplete = styled(Autocomplete)({
  backgroundColor: '#fff',
  marginTop: '10px',
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px',
    border: '1px solid var(--Text-Disable, #999)',
    padding: '18px 20px',
    backgroundColor: '#fff',
    '& fieldset': {
      border: 'none',
    },
  },
  '& .MuiAutocomplete-popper': {
    zIndex: 1300,
  },
  '& .MuiPaper-root': {
    backgroundColor: '#fff',
  },
  '& .MuiAutocomplete-listbox': {
    backgroundColor: '#fff',
    color: '#000',
  },
})

const StyledTextField = styled(TextField)({
  backgroundColor: '#fff',
  '& input::placeholder': {
    color: '#888',
    opacity: 1,
  },
  '& input': {
    color: '#555',
  },
})

const TitleSection = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: '600px',
  marginBottom: '20px',
  [theme.breakpoints.down('md')]: {
    maxWidth: '100%',
  },
}))

const CheckboxesContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  maxWidth: '600px',
  justifyContent: 'space-between',
  marginBottom: '20px',
  flexWrap: 'wrap',
  gap: '20px',
  [theme.breakpoints.down('md')]: {
    maxWidth: '100%',
  },
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
}))

const CheckboxGroup = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  [theme.breakpoints.down('sm')]: {
    width: '100%',
  },
}))

const CommentsHistoryScroll = styled(Box)(({ theme }) => ({
  height: '250px',
  overflow: 'hidden',
  overflowY: 'scroll',
  scrollbarWidth: 'none',
  border: '1px solid grey',
  borderRadius: '10px',
}))

const CommentDescriptionContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.text.main,
  borderRadius: '8px',
  padding: '12px 16px',
  marginTop: '8px',
  '& .MuiInputBase-root': {
    backgroundColor: 'transparent',
    border: 'none',
    '& fieldset': {
      border: 'none',
    },
  },
}))

const CommentItemContainer = styled(Box)(({ theme }) => ({
  padding: '15px',
}))

const CommentHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '8px',
  '& span': {
    color: theme.palette.text.primary,
    fontSize: '14px',
    fontWeight: '500',
  },
}))

const NoCommentsContainer = styled(Box)(({ theme }) => ({
  padding: '15px',
  textAlign: 'center',
  color: theme.palette.text.secondary,
}))

export {
  IconWrapper,
  StepContainer,
  CustomRadio,
  StepLabel,
  Container,
  ContentWrapper,
  StepsContainer,
  StepsWrapper,
  CommentSection,
  CommentLabel,
  CommentInput,
  SaveButton,
  ModalStyle,
  CommentWrapper,
  StyledCommentBox,
  FormContainer,
  ModalContainer,
  SelectWrapper,
  StyledAutocomplete,
  StyledTextField,
  TitleSection,
  CheckboxesContainer,
  CheckboxGroup,
  CommentsHistoryScroll,
  CommentDescriptionContainer,
  CommentItemContainer,
  CommentHeader,
  NoCommentsContainer,
}
