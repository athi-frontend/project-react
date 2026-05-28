import {
  styled,
  Box,
  Typography,
  RadioGroup,
  FormControlLabel,
} from '@mui/material'
const GroupContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
}))

const GroupLabel = styled(Typography)(({ theme }) => ({
  fontSize: '18px',
  marginBottom: '10px',
}))

const StyledRadioGroup = styled(RadioGroup)(({ theme }) => ({
  flexDirection: 'row',
  gap: '40px',
}))

const StyledFormControlLabel = styled(FormControlLabel)(({ theme }) => ({
  marginRight: 0,
  '& .MuiTypography-root': {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '18px',
  },
}))
const ErrorText = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.main,
  fontSize: '14px',
  marginTop: '5px',
}))

export {
  GroupContainer,
  GroupLabel,
  StyledRadioGroup,
  StyledFormControlLabel,
  ErrorText,
}
