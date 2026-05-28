'use client'
import dynamic from 'next/dynamic'

const UpdateProfilePicture = dynamic(() => import('./updateProfilePicture'), {
  ssr: false,
})

export default function SettingProfilePage() {
  return <UpdateProfilePicture />
}
