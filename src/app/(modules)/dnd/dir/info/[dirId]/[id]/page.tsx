'use client'
import dynamic from 'next/dynamic'

/**
    Classification : Confidential
**/
const DirInformationForm = dynamic(
  () => import('@/components/modules/dnd/dir/DirInformationForm'),
  { ssr: false }
)

function InfoForm() {
  return <DirInformationForm />
}

export default InfoForm
