'use client'
import * as React from 'react'
import { useState, useEffect } from 'react'
import { Grid2, FormLabel } from '@mui/material'
import {
  PageContainer,
  TitleContainer,
  ContentContainer,
  ButtonsContainer,
  ButtonsWrapper,
  ProfileImage,
  SaveButton,
  CancelButton,
  ActionButtonsContainer,
  UploadButton,
  RemoveButton,
  TitleTypography,
  MessageTypography,
  HiddenInput,
} from '@/styles/modules/user/settingProfilePicture'
import {
  useProfilePictureUpload,
  useProfilePictureRemove,
  useProfilePictureFetch,
  useUserProfile,
} from '@/hooks/modules/user/useSetting'
import {
  UI,
  COLORTYPE,
  FILE,
  ERROR_MESSAGES,
  LOADING_STATES,
  ALERT_TYPES,
  ALERT_MESSAGES,
  API,
} from '@/constants/modules/user/setting'
import { showActionAlert } from '@/components/ui/alert-modal/ActionAlert'
import { selectUserId, selectMenuData } from '@/store/slices/menuSlice'
import { useSelector } from 'react-redux'
import { getUserProfilePictureMenuId, mapPermissionsWithDefaultStatus } from '@/utils/modules/user/profileUtils'
import { useRouter, useParams } from 'next/navigation'
import { DEFAULT_PROFILE_URL, NUMBERMAP } from '@/constants/common'
import Image from 'next/image'
import UserWorkflowManager from '@/components/modules/user/UserWorkflowManager'

/**
*Classification : Confidential
**/
function UpdateProfilePicture() {
  const params = useParams()
  const { id } = params
  const currentUserId = useSelector(selectUserId)
  const menuData = useSelector(selectMenuData)
  const router = useRouter()
  
  // Determine if we're viewing another user's profile or current user's profile
  const isViewingOtherUser = id && id !== 'undefined' && id !== currentUserId?.toString()
  const targetUserId = isViewingOtherUser ? parseInt(id as string) : currentUserId
  
  const [profileImage, setProfileImage] = useState<string>(DEFAULT_PROFILE_URL)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isRemovePending, setIsRemovePending] = useState<boolean>(false)
  const { mutate: uploadImage, isPending: isUploading } =
    useProfilePictureUpload()
  const { mutate: removeImage, isPending: isRemoving } =
    useProfilePictureRemove()
  const {
    data: fetchedProfileUrl,
    isLoading: isFetching,
    refetch,
  } = useProfilePictureFetch(targetUserId ?? NUMBERMAP.ZERO)
  
  // ABAC Workflow - Get User Profile Data
  const {
    data: userProfileData,
    isLoading: isUserProfileLoading,
  } = useUserProfile(targetUserId ?? NUMBERMAP.ZERO)
  
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const isLoading = isUploading ?? isRemoving ?? isFetching ?? isUserProfileLoading

  useEffect(() => {
    if (fetchedProfileUrl?.profile_url && typeof fetchedProfileUrl.profile_url === 'string') {
      setProfileImage(fetchedProfileUrl.profile_url);
    } else {
      setProfileImage(DEFAULT_PROFILE_URL);

    }
  }, [fetchedProfileUrl])


  const validateFile = (file: File) => {
    if (file.size > FILE.MAX_FILE_SIZE) {
      throw new Error(ERROR_MESSAGES.FILE_SIZE_ERROR)
    }
    if (!FILE.ALLOWED_FORMATS.includes(file.type)) {
      throw new Error(ERROR_MESSAGES.FILE_FORMAT_ERROR)
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      try {
        validateFile(file)
        setSelectedFile(file)
        setIsRemovePending(false)
        setError(null)

        const reader = new FileReader()
        reader.onload = (e) => setProfileImage(e.target?.result as string)
        reader.readAsDataURL(file)

        event.target.value = ''
      } catch (err) {
        setError((err as Error).message)
        setProfileImage(fetchedProfileUrl?.profile_url ?? DEFAULT_PROFILE_URL)
        setSelectedFile(null)
        setIsRemovePending(false)
        event.target.value = ''
      }
    }
  }

  const handleRemove = () => {
    // Only update frontend state, don't call API yet
    setProfileImage(DEFAULT_PROFILE_URL)
    setSelectedFile(null)
    setIsRemovePending(true)
    setError(null)
  }

  const handleSave = async () => {
    // Handle remove operation if user clicked remove button
    if (isRemovePending) {
        removeImage(targetUserId as number, {
        onSuccess: (data) => {
          setProfileImage(data.profile_url ?? DEFAULT_PROFILE_URL)
          setSelectedFile(null)
          setIsRemovePending(false)
          setError(null)
          refetch()
          showActionAlert(ALERT_TYPES.CUSTOM_ALERT, {
            title: ALERT_MESSAGES.SUCCESS_TITLE,
            text: ALERT_MESSAGES.SUCCESS_TEXT,
            icon: 'success',
            cancelButton: false,
            confirmButton: false,
          })
        },
        onError: () => {
          setError('Failed to remove profile picture')
          setProfileImage(fetchedProfileUrl?.profile_url ?? DEFAULT_PROFILE_URL)
          setIsRemovePending(false)
          showActionAlert(ALERT_TYPES.CUSTOM_ALERT, {
            title: 'Error',
            text: ERROR_MESSAGES.UPLOAD_FAILED_ERROR,
            icon: 'error',
            cancelButton: false,
            confirmButton: false,
          })
        },
      })
      return
    }

    if (selectedFile) {
      const doUpload = () => {
        uploadImage(
          { userId: targetUserId ?? NUMBERMAP.ZERO, file: selectedFile },
          {
            onSuccess: async (data) => {
              if (data.profile_url && typeof data.profile_url === 'string') {
                setProfileImage(data.profile_url)
              } else {
                setError(ERROR_MESSAGES.INVALID_PROFILE_URL)
              }
              setSelectedFile(null)
              setError(null)
              await refetch();
              showActionAlert(ALERT_TYPES.CUSTOM_ALERT, {
                title: ALERT_MESSAGES.SUCCESS_TITLE,
                text: ALERT_MESSAGES.SUCCESS_TEXT,
                icon: 'success',
                cancelButton: false,
                confirmButton: false,
              })
            },
            onError: (uploadError) => {
              setError(uploadError.message ?? ERROR_MESSAGES.UPLOAD_FAILED_ERROR)
              setProfileImage(fetchedProfileUrl?.profile_url ?? DEFAULT_PROFILE_URL)
              setSelectedFile(null)
              showActionAlert(ALERT_TYPES.CUSTOM_ALERT, {
                title: 'Error',
                text: uploadError.message ?? ERROR_MESSAGES.UPLOAD_FAILED_ERROR,
                icon: 'error',
                cancelButton: false,
                confirmButton: false,
              })
            },
          }
        )
      }

      const hasExistingProfile = typeof fetchedProfileUrl?.profile_url === API.STRING_TYPE && fetchedProfileUrl?.profile_url

      if (hasExistingProfile) {
        removeImage(targetUserId as number, {
          onSuccess: () => {
            doUpload()
          },
          onError: () => {
            setError(ERROR_MESSAGES.REMOVE_FAILED_ERROR)
            setProfileImage(fetchedProfileUrl?.profile_url ?? DEFAULT_PROFILE_URL)
            showActionAlert(ALERT_TYPES.CUSTOM_ALERT, {
              title: 'Error',
              text: ERROR_MESSAGES.REMOVE_FAILED_ERROR,
              icon: 'error',
              cancelButton: false,
              confirmButton: false,
            })
          },
        })
      } else {
        doUpload()
      }
    } else if (!isRemovePending) {
      setError(ERROR_MESSAGES.NO_FILE_SELECTED_ERROR)
    }
  }

  const handleCancel = () => {
    setSelectedFile(null)
    setProfileImage(fetchedProfileUrl?.profile_url ?? DEFAULT_PROFILE_URL)
    setIsRemovePending(false)
    setError(null)
    router.push('/')
  }

  return (
    <PageContainer>
      <TitleContainer>
        <TitleTypography variant={UI.TITLE_VARIANT}>
          {isViewingOtherUser ? UI.TITLE_USER_PROFILE_REVIEW(id) : UI.TITLE_UPDATE_PROFILE_PICTURE}
        </TitleTypography>
      </TitleContainer>

      <ContentContainer>
        {profileImage && (
            <ProfileImage>
              <Image
                width={NUMBERMAP.ONEFIFTY}
                height={NUMBERMAP.ONEFIFTY}
                src={profileImage}
                alt={UI.PROFILE_ALT_TEXT}
                onError={() => setProfileImage(DEFAULT_PROFILE_URL)}
              />
            </ProfileImage>
          )
        }

        {error && (
          <MessageTypography color={COLORTYPE.ERROR_COLOR}>
            {error}
          </MessageTypography>
        )}

        {(() => {
          // Show approval workflow for other users only when API returns valid permissions
          if (isViewingOtherUser && userProfileData?.meta_info?.action_control?.permissions && userProfileData.meta_info.action_control.permissions.length > NUMBERMAP.ZERO) {
            return (
              <UserWorkflowManager
                workflowType="profile-picture"
                isLoading={isLoading}
                permissions={mapPermissionsWithDefaultStatus(userProfileData.meta_info.action_control.permissions)}
                userId={targetUserId ?? NUMBERMAP.ZERO}
                menuId={getUserProfilePictureMenuId(menuData) ?? NUMBERMAP.ZERO}
                menuName={userProfileData.meta_info.action_control.formName}
                reviewerList={userProfileData?.meta_info?.task_info?.reviewer_list}
                onSuccess={() => {
                  showActionAlert(ALERT_TYPES.SUCCESS, {
                    title: ALERT_MESSAGES.SUCCESS_TITLE,
                    text: 'Action completed successfully',
                    icon: 'success',
                    cancelButton: false,
                    confirmButton: false,
                  })
                }}
                onError={() => {
                  showActionAlert(ALERT_TYPES.FAILED, {
                    title: 'Action Failed',
                    text: 'Failed to complete the action',
                    icon: 'error',
                    cancelButton: false,
                    confirmButton: false,
                  })
                }}
                customHandlers={{
                  handleCancel: () => router.push('/'),
                  isDisabled: isLoading,
                }}
              />
            )
          }
          
          // Show upload/remove buttons for current user
          if (!isViewingOtherUser) {
            return (
              <ButtonsContainer>
                <ButtonsWrapper>
                  <ActionButtonsContainer>
                    <Grid2 container spacing={NUMBERMAP.FIVE}>
                      <Grid2 size={{ xs: NUMBERMAP.SIX }}>
                        <FormLabel>
                          <HiddenInput
                            type={UI.INPUT_TYPE}
                            inputProps={{ accept: FILE.ACCEPTED_IMAGE_TYPES }}
                            onChange={handleFileChange}
                            ref={fileInputRef}
                            disabled={isLoading}
                            id={UI.INPUT_ID}
                          />
                          <UploadButton as={UI.BUTTON_AS_SPAN as any} disabled={isLoading}>
                            {LOADING_STATES.UPLOAD_TEXT}
                          </UploadButton>
                        </FormLabel>
                      </Grid2>
                      <Grid2 size={{ xs: NUMBERMAP.SIX }}>
                        <RemoveButton onClick={handleRemove} disabled={isLoading}>
                          Remove
                        </RemoveButton>
                      </Grid2>
                    </Grid2>
                  </ActionButtonsContainer>

                  <>
                    <SaveButton onClick={handleSave} disabled={isLoading}>
                      Save
                    </SaveButton>
                    <CancelButton
                      variant="outlined"
                      onClick={handleCancel}
                      disabled={isLoading}
                    >
                      Cancel
                    </CancelButton>
                  </>
                </ButtonsWrapper>
              </ButtonsContainer>
            )
          }
          
          // Return null for other users without permissions (no need to render empty fragment)
          return null
        })()}
      </ContentContainer>
    </PageContainer>
  )
}

export default UpdateProfilePicture

