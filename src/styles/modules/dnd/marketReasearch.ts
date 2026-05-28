import { styled, Box, Chip } from '@mui/material'
const FeedbackContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: '20px',
}))

const FeedbackHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
}))

const FeedbackContent = styled(Box)(({ theme }) => ({
  width: '100%',
  borderRadius: '10px',
  backgroundColor: 'rgba(234, 214, 250, 0.47)',
  marginTop: '10px',
  minHeight: '114px',
  padding: '33px 20px',
  [theme.breakpoints.down('md')]: {
    maxWidth: '100%',
  },
}))
const StyledChip = styled(Chip)(({ theme }) => ({
  borderRadius: '5px',
  backgroundColor: 'var(--Secondary-lite, #EAD6FA)',
  margin: '5px',
  padding: '5px 10px',
}))

export { FeedbackContainer, FeedbackHeader, FeedbackContent, StyledChip }
