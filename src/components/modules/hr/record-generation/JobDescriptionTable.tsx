import React from "react";
import { PageContainer, UnderLine } from '@/styles/common';
import CommonSharedTale from '@/components/shared/CommonPageTable';
import { DataTable } from '@/components/ui';
import { NUMBERMAP } from "@/constants/common";
import Link from "next/link";
import { useGetCompetencySkills } from "@/hooks/modules/hr/useRoleDefinition";

const JobDescriptionTable: React.FC<{ title: string, pathName: string }> = ({ title, pathName }) => {
  const { data: rolesResponse, refetch } = useGetCompetencySkills();
  React.useEffect(() => { refetch(); }, [refetch]);
  const rows = rolesResponse?.data ?? [];
  
  const columns = [
    {
      field: "sno",
      headerName: "S.No.",
      flex: NUMBERMAP.HALF,
     },
    {
      field: "role_name",
      headerName: "Role",
      flex: NUMBERMAP.ONE,
    },
    {
      field: "action",
      headerName: "View",
      flex: NUMBERMAP.HALF,
      renderCell: (params: any) => (
        <Link href={`${pathName}/${params.row.role_definition_id}`} style={UnderLine}>
          View Files
        </Link>
      ),
    },
  ];
  return (
    <PageContainer sx={{ paddingTop: NUMBERMAP.ZERO }}>
      <CommonSharedTale
        title={title}
        Table={
          <DataTable
            IdField="role_definition_id"
            rows={rows}
            columns={columns}
          />
        }
      />
    </PageContainer>
  );
};

export default JobDescriptionTable; 