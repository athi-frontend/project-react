/**
 * Sanity Check Inspection Styles
 * Classification: Confidential
 */

import { SxProps, Theme } from '@mui/material'

export const OBSERVATION_CELL_STYLES: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  height: '100%',
}

export const OBSERVATION_EDIT_ICON_STYLES: SxProps<Theme> = {
  ...OBSERVATION_CELL_STYLES,
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: 'transparent',
  },
}

export const OBSERVATION_TEXT_STYLES: SxProps<Theme> = {
  cursor: 'pointer',
  textDecoration: 'underline',
  color: (theme) => theme.palette.text.primary,
  marginTop: '0px',
}

export const RESULT_CELL_STYLES: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: 2,
  width: '100%',
  height: '100%',
}

export const EDIT_ICON_STYLES: SxProps<Theme> = {
  fontSize: 20,
}

export const FORM_CONTROL_LABEL_STYLES: SxProps<Theme> = {
  margin: 0,
}
