import { styled, Grid2 } from '@mui/material'

/**
 * Risk Review Styles
 * Classification: Confidential
 */

export const RiskReviewGridItemStyled = styled(Grid2)(({ theme }) => ({
  backgroundColor: theme.palette.background.light,
  position: 'relative',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '20px 24px',
  margin: 0,
}))

export const SectionTitle = styled('div')(() => ({
  fontWeight: 600,
  margin: '24px 0 12px 0',
}))

export const AcknowledgeContainer = styled('div')(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}))
