"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { PageContainer } from "@/styles/modules/hr/employeeList";
import { DataTable, ActionButton, showActionAlert } from "@/components/ui";
import CommonSharedTale from "@/components/shared/CommonPageTable";
import { NUMBERMAP, STATUS } from "@/constants/common";
import StatusTypography from "@/components/ui/status/ToggleStatus";
import { useVendorReEvaluationCriteria, useDeleteVendorReEvaluationCriteria } from "@/hooks/modules/vendor-management/useVendorReEvaluationCriteria";
import { RE_EVALUATION_PAGE_CONSTANTS, RE_EVALUATION_TABLE_COLUMNS, RE_EVALUATION_DATA_GRID_CONSTANTS } from "@/constants/modules/vendor-management/vendorReEvaluationCriteria";
import { GridRenderCellParams } from "@mui/x-data-grid";
import { TableFilters } from "@/styles/components/ui/datatable";

/**
*Classification : Confidential
**/

const VendorReEvaluationCriteria: React.FC = () => {
  const router = useRouter();
  const { data: vendorReEvaluationCriteriaData, isLoading } = useVendorReEvaluationCriteria();
  const { mutate: deleteCriteria } = useDeleteVendorReEvaluationCriteria();


  // Column definitions for the table
  const columns_re_evaluation = [
    {
      field: RE_EVALUATION_TABLE_COLUMNS.SNO.FIELD,
      headerName: RE_EVALUATION_TABLE_COLUMNS.SNO.HEADER_NAME,
      flex: NUMBERMAP.HALF,
    },
    {
      field: RE_EVALUATION_TABLE_COLUMNS.PART_CATEGORY_TYPE.FIELD,
      headerName: RE_EVALUATION_TABLE_COLUMNS.PART_CATEGORY_TYPE.HEADER_NAME,
      flex: NUMBERMAP.ONE_HALF,
    },
    {
      field: RE_EVALUATION_TABLE_COLUMNS.PART_SUB_TYPE.FIELD,
      headerName: RE_EVALUATION_TABLE_COLUMNS.PART_SUB_TYPE.HEADER_NAME,
      flex: NUMBERMAP.ONE_HALF,
    },
    {
      field: RE_EVALUATION_TABLE_COLUMNS.PART_SUB_CLASS.FIELD,
      headerName: RE_EVALUATION_TABLE_COLUMNS.PART_SUB_CLASS.HEADER_NAME,
      flex: NUMBERMAP.ONE_HALF,
    },
    {
      field: RE_EVALUATION_TABLE_COLUMNS.PART_TYPE_NAME.FIELD,
      headerName: RE_EVALUATION_TABLE_COLUMNS.PART_TYPE_NAME.HEADER_NAME,
      flex: NUMBERMAP.ONE_HALF,
    },
    {
      field: TableFilters.statusColumn,
      headerName: RE_EVALUATION_TABLE_COLUMNS.STATUS.HEADER_NAME,
      flex: NUMBERMAP.ONE,
      valueGetter: (value, row) => {
        return row[RE_EVALUATION_TABLE_COLUMNS.STATUS.FIELD] ?? NUMBERMAP.ZERO;
      },
      renderCell: (params: GridRenderCellParams) => (
        <StatusTypography value={params.value}/>
      ),
    },
    {
      field: RE_EVALUATION_TABLE_COLUMNS.ACTION.FIELD,
      headerName: RE_EVALUATION_TABLE_COLUMNS.ACTION.HEADER_NAME,
      flex: NUMBERMAP.ONE_HALF,
      renderCell: (params: GridRenderCellParams) => (
        <ActionButton 
          onDelete={() => handleReEvaluationDelete(params.row.criteria_id)} 
          onEdit={() => handleReEvaluationEdit(params.row.criteria_id)} 
          deleteDisabled={params.row.status_id !== NUMBERMAP.ONE}
        />
      ),
    },
  ];

  // Action handlers
  const handleReEvaluationEdit = (id: number) => {
    router.push(RE_EVALUATION_PAGE_CONSTANTS.EDIT_PATH(id))
  };

  const handleReEvaluationDelete = async (id: number) => {
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
        pathName={RE_EVALUATION_PAGE_CONSTANTS.CREATE_PATH}
        title={RE_EVALUATION_PAGE_CONSTANTS.TITLE}
        Table={
          <DataTable
            rows={vendorReEvaluationCriteriaData?.data ?? []}
            columns={columns_re_evaluation}  
            IdField={RE_EVALUATION_DATA_GRID_CONSTANTS.ID_FIELD}  
            loading={isLoading}
          />
        }
      />
    </PageContainer>
  );
};

export default VendorReEvaluationCriteria;

