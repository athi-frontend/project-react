'use client'
import dynamic from 'next/dynamic'
const PNDForm = dynamic(() => import('@/components/modules/dnd/pnd/PndForm'), {
  ssr: false,
})

export default function SimpleListPage() {
  return <PNDForm />
}
