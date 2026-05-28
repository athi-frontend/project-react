
import { styled } from '@mui/material/styles';
import { Typography } from '@mui/material';


// Status styling components
export const ActiveStatusText = styled(Typography)(({ theme }) => ({
  color: theme.palette.success.main,
  fontWeight: 600,
  fontSize: '0.875rem',
}));

export const InactiveStatusText = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.main,
  fontWeight: 600,
  fontSize: '0.875rem',
}));

