import { styled, SxProps, Theme } from '@mui/material/styles'
import { Box, Typography, Button } from '@mui/material'

/**
    Classification : Confidential
**/
const FlexColumn = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
})

const Container = styled(FlexColumn)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: '10px',
  justifyContent: 'flex-start',
  width: '100%',
}))

const TableContainer = styled(Container)({
  padding: '20px',
})

const ResponsiveBox = styled(Box)({
  padding: '40px',
  '@media (max-width: 991px)': {
    padding: '20px',
    maxWidth: '100%',
  },
})

const Label = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontSize: '18px',
  marginBottom: '10px',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
  },
}))

const ErrorText = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.main,
  fontSize: '14px',
  marginTop: '5px',
}))

const HeaderTitle = styled(Typography)(({ theme }) => ({
  fontFamily: 'Poppins, sans-serif',
  fontSize: '24px',
  fontWeight: 600,
  lineHeight: 1,
  color: theme.palette.text.primary,
}))

const Title = styled(HeaderTitle)({})

const ContentContainer = styled(FlexColumn)({
  width: '100%',
  padding: '0px 20px',
  justifyContent: 'flex-start',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
  },
})

const FormSection = styled(ContentContainer)({
  alignItems: 'center',
  justifyContent: 'center',
})

const FormContainer = styled(Container)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}))

const FormHeader = styled(ResponsiveBox)({
  minHeight: '104px',
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
})

const FormTitle = styled(HeaderTitle)(({ theme }) => ({
  color: theme.palette.primary.light,
}))

const FieldRow = styled(Box)({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'flex-start',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  gap: '40px',
  padding: '0 40px',
  marginTop: '20px',
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
  fontSize: '18px',
  fontWeight: 400,
  width: '100%',
  '&:first-of-type': {
    marginTop: 0,
  },
  '@media (max-width: 991px)': {
    padding: '0 20px',
    maxWidth: '100%',
  },
})

const SharedFieldStyles = {
  minWidth: '240px',
  flexGrow: 1,
  flexShrink: 1,
  width: '575px',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
  },
}

const LabelContainer = styled(Box)(SharedFieldStyles)
const DropdownContainer = styled(Box)(SharedFieldStyles)
const RadioGroupContainer = styled(Box)({
  ...SharedFieldStyles,
  minHeight: '100px',
})
const RichTextContainer = styled(Box)({
  ...SharedFieldStyles,
  minHeight: '330px',
})
const RadioGroupWrapper = styled(Box)({
  width: '100%',
  maxWidth: '520px',
})

const LabelText = styled(Box)(({ theme }) => ({
  color: theme.palette.text.primary,
}))

const ValueText = styled(Box)({
  color: '#999',
  marginTop: '15px',
})

const ButtonWrapper = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '20px',
  justifyContent: 'flex-end',
})

const StyledButton = styled(Button)({
  borderRadius: '10px',
  padding: '10px 20px',
  fontSize: '20px',
  fontWeight: 500,
  textTransform: 'none',
})

const PrimaryButton = styled(StyledButton)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: 'white',
}))

const SecondaryButton = styled(StyledButton)(({ theme }) => ({
  border: `1px solid ${theme.palette.primary.main}`,
  color: theme.palette.primary.main,
}))

const ButtonContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  gap: '20px',
  padding: '0 40px',
  marginTop: '20px',
  fontSize: '20px',
  fontWeight: 500,
  color: '#652D90',
  textAlign: 'center',
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
  '@media (max-width: 991px)': {
    padding: '0 20px',
    maxWidth: '100%',
  },
})

const CommentsHistoryContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-start',
  width: '100%',
  paddingLeft: '40px',
}))

const ModalContent = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[24],
  padding: theme.spacing(2),
  borderRadius: '10px',
}))


const InlineStyles = {
  actionsContainer: {
    display: 'flex',
    gap: '16px',
  },
  statusActive: {
    color: 'green',
  },
  statusInactive: {
    color: 'red',
  },
}
export const radioGroupWrapperStyles: SxProps<Theme> = {
  marginBottom: '20px',
};

export {
  InlineStyles,
  Container,
  TableContainer,
  Label,
  ErrorText,
  HeaderTitle,
  Title,
  ContentContainer,
  FormSection,
  FormContainer,
  FormHeader,
  FormTitle,
  FieldRow,
  LabelContainer,
  LabelText,
  ValueText,
  RadioGroupContainer,
  RadioGroupWrapper,
  DropdownContainer,
  RichTextContainer,
  ButtonWrapper,
  ButtonContainer,
  CommentsHistoryContainer,
  StyledButton,
  PrimaryButton,
  SecondaryButton,
  ModalContent,
  ResponsiveBox as ResponsivePaddingBox,
}
