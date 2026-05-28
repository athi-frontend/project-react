"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { PageContainer } from "@/styles/modules/hr/employeeList";
import { DataTable, ActionButton, showActionAlert } from "@/components/ui";
import CommonSharedTale from "@/components/shared/CommonPageTable";
import { NUMBERMAP, STATUS } from "@/constants/common";
import StatusTypography from "@/components/ui/status/ToggleStatus";
import { GridRenderCellParams } from "@mui/x-data-grid";
import { 
  useAllCustomerFeedbackCriteria, 
  useDeleteCustomerFeedbackCriteria,
} from "@/hooks/modules/sales/useCustomerFeedbackCriteria";
import { 
  CUSTOMER_FEEDBACK_CRITERIA_LIST_COLUMNS,
  CUSTOMER_FEEDBACK_CRITERIA_CONSTANTS,
  CUSTOMER_FEEDBACK_CRITERIA_KEYS,
} from "@/constants/modules/sales/customerFeedbackCriteria";

/**
 * Classification : Confidential
 **/

const CustomerFeedbackCriteriaList: React.FC = () => {
  const router = useRouter();
  
  // Fetch customer feedback criteria data
  const { 
    data: customerFeedbackCriteriaData, 
    isLoading,
  } = useAllCustomerFeedbackCriteria();

  // Delete mutation
  const deleteMutation = useDeleteCustomerFeedbackCriteria();

  // Column definitions for the table
  const columns = [
    {
      field: CUSTOMER_FEEDBACK_CRITERIA_LIST_COLUMNS.SNO.FIELD,
      headerName: CUSTOMER_FEEDBACK_CRITERIA_LIST_COLUMNS.SNO.HEADER,
      flex: CUSTOMER_FEEDBACK_CRITERIA_LIST_COLUMNS.SNO.FLEX,
    },
    {
      field: CUSTOMER_FEEDBACK_CRITERIA_LIST_COLUMNS.PRODUCT_TYPE.FIELD,
      headerName: CUSTOMER_FEEDBACK_CRITERIA_LIST_COLUMNS.PRODUCT_TYPE.HEADER,
      flex: CUSTOMER_FEEDBACK_CRITERIA_LIST_COLUMNS.PRODUCT_TYPE.FLEX,
    },
    {
      field: CUSTOMER_FEEDBACK_CRITERIA_LIST_COLUMNS.PRODUCT_SUB_TYPE.FIELD,
      headerName: CUSTOMER_FEEDBACK_CRITERIA_LIST_COLUMNS.PRODUCT_SUB_TYPE.HEADER,
      flex: CUSTOMER_FEEDBACK_CRITERIA_LIST_COLUMNS.PRODUCT_SUB_TYPE.FLEX,
    },
    {
      field: CUSTOMER_FEEDBACK_CRITERIA_LIST_COLUMNS.PRODUCT_NAME.FIELD,
      headerName: CUSTOMER_FEEDBACK_CRITERIA_LIST_COLUMNS.PRODUCT_NAME.HEADER,
      flex: CUSTOMER_FEEDBACK_CRITERIA_LIST_COLUMNS.PRODUCT_NAME.FLEX,
    },
    {
      field: CUSTOMER_FEEDBACK_CRITERIA_LIST_COLUMNS.STATUS.FIELD,
      headerName: CUSTOMER_FEEDBACK_CRITERIA_LIST_COLUMNS.STATUS.HEADER,
      flex: CUSTOMER_FEEDBACK_CRITERIA_LIST_COLUMNS.STATUS.FLEX,
      valueGetter: (value, row) => {
        return row.status_id ?? null;
      }, 
      renderCell: (params: GridRenderCellParams) => (
        <StatusTypography value={params.value} />
      ),
    },
    {
      field: CUSTOMER_FEEDBACK_CRITERIA_LIST_COLUMNS.ACTIONS.FIELD,
      headerName: CUSTOMER_FEEDBACK_CRITERIA_LIST_COLUMNS.ACTIONS.HEADER,
      renderCell: (params: GridRenderCellParams) => (
        <ActionButton
          onDelete={() => handleDelete(params.row.customer_feedback_criteria_id)}
          onEdit={() => handleEdit(params.row.product_id)}
          deleteDisabled={params.row.status_id !== NUMBERMAP.ONE}
        />
      ),
    },
  ];

  // Action handlers
  const handleEdit = (id: number) => {
    router.push(`${CUSTOMER_FEEDBACK_CRITERIA_CONSTANTS.PATH_NAME}/${id}`);
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
        pathName={CUSTOMER_FEEDBACK_CRITERIA_CONSTANTS.CREATE_PATH}
        title={`List View - ${CUSTOMER_FEEDBACK_CRITERIA_CONSTANTS.TITLE}`}
        Table={
          <DataTable
            rows={customerFeedbackCriteriaData?.data ?? []}
            columns={columns}
            IdField={CUSTOMER_FEEDBACK_CRITERIA_KEYS.ID_FIELD}
            loading={isLoading}
          />
        }
      />
    </PageContainer>
  );
};

export default CustomerFeedbackCriteriaList;
