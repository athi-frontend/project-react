/**
  *Classification : Confidential
**/

'use client'

import React, { useState, useEffect } from 'react'
import UserInfo from '@/components/modules/user/UserInfo'
import { useUserInfo, usePutUserStatus } from '@/hooks/modules/user/useUserInfo'
import { useDeleteUser } from '@/hooks/modules/user/useUserOnboard'
import { useParams, useRouter } from 'next/navigation'
import { showActionAlert } from '@/components/ui/alert-modal/ActionAlert'
import { EMPTY_USER } from '@/types/modules/user/userInfo'
import { ButtonGroup, Description } from '@/components/ui'
import CommonModal from '@/components/ui/common-modal/CommonModal'
import {
  SUMMARY_LABELS,
  MESSAGES,
  URL,
  USER_ALERT,
  CUSTOMALERT,
  USER_INFO_FAILED_ALERT,
} from '@/constants/modules/user/userInfo'
import { Grid2 } from '@mui/material'
import { NUMBERMAP } from '@/constants/common'
import { FAILED } from '@/constants/modules/dnd/pnd'
import { ALERT_TYPES } from '@/constants/modules/user/setting'

const { LOCK, UNLOCK, DELETE, EDIT, CANCEL } = SUMMARY_LABELS
const { USER_ONBOARDING_URL, USER_LIST } = URL
const { REASON } = MESSAGES

function UserInfoById() {
  const params = useParams()
  const router = useRouter()
  const userId = Number(params.id)

  const { data: userInfo, isError: userInfoError } = useUserInfo(userId)
  const { mutate: updateUserStatus } = usePutUserStatus()
  const { mutate: deleteUserMutation } = useDeleteUser()

  const [isOpenComment, setIsOpenComment] = useState(false)
  const [userStatus, setUserStatus] = useState('')
  const [comment, setComment] = useState('')
  const [error, setError] = useState('')
  const [isUserLocked, setIsUserLocked] = useState(false)

  const validate = () => {
    if (!comment.trim()) {
      setError(REASON)
      return false
    }
    return true
  }

  const onSubmit = () => {
    if (!validate()) return
    handleUpdateUserStatus(comment.trim())
  }

   useEffect(() => {
  if (userInfoError || !userId || userId <= NUMBERMAP.ZERO) {
    showActionAlert(CUSTOMALERT, USER_INFO_FAILED_ALERT);
  }
}, [userInfoError, userId]);


  useEffect(() => {
    if (userInfo?.data?.[NUMBERMAP.ZERO]) {
      const userData = userInfo.data[NUMBERMAP.ZERO]
      //  status 3 is locked, 4 is unlocked 
      setIsUserLocked(userData.user_status_id === NUMBERMAP.THREE)
    }
  }, [userInfo])

  const userData = userInfo?.data?.[NUMBERMAP.ZERO] ?? EMPTY_USER

  const handleCloseModal = () => {
    setError('')
    setComment('')
    setIsOpenComment(false)
  }

  const handleUserStatus = (status: string) => {
    setUserStatus(status)
    
    
    if (status === LOCK) {
      setIsOpenComment(true)
    } else {
      const body = {
        user_status: status.toUpperCase(),
        status_reason: '',
      }
      
      updateUserStatus(
        { userId, body },
        {
          onSuccess: () => {
            setIsUserLocked(false)
            
            showActionAlert(ALERT_TYPES.CUSTOM_ALERT, {
              title: USER_ALERT.UNLOCK.TITLE,
              text: USER_ALERT.UNLOCK.TEXT,
              icon: USER_ALERT.UNLOCK.ICON_SUCCESS,
              cancelButton: false,
              confirmButton: false,
            })
          },
          onError: () => {
            showActionAlert(FAILED)
          },
        }
      )
    }
  }

  const handleUpdateUserStatus = (commentText: string) => {
    const body = {
      user_status: userStatus.toUpperCase(),
      status_reason: commentText,
    }
    
    updateUserStatus(
      { userId, body },
      {
        onSuccess: () => {
          handleCloseModal()
         
          setIsUserLocked(true)
          
          showActionAlert(ALERT_TYPES.CUSTOM_ALERT, {
            title: USER_ALERT.LOCK.TITLE,
            text: USER_ALERT.LOCK.TEXT,
            icon: USER_ALERT.LOCK.ICON_SUCCESS,
            cancelButton: false,
            confirmButton: false,
          })
        },
        onError: () => {
          showActionAlert(FAILED)
        },
      }
    )
  }

  const handleUserDelete = () => {
    showActionAlert('delete').then((result) => {
      if (result.isConfirmed) {
        deleteUserMutation(String(userId), {
          onSuccess: () => {
            showActionAlert(ALERT_TYPES.CUSTOM_ALERT,
              {
                title :USER_ALERT.DELETE.TITLE,
                text :USER_ALERT.DELETE.TEXT,
                icon : USER_ALERT.DELETE.ICON_SUCCESS,
                cancelButton :  false,
                confirmButton :  false,
              }
            )
            router.push(USER_LIST)
          },
          onError: () => {
            showActionAlert('failed')
          },
        })
      }
    })
  }
  const handleCancel = ()=>{
    router.push(USER_LIST)
  }

  return (
    <>
      <UserInfo userData={userData} />
      <ButtonGroup
        buttons={[
          {
            label: CANCEL,
            onClick: handleCancel,
            disabled: false
          },
          {
            label: LOCK,
            onClick: isUserLocked ? () => {} : () => handleUserStatus(LOCK),
            disabled: isUserLocked,
          },
          {
            label: UNLOCK,
            onClick: !isUserLocked ? () => {} : () => handleUserStatus(UNLOCK),
            disabled: !isUserLocked,
          },
          {
            label: DELETE,
            onClick: () => handleUserDelete(),
            disabled: false
          },
          {
            label: EDIT,
            onClick: () => {
              router.push(USER_ONBOARDING_URL(userId))
            },
            disabled:false
          },
        ]}
      />
      <CommonModal
        title=""
        open={isOpenComment}
        onClose={() => handleCloseModal()}
        onSave={onSubmit}
      >
        <Description
          label="Reason*"
          placeholder="Enter your comment"
          value={comment}
          onChange={(value) => {
            setComment(value as string)
            if (error) setError('')
          }}
          error={error}
        />
        <Grid2 container spacing={1}>
          <Grid2 size={{ md: NUMBERMAP.SIX }}>

          </Grid2>
          <Grid2 size={{ md: NUMBERMAP.SIX }}>
            <ButtonGroup
              buttons={[
                { label: 'Cancel', onClick: () => handleCloseModal() },
                { label: 'Save', onClick: onSubmit },
              ]}
            />
          </Grid2>
        </Grid2>


      </CommonModal>
    </>
  )
}

export default UserInfoById
