"use client";
import React, { useMemo } from "react";
import { PageContainer } from "@/styles/modules/hr/employeeList";
import { DataTable } from "@/components/ui";
import CommonSharedTale from "@/components/shared/CommonPageTable";
import { NUMBERMAP } from "@/constants/common";
import { Button } from "@mui/material";
import { useAllVendorEvaluations } from "@/hooks/modules/vendor-management/useVendorEvaluation";
import { vendorEvaluationColumns } from "@/constants/modules/vendor-management/vendorEvaluation";
import { useRouter } from "next/navigation";
import { buttonStyle } from "@/styles/modules/vendor-management/vendorReEvaluationCriteria";

/**
 * Classification : Confidential
 **/

const VendorReEvaluation: React.FC = () => {
  const router = useRouter();
  const { data: vendorEvaluationData, isLoading } = useAllVendorEvaluations();

  // Transform rows to ensure each has a unique id
  const transformedRows = useMemo(() => {
    if (!vendorEvaluationData?.data) return [];
    
    return vendorEvaluationData.data.map((row: any, index: number) => ({
      ...row,
      id: row.vendor_part_category_mapper_id ?? `vendor-${row.vendor_id}-${index}`,
    }));
  }, [vendorEvaluationData?.data]);

  // Add action column to the columns
  const columnsWithAction = [
    ...vendorEvaluationColumns,
    {
      field: "action",
      headerName: "Actions",
      flex: NUMBERMAP.ONE,
      renderCell: (params: any) => (
        <Button 
          sx={buttonStyle}
          onClick={() => router.push(`/vendor-management/vendor-evaluation/${params.row.vendor_part_category_mapper_id}`)}
          variant="outlined"
          size="small"
          disabled={!params.row.vendor_part_category_mapper_id}
        >
          Vendor Evaluation
        </Button>
      ),
      sortable: false,
      filterable: false,
    },
  ];

  return (
    <PageContainer>
      <CommonSharedTale
        title="Vendor Evaluation"
        Table={
          <DataTable
            loading={isLoading}
            rows={transformedRows}
            columns={columnsWithAction}
            IdField="id"
            checkbox={false}
          />
        }
      />
    </PageContainer>
  );
};

export default VendorReEvaluation;
