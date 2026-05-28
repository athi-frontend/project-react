/**
 * Classification: Confidential
 */

import { styled, SxProps, Theme } from '@mui/material/styles'
import { TextField, Box, Typography } from '@mui/material'

const CKHeight = '300px'
export const CKReadOnlyHeight = '130px'
const InputContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  flexDirection: 'column',
  justifyContent: 'start',
}))

const InputLabel = styled(Typography)(({ theme }) => ({
  fontSize: '18px',
  marginBottom: '10px',
}))

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px',
    '& fieldset': {
      borderColor: 'var(--Text-Disable, #999)',
    },
  },
   "& .MuiOutlinedInput-root.Mui-disabled > fieldset": {
      borderColor: "inherit",
    },
    "& .MuiOutlinedInput-root.Mui-disabled:hover > fieldset": {
      borderColor: "inherit",
    },
      '& .MuiInputBase-input.Mui-disabled': {
      color: `${theme.palette.text.secondary} !important`,
      WebkitTextFillColor: `${theme.palette.text.secondary} !important`,
    },
}))

const ErrorText = styled(Typography)(({ theme }) => ({
  fontSize: '14px',
  marginTop: '5px',
}))

export const EditorContainer = styled(Box)({
  width: '100%',
  minHeight: '293px',
  border: '1px solid var(--Text-Disable, #999)',
  borderRadius: '10px',
  overflow: 'hidden',
  '& .ck-editor__editable': {
    minHeight: '293px',
    padding: '20px',
  },
  '& .ck-editor__editable_inline': {
    border: 'none',
  },
  '& .ck.ck-editor__main': {
    borderRadius: '0 0 10px 10px',
  },
  '& .ck.ck-toolbar': {
    borderRadius: '10px 10px 0 0',
    border: 'none',
    borderBottom: '1px solid #ccc',
  },
  '@media (max-width: 991px)': {
    maxWidth: '100%',
  },
})

export const RichTextEditorStyles = {
  editablePadding: '30px',
  
  noBorderStyle: {
    border: 'none',
  },
  
  editorContainer: {
    // Add any container styles here if needed
  } as SxProps<Theme>,
  
  editorContainerWithBorder: (error?: string, theme?: Theme) => ({
    border: error 
      ? `1px solid ${theme?.palette.error.main}` 
      : `1px solid ${theme?.palette.text.secondary}`,
  }),

  editorContainerWithHeight: (height?: string) => ({
    ...(height && {
      minHeight: 'auto !important',
      maxHeight: height,
      overflow: 'auto !important',
      '& .ck-editor__editable': {
        minHeight: 'auto !important',
        maxHeight: `${height} !important`,
        overflow: 'auto !important',
        height: 'auto !important',
      },
    }),
  }),

  globalOverrides: (theme?: Theme, hideBorder?: boolean) => {
    const isDarkMode = theme?.palette.background.default === '#000000'
    const hoverBgColor = isDarkMode ? (theme?.palette.primary as any).hoverBg : undefined

    return {
      '.ck-balloon-panel': {
        zIndex: '9999 !important',
      },
      '.ck-dropdown__panel_se:has(.ck-insert-table-dropdown__grid)': {
        left: '-69px !important',
      },
      ...(hideBorder && {
        '.ck-sticky-panel__content': {
          border: 'none !important',
        }
      }),
      ...(isDarkMode && hoverBgColor && {
        '.ck-button:hover:not(.ck-disabled)': {
          backgroundColor: `${hoverBgColor} !important`,
        },
        '.ck-button.ck-on:not(.ck-disabled)': {
          backgroundColor: `${hoverBgColor} !important`,
        },
        '.ck-button.ck-on:hover:not(.ck-disabled)': {
          backgroundColor: `${hoverBgColor} !important`,
        },
        '.ck-list__item:hover:not(.ck-disabled)': {
          backgroundColor: `${hoverBgColor} !important`,
        },
        '.ck-list__item.ck-on:not(.ck-disabled)': {
          backgroundColor: `${hoverBgColor} !important`,
        },
        '.ck-list__item.ck-on:hover:not(.ck-disabled)': {
          backgroundColor: `${hoverBgColor} !important`,
        },
        '.ck-dropdown__panel .ck-button:hover:not(.ck-disabled)': {
          backgroundColor: `${hoverBgColor} !important`,
        },
        '.ck-dropdown__panel .ck-button.ck-on:not(.ck-disabled)': {
          backgroundColor: `${hoverBgColor} !important`,
        },
        '.ck-dropdown__panel .ck-button.ck-on:hover:not(.ck-disabled)': {
          backgroundColor: `${hoverBgColor} !important`,
        },
      }),
    }
  },
}
export const EditorLabel = styled(Box)({
  fontFamily: 'Poppins, -apple-system, Roboto, Helvetica, sans-serif',
  fontSize: '18px',
  fontWeight: '400',
  zIndex: '0',
  marginBottom: '10px',
  '@media (max-width: 991px)': {
    maxWidth: '100%',
  },
})

export const ErrorTextRichText = styled(Box)({
  color: '#f44336',
  fontSize: '14px',
  marginTop: '5px',
})

export const InlineStyles = {
  editorContainer: {
    position: 'relative',
    width: '100%',
  }}
export { ErrorText, StyledTextField, InputContainer, InputLabel,CKHeight }

export const InputLabelContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '20px'
}))

export const EditorLabelContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between'
}))

export const DatePickerStyle = {
   '& .mui-lqwr9g-MuiPickersOutlinedInput-notchedOutline': {
                  border: "1px solid #999"
                }
}

export const RichTextEditorContentsCss = (textColor: string) => `body { color: ${textColor} !important; padding: 20px; }`
