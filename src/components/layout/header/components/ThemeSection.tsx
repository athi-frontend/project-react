'use client'
import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react'
import { useDispatch } from 'react-redux'
import { setCustomTheme } from '@/store/slices/themeSlice'
import { IconButton, Typography, Box, Button, useTheme } from '@mui/material'
import { ColorSwatch, CloseCircle } from 'iconsax-react'
import { NUMBERMAP } from '@/constants/common'
import { supportedThemes } from '@/config/constants'
import { themeColors } from '@/styles/common'
import { themeWrapperSx, themeDropdownSx, colorSwatchSx, themeIconButtonSx } from '@/styles/components/ui/layout'
import { THEME_STYLES, PROFILE_STYLES } from '@/constants/modules/user/profile'

interface ThemeSelectRef {
  openDropdown: () => void
}

const ThemeSelect = forwardRef<ThemeSelectRef>((props, ref) => {
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false)
  const themeDropdownRef = useRef<HTMLDivElement | null>(null)
  const dispatch = useDispatch()
  const theme = useTheme()

  useImperativeHandle(ref, () => ({
    openDropdown: () => {
      setThemeDropdownOpen(true)
    },
  }))

  const toggleThemeDropdown = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation()
    setThemeDropdownOpen((prev) => !prev)
  }

  const selectThemeColor = (color: string) => {
    const theme = color === themeColors.dark ? 'dark' : 'light'
    dispatch(setCustomTheme({ theme }))
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        themeDropdownRef.current &&
        !themeDropdownRef.current.contains(event.target as Node)
      ) {
        setThemeDropdownOpen(false)
      }
    }
    if (typeof document !== 'undefined') {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [])

  return (
    <Box
      className={THEME_STYLES.WRAPPER}
      onClick={toggleThemeDropdown}
      ref={themeDropdownRef}
      sx={themeWrapperSx}
    >
      <IconButton  sx={themeIconButtonSx}>
        <ColorSwatch
          size={NUMBERMAP.TWENTYSEVEN}
          variant="Bulk"
          color={PROFILE_STYLES.ICON_COLOR}
        />
      </IconButton>
      {themeDropdownOpen && (
        <Box
          className={THEME_STYLES.DROPDOWN}
          sx={themeDropdownSx}
          onClick={(e) => e.stopPropagation()}
        >
          <IconButton
            className={THEME_STYLES.CLOSE_BTN}
            onClick={() => setThemeDropdownOpen(false)}
          >
            <CloseCircle
              size={NUMBERMAP.TWENTY}
              color={theme.palette.primary.main}
            />
          </IconButton>

          <Typography variant="h6" color={PROFILE_STYLES.TEXT_PRIMARY}>
            Theme
          </Typography>

          <Box className={THEME_STYLES.COLOR_SWATCH_WRAPPER} gap={2}>
            {Object.values(supportedThemes).map((color) => (
              <Box
                key={color}
                className={THEME_STYLES.COLOR_SWATCH}
                sx={colorSwatchSx(themeColors[color])}
                onClick={() => selectThemeColor(themeColors[color])}
              />
            ))}
          </Box>

          <Box className={THEME_STYLES.ACTION_WRAPPER}>
            <Button
              className={THEME_STYLES.ACTION_BUTTON}
              variant="outlined"
              onClick={() => setThemeDropdownOpen(false)}
            >
              Close
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  )
})

ThemeSelect.displayName = 'ThemeSelect'
export default ThemeSelect
