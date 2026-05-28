"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { PageContainer } from "@/styles/modules/hr/employeeList";
import { ActionButton, DataTable, showActionAlert } from "@/components/ui";
import CommonSharedTale from "@/components/shared/CommonPageTable";
import { NUMBERMAP } from "@/constants/common";
import { formatDate } from "@/lib/utils/common";
import {
  useGetPurchaseOrdersList,
  useDeletePurchaseOrder,
} from "@/hooks/modules/purchase/usePurchaseOrder";
import {
  HEADER_SNO,
  HEADER_VENDOR_NAME,
  HEADER_PO_NUMBER,
  HEADER_PO_DATE,
  HEADER_STATUS,
  HEADER_ACTIONS,
  SNO_VALUE,
  VENDOR_NAME_VALUE,
  PO_NUMBER_VALUE,
  PO_DATE_VALUE,
  STATUS_VALUE,
  ACTIONS_VALUE,
  FORM_TITLE,
  PURCHASE_ORDER_ID,
  CREATE_PURCHASE_ORDER_PATH,
  EDIT_PURCHASE_ORDER_PATH,
} from "@/constants/modules/purchase/purchaseOrder";
import {
  DELETE_ALERT,
  FAILED_ALERT,
  SUCCESS_ALERT,
} from "@/constants/modules/dnd/formTeam";
import { GridRenderCellParams } from "@mui/x-data-grid";
import StatusTypography from "@/components/ui/status/ToggleStatus";

/**
*Classification : Confidential
**/

const PurChaseOrder: React.FC = () => {
  const router = useRouter();
  const { data: purchaseOrdersResponse, isLoading, refetch: refetchPurchaseOrders } =
    useGetPurchaseOrdersList();
  const { mutate: deleteMutation } = useDeletePurchaseOrder();

  // Handle delete action
  const handleDelete = (purchase_order_id: number): void => {
    showActionAlert(DELETE_ALERT)
      .then((result) => {
        if (result.isConfirmed) {
          deleteMutation(purchase_order_id, {
            onSuccess: () => {
              showActionAlert(SUCCESS_ALERT);
              refetchPurchaseOrders();
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

  const handleEdit = (row: any) => {
    // Navigate to edit page with purchase order ID
    router.push(EDIT_PURCHASE_ORDER_PATH(row.purchase_order_id));
  };

  // Column definitions for the table
  const columns = [
    {
      field: SNO_VALUE,
      headerName: HEADER_SNO,
      flex: NUMBERMAP.HALF,
    },
 
    {
      field: VENDOR_NAME_VALUE,
      headerName: HEADER_VENDOR_NAME,
      flex: NUMBERMAP.TWO,
    },
    {
      field: PO_NUMBER_VALUE,
      headerName: HEADER_PO_NUMBER,
      flex: NUMBERMAP.TWO,
    },
    {
      field: PO_DATE_VALUE,
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
      field: STATUS_VALUE,
      headerName: HEADER_STATUS,
      flex: NUMBERMAP.TWO,
      renderCell: (params: GridRenderCellParams) => {
        return <StatusTypography value={params.value} />
      },
    },
    {
      field: ACTIONS_VALUE,
      headerName: HEADER_ACTIONS,
      flex: NUMBERMAP.ONE_HALF,
      renderCell: (params: GridRenderCellParams) => {
        const isActive = params.row.status === NUMBERMAP.ONE

        return (
          <ActionButton
            onDelete={() => handleDelete(params.row.purchase_order_id)}
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
    <PageContainer >
      <CommonSharedTale
        title={FORM_TITLE}
        hanldeClick={() => router.push(CREATE_PURCHASE_ORDER_PATH)} 
        pathName={CREATE_PURCHASE_ORDER_PATH}
        Table={
          <DataTable
            rows={purchaseOrdersResponse?.data ?? []}
            columns={columns}   
            IdField={PURCHASE_ORDER_ID}
            loading={isLoading}
          />
        }
      />
    </PageContainer>
  );
};

export default PurChaseOrder;
