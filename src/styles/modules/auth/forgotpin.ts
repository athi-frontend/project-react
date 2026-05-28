import {
  styled,
  Box,
  TextField,
  Button,
  Typography,
  Grid2,
} from '@mui/material'
import { CSSProperties } from 'react'

export const PageContainer = styled(Box)({
  display: 'flex',
  width: '100%',
  height: '100vh',
  backgroundColor: '#fff',
})

export const LeftSection = styled(Grid2)({
  position: 'relative',
})

export const RightSection = styled(Grid2)({
  height: '100%',
  flexDirection: 'column',
})

export const LogoImage = styled('img')(({ theme }) => ({
  aspectRatio: '3.33',
  objectFit: 'contain',
  objectPosition: 'center',
  width: '300px',
  height: '90px',
  alignSelf: 'center',
  maxWidth: '100%',
}))

export const FormContainer = styled(Box)(({ theme }) => ({
  width: '100%',

  padding: '10px 60px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',

  borderRadius: '10px',
  '@media (max-width: 991px)': {
    padding: '20px',
  },
  '@media (max-width: 640px)': {
    padding: '20px 10px',
  },
}))

export const ForgotPinTitle = styled(Typography)(({ theme }) => ({
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
  fontSize: '60px',
  fontWeight: '700',
  color: '#111',
  marginBottom: '10px',
  textAlign: 'center',
  '@media (max-width: 640px)': {
    fontSize: '40px',
  },
}))

export const ForgotPinSubtitle = styled(Typography)(({ theme }) => ({
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
  fontSize: '16px',

  lineHeight: '1.6',
  textAlign: 'center',
}))

export const FormWrapper = styled(Box)(({ theme }) => ({
  width: '100%',

  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  marginTop: '20px',
  '@media (max-width: 640px)': {
    gap: '30px',
  },
}))

export const InputContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  width: '100%',
}))

export const InputLabel = styled(Typography)(({ theme }) => ({
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
  fontSize: '18px',
  color: '#111',
  fontWeight: '500',
}))

export const StyledTextField = styled(TextField)(({ theme }) => ({
  width: '100%',
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px',
    '& fieldset': {
      borderColor: '#B5B5B5',
    },
    '&:hover fieldset': {
      borderColor: '#B5B5B5',
    },
  },
  '& .MuiInputBase-input': {
    padding: '15px 20px',
    fontSize: '16px',
    color: '#A0A0A0',
    fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
  },
}))

export const RecoverPinButton = styled(Button)(({ theme }) => ({
  width: '100%',
  padding: '10px',
  color: '#fff',
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
  fontSize: '20px',
  border: 'none',
  borderRadius: '10px',
  cursor: 'pointer',
  backgroundColor: '#652D90',
  textTransform: 'none',
  marginTop: '20px',
  '&:hover': {
    backgroundColor: '#4e2270',
  },
}))

export const ErrorMessage = styled(Typography)(({ theme }) => ({
  color: '#f00024',
  fontSize: '12px',
  marginTop: '5px',
  fontWeight: '400',
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
}))

export const successMessageStyle: CSSProperties = {
  color: 'green',
  marginTop: '8px',
  textAlign: 'center',
}
