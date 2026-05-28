import React from "react";
import { useCandidateEvaluationData } from "@/hooks/modules/hr/useCandidateEvaluation";
import { CANDIDATE_EVALUATION_CONSTANTS } from "@/constants/modules/hr/candidateEvaluation";
import { PageContainer, UnderLine } from '@/styles/common';
import CommonSharedTale from '@/components/shared/CommonPageTable';
import { DataTable } from '@/components/ui';
import { NUMBERMAP } from "@/constants/common";
import Link from "next/link";
import { formatDate } from "@/lib/utils/common";

const CandidateEvaluationTable: React.FC<{ title: string ,pathName:string}> = ({ title,pathName }) => {
  const { data: candidateEvaluationResponse, refetch } = useCandidateEvaluationData('Approved');
  React.useEffect(() => { refetch(); }, [refetch]);
  const rows = React.useMemo(() => {
    if (!candidateEvaluationResponse?.data) return [];
    return candidateEvaluationResponse.data.map((item: any, idx: number) => ({
      ...item,
      [CANDIDATE_EVALUATION_CONSTANTS.TABLE_COLUMNS.CANDIDATE_NAME]: `${item.candidate_first_name} ${item.candidate_last_name}`,
    }));
  }, [candidateEvaluationResponse]);
  const columns = [
    { field: CANDIDATE_EVALUATION_CONSTANTS.TABLE_COLUMNS.SERIAL_NO, headerName: CANDIDATE_EVALUATION_CONSTANTS.TABLE_HEADERS.SERIAL_NO, flex: NUMBERMAP.ONE},
    { field: CANDIDATE_EVALUATION_CONSTANTS.TABLE_COLUMNS.CANDIDATE_NAME, headerName: CANDIDATE_EVALUATION_CONSTANTS.TABLE_HEADERS.CANDIDATE_NAME, flex: NUMBERMAP.ONE },
    { field: 'candidate_resource_requisition_id', headerName: CANDIDATE_EVALUATION_CONSTANTS.TABLE_HEADERS.RECRUITMENT_ID, flex: NUMBERMAP.ONE },
    { field: CANDIDATE_EVALUATION_CONSTANTS.TABLE_COLUMNS.INTERVIEW_DATE, headerName: CANDIDATE_EVALUATION_CONSTANTS.TABLE_HEADERS.INTERVIEW_DATE, flex: NUMBERMAP.ONE,   renderCell: (params: any) => {
        return params.row.date_of_interview ? formatDate(new Date(params.row.date_of_interview)): '';
      } },
    { field: CANDIDATE_EVALUATION_CONSTANTS.TABLE_COLUMNS.INTERVIEW_STATUS, headerName: CANDIDATE_EVALUATION_CONSTANTS.TABLE_HEADERS.INTERVIEW_STATUS, flex: NUMBERMAP.ONE },
    {
        field: "action",
        headerName: "View",
        flex: NUMBERMAP.HALF,
        renderCell: (params: any) =><Link href={`${pathName}/${params.row.candidate_id}`} style={UnderLine}>
        View Files
      </Link>
    },
  ];
  return (
    <PageContainer sx={{ paddingTop: NUMBERMAP.ZERO }}>
      <CommonSharedTale
        title={title}
        Table={
          <DataTable
            IdField="candidate_id"
            rows={rows}
            columns={columns}
          />
        }
      />
    </PageContainer>
  );
};

export default CandidateEvaluationTable; 