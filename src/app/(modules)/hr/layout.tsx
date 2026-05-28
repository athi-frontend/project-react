'use client'

import CommonLayout from '@/components/layout/CommonLayout'
import { Suspense } from 'react'
import CircularProgress from '@mui/material/CircularProgress';

/**
*Classification : Confidential
**/

export default function HRLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <CommonLayout>
      <Suspense fallback={<CircularProgress />}>
          {children}
      </Suspense>
    </CommonLayout>
  )
}
