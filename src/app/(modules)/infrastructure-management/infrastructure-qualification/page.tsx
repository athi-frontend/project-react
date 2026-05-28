'use client'
import React from 'react'
import { PageContainer } from '@/styles/modules/hr/employeeList'
import { DataTable, ActionButton, showActionAlert } from '@/components/ui'
import CommonSharedTale from '@/components/shared/CommonPageTable'
import { NUMBERMAP, STATUS } from '@/constants/common'
import StatusTypography from '@/components/ui/status/ToggleStatus'
import {
  useAllInfrastructureQualifications,
  useDeleteInfrastructureQualification,
} from '@/hooks/modules/infrastructure-management/useInfrastructureQualification'
import { DELETE_ALERT } from '@/constants/modules/dnd/formTeam'
import {
  PAGE_TITLES,
  TABLE_COLUMN_HEADERS,
  TABLE_COLUMN_FIELDS,
  KEY_FIELDS,
  ROUTES,
} from '@/constants/modules/infrastructure-management/infrastructureQualification'
import { useRouter } from 'next/navigation'
import { GridRenderCellParams } from '@mui/x-data-grid'

/**
 * Classification : Confidential
 **/

const InfrastructureQualificationList: React.FC = () => {
  const router = useRouter()
  const deleteMutation = useDeleteInfrastructureQualification()
  const { data: infrastructureQualificationData, isLoading } =
    useAllInfrastructureQualifications()

  // Column definitions for the table matching the design
  const columns = [
    {
      field: TABLE_COLUMN_FIELDS.SNO,
      headerName: TABLE_COLUMN_HEADERS.SNO,
      flex: NUMBERMAP.HALF,
    },
    {
      field: TABLE_COLUMN_FIELDS.INFRASTRUCTURE_CATEGORY,
      headerName: TABLE_COLUMN_HEADERS.INFRASTRUCTURE_CATEGORY,
      flex: NUMBERMAP.ONE_HALF,
    },
    {
      field: TABLE_COLUMN_FIELDS.INFRASTRUCTURE_TYPE,
      headerName: TABLE_COLUMN_HEADERS.INFRASTRUCTURE_TYPE,
      flex: NUMBERMAP.ONE_HALF,
    },
    {
      field: TABLE_COLUMN_FIELDS.INFRASTRUCTURE_NAME,
      headerName: TABLE_COLUMN_HEADERS.INFRASTRUCTURE_NAME,
      flex: NUMBERMAP.ONE_HALF,
    },
    {
      field: TABLE_COLUMN_FIELDS.INFRASTRUCTURE_SERIAL_NUMBER,
      headerName: TABLE_COLUMN_HEADERS.INFRASTRUCTURE_SERIAL_NUMBER,
      flex: NUMBERMAP.ONE_HALF,
    },
    {
      field: TABLE_COLUMN_FIELDS.STATUS,
      headerName: TABLE_COLUMN_HEADERS.STATUS,
      flex: NUMBERMAP.ONE,
      renderCell: (params: GridRenderCellParams) => (
        <StatusTypography value={params.row.status} />
      ),
    },
    {
      field: TABLE_COLUMN_FIELDS.ACTION,
      headerName: TABLE_COLUMN_HEADERS.ACTIONS,
      flex: NUMBERMAP.ONE,
      renderCell: (params: GridRenderCellParams) => {
        // For inactive records: edit enabled, delete disabled
        const isInactive = params.row.status !== NUMBERMAP.ONE
        return (
          <ActionButton
            onDelete={() =>
              handleDelete(params.row.infrastructure_qualification_id)
            }
            onEdit={() => handleEdit(params.row.infrastructure_qualification_id)}
            deleteDisabled={isInactive}
          />
        )
      },
    },
  ]

  // Action handlers
  const handleEdit = (id: number) => {
    router.push(ROUTES.EDIT(id))
    // Add your edit logic here
  }

  const handleDelete = (id: number) => {
    showActionAlert(DELETE_ALERT)
      .then((result) => {
        if (result?.isConfirmed === true) {
          deleteMutation.mutate(id)
        }
      })
      .catch(() => {
        showActionAlert(STATUS.FAILED)
      })
  }

  return (
    <PageContainer>
      <CommonSharedTale
        pathName={ROUTES.CREATE}
        title={PAGE_TITLES.INFRASTRUCTURE_QUALIFICATION}
        Table={
          <DataTable
            rows={infrastructureQualificationData?.data ?? []}
            columns={columns}
            IdField={KEY_FIELDS.INFRASTRUCTURE_QUALIFICATION_ID}
            loading={isLoading}
          />
        }
      />
    </PageContainer>
  )
}

export default InfrastructureQualificationList
