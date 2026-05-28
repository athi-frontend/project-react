import { styled } from '@mui/material/styles'
import { Box } from '@mui/material'
import {
  Container as CommonContainer,
  ContentContainer as CommonContentContainer,
  FormSection as CommonFormSection,
  Title as CommonTitle,
  SecondaryButton,
  ErrorText as CommonErrorText,
  ModalContent as CommonModalContent,
  Label as CommonLabel,
} from '../../common'

const Container = styled(CommonContainer)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: '20px',
}))

const Header = styled(Box)(({ theme }) => ({
  justifyContent: 'center',
  borderRadius: '10px',
  display: 'flex',
  minHeight: '104px',
  width: '100%',
  flexDirection: 'column',
  padding: '21px 0',
  [theme.breakpoints.down('md')]: {
    maxWidth: '100%',
  },
}))

const HeaderContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '40px 100px',
  justifyContent: 'space-between',
  padding: '10px 0px',
}))

const Title = styled(CommonTitle)(({ theme }) => ({
  alignSelf: 'stretch',
  paddingLeft: '20px',
  margin: 'auto 0',
}))

const AddButton = styled(SecondaryButton)(({ theme }) => ({
  alignItems: 'center',
  alignSelf: 'stretch',
  display: 'flex',
  minHeight: '45px',
  gap: '20px',
  overflow: 'hidden',
  justifyContent: 'start',
  margin: 'auto 0',
  padding: '8px 20px',
}))

const Content = styled(CommonContentContainer)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    maxWidth: '100%',
  },
}))

const FormSection = styled(CommonFormSection)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    maxWidth: '100%',
  },
}))

const FormContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '718px',
  maxWidth: '100%',
  flexDirection: 'column',
  justifyContent: 'start',
}))

const SourceLabel = styled(CommonLabel)(({ theme }) => ({}))

const DescriptionLabel = styled(CommonLabel)(({ theme }) => ({}))

const FeedbacksSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  marginTop: '20px',
  minHeight: '359px',
  maxWidth: '100%',
  flexDirection: 'column',
  justifyContent: 'start',
}))

const FeedbacksLabel = styled(CommonLabel)(({ theme }) => ({}))

const ButtonGroupBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  alignItems: 'center',
  gap: '20px',
  fontSize: '20px',
  paddingRight: '40px',
  fontWeight: 500,
  textAlign: 'center',
  justifyContent: 'flex-end',
  [theme.breakpoints.down('md')]: {
    maxWidth: '100%',
  },
}))

const ModalContent = styled(CommonModalContent)(({ theme }) => ({
  width: 700,
  padding: theme.spacing(2),
}))

const ErrorText = styled(CommonErrorText)(({ theme }) => ({}))

export {
  Container,
  Header,
  HeaderContent,
  Title,
  AddButton,
  Content,
  FormSection,
  FormContent,
  SourceLabel,
  DescriptionLabel,
  FeedbacksSection,
  FeedbacksLabel,
  ButtonGroupBox,
  ModalContent,
  ErrorText,
}
