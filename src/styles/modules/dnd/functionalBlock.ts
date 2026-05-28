import { styled } from '@mui/material/styles'
import { Box, IconButton } from '@mui/material'
import {
  ContentContainer as CommonContentContainer,
  FormSection as CommonFormSection,
} from '@/styles/common'

const PageContainer = styled(Box)(({ theme }) => ({
  flexWrap: 'wrap',
}))

const ContentContainer = styled(CommonContentContainer)(({ theme }) => ({
  paddingTop: '10px',
  paddingBottom: '10px',
  alignItems: 'stretch',
  width: '100%',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
  },
}))

const ContentWrapper = styled(Box)(({ theme }) => ({
  borderRadius: '10px',
  backgroundColor: theme.palette.background.paper,
  minHeight: '897px',
  overflow: 'hidden',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
  },
}))

const HeaderSection = styled(Box)(({ theme }) => ({
  width: '100%',
  fontSize: '24px',
  color: theme.palette.text.primary,
  fontWeight: '600',
  lineHeight: '1',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
  },
}))

const HeaderContent = styled(Box)(({ theme }) => ({
  alignItems: 'stretch',
  borderRadius: '10px',

  display: 'flex',
  width: '100%',
  paddingTop: '20px',
  paddingBottom: '20px',
  flexDirection: 'column',
  justifyContent: 'center',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
  },
}))

const HeaderTitle = styled('h1')(({ theme }) => ({
  width: '100%',
  paddingLeft: '40px',
  fontSize: '24px',
  paddingRight: '40px',
  paddingTop: '20px',
  paddingBottom: '20px',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
    paddingLeft: '20px',
    paddingRight: '20px',
  },
}))

const FormSection = styled(CommonFormSection)(({ theme }) => ({
  padding: '40px 0px',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
  },
}))

const FormContent = styled(Box)(({ theme }) => ({
  width: '100%',
  fontWeight: '400',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
  },
}))

const FormFields = styled(Box)(({ theme }) => ({
  width: '100%',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
  },
}))

const FormFieldContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
  },
}))

const FormFieldWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',

  width: '100%',
  maxWidth: '100%',
  flexDirection: 'column',
  alignItems: 'stretch',
  justifyContent: 'center',
}))

const DescriptionContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  marginTop: '15px',
  flexDirection: 'column',
  whiteSpace: 'nowrap',
  justifyContent: 'center',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
    whiteSpace: 'initial',
  },
}))

const DescriptionWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '719px',
  maxWidth: '100%',
  flexDirection: 'column',
  alignItems: 'stretch',
  justifyContent: 'center',
  '@media (max-width: 991px)': {
    whiteSpace: 'initial',
  },
}))

const DescriptionContent = styled(Box)(({ theme }) => ({
  minHeight: '187px',
  width: '100%',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
    whiteSpace: 'initial',
  },
}))

const ItemContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  marginBottom: '8px',
}))

const ItemHeader = styled(Box, {
  shouldForwardProp: (prop) => prop !== '$isProduct',
})<{ $isProduct?: boolean }>(({ theme, $isProduct }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '8px 0',
  cursor: 'pointer',
  fontWeight: $isProduct ? 600 : 400,
  fontSize: $isProduct ? '18px' : '16px',
}))

const ItemContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  flex: 1,
}))

const ItemName = styled('span', {
  shouldForwardProp: (prop) => prop !== '$isProduct',
})<{ $isProduct?: boolean }>(({ theme, $isProduct }) => ({
  fontSize: $isProduct ? '18px' : '16px',
  maxWidth: '130px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  color: $isProduct ? theme.palette.text.primary : theme.palette.text.secondary,
}))

const ChildrenContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'expanded',
})<{ expanded: boolean }>(({ theme, expanded }) => ({
  display: expanded ? 'flex' : 'none',
  flexDirection: 'column',
  paddingLeft: '20px',
  marginTop: '4px',
}))

const ActionButtons = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
}))

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  padding: '4px',
  color: '#999',
}))

const ChildItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '6px 0',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
}))

const SidebarContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  height: '910px',
  paddingLeft: '20px',
  paddingRight: '20px',
  paddingTop: '10px',
  alignItems: 'center',
  gap: '10px',
  fontSize: '18px',

  fontWeight: '400',
  whiteSpace: 'nowrap',
  justifyContent: 'center',
  width: '100%',
  '@media (max-width: 991px)': {
    whiteSpace: 'initial',
  },
}))

const SidebarInner = styled(Box)(({ theme }) => ({
  alignSelf: 'stretch',
  display: 'flex',
  marginTop: 'auto',
  marginBottom: 'auto',
  minHeight: '910px',
  width: '100%',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  '@media (max-width: 991px)': {
    whiteSpace: 'initial',
  },
}))

const SidebarContent = styled(Box)(({ theme }) => ({
  borderRadius: '10px',
  backgroundColor: theme.palette.background.paper,
  borderColor: 'rgba(207, 207, 207, 0.4)',
  borderRightWidth: '2px',
  display: 'flex',
  minHeight: '910px',
  width: '100%',
  paddingLeft: '10px',
  paddingRight: '10px',
  paddingTop: '40px',
  paddingBottom: '40px',
  flexDirection: 'column',
  overflow: 'hidden',
  alignItems: 'start',
  justifyContent: 'start',
  '@media (max-width: 991px)': {
    paddingBottom: '40px',
    whiteSpace: 'initial',
  },
}))

const MenuContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
}))

const ButtonContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  width: '100%',
  paddingRight: '40px',
}))

export {
  ContentContainer,
  ContentWrapper,
  HeaderSection,
  HeaderContent,
  HeaderTitle,
  FormSection,
  FormContent,
  FormFields,
  FormFieldContainer,
  FormFieldWrapper,
  DescriptionContainer,
  DescriptionWrapper,
  DescriptionContent,
  PageContainer,
  ItemContainer,
  ItemHeader,
  ItemContent,
  ItemName,
  ChildrenContainer,
  ActionButtons,
  StyledIconButton,
  ChildItem,
  SidebarContainer,
  SidebarInner,
  SidebarContent,
  MenuContainer,
  ButtonContainer,
}
