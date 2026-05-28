import { styled, Box, TextField } from '@mui/material'

export const PndReviewContainer = styled(Box)(({ theme }) => ({
  padding: '0 64px',
  '@media (max-width: 768px)': {
    paddingLeft: '20px',
  },
}))

export const PndReviewTitle = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: '20px 0',
  maxWidth: '100%',
  fontSize: '24px',
  fontWeight: 600,
  lineHeight: 'none',
  color: '#1F2937',
  borderRadius: '12px',
  width: '1557px',
}))

export const ReviewTableContainer = styled(Box)(({ theme }) => ({
  alignSelf: 'stretch',
  margin: '0 auto',
  borderRadius: '12px',
  border: '1px solid #D4D4D8',
  minWidth: '60px',
  width: '1477px',
  '@media (max-width: 768px)': {
    maxWidth: '100%',
  },
}))

export const ReviewTableHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '40px',
  alignItems: 'center',
  padding: '36px 40px',
  fontSize: '20px',
  fontWeight: 500,
  whiteSpace: 'nowrap',
  backgroundColor: '#F3E8FF',
  borderRadius: '12px',
  borderBottom: '1px solid #D4D4D8',
  minHeight: '100px',
  color: '#262626',
  '@media (max-width: 768px)': {
    padding: '20px',
    maxWidth: '100%',
  },
}))

export const ReviewTableHeaderItem = styled(Box)(({ theme }) => ({}))

export const ReviewTableRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '40px',
  alignItems: 'center',
  padding: '20px 40px',
  borderBottom: '1px solid #D4D4D8',
  minHeight: '100px',
  '@media (max-width: 768px)': {
    padding: '20px',
    maxWidth: '100%',
  },
}))

export const ReviewTableCell = styled(Box)(({ theme }) => ({}))

export const CommentInput = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    padding: '20px',
    width: '100%',
    '& fieldset': {
      border: 'none',
    },
  },
  '& .MuiInputBase-input': {
    color: '#A3A3A3',
    fontSize: '16px',
    '&::placeholder': {
      color: '#A3A3A3',
      opacity: 1,
    },
  },
}))

export const ButtonGroupContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  overflowX: 'auto',
  gap: '20px',
  alignItems: 'center',
  paddingRight: '40px',
  marginTop: '40px',
  width: '100%',
  fontSize: '20px',
  fontWeight: 500,
  textAlign: 'center',
  color: '#581C87',
  '@media (max-width: 768px)': {
    paddingRight: '20px',
    maxWidth: '100%',
  },
}))

export const ButtonWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '20px',
  alignItems: 'center',
  alignSelf: 'stretch',
  paddingLeft: '40px',
  margin: 'auto',
  minHeight: '50px',
  minWidth: '240px',
  width: '1583px',
  '@media (max-width: 768px)': {
    maxWidth: '100%',
  },
}))

export const StyledButton = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'start',
  alignSelf: 'stretch',
  margin: 'auto',
  minHeight: '50px',
  cursor: 'pointer',
  '& > div': {
    overflow: 'hidden',
    gap: '10px',
    alignSelf: 'stretch',
    padding: '10px 20px',
    borderRadius: '12px',
  },
}))

export const SaveButton = styled(Box)(({ theme }) => ({
  overflow: 'hidden',
  gap: '10px',
  alignSelf: 'stretch',
  padding: '10px 20px',
  margin: 'auto',
  width: '96px',
  color: 'white',
  whiteSpace: 'nowrap',
  backgroundColor: '#581C87',
  borderRadius: '12px',
  cursor: 'pointer',
}))

export const StatusTitle = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: '20px 0',
  width: '100%',
  fontSize: '24px',
  fontWeight: 600,
  lineHeight: 'none',
  color: '#1F2937',
  borderRadius: '12px',
}))

export const StatusContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '20px 40px',
  width: '100%',
  fontSize: '18px',
  color: '#262626',
  '@media (max-width: 768px)': {
    padding: '20px',
  },
}))

export const StatusTableContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  borderRadius: '12px',
  border: '1px solid #D4D4D8',
  maxWidth: '1477px',
  '@media (max-width: 768px)': {
    maxWidth: '100%',
  },
}))

export const StatusTableHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '40px',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '24px 40px',
  width: '100%',
  fontSize: '20px',
  fontWeight: 500,
  whiteSpace: 'nowrap',
  backgroundColor: '#F3E8FF',
  borderRadius: '12px',
  borderBottom: '1px solid #D4D4D8',
  minHeight: '80px',
  '@media (max-width: 768px)': {
    padding: '20px',
    maxWidth: '100%',
  },
}))

export const StatusTableHeaderItem = styled(Box)(({ theme }) => ({}))

export const StatusTableRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '40px',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '24px 40px',
  width: '100%',
  backgroundColor: 'white',
  borderBottom: '1px solid #D4D4D8',
  minHeight: '70px',
  '@media (max-width: 768px)': {
    padding: '20px',
    maxWidth: '100%',
  },
}))

export const StatusTableCell = styled(Box)(({ theme }) => ({}))

export const ActionButtonsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '20px',
  alignItems: 'center',
  padding: '0 40px',
  marginTop: '40px',
  width: '100%',
  fontSize: '24px',
  fontWeight: 500,
  textAlign: 'center',
  color: 'white',
  '@media (max-width: 768px)': {
    padding: '0 20px',
    maxWidth: '100%',
  },
}))

export const ActionButton = styled(Box)(({ theme }) => ({
  gap: '10px',
  alignSelf: 'stretch',
  padding: '8px 20px',
  margin: 'auto',
  backgroundColor: '#581C87',
  borderRadius: '12px',
  minHeight: '50px',
  minWidth: '240px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
}))
