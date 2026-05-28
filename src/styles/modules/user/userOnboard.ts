'use client'
import { styled, Box, Typography } from '@mui/material'
/**
 * Classification: Confidential
 */

export const FormContainer = styled(Box)(({ theme }) => ({
  borderRadius: '10px',
  display: 'flex',
  flexDirection: 'column',
  fontFamily: 'Poppins, sans-serif',
  justifyContent: 'center',
  padding: '10px 0',
}))

export const FormWrapper = styled(Box)(({ theme }) => ({
  borderRadius: '10px',
  backgroundColor: theme.palette.background.paper,
  display: 'flex',
  width: '100%',
  flexDirection: 'column',
  overflow: 'hidden',
  zIndex: 0,
  justifyContent: 'start',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
  },
}))

export const FormTitle = styled(Typography)(({ theme }) => ({
  minHeight: '104px',
  width: '100%',
  fontSize: '24px',
  color: theme.palette.primary.light,
  fontWeight: '600',
  lineHeight: '1',
  padding: '40px',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
    padding: '0 20px',
  },
}))

export const FormContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  padding: '10px 40px',
  flexDirection: 'column',
  justifyContent: 'start',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
  },
}))

export const InputRow = styled(Box)(({ theme }) => ({
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

export const userOnboardStyles = {
  fullWidthGrid: {
    width: '100%',
  },
  actionButtonContainer: {
    margin: 'auto',
    paddingRight: '40px',
  },
}

export const StatusSpan = styled('span')<{ status: number }>(
  ({ status, theme }) => ({
    color: status === 1 ? theme.palette.success.main : theme.palette.error.main,
  })
)

export const InactiveRow = styled('div')({
  backgroundColor: '#f5f5f5',
  pointerEvents: 'none',
  '& .MuiDataGrid-cell': {
    color: 'rgba(0, 0, 0, 0.6)',
  },
})
