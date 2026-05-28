'use client'
import React, { useEffect } from 'react'
import { PageContainer } from '@/styles/modules/hr/employeeList'
import { DataTable, ActionButton, showActionAlert } from '@/components/ui'
import CommonSharedTale from '@/components/shared/CommonPageTable'
import { NUMBERMAP, STATUS } from '@/constants/common'
import {
  useAllVendors,
  useDeleteVendor,
} from '@/hooks/modules/vendor-management/useVendorList'
import {
  ALERT_MESSAGES,
  vendorListColumns,
  VENDOR_LIST_PATH,
  VENDOR_LIST_TITLE,
  ACTION_COLUMN,
} from '@/constants/modules/vendor-management/vendorList'
import { useRouter } from 'next/navigation'
import { VendorListTableRow } from '@/types/modules/vendor-management/vendorList'
import StatusTypography from '@/components/ui/status/ToggleStatus'

/**
 *Classification : Confidential
 **/

const VendorList: React.FC = () => {
  const router = useRouter()

  // Fetch all vendors
  const { data: vendors, isLoading, refetch } = useAllVendors(false,NUMBERMAP.ONE)
  const { mutate: deleteMutation } = useDeleteVendor()

  // Render action cell
  const renderActionCell = (params: { row: VendorListTableRow }) => {
    return (
      <ActionButton
        deleteDisabled={params.row.status!==NUMBERMAP.ONE}
        onEdit={() => handleEdit(params.row.id)}
        onDelete={() => handleDelete(params.row.id)}
      />
    )
  }

  const handleEdit = (id: number) => {
    router.push(VENDOR_LIST_PATH + '/' + id)
  }

  const handleDelete = (id: number) => {
    showActionAlert('customAlert', {
      title: ALERT_MESSAGES.DELETE_CONFIRMATION_TITLE,
      text: ALERT_MESSAGES.DELETE_CONFIRMATION_TEXT,
      icon: 'warning' as const,
      cancelButton: true,
      confirmButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation(id, {
          onSuccess: () => {
            showActionAlert(STATUS.SUCCESS)
            handleFetchData()
          },
          onError: () => {
            showActionAlert(STATUS.FAILED)
          },
        })
      }
    })
  }

  // Get columns with render functions
  const columns = [
    ...vendorListColumns,
       {
      field: "status",
      headerName: "Status",
      flex: NUMBERMAP.ONE,
      renderCell: (params: any) => {
        return (
          <StatusTypography value={params.row.status} />
        );
      },
    },
    {
      field: ACTION_COLUMN.FIELD,
      headerName: ACTION_COLUMN.HEADER_NAME,
      renderCell: renderActionCell,
    },
  ]

  // Function to trigger data fetch
  const handleFetchData = () => {
    refetch()
  }

  useEffect(() => {
    handleFetchData()
  }, [refetch])

  return (
    <PageContainer>
      <CommonSharedTale
        title={VENDOR_LIST_TITLE}
        pathName={VENDOR_LIST_PATH + '/create'}
        Table={
          <DataTable
            rows={vendors?.data ?? []}
            columns={columns}
            IdField="id"
            loading={isLoading}
          />
        }
      />
    </PageContainer>
  )
}

export default VendorList
