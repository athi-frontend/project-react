/**
 *Classification : Confidential
 **/
import { styled } from '@mui/material/styles'
import { Box, Theme } from '@mui/material'

export const TooltipContent = styled(Box)(() => ({
  textAlign: 'left',
}))

export const TooltipCombinationText = styled(Box)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: '12px',
  lineHeight: '16px',
  marginBottom: '2px',
}))

export const TooltipStatusText = styled(Box)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontSize: '12px',
  fontWeight: '600',
}))

export const getTooltipStyles = (theme: Theme) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  border: `1px solid ${theme.palette.text.secondary}`,
  padding: '8px 12px',
  maxWidth: '200px',
})

export const getTooltipArrowStyles = (theme: Theme) => ({
  color: theme.palette.background.paper,
  '&::before': {
    border: `1px solid ${theme.palette.text.secondary}`,
  },
})

export const PADDING20 = { padding: '0px 40px 20px 40px' }

export const PROBABILITY_CELL_STYLES = {
  width: '100%',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  textAlign: 'left',
}