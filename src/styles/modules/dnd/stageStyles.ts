import { Box, styled } from '@mui/material'

import { TableContainer } from '@/styles/common'

export const AddButtonContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  borderRadius: '10px',
  border: '1px solid var(--Primary-Color, #652D90)',
  minHeight: '45px',
  padding: '8px 20px',
  gap: '20px',
  fontSize: '20px',
  color: '#652D90',
  fontWeight: 500,
  cursor: 'pointer',
}))

export const AddButtonIcon = styled(Box)(({ theme }) => ({
  width: '15px',
  height: '15px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}))

export const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: '10px',
  paddingTop: '10px',
  overflow: 'hidden',
}))

export const ButtonIcon = {
  width: '15px',
  height: '15px',
  stroke: '#652D90',
  strokeWidth: '1.875px',
}

// Inline styles moved to the top
export const InlineStyles = {
  gridItem: {
    margin: 'auto',
  },
  statusActive: {
    color: 'green',
  },
  statusInactive: {
    color: 'red',
  },
  linkStyle: {
    textDecoration: "underline",
  },
}