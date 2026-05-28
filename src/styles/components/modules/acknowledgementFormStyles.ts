import { Box, styled } from '@mui/material'

export const AcknowledgementSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  paddingLeft: '40px',
  paddingRight: '40px',
  marginTop: '20px',
  flexDirection: 'column',
  alignItems: 'stretch',
  justifyContent: 'center',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
    paddingLeft: '20px',
    paddingRight: '20px',
  },
}))

export const AcknowledgementLabel = styled(Box)(({ theme }) => ({
  color: '#222',
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
  fontSize: '18px',
  fontWeight: '400',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
  },
}))

export const AcknowledgementCheckbox = styled(Box)(({ theme }) => ({
  alignSelf: 'stretch',
  marginTop: 'auto',
  marginBottom: 'auto',
  width: '40px',
}))

export const CheckboxLabel = styled(Box)(({ theme }) => ({
  color: '#999',
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
  fontSize: '18px',
  fontWeight: '400',
  alignSelf: 'stretch',
  marginTop: 'auto',
  marginBottom: 'auto',
}))

export const ButtonContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  marginTop: '40px',
  width: '100%',
  paddingLeft: '40px',
  paddingRight: '40px',
  alignItems: 'center',
  gap: '20px',
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
  fontSize: '20px',
  color: 'rgba(255, 255, 255, 1)',
  fontWeight: '500',
  textAlign: 'center',
  justifyContent: 'flex-end',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
    paddingLeft: '20px',
    paddingRight: '20px',
  },
}))


export const InlineStyles = {
  checkbox: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    border: '2px solid var(--Text-Disable, #999)',
    '&.Mui-checked': {
      color: '#652D90',
    },
  },
  dataGridContainer: {
    padding: '0 40px',
    '@media (max-width: 991px)': {
      padding: '0 20px',
    },
  },
  acknowledgementBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    marginTop: '20px',
  },
}