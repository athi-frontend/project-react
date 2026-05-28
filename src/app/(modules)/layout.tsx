'use client'
import Header from '@/components/layout/header/Header'
import Sidebar from '@/components/layout/sidebar/Sidebar'
import { Box } from '@mui/material'
import BreadCrumb from '@/components/ui/breadcrumb/BreadCrumb'
import { usePathname, notFound } from 'next/navigation'
import { NUMBERMAP,
  HR_SECTION_REGEX,
  SPECIAL_SECTION,
  VALID_SECTION_PATTERN,
  TRAILING_SLASHES_REGEX
 } from '@/constants/common'

interface MainLayoutProps {
  readonly children: React.ReactNode
}
const USERPATHS = [
  '/user/set-password',
  '/user/reset-forgot-password',
  '/user/setting-pin',
]
export default function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname()
  const normalized = pathname.length > NUMBERMAP.ONE ? pathname.replace(TRAILING_SLASHES_REGEX, '') : pathname
  const sectionMatch = normalized.match(HR_SECTION_REGEX)
  const section = sectionMatch?.[NUMBERMAP.TWO] ?? ''
if (section && !(section === SPECIAL_SECTION || VALID_SECTION_PATTERN.test(section)) && sectionMatch?.[NUMBERMAP.ONE]!="record-generation") 
  {
    return notFound();
  }
  if (USERPATHS.includes(pathname)) {
    return <>{children}</>
  }
  return (
    <Box>
      <Header />
      <Box className="main-body">
        <Sidebar />
        <BreadCrumb />
        <Box className="mainContent">{children}</Box>
      </Box>
    </Box>
  )
}