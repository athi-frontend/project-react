/**
 * Classification : Confidential
 **/
'use client'
import React from 'react'
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import { Box } from '@mui/material'
import { useRouter } from 'next/navigation'
import { PageContainer } from '@/styles/modules/hr/employeeList'
import { DataTable } from '@/components/ui'
import ActionButton from '@/components/ui/action-button/ActionButton'
import CommonSharedTale from '@/components/shared/CommonPageTable'
import { useAllPurchaseOrders } from '@/hooks/modules/vendor-management/useCommonDropdown'
import {
  SANITY_CHECK_TABLE_COLUMNS,
  SANITY_CHECK_PAGE_CONSTANTS,
  SANITY_CHECK_TABLE_FIELDS,
  SANITY_CHECK_PATHS,
  PURCHASE_ORDER_TYPE,
} from '@/constants/modules/quality-control-management/sanityCheckInspection'
import { NUMBERMAP } from '@/constants/common'
import { convertUtcToLocal } from '@/lib/utils/common'

const SanityCheckInspectionPage: React.FC = () => {
  const router = useRouter()

  // API hooks
  const { data: sanityCheckListData, isLoading: isSanityCheckListLoading } =
    useAllPurchaseOrders(NUMBERMAP.ONE, undefined, PURCHASE_ORDER_TYPE.PART)

  // Handle edit - navigate with purchase_order_id only
  const handleEdit = (row: any) => {
    if (row.purchase_order_id) {
      router.push(SANITY_CHECK_PATHS.EDIT_PATH(row.purchase_order_id))
    }
  }

  // Render actions cell - only Edit icon (no delete)
  const renderActionsCell = (params: GridRenderCellParams) => {
    return (
      <Box>
        <ActionButton onEdit={() => handleEdit(params.row)} />
      </Box>
    )
  }

  // Render date cell
  const renderDateCell = (params: GridRenderCellParams) => {
    if (!params.value) return '-'
    return convertUtcToLocal(params.value)
  }

  // Define columns for sanity check inspection table
  const columns: GridColDef[] = [
    {
      field: SANITY_CHECK_TABLE_FIELDS.SNO,
      headerName: SANITY_CHECK_TABLE_COLUMNS.SNO.headerName,
      flex: NUMBERMAP.HALF,
    },
    {
      field: SANITY_CHECK_TABLE_FIELDS.VENDOR_NAME,
      headerName: SANITY_CHECK_TABLE_COLUMNS.VENDOR_NAME.headerName,
      flex: SANITY_CHECK_TABLE_COLUMNS.VENDOR_NAME.flex,
    },
    {
      field: SANITY_CHECK_TABLE_FIELDS.PURCHASE_ORDER_NUMBER,
      headerName: SANITY_CHECK_TABLE_COLUMNS.PURCHASE_ORDER_NUMBER.headerName,
      flex: SANITY_CHECK_TABLE_COLUMNS.PURCHASE_ORDER_NUMBER.flex,
    },
    {
      field: SANITY_CHECK_TABLE_FIELDS.PURCHASE_ORDER_DATE,
      headerName: SANITY_CHECK_TABLE_COLUMNS.PURCHASE_ORDER_DATE.headerName,
      flex: SANITY_CHECK_TABLE_COLUMNS.PURCHASE_ORDER_DATE.flex,
      renderCell: renderDateCell,
    },
    {
      field: SANITY_CHECK_TABLE_FIELDS.ACTIONS,
      headerName: SANITY_CHECK_TABLE_COLUMNS.ACTIONS.headerName,
      renderCell: renderActionsCell,
    },
  ]

  return (
    <PageContainer>
      <CommonSharedTale
        title={SANITY_CHECK_PAGE_CONSTANTS.PAGE_TITLE}
        pathName={SANITY_CHECK_PATHS.CREATE_PATH}
        Table={
          <DataTable
            rows={sanityCheckListData?.data ?? []}
            columns={columns}
            IdField={SANITY_CHECK_PAGE_CONSTANTS.TABLE_ID_FIELD}
            loading={isSanityCheckListLoading}
          />
        }
      />
    </PageContainer>
  )
}

export default SanityCheckInspectionPage
