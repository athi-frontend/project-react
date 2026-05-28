import { SxProps, Theme } from '@mui/material'

/**
 * MonthYearPicker Component Styles
 * Classification: Confidential
 */

// Button styles for the month/year picker trigger
export const monthYearPickerButtonStyles: SxProps<Theme> = {
  width: '100%',
  height: '56px',
  border: (theme) => `1px solid ${theme.palette.divider}`,
  borderRadius: '4px',
  backgroundColor: (theme) => theme.palette.background.paper,
  color: (theme) => theme.palette.text.primary,
  justifyContent: 'space-between',
  padding: '0 16px',
  textTransform: 'none',
  fontSize: '16px',
  '&:hover': {
    backgroundColor: (theme) => theme.palette.action.hover,
    borderColor: (theme) => theme.palette.text.secondary
  },
  '&.error': {
    borderColor: (theme) => theme.palette.error.main
  }
}

// Button styles when there's an error
export const monthYearPickerButtonErrorStyles: SxProps<Theme> = {
  ...monthYearPickerButtonStyles,
  border: (theme) => `1px solid ${theme.palette.error.main}`,
  '&:hover': {
    backgroundColor: (theme) => theme.palette.action.hover,
    borderColor: (theme) => theme.palette.error.main
  }
}

// Button styles when placeholder is shown
export const monthYearPickerButtonPlaceholderStyles: SxProps<Theme> = {
  ...monthYearPickerButtonStyles,
  color: (theme) => theme.palette.text.disabled
}

// Label styles
export const monthYearPickerLabelStyles: SxProps<Theme> = {
  fontSize: '14px',
  fontWeight: 500,
  color: (theme) => theme.palette.text.primary,
  marginBottom: '8px'
}

// Error text styles
export const monthYearPickerErrorStyles: SxProps<Theme> = {
  color: (theme) => theme.palette.error.main,
  fontSize: '12px',
  marginTop: '4px'
}

// Popover container styles
export const monthYearPickerPopoverStyles: SxProps<Theme> = {
  zIndex: 2000,
  '& .MuiPopover-paper': {
    borderRadius: '8px',
    boxShadow: (theme) => theme.shadows[4],
    overflow: 'hidden'
  }
}

// Main picker container styles
export const monthYearPickerContainerStyles: SxProps<Theme> = {
  padding: '16px',
  backgroundColor: (theme) => theme.palette.background.default,
  minWidth: '280px'
}

// Year navigation container styles
export const monthYearPickerYearNavStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '16px',
  padding: '8px 0'
}

// Year navigation button styles
export const monthYearPickerYearNavButtonStyles: SxProps<Theme> = {
  backgroundColor: (theme) => theme.palette.background.paper,
  border: (theme) => `1px solid ${theme.palette.divider}`,
  '&:hover': {
    backgroundColor: (theme) => theme.palette.action.hover
  }
}

// Year text styles
export const monthYearPickerYearTextStyles: SxProps<Theme> = {
  fontSize: '18px',
  fontWeight: 600,
  color: (theme) => theme.palette.text.primary,
  minWidth: '80px',
  textAlign: 'center'
}

// Month calendar styles (reusing from existing calendar styles)
export const monthYearPickerCalendarStyles: SxProps<Theme> = {
  '& .MuiPickersMonth-monthButton': {
    fontSize: '14px',
    fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
    borderRadius: '6px',
    margin: '2px',
    minHeight: '36px',
    minWidth: '36px',
    '&:hover': {
      backgroundColor: (theme) => theme.palette.primary.light + '1A',
    },
    '&.Mui-selected': {
      backgroundColor: (theme) => theme.palette.primary.main,
      color: (theme) => theme.palette.primary.contrastText,
      fontWeight: 600,
      '&:hover': {
        backgroundColor: (theme) => theme.palette.primary.main,
      },
    },
  },
  '& .MuiMonthCalendar-root': {
    width: '100%',
    height: 'auto',
  },
}

// Icon styles for calendar icon
export const monthYearPickerIconStyles: SxProps<Theme> = {
  fontSize: '20px',
  color: (theme) => theme.palette.text.secondary
}

// Arrow icon styles
export const monthYearPickerArrowStyles: SxProps<Theme> = {
  fontSize: '16px'
}

// Disabled button styles
export const monthYearPickerDisabledButtonStyles: SxProps<Theme> = {
  ...monthYearPickerButtonStyles,
  backgroundColor: (theme) => theme.palette.action.disabledBackground,
  color: (theme) => theme.palette.text.disabled,
  cursor: 'not-allowed',
  '&:hover': {
    backgroundColor: (theme) => theme.palette.action.disabledBackground
  }
}

// Month button styles
export const monthYearPickerMonthButtonStyles: SxProps<Theme> = {
  minHeight: '40px',
  fontSize: '14px',
  fontWeight: 400,
  borderRadius: '8px',
  backgroundColor: (theme) => theme.palette.background.paper,
  color: (theme) => theme.palette.text.primary,
  border: (theme) => `1px solid ${theme.palette.divider}`,
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: (theme) => theme.palette.primary.light + '1A',
    borderColor: (theme) => theme.palette.primary.main
  },
  '&:disabled': {
    backgroundColor: (theme) => theme.palette.action.disabledBackground,
    color: (theme) => theme.palette.text.secondary,
    cursor: 'not-allowed'
  }
}

// Selected month button styles
export const monthYearPickerSelectedMonthButtonStyles: SxProps<Theme> = {
  ...monthYearPickerMonthButtonStyles,
  fontWeight: 600,
  backgroundColor: (theme) => theme.palette.primary.main,
  color: (theme) => theme.palette.primary.contrastText,
  border: 'none',
  '&:hover': {
    backgroundColor: (theme) => theme.palette.primary.main
  }
}

// Disabled month button styles
export const monthYearPickerDisabledMonthButtonStyles: SxProps<Theme> = {
  ...monthYearPickerMonthButtonStyles,
  backgroundColor: (theme) => theme.palette.action.disabledBackground,
  color: (theme) => theme.palette.text.secondary,
  cursor: 'not-allowed',
  '&:hover': {
    backgroundColor: (theme) => theme.palette.background.paper,
    borderColor: (theme) => theme.palette.divider
  }
}

// Month grid container styles
export const monthYearPickerMonthGridStyles: SxProps<Theme> = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '8px',
  padding: '16px'
}

// Main container styles
export const monthYearPickerMainContainerStyles: SxProps<Theme> = {
  width: '100%'
}