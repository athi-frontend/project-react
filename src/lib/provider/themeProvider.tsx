'use client'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { rootState } from '@/store/store'
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles'
import { getTheme } from '@/config/theme'
import { ChildrenProps } from '@/types/common'
import { setCustomTheme } from '@/store/slices/themeSlice'
import { hasValidValues, getCssVariables } from '@/lib/utils/theme'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'

const Path = '/styles/'

const ThemeProvider: React.FC<ChildrenProps> = ({ children }) => {
  const dispatch = useDispatch()
  const themedata = useSelector((state: rootState) => state.theme)
  const [loading, setLoading] = useState(false)

  const loadCssFile = (href: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`link[href="${href}"]`)) {
        resolve()
        return
      }
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = href
      link.onload = () => resolve()
      link.onerror = () => reject(new Error('Failed to load CSS file: ' + href))
      document.head.appendChild(link)
    })
  }

  const applyTheme = async () => {
    try {
      setLoading(true)
      const currentTheme = themedata.mode
      const href = `${Path}${currentTheme}.css`
      await loadCssFile(href)
      const cssVars = getCssVariables()
      if (hasValidValues(cssVars)) {
        dispatch(
          setCustomTheme({
            themeData: cssVars,
            theme: currentTheme,
          })
        )
      }
    } catch (error) {
      console.error('Theme load error:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!themedata.theme[themedata.mode]) {
      applyTheme()
    }
  }, [themedata.mode, dispatch])

  const themeReady = themedata.theme[themedata.mode]

  if (!themeReady || loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    )
  }

  return (
    <MUIThemeProvider theme={getTheme(themeReady)}>{children}</MUIThemeProvider>
  )
}

export default ThemeProvider
