import { styled } from '@mui/material/styles'
import { Box } from '@mui/material'

export const DialogContainer = styled(Box)({
  padding: 0,
  overflow: 'hidden',
  overflowY: 'auto',
})
export const TitleContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '20px 40px',
  borderBottom: '1px solid #E5E7EB',
  '@media (max-width: 991px)': { padding: '20px' },
})
export const TitleSection = styled('h1')({
  fontSize: '24px',
  fontWeight: 600,
  color: '#111827',
  margin: 0,
  lineHeight: 1,
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
})
export const ContentWrapper = styled(Box)({
  // padding: '40px',
  '@media (max-width: 991px)': { padding: '20px' },
})
export const FormContainer = styled(Box)({
  width: '100%',
  maxWidth: '800px',
  margin: '0 auto',
})
export const FormSection = styled(Box)({ width: '100%' })
export const BoxStyle = {
  marginTop: '10px',
  display: 'flex',
  justifyContent: 'flex-end',
}
export const BoxStyle2 = { color: 'red', marginTop: '10px' }
export const MarginTop = { marginTop: '20px' }
