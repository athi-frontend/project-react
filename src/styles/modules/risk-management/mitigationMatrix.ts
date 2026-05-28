/**
 * Mitigation Matrix Styles
 * Classification: Confidential
 */
import { styled } from '@mui/material/styles'
import { Box } from '@mui/material'

export const CountCell = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isClickable' && prop !== 'isAcceptable',
})<{ isClickable: boolean, isAcceptable: boolean }>(({ isClickable, isAcceptable, theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '95%',
  width: '100%',
  cursor: isClickable ? 'pointer' : 'default',
  textDecoration: isClickable ? 'underline' : 'none',
  backgroundColor: isAcceptable
    ? theme.palette.success.light
    : theme.palette.error.light,
}))

export const ProbabilityCell = styled(Box)(() => ({
  padding: '0px 10px',
}))

export const CustomCellStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  height: '45px',
  padding: '0px 2px',
}
