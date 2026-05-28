'use client'
import React, { useState, useEffect } from 'react'
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import {
  useProjectUsers,
  useDeleteUser,
} from '@/hooks/modules/user/useUserOnboard'
import {
  TABLESTRINGCONSTANTS,
  USER_ONBOARD_ROUTES,
  USER_ONBOARD_LABELS,
  QUERYCONSTANTS,
  DELETE_USER_ALERT,
} from '@/constants/modules/user/userOnboard'
import {
  StatusCell,
} from '@/components/modules/user/UserOnboardActionColum'
import { RawUser, ProjectUser } from '@/types/modules/user/userOnBoard'
import { ActionButton, DataTable, PageHeader, showActionAlert } from '@/components/ui'
import { TableContainer } from '@/styles/components/ui/table'
import { Grid2 } from '@mui/material'
import { NoUnderline, UnderLine } from '@/styles/common'
import { NUMBERMAP } from '@/constants/common'

/**
 * Classification: Confidential
 */

export default function UserList() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [projectUsers, setProjectUsers] = useState<ProjectUser[]>([])
  const [searchValue, setSearchValue] = useState('')
  const { data, isLoading } = useProjectUsers()
  const deleteUserMutation = useDeleteUser()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (data?.data) {
        const transformedUsers: ProjectUser[] = data.data.map(
          (user: RawUser, index: number) => ({
            ...user,
            id: user.id ?? `temp-${index}`,
            emailId: user.contact?.find(
              (c) => c.contact_type === TABLESTRINGCONSTANTS.CONTACT_TYPE_EMAIL
            )?.contact,
            Name: `${user.firstName} ${user.lastName}`,
            roleName: user?.role_names?.join(', ') ?? user?.roles?.map((r) => r.role_name).join(', ') ?? '',
            department_name: user.department_name,
            status: Number(user.status),
          })
        )
        setProjectUsers(transformedUsers)
      } else {
        setProjectUsers([])
      }
    }
  }, [data])

  const handleDelete = (row: ProjectUser) => {
    showActionAlert(DELETE_USER_ALERT.NAME, {
      title: DELETE_USER_ALERT.TITLE,
      text: DELETE_USER_ALERT.TEXT,
      icon: DELETE_USER_ALERT.ICON,
      cancelButton: true,
      confirmButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        performDelete(row.id)
      }
    })
  }

  const performDelete = (userId: string) => {
    deleteUserMutation.mutate(userId, {
      onSuccess: () => updateUserList(userId),
    })
  }

  const updateUserList = (userId: string) => {
    const updatedUsers = projectUsers.map((user) =>
      user.id === userId ? { ...user, status: 0 } : user
    )
    setProjectUsers(updatedUsers)
    queryClient.invalidateQueries({
      queryKey: [QUERYCONSTANTS.QUERY_KEYS.PROJECT_USERS],
    })
  }

  const handleEdit = (row: ProjectUser) => {
    router.push(`${USER_ONBOARD_ROUTES.BASE}/${row.type==='draft' ? 'draft' : row.id}`)
  }

  const handleSearchChange = (value: string) => {
    setSearchValue(value)
  }

  const columns: GridColDef[] = [
    {
      field: 'sno',
      headerName: TABLESTRINGCONSTANTS.HEADER_NAMES.S_NO,
      flex:NUMBERMAP.ONE,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params: GridRenderCellParams) => {
        const index = params.api.getRowIndexRelativeToVisibleRows(params.id)
        return <span>{index + NUMBERMAP.ONE}</span>
      },
    },
    {
      field: TABLESTRINGCONSTANTS.FIELD_NAMES.EMAIL_ID,
      headerName: TABLESTRINGCONSTANTS.HEADER_NAMES.EMAIL_ID,
      flex:NUMBERMAP.ONE,
    },
    {
      field: TABLESTRINGCONSTANTS.FIELD_NAMES.NAME,
      headerName: TABLESTRINGCONSTANTS.HEADER_NAMES.NAME,
      flex:NUMBERMAP.ONE,
      renderCell: (params: GridRenderCellParams) => {
        return (
          params.row.type==='draft'?params.row.name:
          <Grid2 sx={params.row.status ? UnderLine : NoUnderline}>
            <Link
              href={params.row.status ? `/user/details/${params.row.id}` : '#'}
            >
              {params.row.Name}
            </Link>
          </Grid2>
        )
      },
    },
    {
      field: TABLESTRINGCONSTANTS.FIELD_NAMES.ROLE_NAME,
      headerName: TABLESTRINGCONSTANTS.HEADER_NAMES.ROLE_CATEGORY,
      flex:NUMBERMAP.ONE,
    },
    {
      field: TABLESTRINGCONSTANTS.FIELD_NAMES.DEPARTMENT_NAME,
      headerName: TABLESTRINGCONSTANTS.HEADER_NAMES.DEPARTMENT,
      flex:NUMBERMAP.ONE,
    },
    {
      field: TABLESTRINGCONSTANTS.FIELD_NAMES.STATUS,
      headerName: TABLESTRINGCONSTANTS.HEADER_NAMES.STATUS,
      flex:NUMBERMAP.ONE,
      renderCell: (params: GridRenderCellParams) => (
        params.row.type==='draft' ? 'Draft' :
        <StatusCell status={params.row.status} />
      ),
    },
    {
      field: TABLESTRINGCONSTANTS.FIELD_NAMES.ACTION,
      headerName: TABLESTRINGCONSTANTS.HEADER_NAMES.ACTION,
      flex:NUMBERMAP.ONE,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <ActionButton
          deleteDisabled={params.row.type==='draft'}
          onDelete={() => handleDelete(params.row)}
          disabled={!params.row.status && !params.row.type}
          onEdit={() => handleEdit(params.row)}
        />
      ),
    },
  ]

  return (
    <TableContainer>
      <PageHeader
        title={TABLESTRINGCONSTANTS.HEADER_TITLE}
        showSearch={true}
        searchPlaceholder="Search users..."
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
        actionButtons={[
          {
            label: USER_ONBOARD_LABELS.CREATE_USER,
            onClick: () => {
              router.push(USER_ONBOARD_ROUTES.NEW)
            },
          },
        ]}
      />
      <DataTable
        rows={projectUsers}
        columns={columns}
        IdField={TABLESTRINGCONSTANTS.ID_FIELD}
        checkbox={false}
        pagination={true}
        loading={isLoading}
        searchValue={searchValue}
      />
    </TableContainer>
  )
}
