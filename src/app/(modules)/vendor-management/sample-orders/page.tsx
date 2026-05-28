"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { PageContainer } from "@/styles/modules/hr/employeeList";
import { DataTable, ActionButton, showActionAlert } from "@/components/ui";
import CommonSharedTale from "@/components/shared/CommonPageTable";
import { NUMBERMAP } from "@/constants/common";
import { formatDate } from "@/lib/utils/common";
import StatusTypography from "@/components/ui/status/ToggleStatus";
import {
  useGetSampleOrdersList,
  useDeleteSampleOrder,
} from "@/hooks/modules/vendor-management/useSampleOrders";
import {
  HEADER_SNO,
  HEADER_VENDOR_TYPE,
  HEADER_VENDOR_NAME,
  HEADER_PO_NUMBER,
  HEADER_PO_DATE,
  HEADER_STATUS,
  HEADER_ACTIONS,
  SAMPLE_ORDER_SNO_VALUE,
  SAMPLE_ORDER_VENDOR_TYPE_VALUE,
  SAMPLE_ORDER_VENDOR_NAME_VALUE,
  SAMPLE_ORDER_PO_NUMBER_VALUE,
  SAMPLE_ORDER_PO_DATE_VALUE,
  SAMPLE_ORDER_STATUS_VALUE,
  SAMPLE_ORDER_ACTIONS_VALUE,
  FORM_TITLE,
  SAMPLE_ORDER_ID,
  CREATE_SAMPLE_ORDER_PATH,
  EDIT_SAMPLE_ORDER_PATH,
} from "@/constants/modules/vendor-management/sampleOrders";
import {
  DELETE_ALERT,
  FAILED_ALERT,
  SUCCESS_ALERT,
} from "@/constants/modules/dnd/formTeam";
import { GridRenderCellParams } from "@mui/x-data-grid";
import { SampleOrderData } from "@/types/modules/vendor-management/sampleOrders";

/**
*Classification : Confidential
**/

const SampleOrders: React.FC = () => {
  const router = useRouter();
  const { data: sampleOrdersResponse, isLoading, refetch: refetchSampleOrders } =
    useGetSampleOrdersList();
  const { mutate: deleteMutation } = useDeleteSampleOrder();

  // Handle delete action
  const handleDelete = (sample_order_id: number): void => {
    showActionAlert(DELETE_ALERT)
      .then((result) => {
        if (result.isConfirmed) {
          deleteMutation(sample_order_id, {
            onSuccess: () => {
              showActionAlert(SUCCESS_ALERT);
              refetchSampleOrders();
            },
            onError: () => {
              showActionAlert(FAILED_ALERT);
            },
          });
        }
      })
      .catch(() => {
        // Show fallback error message if alert fails
        showActionAlert(FAILED_ALERT);
      });
  };

  const handleEdit = (row: SampleOrderData) => {
    // Navigate to edit page with sample order ID
    router.push(EDIT_SAMPLE_ORDER_PATH(row.sample_order_id));
  };

  // Column definitions for the table
  const columns = [
    {
      field: SAMPLE_ORDER_SNO_VALUE,
      headerName: HEADER_SNO,
      flex: NUMBERMAP.HALF,
    },
    {
      field: SAMPLE_ORDER_VENDOR_TYPE_VALUE,
      headerName: HEADER_VENDOR_TYPE,
      flex: NUMBERMAP.TWO,
    },
    {
      field: SAMPLE_ORDER_VENDOR_NAME_VALUE,
      headerName: HEADER_VENDOR_NAME,
      flex: NUMBERMAP.TWO,
    },
    {
      field: SAMPLE_ORDER_PO_NUMBER_VALUE,
      headerName: HEADER_PO_NUMBER,
      flex: NUMBERMAP.TWO,
    },
    {
      field: SAMPLE_ORDER_PO_DATE_VALUE,
      headerName: HEADER_PO_DATE,
      flex: NUMBERMAP.TWO,
      renderCell: (params: GridRenderCellParams) => {
        const dateValue = params.value;
        if (!dateValue) return '-';
        // Use the common date formatting utility that handles timezone and organization format
        return formatDate(dateValue) ?? '-';
      },
    },
    {
      field: SAMPLE_ORDER_STATUS_VALUE,
      headerName: HEADER_STATUS,
      flex: NUMBERMAP.TWO,
      renderCell: (params: GridRenderCellParams) => {
        const sampleOrderStatusValue = params.row.status;
        return <StatusTypography value={Number(sampleOrderStatusValue)} />;
      },
    },
    {
      field: SAMPLE_ORDER_ACTIONS_VALUE,
      headerName: HEADER_ACTIONS,
      flex: NUMBERMAP.ONE_HALF,
      renderCell: (params: GridRenderCellParams) => {
        const sampleOrderStatus = Number(params.row.status)
        const isActive = sampleOrderStatus === NUMBERMAP.ONE

        return (
          <ActionButton
            onDelete={() => handleDelete(params.row.sample_order_id)}
            onEdit={() => handleEdit(params.row)}
            deleteDisabled={!isActive}
          />
        )
      },
      sortable: false,
      filterable: false,
    },
  ];


  return (
    <PageContainer>
      <CommonSharedTale
        title={FORM_TITLE}
        hanldeClick={() => router.push(CREATE_SAMPLE_ORDER_PATH)} 
        pathName={CREATE_SAMPLE_ORDER_PATH}
        Table={
          <DataTable
            rows={sampleOrdersResponse?.data ?? []}
            columns={columns}
            IdField={SAMPLE_ORDER_ID}
            loading={isLoading}
          />
        }
      />
    </PageContainer>
  );
};

export default SampleOrders;
