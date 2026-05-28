'use client'
import { styled } from '@mui/material/styles'
import { Box, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'

const flexBox = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}

export const ProjectStyles = {
  table: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingRight: '40px',
  }, "text": { width: '100%', alignItems: 'center' }
}
const fullWidth = {
  width: '100%',
}

const TableContainer = styled(Box)(({ theme }) => ({
  ...fullWidth,
  ...flexBox,
  flexDirection: 'column',
  borderRadius: '10px',
  backgroundColor: theme.palette.background.paper,
  paddingBottom : '40px',
  border: '1px solid var(--Default-stroke, #D8D8D8)',
  overflow: 'hidden',
  position: 'relative',
  zIndex: 0,
  [theme.breakpoints.down('lg')]: { maxWidth: '100%' },
}))

const DataGridContainer = styled(Box)({
  ...fullWidth,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'start',
  padding: '0 40px',
})

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  borderRadius: '10px',
  '& .MuiDataGrid-columnHeader, .MuiDataGrid-filler': {
    backgroundColor: theme.palette.text.main,
  },
  '& .MuiDataGrid-cell': {
    borderBottom: `1px solid ${theme.palette.background.paper}`,
  },
  '& .MuiDataGrid-row': {
    backgroundColor: theme.palette.background.paper,
    '&:nth-of-type(even), &:nth-of-type(odd), &.inactive': {
      backgroundColor: theme.palette.background.paper,
    },
  },
}))

const TableHeader = styled(Box)(({ theme }) => ({
  ...flexBox,
  flexWrap: 'wrap',
  ...fullWidth,
  padding: '20px 40px',
  borderRadius: '10px 10px 0px 0px',
  border: '1px solid var(--Default-stroke, #D8D8D8)',
  backgroundColor: '#F5E9FF',
  color: 'rgba(51, 51, 51, 1)',
  [theme.breakpoints.down('lg')]: {
    maxWidth: '100%',
    whiteSpace: 'initial',
    padding: '0 20px',
  },
}))

const HeaderCell = styled(Typography)({
  fontSize: '20px',
  fontWeight: 500,
  padding: '5px 0',
})

const RowContainer = styled(Box)(({ theme }) => ({
  ...flexBox,
  flexWrap: 'wrap',
  ...fullWidth,
  minHeight: '74px',
  gap: '40px 100px',
  padding: '15px 40px',
  borderBottom: '1px solid var(--Default-stroke, #D8D8D8)',
  backgroundColor: '#FFF',
  [theme.breakpoints.down('lg')]: { padding: '0 20px' },
}))

const Cell = styled(Typography)(({ theme }) => ({
  width: '150px',
  minHeight: '40px',
  padding: '5px 0',
  fontSize: '18px',
  fontWeight: 400,
  color: 'rgba(51, 51, 51, 1)',
  whiteSpace: 'nowrap',
  margin: 'auto 0',
  [theme.breakpoints.down('lg')]: { whiteSpace: 'initial' },
}))

const FooterContainer = styled(Box)(({ theme }) => ({
  ...flexBox,
  borderRadius: '0px 0px 10px 10px',
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.text.main,
  gap: '10px',
  padding: '10px',
  [theme.breakpoints.down('md')]: {
    maxWidth: '100%',
    flexDirection: 'column',
    alignItems: 'stretch',
  },
}))

const PageSizeSelector = styled(Box)(({ theme }) => ({
  ...flexBox,
  gap: '10px',
  [theme.breakpoints.down('md')]: { justifyContent: 'center' },
}))

export const pageSizeSelectorStyles = {
  border: '1px solid #fff',
  paddingLeft: 1,
  paddingRight: 0.5,
  borderRadius: 2,
}

export const selectStyles = {
  border: 'none',
  '& fieldset': { border: 'none' },
  '&:hover fieldset': { border: 'none' },
  '&.Mui-focused fieldset': { border: 'none' },
}

export const paginationStyles = {
  '& .MuiPaginationItem-root': {
    borderRadius: '4px',
  },
}

export {
  TableContainer,
  DataGridContainer,
  StyledDataGrid,
  TableHeader,
  HeaderCell,
  RowContainer,
  Cell,
  FooterContainer,
  PageSizeSelector,
}
