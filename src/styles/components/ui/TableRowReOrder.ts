import { styled, Box } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { DataGrid } from '@mui/x-data-grid';

export const TableContainer = styled(Box)(({ theme }) => ({
  width: '100%',
}));

export const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  border: `1px solid ${theme.palette.background.main}`,
  borderRadius: '10px',
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
  position: 'relative',

  '& .MuiDataGrid-columnHeaders': {
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
    borderRadius: '10px 10px 0px 0px',
    fontSize: '20px',
    color: theme.palette.text.primary,
    fontWeight: '500',
    fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',

    '& .MuiDataGrid-columnHeader': {
      paddingLeft: '20px',
      paddingRight: '20px',
      '@media (max-width: 991px)': {
        paddingLeft: '10px',
        paddingRight: '10px',
      },
    },
  },

  '& .MuiDataGrid-columnHeaderTitle': {
    fontSize: '20px',
    color: theme.palette.text.primary,
    fontWeight: '500',
    fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
  },

  '& .MuiDataGrid-row': {
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${alpha(theme.palette.text.primary, 0.12)}`,
    borderTop: 'none',
    position: 'relative',

    '&:hover': {
      backgroundColor: alpha(theme.palette.text.primary, 0.04),
    },

    '&.dragging': {
      opacity: 0.5,
      backgroundColor: alpha(theme.palette.primary.main, 0.12),
      transform: 'scale(0.98)',
      transition: 'transform 0.2s ease',
    },

    '&.drag-over': {
      backgroundColor: alpha(theme.palette.primary.main, 0.08),
      borderTop: `3px solid ${theme.palette.primary.main}`,
    },

    '&.drag-over-bottom': {
      backgroundColor: alpha(theme.palette.primary.main, 0.08),
      borderBottom: `3px solid ${theme.palette.primary.main}`,
    },
  },

  '& .MuiDataGrid-cell': {
    paddingLeft: '20px',
    paddingRight: '20px',
   
    fontSize: '18px',
    color: theme.palette.text.primary,
    fontWeight: '400',
    fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
    borderBottom: 'none',
    '@media (max-width: 991px)': {
      paddingLeft: '10px',
      paddingRight: '10px',
    },
  },

  '& .MuiDataGrid-footerContainer': {
    display: 'none',
  },

  '& .MuiDataGrid-columnSeparator': {
    display: 'none',
  },

  '& .MuiDataGrid-virtualScroller': {
    '&::-webkit-scrollbar': {
      display: 'none',
    },
    scrollbarWidth: 'none',
  },
}));

export const ActionsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  justifyContent: 'start',
}));

export const ActionIcon = styled('img')(({ theme }) => ({
  aspectRatio: '1',
  objectFit: 'contain',
  objectPosition: 'center',
  width: '24px',
  height: '24px',
  cursor: 'pointer',
  transition: 'opacity 0.2s ease',

  '&:hover': {
    opacity: 0.7,
  },
}));

export const DragHandle = styled(Box)(({ theme }) => ({
  borderRadius: '50px',
  backgroundColor: theme.palette.primary.main,
  position: 'absolute',
  zIndex: 10,
  display: 'flex',
  minHeight: '30px',
  width: '30px',
  paddingLeft: '5px',
  paddingRight: '5px',
  alignItems: 'center',
  gap: '10px',
  justifyContent: 'center',
  height: '30px',
  left: '-15px',
  cursor: 'grab',
  opacity: 0,
  transition: 'opacity 0.2s ease',

  '&.visible': {
    opacity: 1,
  },

  '&:active': {
    cursor: 'grabbing',
  },

  '& img': {
    aspectRatio: '1',
    objectFit: 'contain',
    objectPosition: 'center',
    width: '20px',
    height: '20px',
  },
}));

export const TableWrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
  },
}));

export const DataGridReOrderTableStyles = {
  draggingRow: {
    opacity: 0.5,
    backgroundColor: '#e3f2fd',
    transform: 'scale(0.98)',
  },
  dragOverRow: {
    borderTop: '2px solid #1976d2',
  },
  dragOverBottomRow: {
    borderBottom: '2px solid #1976d2',
  },
  dragHandleContainer: {
    width: '100%',
    height: '100%',
  },
  dragHandleTransform: {
    transform: 'translateY(-50%)',
  },
  dragHandleButton: {
    background: 'none',
    border: 'none',
    padding: 0,
    boxShadow: 'none',
    color: 'inherit',
    font: 'inherit',
    cursor: 'pointer',
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
} as const;


export const getDragHandleStyle = (top: number) => ({
  top: `${top}px`,
  ...DataGridReOrderTableStyles.dragHandleTransform,
})

export const getDragHandlerCriteriaTable = (position:number)=>({
          top: `${position}px`,
          ...DataGridReOrderTableStyles.dragHandleTransform,
        })