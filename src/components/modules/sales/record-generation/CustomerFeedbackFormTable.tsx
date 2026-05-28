import React from "react";
import { useGetCustomerFeedbackList } from "@/hooks/modules/sales/useCustomerFeedback";
import { PageContainer, UnderLine } from '@/styles/common';
import CommonSharedTale from '@/components/shared/CommonPageTable';
import { DataTable } from '@/components/ui';
import { NUMBERMAP } from "@/constants/common";
import { TABLE_CONSTANTS } from "@/constants/modules/sales/recordGeneration";
import Link from "next/link";

const CustomerFeedbackFormTable: React.FC<{ title: string, pathName: string }> = ({ title, pathName }) => {
  const { data: customerFeedbackResponse, isLoading } = useGetCustomerFeedbackList();

  const columns = [
    {
      field: TABLE_CONSTANTS.COMMON.SNO_FIELD,
      headerName: TABLE_CONSTANTS.COMMON.SNO_HEADER,
      flex: NUMBERMAP.HALF,
    },
    {
      field: TABLE_CONSTANTS.CUSTOMER_FEEDBACK.PRODUCT_NAME_FIELD,
      headerName: TABLE_CONSTANTS.CUSTOMER_FEEDBACK.PRODUCT_NO_HEADER,
      flex: NUMBERMAP.ONE_HALF,
      renderCell: (params: any) => {
        return params.row.product_name ?? '';
      }
    },
    {
      field: TABLE_CONSTANTS.CUSTOMER_FEEDBACK.MODEL_FIELD,
      headerName: TABLE_CONSTANTS.CUSTOMER_FEEDBACK.MODEL_HEADER,
      flex: NUMBERMAP.ONE_HALF,
      renderCell: (params: any) => {
        return params.value ?? '';
      }
    },
    {
      field: TABLE_CONSTANTS.COMMON.ACTION_FIELD,
      headerName: TABLE_CONSTANTS.COMMON.VIEW_HEADER,
      flex: NUMBERMAP.HALF,
      renderCell: (params: any) => (
        <Link href={`${pathName}/${params.row.customer_feedback_id}`} style={UnderLine}>
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
            IdField={TABLE_CONSTANTS.CUSTOMER_FEEDBACK.ID_FIELD}
            rows={customerFeedbackResponse?.data ?? []}
            columns={columns}
            loading={isLoading}
          />
        }
      />
    </PageContainer>
  );
};

export default CustomerFeedbackFormTable;

