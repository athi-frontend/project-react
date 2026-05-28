"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { PageContainer } from "@/styles/modules/hr/employeeList";
import { DataTable, ActionButton, showActionAlert } from "@/components/ui";
import CommonSharedTale from "@/components/shared/CommonPageTable";
import { NUMBERMAP } from "@/constants/common";
import { 
  useAllOrderAcknowledgements, 
  useDeleteOrderAcknowledgement,
} from "@/hooks/modules/sales/useOrderAcknowledgement";
import { 
  ORDER_ACKNOWLEDGEMENT_LIST_COLUMNS,
  ORDER_ACKNOWLEDGEMENT_CONSTANTS,
  ORDER_ACKNOWLEDGEMENT_CREATE_PATH,
  ORDER_ACKNOWLEDGEMENT_KEYS
} from "@/constants/modules/sales/orderAcknowledgement";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { formatDate } from "@/lib/utils/common";
import StatusTypography from "@/components/ui/status/ToggleStatus";
import { TableFilters } from "@/styles/components/ui/datatable";

/**
 * Classification : Confidential
 **/

const OrderAcknowledgement: React.FC = () => {
  const router = useRouter();
  // Fetch order acknowledgements data
  const { 
    data: orderAcknowledgementsData, 
  } = useAllOrderAcknowledgements();

  // Delete mutation
  const deleteMutation = useDeleteOrderAcknowledgement();

  // Use API data directly for table rows (no transformation)
  const tableRows = orderAcknowledgementsData?.data ?? [];

  // Column definitions for the table
  const columns: GridColDef[] = [
    {
      field: 'sno',
      headerName: ORDER_ACKNOWLEDGEMENT_LIST_COLUMNS.SNO.HEADER,
      flex: ORDER_ACKNOWLEDGEMENT_LIST_COLUMNS.SNO.FLEX,
      renderCell: (params) => params.api.getAllRowIds().indexOf(params.id) + NUMBERMAP.ONE,
    },
    {
      field: 'quotation_number',
      headerName: ORDER_ACKNOWLEDGEMENT_LIST_COLUMNS.QUOTATION_NO.HEADER,
      flex: ORDER_ACKNOWLEDGEMENT_LIST_COLUMNS.QUOTATION_NO.FLEX,
    },
    {
      field: 'quotation_date',
      headerName: ORDER_ACKNOWLEDGEMENT_LIST_COLUMNS.QUOTATION_DATE.HEADER,
      flex: ORDER_ACKNOWLEDGEMENT_LIST_COLUMNS.QUOTATION_DATE.FLEX,
      renderCell: (params) => {
        const dateValue = params.row?.quotation_date;
        if (!dateValue) return '-';
        return formatDate(dateValue) ?? '-';
      }
    },
    {
      field: ORDER_ACKNOWLEDGEMENT_LIST_COLUMNS.CUSTOMER_NAME.FIELD,
      headerName: ORDER_ACKNOWLEDGEMENT_LIST_COLUMNS.CUSTOMER_NAME.HEADER,
      flex: ORDER_ACKNOWLEDGEMENT_LIST_COLUMNS.CUSTOMER_NAME.FLEX,
    },
    {
        field: TableFilters.statusColumn,
        headerName: ORDER_ACKNOWLEDGEMENT_LIST_COLUMNS.STATUS.HEADER,
        flex: NUMBERMAP.ONE,
        valueGetter: (value, row) => {
        return row[ORDER_ACKNOWLEDGEMENT_LIST_COLUMNS.STATUS.FIELD] ?? NUMBERMAP.ZERO;
        },
        renderCell: (params: GridRenderCellParams) => (
        <StatusTypography value={params.value} />
      ),
    },
    {
      field: ORDER_ACKNOWLEDGEMENT_LIST_COLUMNS.ACTIONS.FIELD,
      headerName: ORDER_ACKNOWLEDGEMENT_LIST_COLUMNS.ACTIONS.HEADER,
      flex: ORDER_ACKNOWLEDGEMENT_LIST_COLUMNS.ACTIONS.FLEX,
      renderCell: (params: GridRenderCellParams) => (
        <ActionButton
          onDelete={() => handleDelete(params.row.order_acknowledgement_id)}
          onEdit={() => handleEdit(params.row.order_acknowledgement_id)}
          deleteDisabled={params.row.status_id !== NUMBERMAP.ONE}
        />
      ),
    },
  ];

  // Action handlers
  const handleEdit = (id: number) => {
    router.push(`${ORDER_ACKNOWLEDGEMENT_CONSTANTS.PATH_NAME}/${id}`);
  };

  const handleDelete = async (id: number) => {
    const result = await showActionAlert('delete');
    if (result?.isConfirmed) {
        await deleteMutation.mutateAsync(id.toString());
        await showActionAlert('success');
    }
  };

  return (
    <PageContainer>
      <CommonSharedTale
        pathName={ORDER_ACKNOWLEDGEMENT_CREATE_PATH}
        title={`List View - ${ORDER_ACKNOWLEDGEMENT_CONSTANTS.TITLE}`}
        Table={
          <DataTable
            rows={tableRows}
            columns={columns}
            IdField={ORDER_ACKNOWLEDGEMENT_KEYS.ID_FIELD}
          />
        }
      />
    </PageContainer>
  );
};

export default OrderAcknowledgement;
