
import { styled,SxProps, Theme } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';


// Status styling components
export const VerifiedStatusText = styled(Typography)(({ theme }) => ({
  color: theme.palette.success.main,
  fontWeight: 600,
  fontSize: '0.875rem',
}));

export const RejectedStatusText = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.main,
  fontWeight: 600,
  fontSize: '0.875rem',
}));

export const InProgressStatusText = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 600,
  fontSize: '0.875rem',
}));

export const PendingStatusText = styled(Typography)(({ theme }) => ({
  color: theme.palette.warning.main,
  fontWeight: 600,
  fontSize: '0.875rem',
}));

export const StatusContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));


export const MODAL_STYLES = {
  scrollableContainer: {
    height: "400px", 
    overflow: "auto", 
    scrollbarWidth: "0", 
    '&::-webkit-scrollbar': {
      display: 'none', 
    },
  } as SxProps<Theme>,
};




export const ContentWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  marginBottom: '20px',
  flexDirection: 'column',
  gap: '0px',
}))


export const GRID_SIZE= {
   FULL_WIDTH: { md: 12 },
}