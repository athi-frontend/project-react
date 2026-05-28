'use client'

import dynamic from 'next/dynamic'
/**
      *Classification : Confidential
**/
const SpecificationListComponent = dynamic(
  () => import('@/components/modules/dnd/dig/SpecificationForm'),
  { ssr: false }
)

export default function SpecificationPage() {
  return <SpecificationListComponent />
}
