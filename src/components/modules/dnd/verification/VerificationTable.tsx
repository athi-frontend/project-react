"use client";
import React from "react";
import { PageContainer } from "@/styles/modules/hr/employeeList";
import { ActionButton, DataTable } from "@/components/ui";
import CommonSharedTale from "@/components/shared/CommonPageTable";
import { GridRenderCellParams } from "@mui/x-data-grid";
import { getColumn, PAGE_FORM, ROUTER_END_POINTS, STATUS_TYPE, } from "@/constants/modules/dnd/verification";
import { useParams, useRouter } from "next/navigation";
import { useFetchAllReport } from "@/hooks/modules/dnd/useVerificationReport";
import { VerificationReportItem } from "@/types/modules/dnd/verificationReport";
import { InProgressStatusText, PendingStatusText, RejectedStatusText,VerifiedStatusText } from "@/styles/modules/dnd/verification";
import GlobalLoader from "@/components/shared/LoadingSpinner";


/**
    Classification : Confidential
**/
const VerificationPage: React.FC<{type?:string}> = ({type}) => {

  const router = useRouter();
  const params = useParams();
  const order_id = params.order_id
  const project_id = params.id

 
  const {data: fetchAllReports, isLoading: reportLoading} = useFetchAllReport(Number(order_id),"verification-plan");


  const handleEdit = (row: any) => {
    const verification_plan_dir_id = row.verification_plan_dir_id
    const dir_category_slug = row.dir_category_slug
    
    if (dir_category_slug === 'lifetime_of_the_device') {
      router.push(`/dnd/product-life-declaration/${verification_plan_dir_id}/${project_id}`)
    } else {
      router.push(ROUTER_END_POINTS(Number(order_id), verification_plan_dir_id, Number(project_id)))
    }
  }

  const renderActionCell = (params: GridRenderCellParams) => {
    return (
       <ActionButton onEdit={() => handleEdit(params.row )} />
    )
  }

   const renderStatusCell = (params: any) => {
   const verified = params.value === STATUS_TYPE.VERIFIED;
    const inprogress = params.value === STATUS_TYPE.INPROGRESS;
    const rejected = params.value === STATUS_TYPE.REJECTED;
    const pending = params.value === STATUS_TYPE.PENDING;
    let statusContent;

if (verified) {
  statusContent = <VerifiedStatusText>Verified</VerifiedStatusText>;
} else if (rejected) {
  statusContent = <RejectedStatusText>Rejected</RejectedStatusText>;
}  else if (inprogress) {
  statusContent = <InProgressStatusText>In Progress</InProgressStatusText>;
} else if (pending) {
  statusContent = <PendingStatusText>Pending</PendingStatusText>;
}else {
  statusContent = <span>-</span>;
}


return statusContent


  };
  const columns = getColumn(renderActionCell, renderStatusCell);

  return (
    <PageContainer id={PAGE_FORM.PAGE_ID}>
      <GlobalLoader loading={reportLoading} />
      {fetchAllReports && (
      <CommonSharedTale
        title={PAGE_FORM.PAGE_TITLE}
        Table={
          <DataTable
            rows={fetchAllReports?.data as VerificationReportItem[] ?? []}
            columns={columns}
            IdField={PAGE_FORM.FORM_ID}
            checkbox={false}
            loading={false}
            customClassName={PAGE_FORM.CUSTOM_CLASS_NAME}
          />
        }
      />
      )}
    </PageContainer>
  );
};

export default VerificationPage;
