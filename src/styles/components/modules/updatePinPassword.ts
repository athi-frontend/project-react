import { Box, Typography, styled } from '@mui/material'

export const Container = styled(Box)(({ theme }) => ({
  width: '100%',
  marginBottom: '20px',
}))

export const Label = styled(Typography)({
  fontFamily: "'Poppins',sans-serif",
  fontWeight: '500',
  fontSize: '18px',
  marginBottom: '10px',
  '@media (max-width: 640px)': {
    fontSize: '16px',
  },
})

export const PinContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'space-between',
})

export const PinInput = styled('input')(({ theme }) => ({
  width: '98px',
  height: '54px',
  border: '1px solid #A0A0A0',
  borderRadius: '10px',
  fontFamily: "'Poppins',sans-serif",
  fontWeight: '400',
  backgroundColor: theme.palette.background.paper,
  fontSize: '16px',
  color: '#A0A0A0',
  textAlign: 'center',
  '@media (max-width: 640px)': {
    width: '80px',
    height: '44px',
  },
  '&:focus': {
    outline: 'none',
    borderColor: '#652D90',
  },
  type: 'password',
}))
