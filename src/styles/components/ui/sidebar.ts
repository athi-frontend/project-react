import { styled } from '@mui/material/styles'
import { Box, Button } from '@mui/material'

const SidebarContainer = styled(Box)(({ theme }) => ({
  borderRadius: '10px',
  backgroundColor: theme.palette.background.paper,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  alignItems: 'center',
  justifyContent: 'start',
}))

const DecorationContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  alignItems: 'center',
  gap: '10px',
  justifyContent: 'center',
}))

const DecorationBase = styled(Box)(({ theme }) => ({
  borderRadius: '0px 0px 50px 50px',
  backgroundColor: 'rgba(247, 242, 251, 1)',
  alignSelf: 'stretch',
  display: 'flex',
  marginTop: 'auto',
  marginBottom: 'auto',
  minHeight: '49px',
  width: '46px',
  paddingTop: '7px',
  paddingBottom: '7px',
  alignItems: 'end',
  gap: '10px',
  justifyContent: 'center',
  cursor: 'pointer',
}))

const DecorationButton = styled(Box)(({ theme }) => ({
  borderRadius: '50px',
  backgroundColor: theme.palette.text.secondary,
  boxShadow: '0px 3px 18px rgba(0, 0, 0, 0.25)',
  display: 'flex',
  width: '35px',
  paddingLeft: '10px',
  paddingRight: '10px',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '35px',
}))

const DecorationIconContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  paddingLeft: '2px',
  paddingRight: '3px',
  paddingTop: '5px',
  paddingBottom: '5px',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
}))

const ContentContainer = styled(Box)(({ theme }) => ({
  marginTop: '19px',
  width: '100%',
  alignItems: 'start',
  gap: '10px',
  height:"100vh",
  overflow: 'hidden',
  overflowY:"auto",
  scrollbarWidth:"none",
  justifyContent: 'start',
}))

const StepsContainer = styled(Box)(({ theme }) => ({
  minHeight: '736px',
  paddingLeft: '20px',
  paddingRight: '20px',
  paddingTop: '10px',
  paddingBottom: '146px',
  alignItems: 'start',
  gap: '10px',
  overflow: 'hidden',
  justifyContent: 'start',
}))

const InnerContainer = styled(Box)(({ theme }) => ({
  // width: '190px',
}))

const SectionHeader = styled(Button)(({ theme }) => ({
  borderRadius: '5px 5px 0px 0px',
  display: 'flex',
  width: '100%',
  marginBottom: '15px',
  padding: '5px 8px',
  alignItems: 'center',
  gap: '34px',
  lineHeight: '1',
  justifyContent: 'space-between',
  cursor: 'pointer',
}))

const SectionTitle = styled(Box)(({ theme }) => ({
  alignSelf: 'stretch',
  marginTop: 'auto',
  fontWeight: 500,
  marginBottom: 'auto',
}))

const SectionIcon = styled('img')(({ theme }) => ({
  aspectRatio: '1',
  objectFit: 'contain',
  objectPosition: 'center',
  width: '35px',
  alignSelf: 'stretch',
  marginTop: 'auto',
  marginBottom: 'auto',
  flexShrink: '0',
}))

const SectionContent = styled(Box)(({ theme }) => ({
  marginTop: '15px',
  width: '100%',
  fontSize: '13px',
  marginBottom: '15px',
  fontWeight: '400',
  lineHeight: '2',
}))

const ItemContainer = styled(Button)(({ theme }) => ({
  display: 'flex',
  marginTop: '20px',
  borderRadius: '10px',
  textAlign: 'left',
  borderTopLeftRadius: '20px',
  borderBottomLeftRadius: '20px',
  padding: '3px 3px',
  width: '100%',
  alignItems: 'center',
  gap: '10px',
  lineHeight: '16px',
  justifyContent: 'start',
  cursor: 'pointer',
}))

const ItemIcon = styled('img')(({ theme }) => ({
  aspectRatio: '1',
  objectFit: 'contain',
  objectPosition: 'center',
  width: '35px',
  alignSelf: 'stretch',
  marginTop: 'auto',
  marginBottom: 'auto',
  flexShrink: '0',
}))

const ItemLabel = styled(Box)(({ theme }) => ({
  alignSelf: 'stretch',
  marginTop: 'auto',
  marginBottom: 'auto',
}))
const NestedItemStyle = (level:number,position:number) =>({ paddingLeft: `${level * position}px` })
const PaddingLeft = { paddingLeft: '20px' }
export {
  SidebarContainer,
  DecorationContainer,
  DecorationBase,
  DecorationButton,
  DecorationIconContainer,
  ContentContainer,
  StepsContainer,
  InnerContainer,
  SectionHeader,
  SectionTitle,
  SectionIcon,
  SectionContent,
  ItemContainer,
  ItemIcon,
  ItemLabel,
  PaddingLeft,
  NestedItemStyle
}
