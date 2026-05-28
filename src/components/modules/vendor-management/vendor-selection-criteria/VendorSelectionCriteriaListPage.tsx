"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import { PageContainer } from "@/styles/modules/hr/employeeList";
import { DataTable, ActionButton, showActionAlert } from "@/components/ui";
import CommonSharedTale from "@/components/shared/CommonPageTable";
import { NUMBERMAP, STATUS } from "@/constants/common";
import StatusTypography from "@/components/ui/status/ToggleStatus";
import { useVendorSelectionCriteria, useDeleteVendorSelectionCriteria } from "@/hooks/modules/vendor-management/useVendorSelectionCriteria";
import { PAGE_CONSTANTS, TABLE_COLUMNS, DATA_GRID_CONSTANTS } from "@/constants/modules/vendor-management/vendorSelectionCriteria";
import { GridRenderCellParams } from "@mui/x-data-grid";

/**
*Classification : Confidential
**/

const VendorSelectionCriteria: React.FC = () => {
  const router = useRouter();
  const ProjectId = useParams()?.id
  const { data: vendorSelectionCriteriaData, isLoading } = useVendorSelectionCriteria();
  const { mutate: deleteCriteria } = useDeleteVendorSelectionCriteria();


  // Column definitions for the table
  const columns = [
    {
      field: TABLE_COLUMNS.SNO.FIELD,
      headerName: TABLE_COLUMNS.SNO.HEADER_NAME,
      flex: NUMBERMAP.HALF,
    },
    {
      field: TABLE_COLUMNS.PART_CATEGORY_TYPE.FIELD,
      headerName: TABLE_COLUMNS.PART_CATEGORY_TYPE.HEADER_NAME,
      flex: NUMBERMAP.TWO,
    },
    {
      field: TABLE_COLUMNS.PART_SUB_TYPE.FIELD,
      headerName: TABLE_COLUMNS.PART_SUB_TYPE.HEADER_NAME,
      flex: NUMBERMAP.TWO,
    },
    {
      field: TABLE_COLUMNS.PART_SUB_CLASS.FIELD,
      headerName: TABLE_COLUMNS.PART_SUB_CLASS.HEADER_NAME,
      flex: NUMBERMAP.TWO,
    },
    {
      field: TABLE_COLUMNS.PART_TYPE_NAME.FIELD,
      headerName: TABLE_COLUMNS.PART_TYPE_NAME.HEADER_NAME,
      flex: NUMBERMAP.ONE_HALF,
    },
    {
      field: TABLE_COLUMNS.STATUS.FIELD,
      headerName: TABLE_COLUMNS.STATUS.HEADER_NAME,
      flex: NUMBERMAP.ONE,
      renderCell: (params: GridRenderCellParams) => (
        <StatusTypography value={params.value}/>
      ),
    },
    {
      field: TABLE_COLUMNS.ACTION.FIELD,
      headerName: TABLE_COLUMNS.ACTION.HEADER_NAME,
      flex: NUMBERMAP.ONE,
      renderCell: (params: GridRenderCellParams) => (
        <ActionButton 
          onDelete={() => handleDelete(params.row.vendor_selection_criteria_id)} 
          onEdit={() => handleEdit(params.row.vendor_selection_criteria_id)} 
          deleteDisabled={params.row.status !== NUMBERMAP.ONE}
        />
      ),
    },
  ];

  // Action handlers
  const handleEdit = (id: number) => {
    router.push(PAGE_CONSTANTS.EDIT_PATH(Number(ProjectId),id))
  };

  const handleDelete = async (id: number) => {
    showActionAlert(STATUS.DELETE).then((result) => {
      if (result.isConfirmed) {
        deleteCriteria(id, {
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
        pathName={PAGE_CONSTANTS.CREATE_PATH(Number(ProjectId))}
        title={PAGE_CONSTANTS.TITLE}
        Table={
          <DataTable
            rows={vendorSelectionCriteriaData?.data ?? []}
            columns={columns}  
            IdField={DATA_GRID_CONSTANTS.ID_FIELD}  
            loading={isLoading}
          />
        }
      />
    </PageContainer>
  );
};

export default VendorSelectionCriteria;
