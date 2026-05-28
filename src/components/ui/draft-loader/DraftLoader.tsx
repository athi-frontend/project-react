import React from 'react';
import { CircularProgress, Box } from '@mui/material';
import { draftLoader } from '@/styles/common';
import { NUMBERMAP } from '@/constants/common';

/**
    Classification : Confidential
**/

const DraftLoading: React.FC = () => {
  return (
    <Box
      sx={draftLoader}
    >
      <CircularProgress size={NUMBERMAP.TWENTY} />
      <span>Saving...</span>
    </Box>
  );
};

export default DraftLoading;
