import { styled } from '@mui/material/styles'
import { Box } from '@mui/material'
import { HeaderContainer } from '@/styles/common'

import { Container } from '@/styles/modules/dnd/pnd'
/**
      *Classification : Confidential
**/
export const FormContainer = styled(Container)(({ theme }) => ({
  borderRadius: '10px',
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
  width: '100%',
  overflow: 'hidden',
  backgroundColor: theme.palette.background.paper,
}))

export const FormHeader = styled(HeaderContainer)(({ theme }) => ({
  minHeight: '104px',
  width: '100%',
  padding: '40px',
  fontSize: '24px',

  fontWeight: '600',
  lineHeight: '1',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
    padding: '20px',
  },
}))

export const FormContent = styled(Box)(({ theme }) => ({
  width: '100%',
  paddingBottom: '20px',
}))

export const FormSection = styled(Box)(({ theme }) => ({
  minHeight: '100px',
  width: '100%',
  padding: '0 40px',
  alignItems: 'flex-start',
  gap: '40px',
  justifyContent: 'flex-start',
  flexWrap: 'wrap',
  marginBottom: '20px',
}))

export const FormSectionWrapper = styled(Box)(({ theme }) => ({
  marginTop: '20px',
  width: '100%',
  padding: '0 40px',
  alignItems: 'flex-start',
  gap: '40px',
  justifyContent: 'flex-start',
  flexWrap: 'wrap',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
    padding: '0 20px',
  },
}))

export const ProductInfoSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  minWidth: '240px',
  paddingRight: '80px',
  paddingTop: '2px',
  paddingBottom: '2px',
  flexDirection: 'column',
  alignItems: 'flex-start',
  flexGrow: 1,
  flexShrink: 1,
  width: '575px',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
  },
}))

export const ProductName = styled(Box)(({ theme }) => ({
  color: '#222',
  fontSize: '18px',
}))

export const ProductDescription = styled(Box)(({ theme }) => ({
  fontSize: '16px',
  marginTop: '28px',
}))

export const InputWrapper = styled(Box)(({ theme }) => ({
  minWidth: '240px',
  flexGrow: 1,
  flexShrink: 1,
  width: '574px',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
    whiteSpace: 'initial',
  },
}))

export const ContraIndicationsWrapper = styled(Box)(({ theme }) => ({
  minWidth: '240px',
  width: '719px',
}))

export const ProductNameContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  minWidth: '240px',
  paddingRight: '80px',
  paddingTop: '2px',
  paddingBottom: '2px',
  flexDirection: 'column',
  alignItems: 'start',
  flexGrow: '1',
  flexShrink: '1',
  width: '575px',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
  },
}))

export const ProductNameLabel = styled(Box)(({ theme }) => ({
  fontSize: '18px',
}))

export const ProductNameValue = styled(Box)(({ theme }) => ({
  fontSize: '16px',
  marginTop: '28px',
}))

export const STYLE5={ mt: 1 }