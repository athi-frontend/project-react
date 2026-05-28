import { SxProps, Theme } from '@mui/material'

/**
 * Classification: Confidential
 * Bill of Material Styles
 */

export const bomTabsContainerSx: SxProps<Theme> = {
  width: '100%',
  borderBottom: 1,
  borderColor: 'divider',
  mb: 2,
}


export const bomButtonContainerSx: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  gap: '10px',
  mt: 1,
  mb: 1,
  flexWrap: { xs: 'wrap', sm: 'nowrap' },
}

export const bomTreeContainerSx: SxProps<Theme> = {
  width: '100%',
  overflowX: 'auto',
  backgroundColor: '#f3e8ff',
  borderRadius: '10px',
}


export const treeRootSx: SxProps<Theme> = {
  flexGrow: 1,
  overflowY: 'auto',
  overflowX: 'auto',
  padding: { xs: '10px', md: '20px' },
}

export const uploadBomLinkSx: SxProps<Theme> = {
  cursor: 'pointer',
}

export const uploadBomGridContainerSx: SxProps<Theme> = {
  mb: 2,
}