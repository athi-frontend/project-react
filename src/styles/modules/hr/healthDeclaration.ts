import { Box, styled } from '@mui/material'

export const FormContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
  },
}))

export const SectionHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  minHeight: '85px',
  width: '100%',
  paddingLeft: '20px',
  paddingRight: '20px',
  paddingTop: '20px',
  paddingBottom: '20px',
  alignItems: 'center',
  gap: '40px 100px',
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '1',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
    paddingLeft: '20px',
    paddingRight: '20px',
  },
}))

export const SectionContent = styled(Box)(({ theme }) => ({
  width: '100%',
  paddingLeft: '20px',
  paddingRight: '20px',
  marginBottom:"20px",
  '@media (max-width: 991px)': {
    maxWidth: '100%',
    paddingLeft: '20px',
    paddingRight: '20px',
  },
}))

export const EmployeeInfoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  minWidth: '240px',
  paddingRight: '80px',
  paddingBottom: '21px',
  flexDirection: 'column',
  alignItems: 'start',
  flexGrow: 1,
  flexShrink: 1,
  '@media (max-width: 991px)': {
    maxWidth: '100%',
  },
}))

export const InfoLabel = styled(Box)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontSize: '18px',
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
  fontWeight: '400',
}))

export const InfoValue = styled(Box)(({ theme }) => ({
  color: '#999',
  fontSize: '16px',
  marginTop: '28px',
}))

export const FileInfoHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  minHeight: '37px',
  width: '100%',
  alignItems: 'center',
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
  fontSize: '18px',
  color: '#222',
  fontWeight: '400',
  justifyContent: 'start',
  flexWrap: 'wrap',
  marginTop: '20px',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
  },
}))

export const FileTableWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
  },
}))

export const FileTableContainer = styled(Box)(({ theme }) => ({
  borderRadius: '10px',
  borderColor: 'rgba(216, 216, 216, 1)',
  borderStyle: 'solid',
  borderWidth: '1px',
  marginTop: '10px',
  width: '100%',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
  },
}))

export const FileTableHeader = styled(Box)(({ theme }) => ({
  justifyContent: 'space-between',
  alignItems: 'center',
  borderRadius: '10px 10px 0px 0px',
  borderBottom: '1px solid var(--Default-stroke, #D8D8D8)',
  backgroundColor: '#F5E9FF',
  display: 'flex',
  minHeight: '80px',
  width: '100%',
  paddingLeft: '40px',
  paddingRight: '40px',
  paddingTop: '22px',
  paddingBottom: '22px',
  gap: '40px 100px',
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
  fontSize: '18px',
  color: 'rgba(34, 34, 34, 1)',
  fontWeight: '500',
  flexWrap: 'wrap',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
    paddingLeft: '20px',
    paddingRight: '20px',
  },
}))

export const FileTableHeaderCell = styled(Box)<{ width: string }>(
  ({ theme, width }) => ({
    alignSelf: 'stretch',
    marginTop: 'auto',
    marginBottom: 'auto',
    paddingTop: '5px',
    paddingBottom: '5px',
    gap: '10px',
    width: width,
    whiteSpace: 'nowrap',
    '@media (max-width: 991px)': {
      whiteSpace: 'initial',
    },
  })
)

export const FileTableRow = styled(Box)(({ theme }) => ({
  justifyContent: 'space-between',
  alignItems: 'center',
  borderBottom: '1px solid var(--Default-stroke, #D8D8D8)',
  backgroundColor: '#FFF',
  display: 'flex',
  minHeight: '70px',
  width: '100%',
  paddingLeft: '40px',
  paddingRight: '40px',
  paddingTop: '13px',
  paddingBottom: '13px',
  gap: '40px 100px',
  flexWrap: 'wrap',
  '&:last-child': {
    borderRadius: '0px 0px 10px 10px',
    borderBottom: 'none',
  },
  '@media (max-width: 991px)': {
    maxWidth: '100%',
    paddingLeft: '20px',
    paddingRight: '20px',
  },
}))

export const FileTableCell = styled(Box)<{ width: string }>(
  ({ theme, width }) => ({
    alignSelf: 'stretch',
    marginTop: 'auto',
    marginBottom: 'auto',
    paddingTop: '5px',
    paddingBottom: '5px',
    gap: '10px',
    fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
    fontSize: '18px',
    color: 'rgba(51, 51, 51, 1)',
    fontWeight: '400',
    whiteSpace: 'nowrap',
    width: width,
    '@media (max-width: 991px)': {
      whiteSpace: 'initial',
    },
  })
)

export const ActionButtonsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  justifyContent: 'start',
}))

export const ButtonContainer = styled(Box)(({ theme }) => ({
  marginTop: '40px',
  width: '100%',
  alignItems: 'center',
}))

export const PageContainer = styled(Box)({
  padding: "0",
  width: "100%",
});
export const MARGINTOP={ marginTop: "40px" }
export const MARGINTOP2={ marginTop: "20px" }
export const STYLE={ marginRight: "20px", width: "100%" }