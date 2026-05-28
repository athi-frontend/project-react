'use client'
import React from 'react'
import { PageContainer } from '@/styles/modules/hr/employeeList'
import { DataTable } from '@/components/ui'
import CommonSharedTale from '@/components/shared/CommonPageTable'
import { useRouter } from 'next/navigation'
import { useAllNonConformanceDetails } from '@/hooks/modules/quality-control-management/useNonConformanceDetails'
import {
  NON_CONFORMANCE_DETAILS_CONSTANTS,
  ACTION_LABELS,
  NON_CONFORMANCE_DETAILS_LIST_COLUMNS,
  INSPECTION_RESULT_ID_FIELD,
  ROUTES,
} from '@/constants/modules/quality-control-management/nonConformanceDetails'
import { VIEW_DETAILS_LINK_STYLE } from '@/styles/modules/quality-control-management/nonConformanceDetails'
import { Typography } from '@mui/material'
import { formatDate } from '@/lib/utils/common'
import { GridRenderCellParams } from '@mui/x-data-grid'
import { NUMBERMAP } from '@/constants/common'

/**
 * Classification : Confidential
 **/

const NonConformanceDetailsList: React.FC = () => {
  const router = useRouter()
  // API Integration - Fetch all non-conformance details
  const { data: nonConformanceDetailsData, isLoading } =
    useAllNonConformanceDetails(NUMBERMAP.ONE)

  const columns = [
    {
      field: NON_CONFORMANCE_DETAILS_LIST_COLUMNS.SNO.FIELD,
      headerName: NON_CONFORMANCE_DETAILS_LIST_COLUMNS.SNO.HEADER,
      flex: NON_CONFORMANCE_DETAILS_LIST_COLUMNS.SNO.FLEX,
    },
    {
      field: NON_CONFORMANCE_DETAILS_LIST_COLUMNS.PURCHASE_ORDER_NUMBER.FIELD,
      headerName:
        NON_CONFORMANCE_DETAILS_LIST_COLUMNS.PURCHASE_ORDER_NUMBER.HEADER,
      flex: NON_CONFORMANCE_DETAILS_LIST_COLUMNS.PURCHASE_ORDER_NUMBER.FLEX,
    },
    {
      field: NON_CONFORMANCE_DETAILS_LIST_COLUMNS.PURCHASE_ORDER_DATE.FIELD,
      headerName:
        NON_CONFORMANCE_DETAILS_LIST_COLUMNS.PURCHASE_ORDER_DATE.HEADER,
      flex: NON_CONFORMANCE_DETAILS_LIST_COLUMNS.PURCHASE_ORDER_DATE.FLEX,
      renderCell: (params: GridRenderCellParams) => {
        const dateValue = params.row.purchase_order_date
        if (!dateValue) return '-'
        return formatDate(dateValue) ?? '-'
      },
    },
    {
      field: NON_CONFORMANCE_DETAILS_LIST_COLUMNS.PART_CATEGORY.FIELD,
      headerName: NON_CONFORMANCE_DETAILS_LIST_COLUMNS.PART_CATEGORY.HEADER,
      flex: NON_CONFORMANCE_DETAILS_LIST_COLUMNS.PART_CATEGORY.FLEX,
    },
    {
      field: NON_CONFORMANCE_DETAILS_LIST_COLUMNS.PART_NUMBER.FIELD,
      headerName: NON_CONFORMANCE_DETAILS_LIST_COLUMNS.PART_NUMBER.HEADER,
      flex: NON_CONFORMANCE_DETAILS_LIST_COLUMNS.PART_NUMBER.FLEX,
    },
    {
      field: NON_CONFORMANCE_DETAILS_LIST_COLUMNS.ACTIONS.FIELD,
      headerName: NON_CONFORMANCE_DETAILS_LIST_COLUMNS.ACTIONS.HEADER,
      flex: NON_CONFORMANCE_DETAILS_LIST_COLUMNS.ACTIONS.FLEX,
      renderCell: (params: any) => {
        ROUTES.NON_CONFORMANCE_DETAILS_CREATE(
              params.row.inspection_result_id
            )

        return (
          <Typography
            onClick={() => router.push(ROUTES.NON_CONFORMANCE_DETAILS_CREATE(params.row.inspection_result_id))}
            style={VIEW_DETAILS_LINK_STYLE}
          >
            {ACTION_LABELS.VIEW_DETAILS}
          </Typography>
        )
      },
    },
  ]

  return (
    <PageContainer>
      <CommonSharedTale
        title={NON_CONFORMANCE_DETAILS_CONSTANTS.TITLE}
        Table={
          <DataTable
            rows={nonConformanceDetailsData?.data ?? []}
            columns={columns}
            loading={isLoading}
            IdField={INSPECTION_RESULT_ID_FIELD}
          />
        }
      />
    </PageContainer>
  )
}

export default NonConformanceDetailsList

