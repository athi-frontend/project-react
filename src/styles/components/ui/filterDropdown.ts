import { SxProps, Theme } from '@mui/material'

// Base button styles for reuse
const BaseButtonStyles: SxProps<Theme> = {
  textTransform: 'none',
  borderRadius: '4px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}

export const FilterButtonStyles: SxProps<Theme> = {
  ...BaseButtonStyles,
  backgroundColor: (theme) => theme.palette.background.paper,
  borderColor: (theme) => theme.palette.primary.main,
  color: (theme) => theme.palette.primary.main,
  gap: '8px',
  minHeight: '42px',
  borderRadius: '8px',
  '&:hover': {
    borderColor: (theme) => theme.palette.primary.main,
    backgroundColor: (theme) => theme.palette.primary.light + '04'
  }
}

export const FilterPanelStyles: SxProps<Theme> = {
  position: 'absolute',
  top: '100%',
  right: 0,
  zIndex: 1000,
  backgroundColor: (theme) => theme.palette.background.paper,
  borderRadius: '4px',
  boxShadow: (theme) => theme.shadows[4],
  padding: '20px',
  width: { xs: 'calc(100vw - 40px)', sm: '400px', md: '500px', lg: '620px' },
  maxWidth: '620px',
  marginTop: '8px'
}

// Common margin styles for reuse
const SectionMarginBottom: SxProps<Theme> = {
  marginBottom: '20px'
}

const FieldMarginBottom: SxProps<Theme> = {
  marginBottom: '16px'
}

export const PeriodSelectionStyles: SxProps<Theme> = {
  ...SectionMarginBottom
}

export const ToggleButtonGroupStyles: SxProps<Theme> = {
  width: '100%',
  display: 'flex',
  '& .MuiToggleButton-root': {
    flex: 1,
    fontSize: '14px',
    borderColor: (theme) => theme.palette.primary.main,
    color: (theme) => theme.palette.primary.main,
    textTransform: 'none',
    cursor: 'pointer',
    pointerEvents: 'auto',
    userSelect: 'none',
    '&:hover': {
      backgroundColor: (theme) => theme.palette.primary.light + '04',
      borderColor: (theme) => theme.palette.primary.main
    },
    '&:active': {
      backgroundColor: (theme) => theme.palette.primary.light + '08'
    },
    '&.Mui-selected': {
      backgroundColor: (theme) => theme.palette.primary.main,
      color: (theme) => theme.palette.primary.contrastText,
      '&:hover': {
        backgroundColor: (theme) => theme.palette.primary.dark
      }
    }
  }
}

export const DateFieldsStyles: SxProps<Theme> = {
  ...SectionMarginBottom
}

export const DateFieldWrapperStyles: SxProps<Theme> = {
  ...FieldMarginBottom
}

export const ActionButtonsStyles: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '12px'
}

export const CancelButtonStyles: SxProps<Theme> = {
  ...BaseButtonStyles,
  borderColor: (theme) => theme.palette.primary.main,
  color: (theme) => theme.palette.primary.main,
  '&:hover': {
    borderColor: (theme) => theme.palette.primary.main,
    backgroundColor: (theme) => theme.palette.primary.light + '04'
  }
}

export const SubmitButtonStyles: SxProps<Theme> = {
  ...BaseButtonStyles,
  backgroundColor: (theme) => theme.palette.primary.main,
  '&:hover': {
    backgroundColor: (theme) => theme.palette.primary.dark
  }
}
