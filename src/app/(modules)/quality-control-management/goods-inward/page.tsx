'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { PageContainer } from '@/styles/modules/hr/employeeList'
import { ActionButton, DataTable, showActionAlert } from '@/components/ui'
import CommonSharedTale from '@/components/shared/CommonPageTable'
import { NUMBERMAP } from '@/constants/common'
import StatusTypography from '@/components/ui/status/ToggleStatus'
import {
  useAllGoodsInward,
  useDeleteGoodsInward,
} from '@/hooks/modules/quality-control-management/useGoodsInward'
import { formatDate, COMMON_CONSTANTS } from '@/lib/utils/common'
import {
  GOODS_INWARD_CONSTANTS,
  GOODS_INWARD_FIELD_ID,
  GOODS_INWARD_TABLE_COLUMNS,
  PAGE_TITLES,
  CREATE,
  TABLE_COLUMN_LABELS,
  TABLE_FIELD_NAMES,
} from '@/constants/modules/quality-control-management/goodsInward'
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'

/**
 *Classification : Confidential
 **/

const PurchaseGoodInwardPage: React.FC = () => {
  const router = useRouter()
  const { data: goodsInwardResponse, isLoading } = useAllGoodsInward()
  const deleteMutation = useDeleteGoodsInward()

  // Action handlers
  const handleEdit = (id: number) => {
    router.push(`${GOODS_INWARD_CONSTANTS.PATH}/${id}`)
  }

  const handleDelete = async (id: number) => {
    const result = await showActionAlert(COMMON_CONSTANTS.DELETE_ALERT)
    if (!result?.isConfirmed) 
    {
      return
    }

   await deleteMutation.mutateAsync(id)
   showActionAlert(COMMON_CONSTANTS.SUCCESS_ALERT)
  }

  // Columns: Use constants directly and add status & action columns
  const columns: GridColDef[] = [
    ...GOODS_INWARD_TABLE_COLUMNS.map((col) => {
      if (col.field === TABLE_FIELD_NAMES.PURCHASE_ORDER_DATE) {
        return {
          ...col,
          renderCell: (params: GridRenderCellParams) => {
            const dateValue = params.row[TABLE_FIELD_NAMES.PURCHASE_ORDER_DATE]
            if (!dateValue) return '-'
            return formatDate(dateValue) ?? '-'
          },
        }
      }
      return col
    }),
    {
      field: TABLE_FIELD_NAMES.STATUS,
      headerName: TABLE_COLUMN_LABELS.STATUS,
      flex: NUMBERMAP.TWO,
      valueGetter: (value, row) => {
        return (row[TABLE_FIELD_NAMES.STATUS_ID] ?? row[TABLE_FIELD_NAMES.STATUS] ??  NUMBERMAP.ZERO );
      },
      renderCell: (params: any) => {
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
      renderCell: (params: any) => {
        const statusId =
          params.row[TABLE_FIELD_NAMES.STATUS_ID] ??
          params.row[TABLE_FIELD_NAMES.STATUS]
        return (
          <ActionButton
            onEdit={() => handleEdit(params.row[GOODS_INWARD_FIELD_ID])}
            onDelete={() => handleDelete(params.row[GOODS_INWARD_FIELD_ID])}
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
        pathName={`${GOODS_INWARD_CONSTANTS.PATH}/${CREATE}`}
        Table={
          <DataTable
            rows={goodsInwardResponse?.data ?? []}
            columns={columns}
            loading={isLoading}
            IdField={GOODS_INWARD_FIELD_ID}
          />
        }
      />
    </PageContainer>
  )
}

export default PurchaseGoodInwardPage
