import { styled } from '@mui/material/styles'
import { Box } from '@mui/material'
import {
  Container as CommonContainer,
  Title as CommonTitle,
  ButtonWrapper as CommonButtonWrapper,
  PrimaryButton,
} from '../../common'

const FormTeamContainer = styled(CommonContainer)(({ theme }) => ({
  borderRadius: '10px',
  padding: '20px 40px',
}))

const HeaderContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  minHeight: '85px',
  width: '100%',
  alignItems: 'center',
  gap: '40px 100px',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  padding: '20px',
  [theme.breakpoints.down('lg')]: {
    maxWidth: '100%',
  },
}))

const Title = styled(CommonTitle)(({ theme }) => ({
  alignSelf: 'stretch',
  margin: 'auto 0',
}))

const ContentContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  minHeight: '780px',
  width: '100%',
  flexDirection: 'column',
  justifyContent: 'start',
}))

const ButtonWrapper = styled(CommonButtonWrapper)(({ theme }) => ({
  position: 'absolute',
  zIndex: '0',
  maxWidth: '100%',
  width: '1515px',
  right: '20px',
  bottom: '17px',
}))

const InitiateButton = styled(PrimaryButton)(({ theme }) => ({
  alignSelf: 'stretch',

  minWidth: '240px',
  gap: '10px',
  overflow: 'hidden',
}))

export const HeaderContainer2 = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
})

export const FormContentWrapper = styled(Box)({})

export const FieldContainer = styled(Box)({
  marginBottom: '20px',
})

export const ResponsibilityLabel = styled(Box)({
  marginBottom: '10px',
  fontSize: '18px',
})

export {
  FormTeamContainer,
  HeaderContainer,
  Title,
  ContentContainer,
  ButtonWrapper,
  InitiateButton,
}
