"use client";
import React  from "react";
import { useRouter } from "next/navigation";
import { PageContainer } from "@/styles/modules/hr/employeeList";
import { DataTable, ActionButton, showActionAlert } from "@/components/ui";
import CommonSharedTale from "@/components/shared/CommonPageTable";
import { NUMBERMAP } from "@/constants/common";
import StatusTypography from "@/components/ui/status/ToggleStatus";
import { TABLE_COLUMNS } from "@/constants/modules/vendor-management/vendorSelectionCriteria";
import { GridRenderCellParams } from "@mui/x-data-grid";
import { useSampleInspectionCriteriaList, useDeleteSampleInspectionCriteria } from "@/hooks/modules/vendor-management/useSampleInspectionCriteria";
import { COMMON_CONSTANTS } from "@/lib/utils/common";

/**
*Classification : Confidential
**/

const SampleInspectionCriteria: React.FC = () => {
  const router = useRouter();
  const { data: sampleInspectionCriteriaData, isLoading } = useSampleInspectionCriteriaList();
  const deleteMutation = useDeleteSampleInspectionCriteria();

  // Transform API data to rows with serial numbers

  // Column definitions for the table
  const columns = [
    {
      field: TABLE_COLUMNS.SNO.FIELD,
      headerName: TABLE_COLUMNS.SNO.HEADER_NAME,
      flex: NUMBERMAP.HALF,
    },
    {
      field: 'part_type',
      headerName: 'Part Type',
      flex: NUMBERMAP.ONE_HALF,
    },
    {
      field: 'part_sub_type',
      headerName: TABLE_COLUMNS.PART_SUB_TYPE.HEADER_NAME,
      flex: NUMBERMAP.ONE_HALF,
    },
    {
      field: 'part_sub_class',
      headerName: TABLE_COLUMNS.PART_SUB_CLASS.HEADER_NAME,
      flex: NUMBERMAP.ONE_HALF,
    },
    {
      field: 'part_category_name',
      headerName: 'Part Category',
      flex: NUMBERMAP.ONE_HALF,
    },
    {
      field: 'part_number',
      headerName: 'Part No.',
      flex: NUMBERMAP.ONE,
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
      renderCell: (params: GridRenderCellParams) => {
        const id = params.row.sample_inspection_criteria_id ?? params.row.id;
        return (
          <ActionButton 
            deleteDisabled={params.row.status===NUMBERMAP.TWO}
            onDelete={() => handleDelete(id)} 
            onEdit={() => handleEdit(params.row.part_number_id)} 
          />
        );
      },
    },
  ];

  // Action handlers
  const handleEdit = (id: number) => {
    router.push(`/vendor-management/sample-inspection-criteria/${id}`);
  };

  const handleDelete = async (id: number) => {
    const result = await showActionAlert(COMMON_CONSTANTS.DELETE_ALERT);
    if (!result.isConfirmed) return;

    deleteMutation.mutate(id, {
      onSuccess: () => {
        showActionAlert(COMMON_CONSTANTS.SUCCESS_ALERT);
      },
      onError: () => {
        showActionAlert(COMMON_CONSTANTS.FAILED_ALERT);
      },
    });
  };

  return (
    <PageContainer>
      <CommonSharedTale
        pathName="/vendor-management/sample-inspection-criteria/create"
        title="Sample Inspection Criteria"
        Table={
          <DataTable
            rows={sampleInspectionCriteriaData?.data ?? []}
            columns={columns}  
            IdField="sample_inspection_criteria_id"
            loading={isLoading}
          />
        }
      />
    </PageContainer>
  );
};

export default SampleInspectionCriteria;
