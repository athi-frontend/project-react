'use client'
import React from 'react'
import { useFetchPurchaseInformation } from '@/hooks/modules/purchase/usePurchaseOrder'
import { DataTable } from '@/components/ui'
import CommonSharedTale from '@/components/shared/CommonPageTable'
import { PageContainer, UnderLine } from '@/styles/common'
import { NUMBERMAP } from '@/constants/common'
import { PURCHASE_ORDER_TABLE, PurchaseOrderColumsRG } from '@/constants/modules/purchase/recordGeneration'
import Link from 'next/link'

/**
 *Classification : Confidential
 **/

const PurchaseInformationTable: React.FC<{ title: string; pathName: string }> = ({
  title,
  pathName,
}) => {
  const { data: purchaseInformationData, isLoading } = useFetchPurchaseInformation()

  const columns = [
    ...PurchaseOrderColumsRG,
    {
      field: PURCHASE_ORDER_TABLE.TABLE_COLUMNS.ACTION,
      headerName: PURCHASE_ORDER_TABLE.TABLE_HEADERS.VIEW,
      flex: NUMBERMAP.HALF,
      renderCell: (params: any) => (
        <Link href={`${pathName}/${params.row['purchase_order_part_details_id']}`} style={UnderLine}>
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
            IdField={'purchase_order_part_details_id'}
            rows={purchaseInformationData?.data ?? []}
            columns={columns}
            loading={isLoading}
          />
        }
      />
    </PageContainer>
  )
}

export default PurchaseInformationTable

