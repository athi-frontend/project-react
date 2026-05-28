"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { PageContainer } from "@/styles/modules/hr/employeeList";
import { DataTable, ActionButton, showActionAlert } from "@/components/ui";
import CommonSharedTale from "@/components/shared/CommonPageTable";
import { NUMBERMAP, STATUS } from "@/constants/common";
import StatusTypography from "@/components/ui/status/ToggleStatus";
import { TableFilters } from "@/styles/components/ui/datatable";
import { 
  useAllDeliveryDispatches, 
  useDeleteDeliveryDispatch,
} from "@/hooks/modules/sales/useDeliveryDispatch";
import { 
  DELIVERY_DISPATCH_LIST_COLUMNS,
  DELIVERY_DISPATCH_CONSTANTS,
  DELIVERY_DISPATCH_CREATE_PATH,
  DELIVERY_DISPATCH_KEYS
} from "@/constants/modules/sales/deliveryDispatch";
import { COMMON_CONSTANTS } from "@/lib/utils/common";
import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";

/**
 * Classification : Confidential
 **/

const DeliveryDispatchList: React.FC = () => {
  const router = useRouter();
  
  // Fetch delivery/dispatch data
  const { 
    data: deliveryDispatchData, 
  } = useAllDeliveryDispatches();

  // Delete mutation
  const deleteMutation = useDeleteDeliveryDispatch();

  // Column definitions for the table
  const columns: GridColDef[] = [
    {
      field: DELIVERY_DISPATCH_LIST_COLUMNS.SNO.FIELD,
      headerName: DELIVERY_DISPATCH_LIST_COLUMNS.SNO.HEADER,
      flex: DELIVERY_DISPATCH_LIST_COLUMNS.SNO.FLEX,
    },
    {
      field: DELIVERY_DISPATCH_LIST_COLUMNS.QUOTATION_NO.FIELD,
      headerName: DELIVERY_DISPATCH_LIST_COLUMNS.QUOTATION_NO.HEADER,
      flex: DELIVERY_DISPATCH_LIST_COLUMNS.QUOTATION_NO.FLEX,
    },
    {
      field: DELIVERY_DISPATCH_LIST_COLUMNS.CUSTOMER_NAME.FIELD,
      headerName: DELIVERY_DISPATCH_LIST_COLUMNS.CUSTOMER_NAME.HEADER,
      flex: DELIVERY_DISPATCH_LIST_COLUMNS.CUSTOMER_NAME.FLEX,
    },
    {
      field: TableFilters.statusColumn,
      headerName: DELIVERY_DISPATCH_LIST_COLUMNS.STATUS.HEADER,
      flex: DELIVERY_DISPATCH_LIST_COLUMNS.STATUS.FLEX,
      valueGetter: (value, row) => {
        return row[DELIVERY_DISPATCH_LIST_COLUMNS.STATUS.FIELD] ?? NUMBERMAP.ZERO;
      },
      renderCell: (params: GridRenderCellParams) => (
        <StatusTypography value={params.value} />
      ),
    },
    {
      field: DELIVERY_DISPATCH_LIST_COLUMNS.ACTIONS.FIELD,
      headerName: DELIVERY_DISPATCH_LIST_COLUMNS.ACTIONS.HEADER,
      flex: DELIVERY_DISPATCH_LIST_COLUMNS.ACTIONS.FLEX,
      renderCell: (params: GridRenderCellParams) => (
        <ActionButton
          onDelete={() => handleDelete(params.row.quotation_id)}
          onEdit={() => handleEdit(params.row.quotation_id)}
          deleteDisabled={params.row.status_id !== NUMBERMAP.ONE}
        />
      ),
    },
  ];

  // Action handlers
  const handleEdit = (id: number) => {
    router.push(`${DELIVERY_DISPATCH_CONSTANTS.PATH_NAME}/${id}`);
  };

  const handleDelete = (id: number) => {
    showActionAlert(COMMON_CONSTANTS.DELETE_ALERT).then((result) => {
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
    });
  };

  return (
    <PageContainer>
      <CommonSharedTale
        pathName={DELIVERY_DISPATCH_CREATE_PATH}
        title={`List View - ${DELIVERY_DISPATCH_CONSTANTS.TITLE}`}
        Table={
          <DataTable
            rows={deliveryDispatchData?.data ?? []}
            columns={columns}
            IdField={DELIVERY_DISPATCH_KEYS.ID_FIELD}
          />
        }
      />
    </PageContainer>
  );
};

export default DeliveryDispatchList;