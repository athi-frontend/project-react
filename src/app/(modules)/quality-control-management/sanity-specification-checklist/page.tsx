'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { PageContainer } from '@/styles/modules/hr/employeeList'
import { ActionButton, DataTable, showActionAlert } from '@/components/ui'
import CommonSharedTale from '@/components/shared/CommonPageTable'
import { NUMBERMAP } from '@/constants/common'
import StatusTypography from '@/components/ui/status/ToggleStatus'
import { TableFilters } from '@/styles/components/ui/datatable'
import {
  useSanitySpecificationChecklistList,
  useDeleteSanitySpecificationChecklist,
} from '@/hooks/modules/quality-control-management/useSanitySpecificationChecklist'
import {
  PAGE_TITLE,
  ROUTES,
  sanitySpecificationColumns,
  SANITY_SPECIFICATION_TABLE,
} from '@/constants/modules/quality-control-management/sanitySpecificationChecklist'
import { COMMON_CONSTANTS } from '@/lib/modules/dnd/commonUtils'

/**
 *Classification : Confidential
 **/

const SanitySpecificationPage: React.FC = () => {
  const { data, isLoading } = useSanitySpecificationChecklistList()
  const router = useRouter()
  const { mutate: deleteSpecification } =
    useDeleteSanitySpecificationChecklist()

  const handleDelete = (id: number | null): void => {
    showActionAlert(COMMON_CONSTANTS.ALERT_STATUS.DELETE_ALERT).then(
      (result) => {
        if (!result.isConfirmed) return
        deleteSpecification(id, {
          onSuccess: () => {
            showActionAlert(COMMON_CONSTANTS.ALERT_STATUS.SUCCESS_ALERT)
          },
          onError: () => {
            showActionAlert(COMMON_CONSTANTS.ALERT_STATUS.FAILED_ALERT)
          },
        })
      }
    )
  }

  const columns = [
    ...sanitySpecificationColumns,
    {
      field: TableFilters.statusColumn,
      headerName: SANITY_SPECIFICATION_TABLE.HEADER_NAME.STATUS,
      flex: NUMBERMAP.ONE,
      valueGetter: (value, row) => {
        return row[SANITY_SPECIFICATION_TABLE.FIELD_NAMES.STATUS]
      },
      renderCell: (params) => {
        return <StatusTypography value={params.value} />
      },
    },
    {
      field: SANITY_SPECIFICATION_TABLE.FIELD_NAMES.ACTIONS,
      headerName: SANITY_SPECIFICATION_TABLE.HEADER_NAME.ACTIONS,
      sortable: false,
      renderCell: (params: any) => (
        <ActionButton
          onEdit={() =>
            router.push(`${ROUTES.EDIT(params.row.product_order_id)}`)
          }
          onDelete={() => {
            const id = params.row.sanity_specification_checklist_id
            if (!id) return
            handleDelete(id)
          }}
          deleteDisabled={params.row.status_id==NUMBERMAP.TWO}
        />
      ),
    },
  ]

  return (
    <PageContainer>
      <CommonSharedTale
        title={PAGE_TITLE}
        pathName={ROUTES.CREATE}
        Table={
          <DataTable
            IdField={SANITY_SPECIFICATION_TABLE.IDFIELD}
            rows={data?.data ?? []}
            columns={columns}
            loading={isLoading}
          />
        }
      />
    </PageContainer>
  )
}

export default SanitySpecificationPage
