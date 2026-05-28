/**
    Classification : Confidential
**/

import { styled } from '@mui/material'

export const getTooltipStyles = () => ({
  bgcolor: 'white',
  color: 'black',
  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
  border: '1px solid #e0e0e0',
  borderRadius: '8px',
  fontSize: '14px',
  padding: '12px 16px',
  maxWidth: '400px',
  whiteSpace: 'normal',
  wordWrap: 'break-word',
  maxHeight: 300,
  overflow: 'auto',
  '&::-webkit-scrollbar': {
    display: 'none',
  }
})
export const getTooltipArrowStyles = () => ({
  color: 'white',
  '&::before': {
    backgroundColor: 'white',
    border: '1px solid #e0e0e0',
  }
});

export const StyledTooltipSpan = styled('span')({
  cursor: 'pointer',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  maxWidth: '100%'
})