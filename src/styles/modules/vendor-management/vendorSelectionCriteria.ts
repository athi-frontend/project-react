/**
 * Vendor Selection Criteria Styled Components
 * Classification: Confidential
 */

import { styled } from '@mui/material/styles';
import { Box, Button, Grid2 } from '@mui/material';

// Main Container
export const VendorSelectionCriteriaContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  borderRadius: '10px',
  overflow: 'hidden',
  justifyContent: 'start',
  background: theme.palette.background.default,
}));

// Form Container
export const FormContainer = styled(Box)(({ theme }) => ({
  padding: '24px',
  backgroundColor: theme.palette.background.paper,
  borderRadius: '8px',
  boxShadow: theme.shadows[2],
}));

// Grid Container Styles
export const GridContainerWithMargin = styled(Grid2)(({ theme }) => ({
  marginBottom: '16px',
}));

// Table Cell Components
export const EmptyTableCell = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  flex: 1,
}));

export const SnoTableCell = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  fontWeight: 500,
  flex: 1,
}));

export const CriteriaTableCell = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isParent',
})<{ isParent: boolean }>(({ theme, isParent }) => ({
  paddingLeft: isParent ? '0px' : '30px',
}));

// Table Wrapper
export const TableWrapper = styled(Box)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: '8px',
  overflow: 'hidden',
}));

// Modal Content
export const ModalContent = styled(Box)(({ theme }) => ({
  padding: '24px',
  minWidth: '500px',
}));

// Button Styles
export const PrimaryButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

export const SecondaryButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  color: theme.palette.text.primary,
  '&:hover': {
    backgroundColor: theme.palette.grey[200],
  },
}));

// Table Row Styles
export const ParentTableRow = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.light,
  fontWeight: 600,
}));

export const ChildTableRow = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

// Input Field Styles
export const DropdownField = styled(Box)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '4px',
  },
}));

export const ErrorField = styled(Box)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderColor: theme.palette.error.main,
  },
}));

// Spacing Constants
export const SPACING = {
  SMALL: '8px',
  MEDIUM: '16px',
  LARGE: '24px',
  XLARGE: '32px',
} as const;

export const AddIconStyle = {
  fontSize: '16px',
};

export const dragComponent = { width: '100%', height: '100%', display: 'flex', alignItems: 'center' }