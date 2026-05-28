import { SxProps, Theme } from '@mui/material'

export const feedbackSectionWrapperSx: SxProps<Theme> = {
  mb: '10px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}
export const feedbackSectionTitleSx: SxProps<Theme> = {
  fontSize: '18px',
  fontWeight: 600,
}
export const downloadButtonSx: SxProps<Theme> = (theme) => ({
  padding: '10px 20px',
  border: `1px solid ${theme.palette.primary.main}`,
  borderRadius: '10px',
  backgroundColor: 'transparent',
  color: theme.palette.primary.main,
  cursor: 'pointer',
  fontSize: '16px',
  fontWeight: 500,
  display: 'flex',
  gap: '5px',
  alignItems: 'center',
})

export const dateTimeBoxSx: SxProps<Theme> = {
  mb: 0.5
}
export const dateTimeLabelSx: SxProps<Theme> = {
  fontSize: '1rem',
  fontWeight: 500,
  color: 'text.primary'
}
export const dateTimePickerSx: SxProps<Theme> = {
  '& .MuiInputBase-root': {
    fontSize: '1rem',
    height: '40px',
    borderRadius: '4px',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': { borderColor: 'grey.500' },
    '&:hover fieldset': { borderColor: 'primary.main' },
    '&.Mui-focused fieldset': { borderColor: 'primary.main' },
  },
}
