import { styled } from '@mui/system'
import { Box, TextField, Autocomplete } from '@mui/material'
export const InlineStyles = {
  reviewerLabel: {
    fontSize: '18px',
    color: '#222',
  },
  popupIcon: {
    fontSize: 30,
    fontWeight: 'light',
  },
}
export const CommentWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  [theme.breakpoints.down('md')]: {
    maxWidth: '100%',
  },
}))

export const StyledCommentBox = styled('textarea')(({ theme }) => ({
  borderRadius: '10px',
  border: '1px solid var(--Text-Disable, #999)',
  marginTop: '10px',
  minHeight: '231px',
  width: '100%',
  fontSize: '16px',
  backgroundColor: '#fff',
  color: '#555',
  padding: '18px 20px',
  resize: 'vertical',
  '&:focus': {
    outline: 'none',
  },
  '::placeholder': {
    color: '#888',
    opacity: 1,
  },
}))

const whiteBg = {
  backgroundColor: '#fff',
}

export const SelectWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  flexDirection: 'column',
  justifyContent: 'start',
  [theme.breakpoints.down('md')]: {
    maxWidth: '100%',
  },
}))

export const StyledAutocomplete = styled(Autocomplete)(({ theme }) => ({
  ...whiteBg,
  marginTop: '10px',
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px',
    border: '1px solid #999',
    padding: '18px 20px',
    backgroundColor: '#fff',
    '& fieldset': {
      border: 'none',
    },
  },
  '& .MuiAutocomplete-popper': {
    zIndex: 1300,
  },
  '& .MuiPaper-root, & .MuiAutocomplete-listbox': {
    ...whiteBg,
    color: '#000',
  },
}))

export const StyledTextField = styled(TextField)({
  ...whiteBg,
  '& input::placeholder': {
    color: '#888',
    opacity: 1,
  },
  '& input': {
    color: '#555',
  },
})
