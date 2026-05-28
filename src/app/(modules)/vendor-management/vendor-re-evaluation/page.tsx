"use client";
import React from "react";
import { PageContainer } from "@/styles/modules/hr/employeeList";
import { DataTable, ActionButton, showActionAlert } from "@/components/ui";
import CommonSharedTale from "@/components/shared/CommonPageTable";
import { NUMBERMAP, STATUS } from "@/constants/common";
import { useRouter } from "next/navigation";
import { useFetchVendorReEvaluationList, useDeleteVendorReEvaluation } from "@/hooks/modules/vendor-management/useVendorReEvaluation";
import { convertUtcToLocal } from "@/lib/utils/common";
import { DELETE_ALERT } from "@/constants/modules/dnd/formTeam";
import { GridRenderCellParams } from "@mui/x-data-grid";
import { VENDOR_RE_EVALUATION_CONSTANTS } from "@/constants/modules/vendor-management/vendorReEvaluation";
import StatusTypography from "@/components/ui/status/ToggleStatus";

/**
 * Classification : Confidential
 **/

interface VendorReEvaluationData {
  id: number;
  sno: number;
  vendorType: string;
  vendorName: string;
  contactNumber: string;
  fromDate: string;
  toDate: string;
}

const VendorReEvaluation: React.FC = () => {
  
  const {data : VendorReEvaluationResponse, isLoading } = useFetchVendorReEvaluationList()
  const { mutate: deleteMutation } = useDeleteVendorReEvaluation();
  // Sample data for the vendor re-evaluation table
  const router = useRouter()

  // Column definitions for the vendor re-evaluation table
  const columns = [
    {
      field: VENDOR_RE_EVALUATION_CONSTANTS.LIST_PAGE_COLUMNS.FIELD_NAME.SNO,
      headerName: VENDOR_RE_EVALUATION_CONSTANTS.LIST_PAGE_COLUMNS.HEADER_NAME.SNO,
      flex: NUMBERMAP.HALF,
    },
    {
      field: VENDOR_RE_EVALUATION_CONSTANTS.LIST_PAGE_COLUMNS.FIELD_NAME.VENDOR_TYPE_NAME,
      headerName: VENDOR_RE_EVALUATION_CONSTANTS.LIST_PAGE_COLUMNS.HEADER_NAME.VENDOR_TYPE,
      flex: NUMBERMAP.ONE_HALF,
    },
    {
      field: VENDOR_RE_EVALUATION_CONSTANTS.LIST_PAGE_COLUMNS.FIELD_NAME.VENDOR_NAME,
      headerName: VENDOR_RE_EVALUATION_CONSTANTS.LIST_PAGE_COLUMNS.HEADER_NAME.VENDOR_NAME,
      flex: NUMBERMAP.ONE_HALF,
    },
    {
      field: VENDOR_RE_EVALUATION_CONSTANTS.LIST_PAGE_COLUMNS.FIELD_NAME.PART_CATEGORY_NAME,
      headerName: VENDOR_RE_EVALUATION_CONSTANTS.LIST_PAGE_COLUMNS.HEADER_NAME.PART_CATEGORY,
      flex: NUMBERMAP.ONE_HALF,
    },

    {
      field: VENDOR_RE_EVALUATION_CONSTANTS.LIST_PAGE_COLUMNS.FIELD_NAME.FROM_DATE,
      headerName: VENDOR_RE_EVALUATION_CONSTANTS.LIST_PAGE_COLUMNS.HEADER_NAME.FROM_DATE,
      flex: NUMBERMAP.ONE_HALF,
      renderCell : (params: GridRenderCellParams) => { return convertUtcToLocal(params.row[VENDOR_RE_EVALUATION_CONSTANTS.LIST_PAGE_COLUMNS.FIELD_NAME.FROM_DATE])}
    },
    {
      field: VENDOR_RE_EVALUATION_CONSTANTS.LIST_PAGE_COLUMNS.FIELD_NAME.TO_DATE,
      headerName: VENDOR_RE_EVALUATION_CONSTANTS.LIST_PAGE_COLUMNS.HEADER_NAME.TO_DATE,
      flex: NUMBERMAP.ONE_HALF,
      renderCell : (params : GridRenderCellParams) => { return convertUtcToLocal(params.row[VENDOR_RE_EVALUATION_CONSTANTS.LIST_PAGE_COLUMNS.FIELD_NAME.TO_DATE])}

    },
    {
      field: VENDOR_RE_EVALUATION_CONSTANTS.LIST_PAGE_COLUMNS.FIELD_NAME.STATUS,
      headerName: VENDOR_RE_EVALUATION_CONSTANTS.LIST_PAGE_COLUMNS.HEADER_NAME.STATUS,
      flex: NUMBERMAP.ONE_HALF,
      renderCell: (params: GridRenderCellParams) => (
        <StatusTypography value={params.value} />
      ),
    },
    {
      field: VENDOR_RE_EVALUATION_CONSTANTS.LIST_PAGE_COLUMNS.FIELD_NAME.ACTION,
      headerName: VENDOR_RE_EVALUATION_CONSTANTS.LIST_PAGE_COLUMNS.HEADER_NAME.ACTIONS,
      flex: NUMBERMAP.ONE,
      renderCell: (params: any) => (
        <ActionButton
          deleteDisabled={params.row.status==NUMBERMAP.TWO}
          onDelete={() => handleDelete(params.row[VENDOR_RE_EVALUATION_CONSTANTS.ID_FIELD])}
          onEdit={() => handleEdit(params.row[VENDOR_RE_EVALUATION_CONSTANTS.ID_FIELD])}
        />
      ),
    },
  ];

  // Action handlers
  const handleEdit = (id: number) => {

    router.push(VENDOR_RE_EVALUATION_CONSTANTS.ROUTE_DETAIL(id))
  };

  const handleDelete = (id: number) => {
    showActionAlert(DELETE_ALERT).then((result) => {
          if (result.isConfirmed) {
            deleteMutation(id, {
              onSuccess: () => {
                showActionAlert(STATUS.SUCCESS)
              },
              onError: () => {
                showActionAlert(STATUS.FAILED)
              },
            })
          }
        })
    
  };

  return (
    <PageContainer>
      <CommonSharedTale
        pathName={`${VENDOR_RE_EVALUATION_CONSTANTS.ROUTES.BASE_PATH}${VENDOR_RE_EVALUATION_CONSTANTS.ROUTES.CREATE}`}
        title={VENDOR_RE_EVALUATION_CONSTANTS.PAGE_TITLE}
        Table={
          <DataTable
            rows={Array.isArray(VendorReEvaluationResponse?.data) ? VendorReEvaluationResponse.data : []}
            columns={columns}
            IdField={VENDOR_RE_EVALUATION_CONSTANTS.ID_FIELD}
            checkbox={false}
            loading={isLoading}
          />
        }
      />
    </PageContainer>
  );
};

export default VendorReEvaluation;
