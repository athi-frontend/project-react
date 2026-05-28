import { SxProps, Theme } from '@mui/material'

export const QCFormTeamIconStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  width: '100%',
}

export const QCFormTeamSnoTextStyles: SxProps<Theme> = {
  fontWeight: 400,
}

export const QCFormTeamIconButtonStyles: SxProps<Theme> = {
  width: '24px',
  height: '24px',
  padding: 0,
}

export const QCFormTeamTableContainerStyles: SxProps<Theme> = {
  padding: '0',
  '& > div': {
    padding: '0 !important',
  },
}

export const QCFormTeamAddNewButtonStyles: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '8px 20px',
  border: '1px solid',
  borderColor: (theme) => theme.palette.primary.main,
  borderRadius: '10px',
  cursor: 'pointer',
  color: (theme) => theme.palette.primary.main,
  fontSize: '20px',
  fontWeight: 500,
  '&:hover': {
    backgroundColor: (theme) => theme.palette.primary.light + '04',
  },
}

export const QCFormTeamAddNewButtonContainerStyles: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'flex-end',
  marginBottom: '10px',
}

export const QCFormTeamDataTableWrapperStyles: SxProps<Theme> = {
  '& > div': {
    padding: '0 !important',
  },
}

export const QCFormTeamDisabledInputStyles: SxProps<Theme> = {
  '& .MuiOutlinedInput-root.Mui-disabled': {
    '& fieldset': {
      border: 'none',
    },
  },
}

export const QCFormTeamErrorStyles: SxProps<Theme> = {
  color: 'error.main',
  marginTop: (theme) => theme.spacing(1),
}

export const QCFormTeamTableWrapperStyles: SxProps<Theme> = {
  marginTop: (theme) => theme.spacing(2),
}