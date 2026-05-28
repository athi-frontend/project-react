import { styled } from '@mui/material/styles'
import { Box } from '@mui/material'
import {
  Container as CommonContainer,
  ContentContainer as CommonContentContainer,
  Title as CommonTitle,
} from '../../common'

const FormContainer = styled(CommonContainer)(({ theme }) => ({
  borderRadius: '10px',
  padding: '10px 0',
}))

const FormWrapper = styled(Box)(({ theme }) => ({
  borderRadius: '10px',
  backgroundColor: 'var(--Default-White, #FFF)',
  display: 'flex',
  width: '100%',
  flexDirection: 'column',
  overflow: 'hidden',
  justifyContent: 'start',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
  },
}))

const FormTitle = styled(CommonTitle)(({ theme }) => ({
  minHeight: '104px',
  width: '100%',
  padding: '40px',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
    padding: '0 20px',
  },
}))

const FormContent = styled(CommonContentContainer)(({ theme }) => ({}))

const InputRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  alignItems: 'start',
  gap: '40px',
  justifyContent: 'start',
  flexWrap: 'wrap',
  padding: '0 40px',
  marginTop: '20px',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
    padding: '0 20px',
  },
}))

export const GRID_SIZES = {
  FULL_WIDTH: { md: 12 },
  HALF_WIDTH: { md: 6 },
  THIRD_WIDTH: { md: 6 },
  QUARTER_WIDTH: { md: 6 },
  SIXTH_WIDTH: { md: 6 },
} as const

export { FormContainer, FormWrapper, FormTitle, FormContent, InputRow }
