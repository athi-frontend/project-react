"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { PageContainer } from "@/styles/modules/hr/employeeList";
import { DataTable, ActionButton, showActionAlert } from "@/components/ui";
import CommonSharedTale from "@/components/shared/CommonPageTable";
import { NUMBERMAP, STATUS } from "@/constants/common";
import { 
  useAllQuotations, 
  useDeleteQuotation,
} from "@/hooks/modules/sales/useQuotation";
import { 
  QUOTATION_LIST_COLUMNS,
  QUOTATION_CONSTANTS,
  QUOTATION_KEYS,
} from "@/constants/modules/sales/quotation";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import StatusTypography from "@/components/ui/status/ToggleStatus";
import { formatDate } from "@/lib/utils/common";

/**
 * Classification : Confidential
 **/

const QuotationList: React.FC = () => {
  const router = useRouter();
  
  // Fetch quotations data
  const { 
    data: quotationsData, isLoading
  } = useAllQuotations();

  // Delete mutation
  const deleteMutation = useDeleteQuotation();

  // Column definitions for the quotation table
  const columns: GridColDef[] = [
    {
      field: QUOTATION_LIST_COLUMNS.SNO.FIELD,
      headerName: QUOTATION_LIST_COLUMNS.SNO.HEADER,
      flex: QUOTATION_LIST_COLUMNS.SNO.FLEX,
    },
    {
      field: QUOTATION_LIST_COLUMNS.QUOTATION_NUMBER.FIELD,
      headerName: QUOTATION_LIST_COLUMNS.QUOTATION_NUMBER.HEADER,
      flex: QUOTATION_LIST_COLUMNS.QUOTATION_NUMBER.FLEX,
    },
    {
      field: QUOTATION_LIST_COLUMNS.QUOTATION_DATE.FIELD,
      headerName: QUOTATION_LIST_COLUMNS.QUOTATION_DATE.HEADER,
      flex: QUOTATION_LIST_COLUMNS.QUOTATION_DATE.FLEX,
      renderCell: (params: GridRenderCellParams) => {
        const dateValue = params.value;
        if (!dateValue) return '-';
        return formatDate(dateValue) ?? '-';
      }
    },
    {
      field: QUOTATION_LIST_COLUMNS.CUSTOMER_NAME.FIELD,
      headerName: QUOTATION_LIST_COLUMNS.CUSTOMER_NAME.HEADER,
      flex: QUOTATION_LIST_COLUMNS.CUSTOMER_NAME.FLEX,
      renderCell: (params) => params.row?.customer_name ?? '-',
    },
    {
      field: QUOTATION_LIST_COLUMNS.STATUS.FIELD,
      headerName: QUOTATION_LIST_COLUMNS.STATUS.HEADER,
      flex: QUOTATION_LIST_COLUMNS.STATUS.FLEX,
      renderCell: (params: GridRenderCellParams) => {
        // Status 1 = Active, Status 2 = Inactive
        const statusValue = params.value === NUMBERMAP.ONE ? NUMBERMAP.ONE : NUMBERMAP.ZERO;
        return <StatusTypography value={statusValue} />;
      },
    },
    {
      field: QUOTATION_LIST_COLUMNS.ACTIONS.FIELD,
      headerName: QUOTATION_LIST_COLUMNS.ACTIONS.HEADER,
      flex: QUOTATION_LIST_COLUMNS.ACTIONS.FLEX,
      renderCell: (params: GridRenderCellParams) => (
        <ActionButton
          deleteDisabled={params.row.status === NUMBERMAP.TWO}
          onDelete={() => handleDelete(params.row.quotation_id)}
          onEdit={() => handleEdit(params.row.quotation_id)}
        />
      ),
    },
  ];

  // Action handlers
  const handleEdit = (id: number) => {
    router.push(`${QUOTATION_CONSTANTS.PATH_NAME}/${id}`);
  };

  const handleDelete = async (id: number) => {
    const result = await showActionAlert(STATUS.DELETE);
    if (result?.isConfirmed) {
      deleteMutation.mutate(id, {
        onSuccess: () => {
          showActionAlert(STATUS.SUCCESS);
        },
        onError: () => {
          showActionAlert(STATUS.FAILED);
        },
      });
    }
  };

  return (
    <PageContainer>
      <CommonSharedTale
        pathName={QUOTATION_CONSTANTS.CREATE_PATH}
        title={QUOTATION_CONSTANTS.LIST_TITLE}
        Table={
          <DataTable
            rows={quotationsData?.data?? []}
            columns={columns}
            IdField={QUOTATION_KEYS.ID_FIELD}
            checkbox={false}
            loading={isLoading}
          />
        }
      />
    </PageContainer>
  );
};

export default QuotationList;
