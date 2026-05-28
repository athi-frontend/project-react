'use client'
import React from 'react'
import { Grid2 } from '@mui/material'
import InfoField from '../dnd/project-info/InfoField'
import { UserInfoProps } from '@/types/modules/user/userInfo'
import {
  StyledPaper,
  SectionTitle,
} from '@/styles/components/modules/projectInfo'
import { SUMMARY_LABELS, MESSAGES } from '@/constants/modules/user/userInfo'
const { NA } = MESSAGES

const UserInfo: React.FC<UserInfoProps> = ({ userData }) => {
  const {
    FIRST_NAME,
    LAST_NAME,
    EMAIL_ID,
    CONTACT_NUMBER,
    DEPARTMENT,
    ROLES,
    GROUP_NAME,
    DESIGNATION,
    CONTACT_EMAIL,
    MOBILE,
  } = SUMMARY_LABELS

  return (
    <StyledPaper elevation={0}>
      <SectionTitle variant="h5">User Details</SectionTitle>
      <Grid2 container spacing={1}>
        {[
          { label: FIRST_NAME, value: userData?.firstName ?? NA },
          { label: LAST_NAME, value: userData?.lastName ?? NA },
          {
            label: EMAIL_ID,
            value:
              userData?.contact?.find((c) => c?.contact_type === CONTACT_EMAIL)
                ?.contact ?? NA,
          },
          {
            label: CONTACT_NUMBER,
            value:
              userData?.contact?.find((c) => c?.contact_type === MOBILE)
                ?.contact ?? NA,
          },
          { label: DEPARTMENT, value: userData?.department_name ?? NA },
          {
            label: ROLES,
            value:
              userData?.roles?.length > 0
                ? userData.roles
                    .map((role) => role?.role_name ?? '')
                    .filter(Boolean)
                    .join(', ')
                : NA,
          },
          { label: GROUP_NAME, value: userData?.service_group_name ?? NA },
          { label: DESIGNATION, value: userData?.designation_name ?? NA },
        ].map(({ label, value }) => (
          <InfoField key={label} label={label} value={value} />
        ))}
      </Grid2>
    </StyledPaper>
  )
}

export default UserInfo
