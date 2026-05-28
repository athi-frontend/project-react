'use client';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { spinnerStyle } from '@/styles/components/ui/layout';

/**
*Classification : Confidential
**/
type GlobalLoaderProps = {
  readonly loading: boolean;
};

export default function GlobalLoader({ loading }: GlobalLoaderProps) {
  if (!loading) return null;
  return (
    <Box sx={spinnerStyle}>
      <CircularProgress color="primary" />
    </Box>
  );
}
