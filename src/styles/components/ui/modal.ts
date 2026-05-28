import { styled, Box, Typography, Button } from '@mui/material'
export const INDEX = { zIndex: 1051 }
export const ModalContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  maxWidth: '800px',
  backgroundColor: theme.palette.background.paper,
  borderRadius: '10px',
  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
  padding: '24px',
  outline: 'none',
}))

export const ModalHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '20px',
}))

export const ModalTitle = styled(Typography)(({ theme }) => ({
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
  fontSize: '24px',
  fontWeight: '600',
}))

export const CloseButton = styled(Button)(({ theme }) => ({
  minWidth: 'auto',
  padding: '8px',
}))

export const ModalContent = styled(Box)(({ theme }) => ({
  padding: '20px 40px',
  marginBottom: '24px',
}))

export const ModalFooter = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  padding: '0px 40px',
  gap: '16px',
}))

export const CancelButton = styled(Button)(({ theme }) => ({
  borderRadius: '10px',

  padding: '10px 20px',

  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
  fontSize: '16px',
  fontWeight: '500',
  textTransform: 'none',
}))

export const SaveButton = styled(Button)(({ theme }) => ({
  borderRadius: '10px',

  padding: '10px 20px',
  color: '#FFFFFF',
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
  fontSize: '16px',
  fontWeight: '500',
  textTransform: 'none',
}))
