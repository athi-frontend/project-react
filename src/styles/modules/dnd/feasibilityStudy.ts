import { styled } from '@mui/material/styles'
import { Box } from '@mui/material'
import { SxProps, Theme } from '@mui/system'
import {
  Container as CommonContainer,
  Title as CommonTitle,
} from '@/styles/common'

/**
  Classification : Confidential
**/
const Container = styled(CommonContainer)(({ theme }) => ({
  padding: '40px',
  borderRadius: '8px',
  backgroundColor: theme.palette.background.paper,
  '@media (max-width: 991px)': {
    padding: '20px',
  },
}))

const Title = styled(CommonTitle)(({ theme }) => ({
  marginBottom: '40px',
}))

const ContentWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  marginBottom: '20px',
  flexDirection: 'column',
  gap: '0px',
}))

export const FormContainer = styled(Box)({
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
  width: '100%',
})

export const HeaderSection = styled(Box)({
  display: 'flex',
  minHeight: '85px',
  width: '100%',
  flexDirection: 'column',
  alignItems: 'stretch',
  fontSize: '20px',
  color: 'rgba(255, 255, 255, 1)',
  fontWeight: '500',
  whiteSpace: 'nowrap',
  justifyContent: 'center',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
    paddingLeft: '20px',
    paddingRight: '20px',
    whiteSpace: 'initial',
  },
})

export const HeaderTitle = styled(Box)(({ theme }) => ({
  borderRadius: '10px 10px 0px 0px',
  backgroundColor: theme.palette.primary.main,
  display: 'flex',
  minHeight: '80px',
  width: '100%',
  paddingLeft: '40px',
  paddingRight: '40px',
  flexDirection: 'column',
  alignItems: 'start',
  justifyContent: 'center',
  fontSize: '20px',
  color: 'rgba(255, 255, 255, 1)',
  fontWeight: '500',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
    paddingLeft: '20px',
    paddingRight: '20px',
    whiteSpace: 'initial',
  },
}))

export const CostItemsWrapper = styled(Box)({
  display: 'flex',
  width: '100%',
  paddingBottom: '10px',
  flexDirection: 'column',
  alignItems: 'stretch',
  justifyContent: 'center',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
  },
})

export const CostLabelContainer = styled(Box)(({ theme }) => ({
  borderRadius: '0px 0px 0px 10px',
  backgroundColor: theme.palette.background.light,
  alignSelf: 'stretch',
  minWidth: '240px',
  marginTop: 'auto',
  marginBottom: 'auto',
  fontSize: '18px',
  color: theme.palette.text.primary,
  fontWeight: '500',
  flexGrow: '1',
  flexShrink: '1',
  width: '100%',
  height: '100%',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
  },
}))

interface CostItemContainerProps {
  isLast?: boolean
}

export const CostItemContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isLast',
})<CostItemContainerProps>(({ isLast }) => ({
  borderColor: 'rgba(216, 216, 216, 1)',
  borderBottomWidth: isLast ? '0' : '1px',
  borderBottomStyle: isLast ? 'none' : 'solid',
  display: 'flex',
  minHeight: '90px',
  width: '100%',
  paddingLeft: '40px',
  paddingRight: '40px',
  flexDirection: 'column',
  alignItems: 'start',
  justifyContent: 'center',
  '@media (max-width: 991px)': {
    paddingLeft: '20px',
    paddingRight: '20px',
  },
}))

export const CostLabel = styled(Box)({
  alignSelf: 'stretch',
  minWidth: '240px',
  marginTop: 'auto',
  marginBottom: 'auto',
  gap: '10px',
})

export const CostInputContainer = styled(Box)(({ theme }) => ({
  borderRadius: '0px 0px 10px 0px',
  backgroundColor: theme.palette.background.light,
  alignSelf: 'stretch',
  minWidth: '240px',
  marginTop: 'auto',
  marginBottom: 'auto',
  fontSize: '18px',
  color: '#999',
  fontWeight: '400',
  flexGrow: '1',
  flexShrink: '1',
  width: '100%',
  height: '100%',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
  },
}))

export const InputContainer = styled(Box)({
  paddingTop: '10px',
  width: '100%',
  maxWidth: '700px',
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px',
    '& fieldset': {
      borderColor: '#999',
    },
    '&:hover fieldset': {
      borderColor: '#652D90',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#652D90',
    },
  },
  '@media (max-width: 991px)': {
    maxWidth: '100%',
  },
})

export const grid2Container: SxProps<Theme> = {
  width: '50%',
}

export const getCostValidationBoxStyles = (
  index: number,
  totalFields: number
): SxProps<Theme> => ({
  borderBottom:
    index === totalFields - 1 ? 'none' : '1px solid rgba(216, 216, 216, 1)',
  padding: '9px 10px 0 10px',
})

export { Container, Title, ContentWrapper }
