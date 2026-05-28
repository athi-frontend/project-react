import { Box, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'

/**
 * Classification : Confidential
 **/

export const LocationDetailsHeader = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  borderRadius: '10px 10px 0 0',
  padding: '25px 40px',
  minHeight: '85px',
  display: 'flex',
  alignItems: 'center',
}))

export const LocationDetailsContent = styled(Box)(({ theme }) => ({
  backgroundColor: '#F5E9FF',
  borderRadius: '0 0 10px 10px',
  border: '1px solid #D8D8D8',
  borderTop: 'none',
}))

export const LocationDetailsCell = styled(Box)(({ theme }) => ({
  borderRight: '1px solid #D8D8D8',
  borderBottom: '1px solid #D8D8D8',
  padding: '35px 40px',
  minHeight: '100px',
  display: 'flex',
  alignItems: 'center',
  '&:nth-child(even)': {
    borderRight: 'none',
  },
  '&:nth-last-child(-n+2)': {
    borderBottom: 'none',
  },
}))

export const LocationDetailsLabel = styled(Typography)(({ theme }) => ({
  fontSize: '20px',
  fontWeight: 500,
  color: '#222',
  fontFamily: 'Poppins, sans-serif',
}))

export const LocationDetailsValue = styled(Typography)(({ theme }) => ({
  fontSize: '18px',
  fontWeight: 400,
  color: '#999',
  fontFamily: 'Poppins, sans-serif',
}))

export const DetailsTitle = styled(Typography)(({ theme }) => ({
  fontSize: '24px',
  fontWeight: 600,
  color: theme.palette.text.primary,
  fontFamily: 'Poppins, sans-serif',
  marginBottom: '20px',
  marginTop: '20px',
}))

export const VIEW_DETAILS_LINK_STYLE: React.CSSProperties = {
  textDecoration: 'underline',
  cursor: 'pointer',
  paddingTop: '14px',
}

export const LocationDetailsHeaderTypography = {
  color: '#fff',
  fontSize: '24px',
  fontWeight: 500,
  fontFamily: 'Poppins, sans-serif',
}

export const BORDER_RIGHT_NONE = {
  borderRight: 'none',
}

export const BORDER_BOTTOM_NONE = {
  borderBottom: 'none',
}

export const BORDER_RIGHT_AND_BOTTOM_NONE = {
  borderRight: 'none',
  borderBottom: 'none',
}

export const MARGIN_TOP_20 = {
  marginTop: '20px',
}
