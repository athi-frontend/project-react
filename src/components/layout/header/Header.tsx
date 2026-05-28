'use client'
import { Box } from '@mui/material'
import MenuSection from './components/MenuSection'
import Image from 'next/image'
import { InlineStyles } from '@/styles/components/ui/layout'
import { NUMBERMAP } from '@/constants/common'
import { HEADER_CLASSES , PROFILE_STRINGS} from '@/constants/modules/user/profile'

export default function Header() {
  return (
    <Box sx={InlineStyles.mainHeader} className={HEADER_CLASSES.MAIN_HEADER}>
      <Box className={HEADER_CLASSES.HEADER_LEFT}>
        <Image
          width={NUMBERMAP.TWOHUNDRED}
          height={NUMBERMAP.TEN}
          src="/images/logo.png"
          alt={PROFILE_STRINGS.LOGO_ALT}
          className={HEADER_CLASSES.LOGO}
        />
      </Box>
      <Box className={HEADER_CLASSES.HEADER_RIGHT} sx={InlineStyles.headerRight}>
        <Image
          width={NUMBERMAP.ONETWENTY}
          height={NUMBERMAP.FORTY}
          src="/images/swaas_logo.png"
          alt={PROFILE_STRINGS.LOGO_ALT}
          className={HEADER_CLASSES.LOGO_RIGHT}
        />
        <MenuSection />
      </Box>
    </Box>
  )
}
