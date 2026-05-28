import React from "react";
import { useAllOrderAcknowledgements } from "@/hooks/modules/sales/useOrderAcknowledgement";
import { PageContainer, UnderLine } from '@/styles/common';
import CommonSharedTale from '@/components/shared/CommonPageTable';
import { DataTable } from '@/components/ui';
import { NUMBERMAP } from "@/constants/common";
import { TABLE_CONSTANTS } from "@/constants/modules/sales/recordGeneration";
import Link from "next/link";
import { convertUtcToLocal } from "@/lib/utils/common";

const OrderAcknowledgementTable: React.FC<{ title: string, pathName: string }> = ({ title, pathName }) => {
  const { data: orderAcknowledgementResponse, isLoading } = useAllOrderAcknowledgements();
  

  const columns = [
    {
      field: TABLE_CONSTANTS.COMMON.SNO_FIELD,
      headerName: TABLE_CONSTANTS.COMMON.SNO_HEADER,
      flex: NUMBERMAP.HALF,
    },
    {
      field: TABLE_CONSTANTS.ORDER_ACKNOWLEDGEMENT.QUOTATION_NUMBER_FIELD,
      headerName: TABLE_CONSTANTS.ORDER_ACKNOWLEDGEMENT.QUOTATION_NUMBER_HEADER,
      flex: NUMBERMAP.ONE_HALF,
    },
    {
      field: TABLE_CONSTANTS.ORDER_ACKNOWLEDGEMENT.ORDER_DATE_FIELD,
      headerName: TABLE_CONSTANTS.ORDER_ACKNOWLEDGEMENT.ACKNOWLEDGEMENT_DATE_HEADER,
      flex: NUMBERMAP.ONE_HALF,
      renderCell: (params: any) => {
        const date = params.row.order_date ?? '';
        return date ? convertUtcToLocal(date) : '-';
      }
    },
    {
      field: TABLE_CONSTANTS.COMMON.ACTION_FIELD,
      headerName: TABLE_CONSTANTS.COMMON.VIEW_HEADER,
      flex: NUMBERMAP.HALF,
      renderCell: (params: any) => (
        <Link href={`${pathName}/${params.row.order_acknowledgement_id}`} style={UnderLine}>
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
            IdField={TABLE_CONSTANTS.ORDER_ACKNOWLEDGEMENT.ID_FIELD}
            rows={orderAcknowledgementResponse?.data ?? []}
            columns={columns}
            loading={isLoading}
          />
        }
      />
    </PageContainer>
  );
};

export default OrderAcknowledgementTable;

