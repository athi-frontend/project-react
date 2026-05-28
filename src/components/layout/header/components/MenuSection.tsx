'use client'
import { useState, useRef, useEffect } from 'react'
import { IconButton, MenuItem, Box, useTheme } from '@mui/material'
import { Notification, Logout, CloseCircle, HambergerMenu } from 'iconsax-react'
import { HoverProfileMenuSx } from '@/styles/components/ui/hover'
import { logout } from '@/services/common'
import { NUMBERMAP, LOGIN_URL } from '@/constants/common'
import { handleClearLocalStorage } from '@/lib/utils/common'
import ProfileIcon from './ProfileSection'
import ThemeSelect from './ThemeSection'
import { PROFILE_CLASSES, PROFILE_STYLES, PROFILE_STRINGS } from '@/constants/modules/user/profile'
import { InlineStyles } from '@/styles/components/ui/layout'

export default function MenuSection() {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement | null>(null)
  const profileIconRef = useRef<{ openDropdown: () => void }>(null)
  const themeSelectRef = useRef<{ openDropdown: () => void }>(null)
  const theme = useTheme()

  const toggleDropdown = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation()
    setDropdownOpen((prev) => !prev)
  }

  const handleLogout = async () => {
    try {
    const res = await logout()
    if (res.code === NUMBERMAP.TWOHUNDRED) {
      handleClearLocalStorage()
      window.location.href = LOGIN_URL
      }
    } catch {
      handleClearLocalStorage()
      window.location.href = LOGIN_URL
    }
  }


  const handleProfileClick = (event: React.MouseEvent) => {
    event.stopPropagation()
    if (profileIconRef.current) {
      profileIconRef.current.openDropdown() 
    }
  }

  const handleThemeClick = (event: React.MouseEvent) => {
    event.stopPropagation()
    if (themeSelectRef.current) {
      themeSelectRef.current.openDropdown() 
    }
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false)
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
      className={PROFILE_CLASSES.PROFILE}
      color={PROFILE_STYLES.COLOR_SECONDARY}
      onClick={toggleDropdown}
      ref={dropdownRef}
    >
      <IconButton>
        <HambergerMenu size={NUMBERMAP.THIRTYTWO} color={theme.palette.primary.main} />
      </IconButton>
      {dropdownOpen && (
        <Box
          sx={PROFILE_STYLES.DROPDOWN_BG}
          className={PROFILE_CLASSES.PROFILE_DROPDOWN}
          onClick={(e) => e.stopPropagation()}
        >
          <IconButton
            className={PROFILE_CLASSES.CLOSE_BTN}
            onClick={() => setDropdownOpen(false)}
          >
            <CloseCircle
              size={NUMBERMAP.TWENTY}
              color={theme.palette.primary.main}
              fill={PROFILE_STYLES.ICON_FILL}
            />
          </IconButton>
          <MenuItem
            className={PROFILE_CLASSES.HEADER_DROPDOWN}
            onClick={handleProfileClick} 
          >
            <Box className={PROFILE_CLASSES.PROFILE_DROPDOWN_TEXT} sx={HoverProfileMenuSx}>
              <ProfileIcon ref={profileIconRef} /> {PROFILE_STRINGS.PROFILE}
            </Box>
          </MenuItem>
          <MenuItem className={PROFILE_CLASSES.HEADER_DROPDOWN}>
            <Box className={PROFILE_CLASSES.PROFILE_DROPDOWN_TEXT} sx={HoverProfileMenuSx}>
              <IconButton className={PROFILE_CLASSES.PROFILE_ICON} sx={InlineStyles.notificationButton}>
                <Notification size={NUMBERMAP.TWENTYSIX} color={PROFILE_STYLES.ICON_COLOR} />
              </IconButton>
              {PROFILE_STRINGS.NOTIFICATION}
            </Box>
          </MenuItem>
          <MenuItem
            className={PROFILE_CLASSES.HEADER_DROPDOWN}
            onClick={handleThemeClick} 
          >
            <Box className={PROFILE_CLASSES.PROFILE_DROPDOWN_TEXT} sx={HoverProfileMenuSx}>
              <ThemeSelect ref={themeSelectRef} /> {PROFILE_STRINGS.THEME}
            </Box>
          </MenuItem>
          <MenuItem onClick={handleLogout} className={PROFILE_CLASSES.HEADER_DROPDOWN}>
            <Box className={PROFILE_CLASSES.PROFILE_DROPDOWN_TEXT} sx={HoverProfileMenuSx}>
              <IconButton className={PROFILE_CLASSES.PROFILE_ICON} sx={InlineStyles.notificationButton}>
                <Logout size={NUMBERMAP.TWENTYFIVE} color={PROFILE_STYLES.ICON_COLOR} />
              </IconButton>
              {PROFILE_STRINGS.LOGOUT}
            </Box>
          </MenuItem>
        </Box>
      )}
    </Box>
  )
}