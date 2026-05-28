"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { PageContainer } from "@/styles/modules/hr/employeeList";
import { DataTable, ActionButton, showActionAlert } from "@/components/ui";
import CommonSharedTale from "@/components/shared/CommonPageTable";
import { NUMBERMAP } from "@/constants/common";
import { useGetCustomerFeedbackList, useDeleteCustomerFeedback } from "@/hooks/modules/sales/useCustomerFeedback";
import { 
  CUSTOMER_FEEDBACK_TABLE_COLUMNS, 
  CUSTOMER_FEEDBACK_TABLE_HEADERS, 
  CUSTOMER_FEEDBACK_LABELS,
  CUSTOMER_FEEDBACK_ROUTES,
  CUSTOMER_FEEDBACK_TABLE_KEYS,
} from "@/constants/modules/sales/customerFeedback";
import StatusTypography from "@/components/ui/status/ToggleStatus";
import { 
  DELETE_ALERT, 
  FAILED_ALERT, 
  SUCCESS_ALERT 
} from "@/constants/modules/dnd/formTeam";
import { TableFilters } from "@/styles/components/ui/datatable";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";

/**
 * Classification : Confidential
 **/ 

const CustomerFeedbackList: React.FC = () => {
  const router = useRouter();
  
  // API integration
  const { data: customerFeedbackResponse, isLoading, refetch } = useGetCustomerFeedbackList();
  const { mutate: deleteMutation } = useDeleteCustomerFeedback();

  // Column definitions for the customer feedback table
  const columns: GridColDef[] = [
    {
      field: CUSTOMER_FEEDBACK_TABLE_COLUMNS.SERIAL_NO,
      headerName: CUSTOMER_FEEDBACK_TABLE_HEADERS.SERIAL_NO,
      flex: NUMBERMAP.HALF,
    },
    {
      field: CUSTOMER_FEEDBACK_TABLE_COLUMNS.PRODUCT_TYPE,
      headerName: CUSTOMER_FEEDBACK_TABLE_HEADERS.PRODUCT_TYPE,
      flex: NUMBERMAP.ONE,
    },
    {
      field: CUSTOMER_FEEDBACK_TABLE_COLUMNS.PRODUCT_SUB_TYPE,
      headerName: CUSTOMER_FEEDBACK_TABLE_HEADERS.PRODUCT_SUB_TYPE,
      flex: NUMBERMAP.ONE_HALF,
    },
    {
      field: CUSTOMER_FEEDBACK_TABLE_COLUMNS.PRODUCT_NAME,
      headerName: CUSTOMER_FEEDBACK_TABLE_HEADERS.PRODUCT_NAME,
      flex: NUMBERMAP.ONE_HALF,
    },
    {
      field: CUSTOMER_FEEDBACK_TABLE_COLUMNS.CUSTOMER_NAME,
      headerName: CUSTOMER_FEEDBACK_TABLE_HEADERS.CUSTOMER_NAME,
      flex: NUMBERMAP.ONE_HALF,
    },
    {
      field: TableFilters.statusColumn,
      headerName: CUSTOMER_FEEDBACK_TABLE_HEADERS.STATUS,
      flex: NUMBERMAP.ONE,
      valueGetter: (value, row) => {
        return row[CUSTOMER_FEEDBACK_TABLE_COLUMNS.STATUS] ?? NUMBERMAP.ZERO;
      },
      renderCell: (params: GridRenderCellParams) => (
        <StatusTypography value={params.value} />
      ),
    },
    {
      field: CUSTOMER_FEEDBACK_TABLE_COLUMNS.ACTIONS,
      headerName: CUSTOMER_FEEDBACK_TABLE_HEADERS.ACTIONS,
      flex: NUMBERMAP.ONE,
      renderCell: (params: any) => {
        const isActive = params.row.status_id === NUMBERMAP.ONE;
        return (
          <ActionButton
            onDelete={() => handleDelete(params.row.customer_feedback_id)}
            onEdit={() => handleEdit(params.row.customer_feedback_id)}
            deleteDisabled={!isActive}
          />
        );
      },
    },
  ];

  // Action handlers
  const handleEdit = (id: number) => {
    router.push(`${CUSTOMER_FEEDBACK_ROUTES.DETAIL_BASE}/${id}`);
  };

  const handleDelete = (customerFeedbackId: number): void => {
    showActionAlert(DELETE_ALERT).then((result) => {
      if (result.isConfirmed) {
        deleteMutation(customerFeedbackId, {
          onSuccess: () => {
            showActionAlert(SUCCESS_ALERT);
            refetch();
          },
          onError: () => {
            showActionAlert(FAILED_ALERT);
          },
        });
      }
    });
  };

  return (
    <PageContainer>
      <CommonSharedTale
        pathName={CUSTOMER_FEEDBACK_ROUTES.CREATE}
        title={CUSTOMER_FEEDBACK_LABELS.CUSTOMER_FEEDBACK_LIST}
        Table={
          <DataTable
            rows={customerFeedbackResponse?.data ?? []}
            columns={columns}
            IdField={CUSTOMER_FEEDBACK_TABLE_KEYS.ID_FIELD}
            checkbox={false}
            loading={isLoading}
          />
        }
      />
    </PageContainer>
  );
};

export default CustomerFeedbackList;
