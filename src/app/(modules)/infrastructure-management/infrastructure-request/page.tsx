'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { PageContainer } from '@/styles/modules/hr/employeeList'
import { ActionButton, DataTable, showActionAlert } from '@/components/ui'
import CommonSharedTale from '@/components/shared/CommonPageTable'
import { NUMBERMAP } from '@/constants/common'
import StatusTypography from '@/components/ui/status/ToggleStatus'
import {
  useAllInfrastructureRequest,
  useDeleteInfrastructureRequest,
} from '@/hooks/modules/infrastructure-management/useInfrastructureRequest'
import { COMMON_CONSTANTS, stripHtml } from '@/lib/utils/common'
import {
  INFRASTRUCTURE_REQUEST_CONSTANTS,
  INFRASTRUCTURE_REQUEST_FIELD_ID,
  INFRASTRUCTURE_REQUEST_TABLE_COLUMNS,
  PAGE_TITLES,
  CREATE,
  TABLE_COLUMN_LABELS,
  TABLE_FIELD_NAMES,
  API_FIELD_KEYS,
} from '@/constants/modules/infrastructure-management/infrastructureRequest'

import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { FAILED_ALERT, SUCCESS_ALERT } from '@/constants/modules/dnd/formTeam'

/**
 * Classification : Confidential
 **/

const InfrastructureRequestList: React.FC = () => {
  const router = useRouter()

  const { data: infrastructureRequestData, isLoading } = useAllInfrastructureRequest()

  const deleteMutation = useDeleteInfrastructureRequest()

  // Action handlers
  const handleEdit = (id: number) => {
    router.push(`${INFRASTRUCTURE_REQUEST_CONSTANTS.PATH}/${id}`)
  }

  const handleDelete = async (id: number) => {
    const result = await showActionAlert(COMMON_CONSTANTS.DELETE_ALERT)
    if (!result?.isConfirmed) {
      return
    }

    deleteMutation.mutate(id, {
      onSuccess: () => {
        showActionAlert(SUCCESS_ALERT)
      },
      onError: () => {
        showActionAlert(FAILED_ALERT)
      },
    })
  }

  // Columns: Use constants directly and add status & action columns
  const columns: GridColDef[] = [
    ...INFRASTRUCTURE_REQUEST_TABLE_COLUMNS.map((col) => {
      if (col.field === TABLE_FIELD_NAMES.INFRASTRUCTURE_CATEGORY) {
        return {
          ...col,
          renderCell: (params: GridRenderCellParams) => {
            return params.row.category_name
          },
        }
      }
      if (col.field === TABLE_FIELD_NAMES.INFRASTRUCTURE_TYPE) {
        return {
          ...col,
          renderCell: (params: GridRenderCellParams) => {
            return params.row.type_name
          },
        }
      }
      if (col.field === TABLE_FIELD_NAMES.INFRASTRUCTURE_NAME) {
        return {
          ...col,
          renderCell: (params: GridRenderCellParams) => {
            return stripHtml(params.row[API_FIELD_KEYS.INFRASTRUCTURE_NAME])
          },
        }
      }
      return col
    }),
    {
      field: TABLE_FIELD_NAMES.STATUS,
      headerName: TABLE_COLUMN_LABELS.STATUS,
      flex: NUMBERMAP.ONE_HALF,
      renderCell: (params: GridRenderCellParams) => {
        const statusId =
          params.row[TABLE_FIELD_NAMES.STATUS_ID] ??
          params.row[TABLE_FIELD_NAMES.STATUS] ??
          NUMBERMAP.ZERO
        return <StatusTypography value={statusId === NUMBERMAP.ONE ? NUMBERMAP.ONE : NUMBERMAP.ZERO} />
      },
    },
    {
      field: TABLE_FIELD_NAMES.ACTIONS,
      headerName: TABLE_COLUMN_LABELS.ACTIONS,
      sortable: false,
      renderCell: (params) => {
        const statusId =
          params.row[TABLE_FIELD_NAMES.STATUS_ID] ??
          params.row[TABLE_FIELD_NAMES.STATUS]

        return (
          <ActionButton
            onEdit={() => handleEdit(params.row[INFRASTRUCTURE_REQUEST_FIELD_ID])}
            onDelete={() => handleDelete(params.row[INFRASTRUCTURE_REQUEST_FIELD_ID])}
            deleteDisabled={statusId !== NUMBERMAP.ONE}
          />
        )
      },
    },
  ]

  return (
    <PageContainer>
      <CommonSharedTale
        title={PAGE_TITLES.LIST}
        pathName={`${INFRASTRUCTURE_REQUEST_CONSTANTS.PATH}/${CREATE}`}
        Table={
          <DataTable
            rows={infrastructureRequestData?.data ?? []}
            columns={columns}
            loading={isLoading}
            IdField={INFRASTRUCTURE_REQUEST_FIELD_ID}
          />
        }
      />
    </PageContainer>
  )
}

export default InfrastructureRequestList