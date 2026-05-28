import { SxProps, Theme } from '@mui/material/styles'
import { Box, styled, Typography } from '@mui/material'

export const BoxContainer: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
}
export const HeaderContainer = styled(Box)(({ theme }) => ({
  paddingTop: '10px',
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
}))

export const HeaderTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontSize: '24px',
  fontWeight: '600',
}))

export const GridColumn: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  '& .MuiBox-root:first-of-type': {
    minHeight: '52px',
    '& p': {
      minHeight: '52px',
    }
  },
}
export const GridSecondColumn: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  '& .MuiBox-root:first-of-type': {
    minHeight: '48px',
     '& p': {
      minHeight: '48px',
    }
  },
}

export const GridFourColumn: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  '& .MuiBox-root:first-of-type': {
    minHeight: '72px',
  },
}

export const GridThirdColumn: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  '& .MuiBox-root:first-of-type': {
    minHeight: '61px',
  },
}

export const AnnexureBoxContainer: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 1,
  cursor: 'pointer',
  width: 'fit-content',
}

export const ListContainer: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: 1,
}

export const EventContainer: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%'
}

export const LabelContainer: SxProps<Theme> = {
  width: '48%'
}
export const DurationContainer: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
  fontSize: '12px',
  color: '#444',
  marginTop: '2px'
}

export const DurationTypography: SxProps<Theme> = {
  fontSize: '20px', 
  fontWeight: 500
}

export const FLEX_ROW = { display: "flex" };
// Add other extracted style objects here as needed