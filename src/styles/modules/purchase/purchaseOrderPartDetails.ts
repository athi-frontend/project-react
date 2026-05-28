import { styled, Box, SxProps } from '@mui/material'

/**
 * Classification: Confidential
 */

export const PartDetailsContainer = styled(Box)(({ theme }) => ({
  padding: '0 40px',
  width: '100%',
  '@media (max-width: 991px)': {
    padding: '0 20px',
  },
}))

export const PartDetailsHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  padding: '20px 0',
  alignItems: 'center',
  gap: '100px',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  '@media (max-width: 991px)': {
    gap: '40px',
  },
}))

export const PartDetailsTitle = styled(Box)(({ theme }) => ({
  fontSize: '24px',
  fontWeight: 600,
  lineHeight: 1,
}))

export const AddNewButton = styled(Box)(({ theme }) => ({
  alignItems: 'center',
  borderRadius: '10px',
  border: '1px solid #652D90',
  display: 'flex',
  minHeight: '45px',
  padding: '8px 20px',
  gap: '20px',
  overflow: 'hidden',
  fontSize: '20px',
  fontWeight: 500,
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: '#652D90',
    color: '#FFF',
    '& img': {
      filter: 'brightness(0) invert(1)',
    },
  },
}))

export const TableWrapper = styled(Box)(({ theme }) => ({
  borderRadius: '10px',
  display: 'flex',
  width: '100%',
  maxWidth: '1477px',
  flexDirection: 'column',
  overflow: 'hidden',
}))

export const StatusIndicator = styled(Box)<{ active?: boolean }>(({ active }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '5px',
  fontSize: '20px',
  color: active ? '#00A006' : '#EA1616',
  lineHeight: 'normal',
}))

export const StatusDot = styled(Box)<{ active?: boolean }>(({ active }) => ({
  backgroundColor: active ? '#00A006' : '#EA1616',
  borderRadius: '50%',
  width: '10px',
  height: '10px',
}))

export const CalculationSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  flexDirection: 'column',
  fontWeight: 400,  
}))

export const CalculationRow = styled(Box)<{ isReadOnly?: boolean }>(({ isReadOnly, theme }) => ({
  borderBottom: '1px solid #D8D8D8',
  borderLeft: '1px solid #D8D8D8',

  backgroundColor: theme.palette.background.default,
  display: 'flex',
  minHeight: '70px',
  width: '100%',
  paddingLeft: '40px',
  fontSize: '18px',
  flexWrap: 'wrap',
  '@media (max-width: 991px)': {
    paddingLeft: '20px',
  },
}))

export const CalculationLabel = styled(Box)(({ theme }) => ({
  borderRight: '1px solid #D8D8D8',
  display: 'flex',
  minWidth: '240px',
  padding: '5px 0',
  alignItems: 'center',
  gap: '10px',
  // color: '#333',
  flexGrow: 1,
  width: '50%',
  '@media (max-width: 991px)': {
    width: '50%',
  },
}))

export const CalculationValue = styled(Box)(({ theme }) => ({
  borderRight: '1px solid #D8D8D8',
  display: 'flex',
  minWidth: '240px',
  minHeight: '70px',
  padding: '9px 10px',
  alignItems: 'center',
  gap: '10px',
  // color: '#999',
  flexGrow: 1,
  width: '306px',
  '@media (max-width: 991px)': {
    width: '100%',
  },
}))

export const CalculationInput = styled(Box)(({ theme }) => ({
  borderRadius: '5px',
  display: 'flex',
  // minWidth: '240px',
  minHeight: '42px',
  // width: '100%',
  // padding: '0 20px',
  alignItems: 'center',
  gap: '10px',
  flex: 1,

}))

export const ReadOnlyValue = styled(Box)(({ theme }) => ({
  padding: '0 22px',
  fontSize: '16px',
  color: '#999',
  whiteSpace: 'nowrap',
}))

export const PART_DETAILS_GRID_STYLES: SxProps = {
  border: 'none',
  '& .MuiDataGrid-root': {
    borderBottom: 'none',
    borderBottomLeftRadius: '0',
    borderBottomRightRadius: '0',
  },
 
}
