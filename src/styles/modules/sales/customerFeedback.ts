import { SxProps, Theme } from '@mui/material'
import { GridColDef } from '@mui/x-data-grid'

export const RatingCellStyles: (hasError: boolean) => SxProps<Theme> = (hasError) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  border: hasError ? '1px solid' : 'none',
  borderColor: hasError ? 'error.main' : 'transparent',
  borderRadius: hasError ? '4px' : 0,
  '& > div[class*="MuiBox-root"]': {
    alignItems: 'center !important',
    display: 'flex !important',
    flexDirection: 'column !important'
  }
})

export const RatingColumnConfig: Partial<GridColDef> = {
  flex: 1,
  align: 'center' as const,
  headerAlign: 'center' as const,
}

export const CriteriaStyles: (isGroupHeader: boolean) => SxProps<Theme> = (isGroupHeader) => ({
  fontWeight: 'normal',
  paddingLeft: isGroupHeader ? 0 : 2
})

export const SubHeaderStyles: SxProps<Theme> = {
  mb: 1
}

export const ErrorStyles: SxProps<Theme> = {
  color: 'error.main',
  fontSize: '0.875rem',
  mb: 1,
  ml: 1
}

export const ButtonContainerStyles: SxProps<Theme> = {
  marginTop: 4
}

export const unitError: SxProps<Theme> = {
  color: 'error.main',
  fontSize: '0.875rem',
  ml: 2
}

