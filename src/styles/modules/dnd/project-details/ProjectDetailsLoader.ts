import { SxProps, Theme } from '@mui/material'

/**
 * Classification : Confidential
 * Styles for ProjectDetailsLoader component
 */

export const projectDetailsLoaderContainer: SxProps<Theme> = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  bgcolor: 'rgba(255,255,255,0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
}
