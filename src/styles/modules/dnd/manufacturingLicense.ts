import { styled, Box, Typography, SxProps, Theme, Button } from '@mui/material';

export const OuterContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '70vh',
});

export const InnerContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '20px', 
});

export const StyledButton = styled(Button)(({ theme }) => ({
  padding: '10px 20px',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.background.paper,
  textTransform:"none",
   '&.Mui-disabled': {
      backgroundColor: theme.palette.text.disabled,
      color:theme.palette.grey,
    },
  border: 'none',
  borderRadius: '10px',
  cursor: 'pointer',
  fontSize: '16px',
}));

export const StyledTypography = styled(Typography)({
  fontWeight: '600',
  fontSize: '22px',
});

export const ErrorTypography = styled(Typography)(({ theme }) => ({
  color: 'red',
  marginTop: theme.spacing(1),
  fontSize: '0.875rem',
}));

export const modalContainerSx: SxProps<Theme> = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p : 3,
  borderRadius: 2,
}

export const CloseButtonContainer = styled(Box)(({ theme }) => ({
  display: 'flex', 
  justifyContent: 'flex-end', 
  alignItems: 'center', 
  position: 'absolute', 
  top: '20px',
  right: '20px',
}))

export const buttonGroupSx: SxProps<Theme> = {
  mt: 3,
  display: 'flex',
  justifyContent: 'center',
  gap: 1,
}
export const modaloverlay: SxProps<Theme> = {
 zIndex: 1050,
}

export const buttonSx: SxProps<Theme> = {
  px: 1,
  py: 0.5,
  minWidth: 110,
}