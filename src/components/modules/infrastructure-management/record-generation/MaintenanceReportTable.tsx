import React from "react";
import { useGetMaintenanceReportList } from "@/hooks/modules/infrastructure-management/useMaintenanceReport";
import { PageContainer, UnderLine } from '@/styles/common';
import CommonSharedTale from '@/components/shared/CommonPageTable';
import { DataTable } from '@/components/ui';
import { NUMBERMAP } from "@/constants/common";
import { TABLE_CONSTANTS } from "@/constants/modules/infrastructure-management/recordGeneration";
import Link from "next/link";

const MaintenanceReportTable: React.FC<{ title: string, pathName: string }> = ({ title, pathName }) => {
  const { data: maintenanceReportResponse, isLoading } = useGetMaintenanceReportList();
  
  const columns = [
    {
      field: TABLE_CONSTANTS.COMMON.SNO_FIELD,
      headerName: TABLE_CONSTANTS.COMMON.SNO_HEADER,
      flex: NUMBERMAP.HALF,
      renderCell: (params: any) => params.api.getAllRowIds().indexOf(params.id) + NUMBERMAP.ONE,
    },
    {
      field: TABLE_CONSTANTS.MAINTENANCE_REPORT.REQUEST_NO_FIELD,
      headerName: TABLE_CONSTANTS.MAINTENANCE_REPORT.REQUEST_NO_HEADER,
      flex: NUMBERMAP.ONE_HALF,
      renderCell: (params: any) => {
        return params.row.maintenance_report_id ?? '-';
      }
    },
    {
      field: TABLE_CONSTANTS.MAINTENANCE_REPORT.INFRASTRUCTURE_TYPE_FIELD,
      headerName: TABLE_CONSTANTS.MAINTENANCE_REPORT.INFRASTRUCTURE_TYPE_HEADER,
      flex: NUMBERMAP.ONE_HALF,
      renderCell: (params: any) => {
        return params.row.infrastructure_type ?? '-';
      }
    },
    {
      field: TABLE_CONSTANTS.MAINTENANCE_REPORT.INFRASTRUCTURE_NAME_FIELD,
      headerName: TABLE_CONSTANTS.MAINTENANCE_REPORT.INFRASTRUCTURE_NAME_HEADER,
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
        <Link href={`${pathName}/${params.row.maintenance_report_id}`} style={UnderLine}>
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
            IdField={TABLE_CONSTANTS.MAINTENANCE_REPORT.ID_FIELD}
            rows={maintenanceReportResponse?.data ?? []}
            columns={columns}
            loading={isLoading}
          />
        }
      />
    </PageContainer>
  );
};

export default MaintenanceReportTable;

