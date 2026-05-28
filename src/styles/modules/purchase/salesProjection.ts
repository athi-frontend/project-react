import { Box, Grid2, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'

/**
 * Classification : Confidential
 **/

export const Section = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  flexDirection: 'column',
  gap: 20,
}))

export const InputRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  alignItems: 'end',
  gap: 20,
  flexWrap: 'wrap',
  padding: '0 40px',
}))

export const MonthStrip = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.light,
  borderRadius: 10,
  display: 'flex',
  marginTop: 20,
  width: '100%',
  padding: 20,
  gap: 20,
  alignItems: 'stretch',
  flexWrap: 'wrap',
}))

export const EmptyStateContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  textAlign: 'center',
  padding: 4,
}))

export const EmptyStateText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  textAlign: 'center',
}))

export const MonthCard = styled(Grid2)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: 10,

  alignItems: 'center',
}))

export const MonthHeader = styled(Box)(({ theme }) => ({
  width: 400,
  maxWidth: '100%',
  minHeight: 50,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 20,
  fontWeight: 600,
  borderBottom: `1px solid ${theme.palette.divider}`,
}))

export const MonthHeaderText = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
}))

export const MonthList = styled(Box)({
  display: 'flex',
  marginTop: 10,
  minHeight: 120,
  maxHeight: 200,
  overflowY: 'auto',
  flexDirection: 'column',
  fontSize: 16,
  fontWeight: 400,
  gap: 8,
  padding: '0 20px 10px',
  width: '100%',
})

export const ViewTabsWrapper = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
}))

export const ViewTabsTitle = styled(Typography)(({ theme }) => ({
  fontSize: 20,
  fontWeight: 600,
  paddingX: 0,
  color: theme.palette.text.primary,
}))

export const ViewTabsContainer = styled(Box)(({ theme }) => ({
  backgroundColor: '#F5E9FF',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(0.5),
}))

export const TabPanelContainer = styled(Box)(({ theme }) => ({
  width: '100%',
}))

export const RecordsRow = styled(Box)(({ theme }) => ({
  borderBottom: '1px solid var(--Default-stroke, #d8d8d8)',
  backgroundColor: theme.palette.text.main,
  minHeight: 80,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '20px 40px',
  color: theme.palette.text.primary,
  fontWeight: 500,
}))

export const RecordsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
}))

export const ActionsRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  justifyContent: 'flex-end',
  padding: '0 40px 20px',
}))

export const ModelViewContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  overflow: 'auto',
}))

export const ModelViewItem = styled(Box)(({ theme }) => ({
  paddingLeft: '5px',
}))

export const ModelViewRowWrapper = styled(Box)(({ theme }) => ({
  width: '600px',
}))

export const ModelViewTableWrapper = styled(Box)(({ theme }) => ({
  width: '600px',
}))

