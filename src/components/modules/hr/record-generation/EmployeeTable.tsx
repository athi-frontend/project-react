import React from "react";
import { useListWorkflowEmployes } from "@/hooks/modules/hr/useEmployeeList";
import { PageContainer, UnderLine } from '@/styles/common';
import CommonSharedTale from '@/components/shared/CommonPageTable';
import { DataTable } from '@/components/ui';
import { NUMBERMAP } from "@/constants/common";
import Link from "next/link";

const EmployeeTable: React.FC<{ title: string ,pathName:string}> = ({ title,pathName }) => {
  const { data: employeeResponse, refetch } = useListWorkflowEmployes(NUMBERMAP.ONE,'Approved');
  React.useEffect(() => { refetch(); }, [refetch]);
  const employeeList = React.useMemo(() => {
    if (!employeeResponse?.data) return [];
    return employeeResponse.data;
  }, [employeeResponse]);
  const columns = [
    {
      field: "sno",
      headerName: "S.No.",
      flex: NUMBERMAP.HALF,
  },
    {
      field: "employee_name",
      headerName: "Employee Name",
      flex: NUMBERMAP.ONE,
    },
    {
      field: "department_name",
      headerName: "Department",
      flex: NUMBERMAP.ONE,
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
        renderCell: (params: any) =><Link href={`${pathName}/${params.row.id}`} style={UnderLine}>
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
            IdField="id"
            rows={employeeList}
            columns={columns}
          />
        }
      />
    </PageContainer>
  );
};

export default EmployeeTable; 