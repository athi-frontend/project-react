'use client'
import React, { useState } from 'react'
import { Grid2 } from '@mui/material'
import { ButtonGroup } from '@/components/ui'
import {
  ProfileContainer,
  ProfileTitle,
  ProfileContentWrapper,
  ProfileImage,
  ButtonsContainer,
} from '@/styles/components/modules/profile'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import { NUMBERMAP } from '@/constants/common'

const UpdateProfilePicture: React.FC = () => {
  const [profileImage, setProfileImage] = useState<string | null>(null)

  const handleUpload = () => {}

  const handleRemove = () => {
    setProfileImage(null)
  }

  const handleSave = () => {}

  const handleCancel = () => {}

  const buttons = [
    { label: 'Upload', onClick: handleUpload },
    { label: 'Remove', onClick: handleRemove },
    { label: 'Save', onClick: handleSave },
    { label: 'Cancel', onClick: handleCancel },
  ]

  return (
    <ProfileContainer>
      <ProfileTitle>Update Profile Picture</ProfileTitle>

      <ProfileContentWrapper>
        {profileImage ? (
          <ProfileImage src={profileImage} alt="Profile" />
        ) : (
          <AccountCircleIcon />
        )}

        <ButtonsContainer>
          <Grid2 container spacing={2}>
            <Grid2 size={NUMBERMAP.TWELVE}>
              <ButtonGroup buttons={buttons} />
            </Grid2>
          </Grid2>
        </ButtonsContainer>
      </ProfileContentWrapper>
    </ProfileContainer>
  )
}

export default UpdateProfilePicture
