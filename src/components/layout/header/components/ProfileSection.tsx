/**
*Classification : Confidential
**/
'use client'
import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react'
import { IconButton, Typography, Box, useTheme } from '@mui/material'
import { ProfileTick, Setting2, CloseCircle } from 'iconsax-react'
import { HoverProfileMenuSx } from '@/styles/components/ui/hover'
import { useSelector } from 'react-redux'
import { selectProfileData } from '@/store/slices/menuSlice'
import { DEFAULT_PROFILE_URL, NUMBERMAP } from '@/constants/common'
import { API } from '@/constants/modules/user/setting'
import Image from 'next/image'
import { PROFILE_STRINGS, PROFILE_CLASSES, PROFILE_STYLES } from '@/constants/modules/user/profile'

interface ProfileIconRef {
  openDropdown: () => void
}

const ProfileIcon = forwardRef<ProfileIconRef>((props, ref) => {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [userDetails, setUserDetails] = useState({ first_name: '' })
  const theme = useTheme()
  const [profileUrl, setProfileUrl] = useState(DEFAULT_PROFILE_URL)

  const dropdownRef = useRef<HTMLDivElement | null>(null)
  const profileData = useSelector(selectProfileData)

  useImperativeHandle(ref, () => ({
    openDropdown: () => {
      setDropdownOpen(true) 
    },
  }))

  const toggleDropdown = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation()
    setDropdownOpen((prev) => !prev)
  }

  useEffect(() => {
    if (profileData) {
      const profile =
        typeof profileData.profile_url === API.STRING_TYPE
          ? profileData.profile_url
          : DEFAULT_PROFILE_URL
      setProfileUrl(profile)
      setUserDetails(profileData)
    }
  }, [profileData])

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
      color={PROFILE_STYLES.COLOR_SECONDARY}
      onClick={toggleDropdown}
      ref={dropdownRef}
    >
      <Image
        height={NUMBERMAP.FIFTY}
        width={NUMBERMAP.HUNDRED}
        src={profileUrl}
        alt={PROFILE_STRINGS.PROFILE}
        className={PROFILE_CLASSES.PROFILE_IMAGE}
      />
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
            <CloseCircle size={NUMBERMAP.TWENTY} color={theme.palette.primary.main} />
          </IconButton>
          <Box className={PROFILE_CLASSES.DROPDOWN_ITEM}>
            <Image
              height={NUMBERMAP.FIFTY}
              width={NUMBERMAP.HUNDRED}
              src={profileUrl}
              alt={PROFILE_STRINGS.PROFILE}
              className={PROFILE_CLASSES.PROFILE_IMAGE}
            />
            <Box>
              <Typography variant="body2">{PROFILE_STRINGS.WELCOME_BACK}</Typography>
              <Typography variant="h6" color={PROFILE_STYLES.TEXT_PRIMARY}>
                {userDetails?.first_name ?? PROFILE_STRINGS.USER}
              </Typography>
            </Box>
          </Box>

          <Box className={PROFILE_CLASSES.HEADER_DROPDOWN}>
            <Box className={PROFILE_CLASSES.PROFILE_DROPDOWN_TEXT} sx={HoverProfileMenuSx}>
              <ProfileTick size={NUMBERMAP.TWENTYFIVE} color={PROFILE_STYLES.ICON_COLOR} />
              {PROFILE_STRINGS.UPDATE_PROFILE}
            </Box>
          </Box>

          <Box className={PROFILE_CLASSES.HEADER_DROPDOWN}>
            <Box className={PROFILE_CLASSES.PROFILE_DROPDOWN_TEXT} sx={HoverProfileMenuSx}>
              <Setting2 size={NUMBERMAP.TWENTYFIVE} color={PROFILE_STYLES.ICON_COLOR} />
              {PROFILE_STRINGS.SETTINGS}
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  )
})

ProfileIcon.displayName = 'ProfileIcon'

export default ProfileIcon