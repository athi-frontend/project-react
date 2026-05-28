import { styled, Box, TextField, Typography, Button } from '@mui/material'

export const FontSize24 = { fontSize: "24px" }
export const tableOverFlow = {
                maxHeight:400,
                overflow:"auto",
                scrollbarWidth:"none",
}
export const TableContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  '& .MuiDataGrid-columnSeparator': {
    display: ' none !important',
  },
  '& .MuiDataGrid-root': {
    border: '1px solid #D4D4D8',
    borderRadius: '12px',
    overflow: 'hidden',
  },

  '& .MuiDataGrid-columnHeaderTitle': {
    fontSize: '20px',
    fontWeight: 500,
  },
  '& .MuiDataGrid-row': {
    borderTop: 'none',
  },
  '& .MuiDataGrid-cell': {
    fontSize: '18px',
    display: 'flex'
  },
  '& .review-table-header': {
    fontSize: '20px',
    fontWeight: 500,
    color: '#262626',
  },
  '& .review-table-cell': {
    fontSize: '18px',
    color: '#3F3F46',
  },
  '& .status-table-header': {
    fontSize: '20px',
    fontWeight: 500,
    color: '#262626',
  },
  '& .status-table-cell': {
    fontSize: '18px',
    color: '#262626',
  },
}))

export const HeaderContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '16px',
}))

export const HeaderTitle = styled(Box)(({ theme }) => ({
  fontSize: '18px',
  fontWeight: 600,
}))

export const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    '& fieldset': {
      borderColor: '#E5E7EB',
    },
    '&:hover fieldset': {
      borderColor: '#D1D5DB',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#6366F1',
    },
  },
  '& .MuiInputBase-input': {
    padding: '10px 14px',
  },
}))

export const AddButton = styled(Button)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '8px 16px',
  borderRadius: '8px',
  fontSize: '14px',
  fontWeight: 500,
  cursor: 'pointer',
}))

export const RowContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  width: '100%',
  gap: '40px 100px',
  borderBottom: '1px solid var(--Default-stroke, #D8D8D8)',
  backgroundColor: '#FFF',
  minHeight: '74px',
  padding: '15px 40px',
  [theme.breakpoints.down('lg')]: {
    maxWidth: '100%',
    padding: '0 20px',
  },
}))

const sharedStyles = {
  alignSelf: 'stretch',
  minHeight: '40px',
  margin: 'auto 0',
  padding: '5px 0',
}

export const Cell = styled(Typography)(({ theme }) => ({
  ...sharedStyles,
  width: '150px',
  gap: '10px',
  color: 'rgba(51, 51, 51, 1)',
  whiteSpace: 'nowrap',
  fontSize: '18px',
  fontWeight: 400,
  [theme.breakpoints.down('lg')]: {
    whiteSpace: 'initial',
  },
}))

export const ActionCell = styled(Box)({
  ...sharedStyles,
  display: 'flex',
  alignItems: 'start',
  gap: '10px',
  justifyContent: 'start',
  width: '130px',
})
