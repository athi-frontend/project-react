'use client'

import * as React from 'react'
import { useParams, usePathname } from 'next/navigation'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Typography from '@mui/material/Typography'
import Link from 'next/link' 
import Stack from '@mui/material/Stack'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import HomeIcon from '@mui/icons-material/Home'
import { NUMBERMAP } from '@/constants/common'
import { useSelector } from 'react-redux'
import { selectMenuData } from '@/store/slices/menuSlice'
import { generateBreadcrumb } from '@/lib/utils/breadcrumbs'


export default function BreadCrumb() {
  const pathname = usePathname()
  const id = Number(useParams().id)
  const menuData = useSelector(selectMenuData)

  const breadcrumbs=generateBreadcrumb(pathname, id, menuData)



  return (
    <Stack spacing={2} sx={{ marginLeft: NUMBERMAP.FOUR, marginTop: NUMBERMAP.FIVE }}>
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
      >
        {}
        <Link underline="hover" color="inherit" href="/">
          <HomeIcon sx={{ verticalAlign: 'middle', fontSize: NUMBERMAP.TWENTY }} />
        </Link>

        {}
        {breadcrumbs?.map(({ name, url }, index) => {
          const isLast = index === breadcrumbs.length - 1
          return isLast ? (
            <Typography key={name} color='text.primary'>
              {name}
            </Typography>
          ) : (
            <Link key={name} underline="hover" color="inherit" href={url}>
              {name}
            </Link>
          )
        })}
      </Breadcrumbs>
    </Stack>
  )
}
