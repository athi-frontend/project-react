"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { PageContainer } from "@/styles/modules/hr/employeeList";
import { DataTable, ActionButton, showActionAlert } from "@/components/ui";
import CommonSharedTale from "@/components/shared/CommonPageTable";
import { NUMBERMAP, STATUS } from "@/constants/common";
import StatusTypography from "@/components/ui/status/ToggleStatus";
import { useGetMaintenanceReportList, useDeleteMaintenanceReport } from "@/hooks/modules/infrastructure-management/useMaintenanceReport";
import { 
  EDIT_MAINTENANCE_REPORT_PATH, 
  CREATE_MAINTENANCE_REPORT_PATH,
  TABLE_FIELDS,
  TABLE_HEADERS,
  TABLE_ID_FIELD,
  TABLE_TITLE,
} from "@/constants/modules/infrastructure-management/maintenanceReport";
import { GridRenderCellParams } from "@mui/x-data-grid";
import { TableFilters } from "@/styles/components/ui/datatable";
import { formatDate } from "@/lib/utils/common";
 
/**
 * Classification : Confidential
 **/

const MaintenanceReportList: React.FC = () => {
  const router = useRouter();
  const { data: maintenanceReportResponse, isLoading } = useGetMaintenanceReportList();
  const deleteMaintenanceReportMutation = useDeleteMaintenanceReport();
  const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set());

  // Action handlers
  const handleEdit = (id: number) => {
    router.push(EDIT_MAINTENANCE_REPORT_PATH(id));
  };

  const handleDeleteSuccess = () => {
    showActionAlert(STATUS.SUCCESS);
  };

  const handleDeleteError = (maintenance_report_id: number) => {
    showActionAlert(STATUS.FAILED);
    // Re-enable delete icon on error
    const newSet = new Set(deletingIds);
    newSet.delete(maintenance_report_id);
    setDeletingIds(newSet);
  };

  const handleDelete = (maintenance_report_id: number) => {
    // Show confirmation dialog
    showActionAlert(STATUS.DELETE).then((result) => {
      if (!result.isConfirmed) return;
      
      // Disable delete icon after confirmation
      const newSet = new Set(deletingIds);
      newSet.add(maintenance_report_id);
      setDeletingIds(newSet);
      
      // Call delete API
      deleteMaintenanceReportMutation.mutate(maintenance_report_id, {
        onSuccess: handleDeleteSuccess,
        onError: () => handleDeleteError(maintenance_report_id),
      });
    });
  };

  // Column definitions for the table matching the design
  const columns = [
    {
      field: TABLE_FIELDS.SNO,
      headerName: TABLE_HEADERS.SNO,
      flex: NUMBERMAP.HALF,
    },
    {
      field: TABLE_FIELDS.INFRA_CATEGORY,
      headerName: TABLE_HEADERS.INFRA_CATEGORY,
      flex: NUMBERMAP.ONE_HALF,
    },
    {
      field: TABLE_FIELDS.INFRA_TYPE,
      headerName: TABLE_HEADERS.INFRA_TYPE,
      flex: NUMBERMAP.ONE_HALF,
    },
    {
      field: TABLE_FIELDS.INFRA_NAME,
      headerName: TABLE_HEADERS.INFRA_NAME,
      flex: NUMBERMAP.ONE_HALF,
    },
    {
      field: TABLE_FIELDS.INFRA_SERIAL_NO,
      headerName: TABLE_HEADERS.INFRA_SERIAL_NO,
      flex: NUMBERMAP.ONE_HALF,
    },
    {
      field: TABLE_FIELDS.INSPECTED_ON,
      headerName: TABLE_HEADERS.INSPECTED_ON,
      flex: NUMBERMAP.ONE_HALF,
      renderCell: (params: GridRenderCellParams) => {
        return formatDate(params.value);
      },
    },
    {
      field: TableFilters.statusColumn,
      headerName: TABLE_HEADERS.STATUS,
      flex: NUMBERMAP.ONE,
      renderCell: (params: GridRenderCellParams) => {
        const statusValue = parseInt(params.row.status_id, NUMBERMAP.TEN) ?? NUMBERMAP.ZERO;
        return <StatusTypography value={statusValue} />;
      },
    },
    {
      field: TABLE_FIELDS.ACTION,
      headerName: TABLE_HEADERS.ACTION,
      flex: NUMBERMAP.ONE,
      renderCell: (params: GridRenderCellParams) => {
        // Use maintenance_report_id if available, otherwise use infrastructure_id
        // Based on API pattern, infrastructure_id may be used as maintenance_report_id
        const maintenanceReportId = params.row.maintenance_report_id ?? params.row.infrastructure_id;
        const isDisabled = params.row.status_id != NUMBERMAP.ONE;
        
        return (
          <ActionButton
            onDelete={() => handleDelete(maintenanceReportId)}
            onEdit={() => handleEdit(params.row.infrastructure_id)}
            deleteDisabled={isDisabled}
          />
        );
      },
    },
  ];

  return (
    <PageContainer>
      <CommonSharedTale
        pathName={CREATE_MAINTENANCE_REPORT_PATH}
        title={TABLE_TITLE}
        hanldeClick={() => router.push(CREATE_MAINTENANCE_REPORT_PATH)}
        Table={
          <DataTable
            rows={maintenanceReportResponse?.data ?? []}
            columns={columns}
            IdField={TABLE_ID_FIELD}
            loading={isLoading}
          />
        }
      />
    </PageContainer>
  );
};

export default MaintenanceReportList;

