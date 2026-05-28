/**
 * Vendor Selection Table Styled Components
 * Classification: Confidential
 */

import { styled } from '@mui/material/styles';
import { Box, Chip, Table, TableHead, TableCell, IconButton } from '@mui/material';
import type { SxProps } from '@mui/system';
import { NUMBERMAP } from '@/constants/common';

// Status Chip
export const StatusChip = styled(Chip)<{ status: 'Pass' | 'Fail'; clickable?: boolean }>(
  ({ status, clickable, theme }) => ({
    borderRadius: `${NUMBERMAP.FOUR}px`,
    minHeight: `${NUMBERMAP.TWENTYFIVE}px`,
    width: `${NUMBERMAP.FIFTY + NUMBERMAP.FOUR}px`,
    fontSize: `${NUMBERMAP.TEN}px`,
    fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
    fontWeight: NUMBERMAP.FOURHUNDRED,
    padding: `${NUMBERMAP.ZERO} ${NUMBERMAP.TEN}px`,
    height: `${NUMBERMAP.TWENTYFIVE}px`,
    cursor: clickable ? 'pointer' : 'default',
    '& .MuiChip-label': {
      padding: NUMBERMAP.ZERO,
    },
    ...(status === null && {
      backgroundColor: theme.palette.text.disabled,
      color: '#ffffff',
    }),
    ...(status === 'Pass' && {
      backgroundColor: theme.palette.success.main,
      color: '#ffffff',
    }),
    ...(status === 'Fail' && {
      backgroundColor: theme.palette.error.main,
      color: '#ffffff',
    }),
  })
);

// Edit Icon Button
export const EditIconButton = styled(IconButton)({
  padding: `${NUMBERMAP.FOUR}px`,
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
});

// Edit Icon Wrapper
export const EditIconWrapper = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
});

// Table Wrapper
export const TableWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.background.default,
  borderRadius: `${NUMBERMAP.TEN}px`,
  overflow: 'hidden',
  border: `1px solid ${theme.palette.border.main}`,
  borderBottom: 'none',

}));

// Scrollable Container
export const ScrollableContainer = styled(Box)({
  overflowX: 'auto',
  overflowY: 'auto',
  width: '100%',
  maxHeight: `${NUMBERMAP.SIX * NUMBERMAP.HUNDRED}px`,

  '&::-webkit-scrollbar': {
    height: `${NUMBERMAP.EIGHT}px`,
    width: `${NUMBERMAP.EIGHT}px`,
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: '#f1f1f1',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: '#d8d8d8',
    borderRadius: `${NUMBERMAP.FOUR}px`,
    '&:hover': {
      backgroundColor: '#a0a0a0',
    },
  },
});

// Styled Table Head
export const StyledTableHead = styled(TableHead)({
  position: 'sticky',
  top: NUMBERMAP.ZERO,
  zIndex: NUMBERMAP.ELEVEN,
});

// Header Table Cell
export const HeaderTableCell = styled(TableCell)(({ theme }) => ( {
  backgroundColor: theme.palette.background.default,
  borderBottom: `1px solid ${theme.palette.border.main}`,
  borderRight: `1px solid ${theme.palette.border.main}`,
  padding: `${NUMBERMAP.TWENTY}px ${NUMBERMAP.FORTY}px`,
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
  fontSize: `${NUMBERMAP.TWENTY}px`,
  fontWeight: NUMBERMAP.FIVEHUNDRED,
  color: theme.palette.text.primary,
  textAlign: 'center',
  whiteSpace: 'nowrap',

  '&:last-child': {
    borderRight: 'none',
  },
}));

export const GROUP_HEADER_CELL_SX: SxProps = {
  padding: NUMBERMAP.ZERO,
};

// Sticky Header Cell
export const StickyHeaderCell = styled(HeaderTableCell)(({ theme }) => ({
  position: 'sticky',
  zIndex: NUMBERMAP.TWELVE,
  backgroundColor: theme.palette.background.default,
}));

// SNO Header Cell
export const SnoHeaderCell = styled(StickyHeaderCell)({
  left: NUMBERMAP.ZERO,
  minWidth: `${NUMBERMAP.FIFTY}px`,
  width: `${NUMBERMAP.FIFTY}px`,
});

// Spec Header Cell
export const SpecHeaderCell = styled(StickyHeaderCell)({
  left: `${NUMBERMAP.FIFTY}px`,
  minWidth: `${NUMBERMAP.TWOFOURTY}px`,
});

// Sample Header Cell
export const SampleHeaderCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  borderBottom: `1px solid ${theme.palette.border.main}`,
  borderRight: `1px solid ${theme.palette.border.main}`,
  padding: `${NUMBERMAP.TEN}px`,
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
  fontSize: `${NUMBERMAP.EIGHTEEN}px`,
  fontWeight: NUMBERMAP.FOURHUNDRED,
  color: theme.palette.text.primary,
  textAlign: 'center',
  minWidth: `${NUMBERMAP.FIFTY + NUMBERMAP.FOURTEEN}px`,
  width: `${NUMBERMAP.FIFTY + NUMBERMAP.FOURTEEN}px`,

  '&:last-child': {
    borderRight: 'none',
  },
}));

// Body Table Cell
export const BodyTableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.border.main}`,
  borderRight: `1px solid ${theme.palette.border.main}`,
  padding: `${NUMBERMAP.FIFTEEN}px ${NUMBERMAP.FORTY}px`,
  textAlign: 'center',
  verticalAlign: 'middle',
  backgroundColor: theme.palette.background.paper,
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',

  '&:last-child': {
    borderRight: 'none',
  },
}));

// Sticky Body Cell
export const StickyBodyCell = styled(BodyTableCell)(({ theme }) => ({
  position: 'sticky',
  zIndex: NUMBERMAP.NINE,
  backgroundColor: theme.palette.background.default,
}));

// SNO Body Cell
export const SnoBodyCell = styled(StickyBodyCell)(({ theme }) => ({
  left: NUMBERMAP.ZERO,
  minWidth: `${NUMBERMAP.FIFTY}px`,
  width: `${NUMBERMAP.FIFTY}px`,
  fontSize: `${NUMBERMAP.TWENTY}px`,
  fontWeight: NUMBERMAP.FIVEHUNDRED,
  color: theme.palette.text.primary,
}));

// Spec Body Cell
export const SpecBodyCell = styled(StickyBodyCell)({
  left: `${NUMBERMAP.FIFTY}px`,
  minWidth: `${NUMBERMAP.TWOFOURTY}px`,
  textAlign: 'left',
  fontSize: `${NUMBERMAP.TWENTY}px`,
  fontWeight: NUMBERMAP.FIVEHUNDRED,
  color: '#333333',
});

// Sample Body Cell
export const SampleBodyCell = styled(BodyTableCell)({
  minWidth: `${NUMBERMAP.FIFTY + NUMBERMAP.FOURTEEN}px`,
  width: `${NUMBERMAP.FIFTY + NUMBERMAP.FOURTEEN}px`,
  padding: `${NUMBERMAP.FIVE}px`,
  fontSize: `${NUMBERMAP.TEN}px`,
  minHeight: `${NUMBERMAP.SEVENTY}px`,
});

// Styled Table
export const StyledTable = styled(Table)({
  borderCollapse: 'collapse',
  width: '100%',
});

// Sample Cell Content
export const SampleCellContent = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  minHeight: `${NUMBERMAP.FIFTY + NUMBERMAP.TEN}px`,
});

