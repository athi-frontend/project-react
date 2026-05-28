'use client'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  SelectChangeEvent,
} from '@mui/material'
import { setCustomTheme } from '@/store/slices/themeSlice'
import { RootState } from '@/store/store'
import { supportedThemes } from '@/config/constants'
import { InlineStyles } from '@/styles/components/ui/button'

const ThemeSwitcherButton = () => {
  const dispatch = useDispatch()
  const currentMode: string = useSelector(
    (state: RootState) => state.theme.mode
  )
  const handleThemeChange = (event: SelectChangeEvent<string>) => {
    const newMode = supportedThemes[event.target.value as string]
    dispatch(setCustomTheme({ theme: newMode }))
  }

  return (
    <FormControl variant="outlined" style={InlineStyles.formControl}>
      <InputLabel>Theme</InputLabel>
      <Select value={currentMode} onChange={handleThemeChange} label="Theme">
        {Object.values(supportedThemes).map((theme) => (
          <MenuItem key={theme} value={theme}>
            {theme}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default ThemeSwitcherButton
