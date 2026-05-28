import React from "react";
import { useAllQuotations } from "@/hooks/modules/sales/useQuotation";
import { PageContainer, UnderLine } from '@/styles/common';
import CommonSharedTale from '@/components/shared/CommonPageTable';
import { DataTable } from '@/components/ui';
import { NUMBERMAP } from "@/constants/common";
import { TABLE_CONSTANTS } from "@/constants/modules/sales/recordGeneration";
import Link from "next/link";
import { convertUtcToLocal } from "@/lib/utils/common";

const SalesQuotationTable: React.FC<{ title: string, pathName: string }> = ({ title, pathName }) => {
  const { data: quotationResponse, isLoading } = useAllQuotations();
  const columns = [
    {
      field: TABLE_CONSTANTS.COMMON.SNO_FIELD,
      headerName: TABLE_CONSTANTS.COMMON.SNO_HEADER,
      flex: NUMBERMAP.HALF,
    },
    {
      field: TABLE_CONSTANTS.SALES_QUOTATION.QUOTATION_NUMBER_FIELD,
      headerName: TABLE_CONSTANTS.SALES_QUOTATION.QUOTATION_NUMBER_HEADER,
      flex: NUMBERMAP.ONE_HALF,
    },
    {
      field: TABLE_CONSTANTS.SALES_QUOTATION.QUOTATION_DATE_FIELD,
      headerName: TABLE_CONSTANTS.SALES_QUOTATION.QUOTATION_DATE_HEADER,
      flex: NUMBERMAP.ONE_HALF,
      renderCell: (params: any) => {
        return params.row.quotation_date ? convertUtcToLocal(params.row.quotation_date) : '-';
      }
    },
    {
      field: TABLE_CONSTANTS.COMMON.ACTION_FIELD,
      headerName: TABLE_CONSTANTS.COMMON.VIEW_HEADER,
      flex: NUMBERMAP.HALF,
      renderCell: (params: any) => (
        <Link href={`${pathName}/${params.row.quotation_id}`} style={UnderLine}>
          {TABLE_CONSTANTS.COMMON.VIEW_FILES_LINK}
        </Link>
      )
    }
  ];

  return (
    <PageContainer sx={{ paddingTop: NUMBERMAP.ZERO }}>
      <CommonSharedTale
        title={title}
        Table={
          <DataTable
            IdField={TABLE_CONSTANTS.SALES_QUOTATION.ID_FIELD}
            rows={quotationResponse?.data ?? []}
            columns={columns}
            loading={isLoading}
          />
        }
      />
    </PageContainer>
  );
};

export default SalesQuotationTable;

