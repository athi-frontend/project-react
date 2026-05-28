/**
 * Vendor Re-Evaluation Criteria Styled Components
 * Classification: Confidential
 */

import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
import { Input_Field } from '@/styles/modules/hr/inductionTraining';
import { UnderLine } from '@/styles/common';

// Criteria Table Cell with parent/child distinction
export const CriteriaTableCell = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isParent',
})<{ isParent: boolean }>(({ isParent }) => ({
  fontWeight: isParent ? 'bold' : 'normal',
  paddingLeft: isParent ? '0px' : '24px',
}));

// Common centered cell styles
const CENTERED_CELL_BASE = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  height: '100%',
} as const;

// Centered Rating Cell Style
export const RATING_CELL_STYLE = {
  ...Input_Field,
  ...CENTERED_CELL_BASE,
} as const;

// Centered Overall Rating Cell Style
export const OVERALL_RATING_CELL_STYLE = {
  ...CENTERED_CELL_BASE,
} as const;


export const buttonStyle = (theme)=>({
  ...UnderLine, 
  textTransform: 'none',
  border:"none",
  color: theme.palette.text.primary,            // Custom text color
  '&.Mui-disabled': {
    color: theme.palette.text.secondary,   
    border:"none",         // Custom text color
  }
})