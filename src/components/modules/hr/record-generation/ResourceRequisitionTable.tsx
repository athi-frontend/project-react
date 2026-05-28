import React from "react";
import { useRecruitments } from "@/hooks/modules/hr/useResourceRequistion";
import { COLUMFIELDCONFIG } from "@/constants/modules/hr/resourceRequisition";
import { PageContainer, UnderLine } from '@/styles/common';
import CommonSharedTale from '@/components/shared/CommonPageTable';
import { DataTable } from '@/components/ui';
import { NUMBERMAP } from "@/constants/common";
import Link from "next/link";

const ResourceRequisitionTable: React.FC<{ title: string,pathName:string }> = ({ title,pathName }) => {
  const { data: recruitmentData, refetch } = useRecruitments(NUMBERMAP.ONE,'Approved');
  React.useEffect(() => { refetch(); }, [refetch]);
  const rows = recruitmentData?.data ?? [];
  const columns = [
    { field: 'sno', headerName: 'S.No', flex: NUMBERMAP.ONE },
    { field: 'resource_requisition_id', headerName: 'Resource Requisition ID', flex: NUMBERMAP.ONE },
    { field: COLUMFIELDCONFIG.ROLE.FIELD, headerName: COLUMFIELDCONFIG.ROLE.HEADERNAME, flex: NUMBERMAP.ONE },
    { field: COLUMFIELDCONFIG.DEPARTMENT.FIELD, headerName: COLUMFIELDCONFIG.DEPARTMENT.HEADERNAME, flex: NUMBERMAP.THREE_QUARTER },
    {
        field: "action",
        headerName: "View",
        flex: NUMBERMAP.HALF,
        renderCell: (params: any) =><Link href={`${pathName}/${params.row.resource_requisition_id}`} style={UnderLine}>
        View Files
      </Link>
    }
  ];
  return (
    <PageContainer sx={{ paddingTop: NUMBERMAP.ZERO }}>
      <CommonSharedTale
        title={title}
        Table={
          <DataTable
            IdField="resource_requisition_id"
            rows={rows}
            columns={columns}
          />
        }
      />
    </PageContainer>
  );
};

export default ResourceRequisitionTable; 