"use client";
import React from "react";
import Link from "next/link";
import { PageContainer } from "@/styles/modules/hr/employeeList";
import { DataTable } from "@/components/ui";
import CommonSharedTale from "@/components/shared/CommonPageTable";
import { NUMBERMAP } from "@/constants/common";
import { UnderLine } from "@/styles/common";
import { useGetSampleOrdersList } from "@/hooks/modules/vendor-management/useSampleOrders";

/**
    Classification : Confidential
**/

const SampleInspection: React.FC = () => {
  // Fetch sample orders from API
  const { data: sampleOrderResponse, isLoading: isSampleOrderLoading } = useGetSampleOrdersList();

  // Column definitions for the table
  const columns = [
    {
      field: "sno",
      headerName: "S.No.",
      flex: NUMBERMAP.HALF,
      headerAlign: "left" as const,
      align: "left" as const,
    },
    {
      field: "vendor_type",
      headerName: "Vendor Type",
      flex: NUMBERMAP.ONE,
      headerAlign: "left" as const,
      align: "left" as const,
    },
    {
      field: "vendor_name",
      headerName: "Vendor Name",
      flex: NUMBERMAP.ONE,
      headerAlign: "left" as const,
      align: "left" as const,
    },
    {
      field: "purchase_order_number",
      headerName: "Sample Purchase Order",
      flex: NUMBERMAP.ONE_HALF,
      headerAlign: "left" as const,
      align: "left" as const,
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: NUMBERMAP.ONE,
      headerAlign: "left" as const,
      align: "left" as const,
      renderCell: (params: any) => (
        <Link 
          href={`/vendor-management/sample-inspection/${params.row.sample_order_id}`} 
          style={UnderLine}
        >
          Perform Inspection
        </Link>
      ),
    },
  ];


  return (
    <PageContainer>
      <CommonSharedTale
        title="Sample Inspection"
        Table={
          <DataTable
            IdField="sample_order_id"
            rows={sampleOrderResponse?.data ?? []}
            columns={columns}
            loading={isSampleOrderLoading}
          />
        }
      />
    </PageContainer>
  );
};

export default SampleInspection;
