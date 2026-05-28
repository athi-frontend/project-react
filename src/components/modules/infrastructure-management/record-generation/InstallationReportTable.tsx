import React from "react";
import { useGetAllInfrastructureOnboarding } from "@/hooks/modules/infrastructure-management/infrastructureOnboardingTabs";
import { PageContainer, UnderLine } from '@/styles/common';
import CommonSharedTale from '@/components/shared/CommonPageTable';
import { DataTable } from '@/components/ui';
import { NUMBERMAP } from "@/constants/common";
import { TABLE_CONSTANTS } from "@/constants/modules/infrastructure-management/recordGeneration";
import Link from "next/link";

const InstallationReportTable: React.FC<{ title: string, pathName: string }> = ({ title, pathName }) => {
  const { data: infrastructureOnboardingResponse, isLoading } = useGetAllInfrastructureOnboarding();
  
  const columns = [
    {
      field: TABLE_CONSTANTS.COMMON.SNO_FIELD,
      headerName: TABLE_CONSTANTS.COMMON.SNO_HEADER,
      flex: NUMBERMAP.HALF,
      renderCell: (params: any) => params.api.getAllRowIds().indexOf(params.id) + NUMBERMAP.ONE,
    },
    {
      field: TABLE_CONSTANTS.INSTALLATION_REPORT.SERIAL_NO_FIELD,
      headerName: TABLE_CONSTANTS.INSTALLATION_REPORT.SERIAL_NO_HEADER,
      flex: NUMBERMAP.ONE_HALF,
      renderCell: (params: any) => {
        return params.row.infrastructure_serial_number ?? '-';
      }
    },
    {
      field: TABLE_CONSTANTS.INSTALLATION_REPORT.INFRASTRUCTURE_TYPE_FIELD,
      headerName: TABLE_CONSTANTS.INSTALLATION_REPORT.INFRASTRUCTURE_TYPE_HEADER,
      flex: NUMBERMAP.ONE_HALF,
      renderCell: (params: any) => {
        return params.row.infrastructure_type_name ?? '-';
      }
    },
    {
      field: TABLE_CONSTANTS.INSTALLATION_REPORT.INFRASTRUCTURE_NAME_FIELD,
      headerName: TABLE_CONSTANTS.INSTALLATION_REPORT.INFRASTRUCTURE_NAME_HEADER,
      flex: NUMBERMAP.ONE_HALF,
      renderCell: (params: any) => {
        return params.row.infrastructure_name ?? '-';
      }
    },
    {
      field: TABLE_CONSTANTS.COMMON.ACTION_FIELD,
      headerName: TABLE_CONSTANTS.COMMON.VIEW_HEADER,
      flex: NUMBERMAP.HALF,
      renderCell: (params: any) => (
        <Link href={`${pathName}/${params.row.infrastructure_id}`} style={UnderLine}>
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
            IdField={TABLE_CONSTANTS.INSTALLATION_REPORT.ID_FIELD}
            rows={infrastructureOnboardingResponse?.data ?? []}
            columns={columns}
            loading={isLoading}
          />
        }
      />
    </PageContainer>
  );
};

export default InstallationReportTable;

