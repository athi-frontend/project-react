import { styled } from '@mui/system'
import { Box, Radio, Typography } from '@mui/material'

export const StepContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  justifyContent: 'start',
  flexDirection: 'row',
})

export const CustomRadio = styled(Radio)(({ theme }) => ({
  width: '40px',
  height: '50px',
  padding: '10px',
  '& .MuiSvgIcon-root': {
    fontSize: '40px',
    color: 'rgba(153, 153, 153, 1)',
  },
  '&.Mui-checked .MuiSvgIcon-root': {
    color: theme.palette.primary.main,
  },
}));

export const StepLabel = styled(Typography)({
  color: '#999999',
  margin: 'auto 0',
  fontFamily: 'Poppins, sans-serif',
  fontWeight: 400,
  fontSize: '18px',
})
