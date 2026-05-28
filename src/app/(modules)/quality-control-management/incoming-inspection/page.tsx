'use client'
import React from 'react'
import CommonSharedTale from '@/components/shared/CommonPageTable'
import { DataTable } from '@/components/ui'
import { PageContainer, UnderLine } from '@/styles/common'
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { NUMBERMAP } from '@/constants/common'
import Link from 'next/link'
import { useGetPurchaseOrdersList } from '@/hooks/modules/purchase/usePurchaseOrder'
import { formatDate } from '@/lib/utils/common'

export default function IncomingInspectionPage() {
  const { data: purchaseOrdersResponse, isLoading } = useGetPurchaseOrdersList()

  const columns: GridColDef[] = [
    {
      field: 'sno',
      headerName: 'S.No.',
      flex: NUMBERMAP.HALF,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        const index = params.api.getAllRowIds().indexOf(params.id)
        return index + NUMBERMAP.ONE
      },
    },
    {
      field: 'purchase_order_number',
      headerName: 'Purchase Order No.',
      flex: NUMBERMAP.ONE_HALF,
      sortable: false,
    },
    {
      field: 'purchase_order_date',
      headerName: 'Purchase Order Date',
      flex: NUMBERMAP.ONE_HALF,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        const dateValue = params.value;
        if (!dateValue) return '-';
        // Use the common date formatting utility that handles timezone and organization format
        return formatDate(dateValue) ?? '-';
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: NUMBERMAP.ONE,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Link href={`/quality-control-management/incoming-inspection/${params.row.purchase_order_id}`} style={UnderLine}>
          View Details
        </Link>
      ),
    },
  ]

  return (
    <PageContainer>
      <CommonSharedTale
        title="Incoming Inspection"
        Table={
          <DataTable
            rows={purchaseOrdersResponse?.data ?? []}
            columns={columns}
            IdField="purchase_order_id"
            pagination
            checkbox={false}
            loading={isLoading}
          />
        }
      />
    </PageContainer>
  )
}
