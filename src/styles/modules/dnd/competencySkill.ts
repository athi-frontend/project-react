import { Box, styled, SxProps, Theme } from '@mui/material'

export const FormContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
}))

export const FormHeader = styled(Box)(({ theme }) => ({
  alignSelf: 'stretch',
  minHeight: '104px',
  width: '100%',
  padding: '40px',
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
  fontSize: '24px',
  color: '#111827',
  fontWeight: '600',
  lineHeight: '1',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
    padding: '20px',
  },
}))
export const displayNone: SxProps<Theme> = {
  display: 'none',
}

export const PageContainer = styled(Box)({
  padding: '20px',
  width: '100%',
})

export const FormContent = styled(Box)(({ theme }) => ({
  width: '100%',
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
  fontWeight: '400',
  padding: '0 40px 40px',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
    padding: '0 20px 20px',
  },
}))

export const SkillSetContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  marginTop: '20px',
  marginBottom: '20px',
}))

export const SkillSetHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'space-between',
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
  fontWeight: '400',
  marginBottom: '20px',
}))

export const SkillSetTitle = styled(Box)(({ theme }) => ({
  fontSize: '18px',
  lineHeight: '1',
}))

export const TableWrapper = styled(Box)(({ theme }) => ({
  borderRadius: '20px',
  border: '1px solid rgba(216, 216, 216, 1)',
  width: '100%',
  overflow: 'hidden',
  '& .MuiDataGrid-columnHeaders': {
    borderRadius: '10px 10px 0px 0px',
    borderBottom: '1px solid var(--Default-stroke, #D8D8D8)',
    backgroundColor: '#F5E9FF',
    minHeight: '80px',
    fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
    fontSize: '20px',
    color: 'rgba(51, 51, 51, 1)',
    fontWeight: '500',
  },
  '& .MuiDataGrid-cell': {
    fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
    fontSize: '18px',
    color: 'rgba(51, 51, 51, 1)',
    fontWeight: '400',
    borderBottom: '1px solid var(--Default-stroke, #D8D8D8)',
    padding: '8px 16px',
  },
  '& .MuiDataGrid-row': {
    minHeight: '70px',
  },
  '& .MuiDataGrid-row:last-child .MuiDataGrid-cell': {
    borderBottom: 'none',
  },
  '& .MuiDataGrid-virtualScroller': {
    backgroundColor: '#FFF',
  },
  '& .MuiDataGrid-footerContainer': {
    display: 'none',
  },
}))

export const InlineStyles = {
  hiddenInput: {
    display: 'none',
  },
  errorCaption: {
    color: 'red',
    fontSize: '12px',
  },
  boxStyle: {
    display: 'flex',
    gap: '8px',
  },
}