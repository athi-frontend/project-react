'use client';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { loadingPage } from '@/styles/components/ui/layout';

/**
*Classification : Confidential
**/

export default function InitialLoader() {
  return (
    <Box
      sx={loadingPage}
      >
        <CircularProgress />
      </Box>
  );
}



