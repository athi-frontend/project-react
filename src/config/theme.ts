/**
 * Classification: Confidential
 */

import { createTheme } from '@mui/material/styles'
import { ThemeTypes } from '@/types/common'
/**
 Classification : Confidential
**/
export const getTheme = (themeVariables: ThemeTypes) => {
  return createTheme({
    palette: {
      primary: {
        main: themeVariables['--primary-color'],
        hoverBg: themeVariables['--menuHover-color'],
        light: themeVariables['--header-title'],
      },
      secondary: { main: themeVariables['--secondary-color'] },
      background: {
        default: themeVariables['--background-color'],
        paper: themeVariables['--white-color'],
        light: themeVariables['--gridtable-bg-color'],
      },
      info: { main: themeVariables['--text-dark-color'] },
      text: {
        primary: themeVariables['--text-color'],
        secondary: themeVariables['--text-dark-color'],
        disabled: themeVariables['--grey-color'],
        main: themeVariables['--dropdown-hover-color'],
      },
      border: {
        main: themeVariables['--text-color'],
      },
      error: {
        main: themeVariables['--error-color'],
        light: themeVariables['--error-light-color'],
      },
      success: {
        main: themeVariables['--success-color'],
        light: themeVariables['--success-light-color'],
      },
    },

      components: {
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          color:  themeVariables['--primary-color'], // affects all icons, so use with caution
        },
        
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: themeVariables['--primary-color'], // Unchecked color
          '&.Mui-checked': {
            color: themeVariables['--primary-color'], // Checked color
          },
          '&.Mui-disabled': {
            color: themeVariables['--grey-color'], // Disabled color
            '& .MuiSvgIcon-root': {
              fill: themeVariables['--grey-color'], // Disabled icon color
            },
          },
         '& .MuiSvgIcon-root': {
            fill:themeVariables['--primary-color'], // force inherit from parent
          },
        },
      },
    },
  },
    typography: {
      fontFamily: themeVariables['--font-family'],
      h4: { fontSize: '2rem', fontWeight: 600 },
      body1: { fontSize: '1rem' },
      button: {
        border: themeVariables['--text-dark-color'],
      },
    },
    spacing: 20,
    shape: { borderRadius: 10 },
    zIndex: { appBar: 1200, drawer: 1100 },
    transitions: {
      duration: { shortest: 150, shorter: 200, standard: 300 },
      easing: {
        easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
        easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
        easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      },
    },
    mixins: {
      toolbar: {
        minHeight: 56,
      },
    },
  })
}
