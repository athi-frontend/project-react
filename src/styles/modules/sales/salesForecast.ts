import { SxProps, Theme } from '@mui/material'

/**
 * Sales Forecast Component Styles
 * Classification: Confidential
 */

export const SalesForecastHeaderStyles: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}

export const SalesForecastButtonContainerStyles: SxProps<Theme> = {
  display: 'flex',
  gap: '12px',
  alignItems: 'center',
  justifyContent: 'flex-end',
  paddingRight: '40px',
}

export const SalesForecastAddNewButtonStyles: SxProps<Theme> = {
  backgroundColor: (theme) => theme.palette.background.paper,
  borderColor: (theme) => theme.palette.primary.main,
  color: (theme) => theme.palette.primary.main,
  textTransform: 'none',
  borderRadius: '8px',
  padding: '8px 16px',
  gap: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '40px',
  width: '130px',
  '&:hover': {
    borderColor: (theme) => theme.palette.primary.main,
    backgroundColor: (theme) => theme.palette.primary.light + '04'
  }
}

export const SalesForecastTableContainerStyles: SxProps<Theme> = {
  padding: '0 20px 40px 40px'
}

export const SalesForecastMonthCellStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  padding: '8px 16px',
  backgroundColor: (theme) => theme.palette.background.paper,
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: (theme) => theme.palette.primary.light + '04'
  }
}

export const SalesForecastMonthCellTextStyles: SxProps<Theme> = {
  fontSize: '18px',
  color: (theme) => theme.palette.text.primary
}

export const SalesForecastEditIconContainerStyles: SxProps<Theme> = {
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  padding: '4px',
  borderRadius: '4px',
  '&:hover': {
    backgroundColor: (theme) => theme.palette.primary.light + '04'
  }
}
