'use client'
import React from 'react'
import { useGetPurchaseOrdersList } from '@/hooks/modules/purchase/usePurchaseOrder'
import { DataTable } from '@/components/ui'
import CommonSharedTale from '@/components/shared/CommonPageTable'
import { PageContainer, UnderLine } from '@/styles/common'
import { NUMBERMAP } from '@/constants/common'
import { PURCHASE_ORDER_TABLE, PurchaseOrderColumsRG } from '@/constants/modules/purchase/recordGeneration'
import Link from 'next/link'
import { formatDate } from '@/lib/utils/common'

/**
 *Classification : Confidential
 **/

const PurchaseOrderTable: React.FC<{ title: string; pathName: string }> = ({
  title,
  pathName,
}) => {
  const { data: purchaseOrdersData, isLoading } = useGetPurchaseOrdersList()


  const columns = [
    ...PurchaseOrderColumsRG.filter((col)=>col.field!='part_number'),
    {
      field: 'purchase_order_date',
      headerName: 'PO Date',
      flex: NUMBERMAP.ONE,
      renderCell: (params: any) => {
        return params.value ? formatDate(params.value) : '-'
      },
    },
    {
      field: PURCHASE_ORDER_TABLE.TABLE_COLUMNS.ACTION,
      headerName: PURCHASE_ORDER_TABLE.TABLE_HEADERS.VIEW,
      flex: NUMBERMAP.HALF,
      renderCell: (params: any) => (
        <Link href={`${pathName}/${params.row[PURCHASE_ORDER_TABLE.ID_FIELD]}`} style={UnderLine}>
          Hyperlink
        </Link>
      ),
    },
  ]

  return (
    <PageContainer sx={{ paddingTop: NUMBERMAP.ZERO }}>
      <CommonSharedTale
        title={title}
        Table={
          <DataTable
            IdField={PURCHASE_ORDER_TABLE.ID_FIELD}
            rows={purchaseOrdersData?.data ?? []}
            columns={columns}
            loading={isLoading}
          />
        }
      />
    </PageContainer>
  )
}

export default PurchaseOrderTable

