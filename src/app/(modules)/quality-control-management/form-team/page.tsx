'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { PageContainer } from '@/styles/modules/hr/employeeList'
import { DataTable, ActionButton, showActionAlert } from '@/components/ui'
import CommonSharedTale from '@/components/shared/CommonPageTable'
import StatusTypography from '@/components/ui/status/ToggleStatus'
import { NUMBERMAP, STATUS } from '@/constants/common'
import {
  FT_PAGE_TITLES,
  FT_ROUTE_PATHS,
  FT_TABLE_FIELDS,
  FT_TABLE_COLUMN_HEADERS,
} from '@/constants/modules/quality-control-management/formTeam'
import {
  useGetAllFormTeam,
  useDeleteFormTeam,
} from '@/hooks/modules/quality-control-management/useFormTeam'
import { convertUtcToLocal } from '@/lib/utils/common'

/**
 * Classification: Confidential
 */

const QCFormTeam: React.FC = () => {
  const router = useRouter()
  const { data: formTeamData, isLoading } = useGetAllFormTeam()
  const { mutate: deleteFormTeam, isPending: isDeleting } = useDeleteFormTeam()

  // Column definitions for the table
  const columns = [
    {
      field: FT_TABLE_FIELDS.SNO,
      headerName: FT_TABLE_COLUMN_HEADERS.SNO,
      flex: NUMBERMAP.HALF,
    },
    {
      field: FT_TABLE_FIELDS.PURCHASE_ORDER_NO,
      headerName: FT_TABLE_COLUMN_HEADERS.PURCHASE_ORDER_NUMBER,
      flex: NUMBERMAP.ONE_HALF,
    },
    {
      field: FT_TABLE_FIELDS.PURCHASE_ORDER_DATE,
      headerName: FT_TABLE_COLUMN_HEADERS.PURCHASE_ORDER_DATE,
      flex: NUMBERMAP.ONE_HALF,
      renderCell: (params: any) => {
        return params.value ? convertUtcToLocal(params.value) : 'N/A'
      },
    },
    {
      field: FT_TABLE_FIELDS.STATUS,
      headerName: FT_TABLE_COLUMN_HEADERS.STATUS,
      flex: NUMBERMAP.ONE_HALF,
      valueGetter: (value: any, row: any) => {
        return row.status_id ?? row.status ?? NUMBERMAP.ZERO
      },
      renderCell: (params: any) => {
        const statusId = params.row.status_id ?? params.row.status ?? NUMBERMAP.ZERO
        return <StatusTypography value={statusId === NUMBERMAP.ONE ? NUMBERMAP.ONE : NUMBERMAP.ZERO} />
      },
    },
    {
      field: FT_TABLE_FIELDS.ACTIONS,
      headerName: FT_TABLE_COLUMN_HEADERS.ACTIONS,
      sortable: false,
      renderCell: (params: any) => {
        const statusId = params.row.status_id ?? params.row.status
        return (
          <ActionButton
            onDelete={() => handleDelete(params.row.team_id)}
            onEdit={() => handleEdit(params.row.purchase_order_id)}
            deleteDisabled={statusId !== NUMBERMAP.ONE}
          />
        )
      },
    },
  ]

  // Action handlers
  const handleEdit = (id: number) => {
    router.push(FT_ROUTE_PATHS.EDIT(id))
  }

  const handleDelete = async (teamId: number) => {
    const result = await showActionAlert(STATUS.DELETE)
    if (result.isConfirmed) {
      deleteFormTeam(teamId, {
        onSuccess: () => {
          showActionAlert(STATUS.SUCCESS)
        },
        onError: () => {
          showActionAlert(STATUS.FAILED)
        },
      })
    }
  }

  const isAnyLoading = (): boolean => {
    if (isLoading) return true
    if (isDeleting) return true
    return false
  }

  return (
    <PageContainer>
      <CommonSharedTale
        pathName={FT_ROUTE_PATHS.CREATE}
        title={FT_PAGE_TITLES.MAIN}
        Table={
          <DataTable
            rows={formTeamData?.data ?? []}
            columns={columns}
            loading={isAnyLoading()}
            IdField={FT_TABLE_FIELDS.ID}
            checkbox={false}
            pagination={true}
          />
        }
      />
    </PageContainer>
  )
}

export default QCFormTeam
